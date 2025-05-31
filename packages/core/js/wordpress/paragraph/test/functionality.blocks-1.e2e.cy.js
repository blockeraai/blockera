/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Paragraph Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`
		<!-- wp:paragraph -->
<p>This is a test <a href="#a">paragraph</a>...</p>
<!-- /wp:paragraph -->
		`);

		cy.getBlock('core/paragraph').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover']);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/paragraph').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/paragraph').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/link
		//
		setInnerBlock('elements/link');

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'cccccc');

		//
		// 2. Assert inner blocks selectors in editor
		//
		cy.getBlock('core/paragraph').within(() => {
			// link inner block
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);
		});

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block').within(() => {
			// link inner block
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);
		});
	});
});
