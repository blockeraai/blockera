/**
 * External dependencies
 */
import { useCallback, useEffect, useState } from 'react';

export const useDragValue = ({ value, setValue }) => {
	// We are creating a snapshot of the values when the drag starts
	// because the [value] will itself change & we need the original
	// [value] to calculate during a drag.
	const [snapshot, setSnapshot] = useState(value);

	// This captures the starting position of the drag and is used to
	// calculate the diff in positions of the cursor.
	const [startVal, setStartVal] = useState(0);

	// Start the drag to change operation when the mouse button is down.
	const onStart = useCallback(
		(event) => {
			setStartVal(event.clientY);
			setSnapshot(value);
		},
		[value]
	);

	// We use document events to update and end the drag operation
	// because the mouse may not be present over the label during
	// the operation..
	useEffect(() => {
		// Only change the value if the drag was actually started.
		const onUpdate = (event) => {
			if (startVal) {
				setValue(snapshot - event.clientY + startVal);
			}
		};

		// Stop the drag operation now.
		const onEnd = () => {
			setStartVal(0);
		};

		document.addEventListener('mousemove', onUpdate);
		document.addEventListener('mouseup', onEnd);
		return () => {
			document.removeEventListener('mousemove', onUpdate);
			document.removeEventListener('mouseup', onEnd);
		};
	}, [startVal, setValue, snapshot]);

	return onStart;
};
