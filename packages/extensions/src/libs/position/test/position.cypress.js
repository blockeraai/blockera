import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('Position Extension', () => {
	beforeEach(() => cy.viewport(1280, 720));

	//describe('Extension Initializing', () => {...});

	describe('Position', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('This is test text.');

			cy.get('[aria-label="Settings"]').click({ force: true });
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should z-index and position svg render, when select position', () => {
				cy.getByDataTest('style-tab').click();

				cy.get('[aria-label="Position"]')
					.parents('[data-cy="base-control"]')
					.within(() => {
						cy.get('button[aria-haspopup="listbox"]').click();
						cy.get('ul').within(() => {
							cy.contains('Relative').trigger('click');
						});
					});

				cy.get('[aria-label="Top Position"]').should('exist');
				cy.get('[aria-label="z-index"]').should('exist');
			});

			it('should update correctly, when select relative', () => {
				cy.getByDataTest('style-tab').click();

				cy.get('[aria-label="Position"]')
					.parents('[data-cy="base-control"]')
					.within(() => {
						cy.get('button[aria-haspopup="listbox"]').click();
						cy.get('ul').within(() => {
							cy.contains('Relative').trigger('click');
						});
					});

				cy.get('[aria-label="Top Position"]').click();
				cy.get('[aria-label="Set 10px"]').click();

				cy.get('[aria-label="Right Position"]').click();
				cy.get('[aria-label="Set 60px"]').click();

				cy.get('[aria-label="Bottom Position"]').click();
				cy.get('[aria-label="Set 30px"]').click();

				cy.get('[aria-label="Left Position"]').click();
				cy.get('[aria-label="Set 80px"]').click();

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'position', 'relative')
					.and('have.css', 'top', '10px')
					.and('have.css', 'Right', '60px')
					.and('have.css', 'Bottom', '30px')
					.and('have.css', 'Left', '80px');

				//Check store
				getWPDataObject().then((data) => {
					expect({
						type: 'relative',
						position: {
							top: '10px',
							right: '60px',
							bottom: '30px',
							left: '80px',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherPosition')
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
					.invoke('getPropertyValue', 'position')
					.should('eq', 'relative');
				cy.get('@element-style')
					.invoke('getPropertyValue', 'top')
					.should('eq', '10px');
				cy.get('@element-style')
					.invoke('getPropertyValue', 'right')
					.should('eq', '60px');
				cy.get('@element-style')
					.invoke('getPropertyValue', 'bottom')
					.should('eq', '30px');
				cy.get('@element-style')
					.invoke('getPropertyValue', 'left')
					.should('eq', '80px');
			});

			describe('should update correctly, when select absolute and :', () => {
				it('add data manually', () => {
					cy.getByDataTest('style-tab').click();

					cy.get('[aria-label="Position"]')
						.parents('[data-cy="base-control"]')
						.within(() => {
							cy.get('button[aria-haspopup="listbox"]').click();
							cy.get('ul').within(() => {
								cy.contains('Absolute').trigger('click');
							});
						});

					cy.get('[aria-label="Top Position"]').click();
					cy.get('[aria-label="Set 10px"]').click();

					cy.get('[aria-label="Right Position"]').click();
					cy.get('[aria-label="Set 10px"]').click();

					cy.get('[aria-label="Bottom Position"]').click();
					cy.get('[aria-label="Set 20px"]').click();

					cy.get('[aria-label="Left Position"]').click();
					cy.get('[aria-label="Set 30px"]').click();

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'position', 'absolute')
						.and('have.css', 'top', '10px')
						.and('have.css', 'Right', '10px')
						.and('have.css', 'Bottom', '20px')
						.and('have.css', 'Left', '30px');

					//Check store
					getWPDataObject().then((data) => {
						expect({
							type: 'absolute',
							position: {
								top: '10px',
								right: '10px',
								bottom: '20px',
								left: '30px',
							},
						}).to.be.deep.equal(
							getSelectedBlock(data, 'publisherPosition')
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
						.invoke('getPropertyValue', 'position')
						.should('eq', 'absolute');
					cy.get('@element-style')
						.invoke('getPropertyValue', 'top')
						.should('eq', '10px');
					cy.get('@element-style')
						.invoke('getPropertyValue', 'right')
						.should('eq', '10px');
					cy.get('@element-style')
						.invoke('getPropertyValue', 'bottom')
						.should('eq', '20px');
					cy.get('@element-style')
						.invoke('getPropertyValue', 'left')
						.should('eq', '30px');
				});

				context('add data via shortcuts', () => {
					beforeEach(() => {
						cy.getByDataTest('style-tab').click();

						cy.get('[aria-label="Position"]')
							.parents('[data-cy="base-control"]')
							.as('position-extension');

						cy.get('@position-extension').within(() => {
							cy.get('button[aria-haspopup="listbox"]').click();
							cy.get('ul').within(() => {
								cy.contains('Absolute').trigger('click');
							});
						});
					});

					it('should add top & left properties, when click on topLeft', () => {
						cy.get('@position-extension').within(() => {
							cy.get('[aria-label="Top Left"]').click();
						});

						//Check block
						cy.getIframeBody()
							.find(`[data-type="core/paragraph"]`)
							.should('have.css', 'position', 'absolute')
							.and('have.css', 'top', '0px')
							.and('have.css', 'left', '0px');

						//Check store
						getWPDataObject().then((data) => {
							expect({
								type: 'absolute',
								position: {
									top: '0px',
									left: '0px',
									bottom: '',
									right: '',
								},
							}).to.be.deep.equal(
								getSelectedBlock(data, 'publisherPosition')
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
							.invoke('getPropertyValue', 'position')
							.should('eq', 'absolute');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'top')
							.should('eq', '0px');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'left')
							.should('eq', '0px');
					});

					it('should add top & Right properties, when click on topRight', () => {
						cy.get('@position-extension').within(() => {
							cy.get('[aria-label="Top Right"]').click();
						});

						//Check block
						cy.getIframeBody()
							.find(`[data-type="core/paragraph"]`)
							.should('have.css', 'position', 'absolute')
							.and('have.css', 'top', '0px')
							.and('have.css', 'right', '0px');

						//Check store
						getWPDataObject().then((data) => {
							expect({
								type: 'absolute',
								position: {
									top: '0px',
									left: '',
									bottom: '',
									right: '0px',
								},
							}).to.be.deep.equal(
								getSelectedBlock(data, 'publisherPosition')
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
							.invoke('getPropertyValue', 'position')
							.should('eq', 'absolute');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'top')
							.should('eq', '0px');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'right')
							.should('eq', '0px');
					});

					it('should add top & left & right properties, when click on top', () => {
						cy.get('@position-extension').within(() => {
							cy.get('[aria-label="Top"]').click();
						});

						//Check block
						cy.getIframeBody()
							.find(`[data-type="core/paragraph"]`)
							.should('have.css', 'position', 'absolute')
							.and('have.css', 'top', '0px')
							.and('have.css', 'left', '0px')
							.and('have.css', 'right', '0px');
						//Check store
						getWPDataObject().then((data) => {
							expect({
								type: 'absolute',
								position: {
									top: '0px',
									left: '0px',
									bottom: '',
									right: '0px',
								},
							}).to.be.deep.equal(
								getSelectedBlock(data, 'publisherPosition')
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
							.invoke('getPropertyValue', 'position')
							.should('eq', 'absolute');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'top')
							.should('eq', '0px');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'right')
							.should('eq', '0px');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'left')
							.should('eq', '0px');
					});

					it('should add right & top & bottom properties, when click on right', () => {
						cy.get('@position-extension').within(() => {
							cy.get('[aria-label="Right"]').click();
						});

						//Check block
						cy.getIframeBody()
							.find(`[data-type="core/paragraph"]`)
							.should('have.css', 'position', 'absolute')
							.and('have.css', 'top', '0px')
							.and('have.css', 'bottom', '0px')
							.and('have.css', 'right', '0px');
						//Check store
						getWPDataObject().then((data) => {
							expect({
								type: 'absolute',
								position: {
									top: '0px',
									left: '',
									bottom: '0px',
									right: '0px',
								},
							}).to.be.deep.equal(
								getSelectedBlock(data, 'publisherPosition')
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
							.invoke('getPropertyValue', 'position')
							.should('eq', 'absolute');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'top')
							.should('eq', '0px');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'right')
							.should('eq', '0px');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'bottom')
							.should('eq', '0px');
					});

					it('should add right & top & bottom & left properties, when click on full', () => {
						cy.get('@position-extension').within(() => {
							cy.get('[aria-label="Full"]').click();
						});
						//Check block
						cy.getIframeBody()
							.find(`[data-type="core/paragraph"]`)
							.should('have.css', 'position', 'absolute')
							.and('have.css', 'top', '0px')
							.and('have.css', 'bottom', '0px')
							.and('have.css', 'right', '0px')
							.and('have.css', 'left', '0px');
						//Check store
						getWPDataObject().then((data) => {
							expect({
								type: 'absolute',
								position: {
									top: '0px',
									left: '0px',
									bottom: '0px',
									right: '0px',
								},
							}).to.be.deep.equal(
								getSelectedBlock(data, 'publisherPosition')
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
							.invoke('getPropertyValue', 'position')
							.should('eq', 'absolute');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'top')
							.should('eq', '0px');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'right')
							.should('eq', '0px');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'bottom')
							.should('eq', '0px');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'left')
							.should('eq', '0px');
					});

					it('should add bottom & left properties, when click on bottomLeft', () => {
						cy.get('@position-extension').within(() => {
							cy.get('[aria-label="Bottom Left"]').click();
						});

						//Check block
						cy.getIframeBody()
							.find(`[data-type="core/paragraph"]`)
							.should('have.css', 'position', 'absolute')
							.and('have.css', 'bottom', '0px')
							.and('have.css', 'left', '0px');

						//Check store
						getWPDataObject().then((data) => {
							expect({
								type: 'absolute',
								position: {
									top: '',
									left: '0px',
									bottom: '0px',
									right: '',
								},
							}).to.be.deep.equal(
								getSelectedBlock(data, 'publisherPosition')
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
							.invoke('getPropertyValue', 'position')
							.should('eq', 'absolute');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'bottom')
							.should('eq', '0px');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'left')
							.should('eq', '0px');
					});

					it('should add bottom & right properties, when click on  bottomRight', () => {
						cy.get('@position-extension').within(() => {
							cy.get('[aria-label="Bottom Right"]').click();
						});

						//Check block
						cy.getIframeBody()
							.find(`[data-type="core/paragraph"]`)
							.should('have.css', 'position', 'absolute')
							.and('have.css', 'bottom', '0px')
							.and('have.css', 'right', '0px');

						//Check store
						getWPDataObject().then((data) => {
							expect({
								type: 'absolute',
								position: {
									top: '',
									left: '',
									bottom: '0px',
									right: '0px',
								},
							}).to.be.deep.equal(
								getSelectedBlock(data, 'publisherPosition')
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
							.invoke('getPropertyValue', 'position')
							.should('eq', 'absolute');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'bottom')
							.should('eq', '0px');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'right')
							.should('eq', '0px');
					});

					it('should add bottom & right & left properties, when click on bottom', () => {
						cy.get('@position-extension').within(() => {
							cy.get('[aria-label="Bottom"]').click();
						});
						//Check block
						cy.getIframeBody()
							.find(`[data-type="core/paragraph"]`)
							.should('have.css', 'position', 'absolute')
							.and('have.css', 'bottom', '0px')
							.and('have.css', 'left', '0px')
							.and('have.css', 'right', '0px');
						//Check store
						getWPDataObject().then((data) => {
							expect({
								type: 'absolute',
								position: {
									top: '',
									left: '0px',
									bottom: '0px',
									right: '0px',
								},
							}).to.be.deep.equal(
								getSelectedBlock(data, 'publisherPosition')
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
							.invoke('getPropertyValue', 'position')
							.should('eq', 'absolute');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'bottom')
							.should('eq', '0px');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'right')
							.should('eq', '0px');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'left')
							.should('eq', '0px');
					});

					it('should add bottom & top & left properties, when click on left', () => {
						cy.get('@position-extension').within(() => {
							cy.get('[aria-label="Left"]').click();
						});

						//Check block
						cy.getIframeBody()
							.find(`[data-type="core/paragraph"]`)
							.should('have.css', 'position', 'absolute')
							.and('have.css', 'top', '0px')
							.and('have.css', 'bottom', '0px')
							.and('have.css', 'left', '0px');
						//Check store
						getWPDataObject().then((data) => {
							expect({
								type: 'absolute',
								position: {
									top: '0px',
									left: '0px',
									bottom: '0px',
									right: '',
								},
							}).to.be.deep.equal(
								getSelectedBlock(data, 'publisherPosition')
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
							.invoke('getPropertyValue', 'position')
							.should('eq', 'absolute');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'top')
							.should('eq', '0px');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'left')
							.should('eq', '0px');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'bottom')
							.should('eq', '0px');
					});

					it.only('should add bottom & right & left & top properties, when click on center', () => {
						cy.get('@position-extension').within(() => {
							cy.get('[aria-label="Center"]').click();
						});

						//Check block
						cy.getIframeBody()
							.find(`[data-type="core/paragraph"]`)
							.should('have.css', 'position', 'absolute')
							.and('have.css', 'top', '20%')
							.and('have.css', 'bottom', '20%')
							.and('have.css', 'right', '20%')
							.and('have.css', 'left', '20%');

						//Check store
						getWPDataObject().then((data) => {
							expect({
								type: 'absolute',
								position: {
									top: '20%',
									left: '20%',
									bottom: '20%',
									right: '20%',
								},
							}).to.be.deep.equal(
								getSelectedBlock(data, 'publisherPosition')
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
							.invoke('getPropertyValue', 'position')
							.should('eq', 'absolute');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'top')
							.should('eq', '20%');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'right')
							.should('eq', '20%');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'bottom')
							.should('eq', '20%');
						cy.get('@element-style')
							.invoke('getPropertyValue', 'left')
							.should('eq', '20%');
					});
				});
			});

			it('should update correctly, when select fixed', () => {
				cy.getByDataTest('style-tab').click();

				cy.get('[aria-label="Position"]')
					.parents('[data-cy="base-control"]')
					.within(() => {
						cy.get('button[aria-haspopup="listbox"]').click();
						cy.get('ul').within(() => {
							cy.contains('Fixed').trigger('click');
						});
					});

				cy.get('[aria-label="Top Position"]').click();
				cy.get('[aria-label="Set 60px"]').click();

				cy.get('[aria-label="Right Position"]').click();
				cy.get('[aria-label="Set 10px"]').click();

				cy.get('[aria-label="Bottom Position"]').click();
				cy.get('[aria-label="Set 30px"]').click();

				cy.get('[aria-label="Left Position"]').click();
				cy.get('[aria-label="Set 20px"]').click();

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'position', 'fixed')
					.and('have.css', 'top', '60px')
					.and('have.css', 'Right', '10px')
					.and('have.css', 'Bottom', '30px')
					.and('have.css', 'Left', '20px');

				//Check store
				getWPDataObject().then((data) => {
					expect({
						type: 'fixed',
						position: {
							top: '60px',
							right: '10px',
							bottom: '30px',
							left: '20px',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherPosition')
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
					.invoke('getPropertyValue', 'position')
					.should('eq', 'fixed');
				cy.get('@element-style')
					.invoke('getPropertyValue', 'top')
					.should('eq', '60px');
				cy.get('@element-style')
					.invoke('getPropertyValue', 'right')
					.should('eq', '10px');
				cy.get('@element-style')
					.invoke('getPropertyValue', 'bottom')
					.should('eq', '30px');
				cy.get('@element-style')
					.invoke('getPropertyValue', 'left')
					.should('eq', '20px');
			});

			it('should update correctly, when select sticky', () => {
				cy.getByDataTest('style-tab').click();

				cy.get('[aria-label="Position"]')
					.parents('[data-cy="base-control"]')
					.within(() => {
						cy.get('button[aria-haspopup="listbox"]').click();
						cy.get('ul').within(() => {
							cy.contains('Sticky').trigger('click');
						});
					});

				cy.get('[aria-label="Top Position"]').click();
				cy.get('[aria-label="Set 10px"]').click();

				cy.get('[aria-label="Right Position"]').click();
				cy.get('[aria-label="Set 10px"]').click();

				cy.get('[aria-label="Bottom Position"]').click();
				cy.get('[aria-label="Set 20px"]').click();

				cy.get('[aria-label="Left Position"]').click();
				cy.get('[aria-label="Set 30px"]').click();

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'position', 'sticky')
					.and('have.css', 'top', '10px')
					.and('have.css', 'Right', '10px')
					.and('have.css', 'Bottom', '20px')
					.and('have.css', 'Left', '30px');

				//Check store
				getWPDataObject().then((data) => {
					expect({
						type: 'sticky',
						position: {
							top: '10px',
							right: '10px',
							bottom: '20px',
							left: '30px',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherPosition')
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
					.invoke('getPropertyValue', 'position')
					.should('eq', 'sticky');
				cy.get('@element-style')
					.invoke('getPropertyValue', 'top')
					.should('eq', '10px');
				cy.get('@element-style')
					.invoke('getPropertyValue', 'right')
					.should('eq', '10px');
				cy.get('@element-style')
					.invoke('getPropertyValue', 'bottom')
					.should('eq', '20px');
				cy.get('@element-style')
					.invoke('getPropertyValue', 'left')
					.should('eq', '30px');
			});
		});
	});

	describe('Position + Z-Index', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('This is test text.');

			cy.get('[aria-label="Settings"]').click({ force: true });
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should update correctly, when select position and add value to z-index', () => {
				cy.getByDataTest('style-tab').click();

				cy.get('[aria-label="Position"]')
					.parents('[data-cy="base-control"]')
					.within(() => {
						cy.get('button[aria-haspopup="listbox"]').click();
						cy.get('ul').within(() => {
							cy.contains('Absolute').trigger('click');
						});
					});

				cy.get('[aria-label="Top Left"]').click();

				cy.get('[aria-label="z-index"]')
					.parent()
					.next()
					.within(() => {
						cy.get('input').type(100);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'z-index', '100')
					.and('have.css', 'position', 'absolute')
					.and('have.css', 'top', '0px')
					.and('have.css', 'left', '0px');

				//Check store
				getWPDataObject().then((data) => {
					expect('100').to.be.deep.equal(
						getSelectedBlock(data, 'publisherZIndex')
					);
					expect({
						type: 'absolute',
						position: {
							top: '0px',
							left: '0px',
							bottom: '',
							right: '',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherPosition')
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
					.invoke('getPropertyValue', 'z-index')
					.should('eq', '100');
				cy.get('@element-style')
					.invoke('getPropertyValue', 'position')
					.should('eq', 'absolute');
				cy.get('@element-style')
					.invoke('getPropertyValue', 'top')
					.should('eq', '0px');
				cy.get('@element-style')
					.invoke('getPropertyValue', 'left')
					.should('eq', '0px');
			});
		});
	});
});
