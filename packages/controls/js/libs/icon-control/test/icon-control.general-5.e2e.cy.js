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

		it('should clear selected custom icon when Clear is clicked in custom tab', () => {
			const customSvg =
				'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/></svg>';

			cy.window().then((win) => {
				const clientId = win.wp.data
					.select('core/block-editor')
					.getSelectedBlock().clientId;

				win.wp.data
					.dispatch('core/block-editor')
					.updateBlockAttributes(clientId, {
						blockeraIcon: {
							value: {
								icon: '',
								library: '',
								svgString: customSvg,
								uploadSVG: '',
								renderedIcon: '',
							},
						},
					});
			});

			getWPDataObject().then((data) => {
				const blockeraIcon = getSelectedBlock(data, 'blockeraIcon');
				expect(blockeraIcon.svgString).to.contain('<circle');
			});

			cy.get('.blockera-control-icon-preview').first().click();

			cy.get('.blockera-control-icon-picker-modal').within(() => {
				cy.contains('button', 'Clear').click();
			});

			getWPDataObject().then((data) => {
				const blockeraIcon = getSelectedBlock(data, 'blockeraIcon');
				expect(blockeraIcon.icon).to.equal('');
				expect(blockeraIcon.svgString).to.equal('');
				expect(blockeraIcon.uploadSVG).to.equal('');
			});
		});
	});
});
