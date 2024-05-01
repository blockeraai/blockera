// @flow

/**
 * Internal dependencies
 */
import { isEquals } from '../array';
import { omit } from '../object';

/**
 * Retrieve result of equal props in any component with object structure!
 *
 * @param {Object} prevProps the older component props
 * @param {Object} nextProps the newest component props
 * @return {boolean} true on success, false on otherwise!
 */
export function hasSameProps(
	// eslint-disable-next-line no-undef
	prevProps: $ReadOnly<Object> | Array<any>,
	// eslint-disable-next-line no-undef
	nextProps: $ReadOnly<Object> | Array<any>
): boolean {
	if (prevProps?.hasOwnProperty('setSettings')) {
		const keys = ['setSettings', 'handleOnChangeAttributes'];

		// Debug code!
		// 	console.log(
		// 		detailedDiff(omit(prevProps, keys), omit(nextProps, keys)),
		// 		isEquals(omit(prevProps, keys), omit(nextProps, keys))
		// 	);

		return isEquals(omit(prevProps, keys), omit(nextProps, keys));
	}

	return isEquals(prevProps, nextProps);
}
