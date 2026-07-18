#!/usr/bin/env node
/**
 * Compare Blockera vs Core block editor Server-Timing CSV medians and enforce thresholds.
 *
 * Gate: abs((blockera - core) / core * 100) > thresholdPercent → fail.
 * Thresholds come from scenarios.json (scenario override → defaults.thresholdPercent).
 */

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const outDir = process.env.PERF_RESULTS_DIR || '.github/performance/results';
const scenariosPath =
	process.env.SCENARIOS_FILE || '.github/performance/scenarios.json';

function readCsv(filePath) {
	const text = fs.readFileSync(filePath, 'utf8');
	if (!text.trim()) {
		throw new Error(`Empty CSV: ${filePath}`);
	}

	const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');
	// wpp-research may log npm/progress noise before the CSV header.
	const headerIdx = lines.findIndex((line) => /^URL,/i.test(line.trim()));
	if (headerIdx === -1) {
		throw new Error(`Could not find CSV header in ${filePath}`);
	}

	const header = splitCsvLine(lines[headerIdx]).map((c) => c.trim());

	// wpp-research prints a transposed table: header is `URL,<url1>,<url2>,...`
	// and each subsequent line is `<Metric>,<v1>,<v2>,...`.
	const transposed = header.length > 1 && /^https?:\/\//i.test(header[1]);

	if (transposed) {
		const urls = header.slice(1);
		const rows = urls.map((u) => ({ URL: u }));
		for (let i = headerIdx + 1; i < lines.length; i++) {
			const cols = splitCsvLine(lines[i]);
			const field = (cols[0] ?? '').trim();
			if (!field) {
				continue;
			}
			for (let j = 0; j < urls.length; j++) {
				rows[j][field] = (cols[j + 1] ?? '').trim();
			}
		}
		return { headers: header, rows };
	}

	// Fallback: one row per URL (older/non-transposed output).
	const rows = [];
	for (let i = headerIdx + 1; i < lines.length; i++) {
		const cols = splitCsvLine(lines[i]);
		if (cols.length < 2 || !/^https?:\/\//i.test(cols[0])) {
			continue;
		}
		const row = {};
		header.forEach((h, idx) => {
			row[h] = (cols[idx] ?? '').trim();
		});
		rows.push(row);
	}
	return { headers: header, rows };
}

function successRateOf(row) {
	if (!row) {
		return null;
	}
	const raw = row['Success Rate'] ?? row['success rate'] ?? '';
	const n = Number(String(raw).replace('%', '').trim());
	return Number.isNaN(n) ? null : n;
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

		const withSuccess = successRateOf(withRow);
		const withoutSuccess = successRateOf(withoutRow);

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
			withSuccess,
			withoutSuccess,
			status: 'pass',
			note: '',
		};

		if (!withRow || !withoutRow) {
			entry.status = 'fail';
			entry.note = !withRow
				? 'Missing Blockera row'
				: 'Missing Core block editor row';
			failed++;
			results.push(entry);
			continue;
		}

		const withMetric = pickMetric(withRow, primaryMetric);
		const withoutMetric = pickMetric(withoutRow, primaryMetric);

		// Settings (and similar) only exist with Blockera. Core often returns
		// non-200 without the plugin — still report Blockera timings, skip gate.
		if (scenario.requiresBlockera) {
			if (withSuccess === 0 || !withMetric) {
				entry.status = 'fail';
				entry.note = `Blockera settings unavailable (success=${fmt(withSuccess)}%, metric missing)`;
				failed++;
			} else {
				entry.metricKey = withMetric.key;
				entry.withMs = withMetric.value;
				entry.status = 'skip';
				entry.note =
					withoutSuccess === 0
						? 'Informational only (requires Blockera); Core returns non-200 without plugin'
						: 'Informational only (requires Blockera); gate not applied';
			}
			results.push(entry);
			continue;
		}

		// A 0% success rate means the URL never returned HTTP 200 (e.g. redirect
		// to a pretty permalink, or admin login). Timings are not comparable.
		if (withSuccess === 0 || withoutSuccess === 0) {
			entry.status = 'fail';
			entry.note = `Non-200 responses (success Blockera=${fmt(withSuccess)}%, Core=${fmt(withoutSuccess)}%); check URL / redirects / auth`;
			failed++;
			results.push(entry);
			continue;
		}

		if (!withMetric || !withoutMetric) {
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
			entry.note =
				'Core block editor median is 0; cannot compute percent change';
			failed++;
			results.push(entry);
			continue;
		}

		entry.deltaPercent = round2(
			((withMetric.value - withoutMetric.value) / withoutMetric.value) *
				100
		);
		const absPct = Math.abs(entry.deltaPercent);

		if (absPct > threshold) {
			entry.status = 'fail';
			entry.note = `${fmtSigned(entry.deltaPercent, '%')} exceeds ±${threshold}%`;
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

/**
 * Format a millisecond value with an `ms` suffix.
 *
 * @param {number|null|undefined} n
 * @return {string} Value with ms suffix, or an em dash when empty.
 */
function fmtMs(n) {
	if (n === null || n === undefined || Number.isNaN(n)) {
		return '—';
	}
	return `${n}ms`;
}

/**
 * Format a signed delta for the report table (+12.5 / -3.2).
 *
 * @param {number|null|undefined} n
 * @param {string} [suffix]
 * @return {string} Signed number string, or an em dash when empty.
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

function buildReport(results, primaryMetric, defaults) {
	const lines = [];
	lines.push('<!-- blockera-perf-benchmark -->');
	lines.push('## Performance benchmark (Server-Timing)');
	lines.push('');
	lines.push(
		'Compare **Blockera** vs **Core block editor** on the same content and theme.'
	);
	lines.push('');
	lines.push(
		'| Scenario | Metric | Core | Blockera | Δ ms | Δ % | Threshold | Status |'
	);
	lines.push('| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |');

	for (const r of results) {
		let status = '❌ fail';
		if (r.status === 'pass') {
			status = '✅ pass';
		} else if (r.status === 'skip') {
			status = '⏭️ skip';
		}
		const metric = r.metricKey ? r.metricKey.replace(' (median)', '') : '—';
		lines.push(
			`| ${r.label} | ${metric} | ${fmtMs(r.withoutMs)} | ${fmtMs(r.withMs)} | ${fmtSigned(r.deltaMs)} | ${fmtSigned(r.deltaPercent, '%')} | ${r.thresholdPercent}% | ${status} |`
		);
	}

	lines.push('');
	lines.push(
		`- Primary metric: \`${primaryMetric}\` (fallback: Response Time median)`
	);
	lines.push(
		`- Requests: \`${defaults.requests ?? 200}\`, concurrency: \`${defaults.concurrency ?? 1}\``
	);
	lines.push(
		`- Gate: fail if \`|Δ%|\` exceeds per-scenario \`thresholdPercent\` (either direction)`
	);
	lines.push(
		'- Δ is **Blockera − Core** (positive means Blockera is slower)'
	);
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
