import {
	createPost,
	goTo,
} from '@blockera/dev-cypress/js/helpers/site-navigation';
import {
	appendBlocks,
	getBlockeraEntity,
	getWPDataObject,
} from '@blockera/dev-cypress/js/helpers/editor';

describe('Block Manager Settings Testing ...', () => {
	beforeEach(() => {
		goTo('/wp-admin/admin.php?page=blockera-settings-block-manager');
	});

	it('blockera should not support core/paragraph of WordPress core block', () => {
		cy.window()
			.its('blockeraSettings')
			.then(({ disabledBlocks }) => {
				if (disabledBlocks.length) {
					cy.getByDataTest('reset-settings').click();

					cy.wait(1000);
				}

				cy.getByDataTest('togglecore_paragraph').click();

				cy.getByDataTest('update-settings').as('update');

				cy.get('@update').then(() => {
					cy.get('@update').click();
					cy.wait(2000);

					createPost();

					appendBlocks(`<!-- wp:paragraph /-->`);

					cy.getBlock('core/paragraph').click();

					cy.getByAriaLabel('Add New Background').should('not.exist');
				});
			});
	});

	it('blockera should support core/paragraph of WordPress core block', () => {
		cy.window()
			.its('blockeraSettings')
			.then(({ disabledBlocks }) => {
				if (disabledBlocks.length) {
					cy.getByDataTest('reset-settings').click();

					cy.wait(1000);
				}

				createPost();

				appendBlocks(`<!-- wp:paragraph /-->`);

				cy.getBlock('core/paragraph').click();

				cy.getByAriaLabel('Add New Background');
			});
	});

	const textBlocksCode =
		'<!-- wp:paragraph -->\n' +
		'<p></p>\n' +
		'<!-- /wp:paragraph -->\n' +
		'\n' +
		'<!-- wp:heading -->\n' +
		'<h2 class="wp-block-heading"></h2>\n' +
		'<!-- /wp:heading -->\n' +
		'\n' +
		'<!-- wp:code -->\n' +
		'<pre class="wp-block-code"><code></code></pre>\n' +
		'<!-- /wp:code -->\n' +
		'\n' +
		'<!-- wp:details -->\n' +
		'<details class="wp-block-details"><summary></summary><!-- wp:paragraph {"placeholder":"Type / to add a hidden block"} -->\n' +
		'<p></p>\n' +
		'<!-- /wp:paragraph --></details>\n' +
		'<!-- /wp:details -->\n' +
		'\n' +
		'<!-- wp:list -->\n' +
		'<ul><!-- wp:list-item -->\n' +
		'<li></li>\n' +
		'<!-- /wp:list-item --></ul>\n' +
		'<!-- /wp:list -->\n' +
		'\n' +
		'<!-- wp:preformatted -->\n' +
		'<pre class="wp-block-preformatted"></pre>\n' +
		'<!-- /wp:preformatted -->\n' +
		'\n' +
		'<!-- wp:pullquote -->\n' +
		'<figure class="wp-block-pullquote"><blockquote><p></p></blockquote></figure>\n' +
		'<!-- /wp:pullquote -->\n' +
		'\n' +
		'<!-- wp:quote -->\n' +
		'<blockquote class="wp-block-quote"><!-- wp:paragraph -->\n' +
		'<p></p>\n' +
		'<!-- /wp:paragraph --></blockquote>\n' +
		'<!-- /wp:quote -->\n' +
		'\n' +
		'<!-- wp:table /-->\n' +
		'\n' +
		'<!-- wp:verse -->\n' +
		'<pre class="wp-block-verse"></pre>\n' +
		'<!-- /wp:verse -->';

	it('blockera should not support all WordPress core blocks inside Text category', () => {
		cy.window()
			.its('blockeraSettings')
			.then(({ disabledBlocks }) => {
				if (disabledBlocks.length) {
					cy.getByDataTest('reset-settings').click();

					cy.wait(1000);
				}

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
	});

	it('blockera should support all WordPress core blocks inside Text category', () => {
		cy.window()
			.its('blockeraSettings')
			.then(({ disabledBlocks }) => {
				if (disabledBlocks.length) {
					cy.getByDataTest('reset-settings').click();

					cy.wait(1000);
				}

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
