// @flow

/**
 * Utility function to filter feature configs based on search query
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

	const query = searchQuery.toLowerCase().trim();
	const label = (config.label || '').toLowerCase();
	const fallbackKeywords = config.keywords ? [config.keywords] : [];
	const keywords = Array.isArray(config.keywords)
		? config.keywords
		: fallbackKeywords;

	// Check if label matches
	if (label.includes(query)) {
		return true;
	}

	// Check if any keyword matches
	return keywords.some((keyword: string) =>
		keyword.toLowerCase().includes(query)
	);
};

/**
 * Filter a config object by recursively filtering its feature properties
 *
 * @param {Object} configObj - Config object containing features
 * @param {string} searchQuery - Search query string
 * @return {Object} - Filtered config object
 */
export const filterConfigBySearch = (
	configObj: Object,
	searchQuery: string
): Object => {
	if (!searchQuery || !searchQuery.trim()) {
		return configObj;
	}

	for (const key in configObj) {
		if (key === 'status' || key === 'initialOpen') {
			continue;
		}

		configObj[key] = {
			...configObj[key],
			show: true,
			force: true,
			status: true,
		};
	}

	const filtered = { ...configObj };
	const query = searchQuery.toLowerCase().trim();

	// Filter each feature in the config
	Object.keys(filtered).forEach((key) => {
		if (key === 'status' || key === 'initialOpen') {
			// Keep status and initialOpen properties
			return;
		}

		const feature = filtered[key];
		if (feature && typeof feature === 'object') {
			// Check if this feature matches
			if (matchesSearchQuery(feature, query)) {
				// Feature matches, keep it
				return;
			}

			// Feature doesn't match, remove it
			delete filtered[key];
		}
	});

	return filtered;
};

/**
 * Filter all settings configs based on search query
 *
 * @param {Object} settings - Settings object containing all configs
 * @param {string} searchQuery - Search query string
 * @return {Object} - Filtered settings object
 */
export const filterSettingsBySearch = (
	settings: Object,
	searchQuery: string
): Object => {
	if (!searchQuery || !searchQuery.trim()) {
		return settings;
	}

	const filtered = { ...settings };

	// Filter each config in settings
	Object.keys(filtered).forEach((configKey) => {
		if (configKey.endsWith('Config')) {
			filtered[configKey] = filterConfigBySearch(
				filtered[configKey],
				searchQuery
			);
		}
	});

	return filtered;
};
