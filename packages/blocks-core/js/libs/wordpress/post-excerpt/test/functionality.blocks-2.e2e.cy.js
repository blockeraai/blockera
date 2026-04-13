/**
 * Blockera dependencies
 */
import {
	savePage,
	editPost,
	appendBlocks,
	setInnerBlock,
	setParentBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Post Excerpt Block', () => {
	beforeEach(() => {
		// Step 1: Create a post and get its ID
		const postType = 'post';
		const postTitle = 'Test Post for Post Excerpt';
		const postStatus = 'publish';
		const postDate = '2024-12-01 12:00:00';

		cy.wpCli(
			`wp post create --post_type=${postType} --post_title='${postTitle}' --post_status=${postStatus} --post_date='${postDate}'`
		).then((result) => {
			// Extract post ID from stdout message like "Success: Created post 22."
			const match = result.stdout.match(/post (\d+)/);
			const postId = match ? parseInt(match[1], 10) : NaN;

			if (isNaN(postId)) {
				throw new Error(
					`Failed to get post ID from output: ${result.stdout}`
				);
			}

			// Step 2: Update post excerpt
			const excerptText =
				'This is a test <a href="#a">link</a> element. It include <strong>strong</strong>, <em>italic</em> , <span>span</span>, <kbd>CMD + K</kbd> key, <code>const $akbar</code> inline code and <mark style="background-color:#dfdfdf" class="has-inline-color">highlight</mark> elements.';

			// Escape single quotes for shell when using single quotes
			// Single quotes preserve everything literally except single quotes themselves
			const escapedExcerpt = excerptText.replace(/'/g, "'\\''");

			// Use wpCli with skipEscaping=true and single quotes
			// This avoids wpCli escaping the double quotes in the HTML
			cy.wpCli(
				`wp post update ${postId} --post_excerpt='${escapedExcerpt}'`,
				false,
				true
			).then(() => {
				// Step 3: Edit the post
				cy.setScreenshotViewport('desktop');

				editPost({ postID: postId });
			});
		});
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks('<!-- wp:post-excerpt {"moreText":"Read More"} /--> ');

		// Select target block
		cy.getBlock('core/post-excerpt').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover', 'elements/read-more-link']);

		cy.checkBlockStatesPickerItems([
			'elements/link',
			'elements/read-more-link',
			'elements/bold',
			'elements/italic',
			'elements/kbd',
			'elements/code',
			'elements/span',
			'elements/mark',
		]);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//

		cy.getBlock('core/post-excerpt').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/post-excerpt').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/read-more-link inner block
		//
		setInnerBlock('elements/read-more-link');

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/post-excerpt').within(() => {
			cy.get('a.wp-block-post-excerpt__more-link').should(
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
		});

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.wp-block-post-excerpt.blockera-block').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.wp-block-post-excerpt.blockera-block').within(() => {
			cy.get('a.wp-block-post-excerpt__more-link').should(
				'have.css',
				'background-color',
				'rgb(255, 0, 0)'
			);
		});
	});
});
