/**
 * Shared theme.json / theme-config key sorting.
 *
 * Bucket order:
 * 1. normal keys
 * 2. pseudo-selectors (`:hover`, …)
 * 3. `css`
 * 4. `elements`
 * 5. `blocks`
 *
 * Within normal keys: scalars first, then object/array values (each group A–Z).
 */

/**
 * @param {string} key Object key name.
 * @return {number} Sort rank for the key bucket.
 */
function themeJsonKeyRank(key) {
	if (key === 'blocks') {
		return 4;
	}
	if (key === 'elements') {
		return 3;
	}
	if (key === 'css') {
		return 2;
	}
	if (key.startsWith(':')) {
		return 1;
	}
	return 0;
}

/**
 * True when the value is an object or array (not a scalar / null).
 *
 * @param {*} value Value to inspect.
 * @return {boolean} Whether the value is an object or array.
 */
function isObjectOrArrayValue(value) {
	return value !== null && typeof value === 'object';
}

/**
 * Compare object keys for deterministic output.
 *
 * @param {string} a Left key.
 * @param {string} b Right key.
 * @param {Object} [parent] Parent object (needed for scalar-vs-object ordering).
 * @return {number} Comparator result for Array#sort.
 */
function compareThemeJsonKeys(a, b, parent) {
	const rankDiff = themeJsonKeyRank(a) - themeJsonKeyRank(b);
	if (rankDiff !== 0) {
		return rankDiff;
	}

	// Within normal keys: scalars before objects/arrays.
	if (themeJsonKeyRank(a) === 0 && parent) {
		const aComplex = isObjectOrArrayValue(parent[a]);
		const bComplex = isObjectOrArrayValue(parent[b]);
		if (aComplex !== bComplex) {
			return aComplex ? 1 : -1;
		}
	}

	return a.localeCompare(b);
}

/**
 * Recursively sort object keys (arrays keep order; values are sorted recursively).
 *
 * @param {*} value Value to sort.
 * @return {*} Sorted clone of the value.
 */
function sortObjectKeys(value) {
	if (Array.isArray(value)) {
		return value.map(sortObjectKeys);
	}

	if (value !== null && typeof value === 'object') {
		return Object.keys(value)
			.sort((a, b) => compareThemeJsonKeys(a, b, value))
			.reduce((result, key) => {
				result[key] = sortObjectKeys(value[key]);
				return result;
			}, {});
	}

	return value;
}

module.exports = {
	themeJsonKeyRank,
	compareThemeJsonKeys,
	sortObjectKeys,
	isObjectOrArrayValue,
};
