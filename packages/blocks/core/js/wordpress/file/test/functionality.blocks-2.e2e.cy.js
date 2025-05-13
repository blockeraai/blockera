/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	savePage,
	redirectToFrontPage,
	setInnerBlock,
	setParentBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('File Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:file {"id":80,"href":"https://placehold.co/600x400"} -->
<div class="wp-block-file"><a id="wp-block-file--media-d6522e7b-18b5-44ed-9925-aa94af2be7e3" href="https://placehold.co/600x400">about-sofia</a><a href="https://placehold.co/600x400" class="wp-block-file__button wp-element-button" download aria-describedby="wp-block-file--media-d6522e7b-18b5-44ed-9925-aa94af2be7e3">Download</a></div>
<!-- /wp:file --> `);

		// Select target block
		cy.getBlock('core/file').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');
		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/file').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/file').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/link
		//
		setInnerBlock('elements/link');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'cccccc');

		cy.getBlock('core/file').within(() => {
			cy.get('a:not(.wp-element-button)').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);
		});

		//
		// 1.2. core/button
		//
		setParentBlock();
		setInnerBlock('core/button');

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'eeeeee');

		cy.getBlock('core/file').within(() => {
			cy.get('.wp-element-button').should(
				'have.css',
				'background-color',
				'rgb(238, 238, 238)'
			);
		});

		//
		// 2. Check settings tab
		//
		setParentBlock();
		cy.getByDataTest('settings-tab').click();

		// layout settings should be hidden
		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.components-panel__body-title button')
				.contains('Settings')
				.should('be.visible');
		});

		//
		// 2. Assert front end
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-file').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-file').within(() => {
			cy.get('a:not(.wp-element-button)').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);

			cy.get('a.wp-element-button').should(
				'have.css',
				'background-color',
				'rgb(238, 238, 238)'
			);
		});
	});
});
