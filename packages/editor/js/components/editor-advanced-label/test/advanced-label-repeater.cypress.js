import {
	addBlockToPost,
	createPost,
	setBlockState,
	addBlockState,
	setDeviceType,
	getWPDataObject,
	getSelectedBlock,
} from '../../../../../dev-cypress/js/helpers';

describe('Repeater Control label testing (Image & Gradient)', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');
	});

	const openBackgroundItem = (index = 0) => {
		cy.getParentContainer('Image & Gradient').within(() => {
			cy.getByDataCy('group-control-header').eq(index).click();
		});
	};

	it('should display changed value on Image & Gradient -> Normal -> Laptop', () => {
		// Assert label before set value
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		cy.getByAriaLabel('Add New Background').click();

		// Assert label after set value
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-normal-state',
			'have'
		);

		// Assert control
		cy.getParentContainer('Image & Gradient').within(() => {
			// Alias
			cy.getByDataCy('group-control-header').as('background-item');
		});
		cy.get('@background-item').should('have.length', 1);

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-normal-state',
			'have'
		);

		// Assert control
		cy.get('@background-item').should('have.length', 1);

		/**
		 * Pseudo State (Hover/Tablet)
		 */
		addBlockState('hover');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-normal-state',
			'have'
		);

		// Assert control
		cy.get('@background-item').should('have.length', 1);

		// Assert state graph
		cy.checkStateGraph('Background', 'Image & Gradient', {
			laptop: ['Normal'],
		});
	});

	it('should display changed value on Image & Gradient -> Hover -> Laptop', () => {
		/**
		 * Hover
		 */
		addBlockState('hover');
		// Assert label before set value
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		cy.getByAriaLabel('Add New Background').click();

		// Assert label after set value
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-secondary-state'
		);
		// Assert control
		cy.getParentContainer('Image & Gradient').within(() => {
			// Alias
			cy.getByDataCy('group-control-header').as('background-item');
		});
		cy.get('@background-item').should('have.length', 1);

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@background-item').should('have.length', 0);

		/**
		 * Active
		 */
		addBlockState('active');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@background-item').should('have.length', 0);

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@background-item').should('have.length', 0);

		// Assert state graph
		cy.checkStateGraph('Background', 'Image & Gradient', {
			laptop: ['Hover'],
		});
	});

	it('should display changed value on Image & Gradient, when set value in two states', () => {
		/**
		 * Normal
		 */
		// Set value
		cy.getByAriaLabel('Add New Background').click();

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-normal-state'
		);

		/**
		 * Hover
		 */
		addBlockState('hover');

		// Assert label before set value
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-normal-state'
		);

		// Set value
		cy.getByAriaLabel('Add New Background').click();

		// Assert label after set value
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-secondary-state'
		);

		// Assert control
		cy.getParentContainer('Image & Gradient').within(() => {
			// Alias
			cy.getByDataCy('group-control-header').as('background-item');
		});
		cy.get('@background-item').should('have.length', 2);

		/**
		 * Active
		 */
		addBlockState('active');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-normal-state'
		);

		// Assert control
		cy.get('@background-item').should('have.length', 1);

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-normal-state'
		);

		// Assert control
		cy.get('@background-item').should('have.length', 1);

		// Assert state graph
		cy.checkStateGraph('Background', 'Image & Gradient', {
			laptop: ['Normal', 'Hover'],
		});
	});

	it('should display changed value on Image & Gradient -> Normal -> Tablet', () => {
		setDeviceType('Tablet');
		// Assert label before set value
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		cy.getByAriaLabel('Add New Background').click();

		// Assert label after set value
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-normal-state'
		);

		// Assert control
		cy.getParentContainer('Image & Gradient').within(() => {
			// Alias
			cy.getByDataCy('group-control-header').as('background-item');
		});
		cy.get('@background-item').should('have.length', 1);
		/**
		 * Laptop device
		 */
		setDeviceType('Laptop');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@background-item').should('have.length', 0);

		// Assert state graph
		cy.checkStateGraph('Background', 'Image & Gradient', {
			tablet: ['Normal'],
		});
	});

	it('should display changed value on Image & Gradient -> Hover -> Tablet', () => {
		setDeviceType('Tablet');
		/**
		 * Hover
		 */
		addBlockState('hover');
		// Assert label before set value
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		cy.getByAriaLabel('Add New Background').click();

		// Assert label after set value
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-secondary-state'
		);
		// Assert control
		cy.getParentContainer('Image & Gradient').within(() => {
			// Alias
			cy.getByDataCy('group-control-header').as('background-item');
		});
		cy.get('@background-item').should('have.length', 1);

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@background-item').should('have.length', 0);

		/**
		 * Active
		 */
		addBlockState('active');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@background-item').should('have.length', 0);

		/**
		 * Laptop device (Active)
		 */
		setDeviceType('Laptop');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@background-item').should('have.length', 0);

		/**
		 * Laptop device (Normal)
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@background-item').should('have.length', 0);

		// Assert state graph
		cy.checkStateGraph('Background', 'Image & Gradient', {
			tablet: ['Hover'],
		});
	});

	it('repeater nested items test...', () => {
		context('Normal -> Laptop -> set background item + set type', () => {
			cy.getByAriaLabel('Add New Background').click();

			cy.getByDataTest('popover-body').within(() => {
				cy.getByAriaLabel('Linear Gradient').click();

				// Alias
				cy.getByAriaLabel('Type').as('type');
				cy.getByAriaLabel('Angel').as('angel');

				// Assert label in normal state
				cy.get('@type').should('have.class', 'changed-in-normal-state');
			});
		});

		context(
			'Hover -> Laptop -> should correctly display mutated labels',
			() => {
				addBlockState('hover');
				openBackgroundItem();

				// Assert Type label
				cy.get('@type').should('have.class', 'changed-in-normal-state');
			}
		);

		context('Hover -> Laptop -> set angel', () => {
			// Assert angel label before set value
			cy.get('@angel').should(
				'not.have.class',
				'changed-in-normal-state'
			);

			// Set value
			cy.getByAriaLabel('Rotate Anti-clockwise').click();

			// Assert Angel label
			cy.get('@angel').should('have.class', 'changed-in-secondary-state');
		});

		context(
			'Active -> Laptop -> should correctly display mutated labels',
			() => {
				addBlockState('active');
				openBackgroundItem();

				// Assert Type label
				cy.get('@type').should('have.class', 'changed-in-normal-state');

				// Assert Angel label
				cy.get('@angel').should('have.class', 'changed-in-other-state');
			}
		);

		context('Active -> Laptop -> set type + set position', () => {
			// Set type
			cy.getByAriaLabel('Radial Gradient').click();

			// Set position
			cy.getParentContainer('Top').within(() =>
				cy.get('input').type('{selectall}30')
			);

			// Assert Type label
			cy.get('@type').should('have.class', 'changed-in-secondary-state');

			// Assert Position label
			cy.getByAriaLabel('Position')
				.as('position-label')
				.should('have.class', 'changed-in-secondary-state');
			cy.getByAriaLabel('Top')
				.as('position-top-label')
				.should('have.class', 'changed-in-secondary-state');
		});

		context(
			'Active -> Tablet -> should correctly display mutated labels',
			() => {
				setDeviceType('Tablet');
				openBackgroundItem();

				// Assert Type label
				cy.get('@type').should('have.class', 'changed-in-normal-state');

				// Assert Angel label
				cy.get('@angel').should('have.class', 'changed-in-other-state');
			}
		);

		context('Active -> Tablet -> set effect', () => {
			// Set effect
			cy.getByAriaLabel('Parallax').click();

			// Assert Effect label
			cy.getByAriaLabel('Effect').should(
				'have.class',
				'changed-in-secondary-state'
			);
		});

		context(
			'Normal -> Tablet -> should correctly display mutated labels',
			() => {
				setBlockState('Normal');
				openBackgroundItem();

				// Assert Type label
				cy.get('@type').should('have.class', 'changed-in-normal-state');

				// Assert Angel label
				cy.get('@angel').should('have.class', 'changed-in-other-state');

				// Assert Effect label
				cy.getByAriaLabel('Effect').should(
					'have.class',
					'changed-in-other-state'
				);
			}
		);

		context('Normal -> Tablet -> set type + set effect', () => {
			// Set type
			cy.getByAriaLabel('Radial Gradient').click();
			// Set effect
			cy.getByAriaLabel('Parallax').click();

			// Assert Type label
			cy.get('@type').should('have.class', 'changed-in-normal-state');

			// Assert Effect label
			cy.getByAriaLabel('Effect').should(
				'have.class',
				'changed-in-normal-state'
			);

			// Assert Position label
			cy.get('@position-label').should(
				'have.class',
				'changed-in-other-state'
			);
			cy.get('@position-top-label').should(
				'have.class',
				'changed-in-other-state'
			);
		});

		context('Normal -> Laptop -> add radial gradient item', () => {
			setDeviceType('Laptop');

			// Add new item
			cy.getByAriaLabel('Add New Background').click();

			// Set type
			cy.getByAriaLabel('Radial Gradient').last().click();
		});

		context(
			'should display correct label color and state graph when navigate between states and devices',
			() => {
				/**
				 * Normal/Laptop
				 */
				// Assert type label
				cy.get('@type').should('have.class', 'changed-in-normal-state');
				// Assert Effect label
				cy.getByAriaLabel('Effect').should(
					'have.class',
					'changed-in-other-state'
				);
				// Assert Position label
				cy.get('@position-label').should(
					'have.class',
					'changed-in-other-state'
				);
				cy.get('@position-top-label').should(
					'have.class',
					'changed-in-other-state'
				);

				/**
				 * Hover / Laptop
				 */
				setBlockState('Hover');
				openBackgroundItem();

				// Assert Type label
				cy.get('@type').should('have.class', 'changed-in-normal-state');

				// Assert Angel label
				cy.get('@angel').should(
					'have.class',
					'changed-in-secondary-state'
				);

				// Assert Effect label
				cy.getByAriaLabel('Effect').should(
					'have.class',
					'changed-in-other-state'
				);

				/**
				 * Hover / Tablet
				 */
				setDeviceType('Tablet');
				openBackgroundItem();

				// Assert Type label
				cy.get('@type').should('have.class', 'changed-in-normal-state');

				// Assert Angel label
				cy.get('@angel').should('have.class', 'changed-in-other-state');

				// Assert Effect label
				cy.getByAriaLabel('Effect').should(
					'have.class',
					'changed-in-other-state'
				);

				/**
				 * Normal/Tablet
				 */
				setBlockState('Normal');
				openBackgroundItem();

				// Assert Type label
				cy.get('@type').should('have.class', 'changed-in-normal-state');

				// Assert Position label
				cy.get('@position-label').should(
					'have.class',
					'changed-in-other-state'
				);

				// Assert Effect label
				cy.getByAriaLabel('Effect').should(
					'have.class',
					'changed-in-normal-state'
				);

				/**
				 * Normal/Laptop
				 */
				setDeviceType('Laptop');
				// Linear Gradient item
				openBackgroundItem();

				// Assert Type label
				cy.get('@type').should('have.class', 'changed-in-normal-state');

				// Assert Angel label
				cy.get('@angel').should('have.class', 'changed-in-other-state');

				// Assert Effect label
				cy.getByAriaLabel('Effect').should(
					'have.class',
					'changed-in-other-state'
				);

				// Assert state graph
				// Type
				cy.checkStateGraph('', 'Type', { laptop: ['Normal'] }, true);

				// Angel
				cy.checkStateGraph(
					'',
					'Angel',
					{ laptop: ['Hover'] },

					true
				);

				// Effect
				cy.checkStateGraph('', 'Effect', { tablet: ['Active'] }, true);

				// Radial Gradient item
				openBackgroundItem(1);

				// Assert Type label
				cy.get('@type').should('have.class', 'changed-in-normal-state');

				// Assert Position label
				cy.get('@position-label').should(
					'have.class',
					'changed-in-other-state'
				);

				// Assert Effect label
				cy.getByAriaLabel('Effect').should(
					'have.class',
					'changed-in-other-state'
				);

				// Assert state graph
				// Type
				cy.checkStateGraph('', 'Type', { laptop: ['Normal'] }, true);

				cy.checkStateGraph(
					'',
					'Position',
					{ laptop: ['Active'] },
					true
				);

				cy.checkStateGraph('', 'Effect', { tablet: ['Normal'] }, true);

				/**
				 * Active / Laptop
				 */
				setBlockState('Active');
				openBackgroundItem();

				// Assert Type label
				cy.getByAriaLabel('Type').should(
					'have.class',
					'changed-in-normal-state'
				);

				// Assert Position label
				cy.getByAriaLabel('Position').should(
					'have.class',
					'changed-in-secondary-state'
				);

				// Assert Position label
				cy.getByAriaLabel('Effect').should(
					'have.class',
					'changed-in-other-state'
				);
			}
		);
	});

	describe('reset action testing...', () => {
		it('repeater item :', () => {
			// Set value in normal/laptop
			cy.getByAriaLabel('Add New Background').click();

			// Set value in hover/laptop
			addBlockState('hover');
			openBackgroundItem();
			cy.getByAriaLabel('Cover').click();

			context(
				'should correctly reset blockeraBackground, and display effected fields(label, control, stateGraph) in hover/laptop',
				() => {
					// Reset
					cy.resetBlockeraAttribute(
						'Background',
						'Image & Gradient',
						'reset'
					);

					openBackgroundItem();

					// Assert label
					// TODO
					//  cy.checkLabelClassName('Background','Image & Gradient','changed-in-normal-state')
					cy.getByAriaLabel('Size').should(
						'not.have.class',
						'changed-in-secondary-state'
					);

					// Assert control
					cy.getByAriaLabel('Cover').should(
						'not.have.attr',
						'aria-checked',
						'true'
					);

					// Assert state graph
					cy.checkStateGraph('Background', 'Image & Gradient', {
						laptop: ['Normal'],
					});

					// Assert store data
					getWPDataObject().then((data) => {
						expect('custom').to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBackground')[
								'image-0'
							]['image-size']
						);

						// TODO
						// expect({}).to.be.deep.eq(
						// 	getSelectedBlock(data, 'blockeraBlockStates').hover
						// 		.breakpoints.laptop.attributes

						// );
					});
				}
			);

			context('set value in normal/laptop', () => {
				setBlockState('Normal');

				openBackgroundItem();

				// Assert before set value
				// Assert label
				cy.checkLabelClassName(
					'Background',
					'Image & Gradient',
					'changed-in-normal-state'
				);
				cy.getByAriaLabel('Size').should(
					'not.have.class',
					'changed-in-other-state'
				);

				// Assert control
				cy.getByAriaLabel('Cover').should(
					'not.have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				cy.checkStateGraph('Background', 'Image & Gradient', {
					laptop: ['Normal'],
				});

				openBackgroundItem();
				// Set value
				cy.getByAriaLabel('Contain').click();

				// Assert label
				cy.getByAriaLabel('Size').should(
					'have.class',
					'changed-in-normal-state'
				);

				// Assert control
				cy.getByAriaLabel('Contain').should(
					'have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				cy.checkStateGraph(
					'',
					'Size',
					{
						laptop: ['Normal'],
					},
					true
				);
				// TODO
				// cy.checkStateGraph('Background', 'Image & Gradient', {
				// 	laptop: ['Normal'],
				// });

				// Assert store data
				getWPDataObject().then((data) => {
					expect('contain').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBackground')['image-0'][
							'image-size'
						]
					);

					// TODO
					// expect({}).to.be.deep.eq(
					// 	getSelectedBlock(data, 'blockeraBlockStates').hover
					// 		.breakpoints.laptop.attributes
					// );
				});
			});
		});

		describe('repeater nested items :', () => {
			beforeEach(() => {
				// Set value in normal/laptop
				cy.getByAriaLabel('Add New Background').click();
				cy.getByAriaLabel('Horizontally').click();

				// Set value in hover/laptop
				addBlockState('hover');
				openBackgroundItem();
				cy.getByAriaLabel('Cover').click();
				cy.getByAriaLabel('Vertically').click();

				// Set value in hover/tablet
				setDeviceType('Tablet');
				openBackgroundItem();
				cy.getByAriaLabel('Contain').click();
				cy.getByAriaLabel("Don't Tile Background").click();

				// Set value in normal/tablet
				setBlockState('Normal');
				openBackgroundItem();
				cy.getByAriaLabel('Parallax').click();
				cy.getByAriaLabel('Vertically').click();

				context(
					'should correctly reset blockeraBackground["image-0"]["image-repeat"], and display effected fields(label, control, stateGraph) in normal/tablet',
					() => {
						// Reset to normal
						cy.resetBlockeraAttribute('', 'Repeat', 'reset', true);

						// Assert label
						cy.getByAriaLabel('Repeat').should(
							'have.class',
							'changed-in-normal-state'
						);

						// TODO : does not reset

						// Assert control
						// TODO
						// cy.getByAriaLabel('Horizontally').should(
						// 	'have.attr',
						// 	'aria-checked',
						// 	'true'
						// );

						// Assert state graph
						// TODO
						// cy.checkStateGraph(
						// 	'',
						// 	'Repeat',
						// 	{
						// 		tablet: ['Hover'],
						// 		laptop: ['Hover', 'Normal'],
						// 	},
						// 	true
						// );

						// Assert store data
						// TODO
						// getWPDataObject().then((data) => {
						// 	expect('repeat-x').to.be.deep.eq(
						// 		getSelectedBlock(data, 'blockeraBlockStates')
						// 			.normal.breakpoints.tablet.attributes
						// 			.blockeraBackground['image-0'][
						// 			'image-repeat'
						// 		]
						// 	);
						// });
					}
				);

				context(
					'should correctly reset  blockeraBackground["image-0"]["image-repeat"], and display effected fields(label, control, stateGraph) in hover/tablet',
					() => {
						setBlockState('Hover');
						openBackgroundItem();
						// Reset to normal
						cy.resetBlockeraAttribute('', 'Repeat', 'reset', true);

						// Assert label
						// TODO
						// cy.getByAriaLabel('Repeat').should(
						// 	'have.class',
						// 	'changed-in-normal-state'
						// );

						// Assert control
						// TODO
						// cy.getByAriaLabel('Horizontally').should(
						// 	'have.attr',
						// 	'aria-checked',
						// 	'true'
						// );

						// Assert state graph
						// TODO
						// cy.checkStateGraph(
						// 	'',
						// 	'Repeat',
						// 	{
						// 		laptop: ['Hover', 'Normal'],
						// 	},
						// 	true
						// );

						// Assert store data
						// TODO
						// getWPDataObject().then((data) => {
						// 	expect('repeat-x').to.be.deep.eq(
						// 		getSelectedBlock(data, 'blockeraBlockStates')
						// 			.hover.breakpoints.tablet.attributes
						// 			.blockeraBackground['image-0'][
						// 			'image-repeat'
						// 		]
						// 	);
						// });
					}
				);

				context(
					'should correctly reset blockeraBackground["image-0"]["image-repeat"], and display effected fields(label, control, stateGraph) in normal/laptop',
					() => {
						setDeviceType('Laptop');
						setBlockState('Normal');
						openBackgroundItem();

						// Reset to normal
						cy.resetBlockeraAttribute('', 'Repeat', 'reset', true);

						// Assert label
						// TODO
						// cy.getByAriaLabel('Repeat').should(
						// 	'have.class',
						// 	'changed-in-other-state'
						// );

						// Assert control
						// TODO
						// cy.getByAriaLabel('Horizontally and Vertically').should(
						// 	'have.attr',
						// 	'aria-checked',
						// 	'true'
						// );

						// Assert state graph
						// TODO
						// cy.checkStateGraph(
						// 	'',
						// 	'Repeat',
						// 	{
						// 		laptop: ['Hover'],
						// 		tablet: ['Normal', 'Hover'],
						// 	},
						// 	true
						// );

						// Assert store data
						// TODO
						// getWPDataObject().then((data) => {
						// 	expect('repeat').to.be.deep.eq(
						// 		getSelectedBlock(data, 'blockeraBackground')[
						// 			'image-0'
						// 		]['image-repeat']
						// 	);
						// });
					}
				);

				context(
					'should correctly reset blockeraBackground["image-0"]["image-repeat"], and display effected fields(label, control, stateGraph) in hover/laptop',
					() => {
						setBlockState('Hover');
						openBackgroundItem();
						// Reset to normal
						cy.resetBlockeraAttribute('', 'Repeat', 'reset', true);

						// Assert label
						// TODO
						// cy.getByAriaLabel('Repeat').should(
						// 	'have.class',
						// 	'changed-in-other-state'
						// );

						// Assert control
						// TODO
						// cy.getByAriaLabel('Horizontally and Vertically').should(
						// 	'have.attr',
						// 	'aria-checked',
						// 	'true'
						// );

						// Assert state graph
						// TODO
						// cy.checkStateGraph(
						// 	'',
						// 	'Repeat',
						// 	{
						// 		tablet: ['Normal', 'Hover'],
						// 	},
						// 	true
						// );

						// Assert store data
						// TODO
						// getWPDataObject().then((data) => {
						// 	expect('repeat').to.be.deep.eq(
						// 		getSelectedBlock(data, 'blockeraBlockStates')
						// 			.hover.breakpoints.laptop.attributes
						// 			.blockeraBackground['image-0'][
						// 			'image-repeat'
						// 		]
						// 	);
						// });
					}
				);
			});

			it('set value in normal/laptop and navigate between states', () => {
				setBlockState('Normal');
				openBackgroundItem();

				cy.getByAriaLabel('Vertically').click();

				// Assert label
				cy.getByAriaLabel('Repeat').should(
					'have.class',
					'changed-in-normal-state'
				);

				// Assert control
				cy.getByAriaLabel('Vertically').should(
					'have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				// TODO
				// cy.checkStateGraph(
				// 	'',
				// 	'Repeat',
				// 	{
				// 		laptop: ['Normal'],
				// 		tablet: ['Normal', 'Hover'],
				// 	},
				// 	true
				// );

				// Navigate between states and devices
				// Hover/Laptop
				setBlockState('Hover');
				openBackgroundItem();
				// Assert label
				// TODO
				// cy.getByAriaLabel('Repeat')
				// 	.should('not.have.class', 'changed-in-normal-state')
				// 	.and('not.have.class', 'changed-in-secondary-state');

				// Assert control
				// TODO
				// cy.getByAriaLabel('Horizontally and Vertically').should(
				// 	'have.attr',
				// 	'aria-checked',
				// 	'true'
				// );

				// Assert state graph
				// TODO
				// cy.checkStateGraph(
				// 	'',
				// 	'Repeat',
				// 	{
				// 		laptop: ['Normal'],
				// 		tablet: ['Normal', 'Hover'],
				// 	},
				// 	true
				// );

				// Hover/Tablet
				setDeviceType('Tablet');
				openBackgroundItem();

				// Assert label
				// TODO
				// cy.getByAriaLabel('Repeat')
				// 	.and('have.class', 'changed-in-secondary-state');

				// Assert control
				// TODO
				// cy.getByAriaLabel('Horizontally').should(
				// 	'have.attr',
				// 	'aria-checked',
				// 	'true'
				// );

				// Assert state graph
				// TODO
				// cy.checkStateGraph(
				// 	'',
				// 	'Repeat',
				// 	{
				// 		laptop: ['Normal'],
				// 		tablet: ['Normal', 'Hover'],
				// 	},
				// 	true
				// );

				// Normal/Tablet
				setBlockState('Normal');
				openBackgroundItem();

				// Assert label
				// TODO
				// cy.getByAriaLabel('Repeat')
				// 	.and('have.class', 'changed-in-normal-state');

				// Assert control
				// TODO
				// cy.getByAriaLabel('Horizontally').should(
				// 	'have.attr',
				// 	'aria-checked',
				// 	'true'
				// );

				// Assert state graph
				// TODO
				// cy.checkStateGraph(
				// 	'',
				// 	'Repeat',
				// 	{
				// 		laptop: ['Normal'],
				// 		tablet: ['Normal', 'Hover'],
				// 	},
				// 	true
				// );

				// Assert store data
				getWPDataObject().then((data) => {
					expect('repeat-y').to.be.eq(
						getSelectedBlock(data, 'blockeraBackground')['image-0'][
							'image-repeat'
						]
					);

					// TODO
					// expect('repeat-x').to.be.deep.eq(
					// 	getSelectedBlock(data, 'blockeraBlockStates').normal
					// 		.breakpoints.tablet.attributes.blockeraBackground['image-0']['image-repeat']
					// );

					// TODO
					// expect('repeat').to.be.deep.eq(
					// 	getSelectedBlock(data, 'blockeraBlockStates').hover
					// 		.breakpoints.laptop.attributes.blockeraBackground['image-0']['image-repeat']
					// );

					// TODO
					// expect('repeat-x').to.be.deep.eq(
					// 	getSelectedBlock(data, 'blockeraBlockStates').hover
					// 		.breakpoints.tablet.attributes.blockeraBackground['image-0']['image-repeat']
					// );
				});
			});

			it('set value in hover/laptop and navigate between states', () => {
				openBackgroundItem();

				cy.getByAriaLabel("Don't Tile Background").click();

				// Assert label
				cy.getByAriaLabel('Repeat').should(
					'have.class',
					'changed-in-secondary-state'
				);

				// Assert control
				cy.getByAriaLabel("Don't Tile Background").should(
					'have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				// TODO
				// cy.checkStateGraph(
				// 	'',
				// 	'Repeat',
				// 	{
				// 		laptop: ['Hover'],
				// 		tablet: ['Normal', 'Hover'],
				// 	},
				// 	true
				// );

				// Navigate between states and devices:
				// Normal/Laptop
				setBlockState('Normal');
				openBackgroundItem();

				// Assert label
				// TODO
				// cy.getByAriaLabel('Repeat').should(
				// 	'have.class',
				// 	'changed-in-other-state'
				// );

				// Assert control
				// TODO
				// cy.getByAriaLabel('Horizontally and Vertically').should(
				// 	'have.attr',
				// 	'aria-checked',
				// 	'true'
				// );

				// Assert state graph
				// TODO
				// cy.checkStateGraph(
				// 	'',
				// 	'Repeat',
				// 	{
				// 		laptop: ['Hover'],
				// 		tablet: ['Normal', 'Hover'],
				// 	},
				// 	true
				// );

				// Normal/Tablet
				setDeviceType('Tablet');
				openBackgroundItem();

				// Assert label
				// TODO
				// cy.getByAriaLabel('Repeat').should(
				// 	'have.class',
				// 	'changed-in-secondary-state'
				// );

				// Assert control
				// TODO
				// cy.getByAriaLabel('Horizontally').should(
				// 	'have.attr',
				// 	'aria-checked',
				// 	'true'
				// );

				// Assert state graph
				// TODO
				// cy.checkStateGraph(
				// 	'',
				// 	'Repeat',
				// 	{
				// 		laptop: ['Hover'],
				// 		tablet: ['Normal', 'Hover'],
				// 	},
				// 	true
				// );

				// Hover/Tablet
				setBlockState('Hover');
				openBackgroundItem();

				// Assert label
				// TODO
				// cy.getByAriaLabel('Repeat').should(
				// 	'have.class',
				// 	'changed-in-secondary-state'
				// );

				// Assert control
				// TODO
				// cy.getByAriaLabel('Horizontally').should(
				// 	'have.attr',
				// 	'aria-checked',
				// 	'true'
				// );

				// Assert state graph
				// TODO
				// cy.checkStateGraph(
				// 	'',
				// 	'Repeat',
				// 	{
				// 		laptop: ['Hover'],
				// 		tablet: ['Normal', 'Hover'],
				// 	},
				// 	true
				// );

				// Assert store data
				getWPDataObject().then((data) => {
					// TODO
					// expect('repeat').to.be.eq(
					// 	getSelectedBlock(data, 'blockeraBackground')['image-0'][
					// 		'image-repeat'
					// 	]
					// );
					// TODO
					// expect('repeat-x').to.be.deep.eq(
					// 	getSelectedBlock(data, 'blockeraBlockStates').normal
					// 		.breakpoints.tablet.attributes.blockeraBackground['image-0']['image-repeat']
					// );
					// TODO
					// expect('repeat-y').to.be.deep.eq(
					// 	getSelectedBlock(data, 'blockeraBlockStates').hover
					// 		.breakpoints.laptop.attributes.blockeraBackground['image-0']['image-repeat']
					// );
					// TODO
					// expect('repeat-x').to.be.deep.eq(
					// 	getSelectedBlock(data, 'blockeraBlockStates').hover
					// 		.breakpoints.tablet.attributes.blockeraBackground['image-0']['image-repeat']
					// );
				});
			});
		});
	});

	describe('reset-all action testing...', () => {
		it('repeater item :', () => {
			// Set value in normal/laptop
			cy.getByAriaLabel('Add New Background').click();

			// Set value in hover/laptop
			addBlockState('hover');
			openBackgroundItem();
			cy.getByAriaLabel('Cover').click();

			// Reset all
			cy.resetBlockeraAttribute(
				'Background',
				'Image & Gradient',
				'reset-all'
			);

			context(
				'should correctly reset blockeraBackground, and display effected fields(label, control, stateGraph) in all states',
				() => {
					// Assert label
					cy.checkLabelClassName(
						'Background',
						'Image & Gradient',
						'changed-in-normal-state',
						'not-have'
					);
					// TODO
					// cy.checkLabelClassName(
					// 	'Background',
					// 	'Image & Gradient',
					// 	'changed-in-secondary-state',
					// 	'not-have'
					// );

					// Assert control
					// TODO
					// cy.getParentContainer('Image & Gradient').within(() =>
					// 	cy
					// 		.getByDataCy('group-control-header')
					// 		.should('have.length', 0)
					// );

					// Assert state graph
					// TODO
					//	cy.checkStateGraph('Background', 'Image & Gradient', {});

					// Normal/Laptop
					setBlockState('Normal');

					// Assert label
					// TODO
					// cy.checkLabelClassName(
					// 	'Background',
					// 	'Image & Gradient',
					// 	'changed-in-normal-state',
					// 	'not-have'
					// );

					// Assert control
					// TODO
					// cy.getParentContainer('Image & Gradient').within(() =>
					// 	cy
					// 		.getByDataCy('group-control-header')
					// 		.should('have.length', 0)
					// );

					// Assert state graph
					// TODO
					//	cy.checkStateGraph('Background', 'Image & Gradient', {});

					// Assert store data
					getWPDataObject().then((data) => {
						// TODO
						// expect({}).to.be.deep.eq(
						// 	getSelectedBlock(data, 'blockeraBackground')
						// );
						// TODO
						// expect({}).to.be.deep.eq(
						// 	getSelectedBlock(data, 'blockeraBlockStates').hover
						// 		.breakpoints.laptop.attributes
						// );
					});
				}
			);

			context(
				'set value in normal/laptop and navigate between states',
				() => {
					cy.getByAriaLabel('Add New Background').click();

					// Assert label
					cy.checkLabelClassName(
						'Background',
						'Image & Gradient',
						'changed-in-normal-state'
					);

					// Assert control
					cy.getParentContainer('Image & Gradient').within(() =>
						cy
							.getByDataCy('group-control-header')
							.should('have.length', 1)
					);

					// Assert state graph
					// TODO
					// cy.checkStateGraph('Background', 'Image & Gradient', {
					// 	laptop: ['Normal'],
					// });

					// Hover/Laptop
					setBlockState('Hover');
					// Assert label
					// TODO
					// cy.checkLabelClassName(
					// 	'Background',
					// 	'Image & Gradient',
					// 	'changed-in-normal-state'
					// );

					// Assert control
					cy.getParentContainer('Image & Gradient').within(() =>
						cy
							.getByDataCy('group-control-header')
							.should('have.length', 1)
					);

					// Assert state graph
					// TODO
					// cy.checkStateGraph('Background', 'Image & Gradient', {
					// 	laptop: ['Normal'],
					// });

					// Assert store data
					getWPDataObject().then((data) => {
						expect(1).to.be.deep.eq(
							Object.keys(
								getSelectedBlock(data, 'blockeraBackground')
							).length
						);

						// TODO
						// expect({}).to.be.deep.eq(
						// 	getSelectedBlock(data, 'blockeraBlockStates').hover
						// 		.breakpoints.laptop.attributes
						// );
					});
				}
			);
		});

		describe('repeater nested items :', () => {
			beforeEach(() => {
				// Set value in normal/laptop
				cy.getByAriaLabel('Add New Background').click();
				cy.getByAriaLabel('Horizontally').click();

				// Set value in hover/laptop
				addBlockState('hover');
				openBackgroundItem();
				cy.getByAriaLabel('Cover').click();
				cy.getByAriaLabel('Vertically').click();

				// Set value in hover/tablet
				setDeviceType('Tablet');
				openBackgroundItem();
				cy.getByAriaLabel('Contain').click();
				cy.getByAriaLabel("Don't Tile Background").click();

				// Set value in normal/tablet
				setBlockState('Normal');
				openBackgroundItem();
				cy.getByAriaLabel('Parallax').click();
				cy.getByAriaLabel('Vertically').click();

				// Reset All
				cy.resetBlockeraAttribute('', 'Repeat', 'reset-all', true);

				context(
					'should correctly reset blockeraBackground["image-0"]["image-repeat"], and display effected fields(label, control, stateGraph) in all states',
					() => {
						// Normal/Tablet
						// Assert label
						// TODO : does not reset
						// cy.getByAriaLabel('Repeat').should(
						// 	'not.have.class',
						// 	'changed-in-normal-state'
						// );

						// Assert control
						// TODO
						// cy.getByAriaLabel('Horizontally and Vertically').should(
						// 	'have.attr',
						// 	'aria-checked',
						// 	'true'
						// );

						// Assert state graph
						// TODO
						// cy.checkStateGraph(
						// 	'',
						// 	'Repeat',
						// 	{},
						// 	true
						// );

						// Hover/Tablet
						setBlockState('Hover');
						openBackgroundItem();

						// Assert label
						// TODO : does not reset
						// cy.getByAriaLabel('Repeat').should(
						// 	'not.have.class',
						// 	'changed-in-secondary-state'
						// );

						// Assert control
						// TODO
						// cy.getByAriaLabel('Horizontally and Vertically').should(
						// 	'have.attr',
						// 	'aria-checked',
						// 	'true'
						// );

						// Assert state graph
						// TODO
						// cy.checkStateGraph(
						// 	'',
						// 	'Repeat',
						// 	{},
						// 	true
						// );

						// Hover/Laptop
						setDeviceType('Laptop');
						openBackgroundItem();

						// Assert label
						// TODO : does not reset
						// cy.getByAriaLabel('Repeat').should(
						// 	'not.have.class',
						// 	'changed-in-secondary-state'
						// );

						// Assert control
						// TODO
						// cy.getByAriaLabel('Horizontally and Vertically').should(
						// 	'have.attr',
						// 	'aria-checked',
						// 	'true'
						// );

						// Assert state graph
						// TODO
						// cy.checkStateGraph(
						// 	'',
						// 	'Repeat',
						// 	{},
						// 	true
						// );

						// Normal/Laptop
						setBlockState('Normal');
						openBackgroundItem();

						// Assert label
						// TODO : does not reset
						// cy.getByAriaLabel('Repeat').should(
						// 	'not.have.class',
						// 	'changed-in-normal-state'
						// );

						// Assert control
						// TODO
						// cy.getByAriaLabel('Horizontally and Vertically').should(
						// 	'have.attr',
						// 	'aria-checked',
						// 	'true'
						// );

						// Assert state graph
						// TODO
						// cy.checkStateGraph(
						// 	'',
						// 	'Repeat',
						// 	{},
						// 	true
						// );

						// Assert store data
						getWPDataObject().then((data) => {
							// TODO
							// expect('repeat').to.be.deep.eq(
							// 	getSelectedBlock(data, 'blockeraBackground')[
							// 		'image-0'
							// 	]['image-repeat']
							// );
							// expect('repeat').to.be.deep.eq(
							// 	getSelectedBlock(data, 'blockeraBlockStates').normal
							// 		.breakpoints.tablet.attributes
							// 		.blockeraBackground['image-0']['image-repeat']
							// );
							// expect('repeat').to.be.deep.eq(
							// 	getSelectedBlock(data, 'blockeraBlockStates').hover
							// 		.breakpoints.laptop.attributes
							// 		.blockeraBackground['image-0']['image-repeat']
							// );
							// expect('repeat').to.be.deep.eq(
							// 	getSelectedBlock(data, 'blockeraBlockStates').hover
							// 		.breakpoints.tablet.attributes
							// 		.blockeraBackground['image-0']['image-repeat']
							// );
						});
					}
				);
			});

			it('set value in normal/laptop and navigate between states', () => {
				cy.getByAriaLabel('Vertically').click();

				// Assert label
				cy.getByAriaLabel('Repeat').should(
					'have.class',
					'changed-in-normal-state'
				);

				// Assert control
				cy.getByAriaLabel('Vertically').should(
					'have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				// TODO
				// cy.checkStateGraph(
				// 	'',
				// 	'Repeat',
				// 	{laptop:['Normal]},
				// 	true
				// );

				// Navigate between states and devices
				// Hover/Laptop
				setBlockState('Hover');
				openBackgroundItem();

				// Assert label
				// TODO
				// cy.getByAriaLabel('Repeat').should(
				// 	'have.class',
				// 	'changed-in-normal-state'
				// )

				// Assert control
				// TODO
				// cy.getByAriaLabel('Horizontally and Vertically').should(
				// 	'have.attr',
				// 	'aria-checked',
				// 	'true'
				// );

				// Assert state graph
				// TODO
				// cy.checkStateGraph(
				// 	'',
				// 	'Repeat',
				// 	{laptop:['Normal]},
				// 	true
				// );

				// Hover/Tablet
				setDeviceType('Tablet');
				openBackgroundItem();

				// Assert label
				// TODO
				// cy.getByAriaLabel('Repeat').should(
				// 	'have.class',
				// 	'changed-in-normal-state'
				// )

				// Assert control
				// TODO
				// cy.getByAriaLabel('Horizontally and Vertically').should(
				// 	'have.attr',
				// 	'aria-checked',
				// 	'true'
				// );

				// Assert state graph
				// TODO
				// cy.checkStateGraph(
				// 	'',
				// 	'Repeat',
				// 	{laptop:['Normal]},
				// 	true
				// );

				// Normal/Laptop
				setBlockState('Normal');
				openBackgroundItem();

				// Assert label
				// TODO
				// cy.getByAriaLabel('Repeat').should(
				// 	'have.class',
				// 	'changed-in-normal-state'
				// )

				// Assert control
				// TODO
				// cy.getByAriaLabel('Horizontally and Vertically').should(
				// 	'have.attr',
				// 	'aria-checked',
				// 	'true'
				// );

				// Assert state graph
				// TODO
				// cy.checkStateGraph(
				// 	'',
				// 	'Repeat',
				// 	{laptop:['Normal]},
				// 	true
				// );

				// Assert store data
				getWPDataObject().then((data) => {
					// TODO
					// expect('repeat-y').to.be.deep.eq(
					// 	getSelectedBlock(data, 'blockeraBackground')[
					// 		'image-0'
					// 	]['image-repeat']
					// );
					// expect('repeat').to.be.deep.eq(
					// 	getSelectedBlock(data, 'blockeraBlockStates').normal
					// 		.breakpoints.tablet.attributes
					// 		.blockeraBackground['image-0']['image-repeat']
					// );
					// expect('repeat').to.be.deep.eq(
					// 	getSelectedBlock(data, 'blockeraBlockStates').hover
					// 		.breakpoints.laptop.attributes
					// 		.blockeraBackground['image-0']['image-repeat']
					// );
					// expect('repeat').to.be.deep.eq(
					// 	getSelectedBlock(data, 'blockeraBlockStates').hover
					// 		.breakpoints.tablet.attributes
					// 		.blockeraBackground['image-0']['image-repeat']
					// );
				});
			});

			it('set value in hover/laptop and navigate between states', () => {
				setBlockState('Hover');
				openBackgroundItem();
				cy.getByAriaLabel('Horizontally').click();

				// Assert label
				cy.getByAriaLabel('Repeat').should(
					'have.class',
					'changed-in-secondary-state'
				);

				// Assert control
				cy.getByAriaLabel('Horizontally').should(
					'have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				// TODO
				// cy.checkStateGraph(
				// 	'',
				// 	'Repeat',
				// 	{laptop:['Hover]},
				// 	true
				// );

				// Navigate between states and devices
				// Normal/Laptop
				setBlockState('Normal');
				openBackgroundItem();

				// Assert label
				// TODO
				// cy.getByAriaLabel('Repeat').should(
				// 	'have.class',
				// 	'changed-in-other-state'
				// );

				// Assert control
				// TODO
				// cy.getByAriaLabel('Horizontally and Vertically').should(
				// 	'have.attr',
				// 	'aria-checked',
				// 	'true'
				// );

				// Assert state graph
				// TODO
				// cy.checkStateGraph(
				// 	'',
				// 	'Repeat',
				// 	{laptop:['Hover]},
				// 	true
				// );

				// Normal/Tablet
				setDeviceType('Tablet');
				openBackgroundItem();

				// Assert label
				// TODO
				// cy.getByAriaLabel('Repeat').should(
				// 	'have.class',
				// 	'changed-in-other-state'
				// );

				// Assert control
				// TODO
				// cy.getByAriaLabel('Horizontally and Vertically').should(
				// 	'have.attr',
				// 	'aria-checked',
				// 	'true'
				// );

				// Assert state graph
				// TODO
				// cy.checkStateGraph(
				// 	'',
				// 	'Repeat',
				// 	{laptop:['Hover]},
				// 	true
				// );

				// Hover/Tablet
				setBlockState('Hover');
				openBackgroundItem();

				// Assert label
				// TODO
				// cy.getByAriaLabel('Repeat').should(
				// 	'have.class',
				// 	'changed-in-other-state'
				// );

				// Assert control
				// TODO
				// cy.getByAriaLabel('Horizontally and Vertically').should(
				// 	'have.attr',
				// 	'aria-checked',
				// 	'true'
				// );

				// Assert state graph
				// TODO
				// cy.checkStateGraph(
				// 	'',
				// 	'Repeat',
				// 	{laptop:['Hover]},
				// 	true
				// );

				// Assert store data
				getWPDataObject().then((data) => {
					// TODO
					// expect('repeat').to.be.deep.eq(
					// 	getSelectedBlock(data, 'blockeraBackground')[
					// 		'image-0'
					// 	]['image-repeat']
					// );
					// expect('repeat').to.be.deep.eq(
					// 	getSelectedBlock(data, 'blockeraBlockStates').normal
					// 		.breakpoints.tablet.attributes
					// 		.blockeraBackground['image-0']['image-repeat']
					// );
					// expect('repeat-y').to.be.deep.eq(
					// 	getSelectedBlock(data, 'blockeraBlockStates').hover
					// 		.breakpoints.laptop.attributes
					// 		.blockeraBackground['image-0']['image-repeat']
					// );
					// expect('repeat').to.be.deep.eq(
					// 	getSelectedBlock(data, 'blockeraBlockStates').hover
					// 		.breakpoints.tablet.attributes
					// 		.blockeraBackground['image-0']['image-repeat']
					// );
				});
			});
		});
	});
});
