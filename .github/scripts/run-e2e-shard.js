const { execSync } = require('child_process');
const {
	getFilteredCategoriesFromPrEnv,
	getSpecPattern,
} = require('./e2e-categories-lib');

const categories = JSON.parse(process.env.SHARD_CATEGORIES || '[]');
const prFilteredCategories = getFilteredCategoriesFromPrEnv();
const prFilterActive = Boolean(prFilteredCategories);
const prAllowed = prFilterActive ? new Set(prFilteredCategories) : null;

let failed = false;

categories.forEach((category) => {
	if (prFilterActive && !prAllowed.has(category)) {
		console.log(`Skipping ${category} (not in PR Cypress filter)`);
		return;
	}

	const specPattern = getSpecPattern(category);

	if (!specPattern) {
		console.log(`No specs found for category: ${category}`);
		return;
	}

	console.log(`Running category: ${category}`);
	console.log(`Spec pattern: ${specPattern}`);

	try {
		execSync(`npm run test:e2e -- --spec "${specPattern}"`, {
			stdio: 'inherit',
			env: process.env,
		});
	} catch (error) {
		failed = true;
		console.error(`Category "${category}" failed.`);
	}
});

process.exit(failed ? 1 : 0);
