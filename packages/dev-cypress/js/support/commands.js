/**
 * External dependencies
 */
import compareSnapshotCommand from 'cypress-image-diff-js/command';
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
	//This registers the cy.compareSnapshot() custom command provided by the plugin
	compareSnapshotCommand();

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
	Cypress.Commands.add('getBlock', (blockName, blockTag = '') => {
		// by passing default it clicks on editor that creates a paragraph block
		if (blockName === 'default') {
			if (Cypress.$('iframe[name="editor-canvas"]').length) {
				cy.getIframeBody()
					.find(`[aria-label="Add default block"]`)
					.click();
				blockName = 'core/paragraph';
				return cy
					.getIframeBody()
					.find(`[data-type="${blockName}"]`)
					.eq(0);
			}
			cy.getByAriaLabel('Add default block').click();
			blockName = 'core/paragraph';
			return cy.get(`[data-type="${blockName}"]`).eq(0);
		}

		if (Cypress.$('iframe[name="editor-canvas"]').length) {
			return cy
				.getIframeBody()
				.find(`${blockTag}[data-type="${blockName}"]`);
		}
		return cy.get(`${blockTag}[data-type="${blockName}"]`);
	});

	Cypress.Commands.add('getSelectedBlock', () => {
		return cy.getIframeBody().find('.wp-block.is-selected');
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
			cy.get(selector, ...args).click({ force: true });
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
						if (force)
							cy.get('input').type(`{selectall}${value}`, {
								force: true,
							});
						else {
							cy.get('input').type(`{selectall}${value}`);
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
		cy.get('button[aria-haspopup="listbox"]').click({ force: true });

		cy.get('[role="listbox"]').within(() => {
			cy.contains(item).click({ force: true });
		});
	});

	Cypress.Commands.add('openAccordion', (accordionHeading) =>
		cy
			.get('h2')
			.contains(accordionHeading)
			.parent()
			.parent()
			.click({ force: true })
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
					cy.getByAriaLabel(label).click({ force: true });
				});
			} else
				cy.get('h2')
					.contains(content)
					.parent()
					.parent()
					.within(() => {
						cy.getByAriaLabel(label).click({ force: true });
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
			.within(() => cy.getByAriaLabel('Close').click({ force: true }));
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
				cy.getByDataCy('color-btn').click({ force: true });
			});

		cy.get('[data-wp-component="Popover"]')
			.last()
			.within(() => {
				cy.get('input[maxlength="9"]').clear({ force: true });
				cy.get('input[maxlength="9"]')
					.type(value + ' ', { delay: 0 })
					.then(() => {
						if (Cypress.$(`[aria-label="Close"]`).length) {
							// close popover
							Cypress.$(`[aria-label="Close"]`)[0].click({
								force: true,
							});
						}
					});
			});
	});

	Cypress.Commands.add('clearColorControlValue', (label) => {
		cy.getParentContainer(label)
			.last()
			.within(() => {
				cy.getByDataCy('color-btn').click();
			});

		cy.get('[data-wp-component="Popover"]')
			.last()
			.within(() => {
				cy.getByAriaLabel('Reset Color (Clear)').click();
			});
	});

	Cypress.Commands.add(
		'resetBlockeraAttribute',
		(content, label, resetType = 'reset', repeaterItem = false) => {
			// Open label state graph
			if (repeaterItem) {
				// for repeater inner labels
				cy.getByDataTest('popover-body').within(() => {
					cy.getByAriaLabel(label).click({ force: true });
				});
			} else
				cy.get('h2')
					.contains(content)
					.parent()
					.parent()
					.within(() => {
						cy.getByAriaLabel(label).click({ force: true });
					});

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
		'resetBoxSpacingAttribute',
		(type = 'margin', side = 'top', resetType = 'reset') => {
			openBoxSpacingSide(side ? `${type}-${side}` : type);

			// if there is no side it means there is no second popover
			if (side) {
				// open state graph
				cy.get('[data-wp-component="Popover"]')
					.last()
					.within(() => {
						cy.get('[data-cy="label-control"]')
							.first()
							.click({ force: true });
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
		'resetBoxPositionAttribute',
		(side = 'top', resetType = 'reset') => {
			openBoxPositionSide(side);

			// open state graph
			// not for control and box
			if (!['control', 'box'].includes(side)) {
				cy.get('[data-wp-component="Popover"]')
					.last()
					.within(() => {
						cy.get('[data-cy="label-control"]')
							.first()
							.click({ force: true });
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

	Cypress.Commands.add('openRepeaterItem', (parentContainer, contains) => {
		cy.getParentContainer(parentContainer).within(() => {
			cy.getByDataCy('group-control-header').contains(contains).click();
		});
	});

	/**
	 * Normalize CSS content by removing comments, extra whitespace, and standardizing formatting
	 * @param {string} cssContent - The CSS content to normalize
	 * @returns {string} - The normalized CSS content
	 */
	Cypress.Commands.add('normalizeCSSContent', (cssContent) => {
		return cssContent
			.replace(/\/\*[\s\S]*?\*\//g, '') // Remove CSS comments /* ... */
			.replace(/[\t\n\r]+/g, ' ') // Replace tabs and newlines with a single space
			.replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
			.replace(/\s*{\s*/g, '{') // Remove spaces around opening braces
			.replace(/\s*}\s*/g, '}') // Remove spaces around closing braces
			.replace(/\s*:\s*/g, ':') // Remove spaces around colons
			.replace(/\s*;\s*/g, ';') // Remove spaces around semicolons
			.trim(); // Remove leading/trailing whitespace
	});
};
