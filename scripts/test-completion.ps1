param(
  [string]$Url = "http://localhost:4173/",
  [int]$DebugPort = 9333
)

$ErrorActionPreference = "Stop"

$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path -LiteralPath $chrome)) {
  throw "Google Chrome was not found at the expected path."
}

$profile = Join-Path ([System.IO.Path]::GetTempPath()) ("midway-test-" + [guid]::NewGuid().ToString("N"))
$browser = $null
$socket = $null

function Invoke-Cdp {
  param(
    [int]$Id,
    [string]$Method,
    [hashtable]$Params = @{}
  )

  $payload = @{ id = $Id; method = $Method; params = $Params } | ConvertTo-Json -Depth 12 -Compress
  $bytes = [Text.Encoding]::UTF8.GetBytes($payload)
  $segment = [ArraySegment[byte]]::new($bytes)
  $socket.SendAsync($segment, [Net.WebSockets.WebSocketMessageType]::Text, $true, [Threading.CancellationToken]::None).GetAwaiter().GetResult()

  do {
    $buffer = New-Object byte[] 1048576
    $received = $socket.ReceiveAsync([ArraySegment[byte]]::new($buffer), [Threading.CancellationToken]::None).GetAwaiter().GetResult()
    $message = [Text.Encoding]::UTF8.GetString($buffer, 0, $received.Count) | ConvertFrom-Json
  } until ($message.id -eq $Id)

  return $message
}

try {
  $arguments = @(
    "--headless=new",
    "--disable-gpu",
    "--remote-debugging-port=$DebugPort",
    "--user-data-dir=$profile",
    $Url
  )
  $browser = Start-Process -FilePath $chrome -ArgumentList $arguments -WindowStyle Hidden -PassThru

  $target = $null
  for ($attempt = 0; $attempt -lt 20; $attempt += 1) {
    try {
      $targets = Invoke-RestMethod "http://127.0.0.1:$DebugPort/json/list"
      $target = @($targets) |
        ForEach-Object { $_ } |
        Where-Object { $_.type -eq "page" } |
        Select-Object -First 1
      if ($target) { break }
    } catch {
      Start-Sleep -Milliseconds 250
    }
  }
  if (-not $target) { throw "Chrome DevTools page target did not start." }

  $socket = [Net.WebSockets.ClientWebSocket]::new()
  $socket.ConnectAsync([Uri]$target.webSocketDebuggerUrl, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
  Start-Sleep -Milliseconds 600

  $showExpression = @'
(() => {
  enterButton.click();
  completedStories.add("booth");
  completedStories.add("carousel");
  completedStories.add("lamp");
  const shown = showCompletionEnding();
  return JSON.stringify({
    shown,
    hidden: completionEnding.hidden,
    visible: completionEnding.classList.contains("is-visible"),
    ariaHidden: completionEnding.getAttribute("aria-hidden"),
    targetLocked: interactionLayer.classList.contains("is-locked"),
    focusedControl: document.activeElement.id,
    title: document.querySelector("#completion-title").textContent,
    badgeCount: document.querySelectorAll(".completion-badges li").length
  });
})()
'@
  $show = Invoke-Cdp -Id 1 -Method "Runtime.evaluate" -Params @{ expression = $showExpression; returnByValue = $true }
  if ($show.result.exceptionDetails) { throw $show.result.exceptionDetails.text }
  Write-Output ("completion_test=" + $show.result.result.value)

  $pauseExpression = 'setExperiencePaused(true); JSON.stringify({paused: experiencePaused, haloState: getComputedStyle(document.querySelector(".completion-halo")).animationPlayState, pauseLabel: pauseButton.getAttribute("aria-label")})'
  $pause = Invoke-Cdp -Id 2 -Method "Runtime.evaluate" -Params @{ expression = $pauseExpression; returnByValue = $true }
  Write-Output ("pause_test=" + $pause.result.result.value)

  $closeExpression = 'setExperiencePaused(false); closeCompletionEnding(); JSON.stringify({ariaHidden: completionEnding.getAttribute("aria-hidden"), targetLocked: interactionLayer.classList.contains("is-locked"), focusedControl: document.activeElement.className, shownOnce: completionEndingShown})'
  $close = Invoke-Cdp -Id 3 -Method "Runtime.evaluate" -Params @{ expression = $closeExpression; returnByValue = $true }
  Write-Output ("close_test=" + $close.result.result.value)
} finally {
  if ($socket) { $socket.Dispose() }
  if ($browser -and -not $browser.HasExited) { Stop-Process -Id $browser.Id -Force }
  Start-Sleep -Milliseconds 600
  if (Test-Path -LiteralPath $profile) {
    $resolvedProfile = [IO.Path]::GetFullPath($profile)
    $resolvedTemp = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
    if ($resolvedProfile.StartsWith($resolvedTemp, [StringComparison]::OrdinalIgnoreCase)) {
      Remove-Item -LiteralPath $resolvedProfile -Recurse -Force
    }
  }
}
