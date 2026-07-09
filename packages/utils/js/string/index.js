// @flow

export function ucFirstWord(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getPascalCase(str: string): string {
	return str.replace(/(\w)(\w*)/g, function (_, first, rest) {
		return first.toUpperCase() + rest.toLowerCase();
	});
}

export function getCamelCase(str: string, removePart: string): string {
	if (removePart) {
		str = str.replace(removePart, '');
	}

	return str.substring(0, 1).toLowerCase() + str.substring(1, str.length);
}

/**
 * Check if the input string is a valid JSON string.
 *
 * @param {string} str - The input string to be checked.
 * @return {boolean} Returns true if the input string is a valid JSON string, otherwise false.
 */
export function isJSONString(str: string): boolean {
	try {
		return !!JSON.parse(str);
	} catch (error) {
		return false;
	}
}

/**
 * Generates a shortened version of the given string by creating a hash and converting it to a base-36 string.
 *
 * @param {string} bigHash - The input string to shorten.
 * @return {string} The shortened string.
 *
 * @example
 * getSmallHash('9810d7ec-eb38-4931-8159-e3a3595e8233');
 * Results => 'k1l2m3n4'
 */
export function getSmallHash(bigHash: string): string {
	let hash = 0;

	for (let i = 0; i < bigHash.length; i++) {
		// eslint-disable-next-line no-bitwise
		hash = bigHash.charCodeAt(i) + ((hash << 5) - hash);
		// eslint-disable-next-line no-bitwise
		hash = hash & hash; // Convert to 32bit integer
	}

	return hash.toString(36); // Convert to base-36 string
}
