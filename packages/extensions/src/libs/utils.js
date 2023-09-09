/**
 * Retrieve reply to question "is array equals?".
 *
 * @param {Array<any>} a first array
 * @param {Array<any>} b second array
 * @return {boolean} true on success, false when otherwise!
 */
export function arrayEquals(a: Array, b: Array): boolean {
	return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Creation extension id with block name.
 *
 * @param {string} blockName
 * @param {string} clientId
 * @param {string} id
 * @return {string} retrieved extension standard identifier.
 */
export function generateExtensionId({ blockName, clientId }, id) {
	return `${blockName}/${id}/${clientId}`;
}

/**
 * Retrieve result of equal props in any component with object structure!
 *
 * @param {Object} prevProps the older component props
 * @param {Object} nextProps the newest component props
 * @return {boolean} true on success, false on otherwise!
 */
export function hasSameProps(prevProps, nextProps) {
	return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}
