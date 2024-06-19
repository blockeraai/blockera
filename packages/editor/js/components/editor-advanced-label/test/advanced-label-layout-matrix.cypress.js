import {
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	createPost,
	setBlockState,
	addBlockState,
	setDeviceType,
} from '../../../../../dev-cypress/js/helpers';

describe('Layout Matrix Control label testing (Flex Layout)', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		// Set display
		cy.getByAriaLabel('Flex').click();
	});

	const setMatrixItem = (item) => {
		cy.getByDataTest('layout-matrix').within(() =>
			cy.getByDataTest(item).click()
		);
	};

	const checkMatrixItem = (item) => {
		cy.getByDataTest('layout-matrix').within(() =>
			cy.getByDataTest(item).should('exist')
		);
	};

	it('should display changed value on Flex Layout -> Normal -> Laptop', () => {
		// Assert label before set value
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		setMatrixItem('matrix-top-center-normal');

		// Assert label after set value
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-normal-state'
		);

		// Assert control
		checkMatrixItem('matrix-top-center-selected');

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-normal-state'
		);

		// Assert control
		checkMatrixItem('matrix-top-center-selected');

		// Assert state graph
		cy.checkStateGraph('Layout', 'Flex Layout', {
			laptop: ['Normal'],
		});
	});

	it('should display changed value on Flex Layout -> Hover -> Laptop', () => {
		/**
		 * Hover
		 */
		addBlockState('hover');

		// Assert label before set value
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		setMatrixItem('matrix-top-center-normal');

		// Assert label after set value
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-secondary-state'
		);
		// Assert control
		checkMatrixItem('matrix-top-center-selected');

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-other-state'
		);

		// Assert control
		// not selected
		checkMatrixItem('matrix-top-center-normal');

		/**
		 * Active
		 */
		addBlockState('active');

		// Assert label
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-other-state'
		);

		// Assert control
		// not selected
		checkMatrixItem('matrix-top-center-normal');

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-other-state'
		);

		// Assert control
		// not selected
		checkMatrixItem('matrix-top-center-normal');

		// Assert state graph
		cy.checkStateGraph('Layout', 'Flex Layout', { laptop: ['Hover'] });
	});

	it('should display changed value on Flex Layout, when set value in two states', () => {
		/**
		 * Normal
		 */
		// Set value
		setMatrixItem('matrix-top-center-normal');

		// Assert label
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-normal-state'
		);

		/**
		 * Hover
		 */
		addBlockState('hover');

		// Assert label before set value
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-normal-state'
		);

		// Set value
		setMatrixItem('matrix-bottom-center-normal');

		// Assert label after set value
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-secondary-state'
		);

		// Assert control
		checkMatrixItem('matrix-bottom-center-selected');

		/**
		 * Active
		 */
		addBlockState('active');

		// Assert label
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-normal-state'
		);

		// Assert control
		// TODO: related to layout bug -> unCommit after BlockComponent removed in layout extension
		//checkMatrixItem('matrix-top-center-selected');

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-normal-state'
		);

		// Assert control
		checkMatrixItem('matrix-top-center-selected');

		// Assert state graph
		cy.checkStateGraph('Layout', 'Flex Layout', {
			laptop: ['Normal', 'Hover'],
		});
	});

	it('should display changed value on Flex Layout -> Normal -> Tablet', () => {
		setDeviceType('Tablet');
		// Assert label before set value
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		setMatrixItem('matrix-top-center-normal');

		// Assert label after set value
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-normal-state'
		);

		// Assert control
		checkMatrixItem('matrix-top-center-selected');

		/**
		 * Laptop device
		 */
		setDeviceType('Laptop');

		// Assert label
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-other-state'
		);

		// Assert control
		// not selected
		checkMatrixItem('matrix-top-center-normal');

		// Assert state graph
		cy.checkStateGraph('Layout', 'Flex Layout', { tablet: ['Normal'] });
	});

	it('should display changed value on Flex Layout -> Hover -> Tablet', () => {
		setDeviceType('Tablet');
		/**
		 * Hover
		 */
		addBlockState('hover');
		// Assert label before set value
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		setMatrixItem('matrix-top-center-normal');

		// Assert label after set value
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-secondary-state'
		);
		// Assert control
		checkMatrixItem('matrix-top-center-selected');

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-other-state'
		);

		// Assert control
		// not selected
		checkMatrixItem('matrix-top-center-normal');

		/**
		 * Active
		 */
		addBlockState('active');

		// Assert label
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-other-state'
		);

		// Assert control
		// not selected
		checkMatrixItem('matrix-top-center-normal');

		/**
		 * Laptop device (Active)
		 */
		setDeviceType('Laptop');

		// Assert label
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-other-state'
		);

		// Assert control
		// not selected
		checkMatrixItem('matrix-top-center-normal');

		/**
		 * Normal (Laptop device)
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName(
			'Layout',
			'Flex Layout',
			'changed-in-other-state'
		);

		// Assert control
		// not selected
		checkMatrixItem('matrix-top-center-normal');

		// Assert state graph
		cy.checkStateGraph('Layout', 'Flex Layout', { tablet: ['Hover'] });
	});

	describe('reset action testing...', () => {
		beforeEach(() => {
			// Set value in normal/laptop
			setMatrixItem('matrix-top-left-normal');

			// Set value in hover/laptop
			addBlockState('hover');
			setMatrixItem('matrix-top-center-normal');

			// Set value in hover/tablet
			setDeviceType('Tablet');
			setMatrixItem('matrix-top-right-normal');

			// Set value in normal/tablet
			setBlockState('Normal');
			setMatrixItem('matrix-center-center-normal');

			context(
				'should correctly reset blockeraFlexLayout, and display effected fields(label, control, stateGraph) in normal/tablet',
				() => {
					// Reset to normal
					cy.resetBlockeraAttribute('Layout', 'Flex Layout', 'reset');

					// Assert label
					cy.checkLabelClassName(
						'Layout',
						'Flex Layout',
						'changed-in-normal-state'
					);

					// Assert control
					checkMatrixItem('matrix-top-left-selected');

					// Assert state graph
					cy.checkStateGraph('Layout', 'Flex Layout', {
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
				'should correctly reset blockeraFlexLayout, and display effected fields(label, control, stateGraph) in hover/tablet',
				() => {
					setBlockState('Hover');
					// Reset to normal
					cy.resetBlockeraAttribute('Layout', 'Flex Layout', 'reset');

					// Assert label
					cy.checkLabelClassName(
						'Layout',
						'Flex Layout',
						'changed-in-normal-state'
					);

					// Assert control
					checkMatrixItem('matrix-top-left-selected');

					// Assert state graph
					cy.checkStateGraph('Layout', 'Flex Layout', {
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
				'should correctly reset blockeraFlexLayout, and display effected fields(label, control, stateGraph) in normal/laptop',
				() => {
					setDeviceType('Laptop');
					setBlockState('Normal');
					// Reset to default
					cy.resetBlockeraAttribute('Layout', 'Flex Layout', 'reset');

					// Assert label
					cy.checkLabelClassName(
						'Layout',
						'Flex Layout',
						'changed-in-other-state'
					);

					// Assert control
					checkMatrixItem('matrix-top-left-normal');

					// Assert state graph
					cy.checkStateGraph('Layout', 'Flex Layout', {
						laptop: ['Hover'],
					});

					// Assert store data
					getWPDataObject().then((data) => {
						expect({
							direction: 'row',
							alignItems: '',
							justifyContent: '',
						}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraFlexLayout')
						);
					});
				}
			);

			context(
				'should correctly reset blockeraFlexLayout, and display effected fields(label, control, stateGraph) in hover/laptop',
				() => {
					setBlockState('Hover');
					// Reset to normal
					cy.resetBlockeraAttribute('Layout', 'Flex Layout', 'reset');

					// Assert label
					cy.checkLabelClassName(
						'Layout',
						'Flex Layout',
						'changed-in-secondary-state',
						'not-have'
					);

					// Assert control
					checkMatrixItem('matrix-top-center-normal');

					// Assert state graph
					cy.checkStateGraph('Layout', 'Flex Layout', {});

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
			setMatrixItem('matrix-bottom-left-normal');

			// Assert label
			cy.checkLabelClassName(
				'Layout',
				'Flex Layout',
				'changed-in-normal-state'
			);

			// Assert control
			checkMatrixItem('matrix-bottom-left-selected');

			// Assert state graph
			cy.checkStateGraph('Layout', 'Flex Layout', {
				laptop: ['Normal'],
			});

			// Navigate between states and devices
			// Hover/Laptop
			setBlockState('Hover');
			// Assert label
			cy.checkLabelClassName(
				'Layout',
				'Flex Layout',
				'changed-in-normal-state'
			);

			// Assert control
			// TODO
			//checkMatrixItem('matrix-bottom-left-selected');

			// Assert state graph
			cy.checkStateGraph('Layout', 'Flex Layout', {
				laptop: ['Normal'],
			});

			// Hover/Tablet
			setDeviceType('Tablet');
			// Assert label
			cy.checkLabelClassName(
				'Layout',
				'Flex Layout',
				'changed-in-normal-state'
			);

			// Assert control
			// TODO
			//checkMatrixItem('matrix-bottom-left-selected');

			// Assert state graph
			cy.checkStateGraph('Layout', 'Flex Layout', {
				laptop: ['Normal'],
			});

			// Normal/Tablet
			setBlockState('Normal');
			// Assert label
			cy.checkLabelClassName(
				'Layout',
				'Flex Layout',
				'changed-in-normal-state'
			);
			// Assert control
			// TODO
			//checkMatrixItem('matrix-bottom-left-selected');

			// Assert state graph
			cy.checkStateGraph('Layout', 'Flex Layout', {
				laptop: ['Normal'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					direction: 'row',
					alignItems: 'flex-end',
					justifyContent: 'flex-start',
				}).to.be.deep.eq(getSelectedBlock(data, 'blockeraFlexLayout'));

				// TODO
				// expect({}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').normal
				// 		.breakpoints.tablet.attributes
				// );

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.laptop.attributes
				);

				// TODO
				// expect({}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').hover
				// 		.breakpoints.tablet.attributes
				// );
			});
		});

		it('set value in hover/laptop and navigate between states', () => {
			setMatrixItem('matrix-bottom-right-normal');

			// Assert label
			cy.checkLabelClassName(
				'Layout',
				'Flex Layout',
				'changed-in-secondary-state'
			);

			// Assert control
			checkMatrixItem('matrix-bottom-right-selected');

			// Assert state graph
			cy.checkStateGraph('Layout', 'Flex Layout', {
				laptop: ['Hover'],
			});

			// Navigate between states and devices:
			// Normal/Laptop
			setBlockState('Normal');
			// Assert label
			cy.checkLabelClassName(
				'Layout',
				'Flex Layout',
				'changed-in-other-state'
			);

			// Assert control
			checkMatrixItem('matrix-top-left-normal');
			checkMatrixItem('matrix-top-center-normal');
			checkMatrixItem('matrix-top-right-normal');
			checkMatrixItem('matrix-center-left-normal');
			checkMatrixItem('matrix-center-center-normal');
			checkMatrixItem('matrix-center-right-normal');
			checkMatrixItem('matrix-bottom-left-normal');
			checkMatrixItem('matrix-bottom-center-normal');
			checkMatrixItem('matrix-bottom-right-normal');

			// Assert state graph
			cy.checkStateGraph('Layout', 'Flex Layout', {
				laptop: ['Hover'],
			});

			// Normal/Tablet
			setDeviceType('Tablet');
			// Assert label
			cy.checkLabelClassName(
				'Layout',
				'Flex Layout',
				'changed-in-other-state'
			);

			// Assert control
			// TODO
			//checkMatrixItem('matrix-top-left-normal');
			checkMatrixItem('matrix-top-center-normal');
			checkMatrixItem('matrix-top-right-normal');
			checkMatrixItem('matrix-center-left-normal');
			checkMatrixItem('matrix-center-center-normal');
			checkMatrixItem('matrix-center-right-normal');
			checkMatrixItem('matrix-bottom-left-normal');
			checkMatrixItem('matrix-bottom-center-normal');
			checkMatrixItem('matrix-bottom-right-normal');

			// Assert state graph
			cy.checkStateGraph('Layout', 'Flex Layout', {
				laptop: ['Hover'],
			});

			// Hover/Tablet
			setBlockState('Hover');
			// Assert label
			cy.checkLabelClassName(
				'Layout',
				'Flex Layout',
				'changed-in-other-state'
			);

			// Assert control
			// TODO
			//checkMatrixItem('matrix-top-left-normal');
			checkMatrixItem('matrix-top-center-normal');
			checkMatrixItem('matrix-top-right-normal');
			checkMatrixItem('matrix-center-left-normal');
			checkMatrixItem('matrix-center-center-normal');
			checkMatrixItem('matrix-center-right-normal');
			checkMatrixItem('matrix-bottom-left-normal');
			checkMatrixItem('matrix-bottom-center-normal');
			checkMatrixItem('matrix-bottom-right-normal');

			// Assert state graph
			cy.checkStateGraph('Layout', 'Flex Layout', {
				laptop: ['Hover'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					direction: 'row',
					alignItems: '',
					justifyContent: '',
				}).to.be.deep.eq(getSelectedBlock(data, 'blockeraFlexLayout'));

				// TODO
				// expect({}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').normal
				// 		.breakpoints.tablet.attributes
				// );

				expect({
					blockeraFlexLayout: {
						direction: 'row',
						alignItems: 'flex-end',
						justifyContent: 'flex-end',
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
			setMatrixItem('matrix-top-left-normal');

			// Set value in hover/laptop
			addBlockState('hover');
			setMatrixItem('matrix-top-center-normal');

			// Set value in hover/tablet
			setDeviceType('Tablet');
			setMatrixItem('matrix-top-right-normal');

			// Set value in normal/tablet
			setBlockState('Normal');
			setMatrixItem('matrix-center-left-normal');

			// Reset All
			cy.resetBlockeraAttribute('Layout', 'Flex Layout', 'reset-all');

			context(
				'should correctly reset blockeraFlexLayout, and display effected fields(label, control, stateGraph) in all states',
				() => {
					// Normal/Tablet
					// Assert label
					cy.checkLabelClassName(
						'Layout',
						'Flex Layout',
						'changed-in-normal-state',
						'not-have'
					);

					// Assert control
					checkMatrixItem('matrix-top-left-normal');
					checkMatrixItem('matrix-top-center-normal');
					checkMatrixItem('matrix-top-right-normal');
					checkMatrixItem('matrix-center-left-normal');
					checkMatrixItem('matrix-center-center-normal');
					checkMatrixItem('matrix-center-right-normal');
					checkMatrixItem('matrix-bottom-left-normal');
					checkMatrixItem('matrix-bottom-center-normal');
					checkMatrixItem('matrix-bottom-right-normal');

					// Assert state graph
					cy.checkStateGraph('Layout', 'Flex Layout', {});

					// Hover/Tablet
					setBlockState('Hover');
					// Assert label
					cy.checkLabelClassName(
						'Layout',
						'Flex Layout',
						'changed-in-secondary-state',
						'not-have'
					);

					// Assert control
					checkMatrixItem('matrix-top-left-normal');
					checkMatrixItem('matrix-top-center-normal');
					checkMatrixItem('matrix-top-right-normal');
					checkMatrixItem('matrix-center-left-normal');
					checkMatrixItem('matrix-center-center-normal');
					checkMatrixItem('matrix-center-right-normal');
					checkMatrixItem('matrix-bottom-left-normal');
					checkMatrixItem('matrix-bottom-center-normal');
					checkMatrixItem('matrix-bottom-right-normal');

					// Assert state graph
					cy.checkStateGraph('Layout', 'Flex Layout', {});

					// Hover/Laptop
					setDeviceType('Laptop');
					// Assert label
					cy.checkLabelClassName(
						'Layout',
						'Flex Layout',
						'changed-in-secondary-state',
						'not-have'
					);

					// Assert control
					// TODO
					checkMatrixItem('matrix-top-left-normal');
					checkMatrixItem('matrix-top-center-normal');
					checkMatrixItem('matrix-top-right-normal');
					checkMatrixItem('matrix-center-left-normal');
					checkMatrixItem('matrix-center-center-normal');
					checkMatrixItem('matrix-center-right-normal');
					checkMatrixItem('matrix-bottom-left-normal');
					checkMatrixItem('matrix-bottom-center-normal');
					checkMatrixItem('matrix-bottom-right-normal');

					// Assert state graph
					cy.checkStateGraph('Layout', 'Flex Layout', {});

					// Normal/Laptop
					setBlockState('Normal');
					// Assert label
					cy.checkLabelClassName(
						'Layout',
						'Flex Layout',
						'changed-in-normal-state',
						'not-have'
					);

					// Assert control
					// TODO
					checkMatrixItem('matrix-top-left-normal');
					checkMatrixItem('matrix-top-center-normal');
					checkMatrixItem('matrix-top-right-normal');
					checkMatrixItem('matrix-center-left-normal');
					checkMatrixItem('matrix-center-center-normal');
					checkMatrixItem('matrix-center-right-normal');
					checkMatrixItem('matrix-bottom-left-normal');
					checkMatrixItem('matrix-bottom-center-normal');
					checkMatrixItem('matrix-bottom-right-normal');

					// Assert state graph
					cy.checkStateGraph('Layout', 'Flex Layout', {});

					// Assert store data
					getWPDataObject().then((data) => {
						expect({
							direction: 'row',
							alignItems: '',
							justifyContent: '',
						}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraFlexLayout')
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
			setMatrixItem('matrix-bottom-center-normal');

			// Assert label
			cy.checkLabelClassName(
				'Layout',
				'Flex Layout',
				'changed-in-normal-state'
			);

			// Assert control
			checkMatrixItem('matrix-bottom-center-selected');

			// Assert state graph
			cy.checkStateGraph('Layout', 'Flex Layout', {
				laptop: ['Normal'],
			});

			// Navigate between states and devices
			// Hover/Laptop
			setBlockState('Hover');
			// Assert label
			cy.checkLabelClassName(
				'Layout',
				'Flex Layout',
				'changed-in-normal-state'
			);

			// Assert control
			// TODO
			//checkMatrixItem('matrix-bottom-center-selected');

			// Assert state graph
			cy.checkStateGraph('Layout', 'Flex Layout', {
				laptop: ['Normal'],
			});

			// Hover/Tablet
			setDeviceType('Tablet');
			// Assert label
			cy.checkLabelClassName(
				'Layout',
				'Flex Layout',
				'changed-in-normal-state'
			);

			// Assert control
			// TODO
			//	checkMatrixItem('matrix-bottom-center-selected');

			// Assert state graph
			cy.checkStateGraph('Layout', 'Flex Layout', {
				laptop: ['Normal'],
			});

			// Normal/Laptop
			setBlockState('Normal');
			// Assert label
			cy.checkLabelClassName(
				'Layout',
				'Flex Layout',
				'changed-in-normal-state'
			);

			// Assert control
			// TODO
			//checkMatrixItem('matrix-bottom-center-selected');

			// Assert state graph
			cy.checkStateGraph('Layout', 'Flex Layout', {
				laptop: ['Normal'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					direction: 'row',
					alignItems: 'flex-end',
					justifyContent: 'center',
				}).to.be.deep.eq(getSelectedBlock(data, 'blockeraFlexLayout'));

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
			setMatrixItem('matrix-bottom-right-normal');

			// Assert label
			cy.checkLabelClassName(
				'Layout',
				'Flex Layout',
				'changed-in-secondary-state'
			);

			// Assert control
			checkMatrixItem('matrix-bottom-right-selected');

			// Assert state graph
			cy.checkStateGraph('Layout', 'Flex Layout', {
				laptop: ['Hover'],
			});

			// Navigate between states and devices
			// Normal/Laptop
			setBlockState('Normal');
			// Assert label
			cy.checkLabelClassName(
				'Layout',
				'Flex Layout',
				'changed-in-other-state'
			);

			// Assert control
			checkMatrixItem('matrix-top-left-normal');
			checkMatrixItem('matrix-top-center-normal');
			checkMatrixItem('matrix-top-right-normal');
			checkMatrixItem('matrix-center-left-normal');
			checkMatrixItem('matrix-center-center-normal');
			checkMatrixItem('matrix-center-right-normal');
			checkMatrixItem('matrix-bottom-left-normal');
			checkMatrixItem('matrix-bottom-center-normal');
			checkMatrixItem('matrix-bottom-right-normal');

			// Assert state graph
			cy.checkStateGraph('Layout', 'Flex Layout', {
				laptop: ['Hover'],
			});

			// Normal/Tablet
			setDeviceType('Tablet');
			// Assert label
			cy.checkLabelClassName(
				'Layout',
				'Flex Layout',
				'changed-in-other-state'
			);

			// Assert control
			checkMatrixItem('matrix-top-left-normal');
			checkMatrixItem('matrix-top-center-normal');
			checkMatrixItem('matrix-top-right-normal');
			checkMatrixItem('matrix-center-left-normal');
			checkMatrixItem('matrix-center-center-normal');
			checkMatrixItem('matrix-center-right-normal');
			checkMatrixItem('matrix-bottom-left-normal');
			checkMatrixItem('matrix-bottom-center-normal');
			checkMatrixItem('matrix-bottom-right-normal');

			// Assert state graph
			cy.checkStateGraph('Layout', 'Flex Layout', {
				laptop: ['Hover'],
			});

			// Hover/Tablet
			setBlockState('Hover');
			// Assert label
			cy.checkLabelClassName(
				'Layout',
				'Flex Layout',
				'changed-in-other-state'
			);

			// Assert control
			checkMatrixItem('matrix-top-left-normal');
			checkMatrixItem('matrix-top-center-normal');
			checkMatrixItem('matrix-top-right-normal');
			checkMatrixItem('matrix-center-left-normal');
			checkMatrixItem('matrix-center-center-normal');
			checkMatrixItem('matrix-center-right-normal');
			checkMatrixItem('matrix-bottom-left-normal');
			checkMatrixItem('matrix-bottom-center-normal');
			checkMatrixItem('matrix-bottom-right-normal');

			// Assert state graph
			cy.checkStateGraph('Layout', 'Flex Layout', {
				laptop: ['Hover'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					direction: 'row',
					alignItems: '',
					justifyContent: '',
				}).to.be.deep.eq(getSelectedBlock(data, 'blockeraFlexLayout'));

				//TODO
				// expect({}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').normal
				// 		.breakpoints.tablet.attributes
				// );

				expect({
					blockeraFlexLayout: {
						direction: 'row',
						alignItems: 'flex-end',
						justifyContent: 'flex-end',
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
