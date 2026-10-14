const enterButton = document.querySelector("#enter-button");
const startScreen = document.querySelector("#start-screen");
const sceneHud = document.querySelector("#scene-hud");
const sceneCaption = document.querySelector("#scene-caption");
const captionCopy = document.querySelector("#caption-copy");
const interactionLayer = document.querySelector("#interaction-layer");
const experience = document.querySelector(".experience");
const pauseButton = document.querySelector("#pause-button");
const pauseIcon = pauseButton.querySelector(".pause-icon");
const ambientAudio = document.querySelector("#ambient-audio");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let experienceStarted = false;
let experiencePaused = false;
let audioUnavailable = false;

ambientAudio.volume = 0.18;

function updateMotionPreference() {
  experience.classList.toggle("prefers-reduced-motion", reducedMotion.matches);
}

function reportAudioFailure() {
  if (audioUnavailable) return;

  audioUnavailable = true;
  captionCopy.textContent = "The midway is quiet tonight. You can still explore the lights.";
}

async function playAmbientAudio() {
  if (!experienceStarted || experiencePaused || audioUnavailable) return;

  try {
    await ambientAudio.play();
  } catch (error) {
    reportAudioFailure();
  }
}

function setExperiencePaused(paused) {
  if (!experienceStarted) return;

  experiencePaused = paused;
  experience.classList.toggle("is-paused", paused);
  pauseButton.setAttribute("aria-pressed", String(paused));
  pauseButton.setAttribute("aria-label", paused ? "Resume experience" : "Pause experience");
  pauseIcon.textContent = paused ? "▶" : "Ⅱ";

  if (paused) {
    ambientAudio.pause();
  } else {
    playAmbientAudio();
  }

  document.dispatchEvent(new CustomEvent("experiencepausechange", {
    detail: { paused }
  }));
}

updateMotionPreference();
reducedMotion.addEventListener("change", updateMotionPreference);
ambientAudio.addEventListener("error", reportAudioFailure);

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
