import {
	appendBlocks,
	getWPDataObject,
	getSelectedBlock,
	setInnerBlock,
	setDeviceType,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('useAttributes Hook Testing ...', () => {
	beforeEach(() => {
		createPost();

		appendBlocks(
			'<!-- wp:paragraph -->\n' +
				'<p>Test</p>\n' +
				'<!-- /wp:paragraph -->'
		);
	});

	describe('handleOnChangeAttributes callback', () => {
		it('should sets value when state is paragraph -> normal -> laptop', () => {
			// Select target block
			cy.getBlock('core/paragraph').click();

			cy.setColorControlValue('BG Color', '#000000');
			cy.getParentContainer('BG Color').should('contain', '#000000');

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('#000000').to.be.equal(
					getSelectedBlock(data, 'blockeraBackgroundColor')
				);
			});
		});

		it('should sets value when state is paragraph -> normal -> tablet', () => {
			// Select target block
			cy.getBlock('core/paragraph').click();

			setDeviceType('Tablet');

			cy.setColorControlValue('BG Color', '#000000');
			cy.getParentContainer('BG Color').should('contain', '#000000');

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('#000000').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes.blockeraBackgroundColor
				);
			});
		});

		it('should sets value when state is paragraph -> normal -> laptop -> link -> hover -> tablet', () => {
			// Select target block
			cy.getBlock('core/paragraph').click();

			setDeviceType('Tablet');
			setInnerBlock('Link');

			cy.getByAriaLabel('Add New State').click();

			cy.setColorControlValue('BG Color', '#000000');
			cy.getParentContainer('BG Color').should('contain', '#000000');

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('#000000').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes.blockeraInnerBlocks.link
						.attributes.blockeraBlockStates.hover.breakpoints.tablet
						.attributes.blockeraBackgroundColor
				);
			});
		});

		it('should sets value when state is paragraph -> hover -> laptop', () => {
			// Select target block
			cy.getBlock('core/paragraph').click();

			// set hover state
			cy.getByAriaLabel('Add New State').click();

			cy.setColorControlValue('BG Color', '#000000');
			cy.getParentContainer('BG Color').should('contain', '#000000');

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('#000000').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.laptop.attributes.blockeraBackgroundColor
				);
			});
		});

		it('should sets value when state is paragraph -> hover -> tablet', () => {
			// Select target block
			cy.getBlock('core/paragraph').click();

			setDeviceType('Tablet');

			// set hover state
			cy.getByAriaLabel('Add New State').click();

			cy.setColorControlValue('BG Color', '#000000');
			cy.getParentContainer('BG Color').should('contain', '#000000');

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('#000000').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes.blockeraBackgroundColor
				);
			});
		});

		it('should sets value when state is paragraph -> hover -> laptop -> link -> normal -> laptop', () => {
			// Select target block
			cy.getBlock('core/paragraph').click();

			// set hover state
			cy.getByAriaLabel('Add New State').click();

			setInnerBlock('Link');

			cy.setColorControlValue('BG Color', '#000000');
			cy.getParentContainer('BG Color').should('contain', '#000000');

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('#000000').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.laptop.attributes.blockeraInnerBlocks.link
						.attributes.blockeraBackgroundColor
				);
			});
		});

		it('should sets value when state is paragraph -> hover -> tablet -> link -> normal -> laptop', () => {
			// Select target block
			cy.getBlock('core/paragraph').click();

			setDeviceType('Tablet');

			// set hover state
			cy.getByAriaLabel('Add New State').click();

			setInnerBlock('Link');

			cy.setColorControlValue('BG Color', '#000000');
			cy.getParentContainer('BG Color').should('contain', '#000000');

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				console.log(getSelectedBlock(data, 'blockeraBlockStates'));
				expect('#000000').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes.blockeraInnerBlocks.link
						.attributes.blockeraBackgroundColor
				);
			});
		});

		it('should sets value when state is paragraph -> hover -> laptop -> link -> hover -> laptop', () => {
			// Select target block
			cy.getBlock('core/paragraph').click();

			cy.getByAriaLabel('Add New State').click();

			setInnerBlock('Link');

			cy.getByAriaLabel('Add New State').click();

			cy.setColorControlValue('BG Color', '#000000');
			cy.getParentContainer('BG Color').should('contain', '#000000');

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('#000000').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.laptop.attributes.blockeraInnerBlocks.link
						.attributes.blockeraBlockStates.hover.breakpoints.laptop
						.attributes.blockeraBackgroundColor
				);
			});
		});

		it('should sets value when state is paragraph -> hover -> mobile -> link -> hover -> mobile', () => {
			// Select target block
			cy.getBlock('core/paragraph').click();

			cy.getByAriaLabel('Add New State').click();

			setDeviceType('Mobile');
			setInnerBlock('Link');

			cy.getByAriaLabel('Add New State').click();

			cy.setColorControlValue('BG Color', '#000000');
			cy.getParentContainer('BG Color').should('contain', '#000000');

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('#000000').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.mobile.attributes.blockeraInnerBlocks.link
						.attributes.blockeraBlockStates.hover.breakpoints.mobile
						.attributes.blockeraBackgroundColor
				);
			});
		});

		describe('in paragraph -> normal -> laptop state has blockeraBackgroundColor with 27px value', () => {
			beforeEach(() => {
				// Select target block
				cy.getBlock('core/paragraph').click();

				cy.setColorControlValue('BG Color', '#000000');
				cy.getParentContainer('BG Color').should('contain', '#000000');
			});

			describe('adding hover -> laptop state', () => {
				beforeEach(() => {
					// Set hover as current state.
					cy.getByAriaLabel('Add New State').click();
				});

				it('should not sets blockeraBlockStates in block attributes', () => {
					// Add active state with empty attributes.
					cy.getByAriaLabel('Add New State').click();

					// assertion for block attributes.
					getWPDataObject().then((data) => {
						expect({}).to.be.deep.equal(
							getSelectedBlock(data, 'blockeraBlockStates')
						);
					});
				});
			});
		});

		describe('in paragraph -> normal -> laptop state has blockeraTextShadow with one default item value', () => {
			beforeEach(() => {
				// Select target block
				cy.getBlock('core/paragraph').click();

				// Add default text shadow item
				cy.getByAriaLabel('Add New Text Shadow').click();
			});
		});

		describe.only('in paragraph -> normal -> laptop state has blockeraTextShadow with one default item value', () => {
			beforeEach(() => {
				// Select target block
				cy.getBlock('core/paragraph').click();

				// Add default text shadow item
				cy.getByAriaLabel('Add New Text Shadow').click();
			});

			describe('adding hover -> laptop state', () => {
				beforeEach(() => {
					// Set hover as current state.
					cy.getByAriaLabel('Add New State').click();
				});

				it('should add "hover" block-state into block with blockeraTextShadow attribute is undefined', () => {
					// assertion for block attributes.
					getWPDataObject().then((data) => {
						expect(undefined).to.be.deep.equal(
							getSelectedBlock(data, 'blockeraBlockStates')?.hover
						);

						expect({
							0: {
								isVisible: true,
								x: '1px',
								y: '1px',
								blur: '1px',
								color: '#000000ab',
								order: 0,
							},
						}).to.be.deep.equal(
							getSelectedBlock(data, 'blockeraTextShadow')
						);
					});
				});
			});
		});
	});
});
