import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	addBlockToPost,
} from '../../../../../../cypress/helpers';

describe('Layout Extension', () => {
	//describe('Extension Initializing', () => {...});

	describe('Display', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('This is test text.');

			cy.getByDataTest('style-tab').click();
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should update display correctly, when click on block', () => {
				cy.getParentContainer('Display', 'base-control').within(() => {
					cy.getByAriaLabel('Block').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'display', 'block');

				//Check store
				getWPDataObject().then((data) => {
					expect('block').to.be.equal(
						getSelectedBlock(data, 'publisherDisplay')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'display',
					'block'
				);
			});

			it('should update display correctly, when click on flex', () => {
				cy.getParentContainer('Display', 'base-control').within(() => {
					cy.getByAriaLabel('Flex').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'display', 'flex');

				//Check store
				getWPDataObject().then((data) => {
					expect('flex').to.be.equal(
						getSelectedBlock(data, 'publisherDisplay')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'display',
					'flex'
				);
			});

			it('should update display correctly, when click on inline-block', () => {
				cy.getParentContainer('Display', 'base-control').within(() => {
					cy.get('[aria-label="Inline Block"]').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'display', 'inline-block');

				//Check store
				getWPDataObject().then((data) => {
					expect('inline-block').to.be.equal(
						getSelectedBlock(data, 'publisherDisplay')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'display',
					'inline-block'
				);
			});

			it('should update display correctly, when click on inline', () => {
				cy.getParentContainer('Display', 'base-control').within(() => {
					cy.getByAriaLabel('Inline').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'display', 'inline');

				//Check store
				getWPDataObject().then((data) => {
					expect('inline').to.be.equal(
						getSelectedBlock(data, 'publisherDisplay')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'display',
					'inline'
				);
			});

			it('should update display correctly, when click on none', () => {
				cy.getParentContainer('Display', 'base-control').within(() => {
					cy.getByAriaLabel('None').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'display', 'none');

				//Check store
				getWPDataObject().then((data) => {
					expect('none').to.be.equal(
						getSelectedBlock(data, 'publisherDisplay')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'display',
					'none'
				);
			});
		});
	});

	describe('Direction', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('This is test text.');

			cy.getByDataTest('style-tab').click();

			cy.getParentContainer('Display', 'base-control').within(() => {
				cy.getByAriaLabel('Flex').click();
			});
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should update flex-direction correctly, when click on row', () => {
				cy.getParentContainer('Direction', 'base-control')
					.first()
					.within(() => {
						cy.getByAriaLabel('Row').click();
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'flex-direction', 'row');

				//Check store
				getWPDataObject().then((data) => {
					expect({ value: 'row', reverse: false }).to.be.deep.equal(
						getSelectedBlock(data, 'publisherFlexDirection')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'flex-direction',
					'row'
				);
			});

			it('should update flex-direction correctly, when click on column', () => {
				cy.getParentContainer('Direction', 'base-control')
					.first()
					.within(() => {
						cy.get('[aria-label="Column"]').click();
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'flex-direction', 'column');

				//Check store
				getWPDataObject().then((data) => {
					expect({
						value: 'column',
						reverse: false,
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherFlexDirection')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'flex-direction',
					'column'
				);
			});

			it('should reverse flex-direction correctly, when click on reverse (row)', () => {
				cy.getParentContainer('Direction', 'base-control')
					.first()
					.within(() => {
						cy.getByAriaLabel('Row').click();
					});

				cy.getParentContainer('Direction', 'base-control')
					.last()
					.within(() => {
						cy.get('[aria-label="Reverse Direction"]').click();
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'flex-direction', 'row-reverse');

				//Check store
				getWPDataObject().then((data) => {
					expect({
						value: 'row-reverse',
						reverse: true,
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherFlexDirection')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'flex-direction',
					'row-reverse'
				);
			});

			it('should reverse flex-direction correctly, when click on reverse (column)', () => {
				cy.getParentContainer('Direction', 'base-control')
					.first()
					.within(() => {
						cy.get('[aria-label="Column"]').click();
					});

				cy.getParentContainer('Direction', 'base-control')
					.last()
					.within(() => {
						cy.get('[aria-label="Reverse Direction"]').click();
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'flex-direction', 'column-reverse');

				//Check store
				getWPDataObject().then((data) => {
					expect({
						value: 'column-reverse',
						reverse: true,
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherFlexDirection')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'flex-direction',
					'column-reverse'
				);
			});
		});
	});

	describe('Align Items', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('This is test text.');

			cy.getByDataTest('style-tab').click();

			cy.getParentContainer('Display', 'base-control').within(() => {
				cy.getByAriaLabel('Flex').click();
			});
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should update align-items correctly, when click on center', () => {
				cy.getParentContainer('Align Items', 'base-control').within(
					() => {
						cy.getByAriaLabel('Center').click();
					}
				);

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'align-items', 'center');

				//Check store
				getWPDataObject().then((data) => {
					expect('center').to.be.deep.equal(
						getSelectedBlock(data, 'publisherAlignItems')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'align-items',
					'center'
				);
			});

			it('should update align-items correctly, when click on flex-start', () => {
				cy.getParentContainer('Align Items', 'base-control').within(
					() => {
						cy.get('[aria-label="Flex Start"]').click();
					}
				);

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'align-items', 'flex-start');

				//Check store
				getWPDataObject().then((data) => {
					expect('flex-start').to.be.deep.equal(
						getSelectedBlock(data, 'publisherAlignItems')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'align-items',
					'flex-start'
				);
			});

			it('should update align-items correctly, when click on flex-end', () => {
				cy.getParentContainer('Align Items', 'base-control').within(
					() => {
						cy.get('[aria-label="Flex End"]').click();
					}
				);

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'align-items', 'flex-end');

				//Check store
				getWPDataObject().then((data) => {
					expect('flex-end').to.be.deep.equal(
						getSelectedBlock(data, 'publisherAlignItems')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'align-items',
					'flex-end'
				);
			});

			it('should update align-items correctly, when click on stretch', () => {
				cy.getParentContainer('Align Items', 'base-control').within(
					() => {
						cy.getByAriaLabel('Stretch').click();
					}
				);

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'align-items', 'stretch');

				//Check store
				getWPDataObject().then((data) => {
					expect('stretch').to.be.deep.equal(
						getSelectedBlock(data, 'publisherAlignItems')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'align-items',
					'stretch'
				);
			});

			it('should update align-items correctly, when click on baseline', () => {
				cy.getParentContainer('Align Items', 'base-control').within(
					() => {
						cy.getByAriaLabel('Baseline').click();
					}
				);

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'align-items', 'baseline');

				//Check store
				getWPDataObject().then((data) => {
					expect('baseline').to.be.deep.equal(
						getSelectedBlock(data, 'publisherAlignItems')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'align-items',
					'baseline'
				);
			});
		});
	});

	describe('Justify Content', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('This is test text.');

			cy.getByDataTest('style-tab').click();

			cy.getParentContainer('Display', 'base-control').within(() => {
				cy.getByAriaLabel('Flex').click();
			});
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should update justify-content correctly, when click on center', () => {
				cy.getParentContainer('Justify', 'base-control').within(() => {
					cy.getByAriaLabel('Center').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'justify-content', 'center');

				//Check store
				getWPDataObject().then((data) => {
					expect('center').to.be.deep.equal(
						getSelectedBlock(data, 'publisherJustifyContent')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'justify-content',
					'center'
				);
			});

			it('should update justify-content correctly, when click on flex-start', () => {
				cy.getParentContainer('Justify', 'base-control').within(() => {
					cy.get('[aria-label="Flex Start"]').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'justify-content', 'flex-start');

				//Check store
				getWPDataObject().then((data) => {
					expect('flex-start').to.be.deep.equal(
						getSelectedBlock(data, 'publisherJustifyContent')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'justify-content',
					'flex-start'
				);
			});

			it('should update justify-content correctly, when click on flex-end', () => {
				cy.getParentContainer('Justify', 'base-control').within(() => {
					cy.get('[aria-label="Flex End"]').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'justify-content', 'flex-end');

				//Check store
				getWPDataObject().then((data) => {
					expect('flex-end').to.be.deep.equal(
						getSelectedBlock(data, 'publisherJustifyContent')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'justify-content',
					'flex-end'
				);
			});

			it('should update justify-content correctly, when click on space-between', () => {
				cy.getParentContainer('Justify', 'base-control').within(() => {
					cy.get('[aria-label="Space Between"]').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'justify-content', 'space-between');

				//Check store
				getWPDataObject().then((data) => {
					expect('space-between').to.be.deep.equal(
						getSelectedBlock(data, 'publisherJustifyContent')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'justify-content',
					'space-between'
				);
			});

			it('should update justify-content correctly, when click on space-around', () => {
				cy.getParentContainer('Justify', 'base-control').within(() => {
					cy.get('[aria-label="Space Around"]').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'justify-content', 'space-around');

				//Check store
				getWPDataObject().then((data) => {
					expect('space-around').to.be.deep.equal(
						getSelectedBlock(data, 'publisherJustifyContent')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'justify-content',
					'space-around'
				);
			});

			it('should update justify-content correctly, when click on space-evenly', () => {
				cy.getParentContainer('Justify', 'base-control').within(() => {
					cy.get('[aria-label="Space Evenly"]').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'justify-content', 'space-evenly');

				//Check store
				getWPDataObject().then((data) => {
					expect('space-evenly').to.be.deep.equal(
						getSelectedBlock(data, 'publisherJustifyContent')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'justify-content',
					'space-evenly'
				);
			});
		});
	});

	describe('Gap', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('This is test text.');

			cy.getByDataTest('style-tab').click();

			cy.getParentContainer('Display', 'base-control').within(() => {
				cy.getByAriaLabel('Flex').click();
			});
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should update gap correctly, when add data', () => {
				cy.getParentContainer('Gap', 'base-control')
					.first()
					.within(() => {
						cy.get('input').type(10);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'gap', '10px');

				//Check store
				getWPDataObject().then((data) => {
					expect('10px').to.be.deep.equal(
						getSelectedBlock(data, 'publisherGap')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'gap',
					'10px'
				);
			});

			it('should update row-gap & column-gap correctly, when add data', () => {
				cy.getParentContainer('Gap', 'base-control')
					.first()
					.within(() => {
						cy.get('[aria-label="Lock Gap"]').click();
						cy.get('input').eq(0).type(10);
						cy.get('input').eq(1).type(15);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'column-gap', '10px')
					.and('have.css', 'row-gap', '15px');

				//Check store
				getWPDataObject().then((data) => {
					expect('15px').to.be.deep.equal(
						getSelectedBlock(data, 'publisherGapRows')
					);
					expect('10px').to.be.deep.equal(
						getSelectedBlock(data, 'publisherGapColumns')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph')
					.should('have.css', 'column-gap', '10px')
					.and('have.css', 'row-gap', '15px');
			});
		});
	});

	describe('Children Wrap', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('This is test text.');

			cy.getByDataTest('style-tab').click();

			cy.getParentContainer('Display', 'base-control').within(() => {
				cy.getByAriaLabel('Flex').click();
			});
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should update flex-wrap correctly, when click on nowrap', () => {
				cy.getParentContainer('Children', 'base-control')
					.first()
					.within(() => {
						cy.get('[aria-label="No Wrap"]').click();
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'flex-wrap', 'nowrap');

				//Check store
				getWPDataObject().then((data) => {
					expect({
						value: 'nowrap',
						reverse: false,
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherFlexWrap')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'flex-wrap',
					'nowrap'
				);
			});

			it('should update flex-wrap correctly, when click on wrap', () => {
				cy.getParentContainer('Children', 'base-control')
					.last()
					.within(() => {
						cy.get('[aria-label="Wrap"]').click();
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'flex-wrap', 'wrap');

				//Check store
				getWPDataObject().then((data) => {
					expect({
						value: 'wrap',
						reverse: false,
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherFlexWrap')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'flex-wrap',
					'wrap'
				);
			});

			it('should reverse flex-wrap correctly, when click on wrap reverse ', () => {
				cy.getParentContainer('Children', 'base-control')
					.first()
					.within(() => {
						cy.get('[aria-label="Wrap"]').click();
					});
				cy.getParentContainer('Children', 'base-control')
					.last()
					.within(() => {
						cy.get('[aria-label="Reverse Warp"]').click();
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'flex-wrap', 'wrap-reverse');

				//Check store
				getWPDataObject().then((data) => {
					expect({
						value: 'wrap-reverse',
						reverse: true,
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherFlexWrap')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'flex-wrap',
					'wrap-reverse'
				);
			});
		});
	});

	describe('Children Wrap + Align Content', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('This is test text.');

			cy.getByDataTest('style-tab').click();

			cy.getParentContainer('Display', 'base-control').within(() => {
				cy.getByAriaLabel('Flex').click();
			});

			cy.getParentContainer('Children', 'base-control')
				.first()
				.within(() => {
					cy.get('[aria-label="Wrap"]').click();
				});
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should update align-content correctly, when click on center', () => {
				cy.getParentContainer('Align Content', 'base-control').within(
					() => {
						cy.get('[aria-label="center"]').click();
					}
				);

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'align-content', 'center');

				//Check store
				getWPDataObject().then((data) => {
					expect('center').to.be.equal(
						getSelectedBlock(data, 'publisherAlignContent')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'align-content',
					'center'
				);
			});
		});
	});
});
