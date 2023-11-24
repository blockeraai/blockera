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
