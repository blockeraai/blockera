import {
	savePage,
	createPost,
	appendBlocks,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

/**
 * This test is for `gap-and-margin`.
 *
 * If gap type is `gap-and-margin` then it means if display is `flex` or `grid` then it use `gap` property
 * else for other display types it use `margin-block-start`.
 *
 * This functionalities changes over variation and we need to test that too.
 */
describe('Gap → Functionality (Type: gap-and-margin)', () => {
	beforeEach(() => {
		createPost();
	});

	context('Variation: Group', () => {
		it('Locked gap - the css property should be margin-block-start', () => {
			appendBlocks(
				`<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`
			);

			// Select target block
			cy.getBlock('core/paragraph').first().click();

			// Switch to parent block
			cy.getByAriaLabel('Select parent block: Group').click();

			// switch to style tab
			cy.getByDataTest('style-tab').click();

			cy.getParentContainer('Gap').within(() => {
				cy.get('input').type(100);
			});

			//
			// Asset group block CSS
			//
			cy.getBlock('core/group').should('not.have.css', 'gap', '100px');

			//
			// Assert child block to have valid property for gap
			//

			cy.getBlock('core/paragraph')
				.first()
				.should('have.css', 'margin-block-start', '0px');

			cy.getBlock('core/paragraph')
				.last()
				.should('have.css', 'margin-block-start', '100px');

			//Check frontend
			savePage();

			redirectToFrontPage();

			//
			// Asset group block CSS
			//
			cy.get('.wp-block-group.blockera-block').should(
				'not.have.css',
				'gap',
				'100px'
			);

			//
			// Assert child block to have valid property for gap
			//
			cy.get('.wp-block-group.blockera-block p')
				.last()
				.should('have.css', 'margin-block-start', '100px');
		});

		it('Unlocked gap - the css property should be margin-block-start', () => {
			appendBlocks(
				`<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`
			);

			// Select target block
			cy.getBlock('core/paragraph').first().click();

			// Switch to parent block
			cy.getByAriaLabel('Select parent block: Group').click();

			// switch to style tab
			cy.getByDataTest('style-tab').click();

			cy.getParentContainer('Gap').within(() => {
				cy.get('input').type(100);

				// unlock gap
				cy.getByAriaLabel('Custom Row & Column Gap').click();
			});

			//
			// Asset group block CSS
			//
			cy.getBlock('core/group').should(
				'not.have.css',
				'row-gap',
				'100px'
			);

			//
			// Assert child block to have valid property for gap
			//

			cy.getBlock('core/paragraph')
				.first()
				.should('have.css', 'margin-block-start', '0px');

			cy.getBlock('core/paragraph')
				.last()
				.should('have.css', 'margin-block-start', '100px');

			//Check frontend
			savePage();

			redirectToFrontPage();

			//
			// Asset group block CSS
			//
			cy.get('.wp-block-group.blockera-block').should(
				'not.have.css',
				'row-gap',
				'100px'
			);

			//
			// Assert child block to have valid property for gap
			//
			cy.get('.wp-block-group.blockera-block p')
				.last()
				.should('have.css', 'margin-block-start', '100px');
		});
	});

	context('Variation: Row', () => {
		it('Locked gap - the css property should be gap', () => {
			appendBlocks(
				`<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`
			);

			// Select target block
			cy.getBlock('core/paragraph').first().click();

			// Switch to parent block
			cy.getByAriaLabel('Select parent block: Group').click();

			// switch to style tab
			cy.getByDataTest('style-tab').click();

			cy.getParentContainer('Display').within(() => {
				cy.getByAriaLabel('Flex').click();
			});

			cy.getParentContainer('Flex Layout').within(() => {
				cy.getByAriaLabel('Row').click();
			});

			cy.getByDataTest('matrix-top-left-normal').click();

			cy.getParentContainer('Gap').within(() => {
				cy.get('input').type(100);
			});

			//
			// Asset group block CSS
			//
			cy.getBlock('core/group').should('have.css', 'gap', '100px');

			//
			// Assert child block to have valid property for gap
			//

			cy.getBlock('core/paragraph')
				.first()
				.should('have.css', 'margin-block-start', '0px')
				.should('not.have.css', 'flex-direction', 'column')
				.should('not.have.css', 'align-items', 'flex-start')
				.should('not.have.css', 'justify-content', 'flex-start');

			cy.getBlock('core/paragraph')
				.last()
				.should('have.css', 'margin-block-start', '0px')
				.should('not.have.css', 'flex-direction', 'column')
				.should('not.have.css', 'align-items', 'flex-start')
				.should('not.have.css', 'justify-content', 'flex-start');

			//Check frontend
			savePage();

			redirectToFrontPage();

			//
			// Asset group block CSS
			//
			cy.get('.wp-block-group.blockera-block').should(
				'have.css',
				'gap',
				'100px'
			);

			//
			// Assert child block to have valid property for gap
			//
			cy.get('.wp-block-group.blockera-block p')
				.first()
				.should('have.css', 'margin-block-start', '0px')
				.should('not.have.css', 'flex-direction', 'column')
				.should('not.have.css', 'align-items', 'flex-start')
				.should('not.have.css', 'justify-content', 'flex-start');

			cy.get('.wp-block-group.blockera-block p')
				.last()
				.should('have.css', 'margin-block-start', '0px')
				.should('not.have.css', 'flex-direction', 'column')
				.should('not.have.css', 'align-items', 'flex-start')
				.should('not.have.css', 'justify-content', 'flex-start');
		});

		it('Unlocked gap - the css property should be gap', () => {
			appendBlocks(
				`<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`
			);

			// Select target block
			cy.getBlock('core/paragraph').first().click();

			// Switch to parent block
			cy.getByAriaLabel('Select parent block: Group').click();

			// switch to style tab
			cy.getByDataTest('style-tab').click();

			cy.getParentContainer('Display').within(() => {
				cy.getByAriaLabel('Flex').click();
			});

			cy.getParentContainer('Flex Layout').within(() => {
				cy.getByAriaLabel('Row').click();
			});

			cy.getByDataTest('matrix-top-left-normal').click();

			cy.getParentContainer('Gap').within(() => {
				cy.get('input').type(100);

				// unlock gap
				cy.getByAriaLabel('Custom Row & Column Gap').click();
			});

			//
			// Asset group block CSS
			//
			cy.getBlock('core/group').should('have.css', 'row-gap', '100px');

			//
			// Assert child block to have valid property for gap
			//

			cy.getBlock('core/paragraph')
				.first()
				.should('have.css', 'margin-block-start', '0px')
				.should('not.have.css', 'flex-direction', 'column')
				.should('not.have.css', 'align-items', 'flex-start')
				.should('not.have.css', 'justify-content', 'flex-start');

			cy.getBlock('core/paragraph')
				.last()
				.should('have.css', 'margin-block-start', '0px')
				.should('not.have.css', 'flex-direction', 'column')
				.should('not.have.css', 'align-items', 'flex-start')
				.should('not.have.css', 'justify-content', 'flex-start');

			//Check frontend
			savePage();

			redirectToFrontPage();

			//
			// Asset group block CSS
			//
			cy.get('.wp-block-group.blockera-block').should(
				'have.css',
				'row-gap',
				'100px'
			);

			//
			// Assert child block to have valid property for gap
			//
			cy.get('.wp-block-group.blockera-block p')
				.first()
				.should('have.css', 'margin-block-start', '0px')
				.should('not.have.css', 'flex-direction', 'column')
				.should('not.have.css', 'align-items', 'flex-start')
				.should('not.have.css', 'justify-content', 'flex-start');

			cy.get('.wp-block-group.blockera-block p')
				.last()
				.should('have.css', 'margin-block-start', '0px')
				.should('not.have.css', 'flex-direction', 'column')
				.should('not.have.css', 'align-items', 'flex-start')
				.should('not.have.css', 'justify-content', 'flex-start');
		});
	});

	context('Variation: Stack', () => {
		it('Locked gap - the css property should be gap', () => {
			appendBlocks(
				`<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`
			);

			// Select target block
			cy.getBlock('core/paragraph').first().click();

			// Switch to parent block
			cy.getByAriaLabel('Select parent block: Group').click();

			// switch to style tab
			cy.getByDataTest('style-tab').click();

			cy.getParentContainer('Display').within(() => {
				cy.getByAriaLabel('Flex').click();
			});

			cy.getParentContainer('Flex Layout').within(() => {
				cy.getByAriaLabel('Column').click();
			});

			cy.getByDataTest('matrix-top-left-normal').click();

			cy.getParentContainer('Gap').within(() => {
				cy.get('input').type(100);
			});

			//
			// Asset group block CSS
			//
			cy.getBlock('core/group').should('have.css', 'gap', '100px');

			//
			// Assert child block to have valid property for gap
			//

			cy.getBlock('core/paragraph')
				.first()
				.should('have.css', 'margin-block-start', '0px')
				.should('not.have.css', 'flex-direction', 'column')
				.should('not.have.css', 'align-items', 'flex-start')
				.should('not.have.css', 'justify-content', 'flex-start');

			cy.getBlock('core/paragraph')
				.last()
				.should('have.css', 'margin-block-start', '0px')
				.should('not.have.css', 'flex-direction', 'column')
				.should('not.have.css', 'align-items', 'flex-start')
				.should('not.have.css', 'justify-content', 'flex-start');

			//Check frontend
			savePage();

			redirectToFrontPage();

			//
			// Asset group block CSS
			//
			cy.get('.wp-block-group.blockera-block').should(
				'have.css',
				'gap',
				'100px'
			);

			//
			// Assert child block to have valid property for gap
			//
			cy.get('.wp-block-group.blockera-block p')
				.first()
				.should('have.css', 'margin-block-start', '0px')
				.should('not.have.css', 'flex-direction', 'column')
				.should('not.have.css', 'align-items', 'flex-start')
				.should('not.have.css', 'justify-content', 'flex-start');

			cy.get('.wp-block-group.blockera-block p')
				.last()
				.should('have.css', 'margin-block-start', '0px')
				.should('not.have.css', 'flex-direction', 'column')
				.should('not.have.css', 'align-items', 'flex-start')
				.should('not.have.css', 'justify-content', 'flex-start');
		});

		it('Unlocked gap - the css property should be gap', () => {
			appendBlocks(
				`<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`
			);

			// Select target block
			cy.getBlock('core/paragraph').first().click();

			// Switch to parent block
			cy.getByAriaLabel('Select parent block: Group').click();

			// switch to style tab
			cy.getByDataTest('style-tab').click();

			cy.getParentContainer('Display').within(() => {
				cy.getByAriaLabel('Flex').click();
			});

			cy.getParentContainer('Flex Layout').within(() => {
				cy.getByAriaLabel('Column').click();
			});

			cy.getByDataTest('matrix-top-left-normal').click();

			cy.getParentContainer('Gap').within(() => {
				cy.get('input').type(100);

				// unlock gap
				cy.getByAriaLabel('Custom Row & Column Gap').click();
			});

			//
			// Asset group block CSS
			//
			cy.getBlock('core/group').should('have.css', 'row-gap', '100px');

			//
			// Assert child block to have valid property for gap
			//

			cy.getBlock('core/paragraph')
				.first()
				.should('have.css', 'margin-block-start', '0px')
				.should('not.have.css', 'flex-direction', 'column')
				.should('not.have.css', 'align-items', 'flex-start')
				.should('not.have.css', 'justify-content', 'flex-start');

			cy.getBlock('core/paragraph')
				.last()
				.should('have.css', 'margin-block-start', '0px')
				.should('not.have.css', 'flex-direction', 'column')
				.should('not.have.css', 'align-items', 'flex-start')
				.should('not.have.css', 'justify-content', 'flex-start');

			//Check frontend
			savePage();

			redirectToFrontPage();

			//
			// Asset group block CSS
			//
			cy.get('.wp-block-group.blockera-block').should(
				'have.css',
				'row-gap',
				'100px'
			);

			//
			// Assert child block to have valid property for gap
			//
			cy.get('.wp-block-group.blockera-block p')
				.first()
				.should('have.css', 'margin-block-start', '0px')
				.should('not.have.css', 'flex-direction', 'column')
				.should('not.have.css', 'align-items', 'flex-start')
				.should('not.have.css', 'justify-content', 'flex-start');

			cy.get('.wp-block-group.blockera-block p')
				.last()
				.should('have.css', 'margin-block-start', '0px')
				.should('not.have.css', 'flex-direction', 'column')
				.should('not.have.css', 'align-items', 'flex-start')
				.should('not.have.css', 'justify-content', 'flex-start');
		});
	});

	context('Variation: Grid', () => {
		it('Locked gap - the css property should be gap', () => {
			appendBlocks(
				`<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`
			);

			// Select target block
			cy.getBlock('core/paragraph').first().click();

			// Switch to parent block
			cy.getByAriaLabel('Select parent block: Group').click();

			// switch to style tab
			cy.getByDataTest('style-tab').click();

			cy.getParentContainer('Display').within(() => {
				cy.getByAriaLabel('Grid').click();
			});

			cy.getParentContainer('Gap').within(() => {
				cy.get('input').type(100);
			});

			//
			// Asset group block CSS
			//
			cy.getBlock('core/group').should('have.css', 'gap', '100px');

			//
			// Assert child block to have valid property for gap
			//

			cy.getBlock('core/paragraph')
				.first()
				.should('have.css', 'margin-block-start', '0px');

			cy.getBlock('core/paragraph')
				.last()
				.should('have.css', 'margin-block-start', '0px');

			//Check frontend
			savePage();

			redirectToFrontPage();

			//
			// Asset group block CSS
			//
			cy.get('.wp-block-group.blockera-block').should(
				'have.css',
				'gap',
				'100px'
			);

			//
			// Assert child block to have valid property for gap
			//
			cy.get('.wp-block-group.blockera-block p')
				.last()
				.should('have.css', 'margin-block-start', '0px');
		});

		it('Unlocked gap - the css property should be gap', () => {
			appendBlocks(
				`<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`
			);

			// Select target block
			cy.getBlock('core/paragraph').first().click();

			// Switch to parent block
			cy.getByAriaLabel('Select parent block: Group').click();

			// switch to style tab
			cy.getByDataTest('style-tab').click();

			cy.getParentContainer('Display').within(() => {
				cy.getByAriaLabel('Grid').click();
			});

			cy.getParentContainer('Gap').within(() => {
				cy.get('input').type(100);

				// unlock gap
				cy.getByAriaLabel('Custom Row & Column Gap').click();
			});

			//
			// Asset group block CSS
			//
			cy.getBlock('core/group').should('have.css', 'row-gap', '100px');

			//
			// Assert child block to have valid property for gap
			//

			cy.getBlock('core/paragraph')
				.first()
				.should('have.css', 'margin-block-start', '0px');

			cy.getBlock('core/paragraph')
				.last()
				.should('have.css', 'margin-block-start', '0px');

			//Check frontend
			savePage();

			redirectToFrontPage();

			//
			// Asset group block CSS
			//
			cy.get('.wp-block-group.blockera-block').should(
				'have.css',
				'row-gap',
				'100px'
			);

			//
			// Assert child block to have valid property for gap
			//
			cy.get('.wp-block-group.blockera-block p')
				.last()
				.should('have.css', 'margin-block-start', '0px');
		});
	});
});
