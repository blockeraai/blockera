#!/usr/bin/env node
/**
 * Compare Blockera editor (client) Playwright performance artifacts vs a baseline.
 *
 * Baselines (PERF_BASELINE):
 * - `core` (default) — PR Blockera vs WordPress Core (plugin off).
 *   Gates scenarios without requiresBlockera (or requiresBlockera: false).
 * - `master` — PR Blockera vs Blockera on master.
 *   Gates scenarios with requiresBlockera: true.
 *
 * Gate: fail when abs((current - baseline) / baseline * 100) > thresholdPercent
 * on each scenario's primaryMetric (focus, switchTab, …).
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

const baselineMode = (process.env.PERF_BASELINE || 'core').toLowerCase();
const currentPrefix = process.env.PERF_CURRENT_PREFIX || 'blockera-editor';
const baselinePrefix =
	process.env.PERF_BASELINE_PREFIX ||
	(baselineMode === 'master' ? 'master-editor' : 'core-editor');
const reportName = process.env.PERF_EDITOR_REPORT_NAME || 'editor-report.md';
const compareName =
	process.env.PERF_EDITOR_COMPARE_NAME || 'editor-compare.json';

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

/**
 * Whether a scenario should be gated for the active baseline.
 *
 * @param {{requiresBlockera?: boolean}} scenario
 * @param {string} mode
 * @return {boolean} True when the scenario belongs in this baseline report.
 */
function scenarioMatchesBaseline(scenario, mode) {
	const requiresBlockera = Boolean(scenario.requiresBlockera);
	if (mode === 'master') {
		return requiresBlockera;
	}
	// core (and any future non-master baseline that compares to WP Core)
	return !requiresBlockera;
}

/**
 * @param {string} mode
 * @return {{label: string, artifact: string}} Human label and artifact filename for the baseline.
 */
function baselineMeta(mode) {
	if (mode === 'master') {
		return {
			label: 'Master',
			artifact: `${baselinePrefix}-performance-results.json`,
		};
	}
	return {
		label: 'Core',
		artifact: `${baselinePrefix}-performance-results.json`,
	};
}

function main() {
	if (baselineMode !== 'core' && baselineMode !== 'master') {
		// @debug-ignore — CLI error for invalid baseline
		console.error(
			`Unknown PERF_BASELINE='${baselineMode}' (expected: core, master)`
		);
		process.exit(1);
	}

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

	const meta = baselineMeta(baselineMode);
	const currentArtifact = `${currentPrefix}-performance-results.json`;
	const blockeraStats = parseFile(currentArtifact);
	const baselineStats = parseFile(meta.artifact);

	if (!blockeraStats.length) {
		// @debug-ignore — CLI error for missing benchmark artifacts
		console.error(
			`Missing artifacts/${currentArtifact} — run current Branch Blockera subject first.`
		);
		process.exit(1);
	}

	if (!baselineStats.length) {
		// @debug-ignore
		console.error(
			`Missing artifacts/${meta.artifact} — run ${meta.label} baseline subject first.`
		);
		process.exit(1);
	}

	const blockeraById = indexByScenarioId(blockeraStats);
	const baselineById = indexByScenarioId(baselineStats);

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

	const scenarios = (config.scenarios || []).filter((scenario) =>
		scenarioMatchesBaseline(scenario, baselineMode)
	);

	if (!scenarios.length) {
		// @debug-ignore
		console.error(
			`No editor scenarios match PERF_BASELINE=${baselineMode} in editor-scenarios.json.`
		);
		process.exit(1);
	}

	for (const scenario of scenarios) {
		const threshold =
			typeof scenario.thresholdPercent === 'number'
				? scenario.thresholdPercent
				: defaultThreshold;
		const primaryMetric =
			scenario.primaryMetric || defaults.primaryMetric || 'focus';
		const primaryKey = toResultMetricKey(primaryMetric);

		const blockeraRow = blockeraById.get(scenario.id);
		const baselineRow = baselineById.get(scenario.id);

		const entry = {
			id: scenario.id,
			label: scenario.label || scenario.id,
			thresholdPercent: threshold,
			requiresBlockera: Boolean(scenario.requiresBlockera),
			baseline: baselineMode,
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
		const baselineMetrics = baselineRow
			? accumulateValues(baselineRow.results)
			: null;

		const blockeraValues = blockeraMetrics?.[primaryKey];
		const baselineValues = baselineMetrics?.[primaryKey];

		if (blockeraMetrics) {
			const rows = [];
			for (const [metric, values] of Object.entries(blockeraMetrics)) {
				const baselineVals = baselineMetrics?.[metric] || null;
				const value = median(values);
				const prevValue = baselineVals ? median(baselineVals) : null;
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
					[meta.label]:
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

		if (!blockeraValues?.length || !baselineValues?.length) {
			entry.status = 'fail';
			entry.note = !blockeraValues?.length
				? 'Missing Blockera metrics'
				: `Missing ${meta.label} metrics`;
			failed++;
			gateResults.push(entry);
			continue;
		}

		const withMs = median(blockeraValues);
		const withoutMs = median(baselineValues);
		entry.withMs = round2(withMs);
		entry.withoutMs = round2(withoutMs);
		entry.deltaMs = round2(withMs - withoutMs);

		if (withoutMs === 0) {
			entry.status = 'fail';
			entry.note = `${meta.label} median is 0; cannot compute percent change`;
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
		baselineLabel: meta.label,
		baselineMode,
	});

	fs.mkdirSync(path.join(root, outDir), { recursive: true });
	const reportPath = path.join(root, outDir, reportName);
	fs.writeFileSync(reportPath, report);
	fs.writeFileSync(
		path.join(root, outDir, compareName),
		JSON.stringify(
			{
				baseline: baselineMode,
				baselineLabel: meta.label,
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
	baselineLabel,
	baselineMode,
}) {
	const lines = [];
	const commentMarker =
		baselineMode === 'master'
			? '<!-- blockera-editor-perf-benchmark-master -->'
			: '<!-- blockera-editor-perf-benchmark-core -->';

	lines.push(commentMarker);
	lines.push(`# Block Editor Performance Report (PR vs ${baselineLabel})`);
	lines.push('');

	if (baselineMode === 'master') {
		lines.push(
			'Compare **Blockera on this PR** vs **Blockera on master** using Chromium tracing metrics adapted from the Gutenberg post-editor performance suite.'
		);
		lines.push('');
		lines.push(
			'Only scenarios with `requiresBlockera: true` are gated in this report.'
		);
	} else {
		lines.push(
			'Compare **Blockera** vs **Core** (plugin off) using Chromium tracing metrics adapted from the Gutenberg post-editor performance suite.'
		);
		lines.push('');
		lines.push(
			'Only scenarios without `requiresBlockera` (or `requiresBlockera: false`) are gated in this report.'
		);
	}
	lines.push('');
	lines.push(
		'Numbers are median interaction durations in milliseconds (lower is faster).'
	);
	lines.push('');
	if (repetitions && iterations) {
		lines.push(
			`All gated numbers are median values over **${repetitions}** repetition(s) with **${iterations}** sample(s) each.`
		);
		lines.push('');
	}
	lines.push(
		`| Scenario | Metric | ${baselineLabel} | Blockera (PR) | Diff ms | Diff % | Threshold | Status |`
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
		`- Diff is **Blockera (PR) − ${baselineLabel}** (positive means PR is slower)`
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
