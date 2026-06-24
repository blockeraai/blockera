/**
 * Block Unique Classname → Functionality
 */
import {
	createPost,
	appendBlocks,
	getWPDataObject,
	getSelectedBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('Block Unique Classname → Functionality', () => {
	beforeEach(() => {
		createPost();

		appendBlocks(`<!-- wp:paragraph -->
<p>test</p>
<!-- /wp:paragraph -->`);

		cy.getBlock('core/paragraph').first().click();
	});

	it('should be generate unique classname for duplicate blocks while copying', () => {
		cy.getParentContainer('BG Color').within(() => {
			cy.openValueAddon();
		});

		cy.getByDataCy('va-item-accent-4').click({ force: true });

		let originBlockClassname;

		getWPDataObject().then((data) => {
			originBlockClassname = getSelectedBlock(data, 'className');
		});

		cy.get('.block-editor-block-toolbar [aria-label="Options"]')
			.first()
			.click();
		cy.get('.components-popover button').contains('Duplicate').click();

		cy.getParentContainer('BG Color').within(() => {
			cy.openValueAddon();
		});

		cy.getByDataCy('va-item-accent-5').click({ force: true });

		getWPDataObject().then((data) => {
			const duplicatedBlockClassname = getSelectedBlock(
				data,
				'className'
			);

			expect(originBlockClassname).to.not.equal(duplicatedBlockClassname);
		});
	});
});
