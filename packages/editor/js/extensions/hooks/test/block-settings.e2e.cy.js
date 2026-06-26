import { createPost } from '@blockera/dev-cypress/js/helpers/site-navigation';
import { openBlockInserter } from '@blockera/dev-cypress/js/helpers/editor';

describe('Block Settings tests ...', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.openDocumentSettingsSidebar('Block');
		cy.getBlock('core/paragraph').first().click();
		cy.get('.block-editor-block-toolbar').should('be.visible');
	});

	it('should render blockera block icon for supported WordPress core blocks', () => {
		cy.getByDataTest('Paragraph Block Icon').should(
			'have.class',
			'blockera-block-icon'
		);

		cy.get(
			'.block-editor-block-switcher [data-test="Paragraph Block Icon"]'
		).should('have.css', 'display', 'none');

		openBlockInserter();

		cy.getByDataTest('Paragraph Block Icon').should(
			'have.class',
			'blockera-block-icon'
		);
	});
});
