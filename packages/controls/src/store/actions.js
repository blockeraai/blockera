export const addControl = (control) => ({
	type: 'ADD_UNPROCESSED_CONTROL',
	control,
});

export const removeControl = (names) => ({
	names,
	type: 'REMOVE_CONTROL',
});

export function modifyControlValue({
	value,
	propId,
	controlId,
	valueCleanup = null,
}) {
	return {
		value,
		propId,
		controlId,
		valueCleanup,
		type: 'MODIFY_CONTROL_VALUE',
	};
}

export function modifyControlInfo({ info, controlId }) {
	return {
		info,
		controlId,
		type: 'MODIFY_CONTROL_INFO',
	};
}
