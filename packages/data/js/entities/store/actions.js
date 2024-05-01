// @flow

export const addBootstrappedEntity = (name: string, entity: Object): Object => {
	return {
		name,
		entity,
		type: 'ADD_BOOTSTRAPPED_ENTITIES',
	};
};
