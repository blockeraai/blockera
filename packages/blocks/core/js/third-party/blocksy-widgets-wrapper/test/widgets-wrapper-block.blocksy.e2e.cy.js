/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
	openMoreFeaturesControl,
	savePage,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Blocksy → Widgets Wrapper Block → Block support', () => {
	beforeEach(() => {
		createPost();
	});

	it('Block support + Should not have inner blocks', () => {
		appendBlocks(`<!-- wp:blocksy/widgets-wrapper {"heading":"About Me","block":"blocksy/about-me"} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">About Me</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/about-me {"lock":{"remove":true}} -->
<div>Blocksy: About Me</div>
<!-- /wp:blocksy/about-me -->
<!-- /wp:blocksy/widgets-wrapper -->
		`);

		cy.getBlock('blocksy/about-me').click();

		cy.getByAriaLabel('Select parent block: About Me').click();

		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);

		//
		// 1. Edit Blocks
		//

		//
		// 1.0. Block BG
		//
		cy.setColorControlValue('BG Color', '#dcffdc');

		cy.getBlock('blocksy/widgets-wrapper').should(
			'have.css',
			'background-color',
			'rgb(220, 255, 220)'
		);

		//
		// 2. Assert styles in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block')
			.first()
			.should('have.css', 'background-color', 'rgb(220, 255, 220)');
	});
});
