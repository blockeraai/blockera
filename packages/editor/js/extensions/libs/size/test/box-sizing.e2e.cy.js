/**
 * Blockera dependencies
 */
import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Box Sizing → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	it('border-box', () => {
		cy.activateMoreSettingsItem('More Size Settings', 'Box Sizing');

		cy.getParentContainer('Box Sizing').within(() => {
			cy.get('select').select('border-box');
		});

		// Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'box-sizing',
			'border-box'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect('border-box').to.be.equal(
				getSelectedBlock(data, 'blockeraBoxSizing')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should(
			'have.css',
			'box-sizing',
			'border-box'
		);
	});
});
