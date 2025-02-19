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

describe('Blocksy → Post Template Block → Block support', () => {
	beforeEach(() => {
		createPost();
	});

	it('Block support + Should not have inner blocks', () => {
		appendBlocks(`<!-- wp:blocksy/query {"uniqueId":"329d7597"} -->
<div class="wp-block-blocksy-query"><!-- wp:blocksy/post-template {"layout":{"type":"default","columnCount":3}} -->
<!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column {"width":"25%"} -->
<div class="wp-block-column" style="flex-basis:25%"><!-- wp:blocksy/dynamic-data {"field":"wp:featured_image","aspectRatio":"1","has_field_link":"yes"} /--></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"75%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:75%"><!-- wp:blocksy/dynamic-data {"tagName":"h2","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|30"}}},"has_field_link":"yes","fontSize":"medium"} /-->

<!-- wp:blocksy/dynamic-data {"field":"wp:date","has_field_link":"yes"} /-->

<!-- wp:blocksy/dynamic-data {"field":"wp:excerpt","excerpt_length":20} /--></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->
<!-- /wp:blocksy/post-template --></div>
<!-- /wp:blocksy/query -->
		`);

		cy.getBlock('blocksy/post-template').click();

		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);

		//
		// 1. Edit Blocks
		//

		//
		// 1.0. Block Style
		//
		cy.getBlock('blocksy/post-template').should(
			'have.css',
			'background-clip',
			'border-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('blocksy/post-template').should(
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
