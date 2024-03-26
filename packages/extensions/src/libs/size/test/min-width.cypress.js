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

describe('Min Width → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is a test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('simple value - should update min-width when adding value', () => {
		// activate min width
		cy.activateMoreSettingsItem('More Size Settings', 'Min Width');

		cy.getParentContainer('Min').within(() => {
			cy.get('input').type(10);
		});

		// Check block
		cy.getBlock('core/paragraph').should('have.css', 'min-width', '10px');

		//Check store
		getWPDataObject().then((data) => {
			expect('10px').to.be.equal(
				getSelectedBlock(data, 'publisherMinWidth')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should('have.css', 'min-width', '10px');
	});

	it('variable value', () => {
		// activate min width
		cy.activateMoreSettingsItem('More Size Settings', 'Min Width');

		// open value addon
		cy.getParentContainer('Min').within(() => {
			cy.openValueAddon();
		});

		// select variable
		cy.selectValueAddonItem('contentSize');

		// Check block
		cy.getBlock('core/paragraph').should('have.css', 'min-width', '800px');

		// Check store
		getWPDataObject().then((data) => {
			expect({
				settings: {
					name: 'Content Width',
					id: 'contentSize',
					value: '800px',
					reference: {
						type: 'preset',
					},
					type: 'width-size',
					var: '--wp--style--global--content-size',
				},
				name: 'Content Width',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherMinWidth'));
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'min-width',
			'800px'
		);
		cy.get('.publisher-core-block').hasCssVar(
			'min-width',
			'--wp--style--global--content-size'
		);
	});
});
