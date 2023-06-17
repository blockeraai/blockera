/**
 * WordPress dependencies
 */
import * as wpIcons from '@wordpress/icons';

/**
 * Internal dependencies
 */
import wpDataSource from './wp/icons.json';
import farDataSource from './far/icons.json';
import fasDataSource from './fas/icons.json';
import publisherDataSource from './publisher/icons.json';

/**
 * External dependencies
 */
import * as fasIcons from '@fortawesome/free-solid-svg-icons';
import * as farIcons from '@fortawesome/free-regular-svg-icons';
import Fuse from 'fuse.js';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import * as publisherIcons from '@publisher/icons';
import { Icon } from '@publisher/components';

export function getFuzzySearchResult({ query, dataSource }) {
	if (!query) {
		return [];
	}

	const fuse = new Fuse(dataSource, {
		includeScore: true,
		keys: ['name', 'tags'],
	});

	const result = fuse.search(query);
	const finalResult = [];

	if (!result?.length) {
		return [];
	}

	result.forEach((foundItem) => finalResult.push(foundItem.item));

	return finalResult;
}

export function getIconEntity({ iconType, name }) {
	const libraries = iconLibraries();

	if (!libraries.hasOwnProperty(iconType)) {
		return null;
	}

	const iconLibrary = libraries[iconType];

	return iconLibrary[name] ?? null;
}

export function iconLibraries() {
	return {
		wp: wpIcons,
		far: farIcons,
		fas: fasIcons,
		publisher: publisherIcons,
	};
}

export function iconDataSources() {
	const isValidIconDataset = (iconItem) => 'object' === typeof iconItem;

	return {
		wp: wpDataSource.filter(isValidIconDataset),
		far: farDataSource.filter(isValidIconDataset),
		fas: fasDataSource.filter(isValidIconDataset),
		publisher: publisherDataSource.filter(isValidIconDataset),
	};
}

export function getDataSource() {
	const dataSource = [];
	const dataSources = Object.values(iconDataSources());

	for (const key in dataSources) {
		if (!Object.hasOwnProperty.call(dataSources, key)) {
			continue;
		}

		const libraryData = dataSources[key];

		Array.prototype.push.apply(dataSource, libraryData);
	}

	return dataSource;
}

/**
 * Retrieve recommendation list of icons.
 * you can use extendedSearch to retrieve list with advanced searching allow to fine-tune results.
 * or pass static list of icons.
 *
 * @see https://fusejs.io/examples.html#extended-search
 * jscript 	fuzzy-match 	Items that fuzzy match jscript
 *=scheme 	exact-match 	Items that are scheme
 *'python 	include-match 	Items that include python
 *!ruby 	inverse-exact-match 	Items that do not include ruby
 *^java 	prefix-exact-match 	Items that start with java
 *!^earlang 	inverse-prefix-exact-match 	Items that do not start with earlang
 *.js$ 	suffix-exact-match 	Items that end with .js
 *!.go$ 	inverse-suffix-exact-match 	Items that do not end with .go
 */
export function getRecommendation({
	size,
	search,
	limit = null,
	handleOnIconClick,
	fixedSizing = false,
}) {
	let foundItems = [];
	const query = typeof search === 'function' ? search() : search;

	if (Array.isArray(query)) {
		foundItems = query;
	} else {
		foundItems = getFuzzySearchResult({
			query,
			key: ['name', 'tags'],
			minMatchCharLength: 3,
			useExtendedSearch: true,
			dataSource: getDataSource(),
		});
	}

	if (!foundItems?.length) {
		return foundItems;
	}

	const mappedItems = (row, index) => {
		const iconEntity = getIconEntity(row);

		if (!iconEntity) {
			return null;
		}

		return Icon({
			size,
			icon: iconEntity,
			iconname: row.name,
			type: row.iconType,
			key: `recommended-icon-${index}`,
			onClick: (event) =>
				handleOnIconClick(event, {
					type: 'UPDATE_ICON',
					name: row.name,
					iconType: row.iconType,
				}),
			className: classnames(
				'publisher-core-icon-pointer',
				`publisher-core-icon-${row.name}`,
				-1 !== row.iconType.indexOf('fa')
					? 'publisher-core-is-pro-icon'
					: ''
			),
			fixedSizing,
		});
	};

	const result = foundItems.map(mappedItems).filter((icon) => null !== icon);

	if (limit) {
		return result.slice(0, limit);
	}

	return result;
}

export { wpDataSource, farDataSource, fasDataSource, publisherDataSource };
