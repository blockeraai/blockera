/**
 * Blockera dependencies
 */
import { isString } from '@blockera/utils';
/**
 * Internal dependencies
 */
import {
	hexStringToByte,
	openBoxSpacingSide,
	openBoxPositionSide,
} from '../helpers';

export const registerCommands = () => {
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
	 * Sometimes unhandled exceptions occur in Core that do not affect the UX created by blockera.
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
				.get(`[aria-label="${ariaLabel}"]`, { timeout: 20000 })
				.closest(`[data-cy=${parentsDataCy}]`);
		}
	);

	// get block by name for testing
	Cypress.Commands.add('getBlock', (blockName) => {
		// by passing default it clicks on editor that creates a paragraph block
		if (blockName === 'default') {
			cy.getIframeBody().find(`[aria-label="Add default block"]`).click();
			blockName = 'core/paragraph';
			return cy.getIframeBody().find(`[data-type="${blockName}"]`).eq(0);
		}

		if (Cypress.$('iframe[name="editor-canvas"]').length) {
			return cy.getIframeBody().find(`[data-type="${blockName}"]`);
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
	Cypress.Commands.add(
		'activateMoreSettingsItem',
		(settingsLabel, itemName) => {
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
		}
	);

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
		(content, label, cssClass, condition = 'have') => {
			if (isString(cssClass)) {
				cssClass = [cssClass];
			}

			cy.get('h2')
				.contains(content)
				.parent()
				.parent()
				.within(() => {
					cssClass.forEach((classItem) => {
						cy.get(`[aria-label="${label}"]`).should(
							condition === 'have'
								? 'have.class'
								: 'not.have.class',
							classItem
						);
					});
				});
		}
	);

	Cypress.Commands.add(
		'checkStateGraph',
		(content, label, changes, repeaterItem = false) => {
			// Open label state graph
			if (repeaterItem) {
				// for repeater inner labels
				cy.getByDataTest('popover-body').within(() => {
					cy.getByAriaLabel(label).click();
				});
			} else
				cy.get('h2')
					.contains(content)
					.parent()
					.parent()
					.within(() => {
						cy.getByAriaLabel(label).click();
					});

			cy.checkStateGraphPopover(changes);
		}
	);

	Cypress.Commands.add(
		'checkBoxSpacingStateGraph',
		(type = 'margin', side = 'top', changes) => {
			openBoxSpacingSide(side ? `${type}-${side}` : type);

			// if there is no side it means there is no second popover
			if (side) {
				// open state graph
				cy.get('[data-wp-component="Popover"]')
					.last()
					.within(() => {
						cy.get('[data-cy="label-control"]').first().click();
					});
			}

			cy.checkStateGraphPopover(changes);

			// if there is no side it means there is no second popover
			if (side) {
				// close state graph
				cy.get('[data-wp-component="Popover"]')
					.last()
					.within(() => {
						cy.getByAriaLabel('Close').click();
					});
			}
		}
	);

	Cypress.Commands.add(
		'checkBoxPositionStateGraph',
		(side = 'top', changes) => {
			openBoxPositionSide(side);

			// open state graph
			// not for control and box
			if (!['control', 'box'].includes(side)) {
				cy.get('[data-wp-component="Popover"]')
					.last()
					.within(() => {
						cy.get('[data-cy="label-control"]').first().click();
					});
			}

			cy.checkStateGraphPopover(changes);
		}
	);

	Cypress.Commands.add('checkStateGraphPopover', (changes) => {
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
		const devices = [
			'laptop',
			'extra-large',
			'large',
			'desktop',
			'tablet',
			'mobile-landscape',
			'mobile',
		];

		cy.getByDataTest('popover-body')
			.last()
			.within(() => {
				Object.entries(changes).map(([device, updatedStates]) => {
					cy.getByDataTest(`state-graph-${device}`).within(() => {
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

				devices
					.filter(
						(_device) => !Object.keys(changes).includes(_device)
					)
					.forEach((_device) => {
						cy.getByDataTest(`state-graph-${_device}`).should(
							'not.exist'
						);
					});
			});

		// Close state graph
		cy.getByDataTest('popover-header')
			.last()
			.within(() => cy.getByAriaLabel('Close').click());
	});

	Cypress.Commands.add(
		'checkBoxSpacingLabelClassName',
		(type = 'margin', side = 'top', cssClass, condition = 'have') => {
			if (isString(cssClass)) {
				cssClass = [cssClass];
			}

			cssClass.forEach((classItem) => {
				cy.get(
					`[data-cy="box-spacing-${
						side ? type + '-' + side : type
					}"] [data-cy="label-control"]`
				).should(
					condition === 'have' ? 'have.class' : 'not.have.class',
					classItem
				);
			});
		}
	);

	Cypress.Commands.add(
		'checkBoxPositionLabelClassName',
		(side = 'top', cssClass, condition = 'have') => {
			if (isString(cssClass)) {
				cssClass = [cssClass];
			}

			cssClass.forEach((classItem) => {
				cy.get(
					`[data-cy="box-position-label-${side}"] [data-cy="label-control"]`
				).should(
					condition === 'have' ? 'have.class' : 'not.have.class',
					classItem
				);
			});
		}
	);

	Cypress.Commands.add(
		'checkBoxSpacingLabelContent',
		(type = 'margin', side = 'top', content) => {
			cy.get(
				`[data-cy="box-spacing-${
					side ? type + '-' + side : type
				}"] [data-cy="label-control"]`
			).contains(content);
		}
	);

	Cypress.Commands.add(
		'checkBoxPositionLabelContent',
		(side = 'top', content) => {
			cy.get(
				`[data-cy="box-position-label-${side}"] [data-cy="label-control"]`
			).contains(content);
		}
	);

	Cypress.Commands.add('setColorControlValue', (label, value) => {
		cy.getParentContainer(label)
			.last()
			.within(() => {
				cy.getByDataCy('color-btn').click();
			});
		cy.getByDataTest('popover-body').within(() => {
			cy.get('input[maxlength="9"]').clear();
			cy.get('input[maxlength="9"]').type(value, { delay: 0 });
		});
	});

	Cypress.Commands.add(
		'resetBlockeraAttribute',
		(content, label, resetType = 'reset', repeaterItem = false) => {
			// Open label state graph
			if (repeaterItem) {
				// for repeater inner labels
				cy.getByDataTest('popover-body').within(() => {
					cy.getByAriaLabel(label).click();
				});
			} else
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
					cy.getByDataTest(`${resetType}-button`).click();
				});
		}
	);

	Cypress.Commands.add(
		'resetBoxSpacingAttribute',
		(type = 'margin', side = 'top', resetType = 'reset') => {
			openBoxSpacingSide(side ? `${type}-${side}` : type);

			// if there is no side it means there is no second popover
			if (side) {
				// open state graph
				cy.get('[data-wp-component="Popover"]')
					.last()
					.within(() => {
						cy.get('[data-cy="label-control"]').first().click();
					});
			}

			cy.getByDataTest('popover-body')
				.last()
				.within(() => {
					cy.getByDataTest(`${resetType}-button`).click();
				});
		}
	);

	Cypress.Commands.add(
		'resetBoxPositionAttribute',
		(side = 'top', resetType = 'reset') => {
			openBoxPositionSide(side);

			// open state graph
			// not for control and box
			if (!['control', 'box'].includes(side)) {
				cy.get('[data-wp-component="Popover"]')
					.last()
					.within(() => {
						cy.get('[data-cy="label-control"]').first().click();
					});
			}

			cy.getByDataTest('popover-body')
				.last()
				.within(() => {
					cy.getByDataTest(`${resetType}-button`).click({
						force: true,
					});
				});
		}
	);

	Cypress.Commands.add(
		'dragValue',
		{ prevSubject: 'element' },
		(subject, type = 'vertical', movement = 10) => {
			cy.wrap(subject[0]).trigger('mousedown', 'topLeft', {
				which: 1,
				force: true,
			});

			if (type === 'vertical') {
				// down movement is negative and up movement is positive
				cy.get('.blockera-virtual-cursor-box').trigger('mousemove', {
					which: 1,
					clientY:
						Math.ceil(subject[0].getBoundingClientRect().top) +
						movement * -1,
				});
			} else if (type === 'horizontal') {
				// left movement is negative and right movement is positive
				cy.get('.blockera-virtual-cursor-box').trigger('mousemove', {
					which: 1,
					clientX:
						Math.ceil(subject[0].getBoundingClientRect().left) +
						movement,
				});
			}

			cy.get('.blockera-virtual-cursor-box').trigger('mouseup', {
				which: 1,
			});

			return cy.wrap(subject);
		}
	);

	Cypress.Commands.add('setBlockVariation', (variation) => {
		cy.get('.blockera-block-card-wrapper').within(() => {
			cy.getByAriaLabel('Transform to variation').within(() => {
				cy.get(`button[value="${variation}"]`).click();
			});
		});
	});

	Cypress.Commands.add('checkActiveBlockVariation', (variation) => {
		cy.get('.blockera-block-card-wrapper').within(() => {
			cy.getByAriaLabel('Transform to variation').within(() => {
				cy.get(`button[value="${variation}"][aria-checked="true"]`);
			});
		});
	});
};
