/**
 * Blockera dependencies
 */
import {
	createPost,
	getSelectedBlock,
	getWPDataObject,
} from '@blockera/dev-cypress/js/helpers';
import {
	assertCustomPresetEditPopoverFieldValue,
	clickVariablePickerHeaderAddCustomVariable,
	assertLastVariablePickerRepeaterItemInPopoverBody,
	getVariablePickerLastRepeaterItem,
	getVariablePickerPopoverBody,
	makeVariablePickerPopoverBodyScrollable,
	openParagraphFontSizeVariablePickerPopover,
	scrollVariablePickerPopoverToTop,
	withinVariablePickerPopover,
} from '@blockera/dev-cypress/js/helpers/variable-picker';

describe('Font Size variable picker → header add custom preset', () => {
	it('shows the section add button for a single-type picker', () => {
		openParagraphFontSizeVariablePickerPopover();

		withinVariablePickerPopover(() => {
			cy.getByDataTest('variable-picker-section-add-font-size')
				.scrollIntoView()
				.should('be.visible');
		});
	});

	it('adds a custom preset via the section button and opens the edit popover', () => {
		createPost();

		cy.getBlock('default').type('Variable picker section add.', {
			delay: 0,
		});
		cy.getByAriaControls('styles-view').click();

		cy.getParentContainer('Font Size').within(() => {
			cy.openValueAddon();
		});

		cy.getByDataTest('variable-picker-popover')
			.filter(':visible')
			.first()
			.should('be.visible')
			.find('[data-cy="repeater-item"]')
			.its('length')
			.then((beforeCount) => {
				cy.getByDataTest('variable-picker-section-add-font-size', {
					timeout: 20000,
				})
					.filter(':visible')
					.first()
					.scrollIntoView()
					.should('be.visible')
					.click({ force: true });

				cy.getByDataTest('variable-picker-popover')
					.find('[data-cy="repeater-item"]')
					.should('have.length', beforeCount + 1);
			});

		cy.getByDataTest('repeater-item-creating-step', {
			timeout: 20000,
		}).should('exist');

		assertCustomPresetEditPopoverFieldValue('Font Size', '16');
	});

	it('shows the header add button while search is active with no matches', () => {
		openParagraphFontSizeVariablePickerPopover();

		cy.get('.blockera-control-var-picker-search input[type="search"]', {
			timeout: 20000,
		})
			.should('be.visible')
			.clear({ force: true })
			.type('no-match-xyz', { delay: 0, force: true });

		cy.getByDataTest('var-picker-search-empty').should('be.visible');

		cy.getByDataTest('variable-picker-header-add-custom-variable').should(
			'be.visible'
		);

		cy.getByDataTest(
			'variable-picker-search-empty-add-custom-variable'
		).should('be.visible');
	});

	it('adds a custom preset from the empty-state add button during search', () => {
		const searchSeed = 'E2E New Size';

		openParagraphFontSizeVariablePickerPopover();

		cy.getByDataTest('variable-picker-popover')
			.filter(':visible')
			.first()
			.should('be.visible')
			.find('[data-cy="repeater-item"]')
			.its('length')
			.then((beforeCount) => {
				cy.get(
					'.blockera-control-var-picker-search input[type="search"]',
					{
						timeout: 20000,
					}
				)
					.should('be.visible')
					.clear({ force: true })
					.type(searchSeed, { delay: 0, force: true });

				cy.getByDataTest(
					'variable-picker-search-empty-add-custom-variable',
					{ timeout: 20000 }
				)
					.should('be.visible')
					.click({ force: true });

				cy.get(
					'.blockera-control-var-picker-search input[type="search"]'
				).should('have.value', '');

				cy.getByDataTest('var-picker-search-empty').should('not.exist');

				cy.getByDataTest('variable-picker-popover')
					.find('[data-cy="repeater-item"]')
					.should('have.length', beforeCount + 1);
			});

		cy.getByDataTest('repeater-item-creating-step', {
			timeout: 20000,
		}).should('exist');

		cy.getByDataCy('font-size-repeater-item-header', { timeout: 20000 })
			.contains(searchSeed)
			.should('be.visible');

		cy.get('.blockera-component-popover.blockera-control-group-popover', {
			timeout: 20000,
		})
			.filter(':visible')
			.last()
			.should('be.visible')
			.within(() => {
				cy.getByDataTest('global-styles-preset-name-field')
					.filter('input')
					.first()
					.should('have.value', searchSeed);
			});
	});

	it('clears search and creates a preset from the header add button', () => {
		openParagraphFontSizeVariablePickerPopover();

		cy.get('.blockera-control-var-picker-search input[type="search"]', {
			timeout: 20000,
		})
			.should('be.visible')
			.clear({ force: true })
			.type('no-match-xyz', { delay: 0, force: true });

		clickVariablePickerHeaderAddCustomVariable();

		cy.get(
			'.blockera-control-var-picker-search input[type="search"]'
		).should('have.value', '');

		cy.getByDataTest('var-picker-search-empty').should('not.exist');

		cy.getByDataTest('repeater-item-creating-step', {
			timeout: 20000,
		}).should('exist');

		getVariablePickerLastRepeaterItem().should('be.visible');
	});

	it('shows the header add button for a single-type picker', () => {
		openParagraphFontSizeVariablePickerPopover();

		cy.getByDataTest('variable-picker-header-add-custom-variable').should(
			'be.visible'
		);
	});

	it('adds a custom preset via the header button and opens the edit popover', () => {
		createPost();

		cy.getBlock('default').type('Variable picker header add.', {
			delay: 0,
		});
		cy.getByAriaControls('styles-view').click();

		cy.getParentContainer('Font Size').within(() => {
			cy.get('input[type="text"]').clear();
			cy.get('input[type="text"]').type('24', { force: true });
		});

		cy.getParentContainer('Font Size').within(() => {
			cy.openValueAddon();
		});

		cy.getByDataTest('variable-picker-popover')
			.filter(':visible')
			.first()
			.should('be.visible')
			.find('[data-cy="repeater-item"]')
			.its('length')
			.then((beforeCount) => {
				clickVariablePickerHeaderAddCustomVariable();

				cy.getByDataTest('variable-picker-popover')
					.find('[data-cy="repeater-item"]')
					.should('have.length', beforeCount + 1);
			});

		cy.getByDataTest('repeater-item-creating-step', {
			timeout: 20000,
		}).should('exist');

		assertCustomPresetEditPopoverFieldValue('Font Size', '24');

		// Picker stays open while editing the new preset.
		cy.getByDataTest('variable-picker-popover')
			.filter(':visible')
			.first()
			.should('be.visible');

		// New custom preset is applied to the control immediately.
		cy.then({ timeout: 15000 }, () =>
			getWPDataObject().then((data) => {
				const fontSize = getSelectedBlock(data, 'blockeraFontSize');
				expect(fontSize.isValueAddon).to.equal(true);
				expect(fontSize.valueType).to.equal('variable');
				expect(fontSize.settings?.value).to.equal('24px');
				expect(fontSize.settings?.reference?.type).to.equal('custom');
			})
		);
	});

	it('uses the static default when the control has no value', () => {
		openParagraphFontSizeVariablePickerPopover();

		clickVariablePickerHeaderAddCustomVariable();

		assertCustomPresetEditPopoverFieldValue('Font Size', '16');
	});

	it('scrolls the new custom preset row into view when the popover is scrolled to the top', () => {
		openParagraphFontSizeVariablePickerPopover();

		makeVariablePickerPopoverBodyScrollable();
		scrollVariablePickerPopoverToTop();

		clickVariablePickerHeaderAddCustomVariable();

		getVariablePickerLastRepeaterItem().should('be.visible');

		assertLastVariablePickerRepeaterItemInPopoverBody();

		cy.get('.blockera-component-popover.blockera-control-group-popover', {
			timeout: 20000,
		})
			.filter(':visible')
			.last()
			.should('be.visible')
			.within(() => {
				cy.getByDataTest('global-styles-preset-name-field')
					.filter(':visible')
					.first()
					.should('be.visible');
			});
	});
});
