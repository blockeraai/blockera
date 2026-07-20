#!/usr/bin/env node
/**
 * Compare Core vs Blockera editor (client) Playwright performance artifacts.
 *
 * Gate: fail when abs((blockera - core) / core * 100) > thresholdPercent
 * on each scenario's primaryMetric (focus, switchTab, …).
 * Scenarios with requiresBlockera are informational only.
 */

const fs = require('node:fs');
const path = require('node:path');
const {
	parseFile,
	median,
	formatAsMarkdownTable,
	formatValue,
	standardDeviation,
	medianAbsoluteDeviation,
	accumulateValues,
	toResultMetricKey,
	scenarioIdFromTitle,
} = require('./utils');

const root = process.cwd();
const outDir = process.env.PERF_RESULTS_DIR || '.github/performance/results';
const artifactsPath =
	process.env.WP_ARTIFACTS_PATH || path.join(root, 'artifacts');
process.env.WP_ARTIFACTS_PATH = artifactsPath;

const summaryArg = process.argv[2];

/**
 * @param {number|null|undefined} n
 * @return {number|null} Rounded value or null.
 */
function round2(n) {
	if (n === null || n === undefined || Number.isNaN(n)) {
		return null;
	}
	return Math.round(n * 100) / 100;
}

/**
 * @param {number|null|undefined} n
 * @param {string} [suffix]
 * @return {string} Signed number string.
 */
function fmtSigned(n, suffix = '') {
	if (n === null || n === undefined || Number.isNaN(n)) {
		return '—';
	}
	let sign = '';
	if (n > 0) {
		sign = '+';
	} else if (n < 0) {
		sign = '-';
	}
	return `${sign}${Math.abs(n)}${suffix}`;
}

/**
 * @param {number|null|undefined} n
 * @return {string} Millisecond label or em dash.
 */
function fmtMs(n) {
	if (n === null || n === undefined || Number.isNaN(n)) {
		return '—';
	}
	return `${n}ms`;
}

/**
 * @param {Array<{title: string, results: Record<string, number[]>[]}>} stats
 * @return {Map<string, {title: string, results: Record<string, number[]>[]}>} Map of scenario id to suite.
 */
function indexByScenarioId(stats) {
	const map = new Map();
	for (const row of stats) {
		map.set(scenarioIdFromTitle(row.title), row);
	}
	return map;
}

