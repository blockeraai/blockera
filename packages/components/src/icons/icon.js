/**
 * Publisher dependencies
 */
import { isFunction, isUndefined } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { WPIcon } from './library-wp/index';
import { FontAwesomeIconFas } from './library-fas/index';
import { FontAwesomeIconFar } from './library-far/index';
import { PublisherIcon } from './library-publisher/index';
import { isValidIconLibrary, getIconLibraryIcons } from './icon-library';

export function Icon({ library, uploadSVG, ...props }) {
	if (uploadSVG) {
		return <img alt={uploadSVG.title} src={uploadSVG.url} />;
	}

	if (!props.icon || !library) {
		return <></>;
	}

	switch (library) {
		case 'far':
			return <FontAwesomeIconFar {...props} />;

		case 'fas':
			return <FontAwesomeIconFas {...props} />;

		case 'publisher':
			return <PublisherIcon {...props} />;

		default:
			return <WPIcon {...props} />;
	}
}

export function getIcon(
	iconName: string,
	libraryName: string,
	standardize = true
) {
	if (!isValidIconLibrary(libraryName)) {
		return null;
	}

	const lib = getIconLibraryIcons(libraryName);

	if (!isUndefined(lib[iconName])) {
		if (standardize) {
			return createStandardIconObject(
				iconName,
				libraryName,
				lib[iconName]
			);
		}

		return { iconName, library: libraryName, icon: lib[iconName] };
	}

	return null;
}

export function isValidIcon(icon, key) {
	const excluded = ['Icon'];

	if (null === icon) {
		return false;
	}

	if (key && excluded.includes(key)) {
		return false;
	}

	return !isFunction(icon);
}

export function createStandardIconObject(iconName, library, icon) {
	// use getIcon if the icon shape did not provide
	if (icon === null) {
		return getIcon(iconName, library, false);
	}

	// Fix for incorrect icon objects inside FA
	if (library === 'far' || library === 'fas') {
		if (icon?.icon) {
			return {
				icon,
				iconName,
				library,
			};
		}

		icon = getIcon(iconName, library, false);

		return {
			icon: icon.icon,
			iconName,
			library,
		};
	}

	if (library === 'wp') {
		if (!icon?.icon) {
			return getIcon(iconName, library, false);
		}

		if (icon?.icon) {
			return {
				icon: icon.icon,
				iconName,
				library,
			};
		}

		return {
			icon: '',
			iconName,
			library,
		};
	}

	if (library === 'publisher') {
		if (isFunction(icon)) {
			return {
				icon,
				iconName,
				library,
			};
		}

		if (!icon?.icon) {
			return getIcon(iconName, library, false);
		}
	}

	if (icon?.icon) {
		return {
			icon: icon.icon,
			iconName,
			library,
		};
	}

	return {
		icon,
		iconName,
		library,
	};
}
