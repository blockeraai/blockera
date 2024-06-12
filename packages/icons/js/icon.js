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
import { isValidIconLibrary, getIconLibraryIcons } from './icon-library';

export function Icon({ library, uploadSVG, ...props }: Object): MixedElement {
	if (uploadSVG) {
		return <img alt={uploadSVG.title} src={uploadSVG.url} />;
	}

	if (!props.icon || !library) {
		return <></>;
	}

	switch (library) {
		case 'blockera':
			return <BlockeraIcon {...props} />;

		default:
			return <WPIcon {...props} />;
	}
}

export function getIcon(
	iconName: string,
	libraryName: string,
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
	library: string,
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

	if (library === 'blockera') {
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
