import {
	savePage,
	assertBlockData,
	getSelectedBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Text Transform → Functionality', () => {
	beforeEach(() => {
		createPost();
		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByAriaControls('styles-view').click();
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
		assertBlockData((data) => {
			expect('uppercase').to.be.equal(
				getSelectedBlock(data, 'blockeraTextTransform')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should(
			'have.css',
			'text-transform',
			'uppercase'
		);
	});
});
