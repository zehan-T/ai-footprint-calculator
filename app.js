const enterButton = document.querySelector("#enter-button");
const startScreen = document.querySelector("#start-screen");
const sceneHud = document.querySelector("#scene-hud");
const sceneCaption = document.querySelector("#scene-caption");
const interactionLayer = document.querySelector("#interaction-layer");

enterButton.addEventListener("click", () => {
  startScreen.classList.add("is-exiting");
  sceneHud.classList.remove("is-hidden");
  sceneCaption.classList.remove("is-hidden");
  interactionLayer.classList.remove("is-hidden");
});
