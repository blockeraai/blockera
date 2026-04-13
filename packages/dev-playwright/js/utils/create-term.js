/**
 * Create term helper utilities for Playwright e2e tests.
 */

/**
 * Create a term of a given taxonomy.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} name - Term name (default: 'Test category').
 * @param {string} taxonomy - Taxonomy (default: 'category').
 * @param {Object} options - Additional options.
 * @param {string} options.slug - Taxonomy slug.
 * @param {number|string} options.parent - Parent taxonomy (ID or name).
 * @param {string} options.description - Taxonomy description.
 * @param {Function} options.beforeSave - Callable function hook.
 * @return {Promise<Object>} Created term data.
 */
async function createTerm(
	page,
	name = 'Test category',
	taxonomy = 'category',
	options = {}
) {
	const { slug = '', parent = -1, description = '', beforeSave } = options;
	const testURL = process.env.WP_BASE_URL || 'http://localhost:8888';

	await page.goto(`${testURL}/wp-admin/edit-tags.php?taxonomy=${taxonomy}`);

	// Set up request interception for AJAX
	await page.route('**/admin-ajax.php', (route) => {
		const request = route.request();
		if (
			request.method() === 'POST' &&
			request.postData()?.includes('action=add-tag')
		) {
			route.continue();
		} else {
			route.continue();
		}
	});

	await page.locator('#tag-name').click();
	await page.locator('#tag-name').fill(name);

	if (slug) {
		await page.locator('#tag-slug').click();
		await page.locator('#tag-slug').fill(slug);
	}

	if (description) {
		await page.locator('#tag-description').click();
		await page.locator('#tag-description').fill(description);
	}

	if (parent !== -1) {
		const parentSelect = page.locator('#parent');
		if ((await parentSelect.count()) > 0) {
			await parentSelect.selectOption(parent.toString());
		}
	}

	if (typeof beforeSave === 'function') {
		await beforeSave();
	}

	await page.locator('#submit').click();

	// Wait for the term to be created
	await page.waitForTimeout(1000);

	// Return term data (simplified - in real implementation, parse response)
	return {
		name,
		taxonomy,
		slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
	};
}

module.exports = {
	createTerm,
};
