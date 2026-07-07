/**
 * Block Unique Classname → Functionality
 */
import {
	createPost,
	getWPDataObject,
	getSelectedBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('Block Unique Classname → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('test', { delay: 0 });
	});

	it('should be generate unique classname for duplicate blocks while copying', () => {
		cy.getParentContainer('BG Color').within(() => {
			cy.openValueAddon();
		});

		cy.selectValueAddonItem('accent-4');

		getWPDataObject().then((data) => {
			cy.wrap(getSelectedBlock(data, 'className')).as(
				'originBlockClassname'
			);
		});

		cy.get('.block-editor-block-toolbar [aria-label="Options"]')
			.first()
			.click();
		cy.get('.components-popover button').contains('Duplicate').click();

		// Duplicated block inherits accent-4; open picker via the active value-addon button.
		cy.getParentContainer('BG Color').within(() => {
			cy.clickValueAddonButton();
		});

		cy.selectValueAddonItem('accent-5');

		cy.get('@originBlockClassname').then((originBlockClassname) => {
			getWPDataObject().then((data) => {
				const duplicatedBlockClassname = getSelectedBlock(
					data,
					'className'
				);

				expect(originBlockClassname).to.not.equal(
					duplicatedBlockClassname
				);
			});
		});
	});
});
