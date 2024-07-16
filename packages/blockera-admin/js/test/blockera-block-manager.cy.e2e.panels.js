import {
	createPost,
	goTo,
} from '@blockera/dev-cypress/js/helpers/site-navigation';
import {
	appendBlocks,
	getBlockeraEntity,
	getWPDataObject,
	getBlockInserter,
} from '@blockera/dev-cypress/js/helpers/editor';
import { resetPanelSettings } from '@blockera/dev-cypress/js/helpers';

describe('Block Manager Settings Testing ...', () => {
	beforeEach(() => {
		goTo('/wp-admin/admin.php?page=blockera-settings-block-manager');
	});

	it('blockera should not support core/paragraph of WordPress core block', () => {
		cy.get('.blockera-settings-active-panel').should('be.visible');

		resetPanelSettings(false);

		cy.getByDataTest('item-core_paragraph').within(() => {
			cy.get('input').click();

			cy.get('input').should('not.be.checked');
		});

		cy.getByDataTest('update-settings').as('update');

		cy.get('@update').then(() => {
			cy.get('@update').click();
			cy.wait(2000);

			createPost();

			appendBlocks(`<!-- wp:paragraph /-->`);

			cy.getBlock('core/paragraph').click();

			cy.getByAriaLabel('Add New Background').should('not.exist');

			// open inserter panel
			getBlockInserter().click();

			// should not show blockera block icon on paragraph block
			cy.get('.editor-block-list-item-paragraph').should('be.visible');
			cy.get('.editor-block-list-item-paragraph').within(() => {
				cy.get('.blockera-block-icon').should('not.exist');
			});
		});
	});

	// this test needs the prev test because it was disabled the block
	// and we want to make sure reactivation is work
	it('blockera should support core/paragraph of WordPress core block', () => {
		cy.get('.blockera-settings-active-panel').should('be.visible');

		cy.getByDataTest('item-core_paragraph').within(() => {
			cy.get('input').click();

			cy.get('input').should('be.checked');
		});

		cy.getByDataTest('update-settings').as('update');

		cy.get('@update').then(() => {
			cy.get('@update').click();
			cy.wait(2000);

			createPost();

			appendBlocks(`<!-- wp:paragraph /-->`);

			cy.getBlock('core/paragraph').click();

			cy.getByAriaLabel('Add New Background');

			// open inserter panel
			getBlockInserter().click();

			// should show blockera block icon on paragraph block
			cy.get('.editor-block-list-item-paragraph').should('be.visible');
			cy.get('.editor-block-list-item-paragraph').within(() => {
				cy.get('.blockera-block-icon').should('be.visible');
			});
		});
	});

	const textBlocksCode = `
<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading"></h2>
<!-- /wp:heading -->

<!-- wp:code -->
<pre class="wp-block-code"><code></code></pre>
<!-- /wp:code -->

<!-- wp:details -->
<details class="wp-block-details"><summary></summary><!-- wp:paragraph {"placeholder":"Type / to add a hidden block"} -->
<p></p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted"></pre>
<!-- /wp:preformatted -->

<!-- wp:pullquote -->
<figure class="wp-block-pullquote"><blockquote><p></p></blockquote></figure>
<!-- /wp:pullquote -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph --></blockquote>
<!-- /wp:quote -->

<!-- wp:table /-->

<!-- wp:verse -->
<pre class="wp-block-verse"></pre>
<!-- /wp:verse -->`;

	it('blockera should not support all WordPress core blocks inside Text category', () => {
		cy.get('.blockera-settings-active-panel').should('be.visible');

		resetPanelSettings(false);

		cy.getByDataTest('text-category=disable').click();

		cy.getByDataTest('update-settings').as('update');

		cy.get('@update').then(() => {
			cy.get('@update').click();
			cy.wait(2000);

			createPost();

			appendBlocks(textBlocksCode);

			cy.getBlock('core/details').click();
			cy.getByAriaLabel('Add New Background').should('not.exist');

			cy.getBlock('core/code').click();
			cy.getByAriaLabel('Add New Background').should('not.exist');

			cy.getBlock('core/heading').click();
			cy.getByAriaLabel('Add New Background').should('not.exist');

			cy.getBlock('core/list').click();
			cy.getByAriaLabel('Add New Background').should('not.exist');

			cy.getBlock('core/list-item').click();
			cy.getByAriaLabel('Add New Background').should('not.exist');

			cy.getBlock('core/paragraph').click();
			cy.getByAriaLabel('Add New Background').should('not.exist');

			cy.getBlock('core/preformatted').click();
			cy.getByAriaLabel('Add New Background').should('not.exist');

			cy.getBlock('core/pullquote').click();
			cy.getByAriaLabel('Add New Background').should('not.exist');

			cy.getBlock('core/quote').click();
			cy.getByAriaLabel('Add New Background').should('not.exist');

			cy.getBlock('core/table').click();
			cy.getByAriaLabel('Add New Background').should('not.exist');

			cy.getBlock('core/verse').click();
			cy.getByAriaLabel('Add New Background').should('not.exist');
		});
	});

	// this test needs the prev test because it was disabled text category
	// and we want to make sure reactivation is work
	it('blockera should support all WordPress core blocks inside Text category', () => {
		cy.get('.blockera-settings-active-panel').should('be.visible');

		resetPanelSettings(false);

		cy.getByDataTest('text-category=enable').click();

		cy.getByDataTest('update-settings').as('update');

		cy.get('@update').then(() => {
			cy.get('@update').click();
			cy.wait(2000);

			createPost();

			appendBlocks(textBlocksCode);

			cy.getBlock('core/details').click();
			cy.getByAriaLabel('Add New Background');

			cy.getBlock('core/code').click();
			cy.getByAriaLabel('Add New Background');

			cy.getBlock('core/heading').click();
			cy.getByAriaLabel('Add New Background');

			cy.getBlock('core/list').click();
			cy.getByAriaLabel('Add New Background');

			cy.getBlock('core/list-item').click();
			cy.getByAriaLabel('Add New Background');

			cy.getBlock('core/paragraph').click();
			cy.getByAriaLabel('Add New Background');

			cy.getBlock('core/preformatted').click();
			cy.getByAriaLabel('Add New Background');

			cy.getBlock('core/pullquote').click();
			cy.getByAriaLabel('Add New Background');

			cy.getBlock('core/quote').click();
			cy.getByAriaLabel('Add New Background');

			cy.getBlock('core/table').click();
			cy.getByAriaLabel('Add New Background');

			cy.getBlock('core/verse').click();
			cy.getByAriaLabel('Add New Background');
		});
	});
});
