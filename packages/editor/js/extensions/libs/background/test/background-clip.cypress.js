import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Background Clip → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').click();
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
			cy.contains('li', 'Clip to Padding').click();
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

		cy.get('.blockera-core-block').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});

	it('should set text clipping when block has text and background-mage', () => {
		// type to block
		cy.getBlock('core/paragraph').type('smile =)', { delay: 0 });

		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Image & Gradient').as('image-and-gradient');

		cy.get('@image-and-gradient').within(() => {
			// add bg repeater item
			cy.getByAriaLabel('Add New Background').as('bgRepeaterAddBtn');
			cy.get('@bgRepeaterAddBtn').click();
		});

		// add background image
		cy.get('.components-popover').within(() => {
			cy.contains('button', /choose image/i).click();
		});

		cy.get('#menu-item-upload').click();
		cy.get('input[type="file"]').selectFile(
			'cypress/fixtures/bg-extension-test.jpeg',
			{
				force: true,
			}
		);
		cy.get('.media-toolbar-primary > .button').click();

		// act : selecting clip to text
		cy.get('@clippingContainer').within(() => {
			cy.get('button').as('clippingBtn');
			cy.get('@clippingBtn').click();
			cy.contains('li', /text/i).click();
		});

		//assert data
		getWPDataObject().then((data) => {
			const bgClipState = getSelectedBlock(
				data,
				'blockeraBackgroundClip'
			);
			expect(bgClipState).to.be.equal('text');
		});

		//assert block
		cy.getBlock('core/paragraph')
			.should('have.css', 'background-clip', 'text')
			.and('have.css', '-webkit-text-fill-color', 'rgba(0, 0, 0, 0)');

		//assert  frontend
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-core-block').should(
			'have.css',
			'background-clip',
			'text'
		);
	});
});
