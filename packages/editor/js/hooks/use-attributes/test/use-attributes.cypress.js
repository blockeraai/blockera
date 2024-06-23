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
	});

	describe('handleOnChangeAttributes callback', () => {
		it('should sets value when state is paragraph -> normal -> laptop', () => {
			appendBlocks(
				'<!-- wp:paragraph {"className":"blockera-block blockera-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4","blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"blockeraPropsId":"21616724999","blockeraCompatId":"216167250"} -->\n' +
					'<p class="blockera-block blockera-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4"></p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.get('[data-type="core/paragraph"]').click();

			cy.setInputFieldValue('Font Size', 'Typography', 27);

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('27px').to.be.equal(
					getSelectedBlock(data, 'blockeraFontSize')
				);
			});
		});
		it('should sets value when state is paragraph -> normal -> tablet', () => {
			appendBlocks(
				'<!-- wp:paragraph {"className":"blockera-block blockera-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4","blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"blockeraPropsId":"21616724999","blockeraCompatId":"216167250"} -->\n' +
					'<p class="blockera-block blockera-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4"></p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.get('[data-type="core/paragraph"]').click();

			setDeviceType('Tablet');

			cy.setInputFieldValue('Font Size', 'Typography', 27);

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('27px').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes.blockeraFontSize
				);
			});
		});

		it('should sets value when state is paragraph -> normal -> laptop -> link -> hover -> tablet', () => {
			appendBlocks(
				'<!-- wp:paragraph -->\n' +
					'<p>Test</p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.get('[data-type="core/paragraph"]').click();

			setDeviceType('Tablet');
			setInnerBlock('Link');

			cy.getByAriaLabel('Add New State').click();

			cy.setInputFieldValue('Font Size', 'Typography', 27);

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('27px').to.be.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks').link
						.attributes.blockeraBlockStates.hover.breakpoints.tablet
						.attributes.blockeraFontSize
				);
			});
		});

		it('should sets value when state is paragraph -> hover -> laptop', () => {
			appendBlocks(
				'<!-- wp:paragraph {"className":"blockera-block blockera-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4","blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"blockeraPropsId":"21616724999","blockeraCompatId":"216167250"} -->\n' +
					'<p class="blockera-block blockera-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4"></p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.get('[data-type="core/paragraph"]').click();

			// set hover state
			cy.getByAriaLabel('Add New State').click();

			cy.setInputFieldValue('Font Size', 'Typography', 27);

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('27px').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.laptop.attributes.blockeraFontSize
				);
			});
		});
		it('should sets value when state is paragraph -> hover -> tablet', () => {
			appendBlocks(
				'<!-- wp:paragraph {"className":"blockera-block blockera-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4","blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"blockeraPropsId":"21616724999","blockeraCompatId":"216167250"} -->\n' +
					'<p class="blockera-block blockera-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4"></p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.get('[data-type="core/paragraph"]').click();

			setDeviceType('Tablet');

			// set hover state
			cy.getByAriaLabel('Add New State').click();

			cy.setInputFieldValue('Font Size', 'Typography', 27);

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('27px').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes.blockeraFontSize
				);
			});
		});

		it('should sets value when state is paragraph -> hover -> laptop -> link -> normal -> laptop', () => {
			appendBlocks(
				'<!-- wp:paragraph {"className":"blockera-block blockera-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4","blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"blockeraPropsId":"21616724999","blockeraCompatId":"216167250"} -->\n' +
					'<p class="blockera-block blockera-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4"></p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.get('[data-type="core/paragraph"]').click();

			// set hover state
			cy.getByAriaLabel('Add New State').click();

			setInnerBlock('Link');

			cy.setInputFieldValue('Font Size', 'Typography', 27);

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('27px').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.laptop.attributes.blockeraInnerBlocks.link
						.attributes.blockeraFontSize
				);
			});
		});
		it('should sets value when state is paragraph -> hover -> tablet -> link -> normal -> laptop', () => {
			appendBlocks(
				'<!-- wp:paragraph {"className":"blockera-block blockera-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4","blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"blockeraPropsId":"21616724999","blockeraCompatId":"216167250"} -->\n' +
					'<p class="blockera-block blockera-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4"></p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.get('[data-type="core/paragraph"]').click();

			setDeviceType('Tablet');

			// set hover state
			cy.getByAriaLabel('Add New State').click();

			setInnerBlock('Link');

			cy.setInputFieldValue('Font Size', 'Typography', 27);

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				console.log(getSelectedBlock(data, 'blockeraBlockStates'));
				expect('27px').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes.blockeraInnerBlocks.link
						.attributes.blockeraFontSize
				);
			});
		});

		it('should sets value when state is paragraph -> hover -> laptop -> link -> hover -> laptop', () => {
			appendBlocks(
				'<!-- wp:paragraph -->\n' +
					'<p>Test</p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.get('[data-type="core/paragraph"]').click();

			cy.getByAriaLabel('Add New State').click();

			setInnerBlock('Link');

			cy.getByAriaLabel('Add New State').click();

			cy.setInputFieldValue('Font Size', 'Typography', 27);

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('27px').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.laptop.attributes.blockeraInnerBlocks.link
						.attributes.blockeraBlockStates.hover.breakpoints.laptop
						.attributes.blockeraFontSize
				);
			});
		});
		it('should sets value when state is paragraph -> hover -> mobile -> link -> hover -> mobile', () => {
			appendBlocks(
				'<!-- wp:paragraph -->\n' +
					'<p>Test</p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.get('[data-type="core/paragraph"]').click();

			cy.getByAriaLabel('Add New State').click();

			setDeviceType('Mobile');
			setInnerBlock('Link');

			cy.getByAriaLabel('Add New State').click();

			cy.setInputFieldValue('Font Size', 'Typography', 27);

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('27px').to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.mobile.attributes.blockeraInnerBlocks.link
						.attributes.blockeraBlockStates.hover.breakpoints.mobile
						.attributes.blockeraFontSize
				);
			});
		});

		describe('in paragraph -> normal -> laptop state has blockeraFontSize with 27px value', () => {
			beforeEach(() => {
				appendBlocks(
					'<!-- wp:paragraph -->\n' +
						'<p>Test</p>\n' +
						'<!-- /wp:paragraph -->'
				);

				// Select target block
				cy.get('[data-type="core/paragraph"]').click();

				cy.setInputFieldValue('Font Size', 'Typography', 27);
			});

			describe('adding hover -> laptop state', () => {
				beforeEach(() => {
					// Set hover as current state.
					cy.getByAriaLabel('Add New State').click();
				});

				it('should add "active" block-state into block with empty attributes', () => {
					// Add active state with empty attributes.
					cy.getByAriaLabel('Add New State').click();

					// assertion for block attributes.
					getWPDataObject().then((data) => {
						expect({
							normal: {
								breakpoints: {
									laptop: {
										attributes: {},
									},
								},
								isVisible: true,
								isSelected: false,
							},
							hover: {
								breakpoints: {
									laptop: {
										attributes: {},
									},
								},
								isVisible: true,
								isSelected: false,
							},
							active: {
								breakpoints: {
									laptop: {
										attributes: {},
									},
								},
								isVisible: true,
								isSelected: true,
							},
						}).to.be.deep.equal(
							getSelectedBlock(data, 'blockeraBlockStates')
						);
					});
				});
			});
		});
		describe('in paragraph -> normal -> laptop state has blockeraTextShadow with one default item value', () => {
			beforeEach(() => {
				appendBlocks(
					'<!-- wp:paragraph -->\n' +
						'<p>Test</p>\n' +
						'<!-- /wp:paragraph -->'
				);

				// Select target block
				cy.get('[data-type="core/paragraph"]').click();

				// Add default text shadow item
				cy.getByAriaLabel('Add New Text Shadow').click();
			});

			describe('adding hover -> laptop state', () => {
				beforeEach(() => {
					// Set hover as current state.
					cy.getByAriaLabel('Add New State').click();
				});

				it('should add "active" block-state into block with empty attributes', () => {
					// Add active state with empty attributes.
					cy.getByAriaLabel('Add New State').click();

					// assertion for block attributes.
					getWPDataObject().then((data) => {
						expect({
							normal: {
								breakpoints: {
									laptop: {
										attributes: {},
									},
								},
								isVisible: true,
								isSelected: false,
							},
							hover: {
								breakpoints: {
									laptop: {
										attributes: {},
									},
								},
								isVisible: true,
								isSelected: false,
							},
							active: {
								breakpoints: {
									laptop: {
										attributes: {},
									},
								},
								isVisible: true,
								isSelected: true,
							},
						}).to.be.deep.equal(
							getSelectedBlock(data, 'blockeraBlockStates')
						);
					});
				});
			});
		});
		describe('in paragraph -> normal -> laptop state has blockeraTextShadow with one default item value', () => {
			beforeEach(() => {
				appendBlocks(
					'<!-- wp:paragraph -->\n' +
						'<p>Test</p>\n' +
						'<!-- /wp:paragraph -->'
				);

				// Select target block
				cy.get('[data-type="core/paragraph"]').click();

				// Add default text shadow item
				cy.getByAriaLabel('Add New Text Shadow').click();
			});

			describe('adding hover -> laptop state and add new text-shadow item', () => {
				beforeEach(() => {
					// Set hover as current state.
					cy.getByAriaLabel('Add New State').click();

					// Add default text shadow item
					cy.getByAriaLabel('Add New Text Shadow').click();
				});

				it('should add "active" block-state into block with blockeraTextShadow attribute with empty attributes', () => {
					// Add active state with empty attributes.
					cy.getByAriaLabel('Add New State').click();

					// assertion for block attributes.
					getWPDataObject().then((data) => {
						expect({
							normal: {
								breakpoints: {
									laptop: {
										attributes: {},
									},
								},
								isVisible: true,
								isSelected: false,
							},
							hover: {
								breakpoints: {
									laptop: {
										attributes: {
											blockeraTextShadow: {
												0: {
													isVisible: true,
													x: '1px',
													y: '1px',
													blur: '1px',
													color: '#000000ab',
													order: 0,
												},
												1: {
													isVisible: true,
													x: '1px',
													y: '1px',
													blur: '1px',
													color: '#000000ab',
													order: 1,
												},
											},
										},
									},
								},
								isVisible: true,
								isSelected: false,
							},
							active: {
								breakpoints: {
									laptop: {
										attributes: {},
									},
								},
								isVisible: true,
								isSelected: true,
							},
						}).to.be.deep.equal(
							getSelectedBlock(data, 'blockeraBlockStates')
						);
					});
				});
			});
		});
	});
});
