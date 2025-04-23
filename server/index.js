// let dragging = null;

// console.log('HOOOI')

// const initDragDrop = () => {
//   const boxes = document.querySelectorAll(".box");
//   console.log('boxes', boxes)
//   boxes.forEach((box) => {
//     box.addEventListener("dragstart", dragstart);
//     box.addEventListener("dragend", dragend);
//   });

//   const dropzones = document.querySelectorAll(".dropzone");
//   dropzones.forEach((dropzone) => {
//     container.addEventListener("dragover", dragover);
//     container.addEventListener("dragenter", dragenter);
//     container.addEventListener("dragleave", dragleave);
//     container.addEventListener("drop", drop);
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
//   //   check that e.target is the correct container, otherwise don't do anything

//   e.preventDefault();
// };

// const dragenter = (e) => {
//   //   check that e.target is the correct container, otherwise don't do anything
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
//     // const clonie = dragging.cloneNode(true);
//     //   check that e.target is the correct container, otherwise don't do anything
    
//     e.target.append(dragging);
//     dragging = null;
//   }
// };

// initDragDrop();