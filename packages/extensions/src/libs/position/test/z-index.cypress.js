import {
	addBlockToPost,
	getSelectedBlock,
	getWPDataObject,
	redirectToFrontPage,
	savePage,
} from '../../../../../../cypress/helpers';

describe('z-index -> Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.');

		cy.getByDataTest('style-tab').click();
	});

	it('z-index rendering + css generators', () => {
		cy.getParentContainer('Position', 'base-control').within(() => {
			cy.get('button[aria-haspopup="listbox"]').click();

			// select relative to activate z-index
			cy.get('ul').within(() => {
				cy.contains('Relative').trigger('click');
			});
		});

		// check z-index and position render
		cy.get('[aria-label="Top Position"]').should('exist');
		cy.get('[aria-label="z-index"]').should('exist');

		cy.getParentContainer('z-index', 'base-control').within(() => {
			cy.get('input').type(100, { force: true });
		});

		// Check editor css generator
		cy.getBlock('core/paragraph').should('have.css', 'z-index', '100');

		//Check store
		getWPDataObject().then((data) => {
			expect('100').to.be.deep.equal(
				getSelectedBlock(data, 'publisherZIndex')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block')
			.then(($el) => {
				return window.getComputedStyle($el[0]);
			})
			.invoke('getPropertyValue', 'z-index')
			.should('eq', '100');
	});
});
