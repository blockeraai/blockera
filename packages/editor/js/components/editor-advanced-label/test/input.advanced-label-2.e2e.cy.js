import {
	getWPDataObject,
	getSelectedBlock,
	createPost,
	setBlockState,
	addBlockState,
	setDeviceType,
} from '@blockera/dev-cypress/js/helpers';

describe('Input Control label testing (Width)', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	describe('Changed state testing...', () => {
		it('should display changed value on Width -> Normal -> Desktop', () => {
			// Assert label before set value
			cy.checkLabelClassName(
				'Size',
				'Width',
				'changed-in-normal-state',
				'not-have'
			);

			// Set value
			cy.setInputFieldValue('Width', 'Size', 50);

			// Assert label after set value
			cy.checkLabelClassName('Size', 'Width', 'changed-in-normal-state');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', 50);

			/**
			 * Tablet device
			 */
			setDeviceType('Tablet');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-normal-state');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', 50);

			/**
			 * Pseudo State (Hover/Tablet)
			 */
			setBlockState('Hover');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-normal-state');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', 50);

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', { desktop: ['Normal'] });
		});

		it('should display changed value on Width -> Hover -> Desktop', () => {
			/**
			 * Hover
			 */
			setBlockState('Hover');
			// Assert label before set value
			cy.checkLabelClassName(
				'Size',
				'Width',
				'changed-in-normal-state',
				'not-have'
			);

			// Set value
			cy.setInputFieldValue('Width', 'Size', 50);

			// Assert label after set value
			cy.checkLabelClassName(
				'Size',
				'Width',
				'changed-in-secondary-state'
			);
			// Assert control
			cy.checkInputFieldValue('Width', 'Size', 50);

			/**
			 * Normal
			 */
			setBlockState('Normal');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-other-state');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '');

			/**
			 * Tablet device
			 */
			setDeviceType('Tablet');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-other-state');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', { desktop: ['Hover'] });
		});

		it('should display changed value on Width, when set value in two states', () => {
			/**
			 * Normal
			 */
			// Set value
			cy.setInputFieldValue('Width', 'Size', 50);

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-normal-state');

			/**
			 * Hover
			 */
			setBlockState('Hover');

			// Assert label before set value
			cy.checkLabelClassName('Size', 'Width', 'changed-in-normal-state');

			// Set value
			cy.setInputFieldValue('Width', 'Size', '{selectall}40');

			// Assert label after set value
			cy.checkLabelClassName(
				'Size',
				'Width',
				'changed-in-secondary-state'
			);

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', 40);

			/**
			 * Tablet device
			 */
			setDeviceType('Tablet');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-normal-state');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', 50);

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {
				desktop: ['Normal', 'Hover'],
			});
		});

		it('should display changed value on Width -> Normal -> Tablet', () => {
			setDeviceType('Tablet');
			// Assert label before set value
			cy.checkLabelClassName(
				'Size',
				'Width',
				'changed-in-normal-state',
				'not-have'
			);

			// Set value
			cy.setInputFieldValue('Width', 'Size', 50);

			// Assert label after set value
			cy.checkLabelClassName('Size', 'Width', 'changed-in-normal-state');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', 50);

			/**
			 * Desktop device
			 */
			setDeviceType('Desktop');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-other-state');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', { tablet: ['Normal'] });
		});

		it('should display changed value on Width -> Hover -> Tablet', () => {
			setDeviceType('Tablet');
			/**
			 * Hover
			 */
			setBlockState('Hover');
			// Assert label before set value
			cy.checkLabelClassName(
				'Size',
				'Width',
				'changed-in-normal-state',
				'not-have'
			);

			// Set value
			cy.setInputFieldValue('Width', 'Size', 50);

			// Assert label after set value
			cy.checkLabelClassName(
				'Size',
				'Width',
				'changed-in-secondary-state'
			);
			// Assert control
			cy.checkInputFieldValue('Width', 'Size', 50);

			/**
			 * Normal
			 */
			setBlockState('Normal');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-other-state');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '');

			/**
			 * Desktop device (Active)
			 */
			setDeviceType('Desktop');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-other-state');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '');

			/**
			 * Desktop device (Normal)
			 */
			setBlockState('Normal');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-other-state');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', { tablet: ['Hover'] });
		});

		it('set value in normal/desktop and navigate between states', () => {
			// Set value
			cy.setInputFieldValue('Width', 'Size', 20);

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-normal-state');

			// Assert control
			cy.getByAriaLabel('Input Width').should('have.value', '20');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {
				desktop: ['Normal'],
			});

			// Navigate between states and devices:
			// Hover/Desktop
			setBlockState('Hover');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-normal-state');

			// Assert control
			cy.getByAriaLabel('Input Width').should('have.value', '20');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {
				desktop: ['Normal'],
			});

			// Hover/Tablet
			setDeviceType('Tablet');
			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-normal-state');

			// Assert control
			cy.getByAriaLabel('Input Width').should('have.value', '20');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {
				desktop: ['Normal'],
			});

			// Normal/Desktop
			setBlockState('Normal');
			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-normal-state');

			// Assert control
			cy.getByAriaLabel('Input Width').should('have.value', '20');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {
				desktop: ['Normal'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect('20px').to.be.deep.eq(
					getSelectedBlock(data, 'blockeraWidth')
				);

				expect(undefined).to.be.eq(
					getSelectedBlock(data, 'blockeraBlockStates')?.normal
						?.breakpoints?.tablet?.attributes
				);

				expect(undefined).to.be.eq(
					getSelectedBlock(data, 'blockeraBlockStates')?.hover
						?.breakpoints?.desktop?.attributes
				);

				expect(undefined).to.be.eq(
					getSelectedBlock(data, 'blockeraBlockStates')?.hover
						?.breakpoints?.tablet?.attributes
				);
			});
		});

		it('set value in hover/desktop and navigate between states', () => {
			setBlockState('Hover');

			// Set value
			cy.setInputFieldValue('Width', 'Size', 20);

			// Assert label
			cy.checkLabelClassName(
				'Size',
				'Width',
				'changed-in-secondary-state'
			);

			// Assert control
			cy.getByAriaLabel('Input Width').should('have.value', '20');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {
				desktop: ['Hover'],
			});

			// Navigate between states and devices:
			// Normal/Desktop
			setBlockState('Normal');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-other-state');

			// Assert control
			cy.getByAriaLabel('Input Width').should('have.value', '');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {
				desktop: ['Hover'],
			});

			// Normal/Tablet
			setDeviceType('Tablet');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-other-state');

			// Assert control
			cy.getByAriaLabel('Input Width').should('have.value', '');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {
				desktop: ['Hover'],
			});

			// Hover/Tablet
			setBlockState('Hover');
			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-other-state');

			// Assert control
			cy.getByAriaLabel('Input Width').should('have.value', '');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {
				desktop: ['Hover'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect('').to.be.deep.eq(
					getSelectedBlock(data, 'blockeraWidth')
				);
				expect(undefined).to.be.eq(
					getSelectedBlock(data, 'blockeraBlockStates')?.normal
						?.breakpoints?.tablet?.attributes
				);

				expect('20px').to.be.eq(
					getSelectedBlock(data, 'blockeraBlockStates')?.hover
						?.breakpoints?.desktop?.attributes?.blockeraWidth
				);

				expect(undefined).to.be.eq(
					getSelectedBlock(data, 'blockeraBlockStates')?.hover
						?.breakpoints?.tablet?.attributes
				);
			});
		});
	});

	describe('Reset action testing...', () => {
		it('Reset by click on the "x" icon on the label', () => {
			// Set value in normal/desktop
			cy.setInputFieldValue('Width', 'Size', 50);

			// Set value in hover/desktop
			setBlockState('Hover');
			cy.setInputFieldValue('Width', 'Size', 40);

			setBlockState('Hover');

			// reset hover value
			cy.getByAriaLabel('Width').realHover();

			cy.getParentContainer('Width').within(() => {
				cy.get('.blockera-control-reset-icon').click({ force: true });
			});

			// Assert label
			cy.checkLabelClassName(
				'Size',
				'Width',
				'changed-in-secondary-state',
				'not-have'
			);

			// Assert control
			cy.getByAriaLabel('Input Width').should('have.value', '50');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {
				desktop: ['Normal'],
			});

			setBlockState('Normal');

			cy.wait(100);

			// reset normal value
			cy.getByAriaLabel('Width').click({ shiftKey: true });

			// Assert control
			cy.getByAriaLabel('Input Width').should('have.value', '');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {});
		});

		it('Reset by hitting shift + click on label', () => {
			// Set value in normal/desktop
			cy.setInputFieldValue('Width', 'Size', 50);

			// Set value in hover/desktop
			setBlockState('Hover');
			cy.setInputFieldValue('Width', 'Size', 40);

			setBlockState('Hover');

			// reset hover value
			cy.getByAriaLabel('Width').click({ shiftKey: true });

			// Assert label
			cy.checkLabelClassName(
				'Size',
				'Width',
				'changed-in-secondary-state',
				'not-have'
			);

			// Assert control
			cy.getByAriaLabel('Input Width').should('have.value', '50');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {
				desktop: ['Normal'],
			});

			setBlockState('Normal');

			cy.wait(100);

			// reset normal value
			cy.getByAriaLabel('Width').click({ shiftKey: true });

			// Assert control
			cy.getByAriaLabel('Input Width').should('have.value', '');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {});
		});

		describe('Advanced Resetting', () => {
			beforeEach(() => {
				// Set value in normal/desktop
				cy.setInputFieldValue('Width', 'Size', 50);

				// Set value in hover/desktop
				setBlockState('Hover');
				cy.setInputFieldValue('Width', 'Size', 40);

				// Set value in hover/tablet
				setDeviceType('Tablet');
				cy.setInputFieldValue('Width', 'Size', 10);

				// Set value in normal/tablet
				setBlockState('Normal');
				cy.setInputFieldValue('Width', 'Size', 70);
			});

			it('should correctly reset blockeraWidth, and display effected fields(label, control, stateGraph) in normal/tablet', () => {
				// Reset to normal
				cy.resetBlockeraAttribute('Size', 'Width', 'reset');

				// Assert label
				cy.checkLabelClassName(
					'Size',
					'Width',
					'changed-in-normal-state'
				);

				// Assert control
				cy.getByAriaLabel('Input Width').should('have.value', '50');

				// Assert state graph
				cy.checkStateGraph('Size', 'Width', {
					tablet: ['Hover'],
					desktop: ['Hover', 'Normal'],
				});

				// Assert store data
				getWPDataObject().then((data) => {
					expect({}).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').normal
							.breakpoints.tablet.attributes
					);
				});
			});

			it('should correctly reset blockeraWidth, and display effected fields(label, control, stateGraph) in hover/tablet', () => {
				setBlockState('Hover');

				// Reset to normal
				cy.resetBlockeraAttribute('Size', 'Width', 'reset');

				// Assert label
				cy.checkLabelClassName(
					'Size',
					'Width',
					'changed-in-normal-state'
				);

				// Assert control
				cy.getByAriaLabel('Input Width').should('have.value', '50');

				// Assert state graph
				cy.checkStateGraph('Size', 'Width', {
					tablet: ['Normal'],
					desktop: ['Hover', 'Normal'],
				});

				// Assert store data
				getWPDataObject().then((data) => {
					expect({}).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').hover
							.breakpoints.tablet.attributes
					);
				});
			});

			it('should correctly reset blockeraWidth, and display effected fields(label, control, stateGraph) in normal/desktop', () => {
				setDeviceType('Desktop');
				setBlockState('Normal');
				// Reset to default
				cy.resetBlockeraAttribute('Size', 'Width', 'reset');

				// Assert label
				cy.checkLabelClassName(
					'Size',
					'Width',
					'changed-in-other-state'
				);

				// Assert control
				cy.getByAriaLabel('Input Width').should('have.value', '');

				// Assert state graph
				cy.checkStateGraph('Size', 'Width', {
					desktop: ['Hover'],
					tablet: ['Normal', 'Hover'],
				});

				// Assert store data
				getWPDataObject().then((data) => {
					expect('').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraWidth')
					);
				});
			});

			it('should correctly reset blockeraWidth, and display effected fields(label, control, stateGraph) in hover/desktop', () => {
				setDeviceType('Desktop');
				setBlockState('Hover');
				// Reset to default
				cy.resetBlockeraAttribute('Size', 'Width', 'reset');

				// Assert label
				cy.checkLabelClassName(
					'Size',
					'Width',
					'changed-in-secondary-state',
					'not-have'
				);

				// Assert control
				cy.getByAriaLabel('Input Width').should('have.value', '50');

				// Assert state graph
				cy.checkStateGraph('Size', 'Width', {
					desktop: ['Normal'],
					tablet: ['Normal', 'Hover'],
				});

				// Assert store data
				getWPDataObject().then((data) => {
					expect({}).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').hover
							.breakpoints.desktop.attributes
					);
				});
			});
		});
	});

	describe('reset-all action testing...', () => {
		it('should correctly reset-all blockeraWidth, and display effected fields(label, control, stateGraph) in all states and devices', () => {
			// Set value in normal/desktop
			cy.setInputFieldValue('Width', 'Size', 50);

			// Set value in hover/desktop
			setBlockState('Hover');
			cy.setInputFieldValue('Width', 'Size', 40);

			// Set value in hover/tablet
			setDeviceType('Tablet');
			cy.setInputFieldValue('Width', 'Size', 10);

			// Set value in normal/tablet
			setBlockState('Normal');
			cy.setInputFieldValue('Width', 'Size', 70);

			// Reset All
			cy.resetBlockeraAttribute('Size', 'Width', 'reset-all');

			// Normal/Tablet
			// Assert label
			cy.checkLabelClassName(
				'Size',
				'Width',
				'changed-in-normal-state',
				'not-have'
			);

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {});

			// Hover/Tablet
			setBlockState('Hover');
			// Assert label
			cy.checkLabelClassName(
				'Size',
				'Width',
				'changed-in-secondary-state',
				'not-have'
			);

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {});

			// Hover/Desktop
			setDeviceType('Desktop');
			// Assert label
			cy.checkLabelClassName(
				'Size',
				'Width',
				'changed-in-secondary-state',
				'not-have'
			);

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {});

			// Normal/Desktop
			setBlockState('Normal');
			// Assert label
			cy.checkLabelClassName(
				'Size',
				'Width',
				'changed-in-normal-state',
				'not-have'
			);

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {});

			// Assert store data
			getWPDataObject().then((data) => {
				expect('').to.be.deep.eq(
					getSelectedBlock(data, 'blockeraWidth')
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});
		});

		it('set value in normal/desktop and navigate between states', () => {
			// Set value
			cy.setInputFieldValue('Width', 'Size', '25');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '25');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-normal-state');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', { desktop: ['Normal'] });

			// Navigate between states and devices :
			// Hover/Desktop
			setBlockState('Hover');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '25');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-normal-state');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', { desktop: ['Normal'] });

			// Hover/Tablet
			setDeviceType('Tablet');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '25');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-normal-state');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', { desktop: ['Normal'] });

			// Normal/Tablet
			setBlockState('Normal');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '25');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-normal-state');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', { desktop: ['Normal'] });

			// Assert store data
			getWPDataObject().then((data) => {
				expect('25px').to.be.equal(
					getSelectedBlock(data, 'blockeraWidth')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates')?.normal
						?.breakpoints?.tablet?.attributes
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates')?.hover
						?.breakpoints?.desktop?.attributes
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates')?.hover
						?.breakpoints?.tablet?.attributes
				);
			});
		});

		it('set value in normal/tablet and navigate between states', () => {
			setDeviceType('Tablet');

			cy.setInputFieldValue('Width', 'Size', '25');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '25');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-normal-state');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {
				tablet: ['Normal'],
			});

			// Navigate between states and devices :
			// Hover/Tablet
			setBlockState('Hover');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-normal-state');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {
				tablet: ['Normal'],
			});

			// Hover/Desktop
			setDeviceType('Desktop');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-other-state');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {
				tablet: ['Normal'],
			});

			// Normal/Desktop
			setBlockState('Normal');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '');

			// Assert label
			cy.checkLabelClassName('Size', 'Width', 'changed-in-other-state');

			// Assert state graph
			cy.checkStateGraph('Size', 'Width', {
				tablet: ['Normal'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect('').to.be.equal(getSelectedBlock(data, 'blockeraWidth'));

				expect({ blockeraWidth: '25px' }).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates')?.hover
						?.breakpoints?.desktop?.attributes
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates')?.hover
						?.breakpoints?.tablet?.attributes
				);
			});
		});
	});
});
