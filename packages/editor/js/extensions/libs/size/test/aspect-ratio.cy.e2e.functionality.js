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

describe('Aspect Ratio → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	it('should update aspect-ratio correctly, when add value', () => {
		// activate ratio
		cy.activateMoreSettingsItem('More Size Settings', 'Aspect Ratio');

		// Standard 1:1
		cy.getParentContainer('Aspect Ratio').within(() => {
			cy.get('select').select('1', { force: true });
		});

		// Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'aspect-ratio',
			'1 / 1'
		);

		// Check store
		getWPDataObject().then((data) => {
			expect({
				value: '1',
				width: '',
				height: '',
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraRatio'));
		});

		// Custom
		cy.getParentContainer('Aspect Ratio').within(() => {
			cy.get('select').select('custom');
			cy.get('input').eq(0).type(2);
			cy.get('input').eq(1).type(5);
		});

		// Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'aspect-ratio',
			'2 / 5'
		);

		// Check store
		getWPDataObject().then((data) => {
			expect({
				value: 'custom',
				width: 2,
				height: 5,
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraRatio'));
		});

		// Check frontend
		savePage();
		redirectToFrontPage();
		cy.get('.blockera-block').should('have.css', 'aspect-ratio', '2 / 5');
	});
});
