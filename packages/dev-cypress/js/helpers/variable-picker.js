/**
 * Shared Cypress helpers for the block editor variable picker popover.
 */
import { createPost } from './site-navigation';

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

	cy.get('.blockera-component-popover.blockera-control-group-popover', {
		timeout: 20000,
	})
		.filter(':visible')
		.last()
		.should('be.visible')
		.within(() => {
			cy.getParentContainer(parentLabel).within(() => {
				cy.get('input[type="text"]').should(
					'have.value',
					expectedValue
				);
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

	cy.get('.blockera-component-popover.blockera-control-group-popover', {
		timeout: 20000,
	})
		.filter(':visible')
		.last()
		.should('be.visible');
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
