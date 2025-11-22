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

describe('Post Terms Block', () => {
	beforeEach(() => {
		// Step 1: Create categories sequentially
		const categories = ['Category One', 'Category Two', 'Category Three'];

		// eslint-disable-next-line cypress/no-assigning-return-values
		let categoryChain = cy.wpCli(
			`term create category '${categories[0]}' || true`
		);

		for (let i = 1; i < categories.length; i++) {
			categoryChain = categoryChain.then(() => {
				return cy.wpCli(
					`term create category '${categories[i]}' || true`
				);
			});
		}

		categoryChain.then(() => {
			// Step 2: Create a post and get its ID
			cy.wpCli(
				`wp post create --post_type=post --post_title='Post with categories' --post_status=publish`
			).then((result) => {
				// Extract post ID from stdout message like "Success: Created post 22."
				const match = result.stdout.match(/post (\d+)/);
				const postId = match ? parseInt(match[1], 10) : NaN;

				if (isNaN(postId)) {
					throw new Error(
						`Failed to get post ID from output: ${result.stdout}`
					);
				}

				// Step 3: Assign categories to the post
				const categoryNames = categories.join(' ');
				cy.wpCli(
					`wp post term set ${postId} category ${categoryNames}`
				).then(() => {
					// Step 4: Edit the post
					cy.setScreenshotViewport('desktop');

					editPost({ postID: postId });
				});
			});
		});
	});

	it('Functionality + Inner blocks', () => {
		//
		// Append block
		//
		appendBlocks(
			'<!-- wp:post-terms {"term":"category","prefix":"prefix text","suffix":"suffix text"} /-->'
		);

		// Select target block
		cy.getBlock('core/post-terms').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems([
			'normal',
			'hover',
			'elements/link',
			'elements/separator',
			'elements/prefix',
			'elements/suffix',
		]);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//

		cy.getBlock('core/post-terms').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/post-terms').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/separator
		//
		setInnerBlock('elements/separator');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		// there is an issue that blocks are not updated immediately to see the terms
		// so we check the separator color in the front end

		//
		// 1.2. elements/prefix
		//
		setParentBlock();
		setInnerBlock('elements/prefix');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/post-terms')
			.first()
			.within(() => {
				cy.get('.wp-block-post-terms__prefix')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.3. elements/suffix
		//
		setParentBlock();
		setInnerBlock('elements/suffix');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.3.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/post-terms')
			.first()
			.within(() => {
				cy.get('.wp-block-post-terms__suffix')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.4. elements/link
		//
		setParentBlock();
		setInnerBlock('elements/link');

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		cy.setColorControlValue('BG Color', '22ff00');

		cy.getBlock('core/post-terms')
			.first()
			.within(() => {
				cy.get('a')
					.first()
					.should('have.css', 'background-color', 'rgb(34, 255, 0)');
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-post-terms').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-post-terms').within(() => {
			// core/separator
			cy.get('.wp-block-post-terms__separator')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/prefix
			cy.get('.wp-block-post-terms__prefix')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/suffix
			cy.get('.wp-block-post-terms__suffix')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/link
			cy.get('a')
				.first()
				.should('have.css', 'background-color', 'rgb(34, 255, 0)');
		});
	});
});
