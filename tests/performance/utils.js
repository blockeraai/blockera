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

module.exports = {
	parseFile,
	median,
	camelCaseDashes,
	formatAsMarkdownTable,
	formatValue,
	standardDeviation,
	medianAbsoluteDeviation,
	accumulateValues,
	toResultMetricKey,
	scenarioIdFromTitle,
};
