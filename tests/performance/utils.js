/**
 * Performance benchmark helpers.
 *
 * Adapted from WordPress core tests/performance/utils.js
 * (locales / multi-theme matrix removed — Blockera uses en_US + TT5 only).
 */

const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

process.env.WP_ARTIFACTS_PATH ??= join(process.cwd(), 'artifacts');

/**
 * Parse a performance results JSON file from WP_ARTIFACTS_PATH.
 *
 * @param {string} fileName File name under artifacts/.
 * @return {Array<{file: string, title: string, results: Record<string, number[]>[]}>} Parsed rows.
 */
function parseFile(fileName) {
	const file = join(process.env.WP_ARTIFACTS_PATH, fileName);
	if (!existsSync(file)) {
		return [];
	}

	return JSON.parse(readFileSync(file, 'utf8'));
}

/**
 * @param {number[]} array
 * @return {number} Median.
 */
function median(array) {
	const mid = Math.floor(array.length / 2);
	const numbers = [...array].sort((a, b) => a - b);
	return array.length % 2 !== 0
		? numbers[mid]
		: (numbers[mid - 1] + numbers[mid]) / 2;
}

/**
 * @param {string} str
 * @return {string} camelCase form of dash-separated string.
 */
function camelCaseDashes(str) {
	return str.replace(/-([a-z])/g, function (g) {
		return g[1].toUpperCase();
	});
}

/**
 * @param {Array<Object>} rows
 * @return {string} Markdown table.
 */
function formatAsMarkdownTable(rows) {
	let result = '';

	if (!rows.length) {
		return result;
	}

	const headers = Object.keys(rows[0]);
	for (const column of headers) {
		result += `| ${column} `;
	}
	result += '|\n';
	for (let i = 0; i < headers.length; i++) {
		result += '| ------ ';
	}
	result += '|\n';

	for (const row of rows) {
		for (const value of Object.values(row)) {
			result += `| ${value} `;
		}
		result += '|\n';
	}

	return result;
}

/**
 * @param {string} metric
 * @param {number} value
 * @return {string} Formatted metric value.
 */
function formatValue(metric, value) {
	if (null === value || undefined === value || Number.isNaN(value)) {
		return 'N/A';
	}

	if ('wpMemoryUsage' === metric) {
		return `${(value / Math.pow(10, 6)).toFixed(2)} MB`;
	}

	if ('wpExtObjCache' === metric) {
		return 1 === value ? 'yes' : 'no';
	}

	if ('wpDbQueries' === metric) {
		return String(value);
	}

	return `${value.toFixed(2)} ms`;
}

/**
 * @param {number[]} array
 * @return {number} Standard deviation.
 */
function standardDeviation(array = []) {
	if (!array.length) {
		return 0;
	}

	const mean = array.reduce((a, b) => a + b) / array.length;
	return Math.sqrt(
		array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) /
			array.length
	);
}

/**
 * @param {number[]} array
 * @return {number} Median absolute deviation.
 */
function medianAbsoluteDeviation(array = []) {
	if (!array.length) {
		return 0;
	}

	const med = median(array);
	return median(array.map((a) => Math.abs(a - med)));
}

/**
 * @param {Array<Record<string, number[]>>} results
 * @return {Record<string, number[]>} Accumulated metric arrays.
 */
function accumulateValues(results) {
	return results.reduce((acc, result) => {
		for (const [metric, values] of Object.entries(result)) {
			acc[metric] = acc[metric] ?? [];
			acc[metric].push(...values);
		}
		return acc;
	}, {});
}

/**
 * Map scenarios.json primaryMetric (e.g. wp-total) to Playwright result keys (wpTotal).
 *
 * @param {string} primaryMetric
 * @return {string} camelCase metric key.
 */
function toResultMetricKey(primaryMetric) {
	return camelCaseDashes(String(primaryMetric || 'wp-total'));
}

/**
 * Extract scenario id from reporter title (`Scenario › front-home`).
 *
 * @param {string} title
 * @return {string} Scenario id or empty string.
 */
