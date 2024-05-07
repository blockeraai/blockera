import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Text Indent → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('Simple value', () => {
		openMoreFeaturesControl('More typography settings');

		cy.getParentContainer('Text Indent').within(() => {
			cy.get('input').type(5, { force: true });
		});

		//Check text indent
		cy.getBlock('core/paragraph').should('have.css', 'text-indent', '5px');

		//Check store
		getWPDataObject().then((data) => {
			expect('5px').to.be.equal(
				getSelectedBlock(data, 'blockeraTextIndent')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-core-block').should('have.css', 'text-indent', '5px');
	});
});
