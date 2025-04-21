/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	setParentBlock,
	setBoxSpacingSide,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('RSS Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks(
			`<!-- wp:rss {"feedURL":"https://blockera.ai/feed/","displayExcerpt":true,"displayAuthor":true,"displayDate":true} /-->`
		);

		// Select target block
		cy.getBlock('core/rss').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// Has inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'exist'
		);

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.0. Block styles
		//

		cy.getBlock('core/rss').should(
			'have.css',
			'background-clip',
			'border-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/rss').should(
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
		setBoxSpacingSide('margin-bottom', 10);

		cy.getBlock('core/rss')
			.first()
			.within(() => {
				cy.get('.wp-block-rss__item')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.2. elements/title
		//
		setParentBlock();
		setInnerBlock('elements/title');

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff2020');

		cy.getBlock('core/rss')
			.first()
			.within(() => {
				cy.get('.wp-block-rss__item-title')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 32, 32)');
			});

		//
		// 1.2. elements/date
		//
		setParentBlock();
		setInnerBlock('elements/date');

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff4040');

		cy.getBlock('core/rss')
			.first()
			.within(() => {
				cy.get('.wp-block-rss__item-publish-date')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 64, 64)');
			});

		//
		// 1.3. elements/author
		//
		setParentBlock();
		setInnerBlock('elements/author');

		//
		// 1.3.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff6060');

		cy.getBlock('core/rss')
			.first()
			.within(() => {
				cy.get('.wp-block-rss__item-author')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 96, 96)');
			});

		//
		// 1.4. elements/excerpt
		//
		setParentBlock();
		setInnerBlock('elements/excerpt');

		//
		// 1.4.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff8080');

		cy.getBlock('core/rss')
			.first()
			.within(() => {
				cy.get('.wp-block-rss__item-excerpt')
					.first()
					.should(
						'have.css',
						'background-color',
						'rgb(255, 128, 128)'
					);
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-rss').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-rss').within(() => {
			// elements/container
			cy.get('.wp-block-rss__item')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/title
			cy.get('.wp-block-rss__item-title')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 32, 32)');

			// elements/date
			cy.get('.wp-block-rss__item-publish-date')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 64, 64)');

			// elements/author
			cy.get('.wp-block-rss__item-author')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 96, 96)');

			// elements/excerpt
			cy.get('.wp-block-rss__item-excerpt')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 128, 128)');
		});
	});
});
