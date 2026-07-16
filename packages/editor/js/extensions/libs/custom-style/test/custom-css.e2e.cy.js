import {
	savePage,
	assertBlockData,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
	openSettingsPanel,
} from '@blockera/dev-cypress/js/helpers';

describe('Custom CSS → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
	});

	it('should update custom css, when adding value', () => {
		openSettingsPanel('Custom CSS');

		cy.getParentContainer('Custom CSS Code').within(() => {
			cy.setMonacoEditorValue('.block { background-color: red; }');
		});

		// Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'background-color',
			`rgb(255, 0, 0)`
		);

		//Check store
		assertBlockData((data) => {
			expect('.block { background-color: red; }').to.be.equal(
				getSelectedBlock(data, 'blockeraCustomCSS')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should(
			'have.css',
			'background-color',
			`rgb(255, 0, 0)`
		);
	});
});
