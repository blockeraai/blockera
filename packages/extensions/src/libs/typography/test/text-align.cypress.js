import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
} from '../../../../../../cypress/helpers';

describe('Text Align → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('simple value', () => {
		openMoreFeaturesControl('More typography settings');

		// center align
		cy.getByAriaLabel('Center').click();

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'text-align',
			'center'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect('center').to.be.equal(
				getSelectedBlock(data, 'publisherTextAlign')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'text-align',
			'center'
		);
	});
});
