import {
	appendBlocks,
	createPost,
	getBlockClientId,
	getWPDataObject,
	setBlockState,
	setInnerBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('Style Engine Testing ...', () => {
	beforeEach(() => {
		createPost();

		appendBlocks(
			'<!-- wp:paragraph -->\n' +
				'<p>Test <a href="#">Link</a></p>\n' +
				'<!-- /wp:paragraph -->'
		);

		// Select target block
		cy.getBlock('core/paragraph').click();
	});

	describe('Testing Normal State', () => {
		it('should generate css for root attributes of master and inners block', () => {
			// 1- Set width for master block.
			cy.setInputFieldValue('Width', 'Size', 100);

			// 2- Assert master block css.
			cy.getBlock('core/paragraph').should('have.css', 'width', '100px');

			// ********************* After Passed Master Block Assertions ************************ //

			// 3- Go to customize link inner block panel.
			setInnerBlock('Link');

			// 4- Set color for link inner block.
			cy.setColorControlValue('BG Color', '#000000');

			// 5- Assert link inner block css.
			cy.getBlock('core/paragraph').should(
				'have.css',
				'background-color',
				'rgba(0, 0, 0, 0)'
			);

			// ********************* After Passed Link Inner Block Assertions ************************ //

			// 6- Reassert master block css.
			cy.getBlock('core/paragraph').should('have.css', 'width', '100px');

			// 7- Switch to Master block.
			cy.getByAriaLabel('Selected Block').click();

			// 8- Reassert master block css.
			cy.getBlock('core/paragraph').should('have.css', 'width', '100px');
		});
	});
});
