/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	assertBlockData,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

const COLUMN_STACK_GROUP = `<!-- wp:group {"layout":{"type":"flex","orientation":"vertical","justifyContent":"right","verticalAlignment":"top"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>test 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>test 2</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>test 3</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`;

const ROW_GROUP = `<!-- wp:group {"layout":{"type":"flex","orientation":"horizontal","justifyContent":"left","verticalAlignment":"center"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>test 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>test 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`;

function openStackGroupInBlockera() {
	appendBlocks(COLUMN_STACK_GROUP);

	cy.getBlock('core/paragraph').first().click();
	cy.getByAriaLabel('Select Stack').click();
	cy.addNewTransition();
}

function openRowGroupInBlockera() {
	appendBlocks(ROW_GROUP);

	cy.getBlock('core/paragraph').first().click();
	cy.getByAriaLabel('Select Row').click();
	cy.addNewTransition();
}

function assertWpLayout(data, expected) {
	const layout = getSelectedBlock(data, 'layout');

	expect('flex').to.equal(layout?.type);
	expect(expected.orientation).to.equal(layout?.orientation);
	expect(expected.verticalAlignment).to.equal(layout?.verticalAlignment);
	expect(expected.justifyContent).to.equal(layout?.justifyContent);
}

function assertBlockeraFlexLayout(data, expected) {
	expect(expected).to.deep.equal(
		getSelectedBlock(data, 'blockeraFlexLayout')
	);
}

describe('Flex Layout → WP Data Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	it('imports column flex layout from WP (screen axes → swapped CSS props)', () => {
		openStackGroupInBlockera();

		assertBlockData((data) => {
			assertWpLayout(data, {
				orientation: 'vertical',
				verticalAlignment: 'top',
				justifyContent: 'right',
			});

			// WP vertical → justifyContent; WP horizontal → alignItems in column.
			assertBlockeraFlexLayout(data, {
				direction: 'column',
				alignItems: 'flex-end',
				justifyContent: 'flex-start',
			});
		});
	});

	it('imports row flex layout from WP (screen axes → direct CSS props)', () => {
		openRowGroupInBlockera();

		assertBlockData((data) => {
			assertWpLayout(data, {
				orientation: 'horizontal',
				verticalAlignment: 'center',
				justifyContent: 'left',
			});

			assertBlockeraFlexLayout(data, {
				direction: 'row',
				alignItems: 'center',
				justifyContent: 'flex-start',
			});
		});
	});

	it('toggling row ↔ column remaps Blockera props but preserves WP screen intent', () => {
		openStackGroupInBlockera();

		cy.getParentContainer('Flex Layout').within(() => {
			cy.getByAriaLabel('flex-direction: row').click();
		});

		assertBlockData((data) => {
			assertWpLayout(data, {
				orientation: 'horizontal',
				verticalAlignment: 'top',
				justifyContent: 'right',
			});

			assertBlockeraFlexLayout(data, {
				direction: 'row',
				alignItems: 'flex-start',
				justifyContent: 'flex-end',
			});
		});

		cy.getParentContainer('Flex Layout').within(() => {
			cy.getByAriaLabel('flex-direction: column').click();
		});

		assertBlockData((data) => {
			assertWpLayout(data, {
				orientation: 'vertical',
				verticalAlignment: 'top',
				justifyContent: 'right',
			});

			assertBlockeraFlexLayout(data, {
				direction: 'column',
				alignItems: 'flex-end',
				justifyContent: 'flex-start',
			});
		});
	});

	it('matrix center-left in row syncs WP verticalAlignment and justifyContent', () => {
		openStackGroupInBlockera();

		cy.getParentContainer('Flex Layout').within(() => {
			cy.getByAriaLabel('flex-direction: row').click();
		});

		cy.getParentContainer('Flex Layout').within(() => {
			cy.getByDataTest('matrix-center-left-normal').click();
		});

		assertBlockData((data) => {
			assertWpLayout(data, {
				orientation: 'horizontal',
				verticalAlignment: 'center',
				justifyContent: 'left',
			});

			assertBlockeraFlexLayout(data, {
				direction: 'row',
				alignItems: 'center',
				justifyContent: 'flex-start',
			});
		});
	});

	it('matrix center-left in column syncs WP screen axes with swapped Blockera props', () => {
		openStackGroupInBlockera();

		cy.getParentContainer('Flex Layout').within(() => {
			cy.getByDataTest('matrix-center-left-normal').click();
		});

		assertBlockData((data) => {
			assertWpLayout(data, {
				orientation: 'vertical',
				verticalAlignment: 'center',
				justifyContent: 'left',
			});

			assertBlockeraFlexLayout(data, {
				direction: 'column',
				alignItems: 'flex-start',
				justifyContent: 'center',
			});
		});
	});

	it('reset clears WP alignment fields and Blockera flex layout values', () => {
		openStackGroupInBlockera();

		cy.getByAriaLabel('Flex Layout').click();
		cy.getByAriaLabel('Reset To Default Setting').click();

		assertBlockData((data) => {
			assertWpLayout(data, {
				orientation: 'horizontal',
				verticalAlignment: undefined,
				justifyContent: undefined,
			});

			assertBlockeraFlexLayout(data, {
				direction: 'row',
				alignItems: '',
				justifyContent: '',
			});
		});
	});
});
