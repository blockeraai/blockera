/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	setParentBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Image Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:image {"id":7139,"width":"406px","height":"auto","aspectRatio":"1","sizeSlug":"full","linkDestination":"custom"} -->
<figure class="wp-block-image size-full is-resized"><a href="https://placehold.co/600x400"><img src="https://placehold.co/600x400" alt="this is the test
" class="wp-image-7139" style="aspect-ratio:1;width:406px;height:auto"/></a><figcaption class="wp-element-caption">Image caption is here...</figcaption></figure>
<!-- /wp:image -->
		`);

		// Select target block
		cy.getBlock('core/image').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover', 'elements/caption']);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/image').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/image').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. Image caption inner block
		//
		setInnerBlock('elements/caption');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/image')
			.first()
			.within(() => {
				cy.get('figcaption').should(
					'have.css',
					'background-color',
					'rgb(255, 0, 0)'
				);
			});

		//
		// 1.2. Image link inner block
		//
		setParentBlock();
		setInnerBlock('elements/link');

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/image')
			.first()
			.within(() => {
				cy.get('a').should(
					'have.css',
					'background-color',
					'rgb(255, 0, 0)'
				);
			});

		//
		// 2. Check settings tab
		//
		setParentBlock();
		cy.getByDataTest('settings-tab').click();

		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.components-tools-panel-header')
				.contains('Settings')
				.scrollIntoView()
				.should('be.visible');

			cy.get(
				'.components-tools-panel:not(.block-editor-bindings__panel)'
			).within(() => {
				cy.get('.components-input-control__label')
					.contains('Aspect ratio')
					.should('exist')
					.should('not.be.visible');

				cy.get('.components-input-control__label')
					.contains('Width')
					.should('exist')
					.should('not.be.visible');

				cy.get('.components-input-control__label')
					.contains('Height')
					.should('exist')
					.should('not.be.visible');
			});
		});

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-image')
			.first()
			.should('have.css', 'background-clip', 'padding-box');

		cy.get('.blockera-block.wp-block-image').within(() => {
			// caption inner block
			cy.get('figcaption')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// link inner block
			cy.get('a')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');
		});
	});
});
