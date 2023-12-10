/**
 * Internal dependencies
 */
import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('Size Extension', () => {
	//describe('Extension Initializing', () => {...});

	describe('Width', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find('[data-type="core/paragraph"]')
				.type('This is a test text.');
		});

		// describe('Wordpress compatibility',()=>{});

		describe('Functionality', () => {
			it('should update width when adding value', () => {
				cy.getByDataTest('style-tab').click();

				cy.get('h2').contains('Size').parent().parent().as('size');
				cy.get('@size').within(() => {
					cy.get('[aria-label="Width"]')
						.parent()
						.next()
						.within(() => {
							cy.get('input').type(100);
						});
				});

				//Check block
				cy.getIframeBody()
					.find('[data-type="core/paragraph"]')
					.should('have.css', 'width', '100px');

				//Check store
				getWPDataObject().then((data) => {
					expect('100px').to.be.equal(
						getSelectedBlock(data, 'publisherWidth')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph')
					.then(($el) => {
						return window.getComputedStyle($el[0]);
					})
					.invoke('getPropertyValue', 'width')
					.should('eq', '100px');
			});
		});
	});

	describe('Min Width', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find('[data-type="core/paragraph"]')
				.type('This is a test text.');
		});

		// describe('Wordpress compatibility',()=>{});

		describe('Functionality', () => {
			it('should update min-width when adding value', () => {
				cy.getByDataTest('style-tab').click();
				cy.getParentContainer('Min W', 'base-control')
					.first()
					.within(() => {
						cy.get('input').type(10);
					});

				//Check block
				cy.getIframeBody()
					.find('[data-type="core/paragraph"]')
					.should('have.css', 'min-width', '10px');

				//Check store
				getWPDataObject().then((data) => {
					expect('10px').to.be.equal(
						getSelectedBlock(data, 'publisherMinWidth')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'min-width',
					'10px'
				);
			});
		});
	});

	describe('Max Width', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find('[data-type="core/paragraph"]')
				.type('This is a test text.');
		});

		// describe('Wordpress compatibility',()=>{});

		describe('Functionality', () => {
			it('should update max-width when adding value', () => {
				cy.getByDataTest('style-tab').click();
				cy.getParentContainer('Max W', 'base-control')
					.first()
					.within(() => {
						cy.get('input').type(200);
					});

				//Check block
				cy.getIframeBody()
					.find('[data-type="core/paragraph"]')
					.should('have.css', 'max-width', '200px');

				//Check store
				getWPDataObject().then((data) => {
					expect('200px').to.be.equal(
						getSelectedBlock(data, 'publisherMaxWidth')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'max-width',
					'200px'
				);
			});
		});
	});

	describe('Height', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find('[data-type="core/paragraph"]')
				.type('This is a test text.');
		});

		// describe('Wordpress compatibility',()=>{});

		describe('Functionality', () => {
			it('should update height when adding value', () => {
				cy.getByDataTest('style-tab').click();

				cy.get('h2').contains('Size').parent().parent().as('size');
				cy.get('@size').within(() => {
					cy.get('[aria-label="Height"]')
						.parent()
						.next()
						.within(() => {
							cy.get('input').type(80);
						});
				});

				//Check block
				cy.getIframeBody()
					.find('[data-type="core/paragraph"]')
					.should('have.css', 'height', '80px');

				//Check store
				getWPDataObject().then((data) => {
					expect('80px').to.be.equal(
						getSelectedBlock(data, 'publisherHeight')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph')
					.then(($el) => {
						return window.getComputedStyle($el[0]);
					})
					.invoke('getPropertyValue', 'height')
					.should('eq', '80px');
			});
		});
	});

	describe('Min Height', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find('[data-type="core/paragraph"]')
				.type('This is a test text.');
		});

		// describe('Wordpress compatibility',()=>{});

		describe('Functionality', () => {
			it('should update min-height when adding value', () => {
				cy.getByDataTest('style-tab').click();
				cy.getParentContainer('Min H', 'base-control')
					.first()
					.within(() => {
						cy.get('input').type(20);
					});

				//Check block
				cy.getIframeBody()
					.find('[data-type="core/paragraph"]')
					.should('have.css', 'min-height', '20px');

				//Check store
				getWPDataObject().then((data) => {
					expect('20px').to.be.equal(
						getSelectedBlock(data, 'publisherMinHeight')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'min-height',
					'20px'
				);
			});
		});
	});

	describe('Max Height', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find('[data-type="core/paragraph"]')
				.type('This is a test text.');
		});

		// describe('Wordpress compatibility',()=>{});

		describe('Functionality', () => {
			it('should update max-height when adding value', () => {
				cy.getByDataTest('style-tab').click();
				cy.getParentContainer('Max H', 'base-control')
					.first()
					.within(() => {
						cy.get('input').type(200);
					});

				//Check block
				cy.getIframeBody()
					.find('[data-type="core/paragraph"]')
					.should('have.css', 'max-height', '200px');

				//Check store
				getWPDataObject().then((data) => {
					expect('200px').to.be.equal(
						getSelectedBlock(data, 'publisherMaxHeight')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'max-height',
					'200px'
				);
			});
		});
	});

	describe('Overflow', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find('[data-type="core/paragraph"]')
				.type('This is a test text.');
		});

		//describe('Wordpress compatibility', () => {});

		describe('Functionality', () => {
			it('should update overflow to visible', () => {
				cy.getByDataTest('style-tab').click();

				//
				// should update overflow to visible
				//
				cy.get('h2').contains('Size').parent().parent().as('size');
				cy.get('@size').within(() => {
					cy.get('[aria-label="Overflow"]')
						.parent()
						.next()
						.within(() => {
							cy.get(
								'button[aria-label="Visible Overflow"]'
							).click();
						});
				});

				//Check block
				cy.getIframeBody()
					.find('[data-type="core/paragraph"]')
					.should('have.css', 'overflow', 'visible');

				//Check store
				getWPDataObject().then((data) => {
					expect('visible').to.be.equal(
						getSelectedBlock(data, 'publisherOverflow')
					);
				});

				//
				// should update overflow to hidden
				//
				cy.get('@size').within(() => {
					cy.get('[aria-label="Overflow"]')
						.parent()
						.next()
						.within(() => {
							cy.get(
								'button[aria-label="Hidden Overflow"]'
							).click();
						});
				});
				//Check block
				cy.getIframeBody()
					.find('[data-type="core/paragraph"]')
					.should('have.css', 'overflow', 'hidden');

				//Check store
				getWPDataObject().then((data) => {
					expect('hidden').to.be.equal(
						getSelectedBlock(data, 'publisherOverflow')
					);
				});

				//
				// should update overflow to scroll
				//
				cy.get('@size').within(() => {
					cy.get('[aria-label="Overflow"]')
						.parent()
						.next()
						.within(() => {
							cy.get(
								'button[aria-label="Scroll Overflow"]'
							).click();
						});
				});

				//Check block
				cy.getIframeBody()
					.find('[data-type="core/paragraph"]')
					.should('have.css', 'overflow', 'scroll');

				//Check store
				getWPDataObject().then((data) => {
					expect('scroll').to.be.equal(
						getSelectedBlock(data, 'publisherOverflow')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph')
					.then(($el) => {
						return window.getComputedStyle($el[0]);
					})
					.invoke('getPropertyValue', 'overflow')
					.should('eq', 'scroll');
			});
		});
	});
});
