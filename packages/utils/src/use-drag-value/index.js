/**
 * External dependencies
 */
import { useCallback, useEffect, useState } from '@wordpress/element';

export const useDragValue = ({ value, setValue, movement = 'vertical' }) => {
	// We are creating a snapshot of the values when the drag starts
	// because the [value] will itself change & we need the original
	// [value] to calculate during a drag.
	const [snapshot, setSnapshot] = useState(value);

	// This captures the starting position of the drag and is used to
	// calculate the diff in positions of the cursor.
	const [startVal, setStartVal] = useState(0);

	const [dragStarted, setDragStarted] = useState(false);

	const createVirtualCursorBox = (cursor) => {
		// Create a new div element
		const newElement = document.createElement('div');
		newElement.className = `virtual-cursor-box`; // Set a class name
		// Set some properties for the new element (e.g., text content and style)
		// newElement.style.setProperty('cursor', cursor, 'important');

		// Set styles to make the element fullscreen
		newElement.style.position = 'fixed';
		newElement.style.top = '0';
		newElement.style.left = '0';
		newElement.style.width = '100vw';
		newElement.style.height = '100vh';
		newElement.style.zIndex = '10000000';
		newElement.style.setProperty('cursor', cursor, 'important');
		// Append the new element to the body
		document.body.appendChild(newElement);
	};

	// Function to delete the created element by class name
	const deleteVisualDivCursor = () => {
		const elements = document.getElementsByClassName('virtual-cursor-box');
		if (elements.length > 0) {
			// Assuming there's only one element with the specified class
			const elementToRemove = elements[0];
			elementToRemove.parentNode.removeChild(elementToRemove);
		}
	};

	// Start the drag to change operation when the mouse button is down.
	const onStart = useCallback(
		(event) => {
			if (movement === 'vertical') {
				setStartVal(event.clientY);

				// add cursor
				createVirtualCursorBox(
					`url("data:image/svg+xml,%3Csvg viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath d='M10 2L4 7.98H8V10V12H4L10 18L16 12H12V10V7.98H16L10 2ZM10 3.414L13.586 6.981H11V9.501V13H13.586L10 16.586L6.414 13H9V9.501V6.981H6.414L10 3.414Z' fill='white' /%3E%3Cpath d='M11 9.49994V6.97994H13.586L10 3.41394L6.414 6.97994H9V9.49994V12.9999H6.414L10 16.5859L13.586 12.9999H11V9.49994Z' fill='black' /%3E%3C/svg%3E"), ns-resize`
				);
			}
			if (movement === 'horizontal') {
				setStartVal(event.clientX);

				// add cursor
				createVirtualCursorBox(
					`url("data:image/svg+xml,%3Csvg viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath d='M2 9.999V10.004L7.997 16L7.998 12.001H9.997H12.017V16.001L17.997 10L12.017 4.001L12.018 8.02L9.997 8.022H7.997L7.998 4L2 9.999ZM3.411 10.002L6.998 6.414L6.997 9.001H10.497H13.018V6.416L16.583 10.002L13.019 13.587L13.018 11.002H10.497L6.998 11.001L6.997 13.587L3.411 10.002Z' fill='white' /%3E%3Cpath d='M10.497 11.0013H13.018V13.5873L16.583 10.0013L13.018 6.41631V9.02131H10.497H6.99701V6.41431L3.41101 10.0013L6.99701 13.5873V11.0003L10.497 11.0013Z' fill='black' /%3E%3C/svg%3E"), ew-resize`
				);
			}

			setSnapshot(value);
			setDragStarted(true);
		},
		[value, movement]
	);

	// We use document events to update and end the drag operation
	// because the mouse may not be present over the label during
	// the operation..
	useEffect(() => {
		// Only change the value if the drag was actually started.
		const onUpdate = (event) => {
			if (dragStarted && startVal) {
				if (movement === 'vertical') {
					setValue(snapshot - event.clientY + startVal);
				}
				if (movement === 'horizontal') {
					setValue(snapshot - (startVal - event.clientX));
				}
			}
		};

		// Stop the drag operation now.
		const onEnd = () => {
			setStartVal(0);
			setDragStarted(false);

			// remove cursor
			deleteVisualDivCursor();
		};

		document.addEventListener('mousemove', onUpdate);
		document.addEventListener('mouseup', onEnd);
		return () => {
			document.removeEventListener('mousemove', onUpdate);
			document.removeEventListener('mouseup', onEnd);
		};
	}, [snapshot, movement, dragStarted, value]); // eslint-disable-line

	return onStart;
};
