/**
 * Scenario-driven Server-Timing / TTFB / LCP benchmarks.
 *
 * Pattern adapted from WordPress core tests/performance/specs/*.test.js
 * URLs come from .github/performance/scenarios.json (resolved at content setup).
 */

const fs = require('node:fs');
const path = require('node:path');
const { test } = require('@wordpress/e2e-test-utils-playwright');
const { camelCaseDashes } = require('../utils');

const root = process.cwd();
const resolvedPath = path.join(
	root,
	'.github/performance/results/resolved-scenarios.json'
);
const scenariosPath = path.join(root, '.github/performance/scenarios.json');

const config = JSON.parse(
	fs.readFileSync(
		fs.existsSync(resolvedPath) ? resolvedPath : scenariosPath,
		'utf8'
	)
);

const scenarios = config.scenarios || [];
const subject = process.env.PERF_SUBJECT || 'blockera';
const iterations = Number(process.env.TEST_RUNS || 20);

/**
 * @param {Object} scenario Scenario config row.
 * @return {string} Path relative to site root.
 */
function scenarioPath(scenario) {
	return scenario.resolvedPath || scenario.path || '/';
}

test.describe('Scenario', () => {
	for (const scenario of scenarios) {
		const skipForCore =
			subject === 'core' && Boolean(scenario.requiresBlockera);

		test.describe(scenario.id, () => {
			if (!scenario.auth) {
				test.use({
					storageState: {},
				});
			}

			// @debug-ignore — conditional skip when subject is core without Blockera
			test.skip(skipForCore, `Scenario ${scenario.id} requires Blockera`);

			const results = {
				timeToFirstByte: [],
			};

			test.afterAll(async ({}, testInfo) => {
				await testInfo.attach('results', {
					body: JSON.stringify(results, null, 2),
					contentType: 'application/json',
				});
			});

			for (let i = 1; i <= iterations; i++) {
				test(`Measure load time metrics (${i} of ${iterations})`, async ({
					page,
					metrics,
				}) => {
					// Clear caches via clear-cache.php mu-plugin (no page render).
					await page.goto('/?clear_cache');

					const target = scenarioPath(scenario);
					await page.goto(target);

					const serverTiming = await metrics.getServerTiming();

					for (const [key, value] of Object.entries(serverTiming)) {
						results[camelCaseDashes(key)] ??= [];
						results[camelCaseDashes(key)].push(value);
					}

					const ttfb = await metrics.getTimeToFirstByte();
					results.timeToFirstByte.push(ttfb);

					// LCP is meaningful on front-end document loads only.
					if (!scenario.auth) {
						results.largestContentfulPaint ??= [];
						results.lcpMinusTtfb ??= [];
						const lcp = await metrics.getLargestContentfulPaint();
						results.largestContentfulPaint.push(lcp);
						results.lcpMinusTtfb.push(lcp - ttfb);
					}
				});
			}
		});
	}
});
