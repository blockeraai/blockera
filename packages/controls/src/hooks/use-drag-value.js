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

	// add cursor to elements
	const addCursorToElements = (cursor) => {
		const el = document.querySelectorAll('*');
		for (let i = 0; i < el.length; i++) {
			el[i].style.setProperty('cursor', cursor, 'important');
		}
	};

	// Start the drag to change operation when the mouse button is down.
	const onStart = useCallback(
		(event) => {
			if (movement === 'vertical') {
				setStartVal(event.clientY);

				// add cursor from all elements
				addCursorToElements('n-resize');
			}
			if (movement === 'horizontal') {
				setStartVal(event.clientX);

				// add cursor from all elements
				addCursorToElements('e-resize');
			}

			setSnapshot(value);
		},
		[value, movement]
	);

	// We use document events to update and end the drag operation
	// because the mouse may not be present over the label during
	// the operation..
	useEffect(() => {
		// Only change the value if the drag was actually started.
		const onUpdate = (event) => {
			if (startVal) {
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
			// remove cursor from all elements
			addCursorToElements('');
		};

		document.addEventListener('mousemove', onUpdate);
		document.addEventListener('mouseup', onEnd);
		return () => {
			document.removeEventListener('mousemove', onUpdate);
			document.removeEventListener('mouseup', onEnd);
		};
	}, [startVal, setValue, snapshot, movement]);

	return onStart;
};
