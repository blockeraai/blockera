// Import necessary modules
import {
	extractWords,
	normalizeString,
	getNormalizedSearchTerms,
	searchBlockItems,
	searchItems,
	getItemSearchRank,
} from '../search-items';

describe('String Manipulation and Search Utilities', () => {
	/**
	 * Test suite for `extractWords`
	 *
	 * This suite tests the `extractWords` function, which extracts words from an input string by
	 * applying specific regex rules to split and strip unwanted characters, caching the results for
	 * improved performance on repeated inputs.
	 */
	describe('extractWords', () => {
		it('should return an empty array for an empty string', () => {
			expect(extractWords('')).toEqual([]);
		});

		it('should return an array of words for a normal sentence', () => {
			expect(extractWords('Hello World')).toEqual(['hello', 'world']);
		});

		it('should handle camelCase and PascalCase strings correctly', () => {
			expect(extractWords('camelCaseString')).toEqual([
				'camel',
				'case',
				'string',
			]);
			expect(extractWords('PascalCaseString')).toEqual([
				'pascal',
				'case',
				'string',
			]);
		});

		it('should handle strings with numbers and symbols', () => {
			expect(extractWords('Hello123World!')).toEqual([
				'hello123',
				'world',
			]);
		});
	});

	/**
	 * Test suite for `normalizeString`
	 *
	 * This suite tests the `normalizeString` function, which removes diacritics, strips leading slashes,
	 * and converts input strings to lowercase, caching results for repeated inputs.
	 */
	describe('normalizeString', () => {
		it('should return an empty string for an empty input', () => {
			expect(normalizeString('')).toBe('');
		});

		it('should remove accents and convert to lowercase', () => {
			expect(normalizeString('Média')).toBe('media');
		});

		it('should strip leading slashes', () => {
			expect(normalizeString('/media')).toBe('media');
		});

		it('should handle mixed input correctly', () => {
			expect(normalizeString('/MÉdia!')).toBe('media!');
		});
	});

	/**
	 * Test suite for `getNormalizedSearchTerms`
	 *
	 * This suite tests the `getNormalizedSearchTerms` function, which combines normalization and
	 * word extraction to return a list of normalized search terms from an input string.
	 */
	describe('getNormalizedSearchTerms', () => {
		it('should return an empty array for an empty input', () => {
			expect(getNormalizedSearchTerms('')).toEqual([]);
		});

		it('should return normalized search terms', () => {
			expect(getNormalizedSearchTerms('Média/Info')).toEqual([
				'media',
				'info',
			]);
		});
	});

	/**
	 * Test suite for `searchBlockItems`
	 *
	 * This suite tests the `searchBlockItems` function, which searches a list of items by
	 * normalizing input and matching against categories and collections.
	 */
	describe('searchBlockItems', () => {
		const items = [
			{ name: 'core/media', category: 'media', title: 'Media Block' },
			{
				name: 'custom/media',
				category: 'custom',
				title: 'Custom Media Block',
			},
		];
		const categories = [
			{ slug: 'media', title: 'Media' },
			{ slug: 'custom', title: 'Custom' },
		];
		const collections = {
			core: { title: 'Core Collection' },
			custom: { title: 'Custom Collection' },
		};

		it('should return all items when search input is empty', () => {
			expect(
				searchBlockItems(items, categories, collections, '')
			).toEqual(items);
		});

		it('should filter items by normalized search terms', () => {
			expect(
				searchBlockItems(items, categories, collections, 'media')
			).toEqual(items);
			expect(
				searchBlockItems(items, categories, collections, 'core')
			).toEqual([items[0]]);
		});
	});

	/**
	 * Test suite for `searchItems`
	 *
	 * This suite tests the `searchItems` function, which ranks and filters items based on
	 * a normalized search input and a customizable configuration object.
	 */
	describe('searchItems', () => {
		const items = [
			{ name: 'core/media', title: 'Media Block' },
			{ name: 'custom/media', title: 'Custom Media Block' },
		];
		const config = {
			getName: (item) => item.name,
			getTitle: (item) => item.title,
		};

		it('should return all items when search input is empty', () => {
			expect(searchItems(items, '', config)).toEqual(items);
		});

		it('should rank and filter items by search terms', () => {
			expect(searchItems(items, 'media', config)).toEqual([
				items[0],
				items[1],
			]);
			expect(searchItems(items, 'custom', config)).toEqual([items[1]]);
		});
	});

	/**
	 * Test suite for `getItemSearchRank`
	 *
	 * This suite tests the `getItemSearchRank` function, which calculates the relevance rank
	 * of a given item based on the search term and item properties using a ranking algorithm.
	 */
	describe('getItemSearchRank', () => {
		const item = {
			name: 'core/media',
			title: 'Media Block',
			description: 'A media block',
			keywords: ['media', 'block'],
			category: 'media',
			id: 'core/media',
		};
		const config = {
			getName: (item) => item.name,
			getTitle: (item) => item.title,
			getDescription: (item) => item.description,
			getKeywords: (item) => item.keywords,
			getCategory: (item) => item.category,
		};

		it('should return a high rank for exact title matches', () => {
			expect(
				getItemSearchRank(item, 'Media Block', config)
			).toBeGreaterThanOrEqual(30);
		});

		it('should return a medium rank for starting title matches', () => {
			expect(
				getItemSearchRank(item, 'Media', config)
			).toBeGreaterThanOrEqual(20);
		});

		it('should return a low rank for partial matches', () => {
			expect(
				getItemSearchRank(item, 'Block', config)
			).toBeGreaterThanOrEqual(10);
		});

		it('should give higher rank for "core" items', () => {
			expect(
				getItemSearchRank(item, 'Media Block', config)
			).toBeGreaterThan(
				getItemSearchRank(
					{
						...item,
						name: 'custom/media',
					},
					'Media Block',
					config
				)
			);
		});
	});
});
