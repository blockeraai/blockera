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

	it('should display changed value on Image & Gradient -> Normal -> Desktop', () => {
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
			desktop: ['Normal'],
		});
	});

	it('should display changed value on Image & Gradient -> Hover -> Desktop', () => {
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
			desktop: ['Hover'],
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
		openBackgroundItem();
		cy.getByAriaLabel('Linear Gradient').click();

		// Assert label after set value
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-secondary-state'
		);

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

		// Assert state graph
		cy.checkStateGraph('Background', 'Image & Gradient', {
			desktop: ['Normal', 'Hover'],
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
		 * Desktop device
		 */
		setDeviceType('Desktop');

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
		 * Desktop device (Active)
		 */
		setDeviceType('Desktop');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'Image & Gradient',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@background-item').should('have.length', 0);

		/**
		 * Desktop device (Normal)
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
		cy.getByAriaLabel('Add New Background').click();

		cy.getByDataTest('popover-body').within(() => {
			cy.getByAriaLabel('Linear Gradient').click();

			// Alias
			cy.getByAriaLabel('Type').as('type');
			cy.getByAriaLabel('Angel').as('angel');
			cy.getByAriaLabel('Effect').as('effect');

			// Assert label in normal state
			cy.get('@type').should('have.class', 'changed-in-normal-state');
		});

		addBlockState('hover');
		openBackgroundItem();

		// Assert Type label
		cy.get('@type').should('have.class', 'changed-in-normal-state');

		// Assert angel label before set value
		cy.get('@angel').should('not.have.class', 'changed-in-normal-state');

		// Set value
		cy.getByAriaLabel('Rotate Anti-clockwise').click();

		// Assert Angel label
		cy.get('@angel').should('have.class', 'changed-in-secondary-state');

		// Assert angel label before set value
		cy.get('@effect').should('not.have.class', 'changed-in-normal-state');

		// Set value
		cy.getByAriaLabel('Parallax').click();

		// Assert Angel label
		cy.get('@effect').should('have.class', 'changed-in-secondary-state');

		setBlockState('Normal');
		openBackgroundItem();

		// Assert Type label
		cy.get('@type').should('have.class', 'changed-in-normal-state');

		// Assert Angel label
		cy.get('@angel').should('have.class', 'changed-in-other-state');

		// Assert Effect label
		cy.get('@effect').should('have.class', 'changed-in-other-state');

		// Set effect
		cy.getByAriaLabel('Parallax').click();

		// Assert Effect label
		cy.get('@effect').should('have.class', 'changed-in-normal-state');

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
			'changed-in-normal-state'
		);

		/**
		 * Normal/Tablet
		 */
		setBlockState('Normal');
		openBackgroundItem();

		// Assert Effect label
		cy.getByAriaLabel('Effect').should(
			'have.class',
			'changed-in-normal-state'
		);

		// Assert Angel label
		cy.get('@angel').should('have.class', 'changed-in-other-state');
	});

	describe('reset action testing...', () => {
		it('repeater item :', () => {
			// Set value in normal/desktop
			cy.getByAriaLabel('Add New Background').click();

			// Set value in hover/desktop
			addBlockState('hover');
			openBackgroundItem();
			cy.getByAriaLabel('Cover').click();

			// Reset
			cy.resetBlockeraAttribute(
				'Background',
				'Image & Gradient',
				'reset'
			);

			// Assert label
			cy.checkLabelClassName(
				'Background',
				'Image & Gradient',
				'changed-in-normal-state'
			);

			cy.getByAriaLabel('Size').should(
				'not.have.class',
				'changed-in-secondary-state'
			);

			openBackgroundItem();

			// Assert control
			cy.getByAriaLabel('Cover').should(
				'not.have.attr',
				'aria-checked',
				'true'
			);

			// Assert state graph
			cy.checkStateGraph('Background', 'Image & Gradient', {
				desktop: ['Normal'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect('custom').to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBackground')['image-0'][
						'image-size'
					]
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes
				);
			});

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
				desktop: ['Normal'],
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
					desktop: ['Normal'],
				},
				true
			);
			cy.checkStateGraph('Background', 'Image & Gradient', {
				desktop: ['Normal'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect('contain').to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBackground')['image-0'][
						'image-size'
					]
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes
				);
			});
		});

		describe('repeater nested items :', () => {
			beforeEach(() => {
				// Set value in normal/desktop
				cy.getByAriaLabel('Add New Background').click();
				cy.getByAriaLabel('Horizontally').click();

				// Set value in hover/desktop
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

						// Assert control
						cy.getByAriaLabel('Horizontally').should(
							'have.attr',
							'aria-checked',
							'true'
						);

						// Assert state graph
						cy.checkStateGraph(
							'',
							'Repeat',
							{
								tablet: ['Hover'],
								desktop: ['Hover', 'Normal'],
							},
							true
						);

						// Assert store data
						getWPDataObject().then((data) => {
							expect('repeat-x').to.be.deep.eq(
								getSelectedBlock(data, 'blockeraBlockStates')
									.normal.breakpoints.tablet.attributes
									.blockeraBackground['image-0'][
									'image-repeat'
								]
							);
						});
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
						cy.getByAriaLabel('Repeat').should(
							'have.class',
							'changed-in-normal-state'
						);

						// Assert control
						cy.getByAriaLabel('Horizontally').should(
							'have.attr',
							'aria-checked',
							'true'
						);

						// Assert state graph
						cy.checkStateGraph(
							'',
							'Repeat',
							{
								desktop: ['Hover', 'Normal'],
							},
							true
						);

						// Assert store data
						getWPDataObject().then((data) => {
							expect('repeat-x').to.be.deep.eq(
								getSelectedBlock(data, 'blockeraBlockStates')
									.hover.breakpoints.tablet.attributes
									.blockeraBackground['image-0'][
									'image-repeat'
								]
							);
						});
					}
				);

				context(
					'should correctly reset blockeraBackground["image-0"]["image-repeat"], and display effected fields(label, control, stateGraph) in normal/desktop',
					() => {
						setDeviceType('Desktop');
						setBlockState('Normal');
						openBackgroundItem();

						// Reset to normal
						cy.resetBlockeraAttribute('', 'Repeat', 'reset', true);

						// Assert label
						cy.getByAriaLabel('Repeat').should(
							'have.class',
							'changed-in-other-state'
						);

						// Assert control
						cy.getByAriaLabel('Horizontally and Vertically').should(
							'have.attr',
							'aria-checked',
							'true'
						);

						// Assert state graph
						cy.checkStateGraph(
							'',
							'Repeat',
							{
								desktop: ['Hover'],
								tablet: ['Normal', 'Hover'],
							},
							true
						);

						// Assert store data
						getWPDataObject().then((data) => {
							expect('repeat').to.be.deep.eq(
								getSelectedBlock(data, 'blockeraBackground')[
									'image-0'
								]['image-repeat']
							);
						});
					}
				);

				context(
					'should correctly reset blockeraBackground["image-0"]["image-repeat"], and display effected fields(label, control, stateGraph) in hover/desktop',
					() => {
						setBlockState('Hover');
						openBackgroundItem();
						// Reset to normal
						cy.resetBlockeraAttribute('', 'Repeat', 'reset', true);

						// Assert label
						cy.getByAriaLabel('Repeat').should(
							'have.class',
							'changed-in-other-state'
						);

						// Assert control
						cy.getByAriaLabel('Horizontally and Vertically').should(
							'have.attr',
							'aria-checked',
							'true'
						);

						// Assert state graph
						cy.checkStateGraph(
							'',
							'Repeat',
							{
								tablet: ['Normal', 'Hover'],
							},
							true
						);

						// Assert store data
						getWPDataObject().then((data) => {
							expect('repeat').to.be.deep.eq(
								getSelectedBlock(data, 'blockeraBlockStates')
									.hover.breakpoints.desktop.attributes
									.blockeraBackground['image-0'][
									'image-repeat'
								]
							);
						});
					}
				);
			});

			it('set value in normal/desktop and navigate between states', () => {
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
				cy.checkStateGraph(
					'',
					'Repeat',
					{
						desktop: ['Normal'],
						tablet: ['Normal', 'Hover'],
					},
					true
				);

				// Navigate between states and devices
				// Hover/Desktop
				setBlockState('Hover');
				openBackgroundItem();
				// Assert label
				cy.getByAriaLabel('Repeat')
					.should('not.have.class', 'changed-in-normal-state')
					.and('not.have.class', 'changed-in-secondary-state');

				// Assert control
				cy.getByAriaLabel('Horizontally and Vertically').should(
					'have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				cy.checkStateGraph(
					'',
					'Repeat',
					{
						desktop: ['Normal'],
						tablet: ['Normal', 'Hover'],
					},
					true
				);

				// Hover/Tablet
				setDeviceType('Tablet');
				openBackgroundItem();

				// Assert label
				cy.getByAriaLabel('Repeat').and(
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
				cy.checkStateGraph(
					'',
					'Repeat',
					{
						desktop: ['Normal'],
						tablet: ['Normal', 'Hover'],
					},
					true
				);

				// Normal/Tablet
				setBlockState('Normal');
				openBackgroundItem();

				// Assert label
				cy.getByAriaLabel('Repeat').and(
					'have.class',
					'changed-in-normal-state'
				);

				// Assert control
				cy.getByAriaLabel('Horizontally').should(
					'have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				cy.checkStateGraph(
					'',
					'Repeat',
					{
						desktop: ['Normal'],
						tablet: ['Normal', 'Hover'],
					},
					true
				);

				// Assert store data
				getWPDataObject().then((data) => {
					expect('repeat-y').to.be.eq(
						getSelectedBlock(data, 'blockeraBackground')['image-0'][
							'image-repeat'
						]
					);

					expect('repeat-x').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').normal
							.breakpoints.tablet.attributes.blockeraBackground[
							'image-0'
						]['image-repeat']
					);

					expect('repeat').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').hover
							.breakpoints.desktop.attributes.blockeraBackground[
							'image-0'
						]['image-repeat']
					);

					expect('repeat-x').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').hover
							.breakpoints.tablet.attributes.blockeraBackground[
							'image-0'
						]['image-repeat']
					);
				});
			});

			it('set value in hover/desktop and navigate between states', () => {
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
				cy.checkStateGraph(
					'',
					'Repeat',
					{
						desktop: ['Hover'],
						tablet: ['Normal', 'Hover'],
					},
					true
				);

				// Navigate between states and devices:
				// Normal/Desktop
				setBlockState('Normal');
				openBackgroundItem();

				// Assert label
				cy.getByAriaLabel('Repeat').should(
					'have.class',
					'changed-in-other-state'
				);

				// Assert control
				cy.getByAriaLabel('Horizontally and Vertically').should(
					'have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				cy.checkStateGraph(
					'',
					'Repeat',
					{
						desktop: ['Hover'],
						tablet: ['Normal', 'Hover'],
					},
					true
				);

				// Normal/Tablet
				setDeviceType('Tablet');
				openBackgroundItem();

				// Assert label
				cy.getByAriaLabel('Repeat').should(
					'have.class',
					'changed-in-normal-state'
				);

				// Assert control
				cy.getByAriaLabel('Horizontally').should(
					'have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				cy.checkStateGraph(
					'',
					'Repeat',
					{
						desktop: ['Hover'],
						tablet: ['Normal', 'Hover'],
					},
					true
				);

				// Hover/Tablet
				setBlockState('Hover');
				openBackgroundItem();

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
				cy.checkStateGraph(
					'',
					'Repeat',
					{
						desktop: ['Hover'],
						tablet: ['Normal', 'Hover'],
					},
					true
				);

				// Assert store data
				getWPDataObject().then((data) => {
					expect('repeat').to.be.eq(
						getSelectedBlock(data, 'blockeraBackground')['image-0'][
							'image-repeat'
						]
					);
					expect('repeat-x').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').normal
							.breakpoints.tablet.attributes.blockeraBackground[
							'image-0'
						]['image-repeat']
					);
					expect('no-repeat').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').hover
							.breakpoints.desktop.attributes.blockeraBackground[
							'image-0'
						]['image-repeat']
					);
					expect('repeat-x').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').hover
							.breakpoints.tablet.attributes.blockeraBackground[
							'image-0'
						]['image-repeat']
					);
				});
			});
		});
	});

	describe('reset-all action testing...', () => {
		it('repeater item :', () => {
			// Set value in normal/desktop
			cy.getByAriaLabel('Add New Background').click();

			// Set value in hover/desktop
			addBlockState('hover');
			openBackgroundItem();
			cy.getByAriaLabel('Cover').click();

			// Reset all
			cy.resetBlockeraAttribute(
				'Background',
				'Image & Gradient',
				'reset-all'
			);

			// Assert label
			cy.checkLabelClassName(
				'Background',
				'Image & Gradient',
				'changed-in-normal-state',
				'not-have'
			);

			cy.checkLabelClassName(
				'Background',
				'Image & Gradient',
				'changed-in-secondary-state',
				'not-have'
			);

			// Assert control
			cy.getParentContainer('Image & Gradient').within(() =>
				cy.getByDataCy('group-control-header').should('have.length', 0)
			);

			// Assert state graph
			cy.checkStateGraph('Background', 'Image & Gradient', {});

			// Normal/Desktop
			setBlockState('Normal');

			// Assert label
			cy.checkLabelClassName(
				'Background',
				'Image & Gradient',
				'changed-in-normal-state',
				'not-have'
			);

			// Assert control
			cy.getParentContainer('Image & Gradient').within(() =>
				cy.getByDataCy('group-control-header').should('have.length', 0)
			);

			// Assert state graph
			cy.checkStateGraph('Background', 'Image & Gradient', {});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBackground')
				);
				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes
				);
			});

			cy.getByAriaLabel('Add New Background').click();

			// Assert label
			cy.checkLabelClassName(
				'Background',
				'Image & Gradient',
				'changed-in-normal-state'
			);

			// Assert control
			cy.getParentContainer('Image & Gradient').within(() =>
				cy.getByDataCy('group-control-header').should('have.length', 1)
			);

			// Assert state graph
			cy.checkStateGraph('Background', 'Image & Gradient', {
				desktop: ['Normal'],
			});

			// Hover/Desktop
			setBlockState('Hover');
			// Assert label
			cy.checkLabelClassName(
				'Background',
				'Image & Gradient',
				'changed-in-normal-state'
			);

			// Assert control
			cy.getParentContainer('Image & Gradient').within(() =>
				cy.getByDataCy('group-control-header').should('have.length', 1)
			);

			// Assert state graph
			cy.checkStateGraph('Background', 'Image & Gradient', {
				desktop: ['Normal'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect(1).to.be.deep.eq(
					Object.keys(getSelectedBlock(data, 'blockeraBackground'))
						.length
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes
				);
			});
		});

		describe('repeater nested items :', () => {
			beforeEach(() => {
				// Set value in normal/desktop
				cy.getByAriaLabel('Add New Background').click();
				cy.getByAriaLabel('Horizontally').click();

				// Set value in hover/desktop
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

				// Normal/Tablet
				// Assert label
				cy.getByAriaLabel('Repeat').should(
					'not.have.class',
					'changed-in-normal-state'
				);

				// Assert control
				cy.getByAriaLabel('Horizontally and Vertically').should(
					'have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				cy.checkStateGraph('', 'Repeat', {}, true);

				// Hover/Tablet
				setBlockState('Hover');
				openBackgroundItem();

				// Assert label
				cy.getByAriaLabel('Repeat').should(
					'not.have.class',
					'changed-in-secondary-state'
				);

				// Assert control
				cy.getByAriaLabel('Horizontally and Vertically').should(
					'have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				cy.checkStateGraph('', 'Repeat', {}, true);

				// Hover/Desktop
				setDeviceType('Desktop');
				openBackgroundItem();

				// Assert label
				cy.getByAriaLabel('Repeat').should(
					'not.have.class',
					'changed-in-secondary-state'
				);

				// Assert control
				cy.getByAriaLabel('Horizontally and Vertically').should(
					'have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				cy.checkStateGraph('', 'Repeat', {}, true);

				// Normal/Desktop
				setBlockState('Normal');
				openBackgroundItem();

				// Assert label
				cy.getByAriaLabel('Repeat').should(
					'not.have.class',
					'changed-in-normal-state'
				);

				// Assert control
				cy.getByAriaLabel('Horizontally and Vertically').should(
					'have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				cy.checkStateGraph('', 'Repeat', {}, true);

				// Assert store data
				getWPDataObject().then((data) => {
					expect('repeat').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBackground')['image-0'][
							'image-repeat'
						]
					);
					expect('repeat').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').normal
							.breakpoints.tablet.attributes.blockeraBackground[
							'image-0'
						]['image-repeat']
					);
					expect('repeat').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').hover
							.breakpoints.desktop.attributes.blockeraBackground[
							'image-0'
						]['image-repeat']
					);
					expect('repeat').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').hover
							.breakpoints.tablet.attributes.blockeraBackground[
							'image-0'
						]['image-repeat']
					);
				});
			});

			it('set value in normal/desktop and navigate between states', () => {
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
				cy.checkStateGraph('', 'Repeat', { desktop: ['Normal'] }, true);

				// Navigate between states and devices
				// Hover/Desktop
				setBlockState('Hover');
				openBackgroundItem();

				// Assert label
				cy.getByAriaLabel('Repeat').should(
					'have.class',
					'changed-in-normal-state'
				);

				// Assert control
				cy.getByAriaLabel('Horizontally and Vertically').should(
					'have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				cy.checkStateGraph('', 'Repeat', { desktop: ['Normal'] }, true);

				// Hover/Tablet
				setDeviceType('Tablet');
				openBackgroundItem();

				// Assert label
				cy.getByAriaLabel('Repeat').should(
					'have.class',
					'changed-in-normal-state'
				);

				// Assert control
				cy.getByAriaLabel('Horizontally and Vertically').should(
					'have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				cy.checkStateGraph('', 'Repeat', { desktop: ['Normal'] }, true);

				// Normal/Desktop
				setBlockState('Normal');
				openBackgroundItem();

				// Assert label
				cy.getByAriaLabel('Repeat').should(
					'have.class',
					'changed-in-normal-state'
				);

				// Assert control
				cy.getByAriaLabel('Horizontally and Vertically').should(
					'have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				cy.checkStateGraph('', 'Repeat', { desktop: ['Normal'] }, true);

				// Assert store data
				getWPDataObject().then((data) => {
					expect('repeat-y').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBackground')['image-0'][
							'image-repeat'
						]
					);
					expect('repeat').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').normal
							.breakpoints.tablet.attributes.blockeraBackground[
							'image-0'
						]['image-repeat']
					);
					expect('repeat').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').hover
							.breakpoints.desktop.attributes.blockeraBackground[
							'image-0'
						]['image-repeat']
					);
					expect('repeat').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').hover
							.breakpoints.tablet.attributes.blockeraBackground[
							'image-0'
						]['image-repeat']
					);
				});
			});

			it('set value in hover/desktop and navigate between states', () => {
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
				cy.checkStateGraph('', 'Repeat', { desktop: ['Hover'] }, true);

				// Navigate between states and devices
				// Normal/Desktop
				setBlockState('Normal');
				openBackgroundItem();

				// Assert label
				cy.getByAriaLabel('Repeat').should(
					'have.class',
					'changed-in-other-state'
				);

				// Assert control
				cy.getByAriaLabel('Horizontally and Vertically').should(
					'have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				cy.checkStateGraph('', 'Repeat', { desktop: ['Hover'] }, true);

				// Normal/Tablet
				setDeviceType('Tablet');
				openBackgroundItem();

				// Assert label
				cy.getByAriaLabel('Repeat').should(
					'have.class',
					'changed-in-other-state'
				);

				// Assert control
				cy.getByAriaLabel('Horizontally and Vertically').should(
					'have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				cy.checkStateGraph('', 'Repeat', { desktop: ['Hover'] }, true);

				// Hover/Tablet
				setBlockState('Hover');
				openBackgroundItem();

				// Assert label
				cy.getByAriaLabel('Repeat').should(
					'have.class',
					'changed-in-other-state'
				);

				// Assert control
				cy.getByAriaLabel('Horizontally and Vertically').should(
					'have.attr',
					'aria-checked',
					'true'
				);

				// Assert state graph
				cy.checkStateGraph('', 'Repeat', { desktop: ['Hover'] }, true);

				// Assert store data
				getWPDataObject().then((data) => {
					expect('repeat').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBackground')['image-0'][
							'image-repeat'
						]
					);
					expect('repeat').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').normal
							.breakpoints.tablet.attributes.blockeraBackground[
							'image-0'
						]['image-repeat']
					);
					expect('repeat-x').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').hover
							.breakpoints.desktop.attributes.blockeraBackground[
							'image-0'
						]['image-repeat']
					);
					expect('repeat').to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').hover
							.breakpoints.tablet.attributes.blockeraBackground[
							'image-0'
						]['image-repeat']
					);
				});
			});
		});
	});
});
