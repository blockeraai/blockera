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

describe('Min Height → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('This is a test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('simple value - should update min-height when adding value', () => {
		// activate min height
		cy.activateMoreSettingsItem('More Size Settings', 'Min Height');

		cy.getParentContainer('Min').within(() => {
			cy.get('input').type(10);
		});

		// Check block
		cy.getBlock('core/paragraph').should('have.css', 'min-height', '10px');

		//Check store
		getWPDataObject().then((data) => {
			expect('10px').to.be.equal(
				getSelectedBlock(data, 'blockeraMinHeight')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-core-block').should('have.css', 'min-height', '10px');
	});

	it('variable value', () => {
		// activate min height
		cy.activateMoreSettingsItem('More Size Settings', 'Min Height');

		// open value addon
		cy.getParentContainer('Min').within(() => {
			cy.openValueAddon();
		});

		// select variable
		cy.selectValueAddonItem('contentSize');

		// Check block
		cy.getBlock('core/paragraph').should('have.css', 'min-height', '620px');

		// Check store
		getWPDataObject().then((data) => {
			expect({
				settings: {
					name: 'Content Width',
					id: 'contentSize',
					value: '620px',
					reference: {
						type: 'preset',
					},
					type: 'width-size',
					var: '--wp--style--global--content-size',
				},
				name: 'Content Width',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraMinHeight'));
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-core-block').should(
			'have.css',
			'min-height',
			'620px'
		);
		cy.get('.blockera-core-block').hasCssVar(
			'min-height',
			'--wp--style--global--content-size'
		);
	});
});

