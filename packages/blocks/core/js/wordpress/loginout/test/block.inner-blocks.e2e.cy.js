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

describe('Loginout Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence + CSS selectors on front-end', () => {
		appendBlocks(`<!-- wp:loginout {"displayLoginAsForm":true} /-->  `);

		cy.getBlock('core/loginout').click();

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. elements/form inner block
		//
		setInnerBlock('elements/form');

		cy.setColorControlValue('BG Color', 'ff0000');

		//
		// 1.2. elements/input-label inner block
		//
		setParentBlock();
		setInnerBlock('elements/input-label');

		cy.setColorControlValue('BG Color', 'ff2020');

		//
		// 1.3. elements/input inner block
		//
		setParentBlock();
		setInnerBlock('elements/input');

		cy.setColorControlValue('BG Color', 'ff4040');

		//
		// 1.4. elements/remember inner block
		//
		setParentBlock();
		setInnerBlock('elements/remember');

		cy.setColorControlValue('BG Color', 'ff6060');

		//
		// 1.5. core/button inner block
		//
		setParentBlock();
		setInnerBlock('core/button');

		cy.setColorControlValue('BG Color', 'ff8080');

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		// logout to see form login elements
		cy.get('.logged-in.blockera-block a').click();

		cy.get('.blockera-block').within(() => {
			// elements/form inner block
			cy.get('form')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/input-label inner block
			cy.get('.login-username label')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 32, 32)');
			cy.get('.login-password label')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 32, 32)');

			// elements/input inner block
			cy.get('.login-username input')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 64, 64)');
			cy.get('.login-password input')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 64, 64)');

			// elements/remember inner block
			cy.get('.login-remember label')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 96, 96)');

			// core/button inner block
			cy.get('.login-submit .button.button-primary')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 128, 128)');
		});
	});
});
