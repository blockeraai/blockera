import {
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	createPost,
	setBlockState,
	addBlockState,
	setDeviceType,
} from '../../../../../dev-cypress/js/helpers';

describe('Alignment Matrix Control label testing (Background/Image/Position)', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		// Set display
		cy.getByAriaLabel('Add New Background').click();

		// Alias
		cy.getByAriaLabel('Alignment Matrix Control').as('matrix-box');
		cy.getByDataTest('popover-body').within(() => {
			cy.getByAriaLabel('Position').as('position-label');
		});
	});

	const setMatrixItem = (item) => {
		cy.get('@matrix-box').within(() =>
			cy.getByAriaLabel(`${item} item`).click()
		);
	};

	const checkMatrixItem = (item) => {
		cy.get('@matrix-box').within(() =>
			cy.getByAriaLabel(`${item} item`).should('have.class', 'selected')
		);
	};

	const openImageItem = () => {
		cy.getParentContainer('Image & Gradient').within(() => {
			cy.getByDataCy('group-control-header').click();
		});
	};

	it('should display changed value of Position on Normal -> Laptop', () => {
		// Assert label before set value
		cy.get('@position-label').should(
			'not.have.class',
			'changed-in-normal-state'
		);

		// Set value
		setMatrixItem('top left');

		// Assert label after set value
		cy.get('@position-label').should(
			'have.class',
			'changed-in-normal-state'
		);

		// Assert control
		checkMatrixItem('top left');

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		openImageItem();
		cy.get('@position-label').should(
			'have.class',
			'changed-in-normal-state'
		);

		// Assert control
		checkMatrixItem('top left');

		// Assert state graph
		cy.checkStateGraph('', 'Position', { laptop: ['Normal'] }, true);
	});

	it('should display changed value of Position on Hover -> Laptop', () => {
		/**
		 * Hover
		 */
		addBlockState('hover');
		openImageItem();

		// Assert label before set value
		cy.get('@position-label').should(
			'not.have.class',
			'changed-in-normal-state'
		);

		// Set value
		setMatrixItem('top left');

		// Assert label after set value
		cy.get('@position-label').should(
			'have.class',
			'changed-in-secondary-state'
		);
		// Assert control
		checkMatrixItem('top left');

		/**
		 * Normal
		 */
		setBlockState('Normal');
		openImageItem();

		// Assert label
		cy.get('@position-label').should(
			'have.class',
			'changed-in-other-state'
		);

		// Assert control
		// default : center center
		checkMatrixItem('center center');

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');
		openImageItem();

		// Assert label
		cy.get('@position-label').should(
			'have.class',
			'changed-in-other-state'
		);

		// Assert control
		// default : center center
		checkMatrixItem('center center');

		// Assert state graph
		cy.checkStateGraph('', 'Position', { laptop: ['Hover'] }, true);
	});

	it('should display changed value of Position on Hover and Normal -> Laptop', () => {
		/**
		 * Normal
		 */
		// Set value
		setMatrixItem('top left');

		// Assert label
		cy.get('@position-label').should(
			'have.class',
			'changed-in-normal-state'
		);

		/**
		 * Hover
		 */
		addBlockState('hover');
		openImageItem();

		// Assert label before set value
		cy.get('@position-label').should(
			'have.class',
			'changed-in-normal-state'
		);

		// Set value
		setMatrixItem('top right');

		// Assert label after set value
		cy.get('@position-label').should(
			'have.class',
			'changed-in-secondary-state'
		);

		// Assert control
		checkMatrixItem('top right');

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');
		openImageItem();

		// Assert label
		cy.get('@position-label').should(
			'have.class',
			'changed-in-normal-state'
		);

		// Assert control
		checkMatrixItem('top left');

		// Assert state graph
		cy.checkStateGraph(
			'',
			'Position',
			{ laptop: ['Normal', 'Hover'] },
			true
		);
	});

	it('should display changed value of Position on Normal -> Tablet', () => {
		setDeviceType('Tablet');
		openImageItem();
		// Assert label before set value
		cy.get('@position-label').should(
			'not.have.class',
			'changed-in-normal-state'
		);

		// Set value
		setMatrixItem('top left');

		// Assert label after set value
		cy.get('@position-label').should(
			'have.class',
			'changed-in-normal-state'
		);

		// Assert control
		checkMatrixItem('top left');

		/**
		 * Laptop device
		 */
		setDeviceType('Laptop');
		openImageItem();

		// Assert label
		cy.get('@position-label').should(
			'have.class',
			'changed-in-other-state'
		);

		// Assert control
		// Default : center center
		checkMatrixItem('center center');

		// Assert state graph
		cy.checkStateGraph('', 'Position', { tablet: ['Normal'] }, true);
	});

	it('should display changed value of Flex Layout on Hover -> Tablet', () => {
		setDeviceType('Tablet');
		/**
		 * Hover
		 */
		addBlockState('hover');
		openImageItem();
		// Assert label before set value
		cy.get('@position-label').should(
			'not.have.class',
			'changed-in-normal-state'
		);

		// Set value
		setMatrixItem('top left');

		// Assert label after set value
		cy.get('@position-label').should(
			'have.class',
			'changed-in-secondary-state'
		);

		// Assert control
		checkMatrixItem('top left');

		/**
		 * Normal
		 */
		setBlockState('Normal');
		openImageItem();

		// Assert label
		cy.get('@position-label').should(
			'have.class',
			'changed-in-other-state'
		);

		// Assert control
		checkMatrixItem('center center');

		/**
		 * Laptop device (Normal)
		 */
		setBlockState('Normal');
		setDeviceType('Laptop');
		openImageItem();

		// Assert label

		cy.get('@position-label').should(
			'have.class',
			'changed-in-other-state'
		);

		// Assert control
		checkMatrixItem('center center');

		// Assert state graph
		cy.checkStateGraph('', 'Position', { tablet: ['Hover'] }, true);
	});

	describe('Alignment Matrix Control label reset action testing...', () => {
		beforeEach(() => {
			// Set value in normal/laptop
			setMatrixItem('top left');

			// Set value in hover/laptop
			addBlockState('hover');
			openImageItem();
			setMatrixItem('top center');

			// Set value in hover/tablet
			setDeviceType('Tablet');
			openImageItem();
			setMatrixItem('top right');

			// Set value in normal/tablet
			setBlockState('Normal');
			openImageItem();
			setMatrixItem('center left');

			context(
				'should correctly reset Position, and display effected fields(label, control, stateGraph) in normal/tablet',
				() => {
					// Reset to normal
					cy.resetBlockeraAttribute('', 'Position', 'reset', true);

					// Assert label
					cy.getByAriaLabel('Position').should(
						'have.class',
						'changed-in-normal-state'
					);

					// Assert control
					checkMatrixItem('top left');

					// Assert state graph
					cy.checkStateGraph(
						'',
						'Position',
						{
							tablet: ['Hover'],
							laptop: ['Hover', 'Normal'],
						},
						true
					);

					// Assert store data
					// TODO : 'image-0' should be deleted from other device and state objects, because it's equal with root
					getWPDataObject().then((data) => {
						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').normal
								.breakpoints.tablet.attributes
						);
					});
				}
			);

			// context(
			// 	'should correctly reset Position, and display effected fields(label, control, stateGraph) in hover/tablet',
			// 	() => {
			// 		setBlockState('Hover');
			// 		openImageItem();
			//
			// 		// Reset to normal
			// 		cy.resetBlockeraAttribute('', 'Position', 'reset', true);
			//
			// 		// Assert label
			// 		cy.getByAriaLabel('Position').should(
			// 			'have.class',
			// 			'changed-in-normal-state'
			// 		);
			//
			// 		// Assert control
			// 		checkMatrixItem('top left');
			//
			// 		// Assert state graph
			// 		cy.checkStateGraph(
			// 			'',
			// 			'Position',
			// 			{
			// 				laptop: ['Hover', 'Normal'],
			// 			},
			// 			true
			// 		);
			//
			// 		// Assert store data
			// 		// TODO : same bug*
			// 		// getWPDataObject().then((data) => {
			// 		// 	expect({}).to.be.deep.eq(
			// 		// 		getSelectedBlock(data, 'blockeraBlockStates').hover
			// 		// 			.breakpoints.tablet.attributes
			// 		// 	);
			// 		// });
			// 	}
			// );
			//
			// context(
			// 	'should correctly reset Position, and display effected fields(label, control, stateGraph) in normal/laptop',
			// 	() => {
			// 		setDeviceType('Laptop');
			// 		setBlockState('Normal');
			// 		openImageItem();
			// 		// Reset to normal
			// 		cy.resetBlockeraAttribute('', 'Position', 'reset', true);
			//
			// 		// Assert label
			// 		cy.getByAriaLabel('Position').should(
			// 			'have.class',
			// 			'changed-in-other-state'
			// 		);
			//
			// 		// Assert control
			// 		checkMatrixItem('center center');
			//
			// 		// Assert state graph
			// 		// TODO : 'image-0' should be deleted from other device and state objects
			// 		// cy.checkStateGraph(
			// 		// 	'',
			// 		// 	'Position',
			// 		// 	{
			// 		// 		laptop: ['Hover'],
			// 		// 	},
			// 		// 	true
			// 		// );
			//
			// 		// Assert store data
			// 		getWPDataObject().then((data) => {
			// 			expect({ top: '50%', left: '50%' }).to.be.deep.eq(
			// 				getSelectedBlock(data, 'blockeraBackground')[
			// 					'image-0'
			// 				]['image-position']
			// 			);
			// 		});
			// 	}
			// );
			//
			// context(
			// 	'should correctly reset Position, and display effected fields(label, control, stateGraph) in hover/laptop',
			// 	() => {
			// 		setBlockState('Hover');
			// 		openImageItem();
			//
			// 		// Reset to normal
			// 		cy.resetBlockeraAttribute('', 'Position', 'reset', true);
			//
			// 		// Assert label
			// 		cy.getByAriaLabel('Position').should(
			// 			'not.have.class',
			// 			'changed-in-secondary-state'
			// 		);
			//
			// 		// Assert control
			// 		checkMatrixItem('center center');
			//
			// 		// Assert state graph
			// 		// TODO
			// 		// cy.checkStateGraph('', 'Position', {}, true);
			//
			// 		// Assert store data
			// 		// TODO
			// 		// 	getWPDataObject().then((data) => {
			// 		// 		expect({}).to.be.deep.eq(
			// 		// 			getSelectedBlock(data, 'blockeraBlockStates').hover
			// 		// 				.breakpoints.laptop.attributes
			// 		// 		);
			// 		// 	});
			// 	}
			// );
		});

		it.only('set value in normal/laptop and navigate between states', () => {
			setBlockState('Normal');
			openImageItem();

			// Set value
			setMatrixItem('bottom right');

			// Assert label
			cy.getByAriaLabel('Position').should(
				'have.class',
				'changed-in-normal-state'
			);

			// Assert control
			checkMatrixItem('bottom right');

			// Assert state graph
			// TODO
			cy.checkStateGraph('', 'Position', { laptop: ['Normal'] }, true);

			// Navigate between states and devices
			// Hover/Laptop
			setBlockState('Hover');

			// Assert label
			// TODO
			cy.getByAriaLabel('Position').should(
				'have.class',
				'changed-in-normal-state'
			);

			// Assert control
			// TODO
			checkMatrixItem('bottom right');

			// Assert state graph
			// TODO
			cy.checkStateGraph('', 'Position', { laptop: ['Normal'] }, true);

			// Hover/Tablet
			setDeviceType('Tablet');
			// Assert label
			// TODO
			cy.getByAriaLabel('Position').should(
				'have.class',
				'changed-in-normal-state'
			);

			// Assert control
			// TODO
			checkMatrixItem('bottom right');

			// Assert state graph
			// TODO
			cy.checkStateGraph('', 'Position', { laptop: ['Normal'] }, true);

			// Normal/Tablet
			setBlockState('Normal');
			// Assert label
			// TODO
			cy.getByAriaLabel('Position').should(
				'have.class',
				'changed-in-normal-state'
			);

			// Assert control
			// TODO
			checkMatrixItem('bottom right');

			// Assert state graph
			// TODO
			cy.checkStateGraph('', 'Position', { laptop: ['Normal'] }, true);

			// Assert store data
			getWPDataObject().then((data) => {
				expect({ top: '100%', left: '100%' }).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBackground')['image-0'][
						'image-position'
					]
				);

				// TODO
				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes
				);

				// TODO
				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.laptop.attributes
				);

				// TODO
				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});
		});

		it('set value in hover/laptop and navigate between states', () => {
			setMatrixItem('bottom right');

			// Assert label
			cy.getByAriaLabel('Position').should(
				'have.class',
				'changed-in-secondary-state'
			);

			// Assert control
			checkMatrixItem('bottom right');

			// Assert state graph
			// TODO
			//cy.checkStateGraph('', 'Position', { laptop: ['Hover'] }, true);

			// Navigate between states and devices:
			// Normal/Laptop
			setBlockState('Normal');
			openImageItem();

			// Assert label
			cy.getByAriaLabel('Position').should(
				'have.class',
				'changed-in-other-state'
			);

			// Assert control
			checkMatrixItem('center center');

			// Assert state graph
			// TODO
			//cy.checkStateGraph('', 'Position', { laptop: ['Hover'] }, true);

			// Normal/Tablet
			setDeviceType('Tablet');
			openImageItem();

			// Assert label
			// TODO
			// cy.getByAriaLabel('Position').should(
			// 	'have.class',
			// 	'changed-in-other-state'
			// );

			// Assert
			// TODO
			//checkMatrixItem('center center');

			// Assert state graph
			// TODO
			// cy.checkStateGraph('', 'Position', { laptop: ['Hover'] }, true);

			// Hover/Tablet
			setBlockState('Hover');
			openImageItem();

			// Assert label
			// TODO
			// cy.getByAriaLabel('Position').should(
			// 	'have.class',
			// 	'changed-in-other-state'
			// );

			// Assert
			// TODO
			//checkMatrixItem('center center');

			// Assert state graph
			// TODO
			// cy.checkStateGraph('', 'Position', { laptop: ['Hover'] }, true);

			// Assert store data
			getWPDataObject().then((data) => {
				expect({ top: '50%', left: '50%' }).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBackground')['image-0'][
						'image-position'
					]
				);

				// TODO
				// expect({}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').normal
				// 		.breakpoints.tablet.attributes
				// );

				expect({ top: '100%', left: '100%' }).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.laptop.attributes.blockeraBackground[
						'image-0'
					]['image-position']
				);

				// TODO
				// expect({}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').hover
				// 		.breakpoints.tablet.attributes
				// );
			});
		});
	});

	describe('reset-all action testing...', () => {
		beforeEach(() => {
			// Set value in normal/laptop
			setMatrixItem('top left');

			// Set value in hover/laptop
			addBlockState('hover');
			openImageItem();
			setMatrixItem('top center');

			// Set value in hover/tablet
			setDeviceType('Tablet');
			openImageItem();
			setMatrixItem('top right');

			// Set value in normal/tablet
			setBlockState('Normal');
			openImageItem();
			setMatrixItem('center left');

			// Reset All
			cy.resetBlockeraAttribute('', 'Position', 'reset-all', true);

			context(
				'should correctly reset Position, and display effected fields(label, control, stateGraph) in all states',
				() => {
					// Normal/Tablet
					// Assert label
					//TODO
					// cy.getByAriaLabel('Position').should(
					// 	'not.have.class',
					// 	'changed-in-normal-state'
					// );

					// Assert control
					// TODO
					//checkMatrixItem('center center');

					// Assert state graph
					// TODO
					//cy.checkStateGraph('', 'Position', {}, true);

					// Hover/Tablet
					setBlockState('Hover');
					openImageItem();

					// Assert label
					// TODO
					// cy.getByAriaLabel('Position').should(
					// 	'not.have.class',
					// 	'changed-in-secondary-state'
					// );

					// Assert control
					// TODO
					// checkMatrixItem('center center');

					// Assert state graph
					// TODO
					// cy.checkStateGraph('', 'Position', {}, true);

					// Hover/Laptop
					setDeviceType('Laptop');
					openImageItem();

					// Assert label
					// TODO
					// cy.getByAriaLabel('Position').should(
					// 	'not.have.class',
					// 	'changed-in-secondary-state'
					// );

					// Assert control
					// TODO
					// checkMatrixItem('center center');

					// Assert state graph
					// TODO
					//cy.checkStateGraph('', 'Position', {}, true);

					// Normal/Laptop
					setBlockState('Normal');
					openImageItem();

					// Assert label
					// TODO
					// cy.getByAriaLabel('Position').should(
					// 	'not.have.class',
					// 	'changed-in-normal-state'
					// );

					// Assert control
					// TODO
					// checkMatrixItem('center center');

					// Assert state graph
					// TODO
					//cy.checkStateGraph('', 'Position', {}, true);

					// Assert store data
					getWPDataObject().then((data) => {
						// TODO
						// expect({ top: '50%', left: '50%' }).to.be.deep.eq(
						// 	getSelectedBlock(data, 'blockeraBackground')[
						// 		'image-0'
						// 	]['image-position']
						// );
						// expect({}).to.be.deep.eq(
						// 	getSelectedBlock(data, 'blockeraBlockStates').normal
						// 		.breakpoints.tablet.attributes
						// );
						// expect({}).to.be.deep.eq(
						// 	getSelectedBlock(data, 'blockeraBlockStates').hover
						// 		.breakpoints.laptop.attributes
						// );
						// expect({}).to.be.deep.eq(
						// 	getSelectedBlock(data, 'blockeraBlockStates').hover
						// 		.breakpoints.tablet.attributes
						// );
					});
				}
			);
		});

		it('set value in normal/laptop and navigate between states', () => {
			setMatrixItem('bottom right');

			// Assert label
			cy.getByAriaLabel('Position').should(
				'have.class',
				'changed-in-normal-state'
			);

			// Assert control
			checkMatrixItem('bottom right');

			// Assert state graph
			// TODO
			//cy.checkStateGraph('', 'Position', { laptop: ['Normal'] }, true);

			// Navigate between states and devices
			// Hover/Laptop
			setBlockState('Hover');
			openImageItem();

			// Assert label
			// TODO
			// cy.getByAriaLabel('Position').should(
			// 	'have.class',
			// 	'changed-in-normal-state'
			// );

			// Assert control
			//TODO
			//checkMatrixItem('bottom right');

			// Assert state graph
			// TODO
			//cy.checkStateGraph('', 'Position', { laptop: ['Normal'] }, true);

			// Hover/Tablet
			setDeviceType('Tablet');
			openImageItem();

			// Assert label
			// TODO
			// cy.getByAriaLabel('Position').should(
			// 	'have.class',
			// 	'changed-in-normal-state'
			// );

			// Assert control
			//TODO
			//checkMatrixItem('bottom right');

			// Assert state graph
			// TODO
			//cy.checkStateGraph('', 'Position', { laptop: ['Normal'] }, true);

			// Normal/Laptop
			setBlockState('Normal');
			openImageItem();

			// Assert label
			// TODO
			// cy.getByAriaLabel('Position').should(
			// 	'have.class',
			// 	'changed-in-normal-state'
			// );

			// Assert control
			//TODO
			//checkMatrixItem('bottom right');

			// Assert state graph
			// TODO
			//cy.checkStateGraph('', 'Position', { laptop: ['Normal'] }, true);

			// Assert store data
			getWPDataObject().then((data) => {
				expect({ top: '100%', left: '100%' }).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBackground')['image-0'][
						'image-position'
					]
				);

				// TODO
				// expect({}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').normal
				// 		.breakpoints.tablet.attributes
				// );

				// expect({}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').hover
				// 		.breakpoints.laptop.attributes
				// );

				// expect({}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').hover
				// 		.breakpoints.tablet.attributes
				// );
			});
		});

		it('set value in hover/laptop and navigate between states', () => {
			setBlockState('Hover');
			openImageItem();

			setMatrixItem('bottom right');

			// Assert label
			cy.getByAriaLabel('Position').should(
				'have.class',
				'changed-in-secondary-state'
			);

			// Assert control
			checkMatrixItem('bottom right');

			// Assert state graph
			// TODO
			// cy.checkStateGraph(
			// 	'',
			// 	'Position',
			// 	{
			// 		laptop: ['Hover'],
			// 	},
			// 	true
			// );

			// Navigate between states and devices
			// Normal/Laptop
			setBlockState('Normal');
			openImageItem();

			// Assert label
			// TODO
			// cy.getByAriaLabel('Position').should(
			// 	'have.class',
			// 	'changed-in-other-state'
			// );

			// Assert control
			// TODO
			//checkMatrixItem('center center');

			// Assert state graph
			// TODO
			// cy.checkStateGraph(
			// 	'',
			// 	'Position',
			// 	{
			// 		laptop: ['Hover'],
			// 	},
			// 	true
			// );

			// Normal/Tablet
			setDeviceType('Tablet');
			openImageItem();

			// Assert label
			// TODO
			// cy.getByAriaLabel('Position').should(
			// 	'have.class',
			// 	'changed-in-other-state'
			// );

			// Assert control
			// TODO
			//checkMatrixItem('center center');

			// Assert state graph
			// TODO
			// cy.checkStateGraph(
			// 	'',
			// 	'Position',
			// 	{
			// 		laptop: ['Hover'],
			// 	},
			// 	true
			// );

			// Hover/Tablet
			setBlockState('Hover');
			openImageItem();

			// Assert label
			// TODO
			// cy.getByAriaLabel('Position').should(
			// 	'have.class',
			// 	'changed-in-other-state'
			// );

			// Assert control
			// TODO
			//checkMatrixItem('center center');

			// Assert state graph
			// TODO
			// cy.checkStateGraph(
			// 	'',
			// 	'Position',
			// 	{
			// 		laptop: ['Hover'],
			// 	},
			// 	true
			// );

			// Assert store data
			getWPDataObject().then((data) => {
				// TODO
				// expect({top:'50%',left:'50%'}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBackground')['image-0'][
				// 		'image-position'
				// 	]
				// );

				// TODO
				//expect({}).to.be.deep.eq(
				//	getSelectedBlock(data, 'blockeraBlockStates').normal
				//		.breakpoints.tablet.attributes
				//);

				expect({ top: '100%', left: '100%' }).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.laptop.attributes.blockeraBackground[
						'image-0'
					]['image-position']
				);

				// TODO
				// expect({}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').hover
				// 		.breakpoints.tablet.attributes
				// );
			});
		});
	});
});
