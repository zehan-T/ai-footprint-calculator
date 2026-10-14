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
const musicAudio = document.querySelector("#music-audio");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let experienceStarted = false;
let experiencePaused = false;
const unavailableAudio = new Set();
const audioTracks = [
  { element: ambientAudio, volume: 0.14 },
  { element: musicAudio, volume: 0.09 }
];

audioTracks.forEach(({ element, volume }) => {
  element.volume = volume;
});

function updateMotionPreference() {
  experience.classList.toggle("prefers-reduced-motion", reducedMotion.matches);
}

function reportAudioFailure(audio) {
  unavailableAudio.add(audio);

  if (unavailableAudio.size === audioTracks.length) {
    captionCopy.textContent = "The midway is quiet tonight. You can still explore the lights.";
  }
}

async function playAudioTrack(audio) {
  if (!experienceStarted || experiencePaused || unavailableAudio.has(audio)) return;

  try {
    await audio.play();
  } catch (error) {
    reportAudioFailure(audio);
  }
}

function playAmbientAudio() {
  audioTracks.forEach(({ element }) => playAudioTrack(element));
}

function setExperiencePaused(paused) {
  if (!experienceStarted) return;

  experiencePaused = paused;
  experience.classList.toggle("is-paused", paused);
  pauseButton.setAttribute("aria-pressed", String(paused));
  pauseButton.setAttribute("aria-label", paused ? "Resume experience" : "Pause experience");
  pauseIcon.textContent = paused ? "▶" : "Ⅱ";

  if (paused) {
    audioTracks.forEach(({ element }) => element.pause());
  } else {
    playAmbientAudio();
  }

  document.dispatchEvent(new CustomEvent("experiencepausechange", {
    detail: { paused }
  }));
}

updateMotionPreference();
reducedMotion.addEventListener("change", updateMotionPreference);
audioTracks.forEach(({ element }) => {
  element.addEventListener("error", () => reportAudioFailure(element));
});

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
