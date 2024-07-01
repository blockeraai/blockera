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

	it('should display changed value on Top Position -> Normal -> Laptop', () => {
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
		cy.checkStateGraph('Position', 'Relative', { laptop: ['Normal'] });
	});

	it('should display changed value on Bottom Position -> Hover -> Laptop', () => {
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
		cy.checkStateGraph('Position', 'Relative', { laptop: ['Hover'] });
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
			laptop: ['Normal', 'Hover'],
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
		 * Laptop device
		 */
		setDeviceType('Laptop');

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
		 * Laptop device (Active)
		 */
		setDeviceType('Laptop');

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Top Position',
			'changed-in-other-state'
		);

		// Assert control
		checkPositionValue('top-position', '');

		/**
		 * Laptop device (Normal)
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
				// Set value in normal/laptop
				setPositionValue('top-position', 10);
				setPositionValue('bottom-position', 15);

				// Set value in hover/laptop
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
						// TODO
						//checkPositionValue('top-position', 10);
						//checkPositionValue('bottom-position', 15);

						// Assert state graph
						cy.checkStateGraph('Position', 'Relative', {
							tablet: ['Hover'],
							laptop: ['Hover', 'Normal'],
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
						//TODO
						//checkPositionValue('top-position', 10);
						//checkPositionValue('bottom-position', 15);

						// Assert state graph
						cy.checkStateGraph('Position', 'Relative', {
							laptop: ['Hover', 'Normal'],
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
					'should correctly reset blockeraPosition, and display effected fields(label, control, stateGraph) in normal/laptop',
					() => {
						setDeviceType('Laptop');
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
							laptop: ['Hover'],
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
					'should correctly reset blockeraPosition, and display effected fields(label, control, stateGraph) in hover/laptop',
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
									.hover.breakpoints.laptop.attributes
							);
						});
					}
				);
			});

			it('set value in normal/laptop and navigate between states', () => {
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
					laptop: ['Normal'],
				});

				// Navigate between states and devices
				// Hover/Laptop
				setBlockState('Hover');
				// Assert label
				cy.checkLabelClassName(
					'Position',
					'Relative',
					'changed-in-normal-state'
				);
				// Assert control
				// TODO
				//checkPositionValue('top-position', 60);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					laptop: ['Normal'],
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
				// TODO
				//checkPositionValue('top-position', 60);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					laptop: ['Normal'],
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
				// TODO
				//checkPositionValue('top-position', 60);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					laptop: ['Normal'],
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
					laptop: ['Hover'],
				});

				// Navigate between states and devices:
				// Normal/Laptop
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
					laptop: ['Hover'],
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
					laptop: ['Hover'],
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
					laptop: ['Hover'],
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

					// TODO
					// expect({}).to.be.deep.eq(
					// 	getSelectedBlock(data, 'blockeraBlockStates').normal
					// 		.breakpoints.tablet.attributes
					// );

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
							.breakpoints.laptop.attributes
					);

					expect({}).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').hover
							.breakpoints.tablet.attributes
					);
				});
			});
		});

		it('reset nested items', () => {
			// Set value in normal/laptop
			setPositionValue('top-position', 20);
			setPositionValue('bottom-position', 15);

			// Set value in hover/laptop
			addBlockState('hover');
			setPositionValue('top-position', '{selectall}10');

			context(
				'should correctly reset blockeraPosition.top, and display effected fields(label, control, stateGraph) in hover/laptop',
				() => {
					// Reset to normal
					cy.getByAriaLabel('Top Position').click();
					cy.resetBlockeraAttribute('', 'Top', 'reset', true);

					// Assert label
					// TODO
					// cy.getByAriaLabel('Top Position').should(
					// 	'have.class',
					// 	'changed-in-normal-state'
					// );
					// cy.checkLabelClassName(
					// 	'Position',
					// 	'Relative',
					// 	'changed-in-normal-state'
					// );

					// Assert control
					// TODO
					// checkPositionValue('top-position', 20);
					checkPositionValue('bottom-position', 15);

					// Assert state graph
					// TODO : should position object be deleted, because it's equal with root
					// cy.checkStateGraph('Position', 'Relative', {
					// 	laptop: ['Normal'],
					// });

					// Assert store data
					// TODO : should position object be deleted, because it's equal with root
					// getWPDataObject().then((data) => {
					// 	expect({}).to.be.deep.eq(
					// 		getSelectedBlock(data, 'blockeraBlockStates').hover
					// 			.breakpoints.laptop.attributes
					// 	);
					// });
				}
			);

			context(
				'should correctly reset blockeraPosition.top, and display effected fields(label, control, stateGraph) in normal/laptop',
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
						laptop: ['Normal'],
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

			context('set value in normal/laptop', () => {
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
				// TODO
				// cy.checkStateGraph('Position', 'Relative', {
				// 	laptop: ['Normal'],
				// });

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

				// Hover/Laptop
				setBlockState('Hover');

				// Assert label
				// TODO
				// cy.getByAriaLabel('Top Position').should(
				// 	'have.class',
				// 	'changed-in-normal-state'
				// );

				// Assert control
				// TODO
				//checkPositionValue('top-position', 30);
				checkPositionValue('bottom-position', 15);

				// Assert state graph
				// TODO
				// cy.checkStateGraph('Position', 'Relative', {
				// 	laptop: ['Normal'],
				// });

				// Assert store data
				// TODO
				// getWPDataObject().then((data) => {
				// 	expect({}).to.be.deep.eq(
				// 		getSelectedBlock(data, 'blockeraBlockStates').hover
				// 			.breakpoints.laptop.attributes
				// 	);
				// });
			});
		});
	});

	describe('reset-all action testing...', () => {
		describe('reset-all whole object', () => {
			beforeEach(() => {
				// Set value in normal/laptop
				setPositionValue('top-position', 10);
				setPositionValue('bottom-position', 15);

				// Set value in hover/laptop
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

						// Hover/Laptop
						setDeviceType('Laptop');
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

						// Normal/Laptop
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
									.hover.breakpoints.laptop.attributes
							);

							expect({}).to.be.deep.eq(
								getSelectedBlock(data, 'blockeraBlockStates')
									.hover.breakpoints.tablet.attributes
							);
						});
					}
				);
			});

			it('set value in normal/laptop and navigate between states', () => {
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
					laptop: ['Normal'],
				});

				// Navigate between states and devices
				// Hover/Laptop
				setBlockState('Hover');
				// Assert label
				cy.checkLabelClassName(
					'Position',
					'Relative',
					'changed-in-normal-state'
				);

				// Assert control
				// TODO
				//checkPositionValue('top-position', 45);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					laptop: ['Normal'],
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
				// TODO
				// checkPositionValue('top-position', 45);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					laptop: ['Normal'],
				});

				// Normal/Laptop
				setBlockState('Normal');
				// Assert label
				cy.checkLabelClassName(
					'Position',
					'Relative',
					'changed-in-normal-state'
				);

				// Assert control
				// TODO
				// checkPositionValue('top-position', 45);

				// Assert state graph
				cy.checkStateGraph('Position', 'Relative', {
					laptop: ['Normal'],
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
					laptop: ['Hover'],
				});

				// Navigate between states and devices
				// Normal/Laptop
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
					laptop: ['Hover'],
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
					laptop: ['Hover'],
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
					laptop: ['Hover'],
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

					console.log(
						'///',
						getSelectedBlock(data, 'blockeraBlockStates')
					);

					// TODO
					// expect({}).to.be.deep.eq(
					// 	getSelectedBlock(data, 'blockeraBlockStates').normal
					// 		.breakpoints.tablet.attributes
					// );

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
							.breakpoints.laptop.attributes
					);

					expect({}).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').hover
							.breakpoints.tablet.attributes
					);
				});
			});
		});

		it('reset-all nested items', () => {
			// Set value in normal/laptop
			setPositionValue('top-position', 20);
			setPositionValue('bottom-position', 15);

			// Set value in hover/laptop
			addBlockState('hover');
			setPositionValue('top-position', '{selectall}10');

			// Reset All
			cy.getByAriaLabel('Top Position').click();
			cy.resetBlockeraAttribute('', 'Top', 'reset-all', true);

			context(
				'should correctly reset blockeraPosition.top, and display effected fields(label, control, stateGraph) in all states',
				() => {
					// Hover/ Laptop
					// Assert label
					// TODO
					//cy.getByAriaLabel('Top Position').should(
					//	'not.have.class',
					//	'changed-in-secondary-state'
					// );
					// cy.checkLabelClassName(
					// 	'Position',
					// 	'Relative',
					// 	'changed-in-secondary-state',
					// 	'not-have'
					// );

					// Assert control
					checkPositionValue('top-position', '');
					checkPositionValue('bottom-position', 15);

					// Assert state graph
					// TODO
					// cy.checkStateGraph('', 'Top', {}, true);

					// Normal/Laptop
					// Assert label
					setBlockState('Normal');
					// TODO
					// cy.getByAriaLabel('Top Position').should(
					// 	'not.have.class',
					// 	'changed-in-normal-state'
					// );

					// Assert control
					// TODO
					//checkPositionValue('top-position', '');
					checkPositionValue('bottom-position', 15);

					// Assert state graph
					// TODO
					// cy.getByAriaLabel('Top Position').click();
					// cy.checkStateGraph('', 'Top', {}, true);

					// Assert store data
					// TODO
					getWPDataObject().then((data) => {
						// expect({
						// 	type: 'relative',
						// 	position: {
						// 		top: '',
						// 		left: '',
						// 		bottom: '15px',
						// 		right: '',
						// 	},
						// }).to.be.deep.eq(
						// 	getSelectedBlock(data, 'blockeraPosition')
						// );
						// expect({}).to.be.deep.eq(
						// 	getSelectedBlock(data, 'blockeraBlockStates').normal
						// 		.breakpoints.tablet.attributes
						// );
					});
				}
			);

			context('set value in normal/laptop', () => {
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
				// TODO
				// cy.checkStateGraph('Position', 'Relative', {
				// 	laptop: ['Normal'],
				// });

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

				// Hover/Laptop
				setBlockState('Hover');
				// Assert label
				// TODO
				// cy.getByAriaLabel('Top Position').should(
				// 	'have.class',
				// 	'changed-in-normal-state'
				// );

				// Assert control
				// TODO
				//checkPositionValue('top-position', 30);
				checkPositionValue('bottom-position', 15);

				// Assert state graph
				// TODO
				// cy.checkStateGraph('Position', 'Relative', {
				// 	laptop: ['Normal'],
				// });
				cy.getByAriaLabel('Top Position').click();
				cy.checkStateGraph('', 'Top', { laptop: ['Normal'] }, true);

				// Assert store data
				// TODO
				// getWPDataObject().then((data) => {
				// 	expect({}).to.be.deep.eq(
				// 		getSelectedBlock(data, 'blockeraBlockStates').hover
				// 			.breakpoints.laptop.attributes
				// 	);
				// });
			});
		});
	});
});
