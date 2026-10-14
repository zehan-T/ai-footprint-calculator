param(
  [int]$Port = 4174,
  [string]$DisplayHost = "localhost"
)

$ErrorActionPreference = "Stop"
$root = [System.IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot))
$rootPrefix = $root.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
$listener.Start()

Write-Host "LAN preview running at http://${DisplayHost}:$Port/"

function Get-ContentType([string]$Path) {
  switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant()) {
    ".html" { "text/html; charset=utf-8" }
    ".css" { "text/css; charset=utf-8" }
    ".js" { "text/javascript; charset=utf-8" }
    ".svg" { "image/svg+xml" }
    ".png" { "image/png" }
    ".jpg" { "image/jpeg" }
    ".jpeg" { "image/jpeg" }
    ".mp3" { "audio/mpeg" }
    ".ogg" { "audio/ogg" }
    ".wav" { "audio/wav" }
    default { "application/octet-stream" }
  }
}

function Write-ResponseHeader(
  [System.IO.Stream]$Stream,
  [int]$StatusCode,
  [string]$StatusText,
  [string]$ContentType,
  [long]$ContentLength,
  [string[]]$ExtraHeaders = @()
) {
  $headerLines = @(
    "HTTP/1.1 $StatusCode $StatusText"
    "Content-Type: $ContentType"
    "Content-Length: $ContentLength"
    "Connection: close"
  ) + $ExtraHeaders + @("", "")
  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes(($headerLines -join "`r`n"))
  $Stream.Write($headerBytes, 0, $headerBytes.Length)
}

try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $stream = $client.GetStream()
      $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
      $requestLine = $reader.ReadLine()
      if ([string]::IsNullOrWhiteSpace($requestLine)) { continue }

      $parts = $requestLine.Split(" ")
      $method = $parts[0]
      $requestTarget = $parts[1]
      $rangeHeader = $null

      while ($true) {
        $headerLine = $reader.ReadLine()
        if ([string]::IsNullOrEmpty($headerLine)) { break }
        if ($headerLine.StartsWith("Range:", [System.StringComparison]::OrdinalIgnoreCase)) {
          $rangeHeader = $headerLine.Substring(6).Trim()
        }
      }

      if ($method -notin @("GET", "HEAD")) {
        Write-ResponseHeader $stream 405 "Method Not Allowed" "text/plain; charset=utf-8" 0
        continue
      }

      $urlPath = [System.Uri]::UnescapeDataString(($requestTarget.Split("?")[0])).TrimStart("/")
      if ([string]::IsNullOrWhiteSpace($urlPath)) { $urlPath = "index.html" }
      $requestedPath = [System.IO.Path]::GetFullPath((Join-Path $root $urlPath))

      if (-not $requestedPath.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path -LiteralPath $requestedPath -PathType Leaf)) {
        $notFound = [System.Text.Encoding]::UTF8.GetBytes("Not found")
        Write-ResponseHeader $stream 404 "Not Found" "text/plain; charset=utf-8" $notFound.Length
        if ($method -ne "HEAD") { $stream.Write($notFound, 0, $notFound.Length) }
        continue
      }

      $file = [System.IO.FileInfo]::new($requestedPath)
      $start = 0L
      $end = $file.Length - 1
      $statusCode = 200
      $statusText = "OK"
      $extraHeaders = @("Accept-Ranges: bytes")

      if ($rangeHeader -match '^bytes=(\d*)-(\d*)$') {
        if ($Matches[1]) { $start = [long]$Matches[1] }
        if ($Matches[2]) { $end = [Math]::Min([long]$Matches[2], $file.Length - 1) }
        if (-not $Matches[1] -and $Matches[2]) {
          $suffixLength = [Math]::Min([long]$Matches[2], $file.Length)
          $start = $file.Length - $suffixLength
          $end = $file.Length - 1
        }

        if ($start -gt $end -or $start -ge $file.Length) {
          Write-ResponseHeader $stream 416 "Range Not Satisfiable" "text/plain; charset=utf-8" 0 @("Content-Range: bytes */$($file.Length)")
          continue
        }

        $statusCode = 206
        $statusText = "Partial Content"
        $extraHeaders += "Content-Range: bytes $start-$end/$($file.Length)"
      }

      $contentLength = $end - $start + 1
      Write-ResponseHeader $stream $statusCode $statusText (Get-ContentType $requestedPath) $contentLength $extraHeaders

      if ($method -ne "HEAD") {
        $fileStream = [System.IO.File]::OpenRead($requestedPath)
        try {
          $fileStream.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
          $buffer = New-Object byte[] 65536
          $remaining = $contentLength
          while ($remaining -gt 0) {
            $read = $fileStream.Read($buffer, 0, [Math]::Min($buffer.Length, $remaining))
            if ($read -le 0) { break }
            $stream.Write($buffer, 0, $read)
            $remaining -= $read
          }
        } finally {
          $fileStream.Dispose()
        }
      }
    } catch {
      Write-Warning $_.Exception.Message
    } finally {
      $client.Dispose()
    }
  }
} finally {
  $listener.Stop()
}
