const dropArea = document.getElementById("drop-area");
const inputScreen = document.querySelector(".input-screen");
const imageInput = inputScreen.querySelector(".image-input input");
const imageScreen = document.querySelector(".image-screen");
const panzoomArea = document.getElementById("panzoom-area");
const imageContainer = document.getElementById("image-container");
const imageEl = imageContainer.querySelector("img");
const controlBar = document.querySelector(".control-bar");

let currentImage = null;
let isImageDisplayed = false;
let jitterInterval = null;
let isJittering = false;
let animationDuration = 0;

const panzoom = Panzoom(imageEl, {
  minScale: 0.1,
  maxScale: 10,
  contain: false,
  cursor: "grab",
});

// Enable mouse wheel zoom on the whole container
imageEl.addEventListener("wheel", panzoom.zoomWithWheel, { passive: false });

function fitScreen() {
  if (!isImageDisplayed) return;

  panzoom.pan(0, 0);
  panzoom.zoom(1);
}

function handleDrop(event) {
  event.preventDefault();

  const files = event.dataTransfer.files[0];
  handleFileInput(files);
}

async function handleFileInput(file) {
  if (!file) return;

  if (!file.type.startsWith("image/")) return;

  currentImage = await getFileDataUrl(file);
  displayImage();
}

function displayImage() {
  imageInput.value = "";
  imageEl.src = currentImage;
  changeScreen("image-screen");
  isImageDisplayed = true;
  fitScreen();
}

function goHome() {
  if (animationDuration) stopAnimation();
  if (isJittering) toggleJitter();

  changeScreen("input-screen");
  imageEl.src = "";
  isImageDisplayed = false;
}

function changeAnimation() {
  if (!isImageDisplayed) return;

  let duration = animationDuration - 0.25;
  if (duration < 0) duration = 1;
  animationDuration = duration;

  const shouldAnimate = animationDuration > 0;
  imageContainer.style.animation = shouldAnimate ? `shaking ${animationDuration}s ease-in-out infinite` : null;
}

function stopAnimation() {
  imageContainer.style.animation = null;
}

function toggleJitter() {
  if (!isImageDisplayed) return;

  if (isJittering) {
    isJittering = false;
    clearInterval(jitterInterval);
    imageContainer.style.transform = null;
    return;
  }

  isJittering = true;

  clearInterval(jitterInterval);
  jitterInterval = setInterval(jitter, 500);
}

function jitter() {
  const x = Math.random() * 1;
  const y = Math.random() * 1;
  const scale = 1 + Math.random() * 0.02;

  imageContainer.style.transform = `translate(${x}%, ${y}%) scale(${scale})`;
}

function moveImage(x, y) {
  panzoom.pan(x, y, { relative: true });
}

const keyActions = {
  KeyF: toggleFullscreen,
  KeyC: fitScreen,
  KeyA: changeAnimation,
  KeyJ: toggleJitter,
  Equal: () => zoom(-1),
  BracketRight: () => zoom(-1),
  Minus: () => zoom(1),
  BracketLeft: () => zoom(1),
  ArrowUp: () => moveImage(0, -10),
  ArrowDown: () => moveImage(0, 10),
  ArrowLeft: () => moveImage(-10, 0),
  ArrowRight: () => moveImage(10, 0),
};

document.addEventListener("keydown", (event) => {
  const action = keyActions[event.code];
  if (action) {
    event.preventDefault();
    action();
  }
});

document.addEventListener("click", function (event) {
  if (!controlBar.contains(event.target)) {
    controlBar.classList.toggle("m-hidden");
  }
});
