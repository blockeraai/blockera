import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Transitions → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Transitions').as('transition');
	});

	it('Should update transition correctly, when add one transition', () => {
		cy.get('@transition').within(() => {
			cy.getByAriaLabel('Add New Transition').click();
		});

		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.getParentContainer('Type').within(() => {
					// check disabled options
					cy.get('select').within(() => {
						cy.get('[value="opacity"]').should('be.disabled');
						cy.get('[value="margin"]').should('be.disabled');
						cy.get('[value="padding"]').should('be.disabled');
					});

					cy.get('select').select('all');
				});

				cy.getByDataTest('transition-input-duration').clear();
				cy.getByDataTest('transition-input-duration').type(200);

				cy.getParentContainer('Timing').within(() => {
					// check disabled options
					cy.get('select').within(() => {
						cy.get('[value="ease-in-quad"]').should('be.disabled');
						cy.get('[value="ease-in-cubic"]').should('be.disabled');
					});

					cy.get('select').select('ease-in-out');
				});

				cy.getByDataTest('transition-input-delay').clear();
				cy.getByDataTest('transition-input-delay').type(2000);
			});

		// Check block CSS
		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', 'transition: all 200ms ease-in-out 2000ms');
		});

		//Check store
		getWPDataObject().then((data) => {
			expect({
				'all-0': {
					isVisible: true,
					type: 'all',
					duration: '200ms',
					timing: 'ease-in-out',
					delay: '2000ms',
					order: 0,
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraTransition'));
		});

		/* try to add another box shadow */
		cy.get('@transition').within(() => {
			cy.get('[aria-label="Add New Transition"]').click({
				force: true,
			});
		});

		// promotion popover should appear
		cy.get('.blockera-component-promotion-popover').should('exist');

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', 'transition: all 200ms ease-in-out 2000ms');
	});
});
