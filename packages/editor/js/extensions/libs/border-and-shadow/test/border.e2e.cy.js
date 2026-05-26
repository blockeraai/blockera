import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Border → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Border Line').as('container');
	});

	describe('Simple Value', () => {
		it('should update border when add same data to all side', () => {
			cy.get('@container').within(() => {
				cy.getByDataTest('border-control-width').clear();
				cy.getByDataTest('border-control-width').type(5, {
					force: true,
				});

				cy.getByDataTest('border-control-color').click();
			});

			cy.getByDataTest('popover-body').within(() => {
				cy.get('input[maxlength="9"]').clear({ force: true });
				cy.get('input[maxlength="9"]').type('37e6d4 ');
			});

			cy.get('@container').within(() => {
				cy.get('[aria-haspopup="listbox"]').click();
				cy.get('div[aria-selected="false"]').eq(1).click();
			});

			//Check block
			cy.getBlock('core/paragraph').should(
				'have.css',
				'border',
				'5px dashed rgb(55, 230, 212)'
			);

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'all',
					all: {
						width: '5px',
						style: 'dashed',
						color: '#37e6d4',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraBorder'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('p.blockera-block').should(
				'have.css',
				'border',
				'5px dashed rgb(55, 230, 212)'
			);
		});

		it('all side but not select border style', () => {
			cy.get('@container').within(() => {
				cy.getByDataTest('border-control-width').clear();
				cy.getByDataTest('border-control-width').type(5, {
					force: true,
				});

				cy.getByDataTest('border-control-color').click();
			});

			cy.getByDataTest('popover-body').within(() => {
				cy.get('input[maxlength="9"]').clear({ force: true });
				cy.get('input[maxlength="9"]').type('37e6d4 ');
			});

			//Check block
			cy.getBlock('core/paragraph').should(
				'have.css',
				'border',
				'5px solid rgb(55, 230, 212)'
			);

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'all',
					all: {
						width: '5px',
						style: '',
						color: '#37e6d4',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraBorder'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('p.blockera-block').should(
				'have.css',
				'border',
				'5px solid rgb(55, 230, 212)'
			);
		});

		it('custom borders', () => {
			//
			// Top Border
			//
			cy.get('@container').within(() => {
				cy.getByAriaLabel('Custom Box Border').click();
				cy.getByDataTest('border-control-component')
					.eq(0)
					.within(() => {
						cy.getByDataTest('border-control-width').clear();
						cy.getByDataTest('border-control-width').type(1, {
							force: true,
						});

						cy.get('[aria-haspopup="listbox"]').trigger('click');
						cy.get('div').eq(0).trigger('click');

						cy.getByDataTest('border-control-color').click();
					});
			});

			// color
			cy.getByDataTest('popover-body').within(() => {
				cy.get('input[maxlength="9"]').clear({ force: true });
				cy.get('input[maxlength="9"]').type('73ddab ');
			});

			//Check block
			cy.getBlock('core/paragraph').should(
				'have.css',
				'border-top',
				'1px solid rgb(115, 221, 171)'
			);

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'custom',
					all: { color: '', style: '', width: '' },
					left: { color: '', style: '', width: '' },
					right: { color: '', style: '', width: '' },
					bottom: { color: '', style: '', width: '' },
					top: {
						color: '#73ddab',
						style: '',
						width: '1px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraBorder'));
			});

			//
			// Right Border
			//
			cy.get('@container').within(() => {
				cy.getByDataTest('border-control-component')
					.eq(1)
					.within(() => {
						cy.getByDataTest('border-control-width').clear({
							force: true,
						});
						cy.getByDataTest('border-control-width').type(2, {
							force: true,
						});

						cy.get('[aria-haspopup="listbox"]').trigger('click');
						cy.get('div[aria-selected="false"]')
							.eq(1)
							.trigger('click');

						cy.getByDataTest('border-control-color').click();
					});
			});

			// color
			cy.getByDataTest('popover-body').within(() => {
				cy.get('input[maxlength="9"]').clear({ force: true });
				cy.get('input[maxlength="9"]').type('9958e3 ');
			});

			//Check block
			cy.getBlock('core/paragraph').should(
				'have.css',
				'border-right',
				'2px dashed rgb(153, 88, 227)'
			);

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'custom',
					all: { color: '', style: '', width: '' },
					left: { color: '', style: '', width: '' },
					right: {
						color: '#9958e3',
						style: 'dashed',
						width: '2px',
					},
					bottom: { color: '', style: '', width: '' },
					top: {
						color: '#73ddab',
						style: '',
						width: '1px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraBorder'));
			});

			//
			// Bottom Border
			//
			cy.get('@container').within(() => {
				cy.getByDataTest('border-control-component')
					.eq(2)
					.within(() => {
						cy.getByDataTest('border-control-width').clear({
							force: true,
						});
						cy.getByDataTest('border-control-width').type(3, {
							force: true,
						});

						cy.get('[aria-haspopup="listbox"]').trigger('click');
						cy.get('div[aria-selected="false"]')
							.eq(2)
							.trigger('click');

						cy.getByDataTest('border-control-color').click();
					});
			});

			// color
			cy.getByDataTest('popover-body').within(() => {
				cy.get('input[maxlength="9"]').clear({ force: true });
				cy.get('input[maxlength="9"]').type('eba492 ');
			});

			//Check block
			cy.getBlock('core/paragraph').should(
				'have.css',
				'border-bottom',
				'3px dotted rgb(235, 164, 146)'
			);

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'custom',
					all: { color: '', style: '', width: '' },
					left: { color: '', style: '', width: '' },
					right: {
						color: '#9958e3',
						style: 'dashed',
						width: '2px',
					},
					bottom: {
						color: '#eba492',
						style: 'dotted',
						width: '3px',
					},
					top: {
						color: '#73ddab',
						style: '',
						width: '1px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraBorder'));
			});

			//
			// Left Border
			//
			cy.get('@container').within(() => {
				cy.getByDataTest('border-control-component')
					.eq(3)
					.within(() => {
						cy.getByDataTest('border-control-width').clear({
							force: true,
						});
						cy.getByDataTest('border-control-width').type(4, {
							force: true,
						});

						cy.get('[aria-haspopup="listbox"]').trigger('click');
						cy.get('div[aria-selected="false"]')
							.eq(3)
							.trigger('click');

						cy.getByDataTest('border-control-color').click();
					});
			});

			// color
			cy.getByDataTest('popover-body').within(() => {
				cy.get('input[maxlength="9"]').clear({ force: true });
				cy.get('input[maxlength="9"]').type('1893da ');
			});

			//Check block
			cy.getBlock('core/paragraph').should(
				'have.css',
				'border-left',
				'4px double rgb(24, 147, 218)'
			);

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'custom',
					all: { color: '', style: '', width: '' },
					left: {
						color: '#1893da',
						style: 'double',
						width: '4px',
					},
					right: {
						color: '#9958e3',
						style: 'dashed',
						width: '2px',
					},
					bottom: {
						color: '#eba492',
						style: 'dotted',
						width: '3px',
					},
					top: {
						color: '#73ddab',
						style: '',
						width: '1px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraBorder'));
			});

			// 	Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('p.blockera-block').should(
				'have.css',
				'border-top',
				'1px solid rgb(115, 221, 171)'
			);

			cy.get('p.blockera-block').should(
				'have.css',
				'border-right',
				'2px dashed rgb(153, 88, 227)'
			);

			cy.get('p.blockera-block').should(
				'have.css',
				'border-bottom',
				'3px dotted rgb(235, 164, 146)'
			);

			cy.get('p.blockera-block').should(
				'have.css',
				'border-left',
				'4px double rgb(24, 147, 218)'
			);
		});
	});

	describe('Variable Value', () => {
		it('should update border when add same data to all side', () => {
			cy.get('@container').within(() => {
				cy.getByDataTest('border-control-width').clear();
				cy.getByDataTest('border-control-width').type(5, {
					force: true,
				});
			});

			cy.get('@container').within(() => {
				cy.openValueAddon();
			});

			cy.selectValueAddonItem('contrast');

			//Check block
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should(
						'include',
						'border: 5px solid var(--wp--preset--color--contrast)'
					);
			});

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'all',
					all: {
						width: '5px',
						style: '',
						color: {
							settings: {
								name: 'Contrast',
								id: 'contrast',
								value: '#111111',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'color',
								var: '--wp--preset--color--contrast',
							},
							name: 'Contrast',
							isValueAddon: true,
							valueType: 'variable',
						},
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraBorder'));
			});

			//Check frontend
			savePage();
			redirectToFrontPage();

			cy.get('style#blockera-inline-css')
				.invoke('text')
				.should(
					'include',
					'border: 5px solid var(--wp--preset--color--contrast)'
				);
		});

		it('Add variable and then remove to make sure remove works correctly', () => {
			cy.get('@container').within(() => {
				cy.getByDataTest('border-control-width').clear();
				cy.getByDataTest('border-control-width').type(5, {
					force: true,
				});
			});

			cy.get('@container').within(() => {
				cy.openValueAddon();
			});

			cy.selectValueAddonItem('contrast');

			//Check block
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should(
						'include',
						'border: 5px solid var(--wp--preset--color--contrast)'
					);
			});

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'all',
					all: {
						width: '5px',
						style: '',
						color: {
							settings: {
								name: 'Contrast',
								id: 'contrast',
								value: '#111111',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'color',
								var: '--wp--preset--color--contrast',
							},
							name: 'Contrast',
							isValueAddon: true,
							valueType: 'variable',
						},
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraBorder'));
			});

			cy.get('@container').within(() => {
				cy.removeValueAddon();
			});

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'all',
					all: {
						width: '5px',
						style: '',
						color: '',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraBorder'));
			});
		});

		it('custom borders', () => {
			//
			// Top Border
			//
			cy.get('@container').within(() => {
				cy.getByAriaLabel('Custom Box Border').click();
				cy.getByDataTest('border-control-component')
					.eq(0)
					.within(() => {
						cy.getByDataTest('border-control-width').clear();
						cy.getByDataTest('border-control-width').type(1, {
							force: true,
						});

						cy.get('[aria-haspopup="listbox"]').trigger('click');
						cy.get('div').eq(0).trigger('click');
					});
			});

			cy.get('@container').within(() => {
				cy.getByDataTest('border-control-component')
					.eq(0)
					.within(() => {
						cy.openValueAddon();
					});
			});

			cy.selectValueAddonItem('contrast');

			//Check block
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should(
						'include',
						'border-top: 1px solid var(--wp--preset--color--contrast)'
					);
			});

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'custom',
					all: { color: '', style: '', width: '' },
					left: { color: '', style: '', width: '' },
					right: { color: '', style: '', width: '' },
					bottom: { color: '', style: '', width: '' },
					top: {
						color: {
							settings: {
								name: 'Contrast',
								id: 'contrast',
								value: '#111111',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'color',
								var: '--wp--preset--color--contrast',
							},
							name: 'Contrast',
							isValueAddon: true,
							valueType: 'variable',
						},
						style: '',
						width: '1px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraBorder'));
			});

			//
			// Right Border
			//
			cy.get('@container').within(() => {
				cy.getByDataTest('border-control-component')
					.eq(1)
					.within(() => {
						cy.getByDataTest('border-control-width').clear({
							force: true,
						});
						cy.getByDataTest('border-control-width').type(2, {
							force: true,
						});

						cy.get('[aria-haspopup="listbox"]').trigger('click');
						cy.get('div[aria-selected="false"]')
							.eq(1)
							.trigger('click');
					});
			});

			cy.get('@container').within(() => {
				cy.getByDataTest('border-control-component')
					.eq(1)
					.within(() => {
						cy.openValueAddon();
					});
			});

			cy.selectValueAddonItem('contrast');

			//Check block
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should(
						'include',
						'border-right: 2px dashed var(--wp--preset--color--contrast)'
					);
			});

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'custom',
					all: { color: '', style: '', width: '' },
					left: { color: '', style: '', width: '' },
					right: {
						color: {
							settings: {
								name: 'Contrast',
								id: 'contrast',
								value: '#111111',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'color',
								var: '--wp--preset--color--contrast',
							},
							name: 'Contrast',
							isValueAddon: true,
							valueType: 'variable',
						},
						style: 'dashed',
						width: '2px',
					},
					bottom: { color: '', style: '', width: '' },
					top: {
						color: {
							settings: {
								name: 'Contrast',
								id: 'contrast',
								value: '#111111',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'color',
								var: '--wp--preset--color--contrast',
							},
							name: 'Contrast',
							isValueAddon: true,
							valueType: 'variable',
						},
						style: '',
						width: '1px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraBorder'));
			});

			//
			// Bottom Border
			//
			cy.get('@container').within(() => {
				cy.getByDataTest('border-control-component')
					.eq(2)
					.within(() => {
						cy.getByDataTest('border-control-width').clear({
							force: true,
						});
						cy.getByDataTest('border-control-width').type(3, {
							force: true,
						});

						cy.get('[aria-haspopup="listbox"]').trigger('click');
						cy.get('div[aria-selected="false"]')
							.eq(2)
							.trigger('click');
					});
			});

			cy.get('@container').within(() => {
				cy.getByDataTest('border-control-component')
					.eq(2)
					.within(() => {
						cy.openValueAddon();
					});
			});

			cy.selectValueAddonItem('contrast');

			//Check block
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should(
						'include',
						'border-bottom: 3px dotted var(--wp--preset--color--contrast)'
					);
			});

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'custom',
					all: { color: '', style: '', width: '' },
					left: { color: '', style: '', width: '' },
					right: {
						color: {
							settings: {
								name: 'Contrast',
								id: 'contrast',
								value: '#111111',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'color',
								var: '--wp--preset--color--contrast',
							},
							name: 'Contrast',
							isValueAddon: true,
							valueType: 'variable',
						},
						style: 'dashed',
						width: '2px',
					},
					bottom: {
						color: {
							settings: {
								name: 'Contrast',
								id: 'contrast',
								value: '#111111',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'color',
								var: '--wp--preset--color--contrast',
							},
							name: 'Contrast',
							isValueAddon: true,
							valueType: 'variable',
						},
						style: 'dotted',
						width: '3px',
					},
					top: {
						color: {
							settings: {
								name: 'Contrast',
								id: 'contrast',
								value: '#111111',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'color',
								var: '--wp--preset--color--contrast',
							},
							name: 'Contrast',
							isValueAddon: true,
							valueType: 'variable',
						},
						style: '',
						width: '1px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraBorder'));
			});

			//
			// Left Border
			//
			cy.get('@container').within(() => {
				cy.getByDataTest('border-control-component')
					.eq(3)
					.within(() => {
						cy.getByDataTest('border-control-width').clear({
							force: true,
						});
						cy.getByDataTest('border-control-width').type(4, {
							force: true,
						});

						cy.get('[aria-haspopup="listbox"]').trigger('click');
						cy.get('div[aria-selected="false"]')
							.eq(3)
							.trigger('click');
					});
			});

			cy.get('@container').within(() => {
				cy.getByDataTest('border-control-component')
					.eq(3)
					.within(() => {
						cy.openValueAddon();
					});
			});

			cy.selectValueAddonItem('contrast');

			//Check block
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should(
						'include',
						'border-left: 4px double var(--wp--preset--color--contrast)'
					);
			});

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'custom',
					all: { color: '', style: '', width: '' },
					left: {
						color: {
							settings: {
								name: 'Contrast',
								id: 'contrast',
								value: '#111111',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'color',
								var: '--wp--preset--color--contrast',
							},
							name: 'Contrast',
							isValueAddon: true,
							valueType: 'variable',
						},
						style: 'double',
						width: '4px',
					},
					right: {
						color: {
							settings: {
								name: 'Contrast',
								id: 'contrast',
								value: '#111111',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'color',
								var: '--wp--preset--color--contrast',
							},
							name: 'Contrast',
							isValueAddon: true,
							valueType: 'variable',
						},
						style: 'dashed',
						width: '2px',
					},
					bottom: {
						color: {
							settings: {
								name: 'Contrast',
								id: 'contrast',
								value: '#111111',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'color',
								var: '--wp--preset--color--contrast',
							},
							name: 'Contrast',
							isValueAddon: true,
							valueType: 'variable',
						},
						style: 'dotted',
						width: '3px',
					},
					top: {
						color: {
							settings: {
								name: 'Contrast',
								id: 'contrast',
								value: '#111111',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'color',
								var: '--wp--preset--color--contrast',
							},
							name: 'Contrast',
							isValueAddon: true,
							valueType: 'variable',
						},
						style: '',
						width: '1px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraBorder'));
			});

			// 	Check frontend
			savePage();
			redirectToFrontPage();

			cy.get('style#blockera-inline-css')
				.invoke('text')
				.should(
					'include',
					'border-top: 1px solid var(--wp--preset--color--contrast)'
				)
				.and(
					'include',
					'border-right: 2px dashed var(--wp--preset--color--contrast)'
				)
				.and(
					'include',
					'border-bottom: 3px dotted var(--wp--preset--color--contrast)'
				)
				.and(
					'include',
					'border-left: 4px double var(--wp--preset--color--contrast)'
				);
		});
	});
});
