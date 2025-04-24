// /////////////////////////
// 🫰🏼🫰🏼🫰🏼 DRAG AND DROP 🫰🏼🫰🏼🫰🏼
// /////////////////////////

import './index.css';
let dragging = null;

console.log('HOOOI')

const initDragDrop = () => {
  const boxes = document.querySelectorAll(".box");
  boxes.forEach((box) => {
    box.addEventListener("dragstart", dragstart);
    box.addEventListener("dragend", dragend);
  });

  const dropzones = document.querySelectorAll(".dropzone");
  dropzones.forEach((dropzone) => {
    dropzone.addEventListener("dragover", dragover);
    dropzone.addEventListener("dragenter", dragenter);
    dropzone.addEventListener("dragleave", dragleave);
    dropzone.addEventListener("drop", drop);
  });
};
// THE BOX
const dragstart = (e) => {
  console.log('init drag start')
  e.target.dataset.status = "held";
  dragging = e.target;
  // setTimeout(() => (this.className.add("invisible"), 0);
};

const dragend = (e) => {
  e.target.dataset.status = "dragend";
};

// NOT THE BOX
const dragover = (e) => {

  e.preventDefault();
};

const dragenter = (e) => {
  e.preventDefault();
  
  if (e.target && e.target.classList.contains("dropzone")) {
    e.target.dataset.status = "hovered";
  }
};

const dragleave = (e) => {
  if (e.target && e.target.classList.contains("dropzone")) {
    e.target.dataset.status = "dragleave";
  }
};

const drop = (e) => {
  //   check here the e.clientX and e.clientY
//   If dragged item has class dropzone
  if (e.target && e.target.classList.contains("dropzone")) {
    const clonie = dragging.cloneNode(true);
    //   check that e.target is the correct container, otherwise don't do anything
    
    e.target.append(clonie);
    dragging = null;
  }
};

initDragDrop();

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