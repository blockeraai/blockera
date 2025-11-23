/**
 * Blockera dependencies
 */
import { createPost } from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import data from './data.json';

export default function setup() {
	// Create categories sequentially
	const categories = data.categories;

	// eslint-disable-next-line cypress/no-assigning-return-values
	let categoryChain = cy.wpCli(
		`term create category '${categories[0]}' || true`
	);

	for (let i = 1; i < categories.length; i++) {
		categoryChain = categoryChain.then(() => {
			return cy.wpCli(`term create category '${categories[i]}' || true`);
		});
	}

	categoryChain.then(() => {
		// Run default setup
		cy.setScreenshotViewport('desktop');

		createPost();
	});

	return false;
}
