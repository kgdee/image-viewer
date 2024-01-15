

const image = document.getElementById('image');
const msg = document.querySelector(".msg")

let isDragging = false;

document.body.addEventListener('mousedown', startDrag);
document.body.addEventListener('mousemove', drag);
document.body.addEventListener('mouseup', stopDrag);
document.body.addEventListener('mouseleave', stopDrag);
document.body.addEventListener('wheel', zoom);

let distanceX = 0
let distanceY = 0

let currentSize = {
  x: image.clientWidth,
  y: image.clientHeight
}

image.style.transform = "translate(-50%, -50%)"
image.style.left = `${currentSize.x / 2}px`
image.style.top = `${currentSize.y / 2}px`

function startDrag(e) {
  isDragging = true;
  document.body.style.cursor = 'grabbing';

  var rect = image.getBoundingClientRect()
  distanceX = e.clientX - rect.x
  distanceY = e.clientY - rect.y
}

function drag(e) {
  if (!isDragging) return;
  image.style.left = `${e.clientX - distanceX + (currentSize.x / 2)}px`
  image.style.top = `${e.clientY - distanceY + (currentSize.y / 2)}px`
}

function stopDrag() {
    isDragging = false;
    document.body.style.cursor = 'grab';
}

function zoom(e) {
  image.style.transform = `translate(-50%, -50%)`
  const scale = e.deltaY > 0 ? 0.9 : 1.1 // adjust the zoom speed as needed
  
  currentSize.x *= scale
  currentSize.y *= scale
  image.style.width = `${currentSize.x}px`;
  image.style.height = `${currentSize.y}px`;

  // image.style.left = `${currentSize.x - (currentSize.x / 2)}px`
  // image.style.top = `${currentSize.y - (currentSize.y / 2)}px`
}


function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.body.requestFullscreen();
  }
}

document.addEventListener("keydown", function(event) {
  if (event.key === "f") toggleFullscreen()
})



function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();

  // Access the dropped files
  const files = event.dataTransfer.files;

  // Check if any files were dropped
  if (files.length > 0) {
    const imageFile = files[0];

    // Check if the dropped file is an image
    if (imageFile.type.startsWith('image/')) {
      // Read the image file
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageUrl = e.target.result;
        // Do something with the image URL, for example, display it
        displayImage(imageUrl);
      };
      reader.readAsDataURL(imageFile);
    } else {
      alert('Please drop an image file.');
    }
  }
}

function displayImage(imageUrl) {
  image.src = imageUrl
  msg.classList.add("hidden")
}