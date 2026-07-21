import {
	createPost,
	appendBlocks,
	getWPDataObject,
} from '@blockera/dev-cypress/js/helpers';

/** Scroll + force: block card can cover fixed inspector inputs (matches width.compatibility e2e). */
function setGridChildNumberInput(dataTest, value) {
	cy.getByDataTest(dataTest).scrollIntoView();
	cy.getByDataTest(dataTest).clear({ force: true });
	cy.getByDataTest(dataTest).type(String(value), { force: true });
	cy.getByDataTest(dataTest).blur({ force: true });
}

function clearGridChildNumberInput(dataTest) {
	cy.getByDataTest(dataTest).scrollIntoView();
	cy.getByDataTest(dataTest).clear({ force: true });
	cy.getByDataTest(dataTest).blur({ force: true });
}

const columnSpanHydrateMarkup = `<!-- wp:group {"metadata":{"name":"Grid Container"},"blockeraPropsId":"5f915dbf-73b0-49a8-9409-b81a5c55aee0","blockeraCompatId":"938123345376","blockeraDisplay":{"value":"grid"},"className":"blockera-block blockera-block-gridhydrate","layout":{"type":"grid"}} -->
<div class="wp-block-group blockera-block blockera-block-gridhydrate"><!-- wp:paragraph {"blockeraPropsId":"ad3e3db6-a502-4fed-8392-1dcd0ad8a28f","blockeraCompatId":"937125625525","className":"blockera-block blockera-block-hydratep","style":{"layout":{"columnSpan":4}}} -->
<p class="blockera-block blockera-block-hydratep">hydrate column span</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`;

const rowSpanHydrateMarkup = `<!-- wp:group {"metadata":{"name":"Grid Container"},"blockeraPropsId":"6f915dbf-73b0-49a8-9409-b81a5c55aee1","blockeraDisplay":{"value":"grid"},"className":"blockera-block blockera-block-gridrowh","layout":{"type":"grid"}} -->
<div class="wp-block-group blockera-block blockera-block-gridrowh"><!-- wp:paragraph {"blockeraPropsId":"bd3e3db6-a502-4fed-8392-1dcd0ad8a290","className":"blockera-block blockera-block-hydrater","style":{"layout":{"rowSpan":3}}} -->
<p class="blockera-block blockera-block-hydrater">hydrate row span</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`;

describe('Compatibility: Grid Child ↔ WordPress style.layout', () => {
	beforeEach(() => {
		createPost();
	});

	it('column span: hydrate from core, sync to core, then clear both', () => {
		appendBlocks(columnSpanHydrateMarkup);

		cy.getBlock('core/paragraph').click();
		cy.getByAriaControls('styles-view').click();
		cy.contains('Grid Child').should('exist');

		//
		// Test 1: WP data → Blockera
		//

		cy.getByDataTest('grid-child-column-span')
			.scrollIntoView()
			.should('have.value', '4');

		// Core store keeps `style.layout` from pasted markup. Blockera hydrates
		// controls via `blockera.blockEdit.attributes` filter — that does not
		// persist `blockeraGridChild*` into `core/block-editor` until the user edits.
		getWPDataObject().then((data) => {
			const block = data.select('core/block-editor').getSelectedBlock();
			expect(block.attributes.style?.layout?.columnSpan).to.equal(4);
		});

		//
		// Test 2: Blockera → WP data
		//

		setGridChildNumberInput('grid-child-column-span', 3);

		getWPDataObject().then((data) => {
			const block = data.select('core/block-editor').getSelectedBlock();
			expect(block.attributes.style?.layout?.columnSpan).to.equal(3);
			expect(
				block.attributes.blockeraGridChildColumnSpan?.value
			).to.equal(3);
		});

		//
		// Test 3: Clear Blockera control; WP layout key removed too
		//

		clearGridChildNumberInput('grid-child-column-span');

		cy.getByDataTest('grid-child-column-span').should('have.value', '');

		getWPDataObject().then((data) => {
			const block = data.select('core/block-editor').getSelectedBlock();
			expect(block.attributes.style?.layout?.columnSpan).to.equal(
				undefined
			);
			expect(
				block.attributes.blockeraGridChildColumnSpan?.value ?? ''
			).to.equal('');
		});
	});

	it('row span: hydrate from core, sync to core, then clear both', () => {
		appendBlocks(rowSpanHydrateMarkup);

		cy.getBlock('core/paragraph').click();
		cy.getByAriaControls('styles-view').click();
		cy.contains('Grid Child').should('exist');

		//
		// Test 1: WP data → Blockera
		//

		cy.getByDataTest('grid-child-row-span')
			.scrollIntoView()
			.should('have.value', '3');

		getWPDataObject().then((data) => {
			const block = data.select('core/block-editor').getSelectedBlock();
			expect(block.attributes.style?.layout?.rowSpan).to.equal(3);
		});

		//
		// Test 2: Blockera → WP data
		//

		setGridChildNumberInput('grid-child-row-span', 2);

		getWPDataObject().then((data) => {
			const block = data.select('core/block-editor').getSelectedBlock();
			expect(block.attributes.style?.layout?.rowSpan).to.equal(2);
			expect(block.attributes.blockeraGridChildRowSpan?.value).to.equal(
				2
			);
		});

		//
		// Test 3: Clear Blockera control; WP layout key removed too
		//

		clearGridChildNumberInput('grid-child-row-span');

		cy.getByDataTest('grid-child-row-span').should('have.value', '');

		getWPDataObject().then((data) => {
			const block = data.select('core/block-editor').getSelectedBlock();
			expect(block.attributes.style?.layout?.rowSpan).to.equal(undefined);
			expect(
				block.attributes.blockeraGridChildRowSpan?.value ?? ''
			).to.equal('');
		});
	});
});
