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
import { WPIcons } from './library-wp';
import { BlockeraIcons } from './library-blockera';
import { FontAwesomeFarIcons } from './library-far';
import { FontAwesomeFasIcons } from './library-fas';

import WPIconsSearchData from './library-wp/search-data.json';
import FarIconsSearchData from './library-far/search-data.json';
import FasIconsSearchData from './library-fas/search-data.json';
import IconsSearchData from './library-blockera/search-data.json';
import searchIndex from './search-index.json';

import { default as WPLibraryIcon } from './library-wp/library-icon';
import { default as LibraryIcon } from './library-blockera/library-icon';
import { default as FarLibraryIcon } from './library-far/library-icon';
import { default as FasLibraryIcon } from './library-fas/library-icon';

const IconLibraries = {
	wp: {
		id: 'wp',
		// translators: Icon library name
		name: __('WordPress', 'blockera-core'),
		icon: <WPLibraryIcon />,
	},
	blockera: {
		id: 'blockera',
		// translators: Icon library name
		name: __('', 'blockera-core'),
		icon: <LibraryIcon />,
	},
	far: {
		id: 'far',
		// translators: Icon library name
		name: __('FontAwesome Regular', 'blockera-core'),
		icon: <FarLibraryIcon />,
	},
	fas: {
		id: 'fas',
		// translators: WordPress icon library name
		name: __('FontAwesome Solid', 'blockera-core'),
		icon: <FasLibraryIcon />,
	},
};

export function isValidIconLibrary(library: string): boolean {
	return !isUndefined(IconLibraries[library]);
}

export function getIconLibrary(library: string): Object {
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

export function getIconLibraryIcons(iconLibrary: string): Object {
	if (!isValidIconLibrary(iconLibrary)) {
		return {};
	}

	switch (iconLibrary) {
		case 'blockera':
			return BlockeraIcons;

		case 'wp':
			return WPIcons;

		case 'fas':
			return FontAwesomeFasIcons;

		case 'far':
			return FontAwesomeFarIcons;
	}

	return {};
}

export function getIconLibrarySearchData(library: string): Array<any> {
	const searchData: Array<any> = [];

	if (library === 'all' || isValidIconLibrary(library))
		switch (library) {
			case 'all':
				// $FlowFixMe
				Array.prototype.push.apply(searchData, WPIconsSearchData);
				// $FlowFixMe
				Array.prototype.push.apply(searchData, IconsSearchData);
				// $FlowFixMe
				Array.prototype.push.apply(searchData, FarIconsSearchData);
				// $FlowFixMe
				Array.prototype.push.apply(searchData, FasIconsSearchData);
				// $FlowFixMe
				break;

			case 'wp':
				// $FlowFixMe
				Array.prototype.push.apply(searchData, WPIconsSearchData);
				break;

			case 'blockera':
				// $FlowFixMe
				Array.prototype.push.apply(searchData, IconsSearchData);
				break;

			case 'far':
				// $FlowFixMe
				Array.prototype.push.apply(searchData, FasIconsSearchData);
				break;

			case 'fas':
				// $FlowFixMe
				Array.prototype.push.apply(searchData, FasIconsSearchData);
				break;
		}

	return searchData;
}

export function getIconLibrariesSearchIndex(): Object {
	return Fuse.parseIndex(searchIndex);
}