function main() {
	const scenariosPath = path.join(
		root,
		'.github/performance/editor-scenarios.json'
	);
	const config = JSON.parse(fs.readFileSync(scenariosPath, 'utf8'));
	const defaults = config.defaults || {};
	const defaultThreshold =
		typeof defaults.thresholdPercent === 'number'
			? defaults.thresholdPercent
			: 20;

	const blockeraStats = parseFile('blockera-editor-performance-results.json');
	const coreStats = parseFile('core-editor-performance-results.json');

	if (!blockeraStats.length) {
		// @debug-ignore — CLI error for missing benchmark artifacts
		console.error(
			'Missing artifacts/blockera-editor-performance-results.json — run editor Blockera subject first.'
		);
		process.exit(1);
	}

	const blockeraById = indexByScenarioId(blockeraStats);
	const coreById = indexByScenarioId(coreStats);

	const gateResults = [];
	const detailSections = [];
	let failed = 0;

	let repetitions = 0;
	let iterations = 0;
	const sample = blockeraStats[0];
	if (sample?.results?.length) {
		repetitions = sample.results.length;
		const first = sample.results[0];
		const firstMetric = Object.values(first || {})[0];
		iterations = Array.isArray(firstMetric) ? firstMetric.length : 0;
	}

	for (const scenario of config.scenarios || []) {
		const threshold =
			typeof scenario.thresholdPercent === 'number'
				? scenario.thresholdPercent
				: defaultThreshold;
		const primaryMetric =
			scenario.primaryMetric || defaults.primaryMetric || 'focus';
		const primaryKey = toResultMetricKey(primaryMetric);

		const blockeraRow = blockeraById.get(scenario.id);
		const coreRow = coreById.get(scenario.id);

		const entry = {
			id: scenario.id,
			label: scenario.label || scenario.id,
			thresholdPercent: threshold,
			requiresBlockera: Boolean(scenario.requiresBlockera),
			primaryMetric,
			metricKey: primaryKey,
			withMs: null,
			withoutMs: null,
			deltaMs: null,
			deltaPercent: null,
			status: 'pass',
			note: '',
		};

		const blockeraMetrics = blockeraRow
			? accumulateValues(blockeraRow.results)
			: null;
		const coreMetrics = coreRow ? accumulateValues(coreRow.results) : null;

		const blockeraValues = blockeraMetrics?.[primaryKey];
		const coreValues = coreMetrics?.[primaryKey];

		if (blockeraMetrics) {
			const rows = [];
			for (const [metric, values] of Object.entries(blockeraMetrics)) {
				const coreVals = coreMetrics?.[metric] || null;
				const value = median(values);
				const prevValue = coreVals ? median(coreVals) : null;
				const delta =
					prevValue !== null && prevValue !== undefined
						? value - prevValue
						: null;
				const percentage =
					prevValue && prevValue !== 0
						? (delta / prevValue) * 100
						: NaN;
				const showDiff =
					prevValue !== null && !Number.isNaN(percentage);

				rows.push({
					Metric: metric,
					Core:
						prevValue !== null
							? formatValue(metric, prevValue)
							: 'N/A',
					Blockera: formatValue(metric, value),
					'Diff abs.': showDiff ? formatValue(metric, delta) : '',
					'Diff %': showDiff ? `${percentage.toFixed(2)} %` : '',
					STD: formatValue(metric, standardDeviation(values)),
					MAD: formatValue(metric, medianAbsoluteDeviation(values)),
				});
			}
			detailSections.push({
				title: entry.label,
				rows,
			});
		}

		if (scenario.requiresBlockera) {
			if (!blockeraValues?.length) {
				entry.status = 'fail';
				entry.note = 'Missing Blockera metrics';
				failed++;
			} else {
				entry.withMs = round2(median(blockeraValues));
				entry.status = 'skip';
				entry.note =
					'Informational only (requires Blockera); gate not applied';
			}
			gateResults.push(entry);
			continue;
		}

		if (!blockeraValues?.length || !coreValues?.length) {
			entry.status = 'fail';
			entry.note = !blockeraValues?.length
				? 'Missing Blockera metrics'
				: 'Missing Core metrics';
			failed++;
			gateResults.push(entry);
			continue;
		}

		const withMs = median(blockeraValues);
		const withoutMs = median(coreValues);
		entry.withMs = round2(withMs);
		entry.withoutMs = round2(withoutMs);
		entry.deltaMs = round2(withMs - withoutMs);

		if (withoutMs === 0) {
			entry.status = 'fail';
			entry.note = 'Core median is 0; cannot compute percent change';
			failed++;
			gateResults.push(entry);
			continue;
		}

		entry.deltaPercent = round2(((withMs - withoutMs) / withoutMs) * 100);
		const absPct = Math.abs(entry.deltaPercent);

		if (absPct > threshold) {
			entry.status = 'fail';
			entry.note = `${fmtSigned(entry.deltaPercent, '%')} exceeds ±${threshold}%`;
			failed++;
		} else {
			entry.status = 'pass';
		}

		gateResults.push(entry);
	}

	const report = buildReport({
		gateResults,
		detailSections,
		defaults,
		repetitions,
		iterations,
		failed,
	});

	fs.mkdirSync(path.join(root, outDir), { recursive: true });
	const reportPath = path.join(root, outDir, 'editor-report.md');
	fs.writeFileSync(reportPath, report);
	fs.writeFileSync(
		path.join(root, outDir, 'editor-compare.json'),
		JSON.stringify(
			{
				defaults,
				results: gateResults,
				failed,
				repetitions,
				iterations,
			},
			null,
			'\t'
		) + '\n'
	);

	const artifactsReport = path.join(
		artifactsPath,
		'editor-performance-results.md'
	);
	fs.mkdirSync(artifactsPath, { recursive: true });
	fs.writeFileSync(artifactsReport, report);

	if (summaryArg) {
		fs.writeFileSync(summaryArg, report);
	}

	// @debug-ignore — CLI report output for CI / local runs
	console.log(report);
	// @debug-ignore
	console.log(`\nWrote ${reportPath}`);

	if (failed > 0) {
		process.exit(1);
	}
}

