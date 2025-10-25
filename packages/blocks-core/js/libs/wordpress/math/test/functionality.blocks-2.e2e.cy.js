/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	openInserter,
	setInnerBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Math Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality', () => {
		appendBlocks(`<!-- wp:math {"latex":"x^2 * \u005cfrac{a}{b}"} -->
<math class="wp-block-math" display="block"><semantics><mrow><msup><mi>x</mi><mn>2</mn></msup><mo>∗</mo><mfrac><mi>a</mi><mi>b</mi></mfrac></mrow><annotation encoding="application/x-tex">x^2 * \frac{a}{b}</annotation></semantics></math>
<!-- /wp:math -->
			`);

		cy.getBlock('core/math').click({ force: true });
		cy.get('.blockera-extension-block-card').should('be.visible');

		//
		// 1. Edit Block
		//

		//
		// 1.1. Block styles
		//
		cy.getBlock('core/math')
			.first()
			.should('have.css', 'background-clip', 'border-box');

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/math')
			.first()
			.should('have.css', 'background-clip', 'padding-box');

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-math')
			.first()
			.should('have.css', 'background-clip', 'padding-box');
	});
});
