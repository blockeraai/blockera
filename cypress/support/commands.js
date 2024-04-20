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
 * Sometimes unhandled exceptions occur in Core that do not affect the UX created by blockera-core.
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
	return cy.get(`[data-cy="${selector}"]`, ...args);
});

Cypress.Commands.add('getByDataTest', (selector, ...args) => {
	return cy.get(`[data-test="${selector}"]`, ...args);
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

		return cy.get(
			`[aria-label="${parsedSelector[0].trim()} parent block: ${parsedSelector[1].trim()}"]`
		);
	}

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
Cypress.Commands.add(
	'getParentContainer',
	(ariaLabel, parentsDataCy = 'base-control') => {
		return cy
			.get(`[aria-label="${ariaLabel}"]`)
			.closest(`[data-cy=${parentsDataCy}]`);
	}
);

// get block by name for testing
Cypress.Commands.add('getBlock', (blockName) => {
	if (Cypress.$('iframe[name="editor-canvas"]').length) {
		return cy.getIframeBody().find(`[data-type="${blockName}"]`).eq(0);
	} else {
		return cy.get(`[data-type="${blockName}"]`);
	}
});

// Click Value Addon Button to Open Popover
Cypress.Commands.add('clickValueAddonButton', () => {
	cy.getByDataCy('value-addon-btn').click({
		force: true,
	});
});

// Open Value Addon Popover
Cypress.Commands.add('openValueAddon', () => {
	cy.getByDataCy('value-addon-btn-open').click({
		force: true,
	});
});

// Remove Value Addon Popover
Cypress.Commands.add('removeValueAddon', () => {
	cy.getByDataCy('value-addon-btn-remove').click({
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

Cypress.Commands.add(
	'hasCssVar',
	{ prevSubject: true },
	(subject, styleName, cssVarName) => {
		cy.document().then((doc) => {
			const dummy = doc.createElement('span');
			dummy.style.setProperty(styleName, `var(${cssVarName})`);
			doc.body.appendChild(dummy);

			const evaluatedStyle = window
				.getComputedStyle(dummy)
				.getPropertyValue(styleName)
				.trim();
			dummy.remove();

			cy.wrap(subject)
				.then(($el) =>
					window
						.getComputedStyle($el[0])
						.getPropertyValue(styleName)
						.trim()
				)
				.should('eq', evaluatedStyle);
		});
	}
);

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

// Open More Settings Panel and Activate Item
Cypress.Commands.add('activateMoreSettingsItem', (settingsLabel, itemName) => {
	// open settings
	cy.get(`[aria-label="${settingsLabel}"]`).click();

	// activate item
	cy.get(`[aria-label="Activate ${itemName}"]`).click();

	cy.get('.components-popover.extension-settings')
		.last()
		.within(() => {
			// close popover
			cy.get('button[aria-label="Close"]').click();
		});
});

Cypress.Commands.add(
	'setInputFieldValue',
	(fieldLabel, groupLabel, value, force = false) => {
		// Alias
		cy.get('h2').contains(groupLabel).parent().parent().as('groupId');

		// Assertion for master block attributes.
		cy.get('@groupId').within(() => {
			cy.get(`[aria-label="${fieldLabel}"]`)
				.parent()
				.next()
				.within(() => {
					if (force) cy.get('input').type(`{selectall}${value}`);
					else {
						cy.get('input').type(value);
					}
				});
		});
	}
);

Cypress.Commands.add(
	'checkInputFieldValue',
	(fieldLabel, groupLabel, value) => {
		// Alias
		cy.get('h2').contains(groupLabel).parent().parent().as('groupId');

		// Assertion for master block attributes.
		cy.get('@groupId').within(() => {
			cy.get(`[aria-label="${fieldLabel}"]`)
				.parent()
				.next()
				.within(() => {
					cy.get('input').should('have.value', value);
				});
		});
	}
);

// select custom select item
Cypress.Commands.add('customSelect', (item) => {
	cy.get('button[aria-haspopup="listbox"]').click();

	cy.get('ul').within(() => {
		cy.contains(item).click();
	});
});

Cypress.Commands.add('openAccordion', (accordionHeading) =>
	cy.get('h2').contains(accordionHeading).parent().parent().click()
);

Cypress.Commands.add('addRepeaterItem', (ariaLabel, clickCount) => {
	cy.multiClick(`[aria-label="${ariaLabel}"]`, clickCount);
});

Cypress.Commands.add(
	'checkLabelClassName',
	(content, label, cssClass, type = 'have') => {
		cy.get('h2')
			.contains(content)
			.parent()
			.parent()
			.within(() => {
				if (type === 'not-have') {
					cy.get(`[aria-label="${label}"]`).should(
						'not.have.class',
						cssClass
					);
				} else
					cy.get(`[aria-label="${label}"]`).should(
						'have.class',
						cssClass
					);
			});
	}
);

Cypress.Commands.add('checkStateGraph', (content, label, updatedStates) => {
	const states = [
		'Normal',
		'Hover',
		'Active',
		'Focus',
		'Visited',
		'Before',
		'After',
		'Custom Class',
		'Parent Class',
		'Parent Hover',
	];

	cy.get('h2')
		.contains(content)
		.parent()
		.parent()
		.within(() => {
			cy.getByAriaLabel(label).click();
		});

	cy.getByDataTest('popover-body')
		.last()
		.within(() => {
			updatedStates.forEach((state) => {
				cy.contains(state).should('exist');
			});

			//
			states
				.filter((state) => !updatedStates.includes(state))
				.forEach((state) => {
					cy.contains(state).should('not.exist');
				});
		});
});

Cypress.Commands.add('setColorControlValue', (label, value) => {
	cy.getParentContainer(label)
		.last()
		.within(() => {
			cy.getByDataCy('color-btn').click();
		});
	cy.getByDataTest('popover-body').within(() => {
		cy.get('input[maxlength="9"]').clear();
		cy.get('input[maxlength="9"]').type(value);
	});
});
