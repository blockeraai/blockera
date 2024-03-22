import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('Word Break → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock(`core/paragraph`).type('This is test text.');

		cy.getByDataTest('style-tab').click();

		cy.openMoreFeatures('More typography settings');
	});

	it('should update word-break, when add data', () => {
		cy.getParentContainer('Breaking', 'base-control').within(() => {
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
				getSelectedBlock(data, 'publisherWordBreak')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'word-break',
			'keep-all'
		);
	});
});
