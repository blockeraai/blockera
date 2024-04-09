import {
	getWPDataObject,
	getSelectedBlock,
	addBlockToPost,
	savePage,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('Pointer Events → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('this is test text.', {
			delay: 0,
		});

		cy.getByDataTest('interactions-tab').click();

		cy.getParentContainer('Pointer Events').as('container');
	});

	it('should update pointer-events correctly, when select all', () => {
		cy.get('@container').within(() => {
			cy.get('select').select('all');
		});

		// Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'pointer-events',
			'all'
		);

		// Check store
		getWPDataObject().then((data) => {
			expect('all').to.be.equal(
				getSelectedBlock(data, 'publisherPointerEvents')
			);
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'pointer-events',
			'all'
		);
	});
});
