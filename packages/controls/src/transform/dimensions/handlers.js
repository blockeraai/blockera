// Handle mousedown event on small circle
export function handleMouseDown(event,offset) {
	// Calculate offset between mouse position and small circle position
	const bbox = event.target.getBBox();
	offset.x = event.clientX - bbox.x;
	offset.y = event.clientY - bbox.y;

	// Set cursor style to grabbing
	event.target.closest('svg').style.cursor = 'grabbing';

	// Prevent default behavior (e.g. text selection)
	event.preventDefault();
}

// Handle mousemove event on SVG element
export function handleMouseMove(event,svg,smallCircle,offset,isDragging) {
	if (isDragging) {
		// Calculate new position for small circle based on mouse position and offset
		const x = event.clientX - offset.x;
		const y = event.clientY - offset.y;

		if (!smallCircle){
			smallCircle = event.target.querySelector('#small');
			if (!smallCircle){
				smallCircle = event.target;
			}
		}

		// Move small circle to new position by modifying its cx and cy attributes
		smallCircle.setAttribute('cx', x);
		smallCircle.setAttribute('cy', y);

		// Prevent default behavior (e.g. scrolling)
		event.preventDefault();
	}
}

// Handle mouseup event on SVG element
export function handleMouseUp(event) {
	// Set cursor style back to default
	event.target.style.cursor = 'default';
}
