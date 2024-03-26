/**
 * Internal dependencies
 */
import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('Media Fit → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

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
				getSelectedBlock(data, 'publisherFit')
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
				getSelectedBlock(data, 'publisherFit')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'object-fit',
			'scale-down'
		);
	});
});
