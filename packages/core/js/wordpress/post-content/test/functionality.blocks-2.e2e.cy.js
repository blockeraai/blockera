/**
 * Blockera dependencies
 */
import {
	goTo,
	savePage,
	createPost,
	appendBlocks,
	openInserter,
	setInnerBlock,
	setParentBlock,
	closeWelcomeGuide,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';
import { experimental } from '@blockera/env';

describe('Post Content Block', () => {
	beforeEach(() => {
		goTo(
			'/wp-admin/site-editor.php?postId=twentytwentyfive%2F%2Fpage-no-title&postType=wp_template&canvas=edit'
		).then(() => {
			// eslint-disable-next-line
			cy.wait(2000);
		});
	});

	const enabledOptimizeStyleGeneration = experimental().get(
		'earlyAccessLab.optimizeStyleGeneration'
	);

	it('Functionality + Inner blocks (Post content inside a Group block)', () => {
		// Close welcome guide if it exists
		closeWelcomeGuide();

		//
		// 1. Edit Post Template (with no title)
		//
		appendBlocks(`<!-- wp:template-part {"slug":"header","theme":"twentytwentyfive"} /-->

		<!-- wp:group {"tagName":"main","style":{"spacing":{"margin":{"top":"0"}}}} -->
		<main class="wp-block-group" style="margin-top:0">
			<!-- wp:post-content {"lock":{"move":false,"remove":true},"layout":{"type":"constrained"}} /-->
		</main>
		<!-- /wp:group -->

		<!-- wp:template-part {"slug":"footer","theme":"twentytwentyfive"} /-->
		`);

		// Select target block
		cy.getBlock('core/post-content').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover']);

		openInserter();
		cy.getByDataTest('elements/link').should('exist');

		// no other item
		cy.getByDataTest('core/heading').should('not.exist');

		//
		// 1.1. Edit Post Block
		//

		//
		// 1.1.1. Block Styles
		//
		cy.getBlock('core/post-content').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/post-content').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.2. Inner blocks
		//
		setInnerBlock('elements/link');

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		cy.setColorControlValue('BG Color', 'ff0000');

		//
		// 1.2. Edit Group Block
		//
		cy.getByAriaLabel('Select parent block: Group').click();

		//
		// 1.3.1. Wrapper Group Block Styles
		//
		cy.getSelectedBlock().should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.2.2. Block Alignment
		//
		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getSelectedBlock().should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 2. Check settings tab
		//
		cy.getByDataTest('settings-tab').click();

		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.components-panel__body-title button')
				.contains('Layout')
				.scrollIntoView()
				.should('be.visible');
		});

		//
		// 3. Save template
		//
		savePage();

		//
		// 2. Create a new page with no title template to test post content blo
		//
		createPost({ postType: 'page' });

		appendBlocks(`
		<!-- wp:paragraph -->
<p>This is a test <a href="#a">paragraph</a>...</p>
<!-- /wp:paragraph -->
		`);

		cy.get('button[data-tab-id="edit-post/document"]').click();

		//
		// Change post template
		//
		cy.get('[aria-label="Template options"]').click();

		cy.wait(3000);
		cy.get('body').then(($body) => {
			// WP >= 6.8
			if ($body.find('button:contains("Change template")').length > 0) {
				cy.get('button').contains('Change template').click();
			} else if (
				$body.find('button:contains("Swap template")').length > 0
			) {
				cy.get('button').contains('Swap template').click();
			}
		});

		cy.get('div#page-no-title[role="option"]').click();

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		//
		// 2.1. Post Content Block
		//
		cy.get('.blockera-block.wp-block-post-content').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 2.2. Post Content Block → Link Inner blocks
		//
		cy.get('.blockera-block.wp-block-post-content a').should(
			'have.css',
			'background-color',
			'rgb(255, 0, 0)'
		);

		//
		// 2.3. Post Content Block → Group Wrapper Block
		//
		cy.get('main.wp-block-group').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});

	it('Post content block in root', () => {
		//
		// 1. Edit Post Template (with no title)
		//
		appendBlocks(`<!-- wp:template-part {"slug":"header","theme":"twentytwentyfive"} /-->

<!-- wp:post-content {"style":{"spacing":{"padding":{"top":"0px","right":"","bottom":"","left":""},"margin":{"top":"0px","right":"","bottom":"","left":""}}}} /-->

<!-- wp:template-part {"slug":"footer","theme":"twentytwentyfive","area":"footer"} /-->
		`);

		// Select target block
		cy.getBlock('core/post-content').click();

		//
		// 1.1. Edit Post Block
		//

		//
		// 1.1.1. Block Styles
		//
		cy.getBlock('core/post-content').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/post-content').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.2. Inner blocks
		//
		setInnerBlock('elements/link');
		cy.setColorControlValue('BG Color', 'ff0000');

		//
		// 1.2. Save template
		//
		savePage();

		//
		// 2. Create a new page with no title template to test post content blo
		//
		createPost({ postType: 'page' });

		appendBlocks(`
			<!-- wp:paragraph -->
			<p>This is a test <a href="#a">paragraph</a>...</p>
			<!-- /wp:paragraph -->
		`);

		cy.get('button[data-tab-id="edit-post/document"]').click();

		//
		// Change post template
		//
		cy.get('[aria-label="Template options"]').click();

		cy.wait(3000);
		cy.get('body').then(($body) => {
			// WP >= 6.8
			if ($body.find('button:contains("Change template")').length > 0) {
				cy.get('button').contains('Change template').click();
			} else if (
				$body.find('button:contains("Swap template")').length > 0
			) {
				cy.get('button').contains('Swap template').click();
			}
		});

		cy.get('div#page-no-title[role="option"]').click();

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		//
		// 2.1. Post Content Block
		//
		cy.get('.blockera-block.wp-block-post-content').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		// Check if optimize style generation is enabled
		// then style attribute should not be present
		// this is a workaround to check if the feature is enabled and working
		if (enabledOptimizeStyleGeneration) {
			cy.get('.blockera-block.wp-block-post-content').should(
				'not.have.attr',
				'style'
			);
		}

		//
		// 2.2. Post Content Block → Link Inner blocks
		//
		cy.get('.blockera-block.wp-block-post-content a').should(
			'have.css',
			'background-color',
			'rgb(255, 0, 0)'
		);
	});
});
