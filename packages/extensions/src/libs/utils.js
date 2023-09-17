// @flow
/**
 * Internal dependencies
 */
import type { BlockProps } from './types';

/**
 * Retrieve reply to question "is array equals?".
 *
 * @param {Array<any>} a first array
 * @param {Array<any>} b second array
 * @return {boolean} true on success, false when otherwise!
 */
export function arrayEquals(a: Array<any>, b: Array<any>): boolean {
	return hasSameProps(a, b);
}

/**
 * Creation extension id with block name.
 *
 * @param {string} blockName
 * @param {string} clientId
 * @param {string} id
 * @return {string} retrieved extension standard identifier.
 */
export function generateExtensionId(
	{ blockName, clientId }: BlockProps,
	id: string
): string {
	return `${blockName}/${id}/${clientId}`;
}

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
	return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}
