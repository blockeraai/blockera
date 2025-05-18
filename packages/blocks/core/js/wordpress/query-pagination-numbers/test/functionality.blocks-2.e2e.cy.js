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

describe('Query Pagination Numbers Block', () => {
	beforeEach(() => {
		// Generate 100 posts to make sure the pagination is visible
		// cy.wpCli('wp post generate --count=100 --post_type=post');

		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/query-pagination-numbers').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems([
			'normal',
			'hover',
			'focus',
			'active',
			'elements/numbers',
			'elements/current',
			'elements/dots',
		]);

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.0. Block styles
		//

		cy.getBlock('core/query-pagination-numbers').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/query-pagination-numbers').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/numbers inner block
		//
		setInnerBlock('elements/numbers');

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'cccccc');

		cy.getBlock('core/query-pagination-numbers')
			.first()
			.within(() => {
				cy.get('.page-numbers:not(.dots)').should(
					'have.css',
					'background-color',
					'rgb(204, 204, 204)'
				);
			});

		//
		// 1.2. elements/current inner block
		//
		setParentBlock();
		setInnerBlock('elements/current');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff2020');

		cy.getBlock('core/query-pagination-numbers')
			.first()
			.within(() => {
				cy.get('.page-numbers.current').should(
					'have.css',
					'background-color',
					'rgb(255, 32, 32)'
				);
			});

		//
		// 1.3. elements/dots inner block
		//
		setParentBlock();
		setInnerBlock('elements/dots');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.4.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff4040');

		cy.getBlock('core/query-pagination-numbers')
			.first()
			.within(() => {
				cy.get('.page-numbers.dots').should(
					'have.css',
					'background-color',
					'rgb(255, 64, 64)'
				);
			});

		//
		// 2. Check settings tab
		//
		setParentBlock();
		cy.getByDataTest('settings-tab').click();

		// layout settings should be hidden
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

		cy.get('.blockera-block.wp-block-query-pagination-numbers').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-query-pagination-numbers').within(
			() => {
				// not current and not dots because they have different styles
				cy.get('.page-numbers:not(.dots):not(.current)').should(
					'have.css',
					'background-color',
					'rgb(204, 204, 204)'
				);

				cy.get('.page-numbers.current').should(
					'have.css',
					'background-color',
					'rgb(255, 32, 32)'
				);

				cy.get('.page-numbers.dots').should(
					'have.css',
					'background-color',
					'rgb(255, 64, 64)'
				);
			}
		);
	});
});
