// /////////////////////////
// 🫰🏼🫰🏼🫰🏼 DRAG AND DROP 🫰🏼🫰🏼🫰🏼
// /////////////////////////

import './index.css';

document.addEventListener('DOMContentLoaded', () => {

  //required event listeners
  document.body.addEventListener('dragstart', handleDragStart); //for draggable
  document.body.addEventListener('drop', handleDrop); //for dropzone
  document.body.addEventListener('dragover', handleOver); //for dropzone
  document.body.addEventListener('dragend', dragEnd); //for draggable

  //optional but useful events
  document.body.addEventListener('mousedown', handleCursorGrab);
  document.body.addEventListener('dragenter', handleEnter);
  document.body.addEventListener('dragleave', handleLeave);

  // For internal movement of dropped images
  document.body.addEventListener('mousedown', mouseDown);
});

function handleDragStart(ev) {
  // User started to drag a draggable item from the webpage
  // obj = the element inside the draggable container
  let obj = ev.target;

  // If my object is not inside of something with the class 'draggable'(or doesn't have the class draggable)
  // Then return = exit the function(because event listener is set on body)
  if (!obj.closest('.draggable')) return;

  // Because draggable item is a container for the actual content we want to drag
  if (obj.classList.contains('draggable')) {
    obj = obj.firstElementChild;
  }
  console.log('DRAGSTART');

  // Create content to drag and put in dataTransfer object ('*data type*', '*actual data*')
  let imageURL = obj.src;
  ev.dataTransfer.setData('text/plain', imageURL);

  // dt.setData("text/uri-list", imageURL);
  // dt.setData("text/plain", imageURL);
  ev.dataTransfer.effectAllowed = "copy";
}

function handleDrop(ev) {
  let dropzone = ev.target;
  if (!dropzone.classList.contains('dropzone')) return;

  // Prevent browser from default behaviour(being able to drop anything from anywhere off the computer, like finder), explicitly do this instead
  ev.preventDefault();
  console.log('DROP', ev.dataTransfer);

  // Get the data from the dataTransfer object with this ('data type')
  let imageURL = ev.dataTransfer.getData('text/plain');

  // Create an image element and set its source to the dropped image URL
  const img = document.createElement('img');
  img.src = imageURL;

  // And add it(data) to the textContent item
  // dropzone.textContent += data;

  // 🎱 MOVE WITH MOUSE

  // Set the image to be draggable inside the dropzone
  img.classList.add('image-inside');

  // Position the image where it was dropped using absolute positioning
  img.style.position = 'absolute';

  // Calculate position relative to the dropzone
  const dropzoneRect = dropzone.getBoundingClientRect();
  img.style.top = `${ev.clientY - dropzoneRect.top}px`;
  img.style.left = `${ev.clientX - dropzoneRect.left}px`;

  // Append the image to the dropzone
  dropzone.appendChild(img);

  // Remove CSS class with the visual indication of dropping something(feedback)
  dropzone.classList.remove('over');
}

function handleOver(ev) {
  //fires continually
  let dropzone = ev.target;
  if (!dropzone.classList.contains('dropzone')) return;
  ev.preventDefault();

  // dropzone.classList.add('over'); //can do this in handleEnter BUT WHY WOULD I CHOOSE A ONE TIME FIRING OPTION INSTEAD OF CONTINUOUSLY, PERFORMANCE?
  console.log('dragover dropzone');
}

function dragEnd(ev) {
  ev.dataTransfer.dropEffect = "copy";
}

// ///////////////////////////////////////////////
// 🤎🤎🤎 Optional but useful visual stuff... 🤎🤎🤎
// ///////////////////////////////////////////////

function handleCursorGrab(ev) {
  let obj = ev.target;
  if (!obj.closest('.draggable')) return;
  obj.style.cursor = 'grabbing'; //close the hand
}

function handleEnter(ev) {
  //fires once
  let dropzone = ev.target;
  if (!dropzone.classList.contains('dropzone')) return;
  ev.preventDefault();

  // Add class .over for styling the dropzone
  dropzone.classList.add('over');

  // console.log('dragenter dropzone')
}

function handleLeave(ev) {
  let dropzone = ev.target;
  if (!dropzone.classList.contains('dropzone')) return;
  ev.preventDefault();
  dropzone.classList.remove('over');
  // console.log('dragleave dropzone');
}

// ///////////////////////////
// 🎱🎱🎱 MOVE WITH MOUSE 🎱🎱🎱
// ///////////////////////////

let newX = 0, newY = 0, startX = 0, startY = 0;
let isMoving = false;
let currentMovingElement = null;

function mouseDown(e) {
  // Check if we clicked on a movable image inside the dropzone
  const target = e.target;

  // Only process if the clicked element is an image inside the dropzone with movable-inside class
  if (!target.classList.contains('image-inside')) return;

  e.preventDefault();
  isMoving = true;
  currentMovingElement = target;

  // Start mouse position to where cursor currently is
  startX = e.clientX
  startY = e.clientY

  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('mouseup', mouseUp)

  console.log('Started moving element', {startX, startY});
}

function mouseMove(e) {
  // Only process if we're in moving mode
  if (!isMoving || !currentMovingElement) return;

  // Mouse start position minus the current mouse position, calculates distance from mouse click to mouse at current moment
  newX = e.clientX - startX;
  newY = e.clientY - startY;

  // Get current position of the element (or default to 0 if not set)
  const currentTop = parseInt(currentMovingElement.style.top) || 0;
  const currentLeft = parseInt(currentMovingElement.style.left) || 0;
  
  // Update element position
  currentMovingElement.style.top = `${currentTop + newY}px`;
  currentMovingElement.style.left = `${currentLeft + newX}px`;

  // Reset the start position to the current mouse position, as a new start point
  startX = e.clientX
  startY = e.clientY

  console.log('Moving element', {newX, newY, currentTop, currentLeft});
}

function mouseUp(e) {
  // Clean up - reset state and remove listeners
  isMoving = false;
  currentMovingElement = null;

  document.removeEventListener('mousemove', mouseMove)
  document.removeEventListener('mouseup', mouseUp);

  console.log('Stopped moving element');
}

const shareData = {
  title: "{{ title }}",
  text: "Hurry up and start creating with your pins. Let's go afterparty!",
  url: "http://localhost:3000/",
};

const btn = document.getElementById("shareBtn");
const resultPara = document.querySelector(".result");

// Share must be triggered by "user activation"
btn.addEventListener("click", async () => {
  try {
    await navigator.share(shareData);
    resultPara.textContent = "Shared successfully";
  } catch (err) {
    resultPara.textContent = `Error: ${err}`;
  }
});

// SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API
