import {
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	createPost,
	setBlockState,
	addBlockState,
	setDeviceType,
} from '../../../../../dev-cypress/js/helpers';

describe('Range Control label testing (Opacity)', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');
	});

	const setOpacityValue = (value) => {
		cy.getParentContainer('Opacity').within(() =>
			cy.get('input[type="range"]').setSliderValue(value)
		);
	};

	const checkOpacityValue = (value) => {
		cy.getParentContainer('Opacity').within(() =>
			cy.get('input[type="range"]').should('have.value', value)
		);
	};

	it('should display changed value on Opacity -> Normal -> Laptop', () => {
		// Assert label before set value
		cy.checkLabelClassName(
			'Effects',
			'Opacity',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		setOpacityValue(50);

		// Assert label after set value
		cy.checkLabelClassName('Effects', 'Opacity', 'changed-in-normal-state');

		// Assert control
		checkOpacityValue(50);

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName('Effects', 'Opacity', 'changed-in-normal-state');

		// Assert control
		checkOpacityValue(50);

		// Assert state graph
		cy.checkStateGraph('Effects', 'Opacity', { laptop: ['Normal'] });
	});

	it('should display changed value on Opacity -> Hover -> Laptop', () => {
		/**
		 * Hover
		 */
		addBlockState('hover');
		// Assert label before set value
		cy.checkLabelClassName(
			'Effects',
			'Opacity',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		setOpacityValue(50);

		// Assert label after set value
		cy.checkLabelClassName(
			'Effects',
			'Opacity',
			'changed-in-secondary-state'
		);
		// Assert control
		checkOpacityValue(50);

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName('Effects', 'Opacity', 'changed-in-other-state');

		// Assert control
		// 100 is default
		checkOpacityValue('100');

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName('Effects', 'Opacity', 'changed-in-other-state');

		// Assert control
		checkOpacityValue(100);

		// Assert state graph
		cy.checkStateGraph('Effects', 'Opacity', { laptop: ['Hover'] });
	});

	it('should display changed value on Opacity, when set value in two states', () => {
		/**
		 * Normal
		 */
		// Set value
		setOpacityValue(40);

		// Assert label
		cy.checkLabelClassName('Effects', 'Opacity', 'changed-in-normal-state');

		/**
		 * Hover
		 */
		addBlockState('hover');

		// Assert label before set value
		cy.checkLabelClassName('Effects', 'Opacity', 'changed-in-normal-state');

		// Set value
		setOpacityValue(30);

		// Assert label after set value
		cy.checkLabelClassName(
			'Effects',
			'Opacity',
			'changed-in-secondary-state'
		);

		// Assert control
		checkOpacityValue(30);

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName('Effects', 'Opacity', 'changed-in-normal-state');

		// Assert control
		checkOpacityValue(40);

		// Assert state graph
		cy.checkStateGraph('Effects', 'Opacity', {
			laptop: ['Normal', 'Hover'],
		});
	});

	it('should display changed value on Opacity -> Normal -> Tablet', () => {
		setDeviceType('Tablet');
		// Assert label before set value
		cy.checkLabelClassName(
			'Effects',
			'Opacity',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		setOpacityValue(50);

		// Assert label after set value
		cy.checkLabelClassName('Effects', 'Opacity', 'changed-in-normal-state');

		// Assert control
		checkOpacityValue(50);

		/**
		 * Laptop device
		 */
		setDeviceType('Laptop');

		// Assert label
		cy.checkLabelClassName('Effects', 'Opacity', 'changed-in-other-state');

		// Assert control
		checkOpacityValue(100);

		// Assert state graph
		cy.checkStateGraph('Effects', 'Opacity', { tablet: ['Normal'] });
	});

	it('should display changed value on Opacity -> Hover -> Tablet', () => {
		setDeviceType('Tablet');
		/**
		 * Hover
		 */
		addBlockState('hover');
		// Assert label before set value
		cy.checkLabelClassName(
			'Effects',
			'Opacity',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		setOpacityValue(50);

		// Assert label after set value
		cy.checkLabelClassName(
			'Effects',
			'Opacity',
			'changed-in-secondary-state'
		);
		// Assert control
		checkOpacityValue(50);

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName('Effects', 'Opacity', 'changed-in-other-state');

		// Assert control
		// 100 is default
		checkOpacityValue('100');

		/**
		 * Laptop device (Active)
		 */
		setDeviceType('Laptop');

		// Assert label
		cy.checkLabelClassName('Effects', 'Opacity', 'changed-in-other-state');

		// Assert control
		checkOpacityValue(100);

		/**
		 * Normal (Laptop device)
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName('Effects', 'Opacity', 'changed-in-other-state');

		// Assert control
		checkOpacityValue(100);

		// Assert state graph
		cy.checkStateGraph('Effects', 'Opacity', { tablet: ['Hover'] });
	});

	describe('reset action testing...', () => {
		beforeEach(() => {
			// Set value in normal/laptop
			setOpacityValue(50);
			// Set value in hover/laptop
			addBlockState('hover');
			setOpacityValue(40);
			// Set value in hover/tablet
			setDeviceType('Tablet');
			setOpacityValue(30);
			// Set value in normal/tablet
			setBlockState('Normal');
			setOpacityValue(20);

			context(
				'should correctly reset blockeraOpacity, and display effected fields(label, control, stateGraph) in normal/tablet',
				() => {
					// Reset to normal
					cy.resetBlockeraAttribute('Effects', 'Opacity', 'reset');

					// Assert label
					cy.checkLabelClassName(
						'Effects',
						'Opacity',
						'changed-in-normal-state'
					);

					// Assert control
					checkOpacityValue(50);

					// Assert state graph
					cy.checkStateGraph('Effects', 'Opacity', {
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
				}
			);

			context(
				'should correctly reset blockeraOpacity, and display effected fields(label, control, stateGraph) in hover/tablet',
				() => {
					setBlockState('Hover');
					// Reset to normal
					cy.resetBlockeraAttribute('Effects', 'Opacity', 'reset');

					// Assert label
					cy.checkLabelClassName(
						'Effects',
						'Opacity',
						'changed-in-normal-state'
					);

					// Assert control
					checkOpacityValue(50);

					// Assert state graph
					cy.checkStateGraph('Effects', 'Opacity', {
						laptop: ['Hover', 'Normal'],
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
				'should correctly reset blockeraOpacity, and display effected fields(label, control, stateGraph) in normal/laptop',
				() => {
					setDeviceType('Laptop');
					setBlockState('Normal');
					// Reset to default
					cy.resetBlockeraAttribute('Effects', 'Opacity', 'reset');

					// Assert label
					cy.checkLabelClassName(
						'Effects',
						'Opacity',
						'changed-in-other-state'
					);
					// Assert control
					checkOpacityValue(100);

					// Assert state graph
					cy.checkStateGraph('Effects', 'Opacity', {
						laptop: ['Hover'],
					});

					// Assert store data
					getWPDataObject().then((data) => {
						expect('100%').to.be.deep.eq(
							getSelectedBlock(data, 'blockeraOpacity')
						);
					});
				}
			);

			context(
				'should correctly reset blockeraOpacity, and display effected fields(label, control, stateGraph) in hover/laptop',
				() => {
					setBlockState('Hover');
					// Reset to default
					cy.resetBlockeraAttribute('Effects', 'Opacity', 'reset');

					// Assert label
					cy.checkLabelClassName(
						'Effects',
						'Opacity',
						'changed-in-secondary-state',
						'not-have'
					);

					// Assert control
					checkOpacityValue(100);

					// Assert state graph
					cy.checkStateGraph('Effects', 'Opacity', {});

					// Assert store data
					getWPDataObject().then((data) => {
						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').hover
								.breakpoints.laptop.attributes
						);
					});
				}
			);
		});

		it('set value in normal/laptop and navigate between states', () => {
			setBlockState('Normal');
			// Set value
			setOpacityValue(15);

			// Assert label
			cy.checkLabelClassName(
				'Effects',
				'Opacity',
				'changed-in-normal-state'
			);

			// Assert control
			checkOpacityValue(15);

			// Assert state graph
			cy.checkStateGraph('Effects', 'Opacity', {
				laptop: ['Normal'],
			});

			// Navigate between states :
			// Hover/Laptop
			setBlockState('Hover');
			// Assert label
			cy.checkLabelClassName(
				'Effects',
				'Opacity',
				'changed-in-normal-state'
			);

			// Assert control
			// TODO
			//checkOpacityValue(15);

			// Assert state graph
			cy.checkStateGraph('Effects', 'Opacity', {
				laptop: ['Normal'],
			});

			// Hover/Tablet
			setDeviceType('Tablet');
			// Assert label
			cy.checkLabelClassName(
				'Effects',
				'Opacity',
				'changed-in-normal-state'
			);

			// Assert control
			// TODO
			//checkOpacityValue(15);

			// Assert state graph
			// TODO
			// cy.checkStateGraph('Effects', 'Opacity', {
			// 	laptop: ['Normal'],
			// });

			// Normal/Laptop
			setBlockState('Normal');
			// Assert label
			cy.checkLabelClassName(
				'Effects',
				'Opacity',
				'changed-in-normal-state'
			);

			// Assert control
			// TODO
			//checkOpacityValue(15);

			// Assert state graph
			// TODO
			// cy.checkStateGraph('Effects', 'Opacity', {
			// 	laptop: ['Normal'],
			// });

			// Assert store data
			getWPDataObject().then((data) => {
				expect('15%').to.be.eq(
					getSelectedBlock(data, 'blockeraOpacity')
				);

				// TODO
				// expect({}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').normal
				// 		.breakpoints.tablet.attributes
				// );

				// TODO
				// expect({}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').hover
				// 		.breakpoints.laptop.attributes
				// );

				// TODO : has value (input bug)
				// expect({}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').hover
				// 		.breakpoints.tablet.attributes
				// );
			});
		});

		it('set value in hover/laptop and navigate between states', () => {
			// Set value
			setOpacityValue(35);

			// Assert label
			cy.checkLabelClassName(
				'Effects',
				'Opacity',
				'changed-in-secondary-state'
			);

			// Assert control
			checkOpacityValue(35);

			// Assert state graph
			cy.checkStateGraph('Effects', 'Opacity', {
				laptop: ['Hover'],
			});

			// Navigate between states :
			// Normal/Laptop
			setBlockState('Normal');
			// Assert label
			cy.checkLabelClassName(
				'Effects',
				'Opacity',
				'changed-in-other-state'
			);

			// Assert control
			checkOpacityValue(100);

			// Assert state graph
			cy.checkStateGraph('Effects', 'Opacity', {
				laptop: ['Hover'],
			});

			// Normal/Tablet
			setDeviceType('Tablet');
			// Assert label
			// TODO
			// cy.checkLabelClassName(
			// 	'Effects',
			// 	'Opacity',
			// 	'changed-in-other-state'
			// );

			// Assert control
			// TODO
			//checkOpacityValue(100);

			// Assert state graph
			// TODO
			// cy.checkStateGraph('Effects', 'Opacity', {
			// 	laptop: ['Hover'],
			// });

			// Hover/Tablet
			setBlockState('Hover');

			// Assert label
			// TODO
			// cy.checkLabelClassName(
			// 	'Effects',
			// 	'Opacity',
			// 	'changed-in-other-state'
			// );

			// Assert control
			// TODO
			// checkOpacityValue(100);

			// Assert state graph
			// TODO
			// cy.checkStateGraph('Effects', 'Opacity', {
			// 	laptop: ['Hover'],
			// });

			// Assert store data
			getWPDataObject().then((data) => {
				expect('100%').to.be.eq(
					getSelectedBlock(data, 'blockeraOpacity')
				);

				// TODO : has value
				// expect({}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').normal
				// 		.breakpoints.tablet.attributes
				// );

				// expect({ blockeraOpacity: '35%' }).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').hover
				// 		.breakpoints.laptop.attributes
				// );

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
			setOpacityValue(50);
			// Set value in hover/laptop
			addBlockState('hover');
			setOpacityValue(40);
			// Set value in hover/tablet
			setDeviceType('Tablet');
			setOpacityValue(30);
			// Set value in normal/tablet
			setBlockState('Normal');
			setOpacityValue(20);

			// Reset All
			cy.resetBlockeraAttribute('Effects', 'Opacity', 'reset-all');

			context(
				'should correctly reset-all blockeraOpacity, and display effected fields(label, control, stateGraph) in all states and devices',
				() => {
					// Normal/Tablet
					// Assert label
					// TODO
					// cy.checkLabelClassName(
					// 	'Effects',
					// 	'Opacity',
					// 	'changed-in-normal-state',
					// 	'not-have'
					// );

					// Assert control
					checkOpacityValue(100);

					// Assert state graph
					// TODO
					// cy.checkStateGraph('Effects', 'Opacity', {});

					// Hover/Tablet
					setBlockState('Hover');
					// Assert label
					cy.checkLabelClassName(
						'Effects',
						'Opacity',
						'changed-in-secondary-state',
						'not-have'
					);

					// Assert control
					checkOpacityValue(100);

					// Assert state graph
					// TODO
					//cy.checkStateGraph('Effects', 'Opacity', {});

					// Hover/Laptop
					setDeviceType('Laptop');
					// Assert label
					cy.checkLabelClassName(
						'Effects',
						'Opacity',
						'changed-in-secondary-state',
						'not-have'
					);

					// Assert control
					checkOpacityValue(100);

					// Assert state graph
					// TODO
					// cy.checkStateGraph('Effects', 'Opacity', {});

					// Normal/Laptop
					setBlockState('Normal');
					// Assert label
					cy.checkLabelClassName(
						'Effects',
						'Opacity',
						'changed-in-normal-state',
						'not-have'
					);

					// Assert control
					checkOpacityValue(100);

					// Assert state graph
					// TODO
					// cy.checkStateGraph('Effects', 'Opacity', {});

					// Assert store data
					getWPDataObject().then((data) => {
						// TODO
						// expect('100%').to.be.deep.eq(
						// 	getSelectedBlock(data, 'blockeraOpacity')
						// );

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
			setOpacityValue(45);

			// Assert control
			checkOpacityValue(45);

			// Assert label
			cy.checkLabelClassName(
				'Effects',
				'Opacity',
				'changed-in-normal-state'
			);

			// Assert state graph
			cy.checkStateGraph('Effects', 'Opacity', {
				laptop: ['Normal'],
			});

			// Navigate between states and devices :
			// Hover/Laptop
			setBlockState('Hover');
			// Assert control
			// TODO
			//checkOpacityValue(45);

			// Assert label
			cy.checkLabelClassName(
				'Effects',
				'Opacity',
				'changed-in-normal-state'
			);

			// Assert state graph
			cy.checkStateGraph('Effects', 'Opacity', {
				laptop: ['Normal'],
			});

			// Hover/Tablet
			setDeviceType('Tablet');
			// Assert control
			// TODO
			//checkOpacityValue(45);

			// Assert label
			cy.checkLabelClassName(
				'Effects',
				'Opacity',
				'changed-in-normal-state'
			);

			// Assert state graph
			cy.checkStateGraph('Effects', 'Opacity', {
				laptop: ['Normal'],
			});

			// Normal/Tablet
			setBlockState('Normal');
			// Assert control
			// TODO
			//checkOpacityValue(45);

			// Assert label
			cy.checkLabelClassName(
				'Effects',
				'Opacity',
				'changed-in-normal-state'
			);

			// Assert state graph
			cy.checkStateGraph('Effects', 'Opacity', {
				laptop: ['Normal'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect('45%').to.be.eq(
					getSelectedBlock(data, 'blockeraOpacity')
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
		});

		it('set value in normal/tablet and navigate between states', () => {
			setDeviceType('Tablet');
			setOpacityValue(25);

			// Assert control
			checkOpacityValue(25);

			// Assert label
			cy.checkLabelClassName(
				'Effects',
				'Opacity',
				'changed-in-normal-state'
			);

			// Assert state graph
			// TODO
			// cy.checkStateGraph('Effects', 'Opacity', {
			// 	tablet: ['Normal'],
			// });

			// Navigate between states and devices :
			// Hover/Tablet
			setBlockState('Hover');
			// Assert control
			checkOpacityValue(100);

			// Assert label
			cy.checkLabelClassName(
				'Effects',
				'Opacity',
				'changed-in-normal-state'
			);

			// Assert state graph
			// TODO
			// cy.checkStateGraph('Effects', 'Opacity', {
			// 	tablet: ['Normal'],
			// });

			// Hover/Laptop
			setDeviceType('Laptop');
			// Assert control
			checkOpacityValue(100);

			// Assert label
			// TODO
			// cy.checkLabelClassName(
			// 	'Effects',
			// 	'Opacity',
			// 	'changed-in-other-state'
			// );

			// Assert state graph
			// TODO
			// cy.checkStateGraph('Effects', 'Opacity', {
			// 	tablet: ['Normal'],
			// });

			// Normal/Laptop
			setBlockState('Normal');
			// Assert control
			checkOpacityValue(100);

			// Assert label
			// TODO
			// cy.checkLabelClassName(
			// 	'Effects',
			// 	'Opacity',
			// 	'changed-in-other-state'
			// );

			// Assert state graph
			// TODO
			// cy.checkStateGraph('Effects', 'Opacity', {
			// 	tablet: ['Normal'],
			// });

			// Assert store data
			getWPDataObject().then((data) => {
				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraOpacity')
				);

				expect({ blockeraOpacity: '25%' }).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes
				);

				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.laptop.attributes
				);

				// TODO
				// expect({}).to.be.deep.equal(
				// 	getSelectedBlock(data, 'blockeraBlockStates').hover
				// 		.breakpoints.tablet.attributes
				// );
			});
		});
	});
});
