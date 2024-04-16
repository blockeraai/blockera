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

describe('Max Width → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is a test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();
	});

	it('simple value - should update max-width when adding value', () => {
		// activate min width
		cy.activateMoreSettingsItem('More Size Settings', 'Max Width');

		cy.getParentContainer('Max').within(() => {
			cy.get('input').type(200);
		});

		//Check block
		cy.getBlock('core/paragraph').should('have.css', 'max-width', '200px');

		//Check store
		getWPDataObject().then((data) => {
			expect('200px').to.be.equal(
				getSelectedBlock(data, 'publisherMaxWidth')
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'max-width',
			'200px'
		);
	});

	it('variable value', () => {
		// activate min width
		cy.activateMoreSettingsItem('More Size Settings', 'Max Width');

		// open value addon
		cy.getParentContainer('Max').within(() => {
			cy.openValueAddon();
		});

		// select variable
		cy.selectValueAddonItem('contentSize');

		// Check block
		cy.getBlock('core/paragraph').should('have.css', 'max-width', '800px');

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
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherMaxWidth'));
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'max-width',
			'800px'
		);
		cy.get('.publisher-core-block').hasCssVar(
			'max-width',
			'--wp--style--global--content-size'
		);
	});
});
