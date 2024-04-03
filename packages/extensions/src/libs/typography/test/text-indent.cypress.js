import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('Text Indent → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('Simple value', () => {
		cy.openMoreFeatures('More typography settings');

		cy.getParentContainer('Text Indent').within(() => {
			cy.get('input').type(5, { force: true });
		});

		//Check text indent
		cy.getBlock('core/paragraph').should('have.css', 'text-indent', '5px');

		//Check store
		getWPDataObject().then((data) => {
			expect('5px').to.be.equal(
				getSelectedBlock(data, 'publisherTextIndent')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'text-indent',
			'5px'
		);
	});
});
