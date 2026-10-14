const enterButton = document.querySelector("#enter-button");
const startScreen = document.querySelector("#start-screen");
const sceneHud = document.querySelector("#scene-hud");
const hudHint = document.querySelector("#hud-hint");
const sceneCaption = document.querySelector("#scene-caption");
const captionCopy = document.querySelector("#caption-copy");
const interactionLayer = document.querySelector("#interaction-layer");
const boothButton = document.querySelector(".scene-target--booth");
const carouselButtons = [...document.querySelectorAll(".carousel-horse")];
const crowButton = document.querySelector(".scene-target--crow");
const boothStory = document.querySelector("#story-effects");
const clueMeter = document.querySelector("#booth-clue-meter");
const clueMeterCopy = document.querySelector("#clue-meter-copy");
const clueMarkers = [...clueMeter.querySelectorAll(".clue-dot")];
const carouselClueMeter = document.querySelector("#carousel-clue-meter");
const carouselClueCopy = document.querySelector("#carousel-clue-copy");
const carouselClueMarkers = [...carouselClueMeter.querySelectorAll(".carousel-clue-dot")];
const experience = document.querySelector(".experience");
const pauseButton = document.querySelector("#pause-button");
const pauseIcon = pauseButton.querySelector(".pause-icon");
const ambientAudio = document.querySelector("#ambient-audio");
const musicAudio = document.querySelector("#music-audio");
const ticketAudio = document.querySelector("#ticket-audio");
const chimeAudio = document.querySelector("#chime-audio");
const windUpAudio = document.querySelector("#wind-up-audio");
const gallopAudio = document.querySelector("#gallop-audio");
const crowAudio = document.querySelector("#crow-audio");
const wingsAudio = document.querySelector("#wings-audio");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let experienceStarted = false;
let experiencePaused = false;
let boothProgress = 0;
let boothStoryPlaying = false;
let boothStoryCompleted = false;
let hintTimersStarted = false;
let carouselStoryPlaying = false;
let carouselStoryCompleted = false;
let carouselHintTimersStarted = false;
let lampStoryPlaying = false;
let lampStoryCompleted = false;
let lampHintTimersStarted = false;
const foundCarouselHorses = new Set();
const completedStories = new Set();

const unavailableAudio = new Set();
const scheduledTimers = new Set();
const pausedStoryAudio = new Set();
const audioTracks = [
  { element: ambientAudio, volume: 0.18 },
  { element: musicAudio, volume: 0.13 }
];
const storyAudioTracks = [
  ticketAudio,
  chimeAudio,
  windUpAudio,
  gallopAudio,
  crowAudio,
  wingsAudio
];

audioTracks.forEach(({ element, volume }) => {
  element.volume = volume;
});
ticketAudio.volume = 0.42;
chimeAudio.volume = 0.32;
windUpAudio.volume = 0.42;
gallopAudio.volume = 0.28;
crowAudio.volume = 0.38;
wingsAudio.volume = 0.3;

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

function isAnyStoryPlaying() {
  return boothStoryPlaying || carouselStoryPlaying || lampStoryPlaying;
}

function updateHudStoryCount() {
  const remaining = 3 - completedStories.size;
  if (remaining === 0) {
    hudHint.textContent = "Every midway secret is awake";
  } else if (remaining === 1) {
    hudHint.textContent = "One surprise is still waiting";
  } else {
    hudHint.textContent = `${remaining} surprises are still waiting`;
  }
}

function setSceneInteractionsLocked(locked) {
  interactionLayer.classList.toggle("is-locked", locked);
  boothButton.disabled = locked;
  carouselButtons.forEach((button) => {
    button.disabled = locked || foundCarouselHorses.has(button.dataset.carouselHorse);
  });
  crowButton.disabled = locked;
}

function duckAmbientAudio(ducked) {
  audioTracks.forEach(({ element, volume }) => {
    element.volume = ducked ? volume * 0.55 : volume;
  });
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
  completedStories.add("booth");
  boothProgress = 0;
  experience.classList.remove("is-story-playing");
  boothStory.setAttribute("aria-hidden", "true");
  setSceneInteractionsLocked(false);
  boothButton.tabIndex = 0;
  boothButton.setAttribute("aria-label", "Old ticket booth, ready to replay");
  clueMarkers.forEach((marker) => marker.classList.remove("is-found"));
  clueMeter.classList.add("is-hidden");
  clueMeter.setAttribute("aria-label", "Ticket booth clue progress: 0 of 3");
  clueMeterCopy.textContent = "0 of 3 tickets found";
  updateHudStoryCount();
  setCaption("The moonlight pass is yours. The old booth can replay its secret.");
  duckAmbientAudio(false);
  resetStoryAudio();
  boothButton.focus({ preventScroll: true });
}

