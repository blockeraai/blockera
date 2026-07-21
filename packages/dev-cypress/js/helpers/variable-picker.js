/**
 * Shared Cypress helpers for the block editor variable picker popover.
 */
import { createPost } from './site-navigation';
import { getSelectedBlock, getWPDataObject } from './editor';

/** Opens paragraph → Style → Font Size → variable picker popover. */
export function openParagraphFontSizeVariablePickerPopover() {
	createPost();

	cy.getBlock('default').type('Variable picker header add.', { delay: 0 });
	cy.getByAriaControls('styles-view').click();

	cy.getParentContainer('Font Size').within(() => {
		cy.openValueAddon();
	});

	return cy
		.getByDataTest('variable-picker-popover', { timeout: 20000 })
		.filter(':visible')
		.first()
		.should('be.visible');
}

/** Scoped chainable for the visible variable-picker popover content. */
export function withinVariablePickerPopover(fn) {
	return cy
		.getByDataTest('variable-picker-popover', { timeout: 20000 })
		.filter(':visible')
		.first()
		.should('be.visible')
		.within(fn);
}

/** Returns the visible variable picker popover body (scroll/content container). */
export function getVariablePickerPopoverBody() {
	return cy
		.getByDataTest('variable-picker-popover', { timeout: 20000 })
		.filter(':visible')
		.first()
		.closest('[data-test="popover-body"]')
		.should('be.visible');
}

/**
 * Constrains popover body height so long preset lists scroll inside the picker.
 *
 * @param {string} maxHeight CSS max-height value.
 */
export function makeVariablePickerPopoverBodyScrollable(maxHeight = '200px') {
	getVariablePickerPopoverBody()
		.invoke('css', 'max-height', maxHeight)
		.invoke('css', 'overflow-y', 'auto');
}

/** Scrolls the variable picker popover body to the top. */
export function scrollVariablePickerPopoverToTop() {
	getVariablePickerPopoverBody().scrollTo(0, 0, {
		duration: 0,
		ensureScrollable: false,
	});
}

/** Clicks the custom section “+” in a single-type variable picker (e.g. font-size). */
export function clickVariablePickerCustomSectionAddCustomVariable(
	variableType = 'font-size'
) {
	clickVariablePickerSectionAddCustomVariable(variableType);
}

/** Clicks a section “+” for a variable type in a multi-type picker. */
export function clickVariablePickerSectionAddCustomVariable(variableType) {
	cy.getByDataTest(`variable-picker-section-add-${variableType}`, {
		timeout: 20000,
	})
		.filter(':visible')
		.first()
		.scrollIntoView()
		.should('be.visible')
		.click({ force: true });

	cy.getByDataTest('repeater-item-creating-step', { timeout: 20000 }).should(
		'exist'
	);
}

/** Opens paragraph → Style → Min Width → variable picker popover. */
export function openMinWidthVariablePickerPopover() {
	createPost();

	cy.getBlock('default').type('Min width variable picker.', { delay: 0 });
	cy.getByAriaControls('styles-view').click();
	cy.activateMoreSettingsItem('More Size Settings', 'Min Width');

	cy.getParentContainer('Min Width').within(() => {
		cy.openValueAddon();
	});

	return cy
		.getByDataTest('variable-picker-popover', { timeout: 20000 })
		.filter(':visible')
		.first()
		.should('be.visible');
}

/** Clicks the header “+” that adds a custom preset (single-type pickers only). */
export function clickVariablePickerHeaderAddCustomVariable() {
	cy.getByDataTest('variable-picker-header-add-custom-variable', {
		timeout: 20000,
	}).scrollIntoView();
	cy.getByDataTest('variable-picker-header-add-custom-variable')
		.should('be.visible')
		.click({ force: true });

	cy.getByDataTest('repeater-item-creating-step', { timeout: 20000 }).should(
		'exist'
	);
}

/** Returns the last repeater row inside the visible variable picker popover. */
export function getVariablePickerLastRepeaterItem() {
	return cy
		.getByDataTest('variable-picker-popover', { timeout: 20000 })
		.filter(':visible')
		.first()
		.find('[data-cy="repeater-item"]')
		.last();
}

/**
 * Asserts an element (by data-test) intersects the visible variable picker body.
 *
 * @param {string} dataTest
 */
