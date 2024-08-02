import {
	createPost,
	getSelectedBlock,
	getWPDataObject,
	redirectToFrontPage,
	savePage,
} from '@blockera/dev-cypress/js/helpers';

describe('z-index → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	it('z-index rendering + css generators', () => {
		cy.getParentContainer('Position').within(() => {
			cy.customSelect('Relative');
		});

		// check z-index and position render
		cy.getByAriaLabel('Top Position').should('exist');
		cy.getByAriaLabel('z-index').should('exist');

		cy.getParentContainer('z-index').within(() => {
			cy.get('input').type(100, { force: true });
		});

		// Check editor css generator
		cy.getBlock('core/paragraph').should('have.css', 'z-index', '100');

		//Check store
		getWPDataObject().then((data) => {
			expect('100').to.be.deep.equal(
				getSelectedBlock(data, 'blockeraZIndex')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block')
			.then(($el) => {
				return window.getComputedStyle($el[0]);
			})
			.invoke('getPropertyValue', 'z-index')
			.should('eq', '100');
	});
});
