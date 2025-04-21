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
import { experimental } from '@blockera/env';

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Query Total Block', () => {
	beforeEach(() => {
		createPost();
	});

	const enabledOptimizeStyleGeneration = experimental().get(
		'earlyAccessLab.optimizeStyleGeneration'
	);

	it('Functionality + inner blocks', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/query-total').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// Has inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//

		cy.getBlock('core/query-total').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.setColorControlValue('Text Color', '666666');

		cy.getBlock('core/query-total')
			.should('have.css', 'background-clip', 'padding-box')
			.and('have.css', 'color', 'rgb(102, 102, 102)');

		//
		// 2. Assert inner blocks selectors in front end
		//

		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-query-total')
			.should('have.css', 'background-clip', 'padding-box')
			.and('have.css', 'color', 'rgb(102, 102, 102)');

		// Check if optimize style generation is enabled
		// then style attribute should not be present
		// this is a workaround to check if the feature is enabled and working
		if (enabledOptimizeStyleGeneration) {
			cy.get('.blockera-block.wp-block-query-total').should(
				'not.have.attr',
				'style'
			);
		}
	});
});
