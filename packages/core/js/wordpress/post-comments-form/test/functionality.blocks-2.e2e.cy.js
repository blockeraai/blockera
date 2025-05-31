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

import { testContent } from './test-content';

describe('Post Comments Form Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/post-comments-form').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems([
			'normal',
			'hover',
			'elements/form',
			'elements/title',
			'elements/notes',
			'elements/input-label',
			'elements/input',
			'elements/textarea',
			'elements/cookie-consent',
			'core/button',
		]);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/post-comments-form').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/post-comments-form').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/form inner block
		//
		setInnerBlock('elements/form');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		cy.setColorControlValue('BG Color', 'ff0000');

		//
		// 1.2. elements/title inner block
		//
		setParentBlock();
		setInnerBlock('elements/title');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		cy.setColorControlValue('BG Color', 'ff2020');

		//
		// 1.3. elements/notes inner block
		//
		setParentBlock();
		setInnerBlock('elements/notes');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		cy.setColorControlValue('BG Color', 'ff4040');

		//
		// 1.3. elements/input-label inner block
		//
		setParentBlock();
		setInnerBlock('elements/input-label');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		// Block card states active items
		cy.get('.block-card--inner-block').within(() => {
			['normal', 'hover'].forEach((state) => {
				cy.get(`[data-cy="repeater-item"][data-id="${state}"]`).should(
					'be.visible'
				);
			});

			['elements/form'].forEach((state) => {
				cy.get(`[data-cy="repeater-item"][data-id="${state}"]`).should(
					'not.exist'
				);
			});
		});

		cy.setColorControlValue('BG Color', 'ff6060');

		//
		// 1.4. elements/input inner block
		//
		setParentBlock();
		setInnerBlock('elements/input');

		cy.checkBlockCardItems(
			['normal', 'hover', 'focus', 'active', 'placeholder'],
			true
		);

		cy.setColorControlValue('BG Color', 'ff8080');

		//
		// 1.5. elements/textarea inner block
		//
		setParentBlock();
		setInnerBlock('elements/textarea');

		cy.checkBlockCardItems(
			['normal', 'hover', 'focus', 'active', 'placeholder'],
			true
		);

		cy.setColorControlValue('BG Color', 'ffaaaa');

		//
		// 1.6. elements/cookie-consent inner block
		//
		setParentBlock();
		setInnerBlock('elements/cookie-consent');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		cy.setColorControlValue('BG Color', 'ffbbbb');

		//
		// 1.7. core/button inner block
		//
		setParentBlock();
		setInnerBlock('core/button');

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		cy.setColorControlValue('BG Color', 'ffcccc');

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.wp-block-post-comments-form.blockera-block').within(() => {
			cy.get('a').contains('Log out?').click();
		});

		cy.get('.wp-block-post-comments-form.blockera-block').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.wp-block-post-comments-form.blockera-block').within(() => {
			// elements/title
			cy.get('.comment-reply-title')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 32, 32)');

			// elements/form
			cy.get('.comment-form')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/notes
			cy.get('.comment-notes')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 64, 64)');

			// elements/input-label
			cy.get('label')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 96, 96)');

			// elements/input
			cy.get('input[type="text"]')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 128, 128)');

			cy.get('input[name="url"], input[type="url"]')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 128, 128)');

			cy.get('input[name="email"], input[type="email"]')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 128, 128)');

			// elements/textarea
			cy.get('textarea')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 170, 170)');

			// elements/cookie-consent
			cy.get('.comment-form-cookies-consent')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 187, 187)');

			// core/button
			cy.get('.wp-block-button > .wp-element-button, [type="submit"]')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 204, 204)');
		});
	});
});
