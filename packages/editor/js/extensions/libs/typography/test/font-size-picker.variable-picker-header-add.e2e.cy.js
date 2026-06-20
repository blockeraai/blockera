/**
 * Blockera dependencies
 */
import { createPost } from '@blockera/dev-cypress/js/helpers';
import {
	assertLastVariablePickerRepeaterItemInPopoverBody,
	clickVariablePickerHeaderAddCustomVariable,
	getVariablePickerLastRepeaterItem,
	makeVariablePickerPopoverBodyScrollable,
	openParagraphFontSizeVariablePickerPopover,
	scrollVariablePickerPopoverToTop,
	withinVariablePickerPopover,
} from '@blockera/dev-cypress/js/helpers/variable-picker';

describe('Font Size variable picker → header add custom preset', () => {
	it('shows the header add button for a single-type picker', () => {
		openParagraphFontSizeVariablePickerPopover();

		cy.getByDataTest('variable-picker-header-add-custom-variable').should(
			'be.visible'
		);
	});

	it('adds a custom preset via the header button and opens the edit popover', () => {
		openParagraphFontSizeVariablePickerPopover();

		cy.getByDataTest('variable-picker-popover')
			.find('[data-cy="repeater-item"]')
			.its('length')
			.then((beforeCount) => {
				clickVariablePickerHeaderAddCustomVariable();

				cy.getByDataTest('variable-picker-popover')
					.find('[data-cy="repeater-item"]')
					.should('have.length', beforeCount + 1);
			});

		getVariablePickerLastRepeaterItem().should('be.visible');

		cy.getByDataTest('global-styles-preset-name-field')
			.filter(':visible')
			.first()
			.should('be.visible');
	});

	it('scrolls the new custom preset row into view when the popover is scrolled to the top', () => {
		openParagraphFontSizeVariablePickerPopover();

		makeVariablePickerPopoverBodyScrollable();
		scrollVariablePickerPopoverToTop();

		clickVariablePickerHeaderAddCustomVariable();

		getVariablePickerLastRepeaterItem().should('be.visible');

		assertLastVariablePickerRepeaterItemInPopoverBody();

		cy.getByDataTest('global-styles-preset-name-field')
			.filter(':visible')
			.first()
			.should('be.visible');
	});

	it('hides the header add button when the picker supports multiple variable types', () => {
		createPost();

		cy.getBlock('default').type('Multi-type variable picker.', {
			delay: 0,
		});
		cy.getByAriaControls('styles-view').click();
		cy.activateMoreSettingsItem('More Size Settings', 'Min Width');

		cy.getParentContainer('Min Width').within(() => {
			cy.openValueAddon();
		});

		withinVariablePickerPopover(() => {
			cy.getByDataTest(
				'variable-picker-header-add-custom-variable'
			).should('not.exist');
		});
	});
});
