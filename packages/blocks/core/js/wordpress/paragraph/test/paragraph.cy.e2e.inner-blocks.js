/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	redirectToFrontPage,
	openInnerBlocksExtension,
} from '@blockera/dev-cypress/js/helpers';

describe('Paragraph Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks selectors in editor and front-end', () => {
		appendBlocks(`
		<!-- wp:paragraph -->
<p>This is a test <a href="#a">paragraph</a>...</p>
<!-- /wp:paragraph -->
		`);

		cy.getBlock('core/paragraph').click();

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. Link inner block
		//
		setInnerBlock('elements/link');
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
