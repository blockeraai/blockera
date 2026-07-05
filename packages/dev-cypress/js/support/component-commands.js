/**
 * Minimal Cypress commands for component tests.
 * Keeps the support bundle small compared to the full E2E commands module.
 */
export const registerComponentCommands = () => {
	/**
	 * Starting in Cypress 13.3.0 Unhandled Exceptions now cause tests to fail.
	 * Sometimes unhandled exceptions occur in Core that do not affect the UX created by blockera.
	 * We discard unhandled exceptions and pass the test as long as assertions continue expectedly.
	 */
	Cypress.on('uncaught:exception', () => {
		// returning false here prevents Cypress from failing the test.
		return false;
	});

	Cypress.Commands.add('getByDataCy', (selector, ...args) => {
		return cy.get(`[data-cy="${selector}"]`, ...args);
	});

	Cypress.Commands.add('getByDataTest', (selector, ...args) => {
		return cy.get(`[data-test="${selector}"]`, ...args);
	});

	Cypress.Commands.add('getByAriaControls', (selector, ...args) => {
		return cy.get(`[aria-controls*="${selector}"]`, ...args);
	});

	Cypress.Commands.add('getByDataId', (selector, ...args) => {
		return cy.get(`[data-id="${selector}"]`, ...args);
	});

	Cypress.Commands.add('getByTestId', (selector, ...args) => {
		return cy.get(`[test-id="${selector}"]`, ...args);
	});

	Cypress.Commands.add('getByAriaLabel', (selector, ...args) => {
		const fallbackLabel = args[0];

		if (fallbackLabel) {
			delete args[0];

			return cy.get(
				`[aria-label="${selector}"], [aria-label="${fallbackLabel}"]`,
				...args
			);
		}

		const regexp = /\bSelect\b\s\w+/i;

		if (
			regexp.exec(selector) &&
			!Cypress.$(`[aria-label="${selector}"]`).length
		) {
			const parsedSelector = selector.split(' ');
			const parsedLabel = selector.split(':');

			if (parsedLabel?.length > 1) {
				return cy.get(
					`[aria-label="${parsedSelector[0].trim()} parent block: ${parsedSelector[1].trim()}"], [aria-label="${parsedLabel[1].trim()}"]`
				);
			}

			return cy.get(
				`[aria-label="${parsedSelector[0].trim()} parent block: ${parsedSelector[1].trim()}"]`
			);
		}

		return cy.get(`[aria-label="${selector}"]`, ...args);
	});

	// get parent container to have isolate aria for testing
	Cypress.Commands.add(
		'getParentContainer',
		(ariaLabel, parentsDataCy = 'base-control') => {
			// Backward compatible: some labels changed over time (e.g. Transitions → Transitions Timing)
			// Accept either a single string or an array of possible aria-label values.
			const labels = Array.isArray(ariaLabel) ? ariaLabel : [ariaLabel];
			const selector = labels
				.map((label) => `[aria-label="${label}"]`)
				.join(',');

			return cy
				.get(selector, { timeout: 20000 })
				.closest(`[data-cy=${parentsDataCy}]`);
		}
	);

	Cypress.Commands.add('multiClick', (selector, count, ...args) => {
		let counter = 0;
		while (counter !== count) {
			cy.get(selector, ...args).click({ force: true });
			counter += 1;
		}
	});
};
