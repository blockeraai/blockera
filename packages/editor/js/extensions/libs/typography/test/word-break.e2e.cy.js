import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Word Break → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();

		openMoreFeaturesControl('More typography settings');
	});

	it('should update word-break, when add data', () => {
		cy.getParentContainer('Breaking').within(() => {
			cy.get('[aria-haspopup="listbox"]').click();

			cy.get('li').eq(2).trigger('click');
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'word-break',
			'keep-all'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect('keep-all').to.be.equal(
				getSelectedBlock(data, 'blockeraWordBreak')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should('have.css', 'word-break', 'keep-all');
	});
});
