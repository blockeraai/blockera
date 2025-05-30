// @flow

/**
 * External dependencies
 */
import removeAccents from 'remove-accents';

/**
 * Blockera dependencies
 */
import { noCase } from '@blockera/utils';

// Default search helpers.
const defaultGetName = (item: Object) => item.name || '';
const defaultGetType = (item: Object) => item.type || '';
const defaultGetLabel = (item: Object) => item.label || '';
const defaultGetTitle = (item: Object) => item.title;
const defaultGetDescription = (item: Object) => item.description || '';
const defaultGetKeywords = (item: Object) => item.keywords || [];
const defaultGetCategory = (item: Object) => item.category;
const defaultGetCollection = () => null;

// Normalization regexes
const splitRegexp = [
	/([\p{Ll}\p{Lo}\p{N}])([\p{Lu}\p{Lt}])/gu, // One lowercase or digit, followed by one uppercase.
	/([\p{Lu}\p{Lt}])([\p{Lu}\p{Lt}][\p{Ll}\p{Lo}])/gu, // One uppercase followed by one uppercase and one lowercase.
];
const stripRegexp = /(\p{C}|\p{P}|\p{S})+/giu; // Anything that's not a punctuation, symbol or control/format character.

// Normalization cache
const extractedWords: Map<any, any> = new Map();
const normalizedStrings: Map<any, any> = new Map();

/**
 * Extracts words from an input string.
 *
 * @param {string} input The input string.
 *
 * @return {Array} Words, extracted from the input string.
 */
export function extractWords(input: string = ''): any {
	if (extractedWords.has(input)) {
		return extractedWords.get(input);
	}

	const result = noCase(input, {
		splitRegexp,
		stripRegexp,
	})
		.split(' ')
		.filter(Boolean);

	extractedWords.set(input, result);

	return result;
}

/**
 * Sanitizes the search input string.
 *
 * @param {string} input The search input to normalize.
 *
 * @return {string} The normalized search input.
 */
export function normalizeString(input: string = ''): any {
	if (normalizedStrings.has(input)) {
		return normalizedStrings.get(input);
	}

	// Disregard diacritics.
	//  Input: "média"
	let result = removeAccents(input);

	// Accommodate leading slash, matching autocomplete expectations.
	//  Input: "/media"
	result = result.replace(/^\//, '');

	// Lowercase.
	//  Input: "MEDIA"
	result = result.toLowerCase();

	normalizedStrings.set(input, result);

	return result;
}

/**
 * Converts the search term into a list of normalized terms.
 *
 * @param {string} input The search term to normalize.
 *
 * @return {string[]} The normalized list of search terms.
 */
export const getNormalizedSearchTerms = (input: string = ''): Array<string> => {
	return extractWords(normalizeString(input));
};

const removeMatchingTerms = (
	unmatchedTerms: Array<any>,
	unprocessedTerms: string
) => {
	return unmatchedTerms.filter(
		(term) =>
			!getNormalizedSearchTerms(unprocessedTerms).some(
				(unprocessedTerm) => unprocessedTerm.includes(term)
			)
	);
};

export const search = (
	items: Array<any>,
	categories: Array<any>,
	collections: Array<any>,
	searchInput: string
): Array<any> => {
	const normalizedSearchTerms = getNormalizedSearchTerms(searchInput);
	if (normalizedSearchTerms.length === 0) {
		return items;
	}

	const config = {
		getCategory: (item: Object) =>
			categories.find(({ slug }) => slug === item.category)?.title,
		getCollection: (item: Object) => {
			// Safely handle undefined values
			const itemIdentifier = item?.name || item?.type;
			if (!itemIdentifier) {
				return null;
			}

			const foundedItem = collections[itemIdentifier.split('/')[0]];
			return foundedItem?.title || foundedItem?.label;
		},
	};

	return searchItems(items, searchInput, config);
};

/**
 * Filters an item list given a search term.
 *
 * @param {Array}  items       Item list
 * @param {string} searchInput Search input.
 * @param {Object} config      Search Config.
 *
 * @return {Array} Filtered item list.
 */
export const searchItems = (
	items: Array<any> = [],
	searchInput: string = '',
	config: Object = {}
): Array<any> => {
	const normalizedSearchTerms = getNormalizedSearchTerms(searchInput);
	if (normalizedSearchTerms.length === 0) {
		return items;
	}

	const rankedItems = items
		.map((item) => {
			return [item, getItemSearchRank(item, searchInput, config)];
		})
		.filter(([, rank]) => rank > 0);

	rankedItems.sort(([, rank1], [, rank2]) => rank2 - rank1);
	return rankedItems.map(([item]) => item);
};

/**
 * Get the search rank for a given item and a specific search term.
 * The better the match, the higher the rank.
 * If the rank equals 0, it should be excluded from the results.
 *
 * @param {Object} item       Item to filter.
 * @param {string} searchTerm Search term.
 * @param {Object} config     Search Config.
 *
 * @return {number} Search Rank.
 */
export function getItemSearchRank(
	item: Object,
	searchTerm: string,
	config: Object = {}
): number {
	const {
		getName = defaultGetName,
		getType = defaultGetType,
		getLabel = defaultGetLabel,
		getTitle = defaultGetTitle,
		getDescription = defaultGetDescription,
		getKeywords = defaultGetKeywords,
		getCategory = defaultGetCategory,
		getCollection = defaultGetCollection,
	} = config;

	const name = getName(item);
	const type = getType(item);
	const label = getLabel(item);
	const title = getTitle(item);
	const description = getDescription(item);
	const keywords = getKeywords(item);
	const category = getCategory(item);
	const collection = getCollection(item);

	const normalizedSearchInput = normalizeString(searchTerm);
	const normalizedTitle = normalizeString(title);

	let rank = 0;

	// Prefers exact matches
	// Then prefers if the beginning of the title matches the search term
	// name, keywords, categories, collection, variations match come later.
	if (normalizedSearchInput === normalizedTitle) {
		rank += 30;
	} else if (normalizedTitle.startsWith(normalizedSearchInput)) {
		rank += 20;
	} else {
		const terms = [
			name,
			type,
			label,
			title,
			description,
			...keywords,
			category,
			collection,
		].join(' ');
		const normalizedSearchTerms = extractWords(normalizedSearchInput);
		const unmatchedTerms = removeMatchingTerms(
			normalizedSearchTerms,
			terms
		);

		if (unmatchedTerms.length === 0) {
			rank += 10;
		}
	}

	// Give a better rank to "core" namespaced items.
	if (rank !== 0 && name.startsWith('core/')) {
		const isCoreBlockVariation = name !== item.id;
		// Give a bit better rank to "core" blocks over "core" block variations.
		rank += isCoreBlockVariation ? 1 : 2;
	}

	return rank;
}

export const getNormalizedCssSelector = (search: string): string => {
	return '&' === search[0] ? search : `&${search}`;
};
