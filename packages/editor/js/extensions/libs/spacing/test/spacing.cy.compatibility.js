/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
	openBoxSpacingSide,
	setBoxSpacingSide,
	clearBoxSpacingSide,
} from '@blockera/dev-cypress/js/helpers';

describe('Box Spacing → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Paragraph Block', () => {
		it('Simple Value', () => {
			appendBlocks(
				`<!-- wp:paragraph {"style":{"spacing":{"padding":{"top":"20px","right":"30px","bottom":"40px","left":"50px"},"margin":{"top":"15px","right":"30px","bottom":"45px","left":"60px"}}}} -->
<p style="margin-top:15px;margin-right:30px;margin-bottom:45px;margin-left:60px;padding-top:20px;padding-right:30px;padding-bottom:40px;padding-left:50px">Test paragraph...</p>
<!-- /wp:paragraph -->`
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			// Assert WP value
			getWPDataObject().then((data) => {
				expect({
					margin: {
						top: '15px',
						right: '30px',
						bottom: '45px',
						left: '60px',
					},
					padding: {
						top: '20px',
						right: '30px',
						bottom: '40px',
						left: '50px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'style')?.spacing);
			});

			//
			// Test 1: WP data to Blockera
			//

			// Assert Blockera value
			getWPDataObject().then((data) => {
				expect({
					margin: {
						top: '15px',
						right: '30px',
						bottom: '45px',
						left: '60px',
					},
					padding: {
						top: '20px',
						right: '30px',
						bottom: '40px',
						left: '50px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change padding
			setBoxSpacingSide('margin-top', '50');
			setBoxSpacingSide('margin-right', '100');
			setBoxSpacingSide('margin-bottom', '150');
			setBoxSpacingSide('margin-left', '200');

			// change padding
			setBoxSpacingSide('padding-top', '30');
			setBoxSpacingSide('padding-right', '60');
			setBoxSpacingSide('padding-bottom', '90');
			setBoxSpacingSide('padding-left', '120');

			// Assert Blockera value
			getWPDataObject().then((data) => {
				expect({
					margin: {
						top: '50px',
						right: '100px',
						bottom: '150px',
						left: '200px',
					},
					padding: {
						top: '30px',
						right: '60px',
						bottom: '90px',
						left: '120px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			// Assert WP value
			getWPDataObject().then((data) => {
				expect({
					margin: {
						top: '50px',
						right: '100px',
						bottom: '150px',
						left: '200px',
					},
					padding: {
						top: '30px',
						right: '60px',
						bottom: '90px',
						left: '120px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'style')?.spacing);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear margin
			clearBoxSpacingSide('margin-top');
			clearBoxSpacingSide('margin-right');
			clearBoxSpacingSide('margin-bottom');
			clearBoxSpacingSide('margin-left');

			// clear padding
			clearBoxSpacingSide('padding-top');
			clearBoxSpacingSide('padding-right');
			clearBoxSpacingSide('padding-bottom');
			clearBoxSpacingSide('padding-left');

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect({
					margin: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
					padding: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});
		});

		it('Variable Value', () => {
			appendBlocks(
				`<!-- wp:paragraph {"style":{"spacing":{"padding":{"top":"var:preset|spacing|20","right":"var:preset|spacing|40","bottom":"var:preset|spacing|20","left":"var:preset|spacing|40"},"margin":{"top":"var:preset|spacing|10","right":"var:preset|spacing|20","bottom":"var:preset|spacing|10","left":"var:preset|spacing|20"}}}} -->
<p style="margin-top:var(--wp--preset--spacing--10);margin-right:var(--wp--preset--spacing--20);margin-bottom:var(--wp--preset--spacing--10);margin-left:var(--wp--preset--spacing--20);padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--40)">Test paragraph...</p>
<!-- /wp:paragraph -->`
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			// Assert WP value
			getWPDataObject().then((data) => {
				expect({
					margin: {
						top: 'var:preset|spacing|10',
						right: 'var:preset|spacing|20',
						bottom: 'var:preset|spacing|10',
						left: 'var:preset|spacing|20',
					},
					padding: {
						top: 'var:preset|spacing|20',
						right: 'var:preset|spacing|40',
						bottom: 'var:preset|spacing|20',
						left: 'var:preset|spacing|40',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'style')?.spacing);
			});

			//
			// Test 1: WP data to Blockera
			//

			// Assert Blockera value
			getWPDataObject().then((data) => {
				expect({
					padding: {
						top: {
							settings: {
								name: '2',
								id: '20',
								value: 'min(1.5rem, 2vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--20',
							},
							name: '2',
							isValueAddon: true,
							valueType: 'variable',
						},
						right: {
							settings: {
								name: '4',
								id: '40',
								value: 'min(4rem, 5vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--40',
							},
							name: '4',
							isValueAddon: true,
							valueType: 'variable',
						},
						bottom: {
							settings: {
								name: '2',
								id: '20',
								value: 'min(1.5rem, 2vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--20',
							},
							name: '2',
							isValueAddon: true,
							valueType: 'variable',
						},
						left: {
							settings: {
								name: '4',
								id: '40',
								value: 'min(4rem, 5vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--40',
							},
							name: '4',
							isValueAddon: true,
							valueType: 'variable',
						},
					},
					margin: {
						top: {
							settings: {
								name: '1',
								id: '10',
								value: '1rem',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--10',
							},
							name: '1',
							isValueAddon: true,
							valueType: 'variable',
						},
						right: {
							settings: {
								name: '2',
								id: '20',
								value: 'min(1.5rem, 2vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--20',
							},
							name: '2',
							isValueAddon: true,
							valueType: 'variable',
						},
						bottom: {
							settings: {
								name: '1',
								id: '10',
								value: '1rem',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--10',
							},
							name: '1',
							isValueAddon: true,
							valueType: 'variable',
						},
						left: {
							settings: {
								name: '2',
								id: '20',
								value: 'min(1.5rem, 2vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--20',
							},
							name: '2',
							isValueAddon: true,
							valueType: 'variable',
						},
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change top margin
			openBoxSpacingSide('margin-top');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.clickValueAddonButton();
					cy.selectValueAddonItem('30');
				});

			// change right margin
			openBoxSpacingSide('margin-right');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.clickValueAddonButton();
					cy.selectValueAddonItem('40');
				});

			// change bottom margin
			openBoxSpacingSide('margin-bottom');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.clickValueAddonButton();
					cy.selectValueAddonItem('50');
				});

			// change left margin
			openBoxSpacingSide('margin-left');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.clickValueAddonButton();
					cy.selectValueAddonItem('60');
				});

			// change top padding
			openBoxSpacingSide('padding-top');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.clickValueAddonButton();
					cy.selectValueAddonItem('10');
				});

			// change right padding
			openBoxSpacingSide('padding-right');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.clickValueAddonButton();
					cy.selectValueAddonItem('20');
				});

			// change bottom padding
			openBoxSpacingSide('padding-bottom');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.clickValueAddonButton();
					cy.selectValueAddonItem('30');
				});

			// change left padding
			openBoxSpacingSide('padding-left');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.clickValueAddonButton();
					cy.selectValueAddonItem('40');
				});

			// Assert Blockera value
			getWPDataObject().then((data) => {
				expect({
					margin: {
						top: {
							settings: {
								name: '3',
								id: '30',
								value: 'min(2.5rem, 3vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--30',
							},
							name: '3',
							isValueAddon: true,
							valueType: 'variable',
						},
						right: {
							settings: {
								name: '4',
								id: '40',
								value: 'min(4rem, 5vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--40',
							},
							name: '4',
							isValueAddon: true,
							valueType: 'variable',
						},
						bottom: {
							settings: {
								name: '5',
								id: '50',
								value: 'min(6.5rem, 8vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--50',
							},
							name: '5',
							isValueAddon: true,
							valueType: 'variable',
						},
						left: {
							settings: {
								name: '6',
								id: '60',
								value: 'min(10.5rem, 13vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--60',
							},
							name: '6',
							isValueAddon: true,
							valueType: 'variable',
						},
					},
					padding: {
						top: {
							settings: {
								name: '1',
								id: '10',
								value: '1rem',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--10',
							},
							name: '1',
							isValueAddon: true,
							valueType: 'variable',
						},
						right: {
							settings: {
								name: '2',
								id: '20',
								value: 'min(1.5rem, 2vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--20',
							},
							name: '2',
							isValueAddon: true,
							valueType: 'variable',
						},
						bottom: {
							settings: {
								name: '3',
								id: '30',
								value: 'min(2.5rem, 3vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--30',
							},
							name: '3',
							isValueAddon: true,
							valueType: 'variable',
						},
						left: {
							settings: {
								name: '4',
								id: '40',
								value: 'min(4rem, 5vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--40',
							},
							name: '4',
							isValueAddon: true,
							valueType: 'variable',
						},
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			// Assert WP value
			getWPDataObject().then((data) => {
				expect({
					margin: {
						top: 'var:preset|spacing|30',
						right: 'var:preset|spacing|40',
						bottom: 'var:preset|spacing|50',
						left: 'var:preset|spacing|60',
					},
					padding: {
						top: 'var:preset|spacing|10',
						right: 'var:preset|spacing|20',
						bottom: 'var:preset|spacing|30',
						left: 'var:preset|spacing|40',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'style')?.spacing);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// change top margin
			[
				'margin-top',
				'margin-right',
				'margin-bottom',
				'margin-left',
				'padding-top',
				'padding-right',
				'padding-bottom',
				'padding-left',
			].forEach((side) => {
				cy.get(`[data-cy="box-spacing-${side}"]`).within(() => {
					cy.removeValueAddon();
				});
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect({
					margin: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
					padding: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.spacing?.margin
				);
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.spacing?.padding
				);
			});
		});

		it('Both (Variable and simple values)', () => {
			appendBlocks(
				`<!-- wp:paragraph {"style":{"spacing":{"padding":{"top":"100px","bottom":"100px","left":"var:preset|spacing|10","right":"var:preset|spacing|10"},"margin":{"top":"var:preset|spacing|10","bottom":"var:preset|spacing|10","left":"100px","right":"100px"}}}} -->
<p style="margin-top:var(--wp--preset--spacing--10);margin-right:100px;margin-bottom:var(--wp--preset--spacing--10);margin-left:100px;padding-top:100px;padding-right:var(--wp--preset--spacing--10);padding-bottom:100px;padding-left:var(--wp--preset--spacing--10)">Test paragraph...</p>
<!-- /wp:paragraph -->`
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			// Assert WP value
			getWPDataObject().then((data) => {
				expect({
					margin: {
						top: 'var:preset|spacing|10',
						right: '100px',
						bottom: 'var:preset|spacing|10',
						left: '100px',
					},
					padding: {
						top: '100px',
						right: 'var:preset|spacing|10',
						bottom: '100px',
						left: 'var:preset|spacing|10',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'style')?.spacing);
			});

			//
			// Test 1: WP data to Blockera
			//

			// Assert Blockera value
			getWPDataObject().then((data) => {
				expect({
					padding: {
						top: '100px',
						right: {
							settings: {
								name: '1',
								id: '10',
								value: '1rem',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--10',
							},
							name: '1',
							isValueAddon: true,
							valueType: 'variable',
						},
						bottom: '100px',
						left: {
							settings: {
								name: '1',
								id: '10',
								value: '1rem',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--10',
							},
							name: '1',
							isValueAddon: true,
							valueType: 'variable',
						},
					},
					margin: {
						top: {
							settings: {
								name: '1',
								id: '10',
								value: '1rem',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--10',
							},
							name: '1',
							isValueAddon: true,
							valueType: 'variable',
						},
						right: '100px',
						bottom: {
							settings: {
								name: '1',
								id: '10',
								value: '1rem',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--10',
							},
							name: '1',
							isValueAddon: true,
							valueType: 'variable',
						},
						left: '100px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			//
			// Test 2: Blockera value to WP data
			//

			// change top margin
			cy.get(`[data-cy="box-spacing-margin-top"]`).within(() => {
				cy.removeValueAddon();
			});
			setBoxSpacingSide('margin-top', '50');

			// change right margin
			cy.get(`[data-cy="box-spacing-margin-right"]`).within(() => {
				cy.openValueAddon();
			});
			cy.selectValueAddonItem('50');

			// // change bottom margin
			cy.get(`[data-cy="box-spacing-margin-bottom"]`).within(() => {
				cy.removeValueAddon();
			});
			setBoxSpacingSide('margin-bottom', '50');

			// // change left margin
			cy.get(`[data-cy="box-spacing-margin-left"]`).within(() => {
				cy.openValueAddon();
			});
			cy.selectValueAddonItem('50');

			// change top padding
			cy.get(`[data-cy="box-spacing-padding-top"]`).within(() => {
				cy.openValueAddon();
			});
			cy.selectValueAddonItem('50');

			// change right padding
			cy.get(`[data-cy="box-spacing-padding-right"]`).within(() => {
				cy.removeValueAddon();
			});
			setBoxSpacingSide('padding-right', '50');

			// change bottom padding
			cy.get(`[data-cy="box-spacing-padding-bottom"]`).within(() => {
				cy.openValueAddon();
			});
			cy.selectValueAddonItem('50');

			// change left padding
			cy.get(`[data-cy="box-spacing-padding-left"]`).within(() => {
				cy.removeValueAddon();
			});
			setBoxSpacingSide('padding-left', '50');

			// Assert Blockera value
			getWPDataObject().then((data) => {
				expect({
					margin: {
						right: {
							settings: {
								name: '5',
								id: '50',
								value: 'min(6.5rem, 8vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--50',
							},
							name: '5',
							isValueAddon: true,
							valueType: 'variable',
						},
						left: {
							settings: {
								name: '5',
								id: '50',
								value: 'min(6.5rem, 8vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--50',
							},
							name: '5',
							isValueAddon: true,
							valueType: 'variable',
						},
						top: '50px',
						bottom: '50px',
					},
					padding: {
						top: {
							settings: {
								name: '5',
								id: '50',
								value: 'min(6.5rem, 8vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--50',
							},
							name: '5',
							isValueAddon: true,
							valueType: 'variable',
						},
						bottom: {
							settings: {
								name: '5',
								id: '50',
								value: 'min(6.5rem, 8vw)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--50',
							},
							name: '5',
							isValueAddon: true,
							valueType: 'variable',
						},
						right: '50px',
						left: '50px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			// Assert WP value
			getWPDataObject().then((data) => {
				expect({
					padding: {
						top: 'var:preset|spacing|50',
						bottom: 'var:preset|spacing|50',
						left: '50px',
						right: '50px',
					},
					margin: {
						top: '50px',
						bottom: '50px',
						left: 'var:preset|spacing|50',
						right: 'var:preset|spacing|50',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'style')?.spacing);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear margin
			clearBoxSpacingSide('margin-top');
			cy.get(`[data-cy="box-spacing-margin-right"]`).within(() => {
				cy.removeValueAddon();
			});
			clearBoxSpacingSide('margin-bottom');
			cy.get(`[data-cy="box-spacing-margin-left"]`).within(() => {
				cy.removeValueAddon();
			});

			// clear padding
			cy.get(`[data-cy="box-spacing-padding-top"]`).within(() => {
				cy.removeValueAddon();
			});
			clearBoxSpacingSide('padding-right');
			cy.get(`[data-cy="box-spacing-padding-bottom"]`).within(() => {
				cy.removeValueAddon();
			});
			clearBoxSpacingSide('padding-left');

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect({
					margin: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
					padding: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.spacing?.margin
				);
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.spacing?.padding
				);
			});
		});
	});
});