export function assertDataTestInVariablePickerPopoverBody(dataTest) {
	getVariablePickerPopoverBody().then(($body) => {
		const bodyRect = $body[0].getBoundingClientRect();

		cy.getByDataTest(dataTest, { timeout: 20000 }).then(($el) => {
			const rect = $el[0].getBoundingClientRect();

			expect(rect.top, `${dataTest} top`).to.be.at.least(bodyRect.top);
			expect(rect.bottom, `${dataTest} bottom`).to.be.at.most(
				bodyRect.bottom
			);
		});
	});
}

/** Asserts the last repeater row in the picker intersects the popover body. */
export function assertLastVariablePickerRepeaterItemInPopoverBody() {
	getVariablePickerPopoverBody().then(($body) => {
		const bodyRect = $body[0].getBoundingClientRect();

		getVariablePickerLastRepeaterItem().then(($el) => {
			const rect = $el[0].getBoundingClientRect();

			expect(rect.top, 'last repeater item top').to.be.lessThan(
				bodyRect.bottom
			);
			expect(rect.bottom, 'last repeater item bottom').to.be.greaterThan(
				bodyRect.top
			);
		});
	});
}

/**
 * Visible preset edit popover (nested group popover inside the variable picker).
 */
export function getCustomPresetEditPopover() {
	return cy
		.get('.blockera-component-popover.blockera-control-group-popover', {
			timeout: 20000,
		})
		.filter(':visible')
		.last()
		.should('be.visible');
}

/**
 * Asserts a control field value in the visible custom-preset edit popover
 * opened after header "+" add (creatingStep).
 *
 * @param {string} parentLabel Parent container label (e.g. `Font Size`, `Spacing Size`).
 * @param {string} expectedValue Expected input value.
 */
export function assertCustomPresetEditPopoverFieldValue(
	parentLabel,
	expectedValue
) {
	cy.getByDataTest('repeater-item-creating-step', { timeout: 20000 }).should(
		'exist'
	);

	getCustomPresetEditPopover().within(() => {
		cy.getParentContainer(parentLabel).within(() => {
			cy.get('input[type="text"]').should('have.value', expectedValue);
		});
	});
}

/**
 * Asserts color CSS value in the custom-preset edit popover (after header add).
 *
 * @param {string} expectedHex Expected hex without `#` (e.g. `70ca9e`).
 */
export function assertCustomPresetEditPopoverColorValue(expectedHex) {
	cy.getByDataTest('repeater-item-creating-step', { timeout: 20000 }).should(
		'exist'
	);

	cy.getByDataTest('repeater-item-creating-step').within(() => {
		cy.get('[data-cy="header-values"]').should(
			'contain.text',
			expectedHex.toLowerCase()
		);
	});

	getCustomPresetEditPopover();
}

/**
 * Visible preset edit popover opened for the current creatingStep row.
 */
export function getCreatingStepPresetEditPopover() {
	cy.getByDataTest('repeater-item-creating-step', { timeout: 20000 }).should(
		'exist'
	);

	return getCustomPresetEditPopover();
}

/**
 * Types into the preset ID field while creatingStep is active.
 *
 * @param {string} value
 */
export function typeCreatingStepPresetId(value) {
	getCreatingStepPresetEditPopover().within(() => {
		cy.getParentContainer('Name')
			.find('.blockera-preset-id-field input', { timeout: 20000 })
			.first()
			.then(($input) => {
				cy.wrap($input).setControlledInputValue(value);
			});
	});
}

/**
 * @param {string} expectedId
 */
export function assertCreatingStepPresetId(expectedId) {
	cy.getByDataTest('global-styles-preset-id-field', { timeout: 20000 })
		.filter('input')
		.filter(':visible')
		.last()
		.should('have.value', expectedId);
}

/** Closes the visible preset edit popover (e.g. finish creatingStep). */
export function closeCustomPresetEditPopover() {
	getCustomPresetEditPopover().within(() => {
		cy.getByDataTest('close-popover').click({ force: true });
	});
}

/** Closes the creatingStep preset edit popover while keeping the variable picker open. */
export function closeCreatingStepPresetEditPopover() {
	cy.getByDataTest('repeater-item-creating-step', { timeout: 20000 }).should(
		'exist'
	);

	closeCustomPresetEditPopover();

	cy.getByDataTest('repeater-item-creating-step', { timeout: 20000 }).should(
		'not.exist'
	);

	cy.getByDataTest('variable-picker-popover', { timeout: 20000 })
		.filter(':visible')
		.first()
		.should('be.visible');
}

