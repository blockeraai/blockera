// @flow

/**
 * External dependencies
 */
import Fuse from 'fuse.js';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import searchIndex from './search-index.json';
import searchIndex2 from './search-index-2.json';
import type { IconLibraryTypes, IconLibrary } from './types';
// WP Library
import { WPIcons } from './library-wp';
import { default as WPLibraryIcon } from './library-wp/library-icon';
import WPIconsSearchData from './library-wp/search-data.json';
// FontAwesome Library
import { FaRegularIcons } from './library-faregular';
import { default as FaRegularLibraryIcon } from './library-faregular/library-icon';
import FaRegularIconsSearchData from './library-faregular/search-data.json';
// FontAwesome Brands Library
import { FaBrandsIcons } from './library-fabrands';
import { default as FaBrandsLibraryIcon } from './library-fabrands/library-icon';
import FaBrandsIconsSearchData from './library-fabrands/search-data.json';
// FontAwesome Solid Library
import { FaSolidIcons } from './library-fasolid';
import { default as FaSolidLibraryIcon } from './library-fasolid/library-icon';
import FaSolidIconsSearchData from './library-fasolid/search-data.json';
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
// Brands Library
import { BrandsIcons } from './library-brands';
import BrandsIconsSearchData from './library-brands/search-data.json';
// Essentials Library
import { EssentialsIcons } from './library-essentials';
import { default as EssentialsLibraryIcon } from './library-essentials/library-icon';
import EssentialsIconsSearchData from './library-essentials/search-data.json';
import { default as BrandsIcon } from './library-brands/library-icon';
import searchLibraries from './search-libraries.json';
import searchLibraries2 from './search-libraries-2.json';

export const IconLibraries: {
	[key: string]: IconLibrary,
} = {
	wp: {
		id: 'wp',
		// translators: Icon library name
		name: __('WordPress Icons', 'blockera'),
		icon: <WPLibraryIcon />,
		count: Object.keys(WPIcons).length,
	},
	faregular: {
		id: 'faregular',
		// translators: Icon library name
		name: __('FontAwesome Regular', 'blockera'),
		icon: <FaRegularLibraryIcon />,
		count: Object.keys(FaRegularIcons).length,
	},
	fasolid: {
		id: 'fasolid',
		// translators: Icon library name
		name: __('FontAwesome Solid', 'blockera'),
		icon: <FaSolidLibraryIcon />,
		count: Object.keys(FaSolidIcons).length,
	},
	fabrands: {
		id: 'fabrands',
		// translators: Icon library name
		name: __('FontAwesome Brands', 'blockera'),
		icon: <FaBrandsLibraryIcon />,
		count: Object.keys(FaBrandsIcons).length,
	},
	brands: {
		id: 'brands',
		// translators: Icon library name
		name: __('Brands', 'blockera'),
		icon: <BrandsIcon />,
		count: Object.keys(BrandsIcons).length,
	},
	blockera: {
		id: 'blockera',
		// translators: Icon library name
		name: __('Blockera Branding', 'blockera'),
		icon: <LibraryIcon />,
		count: Object.keys(BlockeraIcons).length,
	},
	ui: {
		id: 'ui',
		// translators: Icon library name
		name: __('User Interface', 'blockera'),
		icon: <LibraryUIIcon />,
		count: Object.keys(BlockeraUIIcons).length,
	},
	cursor: {
		id: 'cursor',
		// translators: Icon library name
		name: __('Cursors', 'blockera'),
		icon: <LibraryCursorIcon />,
		count: Object.keys(CursorIcons).length,
	},
	essentials: {
		id: 'essentials',
		// translators: Icon library name
		name: __('Essentials', 'blockera'),
		icon: <EssentialsLibraryIcon />,
		count: Object.keys(EssentialsIcons).length,
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

		case 'faregular':
			return FaRegularIcons;

		case 'fabrands':
			return FaBrandsIcons;

		case 'fasolid':
			return FaSolidIcons;

		case 'cursor':
			return CursorIcons;

		case 'brands':
			return BrandsIcons;

		case 'essentials':
			return EssentialsIcons;
	}

	return {};
}

function _getLibraryIcons(library: IconLibraryTypes): Array<any> {
	switch (library) {
		case 'wp':
			return WPIconsSearchData;
		case 'faregular':
			return FaRegularIconsSearchData;
		case 'fabrands':
			return FaBrandsIconsSearchData;
		case 'fasolid':
			return FaSolidIconsSearchData;
		case 'blockera':
			return IconsSearchData;
		case 'cursor':
			return CursorIconsSearchData;
		case 'brands':
			return BrandsIconsSearchData;
		case 'essentials':
			return EssentialsIconsSearchData;
	}

	return [];
}

export function getIconLibrarySearchData(
	library: IconLibraryTypes | 'all'
): Array<any> {
	const searchData: Array<any> = [];

	if (library === 'all' || library === 'all2' || isValidIconLibrary(library))
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

			case 'all2':
				searchLibraries2.forEach((library) => {
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

export function getIconLibrariesSearchIndex(
	library: IconLibraryTypes | 'all' | 'all2'
): Object {
	if (library === 'all2' || searchLibraries2.includes(library)) {
		return Fuse.parseIndex(searchIndex2);
	}

	return Fuse.parseIndex(searchIndex);
}
