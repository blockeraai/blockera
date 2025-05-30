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

describe('Post Navigation Link Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(
			'<!-- wp:post-navigation-link {"type":"previous","label":"Prev","arrow":"chevron"} /--> '
		);

		// Select target block
		cy.getBlock('core/post-navigation-link').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover', 'elements/arrow']);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//

		cy.getBlock('core/post-navigation-link').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/post-navigation-link').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/link inner block
		//
		setInnerBlock('elements/link');

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/post-navigation-link').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(255, 0, 0)'
			);
		});

		//
		// 1.2. elements/arrow inner block
		//
		setInnerBlock('elements/arrow');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff1010');

		cy.getBlock('core/post-navigation-link').within(() => {
			cy.get('.wp-block-post-navigation-link__arrow-previous').should(
				'have.css',
				'background-color',
				'rgb(255, 16, 16)'
			);
		});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.wp-block-post-navigation-link.blockera-block').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.wp-block-post-navigation-link.blockera-block').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(255, 0, 0)'
			);

			cy.get('.wp-block-post-navigation-link__arrow-previous').should(
				'have.css',
				'background-color',
				'rgb(255, 16, 16)'
			);
		});
	});
});
