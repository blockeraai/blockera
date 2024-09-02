/**
 * Blockera dependencies
 */
import {
	createPost,
	savePage,
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

			cy.get('.blockera-block')
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
					cy.selectValueAddonItem('10');
				});

			openBoxSpacingSide('margin-right');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('20');
				});

			openBoxSpacingSide('margin-bottom');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('30');
				});

			openBoxSpacingSide('margin-left');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('40');
				});

			// Check block style
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should(
						'include',
						'margin-top: var(--wp--preset--spacing--10)'
					)
					.should(
						'include',
						'margin-right: var(--wp--preset--spacing--20)'
					)
					.should(
						'include',
						'margin-bottom: var(--wp--preset--spacing--30)'
					)
					.should(
						'include',
						'margin-left: var(--wp--preset--spacing--40)'
					);
			});

			// Check block attributes
			getWPDataObject().then((data) => {
				expect({
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

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#blockera-inline-css-inline-css')
				.invoke('text')
				.should('include', 'margin-top: var(--wp--preset--spacing--10)')
				.should(
					'include',
					'margin-right: var(--wp--preset--spacing--20)'
				)
				.should(
					'include',
					'margin-bottom: var(--wp--preset--spacing--30)'
				)
				.should(
					'include',
					'margin-left: var(--wp--preset--spacing--40)'
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

			cy.get('.blockera-block')
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
					cy.selectValueAddonItem('10');
				});

			openBoxSpacingSide('padding-right');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('20');
				});

			openBoxSpacingSide('padding-bottom');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('30');
				});

			openBoxSpacingSide('padding-left');
			cy.get('[data-wp-component="Popover"]')
				.last()
				.within(() => {
					cy.openValueAddon();
					cy.selectValueAddonItem('40');
				});

			// Check block style
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should(
						'include',
						'padding-top: var(--wp--preset--spacing--10)'
					)
					.should(
						'include',
						'padding-right: var(--wp--preset--spacing--20)'
					)
					.should(
						'include',
						'padding-bottom: var(--wp--preset--spacing--30)'
					)
					.should(
						'include',
						'padding-left: var(--wp--preset--spacing--40)'
					);
			});

			// Check block attributes
			getWPDataObject().then((data) => {
				expect({
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

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#blockera-inline-css-inline-css')
				.invoke('text')
				.should(
					'include',
					'padding-top: var(--wp--preset--spacing--10)'
				)
				.should(
					'include',
					'padding-right: var(--wp--preset--spacing--20)'
				)
				.should(
					'include',
					'padding-bottom: var(--wp--preset--spacing--30)'
				)
				.should(
					'include',
					'padding-left: var(--wp--preset--spacing--40)'
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
						bottom: '40px',
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
					},
					padding: {
						top: '10px',
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
						bottom: '30px',
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

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#blockera-inline-css-inline-css')
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
							cy.get('input[type=number]').type('-15');
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
						cy.selectValueAddonItem('10');
					});

				cy.get('@Position')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('1');
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
				cy.get('@SideShape').dragValue('vertical', 20);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('20');
					});

				// negative drag value change
				// margin supports negative values
				cy.get('@SideShape').dragValue('vertical', -35);

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
				cy.get('@SideShape').dragValue('vertical', 20);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('20');
					});

				// negative drag value change
				// margin supports negative values
				cy.get('@SideShape').dragValue('vertical', -35);

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
				cy.get('@SideShape').dragValue('vertical', 20);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('20');
					});

				// negative drag value change
				cy.get('@SideShape').dragValue('vertical', -15);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('5');
					});

				// negative drag value change
				// padding does not supports negative values
				// min value is 0
				cy.get('@SideShape').dragValue('vertical', -15);

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
				cy.get('@SideShape').dragValue('vertical', 20);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('20');
					});

				// negative drag value change
				cy.get('@SideShape').dragValue('vertical', -15);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('5');
					});

				// negative drag value change
				// padding does not supports negative values
				// min value is 0
				cy.get('@SideShape').dragValue('vertical', -15);

				cy.get('@SideLabel')
					.invoke('text')
					.then((text) => {
						expect(text.trim().replace(item, '')).to.eq('0');
					});
			});
		});
	});

	describe('Side locking', () => {
		it('Lock button for padding and margin', () => {
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
					)
						.invoke('text')
						.then((text) => {
							expect(text.trim()).to.eq('20');
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

							cy.get('input[type=number]').clear({ force: true });
							cy.get('input[type=number]').clear({ force: true });
							cy.get('input[type=number]').type(
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

							cy.get('input[type=number]').clear({ force: true });
							cy.get('input[type=number]').clear({ force: true });
							cy.get('input[type=number]').type(
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
								cy.customSelect(
									'Lock Vertically & Horizontally'
								);
							});
					} else {
						// first is margin select
						cy.get('.blockera-control-select.custom')
							.first()
							.within(() => {
								cy.customSelect(
									'Lock Vertically & Horizontally'
								);
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

							cy.get('input[type=number]').clear({ force: true });
							cy.get('input[type=number]').clear({ force: true });
							cy.get('input[type=number]').type(
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

							cy.get('input[type=number]').clear({ force: true });
							cy.get('input[type=number]').clear({ force: true });
							cy.get('input[type=number]').type(
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

				cy.get(
					'.blockera-control-spacing-shape-side.side-all'
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

							cy.get('input[type=number]').clear({ force: true });
							cy.get('input[type=number]').clear({ force: true });
							cy.get('input[type=number]').type(
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

							cy.get('input[type=number]').clear({ force: true });
							cy.get('input[type=number]').clear({ force: true });
							cy.get('input[type=number]').type(
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
				// No locking
				//

				cy.get('@spacing').within(() => {
					if (item === 'padding') {
						// last is padding select
						cy.get('.blockera-control-select.custom')
							.last()
							.within(() => {
								cy.customSelect('No Lock');
							});
					} else {
						// first is margin select
						cy.get('.blockera-control-select.custom')
							.first()
							.within(() => {
								cy.customSelect('No Lock');
							});
					}
				});

				cy.get(
					`.blockera-control-spacing-shape-side.side-${item}-top`
				).dragValue('vertical', 20);

				// Top label value
				cy.get(
					`[data-cy="box-spacing-${item}-top"] [data-cy="label-control"]`
				)
					.invoke('text')
					.then((text) => {
						expect(text.trim()).to.eq('60');
					});

				['bottom', 'left', 'right'].forEach((side) => {
					cy.get(
						`[data-cy="box-spacing-${item}-${side}"] [data-cy="label-control"]`
					)
						.invoke('text')
						.then((text) => {
							expect(text.trim()).to.eq('40');
						});
				});
			});
		});
	});
});
