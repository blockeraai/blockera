// @flow

/**
 * Internal dependencies
 */
import { getThemeEntity } from './selectors';

export const getCurrentTheme = (state: Object): Object => {
	return getThemeEntity(state);
};
