import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
} from '../../../../../../cypress/helpers';

describe('Font Style → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('simple value', () => {
		openMoreFeaturesControl('More typography settings');

		cy.getByAriaLabel('Italic style').click();

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'font-style',
			'italic'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect('italic').to.be.equal(
				getSelectedBlock(data, 'publisherFontStyle')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'font-style',
			'italic'
		);
	});
});
