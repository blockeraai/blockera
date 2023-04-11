/**
 * WordPress dependencies
 */
import * as wpIcons from '@wordpress/icons';

/**
 * External dependencies
 */
import * as fasIcons from '@fortawesome/free-solid-svg-icons';
import * as farIcons from '@fortawesome/free-regular-svg-icons';
/**
 * Internal dependencies
 */
import * as publisherIcons from './index';

export function getIconLibrary(library: string): Array {
	const libs = {
		publisher: getEntriesIconLibrary(publisherIcons),
		wp: getEntriesIconLibrary(wpIcons),
		far: getEntriesIconLibrary(farIcons),
		fas: getEntriesIconLibrary(fasIcons),
	};

	if ('all' === library) {
		return libs;
	}

	return libs[library] ? libs[library] : [];
}

export function getEntriesIconLibrary(iconLibrary: Object): Array {
	const entries = Object.entries(iconLibrary);
	const excluded = ['Icon', 'lineDashed', 'lineDotted', 'lineSolid'];

	function isValid(icon) {
		if (!icon[0] || !iconLibrary[icon[0]]) {
			return false;
		}

		if (excluded.includes(icon[0])) {
			return false;
		}

		if ('function' === typeof icon[1]) {
			return false;
		}

		return true;
	}

	const ignoreNullValue = (icon) => null !== icon;

	return entries
		.map((icon) => (!isValid(icon) ? null : icon))
		.filter(ignoreNullValue);
}

export function getIcon(iconName: string, libraryName: string) {
	const lib = getIconLibrary(libraryName);

	for (const key in lib) {
		if (!Object.hasOwnProperty.call(lib, key)) {
			continue;
		}

		if (lib[key][0] !== iconName) {
			continue;
		}

		return lib[key][1];
	}

	return null;
}