function scenarioIdFromTitle(title) {
	const parts = String(title).split('›');
	return (parts[parts.length - 1] || '').trim();
}

/**
 * @param {number[]} array
 * @return {number} Sum of values.
 */
function sum(array = []) {
	return array.reduce((acc, value) => acc + value, 0);
}

/**
 * TT5 theme.json palette slugs used by GS background variable perf scenarios.
 */
const TT5_THEME_COLOR_VARIABLES = [
	{ slug: 'base', label: 'Base' },
	{ slug: 'contrast', label: 'Contrast' },
	{ slug: 'accent-1', label: 'Accent 1' },
	{ slug: 'accent-2', label: 'Accent 2' },
	{ slug: 'accent-3', label: 'Accent 3' },
	{ slug: 'accent-4', label: 'Accent 4' },
	{ slug: 'accent-5', label: 'Accent 5' },
	{ slug: 'accent-6', label: 'Accent 6' },
];

/**
 * Distinct 6-char hex color (no `#`) per 1-based perf iteration.
 *
 * @param {number} iteration 1-based loop index.
 * @param {string} [prefix] Four hex chars shared within a scenario (e.g. 6666).
 * @return {{ colorValue: string, expectedHex: string, blueChannel: number }} Hex color parts for assertions.
 */
function iterationHexColor(iteration, prefix = '6666') {
	const suffix = String(iteration).padStart(2, '0');
	const colorValue = `${prefix}${suffix}`;
	const blueChannel = parseInt(suffix, 16);

	return {
		colorValue,
		expectedHex: `#${colorValue}`,
		blueChannel,
	};
}

/**
 * Theme color variable for a perf iteration (TT5 palette, unique for i 1–8).
 *
 * @param {number} iteration 1-based loop index.
 * @return {{ slug: string, label: string }} Theme preset slug and UI label.
 */
function iterationThemeColorVariable(iteration) {
	const i = Math.max(1, Math.floor(iteration));
	const palette = TT5_THEME_COLOR_VARIABLES;

	if (i <= palette.length) {
		return palette[i - 1];
	}

	const overflowSlugs = [
		'accent-2',
		'accent-5',
		'accent-6',
		'accent-1',
		'accent-3',
	];
	const slug = overflowSlugs[(i - palette.length - 1) % overflowSlugs.length];

	return palette.find((entry) => entry.slug === slug) ?? palette[0];
}

/**
 * Border box preset name + width for a perf iteration (Blockera GS borders screen).
 *
 * @param {number} iteration 1-based loop index.
 * @return {{ presetName: string, widthPx: string }} Display name and width in px (no unit).
 */
function iterationBorderPreset(iteration) {
	const i = Math.max(1, Math.floor(iteration));
	const suffix = String(i).padStart(2, '0');

	return {
		presetName: `Perf Border ${suffix}`,
		widthPx: String(2 + ((i - 1) % 7)),
	};
}

/**
 * Custom color palette preset for a perf iteration (core GS Edit palette analog).
 *
 * @param {number} iteration 1-based loop index.
 * @return {{ presetName: string, colorValue: string, expectedHex: string }} Name and hex values.
 */
function iterationCoreColorPreset(iteration) {
	const i = Math.max(1, Math.floor(iteration));
	const suffix = String(i).padStart(2, '0');
	const { colorValue, expectedHex } = iterationHexColor(i);

	return {
		presetName: `Perf Color ${suffix}`,
		colorValue,
		expectedHex,
	};
}

module.exports = {
	parseFile,
	median,
	sum,
	camelCaseDashes,
	formatAsMarkdownTable,
	formatValue,
	standardDeviation,
	medianAbsoluteDeviation,
	accumulateValues,
	toResultMetricKey,
	scenarioIdFromTitle,
	iterationHexColor,
	iterationThemeColorVariable,
	iterationBorderPreset,
	iterationCoreColorPreset,
	TT5_THEME_COLOR_VARIABLES,
};
