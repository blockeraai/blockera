// @flow

export const addControl = (
	control: Object
): {
	type: 'ADD_UNPROCESSED_CONTROL',
	control: Object,
} => ({
	type: 'ADD_UNPROCESSED_CONTROL',
	control,
});

export const removeControl = (
	names: Array<string>
): {
	names: Array<string>,
	type: 'REMOVE_CONTROL',
} => ({
	names,
	type: 'REMOVE_CONTROL',
});

export function modifyControlValue({
	value,
	propId,
	controlId,
	valueCleanup = null,
}: {
	value: any,
	propId?: string,
	controlId: string,
	valueCleanup?: (value: any) => void,
}): {
	value: any,
	propId?: string,
	controlId: string,
	type: 'MODIFY_CONTROL_VALUE',
	valueCleanup?: (value: any) => void,
} {
	return {
		value,
		propId,
		controlId,
		valueCleanup,
		type: 'MODIFY_CONTROL_VALUE',
	};
}

export function modifyControlInfo({
	info,
	controlId,
}: {
	info: Object,
	controlId: string,
}): {
	info: Object,
	controlId: string,
	type: 'MODIFY_CONTROL_INFO',
} {
	return {
		info,
		controlId,
		type: 'MODIFY_CONTROL_INFO',
	};
}
