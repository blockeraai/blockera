/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	savePage,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Audio Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		// Use cy.fixture to get the audio file path
		cy.fixture('blockera.mp3', 'base64').then((mp3) => {
			const audioUrl = `data:audio/mp3;base64,${mp3}`;

			appendBlocks(`<!-- wp:audio {"id":1344} -->
<figure class="wp-block-audio"><audio controls src="${audioUrl}"></audio></figure>
<!-- /wp:audio -->`);
		});

		cy.getBlock('core/audio').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// No inner blocks extension
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/audio').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/audio').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-audio').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});
});
