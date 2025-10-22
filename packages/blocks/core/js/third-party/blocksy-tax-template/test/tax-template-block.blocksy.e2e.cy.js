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

describe('Blocksy → Tax Template Block → Block support', () => {
	beforeEach(() => {
		createPost();
	});

	it('Block support + Should not have inner blocks', () => {
		appendBlocks(`<!-- wp:blocksy/tax-query {"uniqueId":"d27d7623"} -->
<div class="wp-block-blocksy-tax-query"><!-- wp:blocksy/tax-template {"layout":{"type":"grid","columnCount":3}} -->
<!-- wp:columns {"verticalAlignment":"center"} -->
<div class="wp-block-columns are-vertically-aligned-center"><!-- wp:column {"verticalAlignment":"center","width":"33.33%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:33.33%"><!-- wp:blocksy/dynamic-data {"field":"wp:term_image","aspectRatio":"1","has_field_link":"yes"} /--></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"66.66%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:66.66%"><!-- wp:blocksy/dynamic-data {"tagName":"h5","field":"wp:term_title","style":{"spacing":{"margin":{"bottom":"0px"}}},"has_field_link":"yes"} /-->

<!-- wp:blocksy/dynamic-data {"field":"wp:term_count","after":" items"} /--></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->
<!-- /wp:blocksy/tax-template --></div>
<!-- /wp:blocksy/tax-query -->
		`);

		cy.getBlock('blocksy/tax-template').click();

		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover']);

		//
		// 1. Edit Blocks
		//

		//
		// 1.0. Block Style
		//
		cy.getBlock('blocksy/tax-template').should(
			'have.css',
			'background-clip',
			'border-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('blocksy/tax-template').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 2. Assert styles in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block')
			.first()
			.should('have.css', 'background-clip', 'padding-box');
	});
});
