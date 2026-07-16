import {
	getSelectedBlock,
	createPost,
	setBlockState,
	setDeviceType,
	assertBlockData,
} from '@blockera/dev-cypress/js/helpers';

describe('Layout Matrix Control label testing (Flex Layout)', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByAriaControls('styles-view').click();

		// Set display
		cy.getByAriaLabel('Flex').click();
	});

	const setMatrixItem = (item) => {
		cy.getByDataTest('layout-matrix').within(() =>
			cy.getByDataTest(item).click()
		);

		// LayoutMatrixControl defers single-click setValue by 200ms (dblclick
		// detection). Wait for the UI commit before state/device navigation so
		// the deferred write cannot land on the wrong active state (CI flake).
		const selectedItem = item.replace(/-normal$/, '-selected');
		cy.getByDataTest('layout-matrix').within(() =>
			cy.getByDataTest(selectedItem).should('exist')
		);
	};

	const checkMatrixItem = (item) => {
		cy.getByDataTest('layout-matrix').within(() =>
			cy.getByDataTest(item).should('exist')
		);
	};

	/**
	 * After reset/reset-all, empty states may be pruned (undefined) or left as
	 * `{}`. Normalize both so store assertions do not throw
	 * `Cannot read properties of undefined (reading 'breakpoints')` on CI.
	 */
	const getBreakpointAttributes = (data, state, breakpoint) =>
		getSelectedBlock(data, 'blockeraBlockStates')?.[state]?.breakpoints?.[
			breakpoint
		]?.attributes ?? {};

	it('should display changed value on Flex Layout -> Normal -> Desktop', () => {
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
			desktop: ['Normal'],
		});
	});

	it('should display changed value on Flex Layout -> Hover -> Desktop', () => {
		/**
		 * Hover
		 */
		setBlockState('Hover');

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
		cy.checkStateGraph('Layout', 'Flex Layout', { desktop: ['Hover'] });
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
		setBlockState('Hover');

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
			desktop: ['Normal', 'Hover'],
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
		 * Desktop device
		 */
		setDeviceType('Desktop');

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
		setBlockState('Hover');
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
		 * Desktop device (Active)
		 */
		setDeviceType('Desktop');

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
		 * Normal (Desktop device)
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
			// Set value in normal/desktop
			setMatrixItem('matrix-top-left-normal');

			// Set value in hover/desktop
			setBlockState('Hover');
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

					// Wait for reset to clear tablet attrs and keep desktop inherit
					assertBlockData((data) => {
						expect({}).to.be.deep.eq(
							getBreakpointAttributes(data, 'normal', 'tablet')
						);
						expect({
							direction: 'row',
							alignItems: 'flex-start',
							justifyContent: 'flex-start',
						}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraFlexLayout')
						);
					});

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
						desktop: ['Hover', 'Normal'],
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
						desktop: ['Hover', 'Normal'],
					});

					// Assert store data
					assertBlockData((data) => {
						expect({}).to.be.deep.eq(
							getBreakpointAttributes(data, 'hover', 'tablet')
						);
					});
				}
			);

			context(
				'should correctly reset blockeraFlexLayout, and display effected fields(label, control, stateGraph) in normal/desktop',
				() => {
					setDeviceType('Desktop');
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
						desktop: ['Hover'],
					});

					// Assert store data
					assertBlockData((data) => {
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
				'should correctly reset blockeraFlexLayout, and display effected fields(label, control, stateGraph) in hover/desktop',
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
					assertBlockData((data) => {
						expect({}).to.be.deep.eq(
							getBreakpointAttributes(data, 'hover', 'desktop')
						);
					});
				}
			);
		});

		it('set value in normal/desktop and navigate between states', () => {
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
				desktop: ['Normal'],
			});

			// Navigate between states and devices
			// Hover/Desktop
			setBlockState('Hover');
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
				desktop: ['Normal'],
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
			checkMatrixItem('matrix-bottom-left-selected');

			// Assert state graph
			cy.checkStateGraph('Layout', 'Flex Layout', {
				desktop: ['Normal'],
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
			checkMatrixItem('matrix-bottom-left-selected');

			// Assert state graph
			cy.checkStateGraph('Layout', 'Flex Layout', {
				desktop: ['Normal'],
			});

			// Assert store data (retry; empty states may be pruned after reset)
			assertBlockData((data) => {
				expect({
					direction: 'row',
					alignItems: 'flex-end',
					justifyContent: 'flex-start',
				}).to.be.deep.eq(getSelectedBlock(data, 'blockeraFlexLayout'));

				expect({}).to.be.deep.eq(
					getBreakpointAttributes(data, 'normal', 'tablet')
				);
				expect({}).to.be.deep.eq(
					getBreakpointAttributes(data, 'hover', 'desktop')
				);
				expect({}).to.be.deep.eq(
					getBreakpointAttributes(data, 'hover', 'tablet')
				);
			});
		});

		it('set value in hover/desktop and navigate between states', () => {
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
				desktop: ['Hover'],
			});

			// Navigate between states and devices:
			// Normal/Desktop
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
				desktop: ['Hover'],
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
				desktop: ['Hover'],
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
				desktop: ['Hover'],
			});

			// Assert store data (retry; empty states may be pruned after reset)
			assertBlockData((data) => {
				expect({
					direction: 'row',
					alignItems: '',
					justifyContent: '',
				}).to.be.deep.eq(getSelectedBlock(data, 'blockeraFlexLayout'));

				expect({}).to.be.deep.eq(
					getBreakpointAttributes(data, 'normal', 'tablet')
				);

				expect({
					blockeraFlexLayout: {
						direction: 'row',
						alignItems: 'flex-end',
						justifyContent: 'flex-end',
					},
				}).to.be.deep.eq(
					getBreakpointAttributes(data, 'hover', 'desktop')
				);

				expect({}).to.be.deep.eq(
					getBreakpointAttributes(data, 'hover', 'tablet')
				);
			});
		});
	});

	describe('reset-all action testing...', () => {
		beforeEach(() => {
			// Set value in normal/desktop
			setMatrixItem('matrix-top-left-normal');

			// Set value in hover/desktop
			setBlockState('Hover');
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
					// Normal/Tablet — wait for async RESET_ALL before UI asserts
					assertBlockData((data) => {
						expect({
							direction: 'row',
							alignItems: '',
							justifyContent: '',
						}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraFlexLayout')
						);
						expect({}).to.be.deep.eq(
							getBreakpointAttributes(data, 'hover', 'desktop')
						);
					});

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

					// Hover/Desktop
					setDeviceType('Desktop');
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

					// Normal/Desktop
					setBlockState('Normal');
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

					// Assert store data
					assertBlockData((data) => {
						expect({
							direction: 'row',
							alignItems: '',
							justifyContent: '',
						}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraFlexLayout')
						);

						expect({}).to.be.deep.eq(
							getBreakpointAttributes(data, 'normal', 'tablet')
						);
						expect({}).to.be.deep.eq(
							getBreakpointAttributes(data, 'hover', 'desktop')
						);
						expect({}).to.be.deep.eq(
							getBreakpointAttributes(data, 'hover', 'tablet')
						);
					});
				}
			);
		});

		it('set value in normal/desktop and navigate between states', () => {
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
				desktop: ['Normal'],
			});

			// Navigate between states and devices
			// Hover/Desktop
			setBlockState('Hover');
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
				desktop: ['Normal'],
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
			checkMatrixItem('matrix-bottom-center-selected');

			// Assert state graph
			cy.checkStateGraph('Layout', 'Flex Layout', {
				desktop: ['Normal'],
			});

			// Normal/Desktop
			setBlockState('Normal');
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
				desktop: ['Normal'],
			});

			// Assert store data (retry; empty states may be pruned after reset-all)
			assertBlockData((data) => {
				expect({
					direction: 'row',
					alignItems: 'flex-end',
					justifyContent: 'center',
				}).to.be.deep.eq(getSelectedBlock(data, 'blockeraFlexLayout'));

				expect({}).to.be.deep.eq(
					getBreakpointAttributes(data, 'normal', 'tablet')
				);
				expect({}).to.be.deep.eq(
					getBreakpointAttributes(data, 'hover', 'desktop')
				);
				expect({}).to.be.deep.eq(
					getBreakpointAttributes(data, 'hover', 'tablet')
				);
			});
		});

		it('set value in hover/desktop and navigate between states', () => {
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
				desktop: ['Hover'],
			});

			// Navigate between states and devices
			// Normal/Desktop
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
				desktop: ['Hover'],
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
				desktop: ['Hover'],
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
				desktop: ['Hover'],
			});

			// Assert store data — CI flake: `.hover.breakpoints` threw when
			// empty states were pruned after reset-all. Use safe access + retry.
			assertBlockData((data) => {
				expect({
					direction: 'row',
					alignItems: '',
					justifyContent: '',
				}).to.be.deep.eq(getSelectedBlock(data, 'blockeraFlexLayout'));

				expect({}).to.be.deep.eq(
					getBreakpointAttributes(data, 'normal', 'tablet')
				);

				expect({
					blockeraFlexLayout: {
						direction: 'row',
						alignItems: 'flex-end',
						justifyContent: 'flex-end',
					},
				}).to.be.deep.eq(
					getBreakpointAttributes(data, 'hover', 'desktop')
				);

				expect({}).to.be.deep.eq(
					getBreakpointAttributes(data, 'hover', 'tablet')
				);
			});
		});
	});
});
