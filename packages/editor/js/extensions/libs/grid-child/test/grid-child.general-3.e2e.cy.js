import {
	createPost,
	appendBlocks,
	setDeviceType,
	setInnerBlock,
	setParentBlock,
	savePage,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Front: Blockera merges rules in `style#blockera-inline-css`. Include
 * `sheet.cssRules[].cssText` so long rules remain visible (same as grid.general-2).
 */
function assertFrontendPageStylesInclude(fragment) {
	cy.get('style#blockera-inline-css', { timeout: 30000 }).should(($style) => {
		let blob = $style.text() || '';
		const el = $style[0];
		const sheet = el.sheet;
		if (sheet && sheet.cssRules) {
			try {
				const { cssRules } = sheet;
				const n = cssRules.length;
				for (let j = 0; j < n; j++) {
					blob += cssRules[j].cssText;
					blob += '\n';
				}
			} catch {
				// ignore
			}
		}
		expect(
			blob,
			`expected fragment in #blockera-inline-css: ${fragment}`
		).to.include(fragment);
	});
}

/** Block card can cover fixed inspector inputs; matches grid-child.compatibility e2e. */
function fillGridChildNumberInput(dataTest, value) {
	cy.getByDataTest(dataTest).scrollIntoView();
	cy.getByDataTest(dataTest).clear({ force: true });
	cy.getByDataTest(dataTest).type(String(value), { force: true });
	cy.getByDataTest(dataTest).blur({ force: true });
}

describe('Grid Child', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Is not child of a grid container', () => {
		beforeEach(() => {
			const code = `<!-- wp:paragraph -->
<p>This is a test text.</p>
<!-- /wp:paragraph -->`;

			appendBlocks(code);

			cy.getBlock('core/paragraph').click();
			cy.getByAriaControls('styles-view').click();
		});

		it('should not show Grid Child when parent display is not grid', () => {
			cy.contains('Grid Child').should('not.exist');
		});
	});

	describe('Is child of a grid container', () => {
		beforeEach(() => {
			const code = `<!-- wp:group {"metadata":{"name":"Grid Container"},"blockeraPropsId":"4f915dbf-73b0-49a8-9409-b81a5c55aedd","blockeraCompatId":"928123345376","blockeraDisplay":{"value":"grid"},"className":"blockera-block blockera-block-gridtest","layout":{"type":"grid"}} -->
<div class="wp-block-group blockera-block blockera-block-gridtest"><!-- wp:paragraph {"blockeraPropsId":"9d3e3db6-a502-4fed-8392-1dcd0ad8a28e","blockeraCompatId":"927125625524","className":"blockera-block blockera-block-94ppky"} -->
<p class="blockera-block blockera-block-94ppky">test paragraph in grid...</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`;

			appendBlocks(code);

			cy.getBlock('core/paragraph').click();
			cy.getByAriaControls('styles-view').click();
		});

		it('should show Grid Child for blocks inside a grid parent', () => {
			cy.getBlock('core/group').click();
			cy.getByAriaControls('styles-view').click();
			cy.contains('Grid Child').should('not.exist');

			// Wait for the block to be updated
			cy.wait(200);

			cy.getBlock('core/paragraph').click();
			cy.getByAriaControls('styles-view').click();
			cy.contains('Grid Child').should('exist');

			// Wait for the block to be updated
			cy.wait(200);

			setDeviceType('Mobile Portrait');
			cy.getBlock('core/group').click();
			cy.getParentContainer('Display').within(() => {
				cy.getByAriaLabel('Block').click();
			});

			// Wait for the block to be updated
			cy.wait(200);

			cy.getBlock('core/paragraph').click();
			cy.getByAriaControls('styles-view').click();
			cy.contains('Grid Child').should('not.exist');

			// Wait for the block to be updated
			cy.wait(200);

			setDeviceType('Desktop');

			// Switch blocks multiple times to make sure the grid child block section is not lost
			cy.getBlock('core/group').click();
			cy.getBlock('core/paragraph').click();
			cy.getBlock('core/group').click();

			// Wait for the block to be updated
			cy.wait(200);

			cy.getBlock('core/paragraph').click();
			cy.getByAriaControls('styles-view').click();
			cy.contains('Grid Child').should('exist');
		});

		it('should show Grid Child for rich-text inner block when parent stays grid', () => {
			cy.contains('Grid Child').should('exist');

			cy.getParentContainer('Display').within(() => {
				cy.getByAriaLabel('Grid').click();
			});

			setInnerBlock('elements/bold');
			cy.contains('Grid Child').should('exist');

			setParentBlock();
			cy.getParentContainer('Display').within(() => {
				cy.getByAriaLabel('Block').click();
			});

			// Wait for the block to be updated
			cy.wait(200);

			setInnerBlock('elements/bold');
			cy.contains('Grid Child').should('not.exist');
		});

		it('should set column span via control', () => {
			cy.contains('Grid Child').should('exist');
			fillGridChildNumberInput('grid-child-column-span', 2);
			cy.getByDataTest('grid-child-column-span').should(
				'have.value',
				'2'
			);
		});

		it('should output grid child span CSS on the front end after save', () => {
			cy.contains('Grid Child').should('exist');

			fillGridChildNumberInput('grid-child-column-span', 2);
			fillGridChildNumberInput('grid-child-row-span', 3);

			savePage();
			redirectToFrontPage();

			assertFrontendPageStylesInclude('grid-column: span 2');
			assertFrontendPageStylesInclude('grid-row: span 3');

			cy.get('p.blockera-block-94ppky')
				.should('be.visible')
				.invoke('css', 'grid-column')
				.should('match', /span\s+2/);

			cy.get('p.blockera-block-94ppky')
				.invoke('css', 'grid-row')
				.should('match', /span\s+3/);
		});
	});
});