/**
 * @param {Object} args Report inputs.
 * @return {string} Markdown report body.
 */
function buildReport({
	gateResults,
	detailSections,
	defaults,
	repetitions,
	iterations,
	failed,
}) {
	const lines = [];
	lines.push('<!-- blockera-editor-perf-benchmark -->');
	lines.push('# Block Editor Performance Report');
	lines.push('');
	lines.push(
		'Compare **Blockera** vs **Core** (plugin off) using Chromium tracing metrics adapted from the Gutenberg post-editor performance suite.'
	);
	lines.push('');
	lines.push(
		'Numbers are median interaction durations in milliseconds (lower is faster). Selection uses focus-event duration; workspace tabs use click-event duration.'
	);
	lines.push('');
	if (repetitions && iterations) {
		lines.push(
			`All gated numbers are median values over **${repetitions}** repetition(s) with **${iterations}** sample(s) each.`
		);
		lines.push('');
	}
	lines.push(
		'| Scenario | Metric | Core | Blockera | Diff ms | Diff % | Threshold | Status |'
	);
	lines.push('| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |');

	for (const r of gateResults) {
		let status = '❌ fail';
		if (r.status === 'pass') {
			status = '✅ pass';
		} else if (r.status === 'skip') {
			status = '⏭️ skip';
		}
		lines.push(
			`| ${r.label} | \`${r.metricKey}\` | ${fmtMs(r.withoutMs)} | ${fmtMs(r.withMs)} | ${fmtSigned(r.deltaMs)} | ${fmtSigned(r.deltaPercent, '%')} | ${r.thresholdPercent}% | ${status} |`
		);
	}

	lines.push('');
	lines.push(
		'- Theme: Twenty Twenty-Five · Locale: en_US · samples: 10 (+1 throwaway) per Gutenberg pattern'
	);
	lines.push(
		'- Gate: fail if `|Diff %|` exceeds per-scenario `thresholdPercent` (either direction)'
	);
	lines.push(
		'- Diff is **Blockera − Core** (positive means Blockera is slower)'
	);
	lines.push(
		'- `requiresBlockera` scenarios are informational (no Core comparison)'
	);
	lines.push('');

	const fails = gateResults.filter((r) => r.status === 'fail');
	if (fails.length) {
		lines.push('### Failures');
		lines.push('');
		for (const f of fails) {
			lines.push(`- ❌ **${f.label}**: ${f.note}`);
		}
		lines.push('');
	}

	const skips = gateResults.filter((r) => r.status === 'skip');
	if (skips.length) {
		lines.push('### Skipped');
		lines.push('');
		for (const s of skips) {
			lines.push(`- **${s.label}**: ${s.note}`);
		}
		lines.push('');
	}

	if (detailSections.length) {
		lines.push('<details>');
		lines.push('<summary>Full metrics (median / STD / MAD)</summary>');
		lines.push('');
		for (const section of detailSections) {
			lines.push(`<b>${section.title}</b>`);
			lines.push('');
			lines.push(formatAsMarkdownTable(section.rows));
			lines.push('');
		}
		lines.push('</details>');
		lines.push('');
	}

	if (failed > 0) {
		lines.push(`_Threshold gate failed (${failed} scenario(s))._`);
		lines.push('');
	}

	if (defaults.thresholdPercent !== undefined) {
		lines.push(
			`_Default threshold: ${defaults.thresholdPercent}% (from editor-scenarios.json)._`
		);
		lines.push('');
	}

	return lines.join('\n');
}

main();
