const dt = event.dataTransfer;
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
  //user started to drag a draggable from the webpage
  let obj = ev.target;
//   If my object is not inside of something with the class 'draggable'(or doesn't have the class draggable)
//   Then return = exit the function(because event listener is set on body)
  if (!obj.closest('.draggable')) return;
  if(obj.classList.contains('draggable')){
    obj = obj.firstElementChild;
  }
  console.log('DRAGSTART');

  dt.setData("text/uri-list", imageURL);
  dt.setData("text/plain", imageURL);
  dt.dataTransfer.effectAllowed = "copy";

}

function handleDrop(ev) {
  let dropzone = ev.target;
  if (!dropzone.classList.contains('dropzone')) return;

//   Prevent browser from default behaviour, explicitly do this instead
  ev.preventDefault();
  console.log('DROP', ev.dataTransfer);
  let data = ev.dataTransfer.getData('text/plain');
  

  // let data = JSON.parse(ev.dataTransfer.getData('application/json'));
  // let draggable = document.querySelector(`[data-ts="${data.timestamp}"]`);
  // let clone = draggable.cloneNode(true);
  // dropzone.append(clone);
  // draggable.remove();
  
  dropzone.textContent += data;
//   Remove CSS class with the visual indication of dropping something(feedback)
  dropzone.classList.remove('over');
}

function handleOver(ev) {
  //fires continually
  let dropzone = ev.target;
  if (!dropzone.classList.contains('dropzone')) return;
  ev.preventDefault();
  // dropzone.classList.add('over'); //can do this in handleEnter BUT WHY WOULD I CHOOSE A ONE TIME FIRING OPTION NISTEAD OF CONTINUESLY, PERFORMANCE?
  console.log('dragover dropzone');
}

function dragEnd(ev) {
  event.dataTransfer.dropEffect = "copy";
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

const boxes = document.querySelectorAll(".box")

boxes.addEventListener('mousedown', mouseDown)

function mouseDown(e) {
    startX = e.clientX
    startY = e.clientY

    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp)
}

function mouseMove(e) {
    newX = startX - e.clientX
    newY = startY - e.clientY

    startX = e.clientX
    startY = e.clientY

    boxes.style.top = (boxes.offsetTop - newY) + 'px'
    boxes.style.left = (boxes.offsetTop - newX) + 'px'

    console.log({newX, newY})
    console.log({startX, startY})
}

function mouseUp(e) {
    document.removeEventListener('mousemove', mouseMove)

}