// @flow

export const addBootstrappedDynamicValueGroup = ({
	name,
	dynamicValueGroup,
}: {
	name: string,
	dynamicValueGroup: Object,
}): {
	name: string,
	dynamicValueGroup: Object,
	type: 'ADD_BOOTSTRAPPED_DYNAMIC_VALUE_GROUP',
} => {
	return {
		name,
		dynamicValueGroup,
		type: 'ADD_BOOTSTRAPPED_DYNAMIC_VALUE_GROUP',
	};
};
