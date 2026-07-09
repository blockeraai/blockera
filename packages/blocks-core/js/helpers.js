// @flow

/**
 * Generates a random UUID (version 4).
 *
 * @return {string} UUID.
 */
export const generateUuid4 = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
		/[xy]/g,
		function (c) {
			const r = Math.floor(Math.random() * 16);
			const v = c === 'x' ? r : (r % 4) + 8;

			return v.toString(16);
		}
	);
};
