/**
 * External dependencies
 */
import { useCallback, useEffect, useState, useRef } from '@wordpress/element';

export const useDragValue = ({ value, setValue, movement = 'vertical' }) => {
	// We are creating a snapshot of the values when the drag starts
	// because the [value] will itself change & we need the original
	// [value] to calculate during a drag.
	const [snapshot, setSnapshot] = useState(value);

	// create ref for created element
	const elementRef = useRef(null);

	// This captures the starting position of the drag and is used to
	// calculate the diff in positions of the cursor.
	const [startVal, setStartVal] = useState(0);

	const [dragStarted, setDragStarted] = useState(false);

	const createVirtualCursorBox = (cursorClass) => {
		// Create a new div element
		const newElement = document.createElement('div');
		newElement.className = `virtual-cursor-box ${cursorClass}`; // Set a class name
		// Set some properties for the new element (e.g., text content and style)
		// newElement.style.setProperty('cursor', cursor, 'important');

		// Set styles to make the element fullscreen
		newElement.style.position = 'fixed';
		newElement.style.top = '0';
		newElement.style.left = '0';
		newElement.style.width = '100vw';
		newElement.style.height = '100vh';
		newElement.style.zIndex = '10000000';

		// Append the new element to the body
		document.body.appendChild(newElement);

		// Assign the created element to the ref
		if (elementRef) {
			elementRef.current = newElement;
		}
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
				createVirtualCursorBox('cursor-tb-resize');
			}
			if (movement === 'horizontal') {
				setStartVal(event.clientX);

				// add cursor
				createVirtualCursorBox('cursor-lr-resize');
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
				const oldValue = value;
				const newValue =
					snapshot -
					(movement === 'vertical' ? event.clientY : event.clientX) +
					startVal;

				setValue(newValue);

				let directionClass = '';

				if (movement === 'vertical') {
					directionClass =
						oldValue > newValue
							? 'cursor-b-resize'
							: 'cursor-t-resize';
				} else {
					directionClass =
						oldValue > newValue
							? 'cursor-r-resize'
							: 'cursor-l-resize';
				}

				elementRef.current.className =
					'virtual-cursor-box ' + directionClass;
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
	}, [snapshot, movement, dragStarted]);

	return onStart;
};
