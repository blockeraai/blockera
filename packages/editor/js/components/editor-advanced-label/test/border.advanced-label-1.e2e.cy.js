import {
	getWPDataObject,
	getSelectedBlock,
	createPost,
	setBlockState,
	addBlockState,
	setDeviceType,
} from '@blockera/dev-cypress/js/helpers';

describe('Border Control label testing (Border Line)', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();

		// Alias
		cy.getParentContainer('Border Line').within(() => {
			cy.getByDataTest('border-control-width').as('border-width');
			cy.getByDataTest('border-control-color')
				.children()
				.first()
				.as('border-color');
		});
	});

	it('should display changed value on Border Line -> Normal -> Desktop', () => {
		// Assert label before set value
		cy.checkLabelClassName(
			'Border And Shadow',
			'Border Line',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		cy.get('@border-width').type(5);

		// Assert label after set value
		cy.checkLabelClassName(
			'Border And Shadow',
			'Border Line',
			'changed-in-normal-state'
		);

		// Assert control
		cy.get('@border-width').should('have.value', '5');

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName(
			'Border And Shadow',
			'Border Line',
			'changed-in-normal-state'
		);

		// Assert control
		cy.get('@border-width').should('have.value', '5');

		// Assert state graph
		cy.checkStateGraph('Border And Shadow', 'Border Line', {
			desktop: ['Normal'],
		});
	});

	it('should display changed value on Border Line -> Hover -> Desktop', () => {
		/**
		 * Hover
		 */
		addBlockState('hover');

		// Assert label before set value
		cy.checkLabelClassName(
			'Border And Shadow',
			'Border Line',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		cy.setColorControlValue('Border Line', 'ccc');

		// Assert label after set value
		cy.checkLabelClassName(
			'Border And Shadow',
			'Border Line',
			'changed-in-secondary-state'
		);
		// Assert control
		cy.get('@border-color').should(
			'have.css',
			'background-color',
			'rgb(204, 204, 204)'
		);

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName(
			'Border And Shadow',
			'Border Line',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@border-color').should(
			'not.have.css',
			'background-color',
			'rgb(204, 204, 204)'
		);

		// Assert state graph
		cy.checkStateGraph('Border And Shadow', 'Border Line', {
			desktop: ['Hover'],
		});
	});

	it('should display changed value on Border Line, when set value in two states', () => {
		/**
		 * Normal
		 */
		// Set value
		cy.get('@border-width').type(5);
		cy.setColorControlValue('Border Line', 'ccc');

		// Assert label
		cy.checkLabelClassName(
			'Border And Shadow',
			'Border Line',
			'changed-in-normal-state'
		);

		// Clear input and assert label : should still display changed status
		cy.get('@border-width').clear();
		cy.checkLabelClassName(
			'Border And Shadow',
			'Border Line',
			'changed-in-normal-state'
		);

		/**
		 * Hover
		 */
		addBlockState('hover');

		// Assert label before set value
		cy.checkLabelClassName(
			'Border And Shadow',
			'Border Line',
			'changed-in-normal-state'
		);

		// Set value
		cy.get('@border-width').type(10);

		// Assert label after set value
		cy.checkLabelClassName(
			'Border And Shadow',
			'Border Line',
			'changed-in-secondary-state'
		);

		// Assert control
		cy.get('@border-width').should('have.value', 10);
		cy.get('@border-color').should(
			'have.css',
			'background-color',
			'rgb(204, 204, 204)'
		);

		// Assert state graph
		cy.checkStateGraph('Border And Shadow', 'Border Line', {
			desktop: ['Normal', 'Hover'],
		});
	});

	it('should display changed value on Border Line -> Normal -> Tablet', () => {
		setDeviceType('Tablet');
		// Assert label before set value
		cy.checkLabelClassName(
			'Border And Shadow',
			'Border Line',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		cy.get('@border-width').type(5);

		// Assert label after set value
		cy.checkLabelClassName(
			'Border And Shadow',
			'Border Line',
			'changed-in-normal-state'
		);

		// Assert control
		cy.get('@border-width').should('have.value', 5);

		/**
		 * Desktop device
		 */
		setDeviceType('Desktop');

		// Assert label
		cy.checkLabelClassName(
			'Border And Shadow',
			'Border Line',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@border-width').should('have.value', '');

		// Assert state graph
		cy.checkStateGraph('Border And Shadow', 'Border Line', {
			tablet: ['Normal'],
		});
	});

	it('should display changed value on Border Line -> Hover -> Tablet', () => {
		setDeviceType('Tablet');
		/**
		 * Hover
		 */
		addBlockState('hover');
		// Assert label before set value
		cy.checkLabelClassName(
			'Border And Shadow',
			'Border Line',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		cy.get('@border-width').type(5);

		// Assert label after set value
		cy.checkLabelClassName(
			'Border And Shadow',
			'Border Line',
			'changed-in-secondary-state'
		);
		// Assert control
		cy.get('@border-width').type('have.value', 5);

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName(
			'Border And Shadow',
			'Border Line',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@border-width').type('have.value', '');

		/**
		 * Normal (Desktop device)
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName(
			'Border And Shadow',
			'Border Line',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@border-width').type('have.value', '');

		// Assert state graph
		cy.checkStateGraph('Border And Shadow', 'Border Line', {
			tablet: ['Hover'],
		});
	});

	describe('reset action testing...', () => {
		beforeEach(() => {
			// Set value in normal/desktop
			cy.get('@border-width').type(5);

			// Set value in hover/desktop
			addBlockState('hover');
			cy.get('@border-width').type('{selectall}4');

			// Set value in hover/tablet
			setDeviceType('Tablet');
			cy.get('@border-width').type('{selectall}3');

			// Set value in normal/tablet
			setBlockState('Normal');
			cy.get('@border-width').type('{selectall}2');
		});

		it('should correctly reset blockeraBorder, and display effected fields(label, control, stateGraph) in normal/tablet', () => {
			// Reset to normal
			cy.resetBlockeraAttribute(
				'Border And Shadow',
				'Border Line',
				'reset'
			);

			// Assert label
			cy.checkLabelClassName(
				'Border And Shadow',
				'Border Line',
				'changed-in-normal-state'
			);

			// Assert control
			cy.get('@border-width').should('have.value', 5);

			// Assert state graph
			cy.checkStateGraph('Border And Shadow', 'Border Line', {
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

		it('should correctly reset blockeraBorder, and display effected fields(label, control, stateGraph) in hover/tablet', () => {
			setBlockState('Hover');
			// Reset to normal
			cy.resetBlockeraAttribute(
				'Border And Shadow',
				'Border Line',
				'reset'
			);

			// Assert label
			cy.checkLabelClassName(
				'Border And Shadow',
				'Border Line',
				'changed-in-normal-state'
			);

			// Assert control
			cy.get('@border-width').should('have.value', 5);

			// Assert state graph
			cy.checkStateGraph('Border And Shadow', 'Border Line', {
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

		it('should correctly reset blockeraBorder, and display effected fields(label, control, stateGraph) in normal/desktop', () => {
			setDeviceType('Desktop');
			// Reset to default
			cy.resetBlockeraAttribute(
				'Border And Shadow',
				'Border Line',
				'reset'
			);

			// Assert label
			cy.checkLabelClassName(
				'Border And Shadow',
				'Border Line',
				'changed-in-other-state'
			);

			// Assert control
			cy.get('@border-width').should('have.value', '');

			// Assert state graph
			cy.checkStateGraph('Border And Shadow', 'Border Line', {
				tablet: ['Normal', 'Hover'],
				desktop: ['Hover'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					type: 'all',
					all: { width: '', style: '', color: '' },
				}).to.be.deep.eq(getSelectedBlock(data, 'blockeraBorder'));
			});
		});

		it('should correctly reset blockeraBorder, and display effected fields(label, control, stateGraph) in hover/desktop', () => {
			setBlockState('Hover');
			// Reset to normal
			cy.resetBlockeraAttribute(
				'Border And Shadow',
				'Border Line',
				'reset'
			);

			// Assert label
			cy.checkLabelClassName(
				'Border And Shadow',
				'Border Line',
				'changed-in-secondary-state',
				'not-have'
			);

			// Assert control
			cy.get('@border-width').should('have.value', '5');

			// Assert state graph
			cy.checkStateGraph('Border And Shadow', 'Border Line', {
				tablet: ['Normal'],
				desktop: ['Normal', 'Hover'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					blockeraBorder: {
						type: 'all',
						all: {
							width: '4px',
							style: '',
							color: '',
						},
					},
				}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes
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
			cy.get('@border-width').type(5);

			// Set value in hover/desktop
			addBlockState('hover');
			cy.get('@border-width').type('{selectall}4');

			// Set value in hover/tablet
			setDeviceType('Tablet');
			cy.get('@border-width').type('{selectall}3');

			// Set value in normal/tablet
			setBlockState('Normal');
			cy.get('@border-width').type('{selectall}2');

			// Reset All
			cy.resetBlockeraAttribute(
				'Border And Shadow',
				'Border Line',
				'reset-all'
			);

			context(
				'should correctly reset blockeraBorder, and display effected fields(label, control, stateGraph) in all states',
				() => {
					// Normal/Tablet
					// Assert label
					cy.checkLabelClassName(
						'Border And Shadow',
						'Border Line',
						'changed-in-normal-state',
						'not-have'
					);

					// Assert control
					cy.get('@border-width').should('have.value', '');

					// Assert state graph
					cy.checkStateGraph('Border And Shadow', 'Border Line', {});

					// Hover/Tablet
					setBlockState('Hover');
					// Assert label
					cy.checkLabelClassName(
						'Border And Shadow',
						'Border Line',
						'changed-in-secondary-state',
						'not-have'
					);

					// Assert control
					cy.get('@border-width').should('have.value', '');

					// Assert state graph
					cy.checkStateGraph('Border And Shadow', 'Border Line', {});

					// Hover/Desktop
					setDeviceType('Desktop');
					// Assert label
					cy.checkLabelClassName(
						'Border And Shadow',
						'Border Line',
						'changed-in-secondary-state',
						'not-have'
					);

					// Assert control
					cy.get('@border-width').should('have.value', '');

					// Assert state graph
					cy.checkStateGraph('Border And Shadow', 'Border Line', {});

					// Normal/Desktop
					setBlockState('Normal');
					// Assert label
					cy.checkLabelClassName(
						'Border And Shadow',
						'Border Line',
						'changed-in-normal-state',
						'not-have'
					);

					// Assert control
					cy.get('@border-width').should('have.value', '');

					// Assert state graph
					cy.checkStateGraph('Border And Shadow', 'Border Line', {});

					// Assert store data
					getWPDataObject().then((data) => {
						expect({
							type: 'all',
							all: {
								width: '',
								style: '',
								color: '',
							},
						}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBorder')
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
			cy.get('@border-width').type('{selectall}12');

			// Assert label
			cy.checkLabelClassName(
				'Border And Shadow',
				'Border Line',
				'changed-in-normal-state'
			);

			// Assert control
			cy.get('@border-width').should('have.value', '12');

			// Assert state graph
			cy.checkStateGraph('Border And Shadow', 'Border Line', {
				desktop: ['Normal'],
			});

			// Navigate between states and devices
			// Hover/Desktop
			setBlockState('Hover');
			// Assert label
			cy.checkLabelClassName(
				'Border And Shadow',
				'Border Line',
				'changed-in-normal-state'
			);

			// Assert control
			cy.get('@border-width').should('have.value', '12');

			// Assert state graph
			cy.checkStateGraph('Border And Shadow', 'Border Line', {
				desktop: ['Normal'],
			});

			// Hover/Tablet
			setDeviceType('Tablet');
			// Assert label
			cy.checkLabelClassName(
				'Border And Shadow',
				'Border Line',
				'changed-in-normal-state'
			);

			// Assert control
			cy.get('@border-width').should('have.value', '12');

			// Assert state graph
			cy.checkStateGraph('Border And Shadow', 'Border Line', {
				desktop: ['Normal'],
			});

			// Normal/Tablet
			setBlockState('Normal');
			// Assert label
			cy.checkLabelClassName(
				'Border And Shadow',
				'Border Line',
				'changed-in-normal-state'
			);

			// Assert control
			cy.get('@border-width').should('have.value', '12');

			// Assert state graph
			cy.checkStateGraph('Border And Shadow', 'Border Line', {
				desktop: ['Normal'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					type: 'all',
					all: { style: '', color: '', width: '12px' },
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraBorder'));

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
			setBlockState('Hover');

			cy.get('@border-width').type('{selectall}15');

			// Assert label
			cy.checkLabelClassName(
				'Border And Shadow',
				'Border Line',
				'changed-in-secondary-state'
			);

			// Assert control
			cy.get('@border-width').should('have.value', '15');

			// Assert state graph
			cy.checkStateGraph('Border And Shadow', 'Border Line', {
				desktop: ['Hover'],
			});

			// Navigate between states and devices
			// Normal/Desktop
			setBlockState('Normal');
			// Assert label
			cy.checkLabelClassName(
				'Border And Shadow',
				'Border Line',
				'changed-in-other-state'
			);

			// Assert control
			cy.get('@border-width').should('have.value', '');

			// Assert state graph
			cy.checkStateGraph('Border And Shadow', 'Border Line', {
				desktop: ['Hover'],
			});

			// Normal/Tablet
			setDeviceType('Tablet');
			// Assert label
			cy.checkLabelClassName(
				'Border And Shadow',
				'Border Line',
				'changed-in-other-state'
			);

			// Assert control
			cy.get('@border-width').should('have.value', '');

			// Assert state graph
			cy.checkStateGraph('Border And Shadow', 'Border Line', {
				desktop: ['Hover'],
			});

			// Hover/Tablet
			setBlockState('Hover');
			// Assert label
			cy.checkLabelClassName(
				'Border And Shadow',
				'Border Line',
				'changed-in-other-state'
			);

			// Assert control
			cy.get('@border-width').should('have.value', '');

			// Assert state graph
			cy.checkStateGraph('Border And Shadow', 'Border Line', {
				desktop: ['Hover'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					type: 'all',
					all: { style: '', width: '', color: '' },
				}).to.be.deep.eq(getSelectedBlock(data, 'blockeraBorder'));

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes
				);

				expect({
					blockeraBorder: {
						type: 'all',
						all: { style: '', width: '15px', color: '' },
					},
				}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});
		});
	});
});
