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

describe('Latest Comments Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:latest-comments /-->`);

		// Select target block
		cy.getBlock('core/latest-comments').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');
		//
		// 1. Edit Blocks
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/latest-comments').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/latest-comments').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/container
		//
		setInnerBlock('elements/container');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/latest-comments')
			.first()
			.within(() => {
				cy.get('.wp-block-latest-comments__comment')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.2. elements/avatar
		//
		setParentBlock();
		setInnerBlock('elements/avatar');

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff2020');

		cy.getBlock('core/latest-comments')
			.first()
			.within(() => {
				cy.get('.wp-block-latest-comments__comment-avatar')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 32, 32)');
			});

		//
		// 1.2. elements/author
		//
		setParentBlock();
		setInnerBlock('elements/author');

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff4040');

		cy.getBlock('core/latest-comments')
			.first()
			.within(() => {
				cy.get('.wp-block-latest-comments__comment-author')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 64, 64)');
			});

		//
		// 1.3. elements/post-title
		//
		setParentBlock();
		setInnerBlock('elements/post-title');

		//
		// 1.3.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff6060');

		cy.getBlock('core/latest-comments')
			.first()
			.within(() => {
				cy.get('.wp-block-latest-comments__comment-link')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 96, 96)');
			});

		//
		// 1.4. elements/date
		//
		setParentBlock();
		setInnerBlock('elements/date');

		//
		// 1.4.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff8080');

		cy.getBlock('core/latest-comments')
			.first()
			.within(() => {
				cy.get('.wp-block-latest-comments__comment-date')
					.first()
					.should(
						'have.css',
						'background-color',
						'rgb(255, 128, 128)'
					);
			});

		//
		// 1.4. elements/comment-text
		//
		setParentBlock();
		setInnerBlock('elements/comment-text');

		//
		// 1.4.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff8080');

		cy.getBlock('core/latest-comments')
			.first()
			.within(() => {
				cy.get('.wp-block-latest-comments__comment-excerpt')
					.first()
					.should(
						'have.css',
						'background-color',
						'rgb(255, 128, 128)'
					);
			});

		//
		// 2. Check settings tab
		//
		setParentBlock();
		cy.getByDataTest('settings-tab').click();

		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.components-tools-panel-header')
				.contains('Settings')
				.scrollIntoView()
				.should('be.visible');
		});

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-latest-comments').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-latest-comments').within(() => {
			// elements/container
			cy.get('.wp-block-latest-comments__comment')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/avatar
			cy.get('.wp-block-latest-comments__comment-avatar')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 32, 32)');

			// elements/author
			cy.get('.wp-block-latest-comments__comment-author')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 64, 64)');

			// elements/post-title
			cy.get('.wp-block-latest-comments__comment-link')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 96, 96)');

			// elements/date
			cy.get('.wp-block-latest-comments__comment-date')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 128, 128)');

			// elements/date
			cy.get('.wp-block-latest-comments__comment-excerpt')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 128, 128)');
		});
	});
});
