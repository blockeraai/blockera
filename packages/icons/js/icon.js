// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { isFunction, isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { WPIcon } from './library-wp/index';
import { BlockeraIcon } from './library-blockera/index';
import { BlockeraUIIcon } from './library-ui/index';
import { isValidIconLibrary, getIconLibraryIcons } from './icon-library';
import type { IconProps, IconLibraryTypes } from './types';

export function Icon({
	library = 'ui',
	uploadSVG,
	...props
}: IconProps): MixedElement {
	if (uploadSVG) {
		return <img alt={uploadSVG.title} src={uploadSVG.url} />;
	}

	if (!props.icon || !library) {
		return <></>;
	}

	switch (library) {
		case 'ui':
			return <BlockeraUIIcon {...props} />;

		case 'blockera':
			return <BlockeraIcon {...props} />;

		default:
			return <WPIcon {...props} />;
	}
}

export function getIcon(
	iconName: string,
	libraryName: IconLibraryTypes = 'ui',
	standardize: boolean = true
): null | Object {
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

export function isValidIcon(icon: any, key: void | string): boolean {
	const excluded = ['Icon'];

	if (null === icon) {
		return false;
	}

	if (key && excluded.includes(key)) {
		return false;
	}

	return !isFunction(icon);
}

export function createStandardIconObject(
	iconName: string,
	library: IconLibraryTypes = 'ui',
	icon: Object
): Object {
	// use getIcon if the icon shape did not provide
	if (icon === null) {
		return getIcon(iconName, library, false);
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

	if (library === 'blockera' || library === 'ui') {
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
