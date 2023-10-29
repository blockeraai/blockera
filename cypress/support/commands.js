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
Cypress.Commands.add('clickOutside', () => {
	return cy.get('body').click(0, 0);
});
