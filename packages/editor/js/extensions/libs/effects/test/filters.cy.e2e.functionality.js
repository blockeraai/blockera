import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Filters → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Filters').as('filters');
	});

	it('Should update filter correctly, when add one drop-shadow', () => {
		cy.get('@filters').within(() => {
			cy.getByAriaLabel('Add New Filter Effect').click();
		});

		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.getParentContainer('Type').within(() => {
					cy.get('select').select('drop-shadow');
				});

				cy.getByDataTest('filter-drop-shadow-x-input').clear();
				cy.getByDataTest('filter-drop-shadow-x-input').type(50);

				cy.getByDataTest('filter-drop-shadow-y-input').clear();
				cy.getByDataTest('filter-drop-shadow-y-input').type(30);

				cy.getByDataTest('filter-drop-shadow-blur-input').clear();
				cy.getByDataTest('filter-drop-shadow-blur-input').type(40);

				cy.getByDataTest('filter-drop-shadow-color').click();
			});

		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.get('input[maxlength="9"]').clear();
				cy.get('input[maxlength="9"]').type('cccccc');
			});

		//Check block
		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should(
					'include',
					'filter: drop-shadow(50px 30px 40px #cccccc);'
				);
		});

		//Check store
		getWPDataObject().then((data) => {
			expect({
				'drop-shadow-0': {
					isVisible: true,
					type: 'drop-shadow',
					'drop-shadow-x': '50px',
					'drop-shadow-y': '30px',
					'drop-shadow-blur': '40px',
					'drop-shadow-color': '#cccccc',
					order: 0,
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraFilter'));
		});

		/* try to add another filter */
		cy.get('@filters').within(() => {
			cy.get('[aria-label="Add New Filter Effect"]').click({
				force: true,
			});
		});

		// promotion popover should appear
		cy.get('.blockera-component-promotion-popover').should('exist');

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css-inline-css')
			.invoke('text')
			.should('include', 'filter: drop-shadow(50px 30px 40px #cccccc);');
	});
});
