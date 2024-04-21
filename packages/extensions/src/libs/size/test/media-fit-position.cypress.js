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

describe('Media Fit Position → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('This is a test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('should update object-position correctly, when add value', () => {
		cy.activateMoreSettingsItem('More Size Settings', 'Media Fit');

		/* Top Center */
		cy.getParentContainer('Media Fit').within(() => {
			cy.getByAriaLabel('Fit Position').click();
		});

		cy.getByDataTest('popover-body').within(() => {
			cy.get('span[aria-label="top center"]').click({
				force: true,
			});
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'object-Position',
			'0% 50%'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect({ top: '0%', left: '50%' }).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraFitPosition')
			);
		});

		/* Custom */
		cy.getByDataTest('popover-body').within(() => {
			cy.get('input').eq(0).clear({ force: true });
			cy.get('input').eq(0).type(10);
			cy.get('input').eq(1).clear({ force: true });
			cy.get('input').eq(1).type(30);
		});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'object-position',
			'10% 30%'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect({ top: '10%', left: '30%' }).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraFitPosition')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-core-block').should(
			'have.css',
			'object-position',
			'10% 30%'
		);
	});
});
