import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('Border and Shadow extension', () => {
	//describe('Extension Initializing', () => {...});

	describe('Border', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('this is test text.');
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should update border when add same data to all side', () => {
				cy.getByDataTest('style-tab').click();

				//add data
				cy.get('[aria-label="Border Line"]')
					.parents('[data-cy="base-control"]')
					.within(() => {
						cy.getByDataTest('border-control-width').clear();
						cy.getByDataTest('border-control-width').type(5, {
							force: true,
						});
					});

				cy.get('[aria-label="Border Line"]')
					.parents('[data-cy="base-control"]')
					.within(() => {
						cy.getByDataTest('border-control-color').click();
					});

				cy.getByDataTest('popover-body').within(() => {
					cy.get('input[maxlength="9"]').clear();
					cy.get('input[maxlength="9"]').type('37e6d4');
				});

				cy.get('[aria-label="Border Line"]')
					.parents('[data-cy="base-control"]')
					.within(() => {
						cy.get('[aria-haspopup="listbox"]').click();
						cy.get('li').eq(1).click();
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should(
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
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherBorder')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph')
					.then(($el) => {
						return window.getComputedStyle($el[0]);
					})
					.invoke('getPropertyValue', 'border')
					.should('equal', '5px dashed rgb(55, 230, 212)');
			});

			it('all side but not select border style', () => {
				cy.getByDataTest('style-tab').click();

				//add data
				cy.get('[aria-label="Border Line"]')
					.parents('[data-cy="base-control"]')
					.within(() => {
						cy.getByDataTest('border-control-width').clear();
						cy.getByDataTest('border-control-width').type(5, {
							force: true,
						});
					});

				cy.get('[aria-label="Border Line"]')
					.parents('[data-cy="base-control"]')
					.within(() => {
						cy.getByDataTest('border-control-color').click();
					});

				cy.getByDataTest('popover-body').within(() => {
					cy.get('input[maxlength="9"]').clear();
					cy.get('input[maxlength="9"]').type('37e6d4');
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should(
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
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherBorder')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph')
					.then(($el) => {
						return window.getComputedStyle($el[0]);
					})
					.invoke('getPropertyValue', 'border')
					.should('equal', '5px solid rgb(55, 230, 212)');
			});

			it('custom', () => {
				cy.getByDataTest('style-tab').click();

				//add data
				cy.get('[aria-label="Border Line"]')
					.parents('[data-cy="base-control"]')
					.as('border-line');

				//
				// Top Border
				//
				cy.get('@border-line').within(() => {
					cy.get('[aria-label="Custom"]').click();
					cy.getByDataTest('border-control-component')
						.eq(0)
						.within(() => {
							cy.getByDataTest('border-control-width').clear();
							cy.getByDataTest('border-control-width').type(1, {
								force: true,
							});
							cy.get('[aria-haspopup="listbox"]').trigger(
								'click'
							);
							cy.get('li').eq(0).trigger('click');

							cy.getByDataTest('border-control-color').click();
						});
				});

				cy.getByDataTest('popover-body').within(() => {
					cy.get('input[maxlength="9"]').clear();
					cy.get('input[maxlength="9"]').type('73ddab');
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should(
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
							style: 'solid',
							width: '1px',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherBorder')
					);
				});

				//
				// Right Border
				//
				cy.get('@border-line').within(() => {
					cy.get('[aria-label="Custom"]').click();
					cy.getByDataTest('border-control-component')
						.eq(1)
						.within(() => {
							cy.getByDataTest('border-control-width').clear();
							cy.getByDataTest('border-control-width').type(2, {
								force: true,
							});
							cy.get('[aria-haspopup="listbox"]').trigger(
								'click'
							);
							cy.get('li').eq(1).trigger('click');

							cy.getByDataTest('border-control-color').click();
						});
				});

				cy.getByDataTest('popover-body').within(() => {
					cy.get('input[maxlength="9"]').clear();
					cy.get('input[maxlength="9"]').type('9958e3');
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should(
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
							style: 'solid',
							width: '1px',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherBorder')
					);
				});

				//
				// Bottom Border
				//
				cy.get('@border-line').within(() => {
					cy.get('[aria-label="Custom"]').click();
					cy.getByDataTest('border-control-component')
						.eq(2)
						.within(() => {
							cy.getByDataTest('border-control-width').clear();
							cy.getByDataTest('border-control-width').type(3, {
								force: true,
							});
							cy.get('[aria-haspopup="listbox"]').trigger(
								'click'
							);
							cy.get('li').eq(2).trigger('click');

							cy.getByDataTest('border-control-color').click();
						});
				});

				cy.getByDataTest('popover-body').within(() => {
					cy.get('input[maxlength="9"]').clear();
					cy.get('input[maxlength="9"]').type('eba492');
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should(
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
							style: 'solid',
							width: '1px',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherBorder')
					);
				});

				//
				// Left Border
				//
				cy.get('@border-line').within(() => {
					cy.get('[aria-label="Custom"]').click();
					cy.getByDataTest('border-control-component')
						.eq(3)
						.within(() => {
							cy.getByDataTest('border-control-width').clear();
							cy.getByDataTest('border-control-width').type(4, {
								force: true,
							});
							cy.get('[aria-haspopup="listbox"]').trigger(
								'click'
							);
							cy.get('li').eq(3).trigger('click');

							cy.getByDataTest('border-control-color').click();
						});
				});

				cy.getByDataTest('popover-body').within(() => {
					cy.get('input[maxlength="9"]').clear();
					cy.get('input[maxlength="9"]').type('1893da');
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should(
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
							style: 'solid',
							width: '1px',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherBorder')
					);
				});

				// 	Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph')
					.then(($el) => {
						return window.getComputedStyle($el[0]);
					})
					.invoke('getPropertyValue', 'border-top')
					.should('equal', '1px solid rgb(115, 221, 171)');

				cy.get('.publisher-paragraph')
					.then(($el) => {
						return window.getComputedStyle($el[0]);
					})
					.invoke('getPropertyValue', 'border-right')
					.should('equal', '2px dashed rgb(153, 88, 227)');

				cy.get('.publisher-paragraph')
					.then(($el) => {
						return window.getComputedStyle($el[0]);
					})
					.invoke('getPropertyValue', 'border-bottom')
					.should('equal', '3px dotted rgb(235, 164, 146)');

				cy.get('.publisher-paragraph')
					.then(($el) => {
						return window.getComputedStyle($el[0]);
					})
					.invoke('getPropertyValue', 'border-left')
					.should('equal', '4px double rgb(24, 147, 218)');
			});
		});
	});

	describe('Radius', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('this is test text.');

			//assign border to have visual of border-radius
			cy.getByDataTest('style-tab').click();
			cy.get('[aria-label="Border Line"]')
				.parents('[data-cy="base-control"]')
				.within(() => {
					cy.getByDataTest('border-control-width').clear();
					cy.getByDataTest('border-control-width').type(2, {
						force: true,
					});
				});
		});

		//describe('WordPress Compatibility', () => {...});

		it('should update correctly, when add same data to all corners', () => {
			cy.get('[aria-label="Radius"]')
				.parents('[data-cy="base-control"]')
				.within(() => {
					cy.get('input[type="number"]').clear();
					cy.get('input[type="number"]').type(25, { force: true });
				});

			//Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should('have.css', 'border-radius', '25px');

			//Check store
			getWPDataObject().then((data) => {
				expect({ type: 'all', all: '25px' }).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBorderRadius')
				);
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('.publisher-paragraph')
				.then(($el) => {
					return window.getComputedStyle($el[0]);
				})
				.invoke('getPropertyValue', 'border-radius')
				.should('equal', '25px');
		});

		it('should update correctly, when change all => custom', () => {
			cy.get('[aria-label="Radius"]')
				.parents('[data-cy="base-control"]')
				.within(() => {
					cy.get('input[type="number"]').clear();
					cy.get('input[type="number"]').type(25, { force: true });

					cy.get('[aria-label="Custom"]').click();
				});

			//Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should('have.css', 'border-top-left-radius', '25px')
				.and('have.css', 'border-top-right-radius', '25px')
				.and('have.css', 'border-bottom-left-radius', '25px')
				.and('have.css', 'border-bottom-left-radius', '25px');

			//Check store
			getWPDataObject().then((data) => {
				expect({
					type: 'custom',
					all: '25px',
					topLeft: '25px',
					topRight: '25px',
					bottomLeft: '25px',
					bottomRight: '25px',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBorderRadius')
				);
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('.publisher-paragraph')
				.then(($el) => {
					return window.getComputedStyle($el[0]);
				})
				.as('element-style');

			cy.get('@element-style')
				.invoke('getPropertyValue', 'border-top-left-radius')
				.should('equal', '25px');
			cy.get('@element-style')
				.invoke('getPropertyValue', 'border-top-right-radius')
				.should('equal', '25px');
			cy.get('@element-style')
				.invoke('getPropertyValue', 'border-bottom-right-radius')
				.should('equal', '25px');
			cy.get('@element-style')
				.invoke('getPropertyValue', 'border-bottom-left-radius')
				.should('equal', '25px');
		});

		it('custom', () => {
			//
			// topLeft
			//
			cy.get('[aria-label="Radius"]')
				.parents('[data-cy="base-control"]')
				.within(() => {
					cy.get('[aria-label="Custom"]').click();
					cy.get('input[type="number"]').eq(0).type(25, {
						force: true,
					});
				});

			//Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should('have.css', 'border-top-left-radius', '25px');

			//Check store
			getWPDataObject().then((data) => {
				expect('custom').to.be.equal(
					getSelectedBlock(data, 'publisherBorderRadius').type
				);

				expect('25px').to.be.equal(
					getSelectedBlock(data, 'publisherBorderRadius').topLeft
				);
			});

			//
			// topRight
			//
			//
			cy.get('[aria-label="Radius"]')
				.parents('[data-cy="base-control"]')
				.within(() => {
					cy.get('[aria-label="Custom"]').click();
					// cy.get('input[type="number"]').eq(1).clear();
					cy.get('input[type="number"]').eq(1).type(35, {
						force: true,
					});
				});

			//Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should('have.css', 'border-top-right-radius', '35px');

			//Check store
			getWPDataObject().then((data) => {
				expect('custom').to.be.equal(
					getSelectedBlock(data, 'publisherBorderRadius').type
				);

				expect('35px').to.be.equal(
					getSelectedBlock(data, 'publisherBorderRadius').topRight
				);
			});

			//
			// bottomLeft
			//
			cy.get('[aria-label="Radius"]')
				.parents('[data-cy="base-control"]')
				.within(() => {
					cy.get('[aria-label="Custom"]').click();
					// cy.get('input[type="number"]').eq(2).clear();
					cy.get('input[type="number"]').eq(2).type(45, {
						force: true,
					});
				});

			//Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should('have.css', 'border-bottom-left-radius', '45px');

			//Check store
			getWPDataObject().then((data) => {
				expect('custom').to.be.equal(
					getSelectedBlock(data, 'publisherBorderRadius').type
				);

				expect('45px').to.be.equal(
					getSelectedBlock(data, 'publisherBorderRadius').bottomLeft
				);
			});

			//
			// bottomRight
			//
			cy.get('[aria-label="Radius"]')
				.parents('[data-cy="base-control"]')
				.within(() => {
					cy.get('[aria-label="Custom"]').click();
					// cy.get('input[type="number"]').eq(3).clear();
					cy.get('input[type="number"]').eq(3).type(55, {
						force: true,
					});
				});

			//Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should('have.css', 'border-bottom-right-radius', '55px');

			//Check store
			getWPDataObject().then((data) => {
				expect('custom').to.be.equal(
					getSelectedBlock(data, 'publisherBorderRadius').type
				);

				expect('55px').to.be.equal(
					getSelectedBlock(data, 'publisherBorderRadius').bottomRight
				);
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('.publisher-paragraph')
				.then(($el) => {
					return window.getComputedStyle($el[0]);
				})
				.invoke('getPropertyValue', 'border-top-left-radius')
				.should('eq', '25px');

			cy.get('.publisher-paragraph')
				.then(($el) => {
					return window.getComputedStyle($el[0]);
				})
				.invoke('getPropertyValue', 'border-top-right-radius')
				.should('eq', '35px');

			cy.get('.publisher-paragraph')
				.then(($el) => {
					return window.getComputedStyle($el[0]);
				})
				.invoke('getPropertyValue', 'border-bottom-left-radius')
				.should('eq', '45px');

			cy.get('.publisher-paragraph')
				.then(($el) => {
					return window.getComputedStyle($el[0]);
				})
				.invoke('getPropertyValue', 'border-bottom-right-radius')
				.should('eq', '55px');
		});
	});

	describe('Box Shadow', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('this is test text.');
		});

		it('should update correctly, when adding one shadow', () => {
			cy.getByDataTest('style-tab').click();

			cy.get('[aria-label="Box Shadows"]')
				.parents('[data-cy="base-control"]')
				.within(() => {
					cy.get('[aria-label="Add New Box Shadow"]').click({
						force: true,
					});
					cy.getByDataCy('group-control-header').click();
				});

			cy.getByDataTest('popover-body').within(() => {
				cy.getByDataTest('box-shadow-x-input').clear();
				cy.getByDataTest('box-shadow-x-input').type(10);

				cy.getByDataTest('box-shadow-y-input').clear();
				cy.getByDataTest('box-shadow-y-input').type(50);

				cy.getByDataTest('box-shadow-blur-input').clear();
				cy.getByDataTest('box-shadow-blur-input').type(30);

				cy.getByDataTest('box-shadow-spread-input').clear();
				cy.getByDataTest('box-shadow-spread-input').type(40);

				cy.getByDataTest('box-shadow-color-control').click();
			});

			cy.getByDataTest('popover-body')
				.last()
				.within(() => {
					cy.get('input[maxlength="9"]').clear();
					cy.get('input[maxlength="9"]').type('c5eef0ab');
				});

			//Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should(
					'have.css',
					'box-shadow',
					'rgba(197, 238, 240, 0.67) 10px 50px 30px 40px'
				);

			//Check store
			getWPDataObject().then((data) => {
				expect([
					{
						blur: '30px',
						color: '#c5eef0ab',
						isVisible: true,
						spread: '40px',
						type: 'outer',
						x: '10px',
						y: '50px',
					},
				]).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBoxShadow')
				);
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('.publisher-paragraph')
				.then(($el) => {
					return window.getComputedStyle($el[0]);
				})
				.invoke('getPropertyValue', 'box-shadow')
				.should('eq', 'rgba(197, 238, 240, 0.67) 10px 50px 30px 40px');
		});

		it('should update correctly, when adding multiple shadow', () => {
			cy.getByDataTest('style-tab').click();

			cy.get('[aria-label="Box Shadows"]')
				.parents('[data-cy="base-control"]')
				.as('box-shadow-item');

			cy.get('@box-shadow-item').within(() => {
				cy.multiClick('[aria-label="Add New Box Shadow"]', 2);
				cy.getByDataCy('group-control-header').eq(0).click();
			});
			cy.getByDataTest('popover-body').within(() => {
				cy.getByDataTest('box-shadow-x-input').clear();
				cy.getByDataTest('box-shadow-x-input').type(10);

				cy.getByDataTest('box-shadow-y-input').clear();
				cy.getByDataTest('box-shadow-y-input').type(50);

				cy.getByDataTest('box-shadow-blur-input').clear();
				cy.getByDataTest('box-shadow-blur-input').type(30);

				cy.getByDataTest('box-shadow-spread-input').clear();
				cy.getByDataTest('box-shadow-spread-input').type(40);

				cy.getByDataTest('box-shadow-color-control').click();
			});
			cy.getByDataTest('popover-body')
				.last()
				.within(() => {
					cy.get('input[maxlength="9"]').clear();
					cy.get('input[maxlength="9"]').type('c5eef0ab');
				});

			cy.get('@box-shadow-item').within(() => {
				cy.getByDataCy('group-control-header').eq(1).click();
			});

			cy.getByDataTest('popover-body').within(() => {
				cy.getByDataTest('box-shadow-x-input').clear();
				cy.getByDataTest('box-shadow-x-input').type(20);

				cy.getByDataTest('box-shadow-y-input').clear();
				cy.getByDataTest('box-shadow-y-input').type(0);

				cy.getByDataTest('box-shadow-blur-input').clear();
				cy.getByDataTest('box-shadow-blur-input').type(50);

				cy.getByDataTest('box-shadow-spread-input').clear();
				cy.getByDataTest('box-shadow-spread-input').type(5);

				cy.getByDataTest('box-shadow-color-control').click();
			});

			cy.getByDataTest('popover-body')
				.last()
				.within(() => {
					cy.get('input[maxlength="9"]').clear();
					cy.get('input[maxlength="9"]').type('6a6969e6');
				});

			//Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should(
					'have.css',
					'box-shadow',
					'rgba(197, 238, 240, 0.67) 10px 50px 30px 40px, rgba(106, 105, 105, 0.9) 20px 0px 50px 5px'
				);

			//Check store
			getWPDataObject().then((data) => {
				expect([
					{
						blur: '30px',
						color: '#c5eef0ab',
						isVisible: true,
						spread: '40px',
						type: 'outer',
						x: '10px',
						y: '50px',
					},
					{
						blur: '50px',
						color: '#6a6969e6',
						isVisible: true,
						spread: '5px',
						type: 'outer',
						x: '20px',
						y: '0px',
					},
				]).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBoxShadow')
				);
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('.publisher-paragraph')
				.then(($el) => {
					return window.getComputedStyle($el[0]);
				})
				.invoke('getPropertyValue', 'box-shadow')
				.should(
					'eq',
					'rgba(197, 238, 240, 0.67) 10px 50px 30px 40px, rgba(106, 105, 105, 0.9) 20px 0px 50px 5px'
				);
		});
	});

	describe('Outline', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('this is test text.');
		});

		it('should update correctly, when add outline', () => {
			cy.getByDataTest('style-tab').click();

			cy.get('[aria-label="Outline"]')
				.parents('[data-cy="base-control"]')
				.within(() => {
					cy.get('[aria-label="Add New Outline"]').click({
						force: true,
					});
					cy.getByDataCy('group-control-header').click();
				});

			//add data
			cy.getByDataTest('popover-body')
				.first()
				.within(() => {
					cy.getByDataTest('border-control-width').clear();
					cy.getByDataTest('border-control-width').type(3);

					cy.get('[aria-haspopup="listbox"]').click();
					cy.get('li').eq(1).trigger('click');

					cy.get('input[type="range"]').setSliderValue(10);

					cy.getByDataTest('border-control-color').click();
				});

			cy.getByDataTest('popover-body')
				.last()
				.within(() => {
					cy.get('input[maxlength="9"]').clear();
					cy.get('input[maxlength="9"]').type('c5eef0ab');
				});

			//Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should(
					'have.css',
					'outline',
					'rgba(197, 238, 240, 0.67) dashed 3px'
				)
				.and('have.css', 'outline-offset', '10px');

			//Check store
			getWPDataObject().then((data) => {
				expect([
					{
						border: {
							width: '3px',
							color: '#c5eef0ab',
							style: 'dashed',
						},
						isVisible: true,
						offset: '10px',
					},
				]).to.be.deep.equal(getSelectedBlock(data, 'publisherOutline'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('.publisher-paragraph')
				.then(($el) => {
					return window.getComputedStyle($el[0]);
				})
				.as('element-style');

			cy.get('@element-style')
				.invoke('getPropertyValue', 'outline')
				.should('eq', 'rgba(197, 238, 240, 0.67) dashed 3px');

			cy.get('@element-style')
				.invoke('getPropertyValue', 'outline-offset')
				.should('eq', '10px');
		});
	});
});
