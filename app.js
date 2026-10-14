const enterButton = document.querySelector("#enter-button");
const startScreen = document.querySelector("#start-screen");
const sceneHud = document.querySelector("#scene-hud");
const hudHint = document.querySelector("#hud-hint");
const sceneCaption = document.querySelector("#scene-caption");
const captionCopy = document.querySelector("#caption-copy");
const interactionLayer = document.querySelector("#interaction-layer");
const boothButton = document.querySelector(".scene-target--booth");
const boothStory = document.querySelector("#story-effects");
const clueMeter = document.querySelector("#booth-clue-meter");
const clueMeterCopy = document.querySelector("#clue-meter-copy");
const clueMarkers = [...clueMeter.querySelectorAll(".clue-dot")];
const experience = document.querySelector(".experience");
const pauseButton = document.querySelector("#pause-button");
const pauseIcon = pauseButton.querySelector(".pause-icon");
const ambientAudio = document.querySelector("#ambient-audio");
const musicAudio = document.querySelector("#music-audio");
const ticketAudio = document.querySelector("#ticket-audio");
const chimeAudio = document.querySelector("#chime-audio");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let experienceStarted = false;
let experiencePaused = false;
let boothProgress = 0;
let boothStoryPlaying = false;
let boothStoryCompleted = false;
let hintTimersStarted = false;

const unavailableAudio = new Set();
const scheduledTimers = new Set();
const pausedStoryAudio = new Set();
const audioTracks = [
  { element: ambientAudio, volume: 0.18 },
  { element: musicAudio, volume: 0.13 }
];
const storyAudioTracks = [ticketAudio, chimeAudio];

audioTracks.forEach(({ element, volume }) => {
  element.volume = volume;
});
ticketAudio.volume = 0.42;
chimeAudio.volume = 0.32;

class PausableTimer {
  constructor(callback, delay) {
    this.callback = callback;
    this.remaining = delay;
    this.startedAt = 0;
    this.timeoutId = null;
    this.finished = false;
  }

  start() {
    if (this.finished || this.timeoutId !== null) return;
    this.startedAt = performance.now();
    this.timeoutId = window.setTimeout(() => {
      this.timeoutId = null;
      this.finished = true;
      scheduledTimers.delete(this);
      this.callback();
    }, Math.max(0, this.remaining));
  }

  pause() {
    if (this.finished || this.timeoutId === null) return;
    window.clearTimeout(this.timeoutId);
    this.timeoutId = null;
    this.remaining = Math.max(0, this.remaining - (performance.now() - this.startedAt));
  }

  cancel() {
    if (this.timeoutId !== null) window.clearTimeout(this.timeoutId);
    this.timeoutId = null;
    this.finished = true;
    scheduledTimers.delete(this);
  }
}

function scheduleEvent(callback, delay) {
  const timer = new PausableTimer(callback, delay);
  scheduledTimers.add(timer);
  if (!experiencePaused) timer.start();
  return timer;
}

function updateMotionPreference() {
  experience.classList.toggle("prefers-reduced-motion", reducedMotion.matches);
}

function setCaption(message) {
  captionCopy.textContent = message;
}

