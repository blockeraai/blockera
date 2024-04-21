import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Font Style → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

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
				getSelectedBlock(data, 'blockeraFontStyle')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-core-block').should(
			'have.css',
			'font-style',
			'italic'
		);
	});
});

