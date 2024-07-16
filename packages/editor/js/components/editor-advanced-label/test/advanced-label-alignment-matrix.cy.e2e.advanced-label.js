import {
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	createPost,
	setBlockState,
	addBlockState,
	setDeviceType,
} from '@blockera/dev-cypress/js/helpers';

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

	it('should display changed value of Position on Normal -> Desktop', () => {
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
		cy.checkStateGraph('', 'Position', { desktop: ['Normal'] }, true);
	});

	it('should display changed value of Position on Hover -> Desktop', () => {
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
		cy.checkStateGraph('', 'Position', { desktop: ['Hover'] }, true);
	});

	it('should display changed value of Position on Hover and Normal -> Desktop', () => {
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
			{ desktop: ['Normal', 'Hover'] },
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
		 * Desktop device
		 */
		setDeviceType('Desktop');
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
		 * Desktop device (Normal)
		 */
		setDeviceType('Desktop');
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

	it('set value in normal/desktop and navigate between states', () => {
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
		cy.checkStateGraph('', 'Position', { desktop: ['Normal'] }, true);

		// Navigate between states and devices
		// Hover/Desktop
		addBlockState('hover');
		openImageItem();

		// Assert label
		cy.getByAriaLabel('Position').should(
			'have.class',
			'changed-in-normal-state'
		);

		// Assert control
		checkMatrixItem('bottom right');

		// Assert state graph
		cy.checkStateGraph('', 'Position', { desktop: ['Normal'] }, true);

		// Hover/Tablet
		setDeviceType('Tablet');
		openImageItem();

		// Assert label
		cy.getByAriaLabel('Position').should(
			'have.class',
			'changed-in-normal-state'
		);

		// Assert control
		checkMatrixItem('bottom right');

		// Assert state graph
		cy.checkStateGraph('', 'Position', { desktop: ['Normal'] }, true);

		// Normal/Tablet
		setBlockState('Normal');
		openImageItem();

		// Assert label
		cy.getByAriaLabel('Position').should(
			'have.class',
			'changed-in-normal-state'
		);

		// Assert control
		checkMatrixItem('bottom right');

		// Assert state graph
		cy.checkStateGraph('', 'Position', { desktop: ['Normal'] }, true);

		// Assert store data
		getWPDataObject().then((data) => {
			expect({ top: '100%', left: '100%' }).to.be.deep.eq(
				getSelectedBlock(data, 'blockeraBackground')['image-0'][
					'image-position'
				]
			);

			expect(undefined).to.be.deep.eq(
				getSelectedBlock(data, 'blockeraBlockStates').normal
			);

			expect(undefined).to.be.deep.eq(
				getSelectedBlock(data, 'blockeraBlockStates').hover
			);
		});
	});

	it('set value in hover/desktop and navigate between states', () => {
		addBlockState('hover');
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
		cy.checkStateGraph('', 'Position', { desktop: ['Hover'] }, true);

		// Navigate between states and devices:
		// Normal/Desktop
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
		cy.checkStateGraph('', 'Position', { desktop: ['Hover'] }, true);

		// Normal/Tablet
		setDeviceType('Tablet');
		openImageItem();

		// Assert label
		cy.getByAriaLabel('Position').should(
			'have.class',
			'changed-in-other-state'
		);

		// Assert
		checkMatrixItem('center center');

		// Assert state graph
		cy.checkStateGraph('', 'Position', { desktop: ['Hover'] }, true);

		// Hover/Tablet
		setBlockState('Hover');
		openImageItem();

		// Assert label
		cy.getByAriaLabel('Position').should(
			'have.class',
			'changed-in-other-state'
		);

		// Assert
		checkMatrixItem('center center');

		// Assert state graph
		cy.checkStateGraph('', 'Position', { desktop: ['Hover'] }, true);

		// Assert store data
		getWPDataObject().then((data) => {
			expect({ top: '50%', left: '50%' }).to.be.deep.eq(
				getSelectedBlock(data, 'blockeraBackground')['image-0'][
					'image-position'
				]
			);

			expect(undefined).to.be.deep.eq(
				getSelectedBlock(data, 'blockeraBlockStates').normal
			);

			expect({ top: '100%', left: '100%' }).to.be.deep.eq(
				getSelectedBlock(data, 'blockeraBlockStates').hover.breakpoints
					.desktop.attributes.blockeraBackground['image-0'][
					'image-position'
				]
			);

			expect(undefined).to.be.deep.eq(
				getSelectedBlock(data, 'blockeraBlockStates').hover.breakpoints
					.tablet
			);
		});
	});

	describe('reset action testing...', () => {
		beforeEach(() => {
			// Set value in normal/desktop
			setMatrixItem('top left');

			// Set value in hover/desktop
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
		});

		it('should correctly reset Position, and display effected fields(label, control, stateGraph) in normal/tablet', () => {
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
					desktop: ['Hover', 'Normal'],
				},
				true
			);

			// Assert store data
			getWPDataObject().then((data) => {
				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes
				);
			});
		});

		it('should correctly reset Position, and display effected fields(label, control, stateGraph) in hover/tablet', () => {
			setBlockState('Hover');
			openImageItem();

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
					tablet: ['Normal'],
					desktop: ['Hover', 'Normal'],
				},
				true
			);

			// Assert store data
			getWPDataObject().then((data) => {
				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});
		});

		it('should correctly reset Position, and display effected fields(label, control, stateGraph) in normal/desktop', () => {
			setDeviceType('Desktop');
			setBlockState('Normal');
			openImageItem();
			// Reset to normal
			cy.resetBlockeraAttribute('', 'Position', 'reset', true);

			// Assert label
			cy.getByAriaLabel('Position').should(
				'have.class',
				'changed-in-other-state'
			);

			// Assert control
			checkMatrixItem('center center');

			// Assert state graph
			cy.checkStateGraph(
				'',
				'Position',
				{
					tablet: ['Hover', 'Normal'],
					desktop: ['Hover'],
				},
				true
			);

			// Assert store data
			getWPDataObject().then((data) => {
				expect({ top: '50%', left: '50%' }).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBackground')['image-0'][
						'image-position'
					]
				);
			});
		});

		it('should correctly reset Position, and display effected fields(label, control, stateGraph) in hover/desktop', () => {
			setDeviceType('Desktop');
			setBlockState('Hover');
			openImageItem();

			// Reset to normal
			cy.resetBlockeraAttribute('', 'Position', 'reset', true);

			// Assert label
			cy.getByAriaLabel('Position').should(
				'not.have.class',
				'changed-in-secondary-state'
			);

			// Assert control
			checkMatrixItem('top left');

			// Assert state graph
			cy.checkStateGraph(
				'',
				'Position',
				{
					desktop: ['Normal'],
					tablet: ['Normal', 'Hover'],
				},
				true
			);

			// Assert store data
			getWPDataObject().then((data) => {
				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes
				);
			});
		});
	});

	describe('reset-all action testing...', () => {
		beforeEach(() => {
			// Set value in normal/desktop
			setMatrixItem('top left');

			// Set value in hover/desktop
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
		});

		it('should correctly reset Position, and display effected fields(label, control, stateGraph) in all states', () => {
			// Normal/Tablet
			// Assert label
			cy.getByAriaLabel('Position').should(
				'not.have.class',
				'changed-in-normal-state'
			);

			// Assert control
			checkMatrixItem('center center');

			// Assert state graph
			cy.checkStateGraph('', 'Position', {}, true);

			// Hover/Tablet
			setBlockState('Hover');
			openImageItem();

			// Assert label
			cy.getByAriaLabel('Position').should(
				'not.have.class',
				'changed-in-secondary-state'
			);

			// Assert control
			checkMatrixItem('center center');

			// Assert state graph
			cy.checkStateGraph('', 'Position', {}, true);

			// Hover/Desktop
			setDeviceType('Desktop');
			openImageItem();

			// Assert label
			cy.getByAriaLabel('Position').should(
				'not.have.class',
				'changed-in-secondary-state'
			);

			// Assert control
			checkMatrixItem('center center');

			// Assert state graph
			cy.checkStateGraph('', 'Position', {}, true);

			// Normal/Desktop
			setBlockState('Normal');
			openImageItem();

			// Assert label
			cy.getByAriaLabel('Position').should(
				'not.have.class',
				'changed-in-normal-state'
			);

			// Assert control
			checkMatrixItem('center center');

			// Assert state graph
			cy.checkStateGraph('', 'Position', {}, true);

			// Assert store data
			getWPDataObject().then((data) => {
				expect({ top: '50%', left: '50%' }).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBackground')['image-0'][
						'image-position'
					]
				);
				expect({ top: '50%', left: '50%' }).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes.blockeraBackground[
						'image-0'
					]['image-position']
				);
				expect({ top: '50%', left: '50%' }).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes.blockeraBackground[
						'image-0'
					]['image-position']
				);
				expect({ top: '50%', left: '50%' }).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes.blockeraBackground[
						'image-0'
					]['image-position']
				);
			});
		});
	});
});
