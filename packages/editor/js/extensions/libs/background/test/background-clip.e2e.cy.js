import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Background Clip → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.get('[aria-label="Settings"]').eq(1).click({ force: true });
		cy.getByDataTest('style-tab').click();

		// add alias to the feature container
		cy.getParentContainer('Clipping').as('clippingContainer');
	});

	it(`simple padding box clipping`, () => {
		cy.get('@clippingContainer').within(() => {
			// act: clicking on clipping button
			cy.get('button').as('clippingBtn');
			cy.get('@clippingBtn').click();

			// select corresponding option
			cy.contains('div', 'Clip to Padding').click();
		});

		//assert data
		getWPDataObject().then((data) => {
			expect(
				getSelectedBlock(data, 'blockeraBackgroundClip')
			).to.be.equal('padding-box');
		});

		//assert block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//assert  frontend
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});

	it('Check the text clipping to be disabled', () => {
		cy.get('@clippingContainer').within(() => {
			cy.get('button').as('clippingBtn');
			cy.get('@clippingBtn').click();
			cy.contains('div', /text/i).should(
				'have.css',
				'pointer-events',
				'none'
			);
		});
	});
});
