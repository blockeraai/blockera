import {
	appendBlocks,
	getWPDataObject,
	getSelectedBlock,
	setBlockType,
	setDeviceType,
} from '../../../../../../cypress/helpers';

describe('useAttributes Hook Testing ...', () => {
	describe('handleOnChangeAttributes callback', () => {
		it('should sets value when state is paragraph -> normal -> laptop', () => {
			appendBlocks(
				'<!-- wp:paragraph {"className":"publisher-core-block publisher-core-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4","publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"publisherPropsId":"21616724999","publisherCompatId":"216167250"} -->\n' +
					'<p class="publisher-core-block publisher-core-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4"></p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.get('[data-type="core/paragraph"]').click();

			cy.setInputFieldValue('Font Size', 'Typography', 27);

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('27px').to.be.equal(
					getSelectedBlock(data, 'publisherFontSize')
				);
			});
		});
		it('should sets value when state is paragraph -> normal -> tablet', () => {
			appendBlocks(
				'<!-- wp:paragraph {"className":"publisher-core-block publisher-core-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4","publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"publisherPropsId":"21616724999","publisherCompatId":"216167250"} -->\n' +
					'<p class="publisher-core-block publisher-core-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4"></p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.get('[data-type="core/paragraph"]').click();

			setDeviceType('Tablet');

			cy.setInputFieldValue('Font Size', 'Typography', 27);

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('27px').to.be.equal(
					getSelectedBlock(data, 'publisherBlockStates').normal
						.breakpoints.tablet.attributes.publisherFontSize
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
			setBlockType('Link');

			cy.getByAriaLabel('Add New State').click();

			cy.setInputFieldValue('Font Size', 'Typography', 27);

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				console.log(getSelectedBlock(data, 'publisherInnerBlocks'));
				expect('27px').to.be.equal(
					getSelectedBlock(data, 'publisherInnerBlocks').link
						.attributes.publisherBlockStates.hover.breakpoints
						.tablet.attributes.publisherFontSize
				);
			});
		});

		it('should sets value when state is paragraph -> hover -> laptop', () => {
			appendBlocks(
				'<!-- wp:paragraph {"className":"publisher-core-block publisher-core-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4","publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"publisherPropsId":"21616724999","publisherCompatId":"216167250"} -->\n' +
					'<p class="publisher-core-block publisher-core-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4"></p>\n' +
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
					getSelectedBlock(data, 'publisherBlockStates').hover
						.breakpoints.laptop.attributes.publisherFontSize
				);
			});
		});
		it('should sets value when state is paragraph -> hover -> tablet', () => {
			appendBlocks(
				'<!-- wp:paragraph {"className":"publisher-core-block publisher-core-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4","publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"publisherPropsId":"21616724999","publisherCompatId":"216167250"} -->\n' +
					'<p class="publisher-core-block publisher-core-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4"></p>\n' +
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
					getSelectedBlock(data, 'publisherBlockStates').hover
						.breakpoints.tablet.attributes.publisherFontSize
				);
			});
		});

		it('should sets value when state is paragraph -> hover -> laptop -> link -> normal -> laptop', () => {
			appendBlocks(
				'<!-- wp:paragraph {"className":"publisher-core-block publisher-core-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4","publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"publisherPropsId":"21616724999","publisherCompatId":"216167250"} -->\n' +
					'<p class="publisher-core-block publisher-core-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4"></p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.get('[data-type="core/paragraph"]').click();

			// set hover state
			cy.getByAriaLabel('Add New State').click();

			setBlockType('Link');

			cy.setInputFieldValue('Font Size', 'Typography', 27);

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('27px').to.be.equal(
					getSelectedBlock(data, 'publisherBlockStates').hover
						.breakpoints.laptop.attributes.publisherInnerBlocks.link
						.attributes.publisherFontSize
				);
			});
		});
		it('should sets value when state is paragraph -> hover -> tablet -> link -> normal -> laptop', () => {
			appendBlocks(
				'<!-- wp:paragraph {"className":"publisher-core-block publisher-core-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4","publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"publisherPropsId":"21616724999","publisherCompatId":"216167250"} -->\n' +
					'<p class="publisher-core-block publisher-core-block-bffa0011-3d33-40c1-b0eb-3a9680c8c8e4"></p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.get('[data-type="core/paragraph"]').click();

			setDeviceType('Tablet');

			// set hover state
			cy.getByAriaLabel('Add New State').click();

			setBlockType('Link');

			cy.setInputFieldValue('Font Size', 'Typography', 27);

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				console.log(getSelectedBlock(data, 'publisherBlockStates'));
				expect('27px').to.be.equal(
					getSelectedBlock(data, 'publisherBlockStates').hover
						.breakpoints.tablet.attributes.publisherInnerBlocks.link
						.attributes.publisherFontSize
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

			setBlockType('Link');

			cy.getByAriaLabel('Add New State').click();

			cy.setInputFieldValue('Font Size', 'Typography', 27);

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('27px').to.be.equal(
					getSelectedBlock(data, 'publisherBlockStates').hover
						.breakpoints.laptop.attributes.publisherInnerBlocks.link
						.attributes.publisherBlockStates.hover.breakpoints
						.laptop.attributes.publisherFontSize
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
			setBlockType('Link');

			cy.getByAriaLabel('Add New State').click();

			cy.setInputFieldValue('Font Size', 'Typography', 27);

			// assertion for block attributes.
			getWPDataObject().then((data) => {
				expect('27px').to.be.equal(
					getSelectedBlock(data, 'publisherBlockStates').hover
						.breakpoints.mobile.attributes.publisherInnerBlocks.link
						.attributes.publisherBlockStates.hover.breakpoints
						.mobile.attributes.publisherFontSize
				);
			});
		});

		describe('in paragraph -> normal -> laptop state has publisherFontSize with 27px value', () => {
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
							getSelectedBlock(data, 'publisherBlockStates')
						);
					});
				});
			});
		});
		describe('in paragraph -> normal -> laptop state has publisherTextShadow with one default item value', () => {
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
							getSelectedBlock(data, 'publisherBlockStates')
						);
					});
				});
			});
		});
		describe('in paragraph -> normal -> laptop state has publisherTextShadow with one default item value', () => {
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

				it.only('should add "active" block-state into block with publisherTextShadow attribute with one text-shadow item', () => {
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
											publisherTextShadow: {
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
							getSelectedBlock(data, 'publisherBlockStates')
						);
					});
				});
			});
		});
	});
});
