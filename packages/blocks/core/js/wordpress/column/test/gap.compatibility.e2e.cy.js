import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
	appendBlocks,
} from '@blockera/dev-cypress/js/helpers';

describe('Single Column Block → Gap → Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	it('Simple value', () => {
		appendBlocks(`<!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"var:preset|spacing|10","left":"var:preset|spacing|10"},"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}},"color":{"background":"#ff8787"}}} -->
<div class="wp-block-columns has-background" style="background-color:#ff8787;padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)"><!-- wp:column {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"},"blockGap":"30px"},"color":{"background":"#ffb2b2"}}} -->
<div class="wp-block-column has-background" style="background-color:#ffb2b2;padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)"><!-- wp:paragraph {"style":{"color":{"background":"#ffd8d8"}}} -->
<p class="has-background" style="background-color:#ffd8d8">paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"color":{"background":"#ffd8d8"}}} -->
<p class="has-background" style="background-color:#ffd8d8">Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->
					`);

		cy.getBlock('core/paragraph').first().click();

		cy.getByAriaLabel('Select parent block: Column').click();

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
