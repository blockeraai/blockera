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

describe('Group Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>This is a test paragraph!</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`);

		// Select target block
		cy.getBlock('core/paragraph').first().click();

		// Switch to parent block
		cy.getByAriaLabel('Select Group').click();

		cy.get('[role="tab"][aria-label="Styles"]').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockStatesPickerItems([
			'core/heading',
			'core/paragraph',
			'elements/link',
			'core/button',
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
		cy.getBlock('core/group').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/group').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. Inner blocks
		//
		setInnerBlock('core/paragraph');

		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/group').within(() => {
			cy.get('.wp-block-paragraph').should(
				'have.css',
				'background-color',
				'rgb(255, 0, 0)'
			);
		});

		//
		// 2. Check settings tab
		//
		setParentBlock();
		cy.get('[role="tab"][aria-label="Settings"]').click();

		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.block-editor-block-inspector__position').should(
				'not.be.visible'
			);

			cy.get('.components-panel__body-title button')
				.contains('Layout')
				.should('be.visible');
		});

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-group').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-group').within(() => {
			cy.get('p').should(
				'have.css',
				'background-color',
				'rgb(255, 0, 0)'
			);
		});
	});

	it('Grid layout hides duplicate WP layout controls on settings tab', () => {
		appendBlocks(`<!-- wp:group {"layout":{"type":"grid","minimumColumnWidth":"15rem","columnCount":4}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Grid layout group.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`);

		cy.getBlock('core/group').click();
		cy.get('.blockera-extension-block-card').should('be.visible');
		cy.get('[role="tab"][aria-label="Settings"]').click();

		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.block-editor-block-inspector__position').should(
				'not.be.visible'
			);

			cy.get('.components-panel__body-title button')
				.contains('Layout')
				.should('not.be.visible');

			cy.get(
				'.components-base-control__label, .components-base-control__visual-label'
			)
				.contains('Max. columns')
				.should('exist')
				.scrollIntoView()
				.should('not.be.visible');

			cy.get(
				'.components-base-control__label, .components-base-control__visual-label'
			)
				.contains('Min. column width')
				.should('exist')
				.scrollIntoView()
				.should('not.be.visible');
		});
	});
});
