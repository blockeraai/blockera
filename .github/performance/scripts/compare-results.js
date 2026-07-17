#!/usr/bin/env node
/**
 * Compare with/without Blockera Server-Timing CSV medians and enforce thresholds.
 *
 * Gate: abs((with - without) / without * 100) > thresholdPercent → fail.
 * Thresholds come from scenarios.json (scenario override → defaults.thresholdPercent).
 */

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const outDir = process.env.PERF_RESULTS_DIR || '.github/performance/results';
const scenariosPath =
	process.env.SCENARIOS_FILE || '.github/performance/scenarios.json';

function readCsv(filePath) {
	const text = fs.readFileSync(filePath, 'utf8').trim();
	if (!text) {
		throw new Error(`Empty CSV: ${filePath}`);
	}

	const lines = text.split(/\r?\n/).filter(Boolean);
	// Find header line (wpp-research may log progress before CSV).
	let headerIdx = lines.findIndex(
		(line) => /^URL,/i.test(line) || line.toLowerCase().startsWith('url,')
	);
	if (headerIdx === -1) {
		// Fallback: first line that has enough commas and looks like a table.
		headerIdx = lines.findIndex((line) => line.includes('Response Time'));
	}
	if (headerIdx === -1) {
		throw new Error(`Could not find CSV header in ${filePath}`);
	}

	const headers = splitCsvLine(lines[headerIdx]);
	const rows = [];
	for (let i = headerIdx + 1; i < lines.length; i++) {
		const cols = splitCsvLine(lines[i]);
		if (cols.length < 2 || !/^https?:\/\//i.test(cols[0])) {
			continue;
		}
		const row = {};
		headers.forEach((h, idx) => {
			row[h.trim()] = (cols[idx] ?? '').trim();
		});
		rows.push(row);
	}
	return { headers, rows };
}

function splitCsvLine(line) {
	const out = [];
	let cur = '';
	let inQuotes = false;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (ch === '"') {
			inQuotes = !inQuotes;
			continue;
		}
		if (ch === ',' && !inQuotes) {
			out.push(cur);
			cur = '';
			continue;
		}
		cur += ch;
	}
	out.push(cur);
	return out;
}

function normalizeUrl(url) {
	try {
		const u = new URL(url);
		u.searchParams.delete('rnd');
		// Trailing slash normalize for path-only compare.
		let p = u.pathname;
		if (p.length > 1 && p.endsWith('/')) {
			p = p.slice(0, -1);
		}
		return `${u.origin}${p}${u.search}`;
	} catch {
		return url;
	}
}

function pickMetric(row, primaryMetric) {
	const candidates = [
		`${primaryMetric} (median)`,
		primaryMetric,
		`${primaryMetric} (p50)`,
		'Response Time (median)',
		'Response Time (p50)',
	];
	for (const c of candidates) {
		if (row[c] !== undefined && row[c] !== '') {
			const n = Number(row[c]);
			if (!Number.isNaN(n)) {
				return { key: c, value: n };
			}
		}
	}

	const keys = Object.keys(row);
	// Fuzzy: any header containing primary metric + median.
	const fuzzy = keys.find(
		(k) =>
			k.toLowerCase().includes(String(primaryMetric).toLowerCase()) &&
			k.toLowerCase().includes('median')
	);
	if (fuzzy && row[fuzzy] !== '') {
		const n = Number(row[fuzzy]);
		if (!Number.isNaN(n)) {
			return { key: fuzzy, value: n };
		}
	}
	const rt = keys.find((k) => /response time.*median/i.test(k));
	if (rt && row[rt] !== '') {
		const n = Number(row[rt]);
		if (!Number.isNaN(n)) {
			return { key: rt, value: n, fallback: true };
		}
	}
	return null;
}

function indexByUrl(rows) {
	const map = new Map();
	for (const row of rows) {
		map.set(normalizeUrl(row.URL || row.url || ''), row);
	}
	return map;
}

