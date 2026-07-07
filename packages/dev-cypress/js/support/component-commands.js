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

	/**
	 * Sets a React-controlled `<input type="text">` value in one shot.
	 *
	 * Use when `cy.type()` is unsafe: e.g. parent `onChange` runs every keystroke and remounts
	 * the node or commits invalid partial state (hex colors, mesh gradients, etc.).
	 * Dispatches `input` then `change` so typical React handlers run once with the final string.
	 */
	Cypress.Commands.add(
		'setControlledInputValue',
		{ prevSubject: 'element' },
		(subject, value) => {
			const el = subject[0];
			const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
				window.HTMLInputElement.prototype,
				'value'
			)?.set;

			if (nativeInputValueSetter) {
				nativeInputValueSetter.call(el, value);
			} else {
				el.value = value;
			}
			el.dispatchEvent(new Event('input', { bubbles: true }));
			el.dispatchEvent(new Event('change', { bubbles: true }));
			return cy.wrap(subject);
		}
	);

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

	Cypress.Commands.add(
		'dragValue',
		{ prevSubject: 'element' },
		(
			subject,
			type = 'vertical',
			movement = 10,
			threshold = 5,
			withShift = false
		) => {
			// Initial mousedown
			cy.wrap(subject[0]).trigger('mousedown', 'topLeft', {
				which: 1,
				force: true,
			});

			// First mousemove to exceed threshold
			if (type === 'vertical') {
				cy.get('body').trigger('mousemove', {
					which: 1,
					clientY:
						Math.ceil(subject[0].getBoundingClientRect().top) +
						threshold, // Exceed threshold
				});

				// Second mousemove for actual movement
				cy.get('.blockera-virtual-cursor-box').trigger('mousemove', {
					which: 1,
					clientY:
						Math.ceil(subject[0].getBoundingClientRect().top) +
						(withShift
							? (movement - threshold + 1) * 5
							: movement) *
							-1,
					shiftKey: withShift,
				});
			} else if (type === 'horizontal') {
				cy.get('body').trigger('mousemove', {
					which: 1,
					clientX:
						Math.ceil(subject[0].getBoundingClientRect().left) +
						threshold,
				});

				// Second mousemove for actual movement
				cy.get('.blockera-virtual-cursor-box').trigger('mousemove', {
					which: 1,
					clientX:
						Math.ceil(subject[0].getBoundingClientRect().left) +
						(withShift ? (movement - threshold + 1) * 5 : movement),
					shiftKey: withShift,
				});
			}

			// Final mouseup
			cy.get('.blockera-virtual-cursor-box').trigger('mouseup', {
				which: 1,
			});

			return cy.wrap(subject);
		}
	);
};
