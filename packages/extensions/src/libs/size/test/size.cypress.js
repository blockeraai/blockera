/**
 * Internal dependencies
 */
import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	appendBlocks,
} from '../../../../../../cypress/helpers';

describe('Size Extension', () => {
	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	describe('Extension Initializing', () => {
		it('should mount extension with WordPress block previous attributes', () => {
			const code = `<!-- wp:paragraph -->
<p>This is a test text.</p>
<!-- /wp:paragraph -->`;

			appendBlocks(code);

			cy.getIframeBody().find(`[data-type="core/paragraph"]`).click();

			getWPDataObject().then((data) => {
				expect('').to.be.equal(
					getSelectedBlock(data, 'publisherWidth')
				);
			});

			//	savePage();

			//	redirectToFrontPage();

			// cy.contains('This is a test text.')
			// 	.then(($el) => {
			// 		console.log($el);
			// 		console.log(window.getComputedStyle($el[0]));
			// 		return window.getComputedStyle($el[0]);
			// 	})
			// 	.invoke('getPropertyValue', 'width')
			// 	.should('eq', '');
		});
	});

	describe('Width', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find('[data-type="core/paragraph"]')
				.type('This is a test text.');

			cy.get('[aria-label="Settings"]').click();
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

				cy.getIframeBody()
					.find('[data-type="core/paragraph"]')
					.should('have.css', 'width', '100px');

				getWPDataObject().then((data) => {
					expect('100px').to.be.equal(
						getSelectedBlock(data, 'publisherWidth')
					);
				});

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

	describe('Height', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find('[data-type="core/paragraph"]')
				.type('This is a test text.');

			cy.get('[aria-label="Settings"]').click();
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

				cy.getIframeBody()
					.find('[data-type="core/paragraph"]')
					.should('have.css', 'height', '80px');

				getWPDataObject().then((data) => {
					expect('80px').to.be.equal(
						getSelectedBlock(data, 'publisherHeight')
					);
				});

				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph')
					.then(($el) => {
						console.log(window.getComputedStyle($el[0]));
						return window.getComputedStyle($el[0]);
					})
					.invoke('getPropertyValue', 'height')
					.should('eq', '80px');
			});
		});
	});

	describe('Overflow', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find('[data-type="core/paragraph"]')
				.type('This is a test text.');

			cy.get('[aria-label="Settings"]').click();
		});

		//describe('Wordpress compatibility', () => {});

		describe('Functionality', () => {
			it('should update overflow to visible', () => {
				cy.getByDataTest('style-tab').click();

				cy.get('h2').contains('Size').parent().parent().as('size');
				cy.get('@size').within(() => {
					cy.get('[aria-label="Overflow"]')
						.parent()
						.next()
						.within(() => {
							cy.get('button[aria-label="Visible"]').click();
						});
				});

				cy.getIframeBody()
					.find('[data-type="core/paragraph"]')
					.should('have.css', 'overflow', 'visible');

				getWPDataObject().then((data) => {
					expect('visible').to.be.equal(
						getSelectedBlock(data, 'publisherOverflow')
					);
				});

				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph')
					.then(($el) => {
						return window.getComputedStyle($el[0]);
					})
					.invoke('getPropertyValue', 'overflow')
					.should('eq', 'visible');
			});

			it('should update overflow to hidden', () => {
				cy.getByDataTest('style-tab').click();

				cy.get('h2').contains('Size').parent().parent().as('size');
				cy.get('@size').within(() => {
					cy.get('[aria-label="Overflow"]')
						.parent()
						.next()
						.within(() => {
							cy.get('button[aria-label="Hidden"]').click();
						});
				});

				cy.getIframeBody()
					.find('[data-type="core/paragraph"]')
					.should('have.css', 'overflow', 'hidden');

				getWPDataObject().then((data) => {
					expect('hidden').to.be.equal(
						getSelectedBlock(data, 'publisherOverflow')
					);
				});

				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph')
					.then(($el) => {
						return window.getComputedStyle($el[0]);
					})
					.invoke('getPropertyValue', 'overflow')
					.should('eq', 'hidden');
			});

			it('should update overflow to scroll', () => {
				cy.getByDataTest('style-tab').click();

				cy.get('h2').contains('Size').parent().parent().as('size');
				cy.get('@size').within(() => {
					cy.get('[aria-label="Overflow"]')
						.parent()
						.next()
						.within(() => {
							cy.get('button[aria-label="Scroll"]').click();
						});
				});

				cy.getIframeBody()
					.find('[data-type="core/paragraph"]')
					.should('have.css', 'overflow', 'scroll');

				getWPDataObject().then((data) => {
					expect('scroll').to.be.equal(
						getSelectedBlock(data, 'publisherOverflow')
					);
				});

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
