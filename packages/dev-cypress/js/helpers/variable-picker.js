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

/** Clicks the header “+” that adds a custom preset (single-type pickers only). */
export function clickVariablePickerHeaderAddCustomVariable() {
	cy.getByDataTest('variable-picker-header-add-custom-variable', {
		timeout: 20000,
	})
		.filter(':visible')
		.first()
		.should('be.visible')
		.click({ force: true });
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
