import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Line Height → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('simple value', () => {
		// activate line height
		// cy.activateMoreSettingsItem('More Typography Settings', 'Line Height');

		cy.getParentContainer('Line Height').within(() => {
			cy.get('input[type="number"]').focus();
			cy.get('input[type="number"]').type(10, {
				force: true,
			});
		});

		//Check block
		cy.getBlock('core/paragraph').should('have.css', 'line-height');

		//Check store
		getWPDataObject().then((data) => {
			expect('10').to.be.equal(
				getSelectedBlock(data, 'blockeraLineHeight')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should('have.css', 'line-height');
	});

	it('change line height to px', () => {
		// activate line height
		// cy.activateMoreSettingsItem('More Typography Settings', 'Line Height');

		cy.getParentContainer('Line Height').within(() => {
			cy.get('input[type="number"]').focus();
			cy.get('input[type="number"]').type(10, {
				force: true,
			});
			cy.get('select').select('px');
		});

		//Check block
		cy.getBlock('core/paragraph').should('have.css', 'line-height', '10px');

		//Check store
		getWPDataObject().then((data) => {
			expect('10px').to.be.equal(
				getSelectedBlock(data, 'blockeraLineHeight')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should('have.css', 'line-height', '10px');
	});
});
