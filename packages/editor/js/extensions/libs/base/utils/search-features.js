// @flow

/**
 * Preprocessed keyword index structure for O(1) lookups
 * Similar to PHP's isset() - uses Set for fast membership checks
 */
type KeywordIndex = {
	keywordsSet: Set<string>, // All normalized keywords for exact/word matching (O(1))
	keywordsArray: Array<string>, // Original keywords for substring fallback
};

/**
 * WeakMap cache for preprocessed keyword indices
 * Prevents reprocessing the same config objects
 */
const keywordIndexCache: WeakMap<Object, KeywordIndex> = new WeakMap();

/**
 * Preprocess keywords array into indexed structure for O(1) lookups
 * Converts array to Set (like PHP isset) + keeps array for substring matching
 *
 * @param {Array<string>|string|void} keywords - Keywords array or string
 * @return {KeywordIndex|null} - Preprocessed index or null if no keywords
 */
const preprocessKeywords = (
	keywords: Array<string> | string | void
): KeywordIndex | null => {
	if (!keywords) {
		return null;
	}

	// Handle string case
	if (typeof keywords === 'string') {
		const normalized = keywords.toLowerCase();
		return {
			keywordsSet: new Set<string>([normalized]),
			keywordsArray: [normalized],
		};
	}

	// Handle array case
	if (!Array.isArray(keywords) || keywords.length === 0) {
		return null;
	}

	// Build Set of all normalized keywords (O(1) lookup)
	// Also include individual words from multi-word keywords
	const keywordsSet = new Set<string>();
	const keywordsArray: Array<string> = [];

	const len = keywords.length;
	for (let i = 0; i < len; i++) {
		const keyword = keywords[i];
		if (keyword && typeof keyword === 'string') {
			const normalized = keyword.toLowerCase();
			keywordsArray.push(normalized);
			keywordsSet.add(normalized);

			// Also add individual words for faster word-level matching
			// e.g., "text color" -> add "text" and "color" to Set
			const words = normalized.split(/\s+/);
			const wordsLen = words.length;
			for (let j = 0; j < wordsLen; j++) {
				const word = words[j];
				if (word.length > 0) {
					keywordsSet.add(word);
				}
			}
		}
	}

	return {
		keywordsSet,
		keywordsArray,
	};
};

/**
 * Get or create preprocessed keyword index for a config
 * Uses WeakMap cache to avoid reprocessing
 *
 * @param {Object} config - Feature config object
 * @return {KeywordIndex|null} - Preprocessed index or null
 */
const getKeywordIndex = (config: Object): KeywordIndex | null => {
	// Check cache first
	const cached = keywordIndexCache.get(config);
	if (cached) {
		return cached;
	}

	// Preprocess and cache
	const index = preprocessKeywords(config.keywords);
	if (index) {
		keywordIndexCache.set(config, index);
	}
	return index;
};

/**
 * Utility function to check if a feature config matches a normalized search query
 * Optimized for performance: uses indexed Sets for O(1) lookups (like PHP isset)
 *
 * @param {Object} config - Feature config object
 * @param {string} normalizedQuery - Pre-normalized search query (lowercase, trimmed)
 * @return {boolean} - Whether the config matches the search query
 */
const matchesNormalizedQuery = (
	config: Object,
	normalizedQuery: string
): boolean => {
	// Check label first (most common match)
	const label = config.label;
	if (label) {
		// Use indexOf instead of includes for better performance in some engines
		if (label.toLowerCase().indexOf(normalizedQuery) !== -1) {
			return true;
		}
	}

	// Get preprocessed keyword index (O(1) lookup via Set)
	const keywordIndex = getKeywordIndex(config);
	if (!keywordIndex) {
		return false;
	}

	// Fast path: O(1) exact/word matching using Set (like PHP isset)
	// Check if query matches any keyword or word exactly
	if (keywordIndex.keywordsSet.has(normalizedQuery)) {
		return true;
	}

	// Fallback: substring matching (only if exact match fails)
	// This is slower but needed for partial matches like "col" matching "color"
	const keywordsArray = keywordIndex.keywordsArray;
	const keywordsLen = keywordsArray.length;
	for (let i = 0; i < keywordsLen; i++) {
		if (keywordsArray[i].indexOf(normalizedQuery) !== -1) {
			return true;
		}
	}

	return false;
};

