/**
 * Internal dependencies
 */
import { hexStringToByte } from '../helpers';

// Custom uploadFile command
Cypress.Commands.add('uploadFile', (fileName, fileType, selector) => {
	cy.get(selector).then((subject) => {
		cy.fixture(fileName, 'hex').then((fileHex) => {
			const fileBytes = hexStringToByte(fileHex);
			const testFile = new File([fileBytes], fileName, {
				type: fileType,
			});
			const dataTransfer = new DataTransfer();
			const el = subject[0];

			dataTransfer.items.add(testFile);
			el.files = dataTransfer.files;
		});
	});
});

/**
 * Starting in Cypress 13.3.0 Unhandled Exceptions now cause tests to fail.
 * Sometimes unhandled exceptions occur in Core that do not affect the UX created by publisher-core.
 * We discard unhandled exceptions and pass the test as long as assertions continue expectedly.
 */
Cypress.on('uncaught:exception', () => {
	// returning false here prevents Cypress from failing the test.
	return false;
});

/**
 * useful custom commands for selecting elements for testing
 */
Cypress.Commands.add('getByDataCy', (selector, ...args) => {
	return cy.get(`[data-cy=${selector}]`, ...args);
});

Cypress.Commands.add('getByDataTest', (selector, ...args) => {
	return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add('getByAriaLabel', (selector, ...args) => {
	return cy.get(`[aria-label="${selector}"]`, ...args);
});

Cypress.Commands.add('cssVar', (cssVarName, selector) => {
	if (selector) {
		return cy.document().then((doc) => {
			return window
				.getComputedStyle(doc.body.querySelector(selector))
				.getPropertyValue(cssVarName)
				.trim();
		});
	}

	return cy.document().then((doc) => {
		return window
			.getComputedStyle(doc.body)
			.getPropertyValue(cssVarName)
			.trim();
	});
});

// get parent container to have isolate aria for testing
Cypress.Commands.add('getParentContainer', (ariaLabel, parentsDataCy) => {
	return cy
		.get(`[aria-label="${ariaLabel}"]`)
		.closest(`[data-cy=${parentsDataCy}]`);
});

// get block by name for testing
Cypress.Commands.add('getBlock', (blockName) => {
	return cy.get(`[data-type="${blockName}"]`);
});

// Open Value Addon Popover
Cypress.Commands.add('openValueAddon', () => {
	cy.getByDataCy('value-addon-btn-open').click({
		force: true,
	});
});

// Select Value Addon Popover
Cypress.Commands.add('selectValueAddonItem', (itemID) => {
	cy.getByDataCy('va-item-' + itemID).click({
		force: true,
	});
});

// for testing
Cypress.Commands.add('test gite', (selector, ...args) => {
	return cy.get(`[data-test=${selector}]`, ...args);
});
Cypress.Commands.add('multiClick', (selector, count, ...args) => {
	let counter = 0;
	while (counter !== count) {
		cy.get(selector, ...args).click();
		counter += 1;
	}
});

Cypress.Commands.add('clickOutside', () => {
	return cy.get('body').click(0, 0);
});

Cypress.Commands.add(
	'setSliderValue',
	{ prevSubject: 'element' },
	(subject, value) => {
		const element = subject[0];

		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
			window.HTMLInputElement.prototype,
			'value'
		)?.set;

		nativeInputValueSetter?.call(element, value);
		element.dispatchEvent(new Event('input', { bubbles: true }));
	}
);

// simulate paste event
Cypress.Commands.add(
	'pasteText',
	{ prevSubject: 'element' },
	(subject, text) => {
		// eslint-disable-next-line cypress/unsafe-to-chain-command
		cy.wrap(subject)
			.type(text, { parseSpecialCharSequences: false })
			.trigger('paste', { force: true });
	}
);
