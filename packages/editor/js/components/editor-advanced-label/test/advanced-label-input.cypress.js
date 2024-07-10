import {
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	createPost,
	setBlockState,
	addBlockState,
	setDeviceType,
} from '../../../../../dev-cypress/js/helpers';

describe('Input Control label testing (Width)', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');
	});

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
		addBlockState('hover');

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
		addBlockState('hover');
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
		cy.checkLabelClassName('Size', 'Width', 'changed-in-secondary-state');
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
		addBlockState('hover');

		// Assert label before set value
		cy.checkLabelClassName('Size', 'Width', 'changed-in-normal-state');

		// Set value
		cy.setInputFieldValue('Width', 'Size', '{selectall}40');

		// Assert label after set value
		cy.checkLabelClassName('Size', 'Width', 'changed-in-secondary-state');

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
		addBlockState('hover');
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
		cy.checkLabelClassName('Size', 'Width', 'changed-in-secondary-state');
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

	describe('reset action testing...', () => {
		beforeEach(() => {
			// Set value in normal/desktop
			cy.setInputFieldValue('Width', 'Size', 50);

			// Set value in hover/desktop
			addBlockState('hover');
			cy.setInputFieldValue('Width', 'Size', 40);

			// Set value in hover/tablet
			setDeviceType('Tablet');
			cy.setInputFieldValue('Width', 'Size', 10);

			// Set value in normal/tablet
			setBlockState('Normal');
			cy.setInputFieldValue('Width', 'Size', 70);

			context(
				'should correctly reset blockeraWidth, and display effected fields(label, control, stateGraph) in normal/tablet',
				() => {
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
				}
			);

			context(
				'should correctly reset blockeraWidth, and display effected fields(label, control, stateGraph) in hover/tablet',
				() => {
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
						desktop: ['Hover', 'Normal'],
					});

					// Assert store data
					getWPDataObject().then((data) => {
						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').hover
								.breakpoints.tablet.attributes
						);
					});
				}
			);

			context(
				'should correctly reset blockeraWidth, and display effected fields(label, control, stateGraph) in normal/desktop',
				() => {
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
					});

					// Assert store data
					getWPDataObject().then((data) => {
						expect('').to.be.deep.eq(
							getSelectedBlock(data, 'blockeraWidth')
						);
					});
				}
			);

			context(
				'should correctly reset blockeraWidth, and display effected fields(label, control, stateGraph) in hover/desktop',
				() => {
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
					cy.getByAriaLabel('Input Width').should('have.value', '');

					// Assert state graph
					cy.checkStateGraph('Size', 'Width', {});

					// Assert store data
					getWPDataObject().then((data) => {
						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').hover
								.breakpoints.desktop.attributes
						);
					});
				}
			);
		});

		it('set value in normal/desktop and navigate between states', () => {
			setBlockState('Normal');
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

		it('set value in hover/desktop and navigate between states', () => {
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
				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes
				);

				expect('20px').to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes.blockeraWidth
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});
		});
	});

	describe('reset-all action testing...', () => {
		beforeEach(() => {
			// Set value in normal/desktop
			cy.setInputFieldValue('Width', 'Size', 50);

			// Set value in hover/desktop
			addBlockState('hover');
			cy.setInputFieldValue('Width', 'Size', 40);

			// Set value in hover/tablet
			setDeviceType('Tablet');
			cy.setInputFieldValue('Width', 'Size', 10);

			// Set value in normal/tablet
			setBlockState('Normal');
			cy.setInputFieldValue('Width', 'Size', 70);

			// Reset All
			cy.resetBlockeraAttribute('Size', 'Width', 'reset-all');

			context(
				'should correctly reset-all blockeraWidth, and display effected fields(label, control, stateGraph) in all states and devices',
				() => {
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
				}
			);
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

				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes
				);

				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes
				);

				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
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

				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes
				);

				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});
		});
	});
});