function main() {
	const resolvedPath = path.join(root, outDir, 'resolved-scenarios.json');
	const scenariosFile = fs.existsSync(resolvedPath)
		? resolvedPath
		: path.join(root, scenariosPath);
	const config = JSON.parse(fs.readFileSync(scenariosFile, 'utf8'));
	const defaults = config.defaults || {};
	const primaryMetric = defaults.primaryMetric || 'wp-total';
	const defaultThreshold =
		typeof defaults.thresholdPercent === 'number'
			? defaults.thresholdPercent
			: 10;

	const withCsv = readCsv(path.join(root, outDir, 'with.csv'));
	const withoutCsv = readCsv(path.join(root, outDir, 'without.csv'));
	const withByUrl = indexByUrl(withCsv.rows);
	const withoutByUrl = indexByUrl(withoutCsv.rows);

	const results = [];
	let failed = 0;

	for (const scenario of config.scenarios || []) {
		const url =
			scenario.url || new URL(scenario.path, defaults.baseUrl).href;
		const key = normalizeUrl(url);
		const withRow = withByUrl.get(key);
		const withoutRow = withoutByUrl.get(key);

		const threshold =
			typeof scenario.thresholdPercent === 'number'
				? scenario.thresholdPercent
				: defaultThreshold;

		const entry = {
			id: scenario.id,
			label: scenario.label || scenario.id,
			group: scenario.group || '',
			url,
			thresholdPercent: threshold,
			requiresBlockera: Boolean(scenario.requiresBlockera),
			metricKey: null,
			withMs: null,
			withoutMs: null,
			deltaMs: null,
			deltaPercent: null,
			status: 'pass',
			note: '',
		};

		if (!withRow || !withoutRow) {
			entry.status = 'fail';
			entry.note = !withRow
				? 'Missing WITH-Blockera row'
				: 'Missing WITHOUT-Blockera row';
			failed++;
			results.push(entry);
			continue;
		}

		const withMetric = pickMetric(withRow, primaryMetric);
		const withoutMetric = pickMetric(withoutRow, primaryMetric);

		if (!withMetric || !withoutMetric) {
			if (scenario.requiresBlockera && !withoutMetric) {
				entry.status = 'skip';
				entry.note =
					'Skipped gate: scenario requires Blockera; WITHOUT metrics unavailable';
				entry.withMs = withMetric ? withMetric.value : null;
				entry.metricKey = withMetric ? withMetric.key : null;
				results.push(entry);
				continue;
			}
			entry.status = 'fail';
			entry.note = `Missing metric ${primaryMetric} (and Response Time fallback)`;
			failed++;
			results.push(entry);
			continue;
		}

		entry.metricKey = withMetric.key;
		entry.withMs = withMetric.value;
		entry.withoutMs = withoutMetric.value;
		entry.deltaMs = round2(withMetric.value - withoutMetric.value);

		if (withoutMetric.value === 0) {
			entry.status = 'fail';
			entry.note = 'WITHOUT median is 0; cannot compute percent change';
			failed++;
			results.push(entry);
			continue;
		}

		entry.deltaPercent = round2(
			((withMetric.value - withoutMetric.value) / withoutMetric.value) *
				100
		);
		const absPct = Math.abs(entry.deltaPercent);

		// Settings (and similar) only exist with Blockera; WITHOUT is a different screen.
		if (scenario.requiresBlockera) {
			entry.status = 'skip';
			entry.note =
				'Informational only (requires Blockera); gate not applied';
			results.push(entry);
			continue;
		}

		if (absPct > threshold) {
			entry.status = 'fail';
			entry.note = `abs change ${absPct}% exceeds ${threshold}%`;
			failed++;
		} else {
			entry.status = 'pass';
			entry.note = withMetric.fallback
				? `Used fallback metric ${withMetric.key}`
				: '';
		}

		results.push(entry);
	}

	const report = buildReport(results, primaryMetric, defaults);
	const reportPath = path.join(root, outDir, 'report.md');
	fs.writeFileSync(reportPath, report);
	fs.writeFileSync(
		path.join(root, outDir, 'compare.json'),
		JSON.stringify(
			{ primaryMetric, defaults, results, failed },
			null,
			'\t'
		) + '\n'
	);

	console.log(report);
	console.log(`\nWrote ${reportPath}`);

	if (failed > 0) {
		process.exit(1);
	}
}

function round2(n) {
	return Math.round(n * 100) / 100;
}

function fmt(n) {
	if (n === null || n === undefined || Number.isNaN(n)) {
		return '—';
	}
	return String(n);
}

function buildReport(results, primaryMetric, defaults) {
	const lines = [];
	lines.push('<!-- blockera-perf-benchmark -->');
	lines.push('## Performance benchmark (Server-Timing)');
	lines.push('');
	lines.push(
		`Compare **WITH Blockera** vs **WITHOUT Blockera** on the same content/theme.`
	);
	lines.push('');
	lines.push(
		`- Primary metric: \`${primaryMetric}\` (fallback: Response Time median)`
	);
	lines.push(
		`- Requests: \`${defaults.requests ?? 50}\`, concurrency: \`${defaults.concurrency ?? 1}\``
	);
	lines.push(
		`- Gate: fail if \`|Δ%|\` exceeds per-scenario \`thresholdPercent\` (either direction)`
	);
	lines.push('');
	lines.push(
		'| Scenario | Without (ms) | With (ms) | Δ ms | Δ % | Threshold | Status |'
	);
	lines.push('| --- | ---: | ---: | ---: | ---: | ---: | --- |');

	for (const r of results) {
		let status = '❌ fail';
		if (r.status === 'pass') {
			status = '✅ pass';
		} else if (r.status === 'skip') {
			status = '⏭️ skip';
		}
		lines.push(
			`| ${r.label} | ${fmt(r.withoutMs)} | ${fmt(r.withMs)} | ${fmt(r.deltaMs)} | ${fmt(r.deltaPercent)} | ${r.thresholdPercent}% | ${status} |`
		);
	}

	lines.push('');
	const fails = results.filter((r) => r.status === 'fail');
	if (fails.length) {
		lines.push('### Failures');
		lines.push('');
		for (const f of fails) {
			lines.push(`- **${f.label}**: ${f.note} (\`${f.url}\`)`);
		}
		lines.push('');
	}

	const skips = results.filter((r) => r.status === 'skip');
	if (skips.length) {
		lines.push('### Skipped');
		lines.push('');
		for (const s of skips) {
			lines.push(`- **${s.label}**: ${s.note}`);
		}
		lines.push('');
	}

	lines.push('<details>');
	lines.push('<summary>Scenario URLs</summary>');
	lines.push('');
	for (const r of results) {
		lines.push(`- \`${r.id}\`: ${r.url}`);
	}
	lines.push('');
	lines.push('</details>');
	lines.push('');

	return lines.join('\n');
}

main();
