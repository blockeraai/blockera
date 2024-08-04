import { createPost } from '@blockera/dev-cypress/js/helpers/site-navigation';
import { appendBlocks } from '@blockera/dev-cypress/js/helpers/editor';

describe('Block Partials Testing ...', () => {
	beforeEach(() => {
		createPost();
	});

	it('should be able to hide WordPress original block card and display blockera block card', () => {
		cy.getBlock('default').type('This is test paragraph', { delay: 0 });

		cy.get('[aria-label="Settings"]').eq(1).click({ force: true });
		cy.getByDataTest('style-tab').click();

		cy.get('.block-editor-block-card').should(
			'have.css',
			'display',
			'none'
		);

		cy.getByDataTest('blockera-block-card').contains('Paragraph');
		cy.getByDataTest('blockera-block-card').should(
			'have.css',
			'display',
			'flex'
		);
	});

	it('should be able to hide WordPress original block variations and display blockera block variations', () => {
		appendBlocks(
			'<!-- wp:social-links {"className":"is-style-default"} -->\n' +
				'<ul class="wp-block-social-links is-style-default"><!-- wp:social-link {"service":"wordpress"} /--></ul>\n' +
				'<!-- /wp:social-links -->'
		);

		cy.getBlock('core/social-links').click();

		cy.getByAriaLabel('Pill Shape').contains('Pill Shape');

		cy.getByAriaLabel('Block Settings').click();
		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.getByDataTest('Gutenberg Block').click();
			});
		cy.getByAriaLabel('Styles').click();

		cy.getByAriaLabel('Pill Shape').contains('Pill Shape');
	});
});
