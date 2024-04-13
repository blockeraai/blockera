import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
} from '../../../../../../cypress/helpers';

describe('Letter Spacing → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('Simple value', () => {
		openMoreFeaturesControl('More typography settings');

		cy.getParentContainer('Letters').within(() => {
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

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'letter-spacing',
			'5px'
		);
	});
});
