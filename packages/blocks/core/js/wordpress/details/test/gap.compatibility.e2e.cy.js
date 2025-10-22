import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
	appendBlocks,
} from '@blockera/dev-cypress/js/helpers';

describe('Details Block → Gap → Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	it('Simple value', () => {
		appendBlocks(`<!-- wp:details {"style":{"spacing":{"blockGap":"30px"}}} -->
<details class="wp-block-details"><summary>detail title</summary><!-- wp:paragraph {"placeholder":"Type / to add a hidden block"} -->
<p>detail content</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->
					`);

		cy.getBlock('core/details').first().click();

		// cy.getByAriaLabel('Select parent block: Quote').click();

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
