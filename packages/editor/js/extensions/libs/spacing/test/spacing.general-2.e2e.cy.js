/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	setBoxSpacingSide,
	openBoxSpacingSide,
} from '@blockera/dev-cypress/js/helpers';

describe('Spacing Extension', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });

		cy.getByDataTest('style-tab').click();

		cy.get('.blockera-control-box-spacing').as('spacing');
	});

	describe('Margin', () => {
		it('Simple value', () => {
			setBoxSpacingSide('margin-top', 10);
			setBoxSpacingSide('margin-right', 20);
			setBoxSpacingSide('margin-bottom', 10);
			setBoxSpacingSide('margin-left', 30);

			//Check block
			cy.getBlock('core/paragraph')
				.should('have.css', 'margin-top', '10px')
				.and('have.css', 'margin-right', '20px')
				.and('have.css', 'margin-bottom', '10px')
				.and('have.css', 'margin-left', '30px');

			//Check store
			getWPDataObject().then((data) => {
				expect({
					margin: {
						top: '10px',
						right: '20px',
						bottom: '10px',
						left: '30px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('p.blockera-block')
				.should('have.css', 'margin-top', '10px')
				.and('have.css', 'margin-right', '20px')
				.and('have.css', 'margin-bottom', '10px')
				.and('have.css', 'margin-left', '30px');
		});

		it('Variable value', () => {
			openBoxSpacingSide('margin-top');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('20');
				});

			openBoxSpacingSide('margin-right');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('30');
				});

			openBoxSpacingSide('margin-bottom');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('40');
				});

			openBoxSpacingSide('margin-left');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('50');
				});

			// Check block style
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should(
						'include',
						'margin-top: var(--wp--preset--spacing--20)'
					)
					.should(
						'include',
						'margin-right: var(--wp--preset--spacing--30)'
					)
					.should(
						'include',
						'margin-bottom: var(--wp--preset--spacing--40)'
					)
					.should(
						'include',
						'margin-left: var(--wp--preset--spacing--50)'
					);
			});

			// Check block attributes
			getWPDataObject().then((data) => {
				expect({
					margin: {
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
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#blockera-inline-css')
				.invoke('text')
				.should('include', 'margin-top: var(--wp--preset--spacing--20)')
				.should(
					'include',
					'margin-right: var(--wp--preset--spacing--30)'
				)
				.should(
					'include',
					'margin-bottom: var(--wp--preset--spacing--40)'
				)
				.should(
					'include',
					'margin-left: var(--wp--preset--spacing--50)'
				);
		});
	});

	describe('Padding', () => {
		it('Simple value', () => {
			setBoxSpacingSide('padding-top', 10);
			setBoxSpacingSide('padding-right', 20);
			setBoxSpacingSide('padding-bottom', 10);
			setBoxSpacingSide('padding-left', 30);

			//Check block
			cy.getBlock('core/paragraph')
				.should('have.css', 'padding-top', '10px')
				.and('have.css', 'padding-right', '20px')
				.and('have.css', 'padding-bottom', '10px')
				.and('have.css', 'padding-left', '30px');

			//Check store
			getWPDataObject().then((data) => {
				expect({
					padding: {
						top: '10px',
						right: '20px',
						bottom: '10px',
						left: '30px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('p.blockera-block')
				.should('have.css', 'padding-top', '10px')
				.and('have.css', 'padding-right', '20px')
				.and('have.css', 'padding-bottom', '10px')
				.and('have.css', 'padding-left', '30px');
		});

		it('Variable value', () => {
			openBoxSpacingSide('padding-top');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('20');
				});

			openBoxSpacingSide('padding-right');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('30');
				});

			openBoxSpacingSide('padding-bottom');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('40');
				});

			openBoxSpacingSide('padding-left');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('50');
				});

			// Check block style
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should(
						'include',
						'padding-top: var(--wp--preset--spacing--20)'
					)
					.should(
						'include',
						'padding-right: var(--wp--preset--spacing--30)'
					)
					.should(
						'include',
						'padding-bottom: var(--wp--preset--spacing--40)'
					)
					.should(
						'include',
						'padding-left: var(--wp--preset--spacing--50)'
					);
			});

			// Check block attributes
			getWPDataObject().then((data) => {
				expect({
					padding: {
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
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#blockera-inline-css')
				.invoke('text')
				.should(
					'include',
					'padding-top: var(--wp--preset--spacing--20)'
				)
				.should(
					'include',
					'padding-right: var(--wp--preset--spacing--30)'
				)
				.should(
					'include',
					'padding-bottom: var(--wp--preset--spacing--40)'
				)
				.should(
					'include',
					'padding-left: var(--wp--preset--spacing--50)'
				);
		});
	});

	describe('Both Padding + Margin', () => {
		it('All sides + Simple and Variable values', () => {
			//
			// Set Paddings
			//
			setBoxSpacingSide('padding-top', 10);

			openBoxSpacingSide('padding-right');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('20');
				});

			setBoxSpacingSide('padding-bottom', 30);

			openBoxSpacingSide('padding-left');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('40');
				});

			//
			// Set Margins
			//
			setBoxSpacingSide('margin-top', 20);

			openBoxSpacingSide('margin-right');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('30');
				});

			setBoxSpacingSide('margin-bottom', 40);

			openBoxSpacingSide('margin-left');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('50');
				});

			// Check block style
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should('include', 'padding-top: 10px')
					.should(
						'include',
						'padding-right: var(--wp--preset--spacing--20)'
					)
					.should('include', 'padding-bottom: 30px')
					.should(
						'include',
						'padding-left: var(--wp--preset--spacing--40)'
					)
					.should('include', 'margin-top: 20px')
					.should(
						'include',
						'margin-right: var(--wp--preset--spacing--30)'
					)
					.should('include', 'margin-bottom: 40px')
					.should(
						'include',
						'margin-left: var(--wp--preset--spacing--50)'
					);
			});

			// Check block attributes
			getWPDataObject().then((data) => {
				expect({
					margin: {
						top: '20px',
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
						bottom: '40px',
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
					padding: {
						top: '10px',
						right: {
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
						bottom: '30px',
						left: {
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
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#blockera-inline-css')
				.invoke('text')
				.should('include', 'padding-top: 10px')
				.should(
					'include',
					'padding-right: var(--wp--preset--spacing--20)'
				)
				.should('include', 'padding-bottom: 30px')
				.should(
					'include',
					'padding-left: var(--wp--preset--spacing--40)'
				)
				.should('include', 'margin-top: 20px')
				.should(
					'include',
					'margin-right: var(--wp--preset--spacing--30)'
				)
				.should('include', 'margin-bottom: 40px')
				.should(
					'include',
					'margin-left: var(--wp--preset--spacing--50)'
				);
		});
	});

	describe('Labels tests', () => {
		it('Label on sides with different value types', () => {
			const items = [
				'margin-top',
				'margin-right',
				'margin-bottom',
				'margin-left',
				'padding-top',
				'padding-right',
				'padding-bottom',
				'padding-left',
			];

			items.forEach((item) => {
				cy.get(
					`[data-cy="box-spacing-${item}"] [data-cy="label-control"]`
				).as('Position');

				//
				// Default label
				//
				cy.get('@Position')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('-');
					});

				//
				// Change to 10 (10px)
				//
				setBoxSpacingSide(item, 10);
				cy.get('@Position')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('10');
					});

				//
				// Change to EM
				//
				cy.get('[data-wp-component="Popover"]')
					.last()
					.within(() => {
						cy.get('[aria-label="Select Unit"]').select('em');
					});
				cy.get('@Position')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('10em');
					});

				//
				// Change to Auto (only in margin)
				//
				if (
					[
						'margin-top',
						'margin-right',
						'margin-bottom',
						'margin-left',
					].includes(item)
				) {
					cy.get('[data-wp-component="Popover"]')
						.last()
						.within(() => {
							cy.get('[aria-label="Select Unit"]').select('auto');
						});

					cy.get('@Position')
						.invoke('text')
						.then((text) => {
							expect(text.trim().replace(item, '')).to.eq('AUTO');
						});
				}

				//
				// Change to Px and negative value
				//
				if (
					[
						'margin-top',
						'margin-right',
						'margin-bottom',
						'margin-left',
					].includes(item)
				) {
					cy.get('[data-wp-component="Popover"]')
						.last()
						.within(() => {
							cy.get('[aria-label="Select Unit"]').select('px');
							cy.get('input[type=text]').type('-15');
						});

					cy.get('@Position')
						.invoke('text')
						.then((text) => {
							expect(text.trim().replace(item, '')).to.eq('-15');
						});
				}

				//
				// Change to CSS Func
				//
				cy.get('[data-wp-component="Popover"]')
					.last()
					.within(() => {
						cy.get('[aria-label="Select Unit"]').select('func');
						cy.get('input[type=text]').clear({ force: true });
						cy.get('input[type=text]').type('calc(10px + 10px)');
					});

				cy.get('@Position')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('CSS');
					});

				//
				// Change to a variable
				//
				cy.get('[data-wp-component="Popover"]')
					.last()
					.within(() => {
						cy.openValueAddon();
						cy.selectValueAddonItem('20');
					});

				cy.get('@Position')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('Tiny');
					});
			});
		});
	});

	describe('Drag Value Changes', () => {
		it('change values with drag', () => {
			const marginVerticalItems = ['margin-top', 'margin-bottom'];

			marginVerticalItems.forEach((item) => {
				cy.get(
					`[data-cy="box-spacing-${item}"] [data-cy="label-control"]`
				).as('SideLabel');

				cy.get(`.blockera-control-spacing-shape-side.side-${item}`).as(
					'SideShape'
				);

				// positive drag value change
				cy.get('@SideShape').dragValue('vertical', 20, 0);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('20');
					});

				// negative drag value change
				// margin supports negative values
				cy.get('@SideShape').dragValue('vertical', -35, 0);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('-15');
					});
			});

			const marginHorizontalItems = ['margin-left', 'margin-right'];

			marginHorizontalItems.forEach((item) => {
				cy.get(
					`[data-cy="box-spacing-${item}"] [data-cy="label-control"]`
				).as('SideLabel');

				cy.get(`.blockera-control-spacing-shape-side.side-${item}`).as(
					'SideShape'
				);

				// positive drag value change
				cy.get('@SideShape').dragValue('vertical', 20, 0);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('20');
					});

				// negative drag value change
				// margin supports negative values
				cy.get('@SideShape').dragValue('vertical', -35, 0);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('-15');
					});
			});

			const paddingVerticalItems = ['padding-top', 'padding-bottom'];

			paddingVerticalItems.forEach((item) => {
				cy.get(
					`[data-cy="box-spacing-${item}"] [data-cy="label-control"]`
				).as('SideLabel');

				cy.get(`.blockera-control-spacing-shape-side.side-${item}`).as(
					'SideShape'
				);

				// positive drag value change
				cy.get('@SideShape').dragValue('vertical', 20, 0);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('20');
					});

				// negative drag value change
				cy.get('@SideShape').dragValue('vertical', -15, 0);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('5');
					});

				// negative drag value change
				// padding does not supports negative values
				// min value is 0
				cy.get('@SideShape').dragValue('vertical', -15, 0);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('0');
					});
			});

			const paddingHorizontalItems = ['padding-left', 'padding-right'];

			paddingHorizontalItems.forEach((item) => {
				cy.get(
					`[data-cy="box-spacing-${item}"] [data-cy="label-control"]`
				).as('SideLabel');

				cy.get(`.blockera-control-spacing-shape-side.side-${item}`).as(
					'SideShape'
				);

				// positive drag value change
				cy.get('@SideShape').dragValue('vertical', 20, 0);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('20');
					});

				// negative drag value change
				cy.get('@SideShape').dragValue('vertical', -15, 0);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('5');
					});

				// negative drag value change
				// padding does not supports negative values
				// min value is 0
				cy.get('@SideShape').dragValue('vertical', -15, 0);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('0');
					});
			});
		});
	});

	it('Side locking + clear value button', () => {
		//
		// No Locking
		//

		const sides = [
			'margin-top',
			'margin-right',
			'margin-bottom',
			'margin-left',
			'padding-top',
			'padding-right',
			'padding-bottom',
			'padding-left',
		];

		// Test individual sides
		sides.forEach((side) => {
			setBoxSpacingSide(side, 10);

			cy.get('.blockera-component-popover.spacing-edit-popover')
				.last()
				.within(() => {
					cy.getByAriaLabel('Remove value').click();
				});

			//
			// Check if the value is removed
			//
			cy.get(`[data-cy="box-spacing-${side}"] [data-cy="label-control"]`)
				.invoke('text')
				.then((text) => {
					expect(text.trim()).to.eq('-');
				});
		});

		['margin', 'padding'].forEach((item) => {
			//
			// Horizontal locking
			//

			cy.get('@spacing').within(() => {
				if (item === 'padding') {
					// last is padding select
					cy.get('.blockera-control-select.custom')
						.last()
						.within(() => {
							cy.customSelect('Lock Horizontally');
						});
				} else {
					// first is margin select
					cy.get('.blockera-control-select.custom')
						.first()
						.within(() => {
							cy.customSelect('Lock Horizontally');
						});
				}
			});

			cy.get(
				`.blockera-control-spacing-shape-side.side-horizontal.side-${item}-horizontal`
			).dragValue('vertical', 20);

			['left', 'right'].forEach((_side) => {
				cy.get(
					`[data-cy="box-spacing-${item}-${_side}"] [data-cy="label-control"]`
				).click();

				cy.get(
					`[data-cy="box-spacing-${item}-${_side}"] [data-cy="label-control"]`
				)
					.invoke('text')
					.then((text) => {
						expect(text.trim()).to.eq('20');
					});
			});

			//
			// Open popover by clicking on left
			//
			cy.get(
				`[data-cy="box-spacing-${item}-left"] [data-cy="label-control"]`
			).click();

			cy.get('.blockera-component-popover.spacing-edit-popover')
				.last()
				.within(() => {
					cy.getByAriaLabel('Remove value').click();
				});

			//
			// Check if the value is removed
			//
			['left', 'right'].forEach((_side) => {
				cy.get(
					`[data-cy="box-spacing-${item}-${_side}"] [data-cy="label-control"]`
				).click();

				cy.get(
					`[data-cy="box-spacing-${item}-${_side}"] [data-cy="label-control"]`
				)
					.invoke('text')
					.then((text) => {
						expect(text.trim()).to.eq('-');
					});
			});

			//
			// open popover by clicking on left and right label
			//
			['left', 'right'].forEach((side) => {
				cy.get(
					`[data-cy="box-spacing-${item}-${side}"] [data-cy="label-control"]`
				).click();

				// set value
				cy.get('[data-wp-component="Popover"]')
					.last()
					.within(() => {
						cy.get('[data-test="popover-header"]').contains(
							`Left & Right ${item} Space`,
							{ matchCase: false }
						);

						cy.get('input[type=text]').clear({ force: true });
						cy.get('input[type=text]').clear({ force: true });
						cy.get('input[type=text]').type(
							side === 'left' ? '30' : '40',
							{ delay: 0, force: true }
						);

						// close popover
						cy.getByAriaLabel('Close').click();
					});

				['left', 'right'].forEach((_side) => {
					cy.get(
						`[data-cy="box-spacing-${item}-${_side}"] [data-cy="label-control"]`
					)
						.invoke('text')
						.then((text) => {
							expect(text.trim()).to.eq(
								side === 'left' ? '30' : '40'
							);
						});
				});
			});

			//
			// Vertical locking
			//

			cy.get('@spacing').within(() => {
				if (item === 'padding') {
					// last is padding select
					cy.get('.blockera-control-select.custom')
						.last()
						.within(() => {
							cy.customSelect('Lock Vertically');
						});
				} else {
					// first is margin select
					cy.get('.blockera-control-select.custom')
						.first()
						.within(() => {
							cy.customSelect('Lock Vertically');
						});
				}
			});

			cy.get(
				`.blockera-control-spacing-shape-side.side-vertical.side-${item}-vertical`
			).dragValue('vertical', 20);

			['top', 'bottom'].forEach((_side) => {
				cy.get(
					`[data-cy="box-spacing-${item}-${_side}"] [data-cy="label-control"]`
				)
					.invoke('text')
					.then((text) => {
						expect(text.trim()).to.eq('20');
					});
			});

			//
			// Open popover by clicking on left
			//
			cy.get(
				`[data-cy="box-spacing-${item}-top"] [data-cy="label-control"]`
			).click();

			cy.get('.blockera-component-popover.spacing-edit-popover')
				.last()
				.within(() => {
					cy.getByAriaLabel('Remove value').click();
				});

			//
			// Check if the value is removed
			//
			['top', 'bottom'].forEach((_side) => {
				cy.get(
					`[data-cy="box-spacing-${item}-${_side}"] [data-cy="label-control"]`
				).click();

				cy.get(
					`[data-cy="box-spacing-${item}-${_side}"] [data-cy="label-control"]`
				)
					.invoke('text')
					.then((text) => {
						expect(text.trim()).to.eq('-');
					});
			});

			//
			// open popover by clicking on top and bottom labels
			//
			['top', 'bottom'].forEach((side) => {
				cy.get(
					`[data-cy="box-spacing-${item}-${side}"] [data-cy="label-control"]`
				).click();

				// set value
				cy.get('[data-wp-component="Popover"]')
					.last()
					.within(() => {
						cy.get('[data-test="popover-header"]').contains(
							`Top & Bottom ${item} Space`,
							{ matchCase: false }
						);

						cy.get('input[type=text]').clear({ force: true });
						cy.get('input[type=text]').clear({ force: true });
						cy.get('input[type=text]').type(
							side === 'top' ? '30' : '40',
							{ delay: 0, force: true }
						);

						// close popover
						cy.getByAriaLabel('Close').click();
					});

				['top', 'bottom'].forEach((_side) => {
					cy.get(
						`[data-cy="box-spacing-${item}-${_side}"] [data-cy="label-control"]`
					)
						.invoke('text')
						.then((text) => {
							expect(text.trim()).to.eq(
								side === 'top' ? '30' : '40'
							);
						});
				});
			});

			//
			// Vertically and Horizontally locking
			//

			cy.get('@spacing').within(() => {
				if (item === 'padding') {
					// last is padding select
					cy.get('.blockera-control-select.custom')
						.last()
						.within(() => {
							cy.customSelect('Lock Vertically & Horizontally');
						});
				} else {
					// first is margin select
					cy.get('.blockera-control-select.custom')
						.first()
						.within(() => {
							cy.customSelect('Lock Vertically & Horizontally');
						});
				}
			});

			cy.get(
				`.blockera-control-spacing-shape-side.side-vertical.side-${item}-vertical`
			).dragValue('vertical', 20);

			cy.get(
				`.blockera-control-spacing-shape-side.side-horizontal.side-${item}-horizontal`
			).dragValue('vertical', 20);

			['top', 'bottom', 'left', 'right'].forEach((_side) => {
				cy.get(
					`[data-cy="box-spacing-${item}-${_side}"] [data-cy="label-control"]`
				)
					.invoke('text')
					.then((text) => {
						expect(text.trim()).to.eq('60');
					});
			});

			//
			// open popover by clicking on left and right labels
			//
			['left', 'right'].forEach((side) => {
				cy.get(
					`[data-cy="box-spacing-${item}-${side}"] [data-cy="label-control"]`
				).click();

				// set value
				cy.get('[data-wp-component="Popover"]')
					.last()
					.within(() => {
						cy.get('[data-test="popover-header"]').contains(
							`Left & Right ${item} Space`,
							{ matchCase: false }
						);

						cy.get('input[type=text]').clear({ force: true });
						cy.get('input[type=text]').clear({ force: true });
						cy.get('input[type=text]').type(
							side === 'left' ? '30' : '40',
							{ delay: 0, force: true }
						);

						// close popover
						cy.getByAriaLabel('Close').click();
					});

				['left', 'right'].forEach((_side) => {
					cy.get(
						`[data-cy="box-spacing-${item}-${_side}"] [data-cy="label-control"]`
					)
						.invoke('text')
						.then((text) => {
							expect(text.trim()).to.eq(
								side === 'left' ? '30' : '40'
							);
						});
				});
			});

			//
			// open popover by clicking on top and bottom labels
			//
			['top', 'bottom'].forEach((side) => {
				cy.get(
					`[data-cy="box-spacing-${item}-${side}"] [data-cy="label-control"]`
				).click();

				// set value
				cy.get('[data-wp-component="Popover"]')
					.last()
					.within(() => {
						cy.get('[data-test="popover-header"]').contains(
							`Top & Bottom ${item} Space`,
							{ matchCase: false }
						);

						cy.get('input[type=text]').clear({ force: true });
						cy.get('input[type=text]').clear({ force: true });
						cy.get('input[type=text]').type(
							side === 'top' ? '30' : '40',
							{ delay: 0, force: true }
						);

						// close popover
						cy.getByAriaLabel('Close').click();
					});

				['top', 'bottom'].forEach((_side) => {
					cy.get(
						`[data-cy="box-spacing-${item}-${_side}"] [data-cy="label-control"]`
					)
						.invoke('text')
						.then((text) => {
							expect(text.trim()).to.eq(
								side === 'top' ? '30' : '40'
							);
						});
				});
			});

			//
			// All locking
			//

			cy.get('@spacing').within(() => {
				if (item === 'padding') {
					// last is padding select
					cy.get('.blockera-control-select.custom')
						.last()
						.within(() => {
							cy.customSelect('Lock All');
						});
				} else {
					// first is margin select
					cy.get('.blockera-control-select.custom')
						.first()
						.within(() => {
							cy.customSelect('Lock All');
						});
				}
			});

			cy.get('.blockera-control-spacing-shape-side.side-all').dragValue(
				'vertical',
				20
			);

			cy.wait(100);

			['top', 'bottom', 'left', 'right'].forEach((_side) => {
				cy.get(
					`[data-cy="box-spacing-${item}-${_side}"] [data-cy="label-control"]`
				)
					.invoke('text')
					.then((text) => {
						expect(text.trim()).to.eq(
							item === 'padding' ? '40' : '60'
						);
					});
			});

			//
			// open popover by clicking on top and bottom labels
			//
			['top', 'bottom'].forEach((side) => {
				cy.get(
					`[data-cy="box-spacing-${item}-${side}"] [data-cy="label-control"]`
				).click();

				// set value
				cy.get('[data-wp-component="Popover"]')
					.last()
					.within(() => {
						cy.get('[data-test="popover-header"]').contains(
							`All Sides ${item}`,
							{ matchCase: false }
						);

						cy.get('input[type=text]').clear({ force: true });
						cy.get('input[type=text]').clear({ force: true });
						cy.get('input[type=text]').type(
							side === 'top' ? '30' : '40',
							{ delay: 0, force: true }
						);

						// close popover
						cy.getByAriaLabel('Close').click();
					});

				['top', 'bottom', 'left', 'right'].forEach((_side) => {
					cy.get(
						`[data-cy="box-spacing-${item}-${_side}"] [data-cy="label-control"]`
					)
						.invoke('text')
						.then((text) => {
							expect(text.trim()).to.eq(
								side === 'top' ? '30' : '40'
							);
						});
				});
			});

			//
			// open popover by clicking on left and right labels
			//
			['left', 'right'].forEach((side) => {
				cy.get(
					`[data-cy="box-spacing-${item}-${side}"] [data-cy="label-control"]`
				).click();

				// set value
				cy.get('[data-wp-component="Popover"]')
					.last()
					.within(() => {
						cy.get('[data-test="popover-header"]').contains(
							`All Sides ${item}`,
							{ matchCase: false }
						);

						cy.get('input[type=text]').clear({ force: true });
						cy.get('input[type=text]').clear({ force: true });
						cy.get('input[type=text]').type(
							side === 'left' ? '30' : '40',
							{ delay: 0, force: true }
						);

						// close popover
						cy.getByAriaLabel('Close').click();
					});

				['top', 'bottom', 'left', 'right'].forEach((_side) => {
					cy.get(
						`[data-cy="box-spacing-${item}-${_side}"] [data-cy="label-control"]`
					)
						.invoke('text')
						.then((text) => {
							expect(text.trim()).to.eq(
								side === 'left' ? '30' : '40'
							);
						});
				});
			});

			//
			// Open popover by clicking on left
			//
			cy.get(
				`[data-cy="box-spacing-${item}-left"] [data-cy="label-control"]`
			).click();

			cy.get('.blockera-component-popover.spacing-edit-popover')
				.last()
				.within(() => {
					cy.getByAriaLabel('Remove value').click();
				});

			//
			// Check if the value is removed
			//
			['top', 'bottom', 'left', 'right'].forEach((_side) => {
				cy.get(
					`[data-cy="box-spacing-${item}-${_side}"] [data-cy="label-control"]`
				).click();

				cy.get(
					`[data-cy="box-spacing-${item}-${_side}"] [data-cy="label-control"]`
				)
					.invoke('text')
					.then((text) => {
						expect(text.trim()).to.eq('-');
					});
			});
		});
	});

	it('Open popover by clicking label and shape', () => {
		const sides = [
			'margin-top',
			'margin-right',
			'margin-bottom',
			'margin-left',
			'padding-top',
			'padding-right',
			'padding-bottom',
			'padding-left',
		];

		// Test individual sides
		sides.forEach((side) => {
			// Test label click
			openBoxSpacingSide(side, 'label');
			cy.get('.blockera-component-popover.spacing-edit-popover')
				.last()
				.within(() => {
					cy.get('[data-test="popover-header"]').should('exist');
					cy.getByAriaLabel('Close').click();
				});

			// // Test shape click
			// openBoxSpacingSide(side, 'shape');
			// cy.wait(300);
			// cy.get('.blockera-component-popover.spacing-edit-popover')
			// 	.last()
			// 	.within(() => {
			// 		cy.get('[data-test="popover-header"]').should('exist');
			// 		cy.getByAriaLabel('Close').click();
			// 	});
		});

		// Test horizontal locking
		['margin', 'padding'].forEach((type) => {
			// Set horizontal locking
			cy.get('@spacing').within(() => {
				if (type === 'padding') {
					cy.get('.blockera-control-select.custom')
						.last()
						.within(() => {
							cy.customSelect('Lock Horizontally');
						});
				} else {
					cy.get('.blockera-control-select.custom')
						.first()
						.within(() => {
							cy.customSelect('Lock Horizontally');
						});
				}
			});

			// Test left side label and shape
			openBoxSpacingSide(`${type}-left`, 'label');
			cy.get('.spacing-edit-popover')
				.last()
				.within(() => {
					cy.get('[data-test="popover-header"]').contains(
						`Left & Right ${type} Space`,
						{ matchCase: false }
					);
					cy.getByAriaLabel('Close').click();
				});

			// openBoxSpacingSide(`${type}-horizontal`, 'shape');
			// cy.get('.spacing-edit-popover')
			// 	.last()
			// 	.within(() => {
			// 		cy.get('[data-test="popover-header"]').contains(
			// 			`Left & Right ${type} Space`,
			// 			{ matchCase: false }
			// 		);
			// 		cy.getByAriaLabel('Close').click();
			// 	});
		});

		// Test vertical locking
		['margin', 'padding'].forEach((type) => {
			// Set vertical locking
			cy.get('@spacing').within(() => {
				if (type === 'padding') {
					cy.get('.blockera-control-select.custom')
						.last()
						.within(() => {
							cy.customSelect('Lock Vertically');
						});
				} else {
					cy.get('.blockera-control-select.custom')
						.first()
						.within(() => {
							cy.customSelect('Lock Vertically');
						});
				}
			});

			// Test top side label and shape
			openBoxSpacingSide(`${type}-top`, 'label');
			cy.get('.spacing-edit-popover')
				.last()
				.within(() => {
					cy.get('[data-test="popover-header"]').contains(
						`Top & Bottom ${type} Space`,
						{ matchCase: false }
					);
					cy.getByAriaLabel('Close').click();
				});

			// openBoxSpacingSide(`${type}-vertical`, 'shape');
			// cy.get('.spacing-edit-popover')
			// 	.last()
			// 	.within(() => {
			// 		cy.get('[data-test="popover-header"]').contains(
			// 			`Top & Bottom ${type} Space`,
			// 			{ matchCase: false }
			// 		);
			// 		cy.getByAriaLabel('Close').click();
			// 	});
		});

		// Test all sides locking
		['margin', 'padding'].forEach((type) => {
			// Set all sides locking
			cy.get('@spacing').within(() => {
				if (type === 'padding') {
					cy.get('.blockera-control-select.custom')
						.last()
						.within(() => {
							cy.customSelect('Lock All');
						});
				} else {
					cy.get('.blockera-control-select.custom')
						.first()
						.within(() => {
							cy.customSelect('Lock All');
						});
				}
			});

			// Test top side label and shape
			openBoxSpacingSide(`${type}-top`, 'label');
			cy.get('.spacing-edit-popover')
				.last()
				.within(() => {
					cy.get('[data-test="popover-header"]').contains(
						`All Sides ${type}`,
						{ matchCase: false }
					);
					cy.getByAriaLabel('Close').click();
				});

			// openBoxSpacingSide(`${type}-all`, 'shape');
			// cy.get('.spacing-edit-popover')
			// 	.last()
			// 	.within(() => {
			// 		cy.get('[data-test="popover-header"]').contains(
			// 			`All Sides ${type}`,
			// 			{ matchCase: false }
			// 		);
			// 		cy.getByAriaLabel('Close').click();
			// 	});
		});
	});
});
