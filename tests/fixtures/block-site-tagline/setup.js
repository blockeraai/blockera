/**
 * Blockera dependencies
 */
import { createPost } from '@blockera/dev-cypress/js/helpers';

export default function setup() {
	const taglineText = 'This is site tagline text';

	// Set the blogdescription option (site tagline)
	// Use wpCli with skipEscaping=true and single quotes
	cy.wpCli(
		`wp option update blogdescription '${taglineText}'`,
		false,
		true
	).then(() => {
		// Edit the post (site tagline block doesn't require a specific post)
		cy.setScreenshotViewport('desktop');
		createPost();
	});

	return false;
}
