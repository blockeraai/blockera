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

describe('Site Title Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks('<!-- wp:site-title /--> ');

		// Select target block
		cy.getBlock('core/site-title').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// Has inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'exist'
		);

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByDataTest('elements/link').should('exist');

				// no other item
				cy.getByDataTest('core/heading').should('not.exist');
			}
		);

		//
		// 1. Edit block
		//

		//
		// 1.1. Block styles
		//
		cy.getBlock('core/site-title').should(
			'have.css',
			'background-clip',
			'border-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/site-title').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.2. elements/link
		//
		setInnerBlock('elements/link');

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', '00ff00');

		cy.getBlock('core/site-title')
			.first()
			.within(() => {
				cy.get('a')
					.first()
					.should('have.css', 'background-color', 'rgb(0, 255, 0)');
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-site-title').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-site-title').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(0, 255, 0)'
			);
		});
	});
});
