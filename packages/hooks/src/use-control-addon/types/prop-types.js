// @flow
export type PropTypes = {
	types: Array<'variable' | 'dynamic-value'>,
	value: any,
	//FIXME: please fix all available variable types!
	variableType: 'FONT_SIZE' | 'GRADIENT',
	//FIXME: please fix all available dynamic value types!
	dynamicValueType: 'AUTHORS' | 'POSTS',
};
