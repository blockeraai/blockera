import {
	appendBlocks,
	assertBlockData,
	getSelectedBlock,
	setInnerBlock,
	setDeviceType,
	createPost,
	setBlockState,
} from '@blockera/dev-cypress/js/helpers';

describe('useAttributes Hook Testing ...', () => {
	beforeEach(() => {
		createPost();

		appendBlocks(
			`<!-- wp:paragraph -->
				<p>Test</p>
			<!-- /wp:paragraph -->`
		);
	});

	describe('handleOnChangeAttributes callback', () => {
		it('should sets value when state is paragraph -> normal -> desktop', () => {
			// Select target block
			cy.getBlock('core/paragraph').click();

			cy.setColorControlValue('BG Color', '#000000');
			cy.getParentContainer('BG Color').should('contain', '#000000');

			// assertion for block attributes.
			assertBlockData((data) => {
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
			assertBlockData((data) => {
				expect('#000000').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes.blockeraBackgroundColor
				);
			});
		});

		it('should sets value when state is paragraph -> normal -> desktop -> link -> hover -> tablet', () => {
			// Select target block
			cy.getBlock('core/paragraph').click();

			setDeviceType('Tablet');
			setInnerBlock('elements/link');

			setBlockState('Hover');

			cy.setColorControlValue('BG Color', '#000000');
			cy.getParentContainer('BG Color').should('contain', '#000000');

			// assertion for block attributes.
			assertBlockData((data) => {
				expect('#000000').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes.blockeraInnerBlocks[
						'elements/link'
					].attributes.blockeraBlockStates.hover.breakpoints.tablet
						.attributes.blockeraBackgroundColor
				);
			});
		});

		it('should sets value when state is paragraph -> hover -> desktop', () => {
			// Select target block
			cy.getBlock('core/paragraph').click();

			// set hover state
			setBlockState('Hover');

			cy.setColorControlValue('BG Color', '#000000');
			cy.getParentContainer('BG Color').should('contain', '#000000');

			// assertion for block attributes.
			assertBlockData((data) => {
				expect('#000000').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes.blockeraBackgroundColor
				);
			});
		});

		it('should sets value when state is paragraph -> hover -> tablet', () => {
			// Select target block
			cy.getBlock('core/paragraph').click();

			setDeviceType('Tablet');

			// set hover state
			setBlockState('Hover');

			cy.setColorControlValue('BG Color', '#000000');
			cy.getParentContainer('BG Color').should('contain', '#000000');

			// assertion for block attributes.
			assertBlockData((data) => {
				expect('#000000').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes.blockeraBackgroundColor
				);
			});
		});

		it('should sets value when state is paragraph -> hover -> desktop -> link -> normal -> desktop', () => {
			// Select target block
			cy.getBlock('core/paragraph').click();

			// set hover state
			setBlockState('Hover');

			setInnerBlock('elements/link');

			cy.setColorControlValue('BG Color', '#000000');
			cy.getParentContainer('BG Color').should('contain', '#000000');

			// assertion for block attributes.
			assertBlockData((data) => {
				expect('#000000').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes.blockeraInnerBlocks[
						'elements/link'
					].attributes.blockeraBackgroundColor
				);
			});
		});

		it('should sets value when state is paragraph -> hover -> tablet -> link -> normal -> desktop', () => {
			// Select target block
			cy.getBlock('core/paragraph').click();

			setDeviceType('Tablet');

			// set hover state
			setBlockState('Hover');

			setInnerBlock('elements/link');

			cy.setColorControlValue('BG Color', '#000000');
			cy.getParentContainer('BG Color').should('contain', '#000000');

			// assertion for block attributes.
			assertBlockData((data) => {
				expect('#000000').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes.blockeraInnerBlocks[
						'elements/link'
					].attributes.blockeraBackgroundColor
				);
			});
		});

		it('should sets value when state is paragraph -> hover -> desktop -> link -> hover -> desktop', () => {
			// Select target block
			cy.getBlock('core/paragraph').click();

			setBlockState('Hover');

			setInnerBlock('elements/link');

			setBlockState('Hover');

			cy.setColorControlValue('BG Color', '#000000');
			cy.getParentContainer('BG Color').should('contain', '#000000');

			// assertion for block attributes.
			assertBlockData((data) => {
				expect('#000000').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes.blockeraInnerBlocks[
						'elements/link'
					].attributes.blockeraBlockStates.hover.breakpoints.desktop
						.attributes.blockeraBackgroundColor
				);
			});
		});

		it('should sets value when state is paragraph -> hover -> mobile -> link -> hover -> mobile', () => {
			// Select target block
			cy.getBlock('core/paragraph').click();

			setBlockState('Hover');

			setDeviceType('Mobile Portrait');
			setInnerBlock('elements/link');

			setBlockState('Hover');

			cy.setColorControlValue('BG Color', '#000000');
			cy.getParentContainer('BG Color').should('contain', '#000000');

			// assertion for block attributes.
			assertBlockData((data) => {
				expect('#000000').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.mobile.attributes.blockeraInnerBlocks[
						'elements/link'
					].attributes.blockeraBlockStates.hover.breakpoints.mobile
						.attributes.blockeraBackgroundColor
				);
			});
		});

		describe('in paragraph -> normal -> desktop state has blockeraBackgroundColor with 27px value', () => {
			beforeEach(() => {
				// Select target block
				cy.getBlock('core/paragraph').click();

				cy.setColorControlValue('BG Color', '#000000');
				cy.getParentContainer('BG Color').should('contain', '#000000');
			});

			describe('adding hover -> desktop state', () => {
				beforeEach(() => {
					// Set hover as current state.
					setBlockState('Hover');
				});

				it('should not sets blockeraBlockStates in block attributes', () => {
					// Add active state with empty attributes.
					cy.getByAriaLabel('Add New State').click();

					// assertion for block attributes.
					assertBlockData((data) => {
						expect({}).to.be.deep.equal(
							getSelectedBlock(data, 'blockeraBlockStates')
						);
					});
				});
			});
		});

		describe('in paragraph -> normal -> desktop state has blockeraTextShadow with one default item value', () => {
			beforeEach(() => {
				// Select target block
				cy.getBlock('core/paragraph').click();

				// Open the more typography settings panel
				cy.getByAriaLabel('More typography settings').click();
				// Add default text shadow item
				cy.getByAriaLabel('Add New Text Shadow').click();
			});
		});

		describe('in paragraph -> normal -> desktop state has blockeraTextShadow with one default item value', () => {
			beforeEach(() => {
				// Select target block
				cy.getBlock('core/paragraph').click();

				// Open the more typography settings panel
				cy.getByAriaLabel('More typography settings').click();
				// Add default text shadow item
				cy.getByAriaLabel('Add New Text Shadow').click();
			});

			describe('adding hover -> desktop state', () => {
				beforeEach(() => {
					// Set hover as current state.
					setBlockState('Hover');
				});

				it('should add "hover" block-state into block with blockeraTextShadow attribute is undefined', () => {
					// assertion for block attributes.
					assertBlockData((data) => {
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

	describe('blockeraBlockStates attribute updates', () => {
		it('should store empty background color in blockeraBlockStates on tablet breakpoint', () => {
			cy.getBlock('core/paragraph').click();

			cy.setColorControlValue('BG Color', 'ff0000');

			assertBlockData((data) => {
				expect('#ff0000').to.be.equal(
					getSelectedBlock(data, 'blockeraBackgroundColor')
				);
			});

			setDeviceType('Tablet');
			cy.clearColorControlValue('BG Color');

			assertBlockData((data) => {
				expect('#ff0000').to.be.equal(
					getSelectedBlock(data, 'blockeraBackgroundColor')
				);

				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes.blockeraBackgroundColor
				);
			});
		});
	});
});
