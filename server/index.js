document.addEventListener('DOMContentLoaded', () => {
    
    // Function on body, then check if it is a draggable element
    // Required event listeners
    document.body.addEventListener('dragstart', handleDragStart); // For draggable, if you have clicked on an element, and move your mouse without releasing it
    document.body.addEventListener('drop', handleDrop); // For dropzone, drop, if you release the mouse button/item over a dropzone
    document.body.addEventListener('dragover', handleOver); // For dropzone, when dragged item is above the dropzone
    
    // Optional but useful events
    document.body.addEventListener('mousedown', handleCursorGrab);
    document.body.addEventListener('dragenter', handleEnter);
    document.body.addEventListener('dragleave', handleLeave);
    
    // Set up draggable things (non-ios)
    imgElement.src = './img/dragon-3.jpg';
    document.querySelector('footer>p').appendChild(imgElement);
    dragElement.textContent = 'Wheeeee';
    dragElement.classList.add('wheeeee');
    document.querySelector('footer>p').appendChild(dragElement);
  });