function startBoothStory() {
  boothStoryPlaying = true;
  experience.classList.add("is-story-playing");
  boothStory.setAttribute("aria-hidden", "false");
  setSceneInteractionsLocked(true);
  hudHint.textContent = "The ticket booth remembers";
  setCaption("Three tickets found. The old booth is waking...");

  duckAmbientAudio(true);

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
  if (!experienceStarted || experiencePaused || isAnyStoryPlaying()) return;

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

function updateCarouselProgress() {
  const progress = foundCarouselHorses.size;
  carouselClueMeter.classList.remove("is-hidden");
  carouselClueMarkers.forEach((marker, index) => {
    marker.classList.toggle("is-found", index < progress);
  });
  carouselClueMeter.setAttribute("aria-label", `Carousel clue progress: ${progress} of 3`);
  carouselClueCopy.textContent = `${progress} of 3 carousel horses found`;
}

function resetCarouselProgress() {
  foundCarouselHorses.clear();
  carouselButtons.forEach((button) => {
    const horseName = button.dataset.carouselHorse;
    button.classList.remove("is-found");
    button.setAttribute("aria-label", `${horseName[0].toUpperCase()}${horseName.slice(1)} carousel horse, not found`);
  });
  carouselClueMarkers.forEach((marker) => marker.classList.remove("is-found"));
  carouselClueMeter.classList.add("is-hidden");
  carouselClueMeter.setAttribute("aria-label", "Carousel clue progress: 0 of 3");
  carouselClueCopy.textContent = "0 of 3 carousel horses found";
}

function finishCarouselStory() {
  carouselStoryPlaying = false;
  carouselStoryCompleted = true;
  completedStories.add("carousel");
  experience.classList.remove("is-carousel-story-playing");
  boothStory.setAttribute("aria-hidden", "true");
  resetCarouselProgress();
  setSceneInteractionsLocked(false);
  carouselButtons.forEach((button) => {
    button.tabIndex = 0;
  });
  updateHudStoryCount();
  setCaption("The midnight ride returns to stillness, ready to run again.");
  duckAmbientAudio(false);
  resetStoryAudio();
  carouselButtons[1].focus({ preventScroll: true });
}

function startCarouselStory() {
  carouselStoryPlaying = true;
  experience.classList.add("is-carousel-story-playing");
  boothStory.setAttribute("aria-hidden", "false");
  setSceneInteractionsLocked(true);
  hudHint.textContent = "The painted horses remember the route";
  setCaption("Three horses found. The old carousel begins to turn...");
  duckAmbientAudio(true);

  scheduleEvent(() => {
    playStoryAudio(gallopAudio);
    setCaption("Golden hoofbeats circle beneath the moon.");
  }, 650);
  scheduleEvent(() => {
    setCaption("The lights race once around the sleeping midway.");
  }, 2800);
  scheduleEvent(() => {
    setCaption("A Midnight Ride badge shines at the carousel's heart.");
  }, 5200);
  scheduleEvent(finishCarouselStory, 8000);
}

function handleCarouselDiscovery(event) {
  if (!experienceStarted || experiencePaused || isAnyStoryPlaying()) return;

  const button = event.currentTarget;
  const horseName = button.dataset.carouselHorse;
  if (foundCarouselHorses.has(horseName)) return;

  foundCarouselHorses.add(horseName);
  button.classList.add("is-found");
  button.disabled = true;
  button.setAttribute("aria-label", `${horseName[0].toUpperCase()}${horseName.slice(1)} carousel horse, found`);
  updateCarouselProgress();
  playStoryAudio(windUpAudio);

  const progress = foundCarouselHorses.size;
  if (progress === 1) {
    hudHint.textContent = "One painted horse remembers";
    setCaption("A tiny winding key turns. 1 of 3 horses found.");
  } else if (progress === 2) {
    hudHint.textContent = "Another horse waits beneath the canopy";
    setCaption("A second wooden horse catches the moonlight. 2 of 3 found.");
  } else {
    startCarouselStory();
  }
}

function finishLampStory() {
  lampStoryPlaying = false;
  lampStoryCompleted = true;
  completedStories.add("lamp");
  experience.classList.remove("is-lamp-story-playing");
  boothStory.setAttribute("aria-hidden", "true");
  setSceneInteractionsLocked(false);
  crowButton.tabIndex = 0;
  updateHudStoryCount();
  setCaption("The moonlit beacon settles. Follow the crow again whenever you wish.");
  duckAmbientAudio(false);
  resetStoryAudio();
  crowButton.focus({ preventScroll: true });
}

function startLampStory() {
  lampStoryPlaying = true;
  experience.classList.add("is-lamp-story-playing");
  boothStory.setAttribute("aria-hidden", "false");
  setSceneInteractionsLocked(true);
  hudHint.textContent = "The crow has awakened the moonlit beacon";
  setCaption("The crow answers. The lamp sends its secret toward the moon...");
  duckAmbientAudio(true);

  scheduleEvent(() => {
    playStoryAudio(crowAudio);
    setCaption("A friendly call rings out above the lantern.");
  }, 260);
  scheduleEvent(() => {
    playStoryAudio(wingsAudio);
    setCaption("Silver wings carry a trail of moonlit feathers.");
  }, 760);
  scheduleEvent(() => {
    setCaption("The old lamp opens a quiet path across the sky.");
  }, 3200);
  scheduleEvent(() => {
    setCaption("A Moonlit Beacon seal glows beside the waiting crow.");
  }, 5200);
  scheduleEvent(finishLampStory, 8000);
}

function handleCrowDiscovery() {
  if (!experienceStarted || experiencePaused || isAnyStoryPlaying()) return;
  startLampStory();
}

function scheduleBoothHints() {
  if (hintTimersStarted) return;
  hintTimersStarted = true;

  scheduleEvent(() => {
    if (boothProgress === 0 && !isAnyStoryPlaying() && !boothStoryCompleted) {
      hudHint.textContent = "A loose ticket trembles behind old glass";
      setCaption("Something papery stirs near the left side of the midway.");
    }
  }, 7000);

  scheduleEvent(() => {
    if (boothProgress === 0 && !isAnyStoryPlaying() && !boothStoryCompleted) {
      hudHint.textContent = "The ticket booth may answer a curious tap";
      setCaption("The smallest window seems to be waiting for you.");
    }
  }, 15000);
}

function scheduleCarouselHints() {
  if (carouselHintTimersStarted) return;
  carouselHintTimersStarted = true;

  scheduleEvent(() => {
    if (foundCarouselHorses.size === 0 && !isAnyStoryPlaying() && !carouselStoryCompleted) {
      hudHint.textContent = "Three painted riders are holding their breath";
      setCaption("More than one wooden horse is watching the moon.");
    }
  }, 10000);

  scheduleEvent(() => {
    if (foundCarouselHorses.size === 0 && !isAnyStoryPlaying() && !carouselStoryCompleted) {
      hudHint.textContent = "Each carousel horse carries one small spark";
      setCaption("Try greeting the left, center, and right riders.");
    }
  }, 19000);
}

function scheduleLampHints() {
  if (lampHintTimersStarted) return;
  lampHintTimersStarted = true;

  scheduleEvent(() => {
    if (!isAnyStoryPlaying() && !lampStoryCompleted) {
      hudHint.textContent = "The highest watcher knows a secret";
      setCaption("Look for a quiet silhouette above the lamp on the right.");
    }
  }, 13000);

  scheduleEvent(() => {
    if (!isAnyStoryPlaying() && !lampStoryCompleted) {
      hudHint.textContent = "One touch can wake the crow's moonlight";
      setCaption("Tap the crow perched above the lamp on the right.");
    }
  }, 23000);
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
  carouselButtons.forEach((button) => {
    button.tabIndex = 0;
  });
  crowButton.tabIndex = 0;
  pauseButton.disabled = false;
  setExperiencePaused(false);
  scheduleBoothHints();
  scheduleCarouselHints();
  scheduleLampHints();
});

pauseButton.addEventListener("click", () => {
  setExperiencePaused(!experiencePaused);
});

boothButton.addEventListener("click", handleBoothDiscovery);
carouselButtons.forEach((button) => {
  button.addEventListener("click", handleCarouselDiscovery);
});
crowButton.addEventListener("click", handleCrowDiscovery);
