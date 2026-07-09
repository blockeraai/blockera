/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
	openBoxPositionSide,
	clearBoxPositionSide,
} from '@blockera/dev-cypress/js/helpers';

describe('Box Position → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Group Block', () => {
		it('Simple value', () => {
			appendBlocks(
				'<!-- wp:group {"style":{"position":{"type":"sticky","top":"0px"}},"layout":{"type":"constrained"}} -->\n' +
					'<div class="wp-block-group"><!-- wp:paragraph -->\n' +
					'<p>paragraph inside group</p>\n' +
					'<!-- /wp:paragraph --></div>\n' +
					'<!-- /wp:group -->'
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			// Switch to parent group block
			cy.getByAriaLabel(
				'Select Group',
				'Select parent block: Group'
			).click();

			// add alias to the feature container
			cy.getParentContainer('Position').as('container');

			getWPDataObject().then((data) => {
				expect({
					type: 'sticky',
					top: '0px',
				}).to.be.deep.equal(getSelectedBlock(data, 'style')?.position);
			});

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect({
					type: 'sticky',
					position: {
						top: '0px',
						right: '',
						bottom: '',
						left: '',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraPosition'));
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change position
			cy.get('@container').within(() => {
				cy.customSelect('Absolute');
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect({
					type: 'absolute',
					top: '0px',
					right: '',
					bottom: '',
					left: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'style')?.position);
			});

			getWPDataObject().then((data) => {
				expect({
					type: 'absolute',
					position: {
						top: '0px',
						right: '',
						bottom: '',
						left: '',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraPosition'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			clearBoxPositionSide('top');

			// change position
			cy.get('@container').within(() => {
				cy.customSelect('Default');
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.position
				);

				expect({
					type: 'static',
					position: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraPosition'));
			});
		});

		it('Variable value', () => {
			appendBlocks(
				`<!-- wp:group {"style":{"position":{"type":"sticky","top":"var:preset|spacing|20"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>test paragraph</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --> `
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			// Switch to parent group block
			cy.getByAriaLabel(
				'Select Group',
				'Select parent block: Group'
			).click();

			// add alias to the feature container
			cy.getParentContainer('Position').as('container');

			getWPDataObject().then((data) => {
				expect('var:preset|spacing|20').to.be.equal(
					getSelectedBlock(data, 'style')?.position?.top
				);
			});

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect({
					type: 'sticky',
					position: {
						top: {
							settings: {
								name: 'Tiny',
								id: '20',
								value: '10px',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--20',
							},
							name: 'Tiny',
							isValueAddon: true,
							valueType: 'variable',
						},
						right: '',
						bottom: '',
						left: '',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraPosition'));
			});

			//
			// Test 2: Blockera value to WP data
			//

			openBoxPositionSide('top');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.clickValueAddonButton();
					cy.selectValueAddonItem('20');
				});

			openBoxPositionSide('right');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('30');
				});

			openBoxPositionSide('bottom');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('40');
				});

			openBoxPositionSide('left');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('50');
				});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect({
					type: 'sticky',
					top: 'var:preset|spacing|20',
					right: 'var:preset|spacing|30',
					bottom: 'var:preset|spacing|40',
					left: 'var:preset|spacing|50',
				}).to.be.deep.equal(getSelectedBlock(data, 'style')?.position);
			});

			getWPDataObject().then((data) => {
				expect({
					type: 'sticky',
					position: {
						top: {
							settings: {
								name: 'Tiny',
								id: '20',
								value: '10px',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--20',
							},
							name: 'Tiny',
							isValueAddon: true,
							valueType: 'variable',
						},
						right: {
							settings: {
								name: 'X-Small',
								id: '30',
								value: '20px',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--30',
							},
							name: 'X-Small',
							isValueAddon: true,
							valueType: 'variable',
						},
						bottom: {
							settings: {
								name: 'Small',
								id: '40',
								value: '30px',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--40',
							},
							name: 'Small',
							isValueAddon: true,
							valueType: 'variable',
						},
						left: {
							settings: {
								name: 'Regular',
								id: '50',
								value: 'clamp(30px, 5vw, 50px)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--50',
							},
							name: 'Regular',
							isValueAddon: true,
							valueType: 'variable',
						},
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraPosition'));
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear side values
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.get(`[data-cy="box-position-label-${side}"]`).within(() => {
					cy.removeValueAddon();
				});
			});

			// WP data should be removed too
			// but type should remain
			getWPDataObject().then((data) => {
				expect({
					type: 'sticky',
					position: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraPosition'));

				expect({
					type: 'sticky',
					top: '',
					right: '',
					bottom: '',
					left: '',
				}).to.be.deep.equal(getSelectedBlock(data, 'style')?.position);
			});

			// change position to default
			cy.get('@container').within(() => {
				cy.customSelect('Default');
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.position
				);

				expect({
					type: 'static',
					position: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraPosition'));
			});
		});
	});
});
