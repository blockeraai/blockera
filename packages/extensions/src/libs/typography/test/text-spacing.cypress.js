import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('Text Spacing → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('All together', () => {
		cy.openMoreFeatures('More typography settings');

		cy.getParentContainer('Letters').within(() => {
			cy.get('input').type(5, { force: true });
		});

		cy.getParentContainer('Words').within(() => {
			cy.get('input').type(5, { force: true });
		});

		cy.getParentContainer('Text Indent').within(() => {
			cy.get('input').type(5, { force: true });
		});

		//Check letter spacing
		cy.getBlock('core/paragraph').should(
			'have.css',
			'letter-spacing',
			'5px'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect('5px').to.be.equal(
				getSelectedBlock(data, 'publisherLetterSpacing')
			);
		});

		//Check letter spacing
		cy.getBlock('core/paragraph').should('have.css', 'word-spacing', '5px');

		//Check store
		getWPDataObject().then((data) => {
			expect('5px').to.be.equal(
				getSelectedBlock(data, 'publisherWordSpacing')
			);
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
			'letter-spacing',
			'5px'
		);

		cy.get('.publisher-core-block').should(
			'have.css',
			'word-spacing',
			'5px'
		);

		cy.get('.publisher-core-block').should(
			'have.css',
			'text-indent',
			'5px'
		);
	});
});
