import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Transitions → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('this is test text.', { delay: 0 });

		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Transitions').as('transition');
	});

	it('Should update transition correctly, when add one transition', () => {
		cy.get('@transition').within(() => {
			cy.getByAriaLabel('Add New Transition').click();
		});

		cy.get('.components-popover').within(() => {
			cy.getParentContainer('Type').within(() => {
				cy.get('select').select('margin');
			});

			cy.getByDataTest('transition-input-duration').clear();
			cy.getByDataTest('transition-input-duration').type(200);

			cy.getParentContainer('Timing').within(() => {
				cy.get('select').select('ease-in-out');
			});

			cy.getByDataTest('transition-input-delay').clear();
			cy.getByDataTest('transition-input-delay').type(2000);
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'transition',
			'margin 0.2s ease-in-out 2s'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect({
				'margin-0': {
					isVisible: true,
					type: 'margin',
					duration: '200ms',
					timing: 'ease-in-out',
					delay: '2000ms',
					order: 0,
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraTransition'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-core-block').should(
			'have.css',
			'transition',
			'margin 0.2s ease-in-out 2s'
		);
	});

	it('Should update transition correctly, when add multiple transition', () => {
		cy.get('@transition').within(() => {
			cy.getByAriaLabel('Add New Transition').click();
		});

		cy.get('.components-popover').within(() => {
			cy.getParentContainer('Type', 'base-control').within(() => {
				cy.get('select').select('margin');
			});

			cy.getByDataTest('transition-input-duration').clear();
			cy.getByDataTest('transition-input-duration').type(200);

			cy.getParentContainer('Timing', 'base-control').within(() => {
				cy.get('select').select('ease-in-out');
			});

			cy.getByDataTest('transition-input-delay').clear();
			cy.getByDataTest('transition-input-delay').type(2000);
		});

		cy.get('@transition').within(() => {
			cy.getByAriaLabel('Add New Transition').click();
		});

		cy.getByDataTest('popover-body').within(() => {
			cy.getParentContainer('Type', 'base-control').within(() => {
				cy.get('select').select('border');
			});

			cy.getByDataTest('transition-input-duration').clear();
			cy.getByDataTest('transition-input-duration').type(300);

			cy.getParentContainer('Timing', 'base-control').within(() => {
				cy.get('select').select('ease-in');
			});

			cy.getByDataTest('transition-input-delay').clear();
			cy.getByDataTest('transition-input-delay').type(3000);
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'transition',
			'margin 0.2s ease-in-out 2s, border 0.3s ease-in 3s'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect({
				'margin-0': {
					isVisible: true,
					type: 'margin',
					duration: '200ms',
					timing: 'ease-in-out',
					delay: '2000ms',
					order: 0,
				},
				'border-0': {
					isVisible: true,
					type: 'border',
					duration: '300ms',
					timing: 'ease-in',
					delay: '3000ms',
					order: 1,
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraTransition'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-core-block').should(
			'have.css',
			'transition',
			'margin 0.2s ease-in-out 2s, border 0.3s ease-in 3s'
		);
	});
});