function reportAudioFailure(audio) {
  unavailableAudio.add(audio);

  if (unavailableAudio.size === audioTracks.length) {
    setCaption("The midway is quiet tonight. You can still explore the lights.");
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

function playStoryAudio(audio) {
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function pauseStoryAudio() {
  storyAudioTracks.forEach((audio) => {
    if (!audio.paused && !audio.ended) {
      pausedStoryAudio.add(audio);
      audio.pause();
    }
  });
}

function resumeStoryAudio() {
  const tracksToResume = [...pausedStoryAudio];
  pausedStoryAudio.clear();
  tracksToResume.forEach((audio) => audio.play().catch(() => {}));
}

function pauseScheduledEvents() {
  scheduledTimers.forEach((timer) => timer.pause());
}

function resumeScheduledEvents() {
  scheduledTimers.forEach((timer) => timer.start());
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
    pauseStoryAudio();
    pauseScheduledEvents();
  } else {
    playAmbientAudio();
    resumeStoryAudio();
    resumeScheduledEvents();
  }

  document.dispatchEvent(new CustomEvent("experiencepausechange", {
    detail: { paused }
  }));
}

function updateBoothProgress() {
  clueMeter.classList.remove("is-hidden");
  clueMarkers.forEach((marker, index) => {
    marker.classList.toggle("is-found", index < boothProgress);
  });
  clueMeter.setAttribute("aria-label", `Ticket booth clue progress: ${boothProgress} of 3`);
  clueMeterCopy.textContent = `${boothProgress} of 3 tickets found`;
  boothButton.setAttribute("aria-label", `Old ticket booth, ${boothProgress} of 3 tickets found`);
}

function pulseBoothTarget() {
  boothButton.classList.remove("is-tapped");
  void boothButton.offsetWidth;
  boothButton.classList.add("is-tapped");
  scheduleEvent(() => boothButton.classList.remove("is-tapped"), 560);
}

function resetStoryAudio() {
  pausedStoryAudio.clear();
  storyAudioTracks.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
}

function finishBoothStory() {
  boothStoryPlaying = false;
  boothStoryCompleted = true;
  boothProgress = 0;
  experience.classList.remove("is-story-playing");
  interactionLayer.classList.remove("is-locked");
  boothStory.setAttribute("aria-hidden", "true");
  boothButton.disabled = false;
  boothButton.tabIndex = 0;
  boothButton.setAttribute("aria-label", "Old ticket booth, ready to replay");
  clueMarkers.forEach((marker) => marker.classList.remove("is-found"));
  clueMeter.classList.add("is-hidden");
  clueMeter.setAttribute("aria-label", "Ticket booth clue progress: 0 of 3");
  clueMeterCopy.textContent = "0 of 3 tickets found";
  hudHint.textContent = "Two surprises are still waiting";
  setCaption("The moonlight pass is yours. The old booth can replay its secret.");
  audioTracks.forEach(({ element, volume }) => {
    element.volume = volume;
  });
  resetStoryAudio();
  boothButton.focus({ preventScroll: true });
}

function startBoothStory() {
  boothStoryPlaying = true;
  experience.classList.add("is-story-playing");
  interactionLayer.classList.add("is-locked");
  boothStory.setAttribute("aria-hidden", "false");
  boothButton.disabled = true;
  hudHint.textContent = "The ticket booth remembers";
  setCaption("Three tickets found. The old booth is waking...");

  audioTracks.forEach(({ element, volume }) => {
    element.volume = volume * 0.55;
  });

  scheduleEvent(() => {
    playStoryAudio(chimeAudio);
    setCaption("Golden tickets circle the midway like autumn leaves.");
  }, 900);
  scheduleEvent(() => {
    setCaption("A moonlight pass appears where the tickets meet.");
  }, 2900);
  scheduleEvent(() => {
    setCaption("The pass glows once, then slips back into the night.");
  }, 5400);
  scheduleEvent(finishBoothStory, 7200);
}

function handleBoothDiscovery() {
  if (!experienceStarted || experiencePaused || boothStoryPlaying) return;

  boothProgress += 1;
  pulseBoothTarget();
  updateBoothProgress();
  playStoryAudio(ticketAudio);

  if (boothProgress === 1) {
    hudHint.textContent = "The booth kept your first ticket";
    setCaption("A paper ticket rustles behind the glass. 1 of 3 found.");
  } else if (boothProgress === 2) {
    hudHint.textContent = "One more ticket may wake the booth";
    setCaption("Another ticket answers with a tiny stamp. 2 of 3 found.");
  } else {
    startBoothStory();
  }
}

function scheduleBoothHints() {
  if (hintTimersStarted) return;
  hintTimersStarted = true;

  scheduleEvent(() => {
    if (boothProgress === 0 && !boothStoryPlaying && !boothStoryCompleted) {
      hudHint.textContent = "A loose ticket trembles behind old glass";
      setCaption("Something papery stirs near the left side of the midway.");
    }
  }, 7000);

  scheduleEvent(() => {
    if (boothProgress === 0 && !boothStoryPlaying && !boothStoryCompleted) {
      hudHint.textContent = "The ticket booth may answer a curious tap";
      setCaption("The smallest window seems to be waiting for you.");
    }
  }, 15000);
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
  interactionLayer.setAttribute("aria-hidden", "false");
  boothButton.tabIndex = 0;
  pauseButton.disabled = false;
  setExperiencePaused(false);
  scheduleBoothHints();
});

pauseButton.addEventListener("click", () => {
  setExperiencePaused(!experiencePaused);
});

boothButton.addEventListener("click", handleBoothDiscovery);
