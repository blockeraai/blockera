/**
 * External dependencies
 */
import Fuse from 'fuse.js';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { isUndefined } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { FontAwesomeFarIcons } from './library-far';
import { FontAwesomeFasIcons } from './library-fas';
import { WPIcons } from './library-wp';
import { PublisherIcons } from './library-publisher';

import WPIconsSearchData from './library-wp/search-data.json';
import FarIconsSearchData from './library-far/search-data.json';
import FasIconsSearchData from './library-fas/search-data.json';
import PublisherIconsSearchData from './library-publisher/search-data.json';
import searchIndex from './search-index.json';

import { default as WPLibraryIcon } from './library-wp/library-icon';
import { default as PublisherLibraryIcon } from './library-publisher/library-icon';
import { default as FarLibraryIcon } from './library-far/library-icon';
import { default as FasLibraryIcon } from './library-fas/library-icon';

const IconLibraries = {
	wp: {
		id: 'wp',
		// translators: Icon library name
		name: __('WordPress', 'publisher-core'),
		icon: <WPLibraryIcon />,
	},
	publisher: {
		id: 'publisher',
		// translators: Icon library name
		name: __('Publisher', 'publisher-core'),
		icon: <PublisherLibraryIcon />,
	},
	far: {
		id: 'far',
		// translators: Icon library name
		name: __('FontAwesome Regular', 'publisher-core'),
		icon: <FarLibraryIcon />,
	},
	fas: {
		id: 'fas',
		// translators: WordPress icon library name
		name: __('FontAwesome Solid', 'publisher-core'),
		icon: <FasLibraryIcon />,
	},
};

export function isValidIconLibrary(library) {
	return !isUndefined(IconLibraries[library]);
}

export function getIconLibrary(library: string): Array {
	const libs = {};

	if (library === 'all') {
		for (const key in IconLibraries) {
			libs[key] = IconLibraries[key];
		}
	} else if (isValidIconLibrary(library)) {
		libs[library] = IconLibraries[library];
	}

	return libs;
}

export function getIconLibraryIcons(iconLibrary: String): Array {
	if (!isValidIconLibrary(iconLibrary)) {
		return {};
	}

	switch (iconLibrary) {
		case 'publisher':
			return PublisherIcons;

		case 'wp':
			return WPIcons;

		case 'fas':
			return FontAwesomeFasIcons;

		case 'far':
			return FontAwesomeFarIcons;
	}

	return {};
}

export function getIconLibrarySearchData(library: string): Array {
	const searchData = [];

	if (library === 'all' || isValidIconLibrary(library))
		switch (library) {
			case 'all':
				Array.prototype.push.apply(searchData, WPIconsSearchData);
				Array.prototype.push.apply(
					searchData,
					PublisherIconsSearchData
				);
				Array.prototype.push.apply(searchData, FarIconsSearchData);
				Array.prototype.push.apply(searchData, FasIconsSearchData);
				break;

			case 'wp':
				Array.prototype.push.apply(searchData, WPIconsSearchData);
				break;

			case 'publisher':
				Array.prototype.push.apply(
					searchData,
					PublisherIconsSearchData
				);
				break;

			case 'far':
				Array.prototype.push.apply(searchData, FasIconsSearchData);
				break;

			case 'fas':
				Array.prototype.push.apply(searchData, FasIconsSearchData);
				break;
		}

	return searchData;
}

export function getIconLibrariesSearchIndex(): Array {
	return Fuse.parseIndex(searchIndex);
}
