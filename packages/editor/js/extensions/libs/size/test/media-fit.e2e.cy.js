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

describe('Media Fit → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	it('should update object-fit correctly, when add value', () => {
		// activate min height
		cy.activateMoreSettingsItem('More Size Settings', 'Media Fit');

		cy.getParentContainer('Media Fit').as('mediaFit');

		cy.get('@mediaFit').within(() => {
			cy.customSelect('Fill', 'Media Fit');
		});

		//Check block
		cy.getBlock('core/paragraph').should('have.css', 'object-fit', 'fill');

		//Check store
		getWPDataObject().then((data) => {
			expect('fill').to.be.equal(getSelectedBlock(data, 'blockeraFit'));
		});

		/* Scale Down */
		cy.get('@mediaFit').within(() => {
			cy.customSelect('Scale Down', 'Media Fit');
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'object-fit',
			'scale-down'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect('scale-down').to.be.deep.equal(
				getSelectedBlock(data, 'blockeraFit')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should(
			'have.css',
			'object-fit',
			'scale-down'
		);
	});
});
