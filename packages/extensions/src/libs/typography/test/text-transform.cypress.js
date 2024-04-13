import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
} from '../../../../../../cypress/helpers';

describe('Text Transform → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('Simple value', () => {
		openMoreFeaturesControl('More typography settings');

		cy.getByAriaLabel('Uppercase').click();

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'text-transform',
			'uppercase'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect('uppercase').to.be.equal(
				getSelectedBlock(data, 'publisherTextTransform')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'text-transform',
			'uppercase'
		);
	});
});
