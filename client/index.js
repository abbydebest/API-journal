// /////////////////////////
// 🫰🏼🫰🏼🫰🏼 DRAG AND DROP 🫰🏼🫰🏼🫰🏼
// /////////////////////////

import './index.css';
// let dragging = null;

// console.log('HOOOI')

// const initDragDrop = () => {
//   const boxes = document.querySelectorAll(".box");
//   boxes.forEach((box) => {
//     box.addEventListener("dragstart", dragstart);
//     box.addEventListener("dragend", dragend);
//   });

//   const dropzones = document.querySelectorAll(".dropzone");
//   dropzones.forEach((dropzone) => {
//     dropzone.addEventListener("dragover", dragover);
//     dropzone.addEventListener("dragenter", dragenter);
//     dropzone.addEventListener("dragleave", dragleave);
//     dropzone.addEventListener("drop", drop);
//   });
// };
// // THE BOX
// const dragstart = (e) => {
//   console.log('init drag start')
//   e.target.dataset.status = "held";
//   dragging = e.target;
//   // setTimeout(() => (this.className.add("invisible"), 0);
// };

// const dragend = (e) => {
//   e.target.dataset.status = "dragend";
// };

// // NOT THE BOX
// const dragover = (e) => {

//   e.preventDefault();
// };

// const dragenter = (e) => {
//   e.preventDefault();
  
//   if (e.target && e.target.classList.contains("dropzone")) {
//     e.target.dataset.status = "hovered";
//   }
// };

// const dragleave = (e) => {
//   if (e.target && e.target.classList.contains("dropzone")) {
//     e.target.dataset.status = "dragleave";
//   }
// };

// const drop = (e) => {
//   //   check here the e.clientX and e.clientY
// //   If dragged item has class dropzone
//   if (e.target && e.target.classList.contains("dropzone")) {
//     const clonie = dragging.cloneNode(true);
//     //   check that e.target is the correct container, otherwise don't do anything
    
//     e.target.append(clonie);
//     dragging = null;
//   }
// };

// initDragDrop();

// //////////////////////
// DRAG & DROP MY OWN WAY
// //////////////////////

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
  
  //set up draggable things (non-ios)
});

function handleDragStart(ev) {
  // User started to drag a draggable item from the webpage
  // obj = the element inside the draggable container
  let obj = ev.target;

  // If my object is not inside of something with the class 'draggable'(or doesn't have the class draggable)
  // Then return = exit the function(because event listener is set on body)
  if (!obj.closest('.draggable')) return;

  // Because draggable item is a container for the actual content we want to drag
  if(obj.classList.contains('draggable')){
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





//optional but useful visual stuff...
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

// let newX = 0, newY = 0, startX = 0, startY = 0;

// const boxes = document.querySelectorAll(".box")

// boxes.addEventListener('mousedown', mouseDown)

// function mouseDown(e) {
//     startX = e.clientX
//     startY = e.clientY

//     document.addEventListener('mousemove', mouseMove)
//     document.addEventListener('mouseup', mouseUp)
// }

// function mouseMove(e) {
//     newX = startX - e.clientX
//     newY = startY - e.clientY

//     startX = e.clientX
//     startY = e.clientY

//     boxes.style.top = (boxes.offsetTop - newY) + 'px'
//     boxes.style.left = (boxes.offsetTop - newX) + 'px'

//     console.log({newX, newY})
//     console.log({startX, startY})
// }

// function mouseUp(e) {
//     document.removeEventListener('mousemove', mouseMove)

// }