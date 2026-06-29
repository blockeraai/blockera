/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	getWPDataObject,
	getSelectedBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('icon-control', () => {
	beforeEach(() => {
		createPost();
		appendBlocks(`<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">Test btn 1</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->`);

		cy.getBlock('core/button').click();

		cy.getByAriaControls('settings-view').click();
	});

	context('Functional', () => {
		it('should be able to add new icon from library', () => {
			cy.getByAriaLabel('Choose Icon…').first().click();

			cy.get('.blockera-control-icon-picker-modal').within(() => {
				cy.get('input[type="search"]').type('blockera');
				cy.getByAriaLabel('blockera Icon').should('be.visible').click();
			});

			getWPDataObject().then((data) => {
				const selectedIconName = getSelectedBlock(
					data,
					'blockeraIcon'
				).icon;
				expect(selectedIconName).to.be.equal('blockera');
			});
		});

		it('should be able to delete selected icon', () => {
			cy.getByAriaLabel('Choose Icon…').first().click();
			cy.selectIconByName('add-card');

			cy.getByAriaLabel('Remove Icon').click({
				force: true,
			});

			// data assertion
			getWPDataObject().then((data) => {
				const selectedIconName = getSelectedBlock(
					data,
					'blockeraIcon'
				).icon;
				expect(selectedIconName).to.be.equal('');
			});
		});
	});
});
