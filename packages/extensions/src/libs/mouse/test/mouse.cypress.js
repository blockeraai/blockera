import {
	getWPDataObject,
	getSelectedBlock,
	addBlockToPost,
} from '../../../../../../cypress/helpers';

describe('Mouse Extension', () => {
	//describe('Extension Initializing', () => {...});

	describe('Cursor', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('this is test text.');

			cy.getByDataTest('style-tab').click();
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should update cursor correctly, when add wait', () => {
				cy.getParentContainer('Cursor', 'base-control').within(() => {
					cy.get('button[aria-haspopup="listbox"]').click();

					cy.get('ul').within(() => {
						cy.contains('wait').click();
					});
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'cursor', 'wait');

				//Check store
				getWPDataObject().then((data) => {
					expect('wait').to.be.equal(
						getSelectedBlock(data, 'publisherCursor')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'cursor',
					'wait'
				);
			});
		});
	});

	describe('User Select', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('this is test text.');

			cy.getByDataTest('style-tab').click();
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should update user-select correctly, when select text', () => {
				cy.getParentContainer('User Select', 'base-control').within(
					() => {
						cy.get('select').select('text');
					}
				);

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'user-select', 'text');

				//Check store
				getWPDataObject().then((data) => {
					expect('text').to.be.equal(
						getSelectedBlock(data, 'publisherUserSelect')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'user-select',
					'text'
				);
			});
		});
	});

	describe('Pointer Events', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('this is test text.');

			cy.getByDataTest('style-tab').click();
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should update pointer-events correctly, when select all', () => {
				cy.getParentContainer('Pointer Events', 'base-control').within(
					() => {
						cy.get('select').select('all');
					}
				);

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'pointer-events', 'all');

				//Check store
				getWPDataObject().then((data) => {
					expect('all').to.be.equal(
						getSelectedBlock(data, 'publisherPointerEvents')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'pointer-events',
					'all'
				);
			});
		});
	});
});
