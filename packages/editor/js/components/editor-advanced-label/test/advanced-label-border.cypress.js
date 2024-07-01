import {
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	createPost,
	setBlockState,
	addBlockState,
	setDeviceType,
} from '../../../../../dev-cypress/js/helpers';

describe('Border Control label testing (Border Line)', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		// Alias
		cy.getParentContainer('Border Line').within(() => {
			cy.getByDataTest('border-control-width').as('border-width');
			cy.getByDataTest('border-control-color')
				.children()
				.first()
				.as('border-color');
		});
	});

	it('should display changed value on Border Line -> Normal -> Laptop', () => {
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
			laptop: ['Normal'],
		});
	});

	it('should display changed value on Border Line -> Hover -> Laptop', () => {
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
			laptop: ['Hover'],
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
			laptop: ['Normal', 'Hover'],
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
		 * Laptop device
		 */
		setDeviceType('Laptop');

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
		 * Normal (Laptop device)
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
			// Set value in normal/laptop
			cy.get('@border-width').type(5);

			// Set value in hover/laptop
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
				laptop: ['Hover', 'Normal'],
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
				laptop: ['Hover', 'Normal'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});
		});

		it('should correctly reset blockeraBorder, and display effected fields(label, control, stateGraph) in normal/laptop', () => {
			setDeviceType('Laptop');
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
				laptop: ['Hover'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					type: 'all',
					all: { width: '', style: '', color: '' },
				}).to.be.deep.eq(getSelectedBlock(data, 'blockeraBorder'));
			});
		});

		it('should correctly reset blockeraBorder, and display effected fields(label, control, stateGraph) in hover/laptop', () => {
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
				laptop: ['Normal', 'Hover'],
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
						.breakpoints.laptop.attributes
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
			// Set value in normal/laptop
			cy.get('@border-width').type(5);

			// Set value in hover/laptop
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

					// Hover/Laptop
					setDeviceType('Laptop');
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

					// Normal/Laptop
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
								.breakpoints.laptop.attributes
						);

						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').hover
								.breakpoints.tablet.attributes
						);
					});
				}
			);
		});

		it('set value in normal/laptop and navigate between states', () => {
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
				laptop: ['Normal'],
			});

			// Navigate between states and devices
			// Hover/Laptop
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
				laptop: ['Normal'],
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
				laptop: ['Normal'],
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
				laptop: ['Normal'],
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
						.breakpoints.laptop.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});
		});

		it('set value in hover/laptop and navigate between states', () => {
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
				laptop: ['Hover'],
			});

			// Navigate between states and devices
			// Normal/Laptop
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
				laptop: ['Hover'],
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
				laptop: ['Hover'],
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
				laptop: ['Hover'],
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
						.breakpoints.laptop.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});
		});
	});
});
