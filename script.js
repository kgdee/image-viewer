

const image = document.getElementById('image');
const imageInput = document.querySelector(".image-input")
const panel = document.querySelector(".panel")

let isDragging = false;

document.body.addEventListener('mousedown', startDrag);
document.body.addEventListener('mousemove', drag);
document.body.addEventListener('mouseup', stopDrag);
document.body.addEventListener('mouseleave', stopDrag);
document.body.addEventListener('wheel', (e)=>zoom(e.deltaY));

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

function zoom(direction) {
  image.style.transform = `translate(-50%, -50%)`
  const scale = direction > 0 ? 0.9 : 1.1 // adjust the zoom speed as needed
  
  currentSize.x *= scale
  currentSize.y *= scale
  image.style.width = `${currentSize.x}px`;
  image.style.height = `${currentSize.y}px`;

  // image.style.left = `${currentSize.x - (currentSize.x / 2)}px`
  // image.style.top = `${currentSize.y - (currentSize.y / 2)}px`
}

function cover() {
  image.style.width = "100%"
  image.style.height = "100%"
  image.style.left = "50%"
  image.style.top = "50%"
  currentSize = {
    x: image.clientWidth,
    y: image.clientHeight
  }
}


function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.body.requestFullscreen();
  }
}



function handleDragOver(event) {
  event.preventDefault();
}

async function handleDrop(event) {
  event.preventDefault();

  // Access the dropped files
  const files = event.dataTransfer.files;

  try {
    if (files.length > 0) {
      const imageFile = files[0];
  
      if (imageFile.type.startsWith('image/')) {
        const imageUrl = await readFile(imageFile)
        displayImage(imageUrl)
      } else {
        alert('Please drop an image file.');
      }
    }
  } catch (error) {
    console.error(error)
  }
}

function displayImage(imageUrl) {
  image.classList.remove("hidden")
  image.src = imageUrl
  panel.classList.add("hidden")

  currentSize = {
    x: image.clientWidth,
    y: image.clientHeight
  }
  
  image.style.transform = "translate(-50%, -50%)"
  image.style.left = `${currentSize.x / 2}px`
  image.style.top = `${currentSize.y / 2}px`
}


function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      resolve(e.target.result);
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}


document.addEventListener("keydown", function(event) {
  event.preventDefault()

  if (event.code === 'KeyF') toggleFullscreen()
  if (event.code === 'KeyC') cover()

  if (event.key === "ArrowUp") zoom(-1)
  if (event.key === "ArrowDown") zoom(1)
})
