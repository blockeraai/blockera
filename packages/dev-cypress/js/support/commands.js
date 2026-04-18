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
	closeWelcomeGuide,
	hexStringToByte,
	openBoxSpacingSide,
	openBoxPositionSide,
} from '../helpers';
import { WORKSPACE_TABS_TEST_ID } from 'blockera-editor-tabs-test-ids';
import { PREVIEW_MODE_TEST_ID } from 'blockera-editor-preview-test-ids';

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

	/**
	 * Types into a Blockera input that exposes `data-test` on the native input (e.g. layout grid controls).
	 * Replaces the current value via select-all to work with number and unit fields.
	 */
	Cypress.Commands.add(
		'typeInInputByDataTest',
		(dataTest, text, options = {}) => {
			const merged = { delay: 0, force: true, ...options };
			const value =
				text === '' ? '{selectall}{backspace}' : '{selectall}' + text;

			cy.getByDataTest(dataTest)
				.should('be.visible')
				.click({ force: true })
				.type(value, merged)
				.blur();
		}
	);

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

	/**
	 * Dispatch `primaryShift` + physical key (matches @wordpress/keycodes `isKeyboardEvent`).
	 * WordPress listens on `document` for `keydown` (see @wordpress/keyboard-shortcuts context).
	 *
	 * @param {string} key KeyboardEvent.key
	 * @param {string} code KeyboardEvent.code
	 */
	Cypress.Commands.add('pressPrimaryShiftKey', (key, code) => {
		const isMac = Cypress.platform === 'darwin';
		cy.window().then((win) => {
			win.document.dispatchEvent(
				new win.KeyboardEvent('keydown', {
					key,
					code,
					bubbles: true,
					cancelable: true,
					shiftKey: true,
					metaKey: isMac,
					ctrlKey: !isMac,
				})
			);
		});
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

	// Select a variable row in the variable picker (catalog `va-item-*` or preset repeater `data-variable-slug`).
	Cypress.Commands.add('selectValueAddonItem', (itemID) => {
		cy.get(
			'[data-cy="variable-picker-popover"], .blockera-control-popover-variables',
			{ timeout: 15000 }
		)
			.filter(':visible')
			.first()
			.should('exist')
			.within(() => {
				cy.get(
					`[data-variable-slug="${itemID}"], [data-cy="va-item-${itemID}"]`
				)
					.first()
					.click({ force: true });
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
						if (force) {
							cy.get('input').type(`{selectall}${value}`, {
								force: true,
							});
						} else {
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
				cy.getByDataTest('popover-body')
					.last()
					.within(() => {
						cy.getByAriaLabel(label).click({ force: true });
					});
			} else {
				cy.get('h2')
					.contains(content)
					.parent()
					.parent()
					.within(() => {
						cy.getByAriaLabel(label).click({ force: true });
					});
			}

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
						cy.get('[data-cy="label-control"]')
							.first()
							.click({ force: true });
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
				cy.get('[data-cy="color-picker-css-value"]')
					.click({ force: true })
					.type('{selectall}' + value + ' ', { delay: 0 })
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
				cy.getByDataTest('popover-body')
					.last()
					.within(() => {
						cy.getByAriaLabel(label).click({ force: true });
					});
			} else {
				cy.get('h2')
					.contains(content)
					.parent()
					.parent()
					.within(() => {
						cy.getByAriaLabel(label).first().click({ force: true });
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
			cy.get('.blockera-block-variation-transforms').within(() => {
				cy.get(`button[data-value="${variation}"]`).click();
			});
		});
	});

	Cypress.Commands.add('checkActiveBlockVariation', (variation) => {
		cy.get('.blockera-block-card-wrapper').within(() => {
			cy.get('.blockera-block-variation-transforms').within(() => {
				cy.get(
					`button[data-value="${variation}"][aria-checked="true"]`
				);
			});
		});
	});

	Cypress.Commands.add('openRepeaterItem', (parentContainer, contains) => {
		cy.getParentContainer(parentContainer).within(() => {
			cy.getByDataCy('group-control-header').contains(contains).click();
		});
	});

	Cypress.Commands.add('closeSpotlightPopover', () => {
		cy.get('.blockera-spotlighter-svg').click({ force: true });
	});

	/**
	 * Normalize CSS content by removing comments, extra whitespace, and standardizing formatting
	 *
	 * @param {string} cssContent - The CSS content to normalize
	 * @return {string} - The normalized CSS content
	 */
	Cypress.Commands.add('normalizeCSSContent', (cssContent) => {
		return (
			cssContent
				.replace(/\/\*[\s\S]*?\*\//g, '') // Remove CSS comments
				.replace(/[\t\n\r]+/g, ' ') // Replace tabs and newlines with space
				.replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space
				.replace(/\s*{\s*/g, '{') // Remove spaces around opening braces
				.replace(/\s*}\s*/g, '}') // Remove spaces around closing braces
				.replace(/\s*:\s*/g, ':') // Remove spaces around colons
				.replace(/\s*;\s*/g, ';') // Remove spaces around semicolons

				// Normalize attribute selectors to use double quotes
				.replace(
					/\[([^\]\s~|^$*!=]+)\s*([~|^$*]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\]\s]+))\]/g,
					(_, attr, operator, v1, v2, v3) => {
						const value = v1 ?? v2 ?? v3 ?? '';
						return `[${attr}${operator}"${value}"]`;
					}
				)

				.trim() // Remove leading/trailing whitespace
		);
	});

	/**
	 * Perform a WP CLI command
	 *
	 * @param command - WP CLI command. The 'wp ' prefix is required.
	 * @param ignoreFailures - Prevent command to fail if CLI command exits with error
	 * @param skipEscaping - Skip escaping quotes and backslashes (useful for complex values)
	 *
	 * @example
	 * ```
	 * cy.wpCli('wp core version').then(response=>{
	 *   const version = res.stdout;
	 *   // Do whatever with version
	 * });
	 * ```
	 */
	Cypress.Commands.add(
		'wpCli',
		(command, ignoreFailures = false, skipEscaping = false) => {
			const escapedCommand = skipEscaping
				? command
				: command.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
			const options = {
				failOnNonZeroExit: !ignoreFailures,
			};

			cy.exec(
				`npm --silent run env run cli -- ${escapedCommand}`,
				options
			).then((result) => {
				cy.wrap(result);
			});
		}
	);

	Cypress.Commands.add(
		'checkBlockCardItems',
		(expectedStates, isInnerBlock = false) => {
			const container = isInnerBlock
				? '.block-card--inner-block'
				: '.blockera-extension-block-card';

			cy.get(container).within(() => {
				// Check that all expected items exist and are visible
				expectedStates.forEach((state) => {
					cy.get(`[data-cy="repeater-item"][data-id="${state}"]`)
						.should('exist')
						.and('be.visible');
				});

				// Check that no unexpected items exist
				cy.get('[data-cy="repeater-item"]').then(($items) => {
					const actualStates = Array.from($items).map((item) =>
						item.getAttribute('data-id')
					);
					const unexpectedStates = actualStates.filter(
						(state) => !expectedStates.includes(state)
					);

					expect(unexpectedStates, 'Unexpected repeater items found')
						.to.be.empty;
				});
			});
		}
	);

	Cypress.Commands.add(
		'checkBlockStatesPickerItems',
		(expectedItems, checkExtraItems = false) => {
			cy.get(
				'[data-test="blockera-block-state-container"] [data-test="add-new-block-state"]'
			).click();

			cy.get(
				'.blockera-component-popover.blockera-states-picker-popover'
			).within(() => {
				expectedItems.forEach((state) => {
					cy.get(`[data-test="${state}"]`).should('exist');
				});
			});

			if (checkExtraItems) {
				cy.get(
					'.blockera-component-popover.blockera-states-picker-popover .blockera-feature-type'
				).then(($items) => {
					const actualItems = Array.from($items).map((item) =>
						item.getAttribute('data-test')
					);
					const unexpectedItems = actualItems.filter(
						(item) => !expectedItems.includes(item)
					);

					expect(unexpectedItems, 'Unexpected items found').to.be
						.empty;
				});
			}
		}
	);

	Cypress.Commands.add(
		'checkBlockSections',
		(expectedSections, check = 'exist') => {
			expectedSections.forEach((section) => {
				cy.get(
					`.blockera-extension.blockera-extension-${section}`
				).should(check);
			});
		}
	);

	Cypress.Commands.add('openGlobalStylesPanel', () => {
		return cy
			.get('button[aria-controls="edit-site:global-styles"]')
			.click({ force: true });
	});

	Cypress.Commands.add('openSettingsPanel', () => {
		return cy
			.get('button[aria-controls="edit-post:document"]')
			.click({ force: true });
	});

	Cypress.Commands.add('addNewTransition', () => {
		cy.getParentContainer(['Transitions Timing', 'Transitions']).as(
			'transition'
		);

		cy.get('@transition').within(() => {
			cy.getByAriaLabel('Add New Transition').click();
		});
	});

	/**
	 * Global Styles → Color variables: add a row in the custom color preset repeater
	 * (`getOriginVariablesLabel( 'custom' )` + PresetGroup title → aria labels).
	 * Same pattern as `addNewTransition`: `getParentContainer`, then add via aria-label.
	 */
	Cypress.Commands.add('addNewGlobalStylesCustomColorPreset', () => {
		cy.getParentContainer('Custom Variables').as(
			'globalStylesCustomColorPresetGroup'
		);

		cy.get('@globalStylesCustomColorPresetGroup').within(() => {
			cy.getByAriaLabel('Add New Color').click({ force: true });
		});
	});

	/**
	 * Global Styles → any custom preset repeater: click add via `data-test` on PresetGroup
	 * (`global-styles-preset-add-${controlName}`).
	 */
	Cypress.Commands.add(
		'addNewGlobalStylesCustomPresetByDataTest',
		(dataTest) => {
			cy.getParentContainer('Custom Variables').within(() => {
				cy.getByDataTest(dataTest).click({ force: true });
			});
		}
	);

	Cypress.Commands.add('editTransition', (duration = 200, delay = 2000) => {
		cy.getParentContainer(['Transitions Timing', 'Transitions']).as(
			'transition'
		);
		cy.get('@transition').within(() => {
			cy.getByDataCy('group-control-header').click();
		});

		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.getByDataTest('transition-input-duration').clear();
				cy.getByDataTest('transition-input-duration').type(
					duration,
					delay
				);

				cy.getParentContainer('Timing').within(() => {
					// check disabled options
					cy.get('select').within(() => {
						cy.get('[value="ease-in-quad"]').should('be.disabled');
						cy.get('[value="ease-in-cubic"]').should('be.disabled');
					});

					cy.get('select').select('ease-in-out');
				});

				cy.getByDataTest('transition-input-delay').clear();
				cy.getByDataTest('transition-input-delay').type(2000);
			});
	});

	Cypress.Commands.add('prepareEditorForScreenshot', (reset = false) => {
		if (!reset) {
			cy.getByAriaLabel('Close Settings').click();

			cy.get(
				'body.is-fullscreen-mode .interface-interface-skeleton'
			).invoke('css', 'top', '0');
			cy.get('#wpbody').invoke('css', 'padding-top', '0');
			cy.get('#wpadminbar').invoke('css', 'display', 'none');

			cy.get(
				'.admin-ui-navigable-region.interface-interface-skeleton__footer'
			).invoke('css', 'display', 'none');

			cy.getIframeBody()
				.find('.edit-post-visual-editor__post-title-wrapper')
				.invoke('css', 'display', 'none');

			cy.get(
				'.admin-ui-navigable-region.interface-interface-skeleton__header'
			).invoke('css', 'display', 'none');
		} else {
			cy.setScreenshotViewport('desktop');

			cy.get(
				'body.is-fullscreen-mode .interface-interface-skeleton'
			).invoke('css', 'top', '32px');
			cy.get('#wpadminbar').invoke('css', 'display', 'flex');

			cy.get(
				'.admin-ui-navigable-region.interface-interface-skeleton__footer'
			).invoke('css', 'display', 'flex');

			cy.getIframeBody()
				.find('.edit-post-visual-editor__post-title-wrapper')
				.invoke('css', 'display', 'block');

			cy.get(
				'.admin-ui-navigable-region.interface-interface-skeleton__header'
			).invoke('css', 'display', 'block');
		}
	});

	Cypress.Commands.add('prepareFrontendForScreenshot', () => {
		// disable wp navbar to avoid screenshot issue
		cy.get('#wpadminbar').invoke('css', 'display', 'none');
	});

	Cypress.Commands.add(
		'setScreenshotViewport',
		(size = 'desktop', config = {}) => {
			let width = '';
			let height = '';

			if (size === 'desktop') {
				width = 1600;
				height = 2000;
			} else if (size === 'mobile') {
				width = 450;
				height = 2000;
			}

			config = {
				width: config?.width || width,
				height: config?.height || height,
				wait: 250,
				...config,
			};

			cy.viewport(config.width, config.height);

			if (config?.wait) {
				cy.wait(config.wait);
			}
		}
	);

	Cypress.Commands.add('openFeatureMoreSettings', (dataTest) => {
		cy.getByDataTest(dataTest).click();
	});

	Cypress.Commands.add('selectFeature', (featureLabel) => {
		// Extension settings popover always uses this class (see ExtensionSettings).
		cy.get('.extension-settings [data-test="popover-body"]', {
			timeout: 20000,
		})
			.should('be.visible')
			.within(() => {
				cy.contains('button', featureLabel).then(($btn) => {
					// Optional features toggle on each click. We must skip when already
					// active, or we turn the feature off and the control disappears.
					//
					// Do not use SupportItem's `active-item` class: componentClassNames(
					// 'support-item', { 'active-item': show }) is broken — the object is
					// not merged (prepareClassName only processes array index 0), so that
					// class never hits the DOM and would make us always click.
					const aria = ($btn.attr('aria-label') || '').toLowerCase();
					if (aria.includes('deactivate')) {
						return;
					}
					cy.wrap($btn).click();
				});
			});
	});

	/**
	 * Clears persisted workspace tab list so a new `post-new` load starts with a
	 * single tab (see `TABS_STORAGE_KEY` in editor tabs storage).
	 */
	Cypress.Commands.add('tabsResetWorkspaceStorage', () => {
		cy.window().then((win) => {
			win.localStorage.removeItem('blockera-tabs-tabs');
		});
	});

	/**
	 * Clears open-tab list + recently closed list + “remember recently closed”
	 * preference so tests start from defaults (tabs persisted, recently closed on).
	 */
	Cypress.Commands.add('tabsResetTabsRelatedStorage', () => {
		cy.window().then((win) => {
			win.localStorage.removeItem('blockera-tabs-tabs');
			win.localStorage.removeItem('blockera-tabs-recently-closed');
			win.localStorage.removeItem(
				'blockera-tabs-recently-closed-persistence'
			);
		});
	});

	/** Opens the tabs bar “⋯” toolbar menu (Recently Closed, settings). */
	Cypress.Commands.add('tabsOpenToolbarMenu', () => {
		cy.get('.blockera-tabs-bar', { timeout: 60000 }).should('be.visible');
		cy.get(`[test-id="${WORKSPACE_TABS_TEST_ID.toolbarMenuTrigger}"]`)
			.filter(':visible')
			.first()
			.scrollIntoView()
			.should('be.visible')
			.click({ force: true });
		// Wait on test-id (locale-safe; do not match translated menu strings).
		cy.getByTestId(WORKSPACE_TABS_TEST_ID.toolbarRememberRecentlyClosed, {
			timeout: 20000,
		}).should('exist');
	});

	/** Opens the add-tab flow (command palette in “add tab” mode). */
	Cypress.Commands.add('tabsOpenAddPalette', () => {
		cy.get(`[test-id="${WORKSPACE_TABS_TEST_ID.add}"]`)
			.first()
			.should('exist')
			.click({ force: true });
	});

	/**
	 * Opens add tab palette and runs “Add new post” (creates a draft post via REST).
	 */
	Cypress.Commands.add('tabsAddNewPost', () => {
		cy.tabsOpenAddPalette();
		cy.get('.commands-command-menu [cmdk-input]', { timeout: 20000 })
			.should('be.visible')
			.type('{selectall}{backspace}Add new post{enter}');
	});

	/**
	 * Add-tab palette: type a search string and activate the first visible command result.
	 * Use for opening templates / pages from the palette (locale-safe search depends on the string).
	 *
	 * @param {string} searchText Palette filter text (e.g. template slug from REST).
	 */
	Cypress.Commands.add('tabsAddTabFromPaletteSearch', (searchText) => {
		cy.tabsOpenAddPalette();
		cy.get('.commands-command-menu [cmdk-input]', { timeout: 20000 })
			.should('be.visible')
			.type('{selectall}{backspace}' + searchText, { delay: 40 });
		cy.get('.commands-command-menu [cmdk-item]', { timeout: 20000 })
			.filter(':visible')
			.not('[aria-disabled="true"]')
			.first()
			.click({ force: true });
	});

	/**
	 * Fetches `wp_template` records via REST (editor must be loaded). Yields `{ id, slug, title }`.
	 * Requires a block theme.
	 */
	Cypress.Commands.add('tabsRestGetSampleTemplate', () => {
		return cy.window().then((win) => {
			const apiFetch = win.wp?.apiFetch;

			if (!apiFetch) {
				throw new Error(
					'wp.apiFetch is required (open the block editor first).'
				);
			}

			return apiFetch({
				path: '/wp/v2/templates?context=edit&per_page=40',
			}).then((items) => {
				if (!Array.isArray(items) || items.length === 0) {
					throw new Error(
						'No templates from GET /wp/v2/templates (block theme required).'
					);
				}

				const preferSlugs = ['index', 'page', 'archive', 'single'];
				let chosen = null;

				for (const s of preferSlugs) {
					chosen = items.find((t) => t.slug === s);

					if (chosen) {
						break;
					}
				}

				if (!chosen) {
					chosen = items[0];
				}

				const rawTitle = chosen.title;
				const title =
					typeof rawTitle === 'string'
						? rawTitle
						: rawTitle?.rendered?.replace(/<[^>]+>/g, '') || '';

				return {
					id: chosen.id,
					slug: chosen.slug,
					title: title.trim(),
				};
			});
		});
	});

	/**
	 * Joins Cypress `testURL` with a path (same rules as `goTo` in site-navigation).
	 * @param {string} path Path starting with `/` e.g. `/wp-admin/post.php`
	 */
	const joinTestUrl = (path) => {
		const testURL = Cypress.env('testURL');

		if (
			(testURL.endsWith('/') && !path.startsWith('/')) ||
			(!testURL.endsWith('/') && path.startsWith('/'))
		) {
			return `${testURL}${path}`;
		}

		if (!testURL.endsWith('/') && !path.startsWith('/')) {
			return `${testURL}/${path}`;
		}

		if (testURL.endsWith('/') && path.startsWith('/')) {
			return `${testURL.slice(0, -1)}${path}`;
		}

		return `${testURL}${path}`;
	};

	/**
	 * Creates draft posts via REST while the block editor is loaded (`wp.apiFetch`).
	 * @param {number} count How many drafts to create.
	 * @returns {Cypress.Chainable<number[]>} Numeric post IDs.
	 */
	Cypress.Commands.add('tabsCreateDraftPostsViaRest', (count) => {
		return cy.window().then((win) => {
			const apiFetch = win.wp?.apiFetch;

			if (!apiFetch) {
				throw new Error(
					'wp.apiFetch is required (open the block editor first).'
				);
			}

			const base = `${Date.now()}`;
			const requests = Array.from({ length: count }, (_, i) =>
				apiFetch({
					path: '/wp/v2/posts',
					method: 'POST',
					data: {
						title: `e2e-tabs-${base}-${i}`,
						status: 'draft',
					},
				}).then((r) => r.id)
			);

			return Promise.all(requests);
		});
	});

	/**
	 * Permanently deletes a `post` type tab target via REST (`DELETE ...?force=true`).
	 * Tab key must be `post-{numericId}` (see workspace tab `test-id` suffix).
	 *
	 * @param {string} tabKey e.g. `post-42`
	 */
	Cypress.Commands.add('tabsTrashPostByTabKey', (tabKey) => {
		const m = /^post-(\d+)$/.exec(String(tabKey));

		if (!m) {
			throw new Error(
				`tabsTrashPostByTabKey: expected tab key "post-{id}", got "${tabKey}"`
			);
		}

		const id = m[1];
		const numericId = Number(id);

		return cy.window().then((win) => {
			const apiFetch = win.wp?.apiFetch;

			if (!apiFetch) {
				throw new Error(
					'wp.apiFetch is required (open the block editor first).'
				);
			}

			return apiFetch({
				path: `/wp/v2/posts/${id}?force=true`,
				method: 'DELETE',
			}).then(async () => {
				// Drop cached `getEntityRecord` so tab switch runs a fresh resolve (matches trash in another tab).
				const dispatch = win.wp?.data?.dispatch('core');

				if (dispatch?.invalidateResolution) {
					dispatch.invalidateResolution('getEntityRecord', [
						'postType',
						'post',
						numericId,
					]);
					dispatch.invalidateResolution('getEntityRecord', [
						'postType',
						'post',
						id,
					]);
				}

				// Wait until core-data finishes re-resolving (success or fail) so UI/tests do not race
				// the recently-closed row's `getEntityRecord` resolver (numeric ID matches store normalization).
				const resolveSelect = win.wp?.data?.resolveSelect?.('core');
				if (resolveSelect?.getEntityRecord) {
					try {
						await resolveSelect.getEntityRecord(
							'postType',
							'post',
							numericId
						);
					} catch {
						// Expected after permanent delete (failResolution / REST error).
					}
				}
			});
		});
	});

	/**
	 * Visits the post editor and seeds `sessionStorage` so `useBulkEditTabs` opens
	 * `bulkIds` as extra tabs (adds without `evictLastUnpinnedIfAtLimit`).
	 * @param {number|string} postId Current document post ID.
	 * @param {number[]|string[]} bulkIds Additional post IDs to open as tabs.
	 */
	Cypress.Commands.add(
		'tabsVisitEditorWithBulkEditIds',
		(postId, bulkIds) => {
			const list = Array.isArray(bulkIds)
				? bulkIds.join(',')
				: String(bulkIds);
			// Query string is a fallback if sessionStorage is unavailable; useBulkEditTabs
			// reads sessionStorage first, then URL (`bulk_edit_ids`).
			const path = `/wp-admin/post.php?post=${postId}&action=edit&bulk_edit_ids=${encodeURIComponent(
				list
			)}`;
			const url = joinTestUrl(path);

			return cy.visit(url, {
				onBeforeLoad(win) {
					win.sessionStorage.setItem(
						'blockera_tabs_bulk_edit_ids',
						list
					);
					win.sessionStorage.setItem(
						'blockera_tabs_bulk_edit_post_type',
						'post'
					);
				},
			});
		}
	);

	/**
	 * Posts list (`edit.php`): check rows by post ID, run Blockera bulk action
	 * “Edit All in Editor”, Apply. Redirects to `post.php` with `bulk_edit_ids`
	 * (same as `BulkActions::build_editor_url()`).
	 *
	 * @param {(number|string)[]} postIds Post IDs to select (same post type; Posts screen).
	 * @see packages/editor/php/BulkActions.php — ACTION_SLUG, handle_bulk_action
	 */
	Cypress.Commands.add('tabsBulkEditAllInEditorFromPostsList', (postIds) => {
		cy.visit(joinTestUrl('/wp-admin/edit.php'));
		cy.get('#posts-filter .wp-list-table, .wp-list-table', {
			timeout: 60000,
		}).should('exist');
		cy.wrap(postIds).each((id) => {
			cy.get(`input[name="post[]"][value="${id}"]`, { timeout: 20000 })
				.scrollIntoView()
				.check({ force: true });
		});
		// Value must match `BulkActions::ACTION_SLUG` (`blockera_edit_all`).
		cy.get('#bulk-action-selector-top').select('blockera_edit_all');
		cy.get('#doaction').click();
	});

	const unpinnedTabRoots = `.blockera-tabs-bar-tabs__normal-tabs [test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`;

	const pinnedTabRoots = `.blockera-tabs-bar-tabs__pinned-tabs [test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`;

	/**
	 * Asserts the number of pinned workspace tabs.
	 * When count is 0, the pinned strip is not rendered.
	 * @param {number} count Expected pinned tab count.
	 * @param {Cypress.Timeoutable} [options] e.g. `{ timeout: 60000 }`.
	 */
	Cypress.Commands.add('tabsExpectPinnedCount', (count, options = {}) => {
		if (count === 0) {
			cy.get('.blockera-tabs-bar-tabs__pinned-tabs', options).should(
				'not.exist'
			);
		} else {
			cy.get(pinnedTabRoots, options).should('have.length', count);
		}
	});

	/**
	 * Asserts the number of unpinned workspace tabs.
	 * @param {number} count Expected tab count.
	 * @param {Cypress.Timeoutable} [options] e.g. `{ timeout: 60000 }` while a new tab loads.
	 */
	Cypress.Commands.add('tabsExpectUnpinnedCount', (count, options = {}) => {
		cy.get(unpinnedTabRoots, options).should('have.length', count);
	});

	/** Activates an unpinned tab by zero-based index (left to right). */
	Cypress.Commands.add('tabsClickUnpinnedByIndex', (index) => {
		// Post ↔ site-editor switches can surface Core welcome/modals that cover the tab bar.
		closeWelcomeGuide();
		cy.get(unpinnedTabRoots)
			.eq(index)
			.find('.blockera-tabs-tab-button')
			.first()
			.should('be.visible')
			.click();
	});

	/**
	 * Activates an unpinned tab whose `test-id` contains `fragment`
	 * (e.g. `tab--post-`, `tab--wp_template` — matches `blockera-workspace-tab--post-123`).
	 */
	Cypress.Commands.add('tabsClickUnpinnedTabMatchingTestId', (fragment) => {
		cy.get(unpinnedTabRoots, { timeout: 20000 }).then(($els) => {
			const ids = [...$els].map((el) => el.getAttribute('test-id') || '');
			const idx = ids.findIndex((id) => id.includes(fragment));
			expect(idx, `unpinned tab matching "${fragment}"`).to.be.at.least(
				0
			);
			cy.tabsClickUnpinnedByIndex(idx);
		});
	});

	/** Asserts `core/editor`’s current post type (retries until it matches). */
	Cypress.Commands.add('expectCoreEditorPostType', (expected) => {
		cy.window().should((win) => {
			const select = win.wp?.data?.select?.('core/editor');
			const pt = select?.getCurrentPostType?.();
			expect(pt).to.eq(expected);
		});
	});

	/** Activates a pinned tab by zero-based index (left to right within the pinned strip). */
	Cypress.Commands.add('tabsClickPinnedByIndex', (index) => {
		cy.get(pinnedTabRoots)
			.eq(index)
			.find('.blockera-tabs-tab-button')
			.first()
			.should('be.visible')
			.click();
	});

	/**
	 * Closes an unpinned tab by index via its close control.
	 * (Pinned tabs have no close button in this UI.)
	 */
	Cypress.Commands.add('tabsCloseUnpinnedByIndex', (index) => {
		cy.get(unpinnedTabRoots)
			.eq(index)
			.find('[test-id^="blockera-workspace-tabs-close--"]')
			.should('be.visible')
			.click();
	});

	/** The visible title element for the currently active workspace tab. */
	Cypress.Commands.add('tabsGetActiveTitle', () => {
		return cy
			.get('.blockera-tabs-tab.is-active')
			.find(`[test-id="${WORKSPACE_TABS_TEST_ID.tabTitle}"]`);
	});

	/**
	 * Stub `window.open` for tab context menu "View" (assert with `@tabsWindowOpen`).
	 */
	Cypress.Commands.add('tabsStubWindowOpen', () => {
		cy.window().then((win) => {
			cy.stub(win, 'open').as('tabsWindowOpen');
		});
	});

	/**
	 * Stub `navigator.clipboard.writeText` for "Copy view link" / "Copy editor link"
	 * (assert with `@tabsClipboardWrite`).
	 */
	Cypress.Commands.add('tabsStubClipboardWrite', () => {
		cy.window().then((win) => {
			cy.stub(win.navigator.clipboard, 'writeText')
				.resolves()
				.as('tabsClipboardWrite');
		});
	});

	/**
	 * Asserts whether the unsaved-change dot is present on an unpinned tab (by index).
	 * @param {number} index Zero-based index in the unpinned strip (left to right).
	 * @param {boolean} [shouldExist=true] When false, expects the indicator to be absent.
	 */
	Cypress.Commands.add(
		'tabsExpectUnpinnedUnsavedIndicator',
		(index, shouldExist = true) => {
			cy.get(unpinnedTabRoots)
				.eq(index)
				.find(
					`[test-id="${WORKSPACE_TABS_TEST_ID.tabUnsavedIndicator}"]`
				)
				.should(shouldExist ? 'exist' : 'not.exist');
		}
	);

	/**
	 * Asserts the workspace tab limit upgrade prompt is visible (free tier; Pro removes limits).
	 * @param {Cypress.Timeoutable} [options] e.g. `{ timeout: 20000 }`.
	 */
	Cypress.Commands.add('tabsExpectLimitUpgradePrompt', (options = {}) => {
		cy.getByTestId(
			WORKSPACE_TABS_TEST_ID.tabsLimitUpgradePrompt,
			options
		).should('be.visible');
	});

	/**
	 * Opens the Blockera header zoom dropdown (Post/Site editor).
	 */
	Cypress.Commands.add('zoomOpenDropdown', () => {
		cy.getByDataTest('blockera-zoom-control', { timeout: 30000 })
			.should('be.visible')
			.find('button[aria-haspopup="true"]')
			.first()
			.click({ force: true });
	});

	/**
	 * Stub `window.open` for Blockera preview mode (modifier+click, header “open in new tab”, shortcuts).
	 * Assert with `@previewWindowOpen`.
	 */
	Cypress.Commands.add('previewStubWindowOpen', () => {
		cy.window().then((win) => {
			cy.stub(win, 'open').as('previewWindowOpen');
		});
	});

	/** Clicks the header “Live frontend preview” control (`PREVIEW_MODE_TEST_ID.toggleButton`). */
	Cypress.Commands.add('previewClickToggle', () => {
		cy.getByTestId(PREVIEW_MODE_TEST_ID.toggleButton, {
			timeout: 30000,
		})
			.should('be.visible')
			.click();
	});

	/** Waits for the preview overlay dialog (iframe preview). */
	Cypress.Commands.add('previewExpectOverlayOpen', () => {
		cy.getByTestId(PREVIEW_MODE_TEST_ID.overlay, { timeout: 30000 }).should(
			'be.visible'
		);
		cy.get('body').should('have.class', 'blockera-preview-mode-open');
		// Iframe can be clipped by fixed/overflow ancestors; `exist` matches user-visible preview.
		cy.getByTestId(PREVIEW_MODE_TEST_ID.iframe).should('exist');
	});

	/** Asserts preview overlay is closed and body class removed. */
	Cypress.Commands.add('previewExpectOverlayClosed', () => {
		cy.getByTestId(PREVIEW_MODE_TEST_ID.overlay).should('not.exist');
		cy.get('body').should('not.have.class', 'blockera-preview-mode-open');
	});
};
