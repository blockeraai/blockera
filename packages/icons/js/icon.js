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
import { CursorIcon } from './library-cursor/index';
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
			return <BlockeraUIIcon library={library} {...props} />;

		case 'blockera':
			return <BlockeraIcon library={library} {...props} />;

		case 'cursor':
			return <CursorIcon library={library} {...props} />;

		default:
			return <WPIcon library={library} {...props} />;
	}
}

export function getIcon(
	iconName: string,
	libraryName: IconLibraryTypes = 'ui',
	standardize: boolean = true
): null | Object {
	if (!isValidIconLibrary(libraryName)) {
		console.warn(
			`Icon library is not correct or not found. Library: '${libraryName}', Icon: '${iconName}'`
		);
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

	console.warn(
		`Icon id is not correct or not found. Icon: '${iconName}', Library: '${libraryName}'`
	);
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

	if (['blockera', 'ui', 'cursor'].includes(library)) {
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
