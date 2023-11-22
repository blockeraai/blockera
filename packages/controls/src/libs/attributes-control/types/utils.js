// @flow

export type TAttributeFieldKeyOptions = {
	element?: 'a' | 'button' | 'ol' | 'general',
};

export type TAttributeFieldValueOptions = {
	element: 'a' | 'button' | 'ol' | 'general',
	attribute: string,
};

type TOptionValue = {
	label: string,
	value?: string,
	type?: string,
	options?: TOptionValue[],
};
export type TOptionsReturn = TOptionValue[];
