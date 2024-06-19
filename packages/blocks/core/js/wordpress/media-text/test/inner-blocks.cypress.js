/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
	openMoreFeaturesControl,
} from '@blockera/dev-cypress/js/helpers';

describe('Media Text Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks(
			'<!-- wp:media-text {"mediaId":60,"mediaLink":"https://placehold.co/600x400","mediaType":"image","mediaWidth":38} -->\n' +
				'<div class="wp-block-media-text is-stacked-on-mobile" style="grid-template-columns:38% auto"><figure class="wp-block-media-text__media"><img src="https://placehold.co/600x400" alt="" class="wp-image-60 size-full"/></figure><div class="wp-block-media-text__content"><!-- wp:paragraph {"placeholder":"Content…"} -->\n' +
				'<p>Paragraph text</p>\n' +
				'<!-- /wp:paragraph --></div></div>\n' +
				'<!-- /wp:media-text --> '
		);

		// Select target block
		cy.getBlock('core/media-text').click();

		cy.getByAriaLabel('Select parent block: Media & Text').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Links Customize').should('exist');
				cy.getByAriaLabel('Paragraphs Customize').should('exist');
				cy.getByAriaLabel('Image Customize').should('exist');
				cy.getByAriaLabel('Headings Customize').should('exist');

				cy.getByAriaLabel('H1s Customize').should('not.exist');
				cy.getByAriaLabel('H2s Customize').should('not.exist');
				cy.getByAriaLabel('H3s Customize').should('not.exist');
				cy.getByAriaLabel('H4s Customize').should('not.exist');
				cy.getByAriaLabel('H5s Customize').should('not.exist');
				cy.getByAriaLabel('H6s Customize').should('not.exist');

				openMoreFeaturesControl('More Inner Blocks');

				cy.getByAriaLabel('H1s Customize').should('exist');
				cy.getByAriaLabel('H2s Customize').should('exist');
				cy.getByAriaLabel('H3s Customize').should('exist');
				cy.getByAriaLabel('H4s Customize').should('exist');
				cy.getByAriaLabel('H5s Customize').should('exist');
				cy.getByAriaLabel('H6s Customize').should('exist');
			}
		);
	});
});
