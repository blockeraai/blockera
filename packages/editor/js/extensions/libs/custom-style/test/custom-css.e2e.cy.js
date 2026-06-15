import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
	openSettingsPanel,
} from '@blockera/dev-cypress/js/helpers';

describe('Custom CSS → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByAriaControls('styles-view').click();
	});

	it('should update custom css, when adding value', () => {
		openSettingsPanel('Custom CSS');

		cy.getParentContainer('Custom CSS Code').within(() => {
			cy.get('.monaco-editor').click().focused().clear({ force: true });
			cy.get('.monaco-editor').type('.block { background-color: red; }', {
				parseSpecialCharSequences: false,
			});
		});

		// Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'background-color',
			`rgb(255, 0, 0)`
		);

		//Check store
		getWPDataObject().then((data) => {
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
