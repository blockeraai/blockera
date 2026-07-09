//@flow

/**
 * Returns a kebab-cased string of the given icon component name.
 * for example `Device2xlDesktop` becomes `device-2xl-desktop`
 *
 * @param {string} str - The string to convert to kebab-case.
 * @return {string} The kebab-cased string.
 */
export function getIconKebabId(str: string): string {
	return str.replace(/[A-Z0-9]/g, (match, index) => {
		if (index === 0) {
			return match.toLowerCase();
		} else if (/[0-9]/.test(match)) {
			return `-${match}`;
		}
		return `-${match.toLowerCase()}`;
	});
}
