// @flow

export type THandleOnChangeAttributes = (
	attributeId: string,
	attributeValue: any,
	query?: string,
	callback?: (
		attributes: Object,
		setAttributes: (attributes: Object) => void
	) => void
) => void;
