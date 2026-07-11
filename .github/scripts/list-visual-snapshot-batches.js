#!/usr/bin/env node
/**
 * Discover visual snapshot fixture folders and split them into CI matrix batches.
 *
 * Usage:
 *   node list-visual-snapshot-batches.js              # categories JSON: ["visual-snapshots-1", ...]
 *   node list-visual-snapshot-batches.js --batch 1    # fixtures JSON for batch N: ["block-buttons", ...]
 *   node list-visual-snapshot-batches.js --map        # { "visual-snapshots-1": [...], ... }
 *   node list-visual-snapshot-batches.js --fixtures-csv --batch 1  # comma-separated names
 *
 * Env:
 *   VISUAL_SNAPSHOT_BATCH_SIZE  Batch size (default: 20)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const FIXTURES_DIR = path.join(ROOT, 'tests', 'fixtures');
const PR_ENV_PATH = path.join(ROOT, '.pr-playwright.env.json');
const CATEGORY_PREFIX = 'visual-snapshots-';

function getBatchSize() {
	const raw = process.env.VISUAL_SNAPSHOT_BATCH_SIZE;
	const size = raw ? parseInt(raw, 10) : 20;

	if (!Number.isFinite(size) || size < 1) {
		throw new Error(
			`Invalid VISUAL_SNAPSHOT_BATCH_SIZE: ${raw}. Expected a positive integer.`
		);
	}

	return size;
}

function getAllowlist() {
	if (!fs.existsSync(PR_ENV_PATH)) {
		return null;
	}

	try {
		const prEnv = JSON.parse(fs.readFileSync(PR_ENV_PATH, 'utf8'));
		const allowlist = prEnv.visualSnapshotFixtures;

		if (!Array.isArray(allowlist) || allowlist.length === 0) {
			return null;
		}

		return new Set(allowlist);
	} catch (error) {
		console.error(
			'Failed to read visualSnapshotFixtures from .pr-playwright.env.json:',
			error.message
		);
		return null;
	}
}

/**
 * Same eligibility rules as tests/visual.block-screenshots.ply.js:
 * directory with input.html, optional config.screenshot !== false.
 */
function listEligibleFixtures() {
	if (!fs.existsSync(FIXTURES_DIR)) {
		return [];
	}

	const allowlist = getAllowlist();
	const folders = fs
		.readdirSync(FIXTURES_DIR, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name)
		.sort();

	const eligible = [];

	for (const sectionId of folders) {
		if (allowlist && !allowlist.has(sectionId)) {
			continue;
		}

		const sectionDir = path.join(FIXTURES_DIR, sectionId);
		const inputHtmlPath = path.join(sectionDir, 'input.html');

		if (!fs.existsSync(inputHtmlPath)) {
			continue;
		}

		const sectionContent = fs.readFileSync(inputHtmlPath, 'utf8');
		if (!sectionContent) {
			continue;
		}

		let shouldScreenshot = true;
		const configPath = path.join(sectionDir, 'config.json');

		if (fs.existsSync(configPath)) {
			try {
				const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
				if (config && config.screenshot === false) {
					shouldScreenshot = false;
				}
			} catch {
				// Ignore unreadable config; default to screenshot.
			}
		}

		if (shouldScreenshot) {
			eligible.push(sectionId);
		}
	}

	return eligible;
}

function chunkFixtures(fixtures, batchSize) {
	const batches = [];

	for (let i = 0; i < fixtures.length; i += batchSize) {
		batches.push(fixtures.slice(i, i + batchSize));
	}

	// Always emit at least one batch category when the visual-snapshots suite is requested,
	// even if the allowlist is empty after filtering (job can no-op cleanly).
	if (batches.length === 0) {
		batches.push([]);
	}

	return batches;
}

function buildBatchMap(fixtures, batchSize) {
	const batches = chunkFixtures(fixtures, batchSize);
	const map = {};

	batches.forEach((batchFixtures, index) => {
		map[`${CATEGORY_PREFIX}${index + 1}`] = batchFixtures;
	});

	return map;
}

function parseArgs(argv) {
	const args = {
		batch: null,
		map: false,
		fixturesCsv: false,
	};

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg === '--map') {
			args.map = true;
		} else if (arg === '--fixtures-csv') {
			args.fixturesCsv = true;
		} else if (arg === '--batch') {
			const value = argv[++i];
			const batch = parseInt(value, 10);

			if (!Number.isFinite(batch) || batch < 1) {
				throw new Error(`Invalid --batch value: ${value}`);
			}

			args.batch = batch;
		} else if (arg === '--help' || arg === '-h') {
			args.help = true;
		} else {
			throw new Error(`Unknown argument: ${arg}`);
		}
	}

	return args;
}

function main() {
	const args = parseArgs(process.argv.slice(2));

	if (args.help) {
		console.log(`Usage:
  node list-visual-snapshot-batches.js
  node list-visual-snapshot-batches.js --batch <n>
  node list-visual-snapshot-batches.js --batch <n> --fixtures-csv
  node list-visual-snapshot-batches.js --map

Env:
  VISUAL_SNAPSHOT_BATCH_SIZE  (default: 20)`);
		process.exit(0);
	}

	const batchSize = getBatchSize();
	const fixtures = listEligibleFixtures();
	const map = buildBatchMap(fixtures, batchSize);

	if (args.map) {
		process.stdout.write(JSON.stringify(map));
		return;
	}

	if (args.batch !== null) {
		const key = `${CATEGORY_PREFIX}${args.batch}`;
		const batchFixtures = map[key];

		if (!batchFixtures) {
			throw new Error(
				`Batch ${args.batch} does not exist. Available: ${Object.keys(map).join(', ')}`
			);
		}

		if (args.fixturesCsv) {
			process.stdout.write(batchFixtures.join(','));
		} else {
			process.stdout.write(JSON.stringify(batchFixtures));
		}
		return;
	}

	process.stdout.write(JSON.stringify(Object.keys(map)));
}

try {
	main();
} catch (error) {
	console.error(error.message || error);
	process.exit(1);
}
