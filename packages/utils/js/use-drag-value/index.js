/**
 * External dependencies
 */
import { useCallback, useEffect, useState } from '@wordpress/element';

export const useDragValue = ({
	value,
	setValue,
	movement = 'vertical',
	min,
	max,
	threshold = 5,
	onEnd: callbackOnEnd = () => {},
}) => {
	// We are creating a snapshot of the values when the drag starts
	// because the [value] will itself change & we need the original
	// [value] to calculate during a drag.
	const [snapshot, setSnapshot] = useState(value);

	// This captures the starting position of the drag and is used to
	// calculate the diff in positions of the cursor.
	const [startVal, setStartVal] = useState(0);

	const [dragStarted, setDragStarted] = useState('');

	const [initialPos, setInitialPos] = useState(0);

	const createVirtualCursorBox = (cursor) => {
		// Create a new div element
		const newElement = document.createElement('div');
		newElement.className = `blockera-virtual-cursor-box`; // Set a class name
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
		const elements = document.getElementsByClassName(
			'blockera-virtual-cursor-box'
		);

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
				setInitialPos(event.clientY);
			} else if (movement === 'horizontal') {
				setStartVal(event.clientX);
				setInitialPos(event.clientX);
			}

			setSnapshot(value);
			setDragStarted(true);
		},
		[value, movement]
	);

	// Only change the value if the drag was actually started.
	const onUpdate = (event) => {
		const currentPos =
			movement === 'vertical' ? event.clientY : event.clientX;
		const diff = Math.abs(currentPos - initialPos);

		// Check threshold only if cursor box doesn't exist yet and threshold is not zero
		if (!document.querySelector('.blockera-virtual-cursor-box')) {
			if (threshold !== 0) {
				if (diff < threshold) {
					return;
				}

				// Create cursor once threshold is exceeded
				createVirtualCursorBox(
					movement === 'vertical' ? 'ns-resize' : 'ew-resize'
				);

				setStartVal(currentPos);
				return; // Skip the first value update to avoid jumps
			}

			// If threshold is 0, just create the cursor box immediately
			createVirtualCursorBox(
				movement === 'vertical' ? 'ns-resize' : 'ew-resize'
			);
		}

		let newValue;
		const stepMultiplier = event.shiftKey ? 10 : 1;
		const pixelThreshold = event.shiftKey ? 5 : 1;
		const stepThreshold = event.shiftKey ? 10 : 5;

		if (movement === 'vertical') {
			const pixelDiff = currentPos - startVal;
			const steps =
				Math.floor(Math.abs(pixelDiff) / pixelThreshold) *
				stepMultiplier;

			let thresholdAdjustment = 0;
			if (threshold !== 0) {
				thresholdAdjustment =
					currentPos > initialPos ? -stepThreshold : stepThreshold;
			}

			newValue =
				snapshot +
				(pixelDiff > 0 ? -steps : steps) -
				thresholdAdjustment;
		}

		if (movement === 'horizontal') {
			const pixelDiff = currentPos - startVal;
			const steps =
				Math.floor(Math.abs(pixelDiff) / pixelThreshold) *
				stepMultiplier;

			let thresholdAdjustment = 0;
			if (threshold !== 0) {
				thresholdAdjustment =
					currentPos > initialPos ? -stepThreshold : stepThreshold;
			}

			newValue =
				snapshot +
				(pixelDiff > 0 ? steps : -steps) -
				thresholdAdjustment;
		}

		// Check against min and max values
		if (typeof min === 'number' && newValue < min) {
			newValue = min;
		} else if (typeof max === 'number' && newValue > max) {
			newValue = max;
		}

		setValue(newValue);
	};

	// Stop the drag operation now.
	// we use force stopping even if the drag was not started (by using onDragEnd)
	// because sometimes in tests or strange behaviors the drag or mouseup was not fired
	const onEnd = (event, force = false) => {
		// stop only if the drag was actually started
		// or force
		if ((dragStarted === false || dragStarted === '') && !force) return;

		// call outside callback
		callbackOnEnd();

		setStartVal(0);
		setDragStarted(false);

		// remove cursor
		deleteVisualDivCursor();
	};

	// We use document events to update and end the drag operation
	// because the mouse may not be present over the label during
	// the operation..
	useEffect(() => {
		if (dragStarted === true) {
			document.addEventListener('mousemove', onUpdate);
			document.addEventListener('mouseup', onEnd);
		} else if (dragStarted === false && dragStarted !== '') {
			document.removeEventListener('mousemove', onUpdate);
			document.removeEventListener('mouseup', onEnd);
		}

		return () => {
			document.removeEventListener('mousemove', onUpdate);
			document.removeEventListener('mouseup', onEnd);
		};
	}, [dragStarted]); // eslint-disable-line

	return {
		onDragStart: onStart,
		onDragEnd: (event) => {
			// force stopping drag if started
			onEnd(event, true);
		},
		isDragStarted: dragStarted,
	};
};
