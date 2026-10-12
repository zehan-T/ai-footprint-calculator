const enterButton = document.querySelector("#enter-button");
const startScreen = document.querySelector("#start-screen");
const sceneHud = document.querySelector("#scene-hud");
const sceneCaption = document.querySelector("#scene-caption");
const interactionLayer = document.querySelector("#interaction-layer");
const experience = document.querySelector(".experience");
const pauseButton = document.querySelector("#pause-button");
const pauseIcon = pauseButton.querySelector(".pause-icon");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let experienceStarted = false;
let experiencePaused = false;

function updateMotionPreference() {
  experience.classList.toggle("prefers-reduced-motion", reducedMotion.matches);
}

function setExperiencePaused(paused) {
  if (!experienceStarted) return;

  experiencePaused = paused;
  experience.classList.toggle("is-paused", paused);
  pauseButton.setAttribute("aria-pressed", String(paused));
  pauseButton.setAttribute("aria-label", paused ? "Resume experience" : "Pause experience");
  pauseIcon.textContent = paused ? "▶" : "Ⅱ";

  document.dispatchEvent(new CustomEvent("experiencepausechange", {
    detail: { paused }
  }));
}

updateMotionPreference();
reducedMotion.addEventListener("change", updateMotionPreference);

enterButton.addEventListener("click", () => {
  experienceStarted = true;
  experience.classList.add("is-started");
  startScreen.classList.add("is-exiting");
  sceneHud.classList.remove("is-hidden");
  sceneCaption.classList.remove("is-hidden");
  interactionLayer.classList.remove("is-hidden");
  pauseButton.disabled = false;
  setExperiencePaused(false);
});

pauseButton.addEventListener("click", () => {
  setExperiencePaused(!experiencePaused);
});
