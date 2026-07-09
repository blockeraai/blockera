import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
	appendBlocks,
} from '@blockera/dev-cypress/js/helpers';

describe('Quote Block → Gap → Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	it('Simple value', () => {
		appendBlocks(`<!-- wp:cover {"url":"https://placehold.co/600x400","id":58,"dimRatio":50,"customOverlayColor":"#a49893","isDark":false,"style":{"spacing":{"blockGap":"30px"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-cover is-light"><span aria-hidden="true" class="wp-block-cover__background has-background-dim" style="background-color:#a49893"></span><img class="wp-block-cover__image-background wp-image-58" alt="" src="https://placehold.co/600x400" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:paragraph {"align":"center","placeholder":"Write title…","fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size">test paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>test paragraph 2</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:cover -->
					`);

		cy.getBlock('core/paragraph').first().click();

		cy.getByAriaLabel('Select parent block: Cover').click();

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
