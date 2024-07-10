import {
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	createPost,
	setBlockState,
	addBlockState,
	setDeviceType,
} from '../../../../../dev-cypress/js/helpers';

describe('Position Control label testing', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getParentContainer('Position').within(() => {
			cy.customSelect('Relative');
		});
		// Alias
		cy.getByDataCy('box-position-control').within(() => {
			cy.getByAriaLabel('Top Position').as('top-position');
			cy.getByAriaLabel('Right Position').as('right-position');
			cy.getByAriaLabel('Bottom Position').as('bottom-position');
			cy.getByAriaLabel('Left Position').as('left-position');
		});
	});

	const setPositionValue = (label, value) => {
		cy.get(`@${label}`).click({ force: true });

		cy.getByDataTest('popover-body').within(() => {
			cy.get('input[type="number"]').type(value);
		});

		// close popover
		cy.getByDataTest('popover-header').within(() =>
			cy.getByAriaLabel('Close').click()
		);
	};

	const checkPositionValue = (label, value) => {
		cy.get(`@${label}`).should('include.text', value);
	};

	it('should display changed value on Top Position -> Normal -> Desktop', () => {
		// Assert label before set value
		cy.checkLabelClassName(
			'Position',
			'Top Position',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		setPositionValue('top-position', 20);

		// Assert label after set value
		cy.checkLabelClassName(
			'Position',
			'Top Position',
			'changed-in-normal-state'
		);

		// Assert control
		checkPositionValue('top-position', 20);

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Top Position',
			'changed-in-normal-state'
		);

		// Assert control
		checkPositionValue('top-position', 20);

		/**
		 * Pseudo State (Hover/Tablet)
		 */
		addBlockState('hover');

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Top Position',
			'changed-in-normal-state'
		);

		// Assert control
		checkPositionValue('top-position', 20);

		// Assert state graph
		cy.checkStateGraph('Position', 'Relative', { desktop: ['Normal'] });
	});

	it('should display changed value on Bottom Position -> Hover -> Desktop', () => {
		/**
		 * Hover
		 */
		addBlockState('hover');
		// Assert label before set value
		cy.checkLabelClassName(
			'Position',
			'Bottom Position',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		setPositionValue('bottom-position', 30);

		// Assert label after set value
		cy.checkLabelClassName(
			'Position',
			'Bottom Position',
			'changed-in-secondary-state'
		);
		// Assert control
		checkPositionValue('bottom-position', 30);

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Bottom Position',
			'changed-in-other-state'
		);

		// Assert control
		checkPositionValue('bottom-position', '');

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Bottom Position',
			'changed-in-other-state'
		);

		// Assert control
		checkPositionValue('bottom-position', '');

		// Assert state graph
		cy.checkStateGraph('Position', 'Relative', { desktop: ['Hover'] });
	});

	it('should display changed value on Left & Top Position, when set value in two states', () => {
		/**
		 * Normal
		 */
		// Set value
		setPositionValue('left-position', 30);

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Left Position',
			'changed-in-normal-state'
		);

		/**
		 * Hover
		 */
		addBlockState('hover');

		// Assert label before set value
		cy.checkLabelClassName(
			'Position',
			'Left Position',
			'changed-in-normal-state'
		);

		// Set value
		setPositionValue('top-position', '10');
		setPositionValue('left-position', '{selectall}50');

		// Assert label after set value
		cy.checkLabelClassName(
			'Position',
			'Left Position',
			'changed-in-secondary-state'
		);
		cy.checkLabelClassName(
			'Position',
			'Top Position',
			'changed-in-secondary-state'
		);

		// Assert control
		checkPositionValue('left-position', 50);

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Left Position',
			'changed-in-normal-state'
		);
		cy.checkLabelClassName(
			'Position',
			'Top Position',
			'changed-in-other-state'
		);

		// Assert control
		checkPositionValue('left-position', '30');
		checkPositionValue('top-position', '');

		// Assert state graph
		cy.checkStateGraph('Position', 'Relative', {
			desktop: ['Normal', 'Hover'],
		});
	});

	it('should display changed value on Right Position -> Normal -> Tablet', () => {
		setDeviceType('Tablet');
		// Assert label before set value
		cy.checkLabelClassName(
			'Position',
			'Right Position',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		setPositionValue('right-position', 30);

		// Assert label after set value
		cy.checkLabelClassName(
			'Position',
			'Right Position',
			'changed-in-normal-state'
		);

		// Assert control
		checkPositionValue('right-position', 30);

		/**
		 * Desktop device
		 */
		setDeviceType('Desktop');

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Right Position',
			'changed-in-other-state'
		);

		// Assert control
		checkPositionValue('right-position', '');

		// Assert state graph
		cy.checkStateGraph('Position', 'Relative', { tablet: ['Normal'] });
	});

	it('should display changed value on Top Position -> Hover -> Tablet', () => {
		setDeviceType('Tablet');
		/**
		 * Hover
		 */
		addBlockState('hover');
		// Assert label before set value
		cy.checkLabelClassName(
			'Position',
			'Top Position',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		setPositionValue('top-position', 30);

		// Assert label after set value
		cy.checkLabelClassName(
			'Position',
			'Top Position',
			'changed-in-secondary-state'
		);
		// Assert control
		checkPositionValue('top-position', 30);

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Top Position',
			'changed-in-other-state'
		);

		// Assert control
		checkPositionValue('top-position', '');

		/**
		 * Desktop device (Active)
		 */
		setDeviceType('Desktop');

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Top Position',
			'changed-in-other-state'
		);

		// Assert control
		checkPositionValue('top-position', '');

		/**
		 * Desktop device (Normal)
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Top Position',
			'changed-in-other-state'
		);

		// Assert control
		checkPositionValue('top-position', '');

		// Assert state graph
		cy.checkStateGraph('Position', 'Relative', { tablet: ['Hover'] });
	});

	describe('reset action testing...', () => {
		describe('reset whole object', () => {
			beforeEach(() => {
				// Set value in normal/desktop
				setPositionValue('top-position', 10);
				setPositionValue('bottom-position', 15);

				// Set value in hover/desktop
				addBlockState('hover');
				setPositionValue('top-position', '{selectall}20');

				// Set value in hover/tablet
				setDeviceType('Tablet');
				setPositionValue('top-position', '{selectall}30');
				setPositionValue('bottom-position', '{selectall}35');

				// Set value in normal/tablet
				setBlockState('Normal');
				setPositionValue('top-position', '{selectall}40');

				context(
					'should correctly reset blockeraPosition, and display effected fields(label, control, stateGraph) in normal/tablet',
					() => {
						// Reset to normal
						cy.resetBlockeraAttribute(
							'Position',
							'Relative',
							'reset'
						);

						// Assert label
						cy.checkLabelClassName(
							'Position',
							'Relative',
							'changed-in-normal-state'
						);

						// Assert control
						checkPositionValue('top-position', 10);
						checkPositionValue('bottom-position', 15);

						// Assert state graph
						cy.checkStateGraph('Position', 'Relative', {
							tablet: ['Hover'],
							desktop: ['Hover', 'Normal'],
						});

						// Assert store data
						getWPDataObject().then((data) => {
							expect({}).to.be.deep.eq(
								getSelectedBlock(data, 'blockeraBlockStates')
									.normal.breakpoints.tablet.attributes
							);
						});
					}
				);

				context(
					'should correctly reset blockeraPosition, and display effected fields(label, control, stateGraph) in hover/tablet',
					() => {
						setBlockState('Hover');
						// Reset to normal
						cy.resetBlockeraAttribute(
							'Position',
							'Relative',
							'reset'
						);

						// Assert label
						cy.checkLabelClassName(
							'Position',
							'Relative',
							'changed-in-normal-state'
						);

						// Assert control
						checkPositionValue('top-position', 10);
						checkPositionValue('bottom-position', 15);

						// Assert state graph
						cy.checkStateGraph('Position', 'Relative', {
							desktop: ['Hover', 'Normal'],
						});

						// Assert store data
						getWPDataObject().then((data) => {
							expect({}).to.be.deep.eq(
								getSelectedBlock(data, 'blockeraBlockStates')
									.hover.breakpoints.tablet.attributes
							);
						});
					}
				);

				context(
					'should correctly reset blockeraPosition, and display effected fields(label, control, stateGraph) in normal/desktop',
					() => {
						setDeviceType('Desktop');
						setBlockState('Normal');
						// Reset to default
						cy.resetBlockeraAttribute(
							'Position',
							'Relative',
							'reset'
						);

						// Assert label
						cy.checkLabelClassName(
							'Position',
							'Relative',
							'changed-in-other-state'
						);

						// Assert control
						checkPositionValue('top-position', '');
						checkPositionValue('bottom-position', '');

						// Assert state graph
						cy.checkStateGraph('Position', 'Relative', {
							desktop: ['Hover'],
						});

						// Assert store data
						getWPDataObject().then((data) => {
							expect({
								type: 'relative',
								position: {
									top: '',
									left: '',
									bottom: '',
									right: '',
								},
							}).to.be.deep.eq(
								getSelectedBlock(data, 'blockeraPosition')
							);
						});
					}
				);

				context(
					'should correctly reset blockeraPosition, and display effected fields(label, control, stateGraph) in hover/desktop',
					() => {
						setBlockState('Hover');
						// Reset to normal
						cy.resetBlockeraAttribute(
							'Position',
							'Relative',
							'reset'
						);

						// Assert label
						cy.checkLabelClassName(
							'Position',
							'Relative',
							'changed-in-secondary-state',
							'not-have'
						);

						// Assert control
						checkPositionValue('top-position', '');
						checkPositionValue('bottom-position', '');

						// Assert state graph
						cy.checkStateGraph('Position', 'Relative', {});

						// Assert store data
						getWPDataObject().then((data) => {
							expect({}).to.be.deep.eq(
								getSelectedBlock(data, 'blockeraBlockStates')
									.hover.breakpoints.desktop.attributes
							);
						});
					}
				);
			});

			it('set value in normal/desktop and navigate between states', () => {
				setBlockState('Normal');

				setPositionValue('top-position', 60);

				// Assert label
				cy.checkLabelClassName(
					'Position',
					'Relative',
					'changed-in-normal-state'
				);
				// Assert control
				checkPositionValue('top-position', 60);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Normal'],
				});

				// Navigate between states and devices
				// Hover/Desktop
				setBlockState('Hover');
				// Assert label
				cy.checkLabelClassName(
					'Position',
					'Relative',
					'changed-in-normal-state'
				);
				// Assert control
				checkPositionValue('top-position', 60);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Normal'],
				});

				// Hover/Tablet
				setDeviceType('Tablet');

				// Assert label
				cy.checkLabelClassName(
					'Position',
					'Relative',
					'changed-in-normal-state'
				);
				// Assert control
				checkPositionValue('top-position', 60);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Normal'],
				});

				// Normal/Tablet
				setBlockState('Normal');

				// Assert label
				cy.checkLabelClassName(
					'Position',
					'Relative',
					'changed-in-normal-state'
				);
				// Assert control
				checkPositionValue('top-position', 60);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Normal'],
				});

				// Assert store data
				getWPDataObject().then((data) => {
					expect({
						type: 'relative',
						position: {
							top: '60px',
							left: '',
							bottom: '',
							right: '',
						},
					}).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraPosition')
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
				setPositionValue('top-position', 50);

				// Assert label
				cy.checkLabelClassName(
					'Position',
					'Relative',
					'changed-in-secondary-state'
				);

				// Assert control
				checkPositionValue('top-position', 50);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Hover'],
				});

				// Navigate between states and devices:
				// Normal/Desktop
				setBlockState('Normal');
				// Assert label
				cy.checkLabelClassName(
					'Position',
					'Relative',
					'changed-in-other-state'
				);

				// Assert control
				checkPositionValue('top-position', '');

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Hover'],
				});

				// Normal/Tablet
				setDeviceType('Tablet');
				// Assert label
				cy.checkLabelClassName(
					'Position',
					'Relative',
					'changed-in-other-state'
				);

				// Assert control
				checkPositionValue('top-position', '');

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Hover'],
				});

				// Hover/Tablet
				setBlockState('Hover');
				// Assert label
				cy.checkLabelClassName(
					'Position',
					'Relative',
					'changed-in-other-state'
				);

				// Assert control
				checkPositionValue('top-position', '');

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Hover'],
				});

				// Assert store data
				getWPDataObject().then((data) => {
					expect({
						type: 'relative',
						position: {
							top: '',
							left: '',
							bottom: '',
							right: '',
						},
					}).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraPosition')
					);

					expect({}).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').normal
							.breakpoints.tablet.attributes
					);

					expect({
						blockeraPosition: {
							type: 'relative',
							position: {
								top: '50px',
								left: '',
								bottom: '',
								right: '',
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

		it('reset nested items', () => {
			// Set value in normal/desktop
			setPositionValue('top-position', 20);
			setPositionValue('bottom-position', 15);

			// Set value in hover/desktop
			addBlockState('hover');
			setPositionValue('top-position', '{selectall}10');

			context(
				'should correctly reset blockeraPosition.top, and display effected fields(label, control, stateGraph) in hover/desktop',
				() => {
					// Reset to normal
					cy.getByAriaLabel('Top Position').click();
					cy.resetBlockeraAttribute('', 'Top', 'reset', true);

					// Assert label
					cy.getByAriaLabel('Top Position').should(
						'have.class',
						'changed-in-normal-state'
					);
					cy.checkLabelClassName(
						'Position',
						'Relative',
						'changed-in-normal-state'
					);

					// Assert control
					checkPositionValue('top-position', 20);
					checkPositionValue('bottom-position', 15);

					// Assert state graph
					cy.checkStateGraph('Position', 'Relative', {
						desktop: ['Normal'],
					});

					// Assert store data
					getWPDataObject().then((data) => {
						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').hover
								.breakpoints.desktop.attributes
						);
					});
				}
			);

			context(
				'should correctly reset blockeraPosition.top, and display effected fields(label, control, stateGraph) in normal/desktop',
				() => {
					setBlockState('Normal');
					// Reset to normal
					cy.getByAriaLabel('Top Position').click();
					cy.resetBlockeraAttribute('', 'Top', 'reset', true);

					// Assert label
					cy.getByAriaLabel('Top Position').should(
						'not.have.class',
						'changed-in-normal-state'
					);

					// Assert control
					checkPositionValue('top-position', '');
					checkPositionValue('bottom-position', 15);

					// Assert state graph
					cy.checkStateGraph('Position', 'Relative', {
						desktop: ['Normal'],
					});

					// Assert store data
					getWPDataObject().then((data) => {
						expect({
							type: 'relative',
							position: {
								top: '',
								left: '',
								bottom: '15px',
								right: '',
							},
						}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraPosition')
						);
					});
				}
			);

			context('set value in normal/desktop', () => {
				setPositionValue('top-position', 30);

				// Assert label
				cy.getByAriaLabel('Top Position').should(
					'have.class',
					'changed-in-normal-state'
				);

				// Assert control
				checkPositionValue('top-position', 30);
				checkPositionValue('bottom-position', 15);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Normal'],
				});

				// Assert store data
				getWPDataObject().then((data) => {
					expect({
						type: 'relative',
						position: {
							top: '30px',
							left: '',
							bottom: '15px',
							right: '',
						},
					}).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraPosition')
					);
				});

				// Hover/Desktop
				setBlockState('Hover');

				// Assert label
				cy.getByAriaLabel('Top Position').should(
					'have.class',
					'changed-in-normal-state'
				);

				// Assert control
				checkPositionValue('top-position', 30);
				checkPositionValue('bottom-position', 15);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Normal'],
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
		describe('reset-all whole object', () => {
			beforeEach(() => {
				// Set value in normal/desktop
				setPositionValue('top-position', 10);
				setPositionValue('bottom-position', 15);

				// Set value in hover/desktop
				addBlockState('hover');
				setPositionValue('top-position', '{selectall}20');

				// Set value in hover/tablet
				setDeviceType('Tablet');
				setPositionValue('top-position', '{selectall}30');
				setPositionValue('bottom-position', '{selectall}35');

				// Set value in normal/tablet
				setBlockState('Normal');
				setPositionValue('top-position', '{selectall}40');

				// Reset All
				cy.resetBlockeraAttribute('Position', 'Relative', 'reset-all');

				context(
					'should correctly reset blockeraPosition, and display effected fields(label, control, stateGraph) in all states',
					() => {
						// Normal/Tablet
						// Assert label
						cy.checkLabelClassName(
							'Position',
							'Relative',
							'changed-in-normal-state',
							'not-have'
						);

						// Assert control
						checkPositionValue('top-position', '');
						checkPositionValue('bottom-position', '');

						// Assert state graph
						cy.checkStateGraph('Position', 'Relative', {});

						// Hover/Tablet
						setBlockState('Hover');
						// Assert label
						cy.checkLabelClassName(
							'Position',
							'Relative',
							'changed-in-secondary-state',
							'not-have'
						);

						// Assert control
						checkPositionValue('top-position', '');
						checkPositionValue('bottom-position', '');

						// Assert state graph
						cy.checkStateGraph('Position', 'Relative', {});

						// Hover/Desktop
						setDeviceType('Desktop');
						// Assert label
						cy.checkLabelClassName(
							'Position',
							'Relative',
							'changed-in-secondary-state',
							'not-have'
						);

						// Assert control
						checkPositionValue('top-position', '');
						checkPositionValue('bottom-position', '');

						// Assert state graph
						cy.checkStateGraph('Position', 'Relative', {});

						// Normal/Desktop
						setBlockState('Normal');
						// Assert label
						cy.checkLabelClassName(
							'Position',
							'Relative',
							'changed-in-normal-state',
							'not-have'
						);

						// Assert control
						checkPositionValue('top-position', '');
						checkPositionValue('bottom-position', '');

						// Assert state graph
						cy.checkStateGraph('Position', 'Relative', {});

						// Assert store data
						getWPDataObject().then((data) => {
							expect({
								type: 'relative',
								position: {
									top: '',
									left: '',
									right: '',
									bottom: '',
								},
							}).to.be.deep.eq(
								getSelectedBlock(data, 'blockeraPosition')
							);

							expect({}).to.be.deep.eq(
								getSelectedBlock(data, 'blockeraBlockStates')
									.normal.breakpoints.tablet.attributes
							);

							expect({}).to.be.deep.eq(
								getSelectedBlock(data, 'blockeraBlockStates')
									.hover.breakpoints.desktop.attributes
							);

							expect({}).to.be.deep.eq(
								getSelectedBlock(data, 'blockeraBlockStates')
									.hover.breakpoints.tablet.attributes
							);
						});
					}
				);
			});

			it('set value in normal/desktop and navigate between states', () => {
				setPositionValue('top-position', 45);

				// Assert label
				cy.checkLabelClassName(
					'Position',
					'Relative',
					'changed-in-normal-state'
				);

				// Assert control
				checkPositionValue('top-position', 45);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Normal'],
				});

				// Navigate between states and devices
				// Hover/Desktop
				setBlockState('Hover');
				// Assert label
				cy.checkLabelClassName(
					'Position',
					'Relative',
					'changed-in-normal-state'
				);

				// Assert control
				checkPositionValue('top-position', 45);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Normal'],
				});

				// Hover/Tablet
				setDeviceType('Tablet');
				// Assert label
				cy.checkLabelClassName(
					'Position',
					'Relative',
					'changed-in-normal-state'
				);

				// Assert control
				checkPositionValue('top-position', 45);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Normal'],
				});

				// Normal/Desktop
				setBlockState('Normal');
				// Assert label
				cy.checkLabelClassName(
					'Position',
					'Relative',
					'changed-in-normal-state'
				);

				// Assert control
				checkPositionValue('top-position', 45);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Normal'],
				});

				// Assert store data
				getWPDataObject().then((data) => {
					expect({
						type: 'relative',
						position: {
							top: '45px',
							left: '',
							right: '',
							bottom: '',
						},
					}).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraPosition')
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
				setBlockState('Hover');
				setPositionValue('top-position', 80);

				// Assert label
				cy.checkLabelClassName(
					'Position',
					'Relative',
					'changed-in-secondary-state'
				);

				// Assert control
				checkPositionValue('top-position', 80);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Hover'],
				});

				// Navigate between states and devices
				// Normal/Desktop
				setBlockState('Normal');
				// Assert label
				cy.checkLabelClassName(
					'Position',
					'Relative',
					'changed-in-other-state'
				);

				// Assert control
				checkPositionValue('top-position', '');

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Hover'],
				});

				// Normal/Tablet
				setDeviceType('Tablet');
				// Assert label
				cy.checkLabelClassName(
					'Position',
					'Relative',
					'changed-in-other-state'
				);

				// Assert control
				checkPositionValue('top-position', '');

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Hover'],
				});

				// Hover/Tablet
				setBlockState('Hover');
				// Assert label
				cy.checkLabelClassName(
					'Position',
					'Relative',
					'changed-in-other-state'
				);

				// Assert control
				checkPositionValue('top-position', '');

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Hover'],
				});

				// Assert store data
				getWPDataObject().then((data) => {
					expect({
						type: 'relative',
						position: {
							top: '',
							left: '',
							right: '',
							bottom: '',
						},
					}).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraPosition')
					);

					expect({}).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').normal
							.breakpoints.tablet.attributes
					);

					expect({
						blockeraPosition: {
							type: 'relative',
							position: {
								top: '80px',
								left: '',
								right: '',
								bottom: '',
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

		it('reset-all nested items', () => {
			// Set value in normal/desktop
			setPositionValue('top-position', 20);
			setPositionValue('bottom-position', 15);

			// Set value in hover/desktop
			addBlockState('hover');
			setPositionValue('top-position', '{selectall}10');

			// Reset All
			cy.getByAriaLabel('Top Position').click();
			cy.resetBlockeraAttribute('', 'Top', 'reset-all', true);

			context(
				'should correctly reset blockeraPosition.top, and display effected fields(label, control, stateGraph) in all states',
				() => {
					// Hover/ Desktop
					// Assert label
					cy.getByAriaLabel('Top Position').should(
						'not.have.class',
						'changed-in-secondary-state'
					);
					cy.checkLabelClassName(
						'Position',
						'Relative',
						'changed-in-secondary-state',
						'not-have'
					);

					// Assert control
					checkPositionValue('top-position', '');
					checkPositionValue('bottom-position', 15);

					// Assert state graph
					cy.checkStateGraph('', 'Top', {}, true);

					// Normal/Desktop
					// Assert label
					setBlockState('Normal');
					cy.getByAriaLabel('Top Position').should(
						'not.have.class',
						'changed-in-normal-state'
					);

					// Assert control
					checkPositionValue('top-position', '');
					checkPositionValue('bottom-position', 15);

					// Assert state graph
					cy.getByAriaLabel('Top Position').click();
					cy.checkStateGraph('', 'Top', {}, true);

					// Assert store data
					getWPDataObject().then((data) => {
						expect({
							type: 'relative',
							position: {
								top: '',
								left: '',
								bottom: '15px',
								right: '',
							},
						}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraPosition')
						);
						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').normal
								.breakpoints.tablet.attributes
						);
					});
				}
			);

			context('set value in normal/desktop', () => {
				setPositionValue('top-position', '{selectall}30');

				// Assert label
				cy.getByAriaLabel('Top Position').should(
					'have.class',
					'changed-in-normal-state'
				);

				// Assert control
				checkPositionValue('top-position', 30);
				checkPositionValue('bottom-position', 15);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Normal'],
				});

				// Assert store data
				getWPDataObject().then((data) => {
					expect({
						type: 'relative',
						position: {
							top: '30px',
							left: '',
							bottom: '15px',
							right: '',
						},
					}).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraPosition')
					);
				});

				// Hover/Desktop
				setBlockState('Hover');
				// Assert label
				cy.getByAriaLabel('Top Position').should(
					'have.class',
					'changed-in-normal-state'
				);

				// Assert control
				checkPositionValue('top-position', 30);
				checkPositionValue('bottom-position', 15);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					desktop: ['Normal'],
				});
				cy.getByAriaLabel('Top Position').click();
				cy.checkStateGraph('', 'Top', { desktop: ['Normal'] }, true);

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
});
