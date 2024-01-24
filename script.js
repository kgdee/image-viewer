

const image = document.getElementById('image');
const imageInput = document.querySelector(".image-input")
const startPanel = document.querySelector(".start-panel")

document.body.addEventListener('mousedown', startDrag);
document.body.addEventListener('mousemove', drag);
document.body.addEventListener('mouseup', stopDrag);
document.body.addEventListener('mouseleave', stopDrag);
document.body.addEventListener('wheel', (e)=>zoom(e.deltaY));


let dragging = false

let distanceX = 0
let distanceY = 0


function startDrag(e) {
  dragging = true

  document.body.style.cursor = 'grabbing';

  let rect = image.getBoundingClientRect()
  distanceX = e.clientX - rect.x
  distanceY = e.clientY - rect.y
}

function drag(e) {
  if (!dragging) return

  const posX = `${e.clientX - distanceX + (image.clientWidth / 2)}px`
  const posY = `${e.clientY - distanceY + (image.clientHeight / 2)}px`
  setImagePosition(posX, posY)
}

function stopDrag() {
  dragging = false
  document.body.style.cursor = 'grab';
}

function setImagePosition(left, top) {
  image.style.left = left
  image.style.top = top
}

function moveImage(x, y) {
  const left = `${parseFloat(getComputedStyle(image).left) + x}px`
  const top = `${parseFloat(getComputedStyle(image).top) + y}px`

  setImagePosition(left, top)
}

function resizeImage(width, height) {
  image.style.width = width
  image.style.height = height
}

function zoom(direction) {
  const scale = direction > 0 ? 0.9 : 1.1 // adjust the zoom speed as needed
  
  const width = `${image.clientWidth * scale}px`
  const height = `${image.clientHeight * scale}px`

  resizeImage(width, height)
}

function cover() {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  const screenRatio = screenWidth / screenHeight;

  resizeImage("100%","100%")

  const imgRatio = image.width / image.height

  const width = screenRatio > imgRatio ? "100%" : "auto"
  const height = screenRatio > imgRatio ? "auto" : "100%"
  resizeImage(width, height)

  setImagePosition("50%","50%")
}


function handleDragOver(event) {
  event.preventDefault()
}
function handleDrop(event) {
  event.preventDefault()

  const files = event.dataTransfer.files
  handleFile(files)
}

async function handleFile(files) {
  try {
    if (files.length <= 0) return

    const imageFile = files[0]
  
    if (!imageFile.type.startsWith('image/')) return
    
    const imageUrl = await readFile(imageFile)
    displayImage(imageUrl)

  } catch (error) {
    console.error(error)
  }
}

function displayImage(imageUrl) {
  image.classList.remove("hidden")
  image.src = imageUrl
  startPanel.classList.add("hidden")
  cover()
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


function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.body.requestFullscreen();
  }
}


document.addEventListener("keydown", function(event) {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault()
  }

  if (event.code === 'KeyF') toggleFullscreen()
  if (event.code === 'KeyC') cover()

  if (event.code === 'Equal' || event.code === 'BracketRight') zoom(-1)
  if (event.code === 'Minus' || event.code === 'BracketLeft') zoom(1)
  
  switch (event.key) {
    case 'ArrowUp':
      moveImage(0, -10)
      break
    case 'ArrowDown':
      moveImage(0, 10)
      break
    case 'ArrowLeft':
      moveImage(-10, 0)
      break
    case 'ArrowRight':
      moveImage(10, 0)
      break
    default:
      break
  }
  
})
