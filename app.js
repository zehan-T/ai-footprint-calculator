const enterButton = document.querySelector("#enter-button");
const status = document.querySelector("#status");

enterButton.addEventListener("click", () => {
  status.textContent = "Preview interaction is working.";
});
