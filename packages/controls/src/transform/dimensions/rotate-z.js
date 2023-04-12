import { handleMouseDown, handleMouseMove, handleMouseUp } from "./handlers";
import { useState } from "@wordpress/element";

export default function RotateZ({ angles, setAngle }) {
	const [dimension, updateDimension] = useState({
			x: 0,
			y: 0,
		}
	);

	// Add event listener for dragging
	let isDragging = false;

	function startDrag(event) {
		isDragging = true;
		event.preventDefault();
		event.stopPropagation();
		let svg = event.target.closest('svg');
		svg.addEventListener('mousemove', doDrag);
		svg.addEventListener('mouseup', stopDrag);
		return false;
	}

	function doDrag(event) {
		if (isDragging) {
			const bigCircle = document.getElementById("bigCircle");
			const smallCircle = document.getElementById("smallCircle");

			// Calculate initial position of small circle
			const radius = parseInt(bigCircle.getAttribute("r"));
			const centerX = parseInt(bigCircle.getAttribute("cx"));
			const centerY = parseInt(bigCircle.getAttribute("cy"));
			let angle = Math.PI / 4; // Initial angle in radians
			let x = centerX + radius * Math.cos(angle);
			let y = centerY + radius * Math.sin(angle);

			// Calculate new position of small circle
			let rect = bigCircle.getBoundingClientRect();
			let mouseX = event.clientX - rect.left;
			let mouseY = event.clientY - rect.top;
			angle = Math.atan2(mouseY - centerY, mouseX - centerX);
			x = centerX + radius * Math.cos(angle);
			y = centerY + radius * Math.sin(angle);

			// Update position of small circle
			updateDimension({ x, y });
			setAngle({ ...angles, z: Math.round(angle * 100) });
		}
	}

	function stopDrag(event) {
		isDragging = false;
		document.removeEventListener('mousemove', doDrag);
		document.removeEventListener('mouseup', stopDrag);
	}

	// smallCircle.addEventListener('mousedown', startDrag);

	return (
		<svg width="100" height="100">
			<circle fill="#C9D2DD" cx="48.5" cy="48.5" r="3.5"></circle>
			{/*<path fill="none" stroke="#C9D2DD" strokeWidth="2" strokeDasharray="4,4" d="m 48.5,48.5 27.279934402499947,29.25414806476681"></path>*/}
			<path fill="none" stroke="#C9D2DD" strokeWidth="3" d="m 48.5,48.5 0,0"></path>
			<path fill="none" stroke="#C9D2DD" strokeWidth="3" d="m 48.5,48.5 0,0"></path>
			<circle id="bigCircle" cx="50" cy="50" r="40" strokeWidth="2" stroke="#C9D2DD" fill="none"/>
			<circle
				onMouseDown={startDrag}
				fill="red" id="smallCircle"
				cx={dimension.x ? dimension.x : 89.91391228553485}
				cy={dimension.y ? dimension.y : 47.377099684961266}
				r="5" stroke="red"/>
		</svg>
	);
}
