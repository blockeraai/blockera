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

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Term Template Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/term-template').click({ force: true });

		cy.get('button[aria-label="Term Template"]').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover']);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//

		cy.getBlock('core/term-template').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/term-template').should(
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

		cy.getBlock('core/term-template').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(255, 0, 0)'
			);
		});

		//
		// 2. Check settings tab
		//
		setParentBlock();
		cy.getByDataTest('settings-tab').click();

		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.components-panel__body-title button')
				.contains('Layout')
				.scrollIntoView()
				.should('be.visible');
		});

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.wp-block-term-template.blockera-block').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.wp-block-term-template.blockera-block').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(255, 0, 0)'
			);
		});
	});
});
