/**
 * Playwright reporter that aggregates attached performance result payloads.
 *
 * Adapted from WordPress core tests/performance/config/performance-reporter.js
 */

const { join } = require('node:path');
const { writeFileSync, existsSync, mkdirSync } = require('node:fs');

/**
 * @implements {import('@playwright/test/reporter').Reporter}
 */
class PerformanceReporter {
	/**
	 * @type {Record<string, {file: string, results: Record<string, number[]>[]}>}
	 */
	allResults = {};

	/**
	 * @param {import('@playwright/test/reporter').TestCase} test
	 * @param {import('@playwright/test/reporter').TestResult} result
	 */
	onTestEnd(test, result) {
		const performanceResults = result.attachments.find(
			(attachment) => attachment.name === 'results'
		);

		if (performanceResults?.body) {
			// 0 = empty, 1 = browser, 2 = file name, 3 = suite, 4 = scenario id.
			const titlePath = test.titlePath();
			const title = `${titlePath[3]} › ${titlePath[4]}`;

			this.allResults[title] ??= {
				file: test.location.file,
				results: [],
			};

			this.allResults[title].results.push(
				JSON.parse(performanceResults.body.toString('utf-8'))
			);
		}
	}

	onEnd() {
		const summary = [];

		for (const [title, { file, results }] of Object.entries(
			this.allResults
		)) {
			summary.push({
				file,
				title,
				results,
			});
		}

		if (!existsSync(process.env.WP_ARTIFACTS_PATH)) {
			mkdirSync(process.env.WP_ARTIFACTS_PATH, { recursive: true });
		}

		const prefix = process.env.TEST_RESULTS_PREFIX;
		const fileNamePrefix = prefix ? `${prefix}-` : '';

		writeFileSync(
			join(
				process.env.WP_ARTIFACTS_PATH,
				`${fileNamePrefix}performance-results.json`
			),
			JSON.stringify(summary, null, 2)
		);
	}
}

module.exports = PerformanceReporter;
