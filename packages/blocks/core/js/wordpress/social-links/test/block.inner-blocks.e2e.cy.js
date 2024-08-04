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

describe('Social Links Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks(`<!-- wp:social-links {"showLabels":true,"size":"has-normal-icon-size","className":"is-style-default","layout":{"type":"flex","justifyContent":"left","flexWrap":"nowrap"}} -->
<ul class="wp-block-social-links has-normal-icon-size has-visible-labels is-style-default"><!-- wp:social-link {"url":"#test","service":"wordpress"} /-->

<!-- wp:social-link {"url":"#test","service":"dribbble"} /-->

<!-- wp:social-link {"url":"#test","service":"behance"} /--></ul>
<!-- /wp:social-links -->`);

		// Select target block
		cy.getBlock('core/social-link').first().click();

		// Switch to parent block
		cy.getByAriaLabel('Select parent block: Social Icons').click();

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. elements/item-containers
		//
		setInnerBlock('elements/item-containers');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/social-links')
			.first()
			.within(() => {
				cy.get('.wp-block-social-link')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.2. elements/item-icons
		//
		setParentBlock();
		setInnerBlock('elements/item-icons');

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff2020');

		cy.getBlock('core/social-links')
			.first()
			.within(() => {
				cy.get('.wp-block-social-link svg')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 32, 32)');
			});

		//
		// 1.3. elements/item-icons
		//
		setParentBlock();
		setInnerBlock('elements/item-names');

		//
		// 1.3.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff2020');

		cy.getBlock('core/social-links')
			.first()
			.within(() => {
				cy.get('.wp-block-social-link .wp-block-social-link-label')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 32, 32)');
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		// elements/item-containers
		cy.get('.wp-block-social-link')
			.first()
			.should('have.css', 'background-color', 'rgb(255, 0, 0)');

		// elements/item-icons
		cy.get('.wp-block-social-link svg')
			.first()
			.should('have.css', 'background-color', 'rgb(255, 32, 32)');

		// elements/item-names
		cy.get('.wp-block-social-link .wp-block-social-link-label')
			.first()
			.should('have.css', 'background-color', 'rgb(255, 32, 32)');
	});
});
