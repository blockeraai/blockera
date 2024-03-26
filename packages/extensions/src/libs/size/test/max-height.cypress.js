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

describe('Max Height → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is a test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('simple value - should update max-height when adding value', () => {
		// activate max height
		cy.activateMoreSettingsItem('More Size Settings', 'Max Height');

		cy.getParentContainer('Max').within(() => {
			cy.get('input').type(200);
		});

		// Check block
		cy.getBlock('core/paragraph').should('have.css', 'max-height', '200px');

		// Check store
		getWPDataObject().then((data) => {
			expect('200px').to.be.equal(
				getSelectedBlock(data, 'publisherMaxHeight')
			);
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'max-height',
			'200px'
		);
	});

	it('variable value', () => {
		// activate max height
		cy.activateMoreSettingsItem('More Size Settings', 'Max Height');

		// open value addon
		cy.getParentContainer('Max').within(() => {
			cy.openValueAddon();
		});

		// select variable
		cy.selectValueAddonItem('contentSize');

		// Check block
		cy.getBlock('core/paragraph').should('have.css', 'max-height', '800px');

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
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherMaxHeight'));
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'max-height',
			'800px'
		);
		cy.get('.publisher-core-block').hasCssVar(
			'max-height',
			'--wp--style--global--content-size'
		);
	});
});