/**
 * Filter a config object by recursively filtering its feature properties
 * Optimized: builds filtered object instead of copying and deleting
 *
 * @param {Object} configObj - Config object containing features
 * @param {string} searchQuery - Search query string
 * @return {Object} - Filtered config object
 */
export const filterConfigBySearch = (
	configObj: Object,
	searchQuery: string
): Object => {
	// Early return for empty query
	const trimmedQuery = searchQuery ? searchQuery.trim() : '';
	if (!trimmedQuery) {
		return configObj;
	}

	// Normalize query once
	const normalizedQuery = trimmedQuery.toLowerCase();

	// Build filtered object incrementally instead of copying and deleting
	const filtered: { [string]: any } = {};
	let hasStatus = false;
	let hasInitialOpen = false;

	// Single pass: iterate and build filtered object
	for (const key in configObj) {
		// Preserve status and initialOpen properties
		if (key === 'status') {
			filtered.status = configObj.status;
			hasStatus = true;
			continue;
		}
		if (key === 'initialOpen') {
			filtered.initialOpen = configObj.initialOpen;
			hasInitialOpen = true;
			continue;
		}

		const feature = configObj[key];
		if (feature && typeof feature === 'object') {
			// Check if this feature matches (pass normalized query to avoid re-normalization)
			if (matchesNormalizedQuery(feature, normalizedQuery)) {
				// Feature matches: include with updated properties
				filtered[key] = {
					...feature,
					show: true,
					force: true,
					status: true,
				};
			}
			// If doesn't match, skip it (don't add to filtered)
		}
	}

	// Ensure status and initialOpen are preserved even if not in original
	if (!hasStatus && 'status' in configObj) {
		filtered.status = configObj.status;
	}
	if (!hasInitialOpen && 'initialOpen' in configObj) {
		filtered.initialOpen = configObj.initialOpen;
	}

	return filtered;
};

/**
 * Filter all settings configs based on search query
 * Optimized: builds filtered object incrementally
 *
 * @param {Object} settings - Settings object containing all configs
 * @param {string} searchQuery - Search query string
 * @return {Object} - Filtered settings object
 */
export const filterSettingsBySearch = (
	settings: Object,
	searchQuery: string
): Object => {
	// Early return for empty query
	const trimmedQuery = searchQuery ? searchQuery.trim() : '';
	if (!trimmedQuery) {
		return settings;
	}

	// Build filtered object incrementally instead of copying entire settings
	const filtered: { [string]: any } = {};

	// Single pass: iterate and filter configs
	for (const configKey in settings) {
		const value = settings[configKey];

		// Only filter config objects (ending with 'Config')
		if (
			configKey.endsWith('Config') &&
			value &&
			typeof value === 'object'
		) {
			filtered[configKey] = filterConfigBySearch(value, trimmedQuery);
		} else {
			// Preserve non-config properties as-is
			filtered[configKey] = value;
		}
	}

	return filtered;
};

/**
 * Utility function to filter feature configs based on search query
 * Public API wrapper for backward compatibility
 *
 * @param {Object} config - Feature config object
 * @param {string} searchQuery - Search query string
 * @return {boolean} - Whether the config matches the search query
 */
export const matchesSearchQuery = (
	config: Object,
	searchQuery: string
): boolean => {
	if (!searchQuery || !searchQuery.trim()) {
		return true;
	}
	return matchesNormalizedQuery(config, searchQuery.toLowerCase().trim());
};

/**
 * True if a filtered extension config still has at least one feature entry
 * (keys other than status/initialOpen). Used for empty-search UI.
 *
 * @param {Object|void} configObj - Config from filterConfigBySearch
 * @return {boolean} True when the config includes at least one feature key besides status/initialOpen.
 */
export const configHasFeatureEntries = (configObj: Object | void): boolean => {
	if (!configObj || typeof configObj !== 'object') {
		return false;
	}
	for (const key in configObj) {
		if (key === 'status' || key === 'initialOpen') {
			continue;
		}
		return true;
	}
	return false;
};
