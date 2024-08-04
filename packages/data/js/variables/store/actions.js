// @flow

export const addBootstrappedVariableGroup = ({
	name,
	variableGroup,
}: {
	name: string,
	variableGroup: Object,
}): {
	name: string,
	variableGroup: Object,
	type: 'ADD_BOOTSTRAPPED_VARIABLE_GROUP',
} => {
	return {
		name,
		variableGroup,
		type: 'ADD_BOOTSTRAPPED_VARIABLE_GROUP',
	};
};
