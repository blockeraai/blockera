/**
 * Blockera dependencies
 */
import {
	savePage,
	redirectToFrontPage,
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
	setInnerBlock,
	setBlockState,
	setParentBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('Blocksy → Dynamic Data Block → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence + CSS selectors in editor and front-end', () => {
		appendBlocks(
			`<!-- wp:blocksy/dynamic-data {"blockeraPropsId":"c7920348-5ad7-4e2d-9699-fff8e781e06a","blockeraCompatId":"1912856297","blockeraBackgroundColor":{"value":"#ffa6a6"},"blockeraBackgroundClip":{"value":"padding-box"},"blockeraInnerBlocks":{"value":{"elements/link":{"attributes":{"blockeraBackgroundColor":"#ff0000"}}}},"blockeraFontColor":{"value":"#0044ff"},"field":"wp:author","style":{"elements":{"overlay":{"color":{"background":"#000000"}},"link":{"color":{"text":"#0044ff"}}},"color":{"text":"#0044ff","background":"#ffa6a6"}},"has_field_link":"yes","className":"blockera-block blockera-block\u002d\u002d63bmhe"} /-->`
		);

		cy.getBlock('blocksy/dynamic-data').first().click();

		cy.get('.blockera-extension-block-card').should('be.visible');

		//
		//  1. Assert inner blocks selectors in editor
		//
		cy.getBlock('blocksy/dynamic-data').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.getBlock('blocksy/dynamic-data')
			.first()
			.within(() => {
				cy.get('a').should(
					'have.css',
					'background-color',
					'rgb(255, 0, 0)'
				);
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(255, 0, 0)'
			);
		});
	});
});
