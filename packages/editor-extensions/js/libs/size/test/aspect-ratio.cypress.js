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

describe('Aspect Ratio → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('This is a test text.');

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
		cy.get('.blockera-core-block').should(
			'have.css',
			'aspect-ratio',
			'2 / 5'
		);
	});
});
