/**
 * Internal dependencies
 */
import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Media Fit → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('This is a test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('should update object-fit correctly, when add value', () => {
		// activate min height
		cy.activateMoreSettingsItem('More Size Settings', 'Media Fit');

		cy.getParentContainer('Media Fit').as('mediaFit');

		cy.get('@mediaFit').within(() => {
			cy.get('[aria-haspopup="listbox"]').trigger('click');
			cy.get('li').eq(2).trigger('click'); // contain
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'object-fit',
			'contain'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect('contain').to.be.deep.equal(
				getSelectedBlock(data, 'blockeraFit')
			);
		});

		/* Scale Down */
		cy.get('@mediaFit').within(() => {
			cy.get('[aria-haspopup="listbox"]').trigger('click');
			cy.get('li').eq(5).trigger('click'); // scale-down
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

		cy.get('.blockera-core-block').should(
			'have.css',
			'object-fit',
			'scale-down'
		);
	});
});

