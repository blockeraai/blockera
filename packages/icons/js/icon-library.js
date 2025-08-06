// @flow

/**
 * External dependencies
 */
import Fuse from 'fuse.js';
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import searchIndex from './search-index.json';
import type { IconLibraryTypes } from './types';
// WP Library
import { WPIcons } from './library-wp';
import { default as WPLibraryIcon } from './library-wp/library-icon';
import WPIconsSearchData from './library-wp/search-data.json';
// FontAwesome Library
import { FaIcons } from './library-fontawesome';
import { default as FaLibraryIcon } from './library-fontawesome/library-icon';
import FaIconsSearchData from './library-fontawesome/search-data.json';
// Blockera Library
import { BlockeraIcons } from './library-blockera';
import { default as LibraryIcon } from './library-blockera/library-icon';
import IconsSearchData from './library-blockera/search-data.json';
// UI Library
import { BlockeraUIIcons } from './library-ui';
import { default as LibraryUIIcon } from './library-ui/library-icon';
// Cursor Library
import { CursorIcons } from './library-cursor';
import CursorIconsSearchData from './library-cursor/search-data.json';
import { default as LibraryCursorIcon } from './library-cursor/library-icon';
// Social Library
import { SocialIcons } from './library-social';
import SocialIconsSearchData from './library-social/search-data.json';
import { default as SocialIcon } from './library-social/library-icon';
import searchLibraries from './search-libraries.json';

export const IconLibraries: {
	[key: string]: {
		id: IconLibraryTypes,
		name: string,
		icon: MixedElement,
	},
} = {
	wp: {
		id: 'wp',
		// translators: Icon library name
		name: __('WordPress', 'blockera'),
		icon: <WPLibraryIcon />,
	},
	fontawesome: {
		id: 'fontawesome',
		// translators: Icon library name
		name: __('FontAwesome', 'blockera'),
		icon: <FaLibraryIcon />,
	},
	social: {
		id: 'social',
		// translators: Icon library name
		name: __('Social', 'blockera'),
		icon: <SocialIcon />,
	},
	blockera: {
		id: 'blockera',
		// translators: Icon library name
		name: __('Blockera Branding', 'blockera'),
		icon: <LibraryIcon />,
	},
	ui: {
		id: 'ui',
		// translators: Icon library name
		name: __('User Interface', 'blockera'),
		icon: <LibraryUIIcon />,
	},
	cursor: {
		id: 'cursor',
		// translators: Icon library name
		name: __('Cursors', 'blockera'),
		icon: <LibraryCursorIcon />,
	},
};

export function isValidIconLibrary(library: IconLibraryTypes): boolean {
	return !isUndefined(IconLibraries[library]);
}

export function getIconLibrary(library: IconLibraryTypes | 'all'): Object {
	const libs: { [key: string]: any } = {};

	if (library === 'all') {
		for (const key in IconLibraries) {
			libs[key] = IconLibraries[key];
		}
	} else if (isValidIconLibrary(library)) {
		libs[library] = IconLibraries[library];
	}

	return libs;
}

export function getIconLibraryIcons(iconLibrary: IconLibraryTypes): Object {
	if (!isValidIconLibrary(iconLibrary)) {
		return {};
	}

	switch (iconLibrary) {
		case 'ui':
			return BlockeraUIIcons;

		case 'blockera':
			return BlockeraIcons;

		case 'wp':
			return WPIcons;

		case 'fontawesome':
			return FaIcons;

		case 'cursor':
			return CursorIcons;

		case 'social':
			return SocialIcons;
	}

	return {};
}

function _getLibraryIcons(library: IconLibraryTypes): Array<any> {
	switch (library) {
		case 'wp':
			return WPIconsSearchData;
		case 'fontawesome':
			return FaIconsSearchData;
		case 'blockera':
			return IconsSearchData;
		case 'cursor':
			return CursorIconsSearchData;
		case 'social':
			return SocialIconsSearchData;
	}

	return [];
}

export function getIconLibrarySearchData(
	library: IconLibraryTypes | 'all'
): Array<any> {
	const searchData: Array<any> = [];

	if (library === 'all' || isValidIconLibrary(library))
		switch (library) {
			case 'all':
				searchLibraries.forEach((library) => {
					// $FlowFixMe
					Array.prototype.push.apply(
						searchData,
						_getLibraryIcons(library)
					);
				});
				break;

			default:
				// $FlowFixMe
				Array.prototype.push.apply(
					searchData,
					_getLibraryIcons(library)
				);
				break;
		}

	return searchData;
}

export function getIconLibrariesSearchIndex(): Object {
	return Fuse.parseIndex(searchIndex);
}