/** Opens the edit popover for the last repeater row in the picker. */
export function openLastVariablePickerPresetEditPopover() {
	withinVariablePickerPopover(() => {
		getVariablePickerLastRepeaterItem()
			.realHover()
			.within(() => {
				cy.get('.blockera-control-btn-edit-item').click({
					force: true,
				});
			});
	});

	getCustomPresetEditPopover().should('be.visible');
}

/** Opens the edit popover for the selected variable row in the picker. */
export function openSelectedVariablePickerPresetEditPopover() {
	withinVariablePickerPopover(() => {
		cy.get('[data-cy="repeater-item"]')
			.filter(':has(.is-selected-item)')
			.first()
			.realHover()
			.within(() => {
				cy.get('.blockera-control-btn-edit-item').click({
					force: true,
				});
			});
	});

	getCustomPresetEditPopover().should('be.visible');
}

/** Unlocks the ID field in a saved preset edit popover (click-to-edit). */
export function unlockPresetEditPopoverIdField() {
	getCustomPresetEditPopover().within(() => {
		cy.getParentContainer('Name')
			.find('.blockera-preset-id-field input', { timeout: 20000 })
			.first()
			.click({ force: true });
	});
}

/**
 * Sets the preset ID in an unlocked edit popover (post-create slug change flow).
 *
 * @param {string} value
 */
export function typePresetEditPopoverId(value) {
	getCustomPresetEditPopover().within(() => {
		cy.getParentContainer('Name')
			.find('.blockera-preset-id-field input', { timeout: 20000 })
			.first()
			.then(($input) => {
				cy.wrap($input).setControlledInputValue(value);
			});
	});
}

/** Confirms the slug-change warning before saving a renamed preset ID. */
export function confirmPresetEditPopoverSlugChange() {
	getCustomPresetEditPopover().within(() => {
		cy.contains(
			'I understand that blocks using the old ID will lose their variables.'
		).click({ force: true });
	});
}

/** Saves name/slug edits from the preset edit popover. */
export function savePresetEditPopoverNameAndSlug() {
	getCustomPresetEditPopover().within(() => {
		cy.get('.blockera-preset-save-actions__save')
			.should('not.be.disabled')
			.click({ force: true });
	});
}

/** Font Size value addon must not show the missing-variable deleted state. */
export function assertFontSizeControlVariableNotMissing() {
	cy.getParentContainer('Font Size')
		.first()
		.within(() => {
			cy.get('[data-test="value-addon-deleted"]').should('not.exist');
			cy.contains('Missing variable').should('not.exist');
		});
}

/**
 * @param {string} expectedId Bound variable `settings.id`.
 */
export function assertSelectedBlockFontSizeVariableId(expectedId) {
	cy.then({ timeout: 15000 }, () =>
		getWPDataObject().then((data) => {
			const fontSize = getSelectedBlock(data, 'blockeraFontSize');
			expect(fontSize.isValueAddon).to.equal(true);
			expect(fontSize.valueType).to.equal('variable');
			expect(fontSize.settings?.id).to.equal(expectedId);
		})
	);
}

/**
 * Deletes a preset row from the open variable picker (custom/theme repeater section).
 *
 * @param {string} slug Preset slug (`data-variable-slug`).
 */
export function deleteVariableFromVariablePicker(slug) {
	withinVariablePickerPopover(() => {
		cy.get(`[data-variable-slug="${slug}"]`, { timeout: 20000 })
			.filter(':visible')
			.first()
			.as('variablePickerRow');

		cy.get('@variablePickerRow')
			.closest('[data-cy="repeater-item"]')
			.realHover();

		cy.get('@variablePickerRow')
			.closest('[data-cy="repeater-item"]')
			.within(() => {
				cy.get('button[aria-label^="Delete"]')
					.first()
					.click({ force: true });
			});
	});

	cy.get('.blockera-component-delete-modal', { timeout: 20000 })
		.filter(':visible')
		.last()
		.should('be.visible')
		.within(() => {
			cy.get('input[type="checkbox"]').check({ force: true });
			cy.getByDataTest('confirm-delete-modal-delete-button').click({
				force: true,
			});
		});
}
