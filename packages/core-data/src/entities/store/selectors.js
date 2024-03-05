// @flow

export const getEntities = ({
	entities,
}: {
	entities: { [key: string]: Object },
}): Object => {
	return entities;
};

/**
 * Retrieve the entity by name of core-data.
 *
 * @param {Object} state the state of core-data.
 * @param {string} name the entity name.
 * @return {Object} the entity object.
 */
export const getEntity = (
	{
		entities,
	}: {
		entities: { [key: string]: Object },
	},
	name: string
): Object => {
	return entities[name];
};

/**
 * Retrieve Theme entity of core-data.
 *
 * @param {Object} state the core-data state.
 * @return {Object} the theme registered entity.
 */
export const getThemeEntity = (state: Object): Object => {
	return getEntity(state, 'theme');
};

export * from './theme-selectors';
