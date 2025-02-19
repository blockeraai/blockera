/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	setParentBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Tag Cloud Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks existence', () => {
		appendBlocks('<!-- wp:tag-cloud {"taxonomy":"category"} /-->\n ');

		// Select target block
		cy.getBlock('core/tag-cloud').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// Has inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'exist'
		);

		//
		// 1. Edit Block
		//

		//
		// 1.1. Block styles
		//
		cy.getBlock('core/tag-cloud').should(
			'have.css',
			'background-clip',
			'border-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/tag-cloud').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.2. elements/tag-link
		//
		setInnerBlock('elements/tag-link');

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/tag-cloud')
			.first()
			.within(() => {
				cy.get('a.tag-cloud-link')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-tag-cloud').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-tag-cloud').within(() => {
			// elements/tag-link
			cy.get('a.tag-cloud-link')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');
		});
	});
});
