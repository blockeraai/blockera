import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
	appendBlocks,
} from '@blockera/dev-cypress/js/helpers';

describe('Post Template Block → Gap → Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	it('Simple value', () => {
		appendBlocks(`<!-- wp:query {"queryId":48,"query":{"perPage":3,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false}} -->
<div class="wp-block-query"><!-- wp:post-template {"style":{"spacing":{"blockGap":"30px"}},"layout":{"type":"default","columnCount":3}} -->
<!-- wp:separator {"opacity":"css","className":"alignwide is-style-wide","style":{"color":{"background":"#ffffff"}}} -->
<hr class="wp-block-separator has-text-color has-css-opacity has-background alignwide is-style-wide" style="background-color:#ffffff;color:#ffffff"/>
<!-- /wp:separator -->

<!-- wp:columns {"verticalAlignment":"center","align":"wide"} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center"><!-- wp:column {"verticalAlignment":"center","width":"20%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:20%"><!-- wp:post-date {"style":{"color":{"text":"#ffffff"}},"fontSize":"extra-small"} /--></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"80%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:80%"><!-- wp:post-title {"isLink":true,"style":{"typography":{"fontSize":"20px","lineHeight":"0.6"},"color":{"text":"#ffffff","link":"#ffffff"}}} /--></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->
<!-- /wp:post-template -->

<!-- wp:query-pagination -->
<!-- wp:query-pagination-previous /-->

<!-- wp:query-pagination-numbers /-->

<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination --></div>
<!-- /wp:query -->
					`);

		// Select target block
		cy.getBlock('core/post-template').click({ force: true });

		cy.get('button[aria-label="Post Template"]').click();

		//
		// Test 1: WP data to Blockera
		//

		getWPDataObject().then((data) => {
			expect('30px').to.be.equal(
				getSelectedBlock(data, 'style')?.spacing?.blockGap
			);

			expect({
				lock: true,
				gap: '30px',
				columns: '',
				rows: '',
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
		});

		//
		// Test 2: Blockera value to WP data
		//

		//
		// Simple locked value
		//
		cy.getParentContainer('Gap').within(() => {
			cy.get('input').clear();
			cy.get('input').type(10, { force: true });
		});

		getWPDataObject().then((data) => {
			expect('10px').to.be.equal(
				getSelectedBlock(data, 'style')?.spacing?.blockGap
			);

			expect({
				lock: true,
				gap: '10px',
				columns: '',
				rows: '',
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
		});

		//
		// Unlocked value
		//
		cy.getParentContainer('Gap').within(() => {
			cy.getByAriaLabel('Custom Row & Column Gap').click();
		});

		cy.getParentContainer('Rows').within(() => {
			cy.get('input').clear();
			cy.get('input').type(50, { force: true });
		});

		cy.getParentContainer('Columns').within(() => {
			cy.get('input').clear();
			cy.get('input').type(100, { force: true });
		});

		getWPDataObject().then((data) => {
			expect('50px').to.be.equal(
				getSelectedBlock(data, 'style')?.spacing?.blockGap
			);

			expect({
				lock: false,
				gap: '10px',
				columns: '100px',
				rows: '50px',
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
		});

		//
		// Unlocked value and empty
		//
		cy.getParentContainer('Rows').within(() => {
			cy.get('input').clear();
		});

		getWPDataObject().then((data) => {
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'style')?.spacing?.blockGap
			);

			expect({
				lock: false,
				gap: '10px',
				columns: '100px',
				rows: '',
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
		});

		//
		// lock again value
		//
		cy.getParentContainer('Gap').within(() => {
			cy.getByAriaLabel('Custom Row & Column Gap').click();

			cy.get('input').clear();
			cy.get('input').type(30, { force: true });
		});

		getWPDataObject().then((data) => {
			expect('30px').to.be.equal(
				getSelectedBlock(data, 'style')?.spacing?.blockGap
			);

			expect({
				lock: true,
				gap: '30px',
				columns: '',
				rows: '',
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
		});

		//
		// Test 3: Clear Blockera value and check WP data
		//

		// clear
		cy.getParentContainer('Gap').within(() => {
			cy.get('input').clear({ force: true });
		});

		getWPDataObject().then((data) => {
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'style')?.spacing?.blockGap
			);

			expect({
				lock: true,
				gap: '',
				columns: '',
				rows: '',
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraGap'));
		});
	});
});
