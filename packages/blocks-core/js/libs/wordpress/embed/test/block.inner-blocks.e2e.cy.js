/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Embed Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:embed {"url":"https://www.youtube.com/watch?v=H_oJZ2Cv7a0","type":"video","providerNameSlug":"youtube","responsive":true,"className":"wp-embed-aspect-16-9 wp-has-aspect-ratio"} -->
<figure class="wp-block-embed is-type-video is-provider-youtube wp-block-embed-youtube wp-embed-aspect-16-9 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper">
https://www.youtube.com/watch?v=H_oJZ2Cv7a0
</div><figcaption class="wp-element-caption">This is the caption</figcaption></figure>
<!-- /wp:embed -->`);

		cy.getBlock('core/embed').first().click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover', 'elements/caption']);

		//
		// 1.0. Block Styles
		//

		cy.getBlock('core/embed').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		// cy.getBlock('core/embed').within(() => {
		// 	cy.get('.wp-block-embed__wrapper').should(
		// 		'have.css',
		// 		'background-clip',
		// 		'padding-box'
		// 	);
		// });

		//
		// 1.1. elements/caption
		//
		setInnerBlock('elements/caption');
		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/embed')
			.first()
			.within(() => {
				cy.get('figcaption').should(
					'have.css',
					'background-color',
					'rgb(255, 0, 0)'
				);
			});

		//
		// 2. Assert front end
		//
		savePage();
		redirectToFrontPage();

		cy.get(
			'.blockera-block.wp-block-embed .wp-block-embed__wrapper'
		).should('have.css', 'background-clip', 'padding-box');

		cy.get('.blockera-block.wp-block-embed').within(() => {
			cy.get('figcaption').should(
				'have.css',
				'background-color',
				'rgb(255, 0, 0)'
			);
		});
	});
});
