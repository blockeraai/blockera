import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
	setDeviceType,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Computed grid-template-columns is resolved to track sizes (e.g. "195px 195px"),
 * not the authored repeat() / rem values from the style engine.
 */
function expectResolvedGridTrackCount(computedTemplateColumns, expected) {
	const parts = computedTemplateColumns.trim().split(/\s+/).filter(Boolean);

	expect(parts.length, computedTemplateColumns).to.equal(expected);
}

function getMobileBreakpointGridColumnCount(data) {
	const bs = getSelectedBlock(data, 'blockeraBlockStates');
	const raw =
		bs?.normal?.breakpoints?.mobile?.attributes?.blockeraGridColumnCount;

	return raw?.value ?? raw;
}

/**
 * Blockera Style / List tabs live in the block inspector. If the settings
 * sidebar is closed or on the Post tab, `[data-test="style-tab"]` never appears.
 * (`cy.openDocumentSettingsSidebar` is from @10up/cypress-wp-utils in e2e support.)
 */
function selectCanvasParagraphOpenBlockTabAndStyleTab() {
	cy.getIframeBody()
		.find('[data-type="core/paragraph"]')
		.first()
		.click({ force: true });

	cy.openDocumentSettingsSidebar('Block');
}

/** Editor iframe: `#blockera-styles-wrapper` (dev-cypress `getBlockeraStylesWrapper`). */
function assertEditorBlockeraStylesInclude(fragment) {
	cy.getBlockeraStylesWrapper().invoke('text').should('include', fragment);
}

/**
 * Front: Blockera prints merged rules in `style#blockera-inline-css` (see
 * `EditorAssetsProvider::printBlockeraGeneratedStyles`). Match `height.e2e.cy.js`.
 * Include `sheet.cssRules[].cssText` so parsed `@media` / long rules are visible to the assert.
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

describe('Grid Layout → Functionality', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('Grid layout test', { delay: 0 });

		selectCanvasParagraphOpenBlockTabAndStyleTab();

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Grid').click();
		});
	});

	it('shows grid controls and default responsive grid on the block', () => {
		cy.getByDataTest('layout-grid-minimum-column-width').should(
			'be.visible'
		);
		cy.getByDataTest('layout-grid-column-count').should('be.visible');

		cy.getBlock('core/paragraph').should('have.css', 'display', 'grid');

		cy.getBlock('core/paragraph')
			.invoke('css', 'container-type')
			.should('eq', 'inline-size');

		cy.getBlock('core/paragraph')
			.invoke('css', 'grid-template-columns')
			.should('match', /\d/);

		getWPDataObject().then((data) => {
			expect(getSelectedBlock(data, 'blockeraDisplay')).to.equal('grid');
			expect(
				getSelectedBlock(data, 'blockeraGridMinimumColumnWidth')
			).to.equal('');
			expect(getSelectedBlock(data, 'blockeraGridColumnCount')).to.equal(
				''
			);
		});

		assertEditorBlockeraStylesInclude('repeat(auto-fill');
		assertEditorBlockeraStylesInclude('min(12rem');
		assertEditorBlockeraStylesInclude('container-type: inline-size');
	});

	it('stores min. column width and keeps grid + container-type', () => {
		cy.typeInInputByDataTest('layout-grid-minimum-column-width', '8rem');
		cy.waitForAssertValue();

		cy.getBlock('core/paragraph').should('have.css', 'display', 'grid');

		cy.getBlock('core/paragraph')
			.invoke('css', 'container-type')
			.should('eq', 'inline-size');

		getWPDataObject().then((data) => {
			expect(
				getSelectedBlock(data, 'blockeraGridMinimumColumnWidth')
			).to.equal('8rem');
		});

		assertEditorBlockeraStylesInclude('repeat(auto-fill');
		assertEditorBlockeraStylesInclude('min(8rem');
	});

	it('uses rem as the default unit when typing a number only', () => {
		cy.typeInInputByDataTest('layout-grid-minimum-column-width', '8');
		cy.waitForAssertValue();

		getWPDataObject().then((data) => {
			expect(
				getSelectedBlock(data, 'blockeraGridMinimumColumnWidth')
			).to.equal('8rem');
		});

		assertEditorBlockeraStylesInclude('repeat(auto-fill');
		assertEditorBlockeraStylesInclude('min(8rem');
	});

	it('applies fixed column count (computed track count matches)', () => {
		cy.typeInInputByDataTest('layout-grid-column-count', '3');
		cy.waitForAssertValue();

		cy.getBlock('core/paragraph').should('have.css', 'display', 'grid');

		cy.getBlock('core/paragraph')
			.invoke('css', 'grid-template-columns')
			.should((gtc) => {
				expectResolvedGridTrackCount(gtc, 3);
			});

		getWPDataObject().then((data) => {
			expect(getSelectedBlock(data, 'blockeraGridColumnCount')).to.equal(
				3
			);
		});

		assertEditorBlockeraStylesInclude('repeat(3,');
		assertEditorBlockeraStylesInclude('minmax(0, 1fr)');
	});

	it('stores combined min width + column count on the block', () => {
		cy.typeInInputByDataTest('layout-grid-minimum-column-width', '10rem');
		cy.waitForAssertValue();
		cy.typeInInputByDataTest('layout-grid-column-count', '2');
		cy.waitForAssertValue();

		cy.getBlock('core/paragraph').should('have.css', 'display', 'grid');

		cy.getBlock('core/paragraph')
			.invoke('css', 'container-type')
			.should('eq', 'inline-size');

		getWPDataObject().then((data) => {
			expect(
				getSelectedBlock(data, 'blockeraGridMinimumColumnWidth')
			).to.equal('10rem');
			expect(getSelectedBlock(data, 'blockeraGridColumnCount')).to.equal(
				2
			);
		});

		assertEditorBlockeraStylesInclude('max(min(');
		assertEditorBlockeraStylesInclude('10rem');
		assertEditorBlockeraStylesInclude('1.2rem*1');
	});

	it('clears min width in attributes and keeps display grid', () => {
		cy.typeInInputByDataTest('layout-grid-minimum-column-width', '8rem');
		cy.waitForAssertValue();

		cy.typeInInputByDataTest('layout-grid-minimum-column-width', '');
		cy.waitForAssertValue();

		cy.getBlock('core/paragraph').should('have.css', 'display', 'grid');

		getWPDataObject().then((data) => {
			expect(
				getSelectedBlock(data, 'blockeraGridMinimumColumnWidth')
			).to.equal('');
		});

		assertEditorBlockeraStylesInclude('repeat(auto-fill');
		assertEditorBlockeraStylesInclude('min(12rem');
	});

	it('persists grid on the front end after save', () => {
		cy.typeInInputByDataTest('layout-grid-minimum-column-width', '9rem');
		cy.typeInInputByDataTest('layout-grid-column-count', '2');
		cy.waitForAssertValue();

		savePage();
		redirectToFrontPage();

		cy.get('p.blockera-block').should('have.css', 'display', 'grid');

		cy.get('p.blockera-block')
			.invoke('css', 'grid-template-columns')
			.should('match', /\d/);

		assertFrontendPageStylesInclude('max(min(');
		assertFrontendPageStylesInclude('9rem');
		assertFrontendPageStylesInclude('repeat(auto-fill');
		assertFrontendPageStylesInclude('container-type: inline-size');
	});

	it('stores a higher fixed column count in editor state', () => {
		cy.typeInInputByDataTest('layout-grid-column-count', '4');
		cy.waitForAssertValue();

		getWPDataObject().then((data) => {
			expect(getSelectedBlock(data, 'blockeraGridColumnCount')).to.equal(
				4
			);
		});

		cy.getBlock('core/paragraph').should('have.css', 'display', 'grid');
		cy.getBlock('core/paragraph')
			.invoke('css', 'grid-template-columns')
			.should('match', /\d/);

		assertEditorBlockeraStylesInclude('repeat(4,');
		assertEditorBlockeraStylesInclude('minmax(0, 1fr)');
	});

	describe('Mobile Portrait breakpoint', () => {
		beforeEach(() => {
			cy.typeInInputByDataTest('layout-grid-column-count', '2');
			cy.waitForAssertValue();
		});

		it('stores mobile override for grid column count', () => {
			setDeviceType('Mobile Portrait');

			selectCanvasParagraphOpenBlockTabAndStyleTab();

			cy.typeInInputByDataTest('layout-grid-column-count', '4');
			cy.waitForAssertValue();

			assertEditorBlockeraStylesInclude(
				'@media screen and (max-width: 478px)'
			);
			assertEditorBlockeraStylesInclude('repeat(2,');
			assertEditorBlockeraStylesInclude('repeat(4,');
			assertEditorBlockeraStylesInclude('minmax(0, 1fr)');

			getWPDataObject().then((data) => {
				expect(getMobileBreakpointGridColumnCount(data)).to.equal(4);
			});

			cy.viewport(420, 800);
			cy.getIframeBody()
				.find('[data-type="core/paragraph"]')
				.first()
				.click({ force: true });
			cy.waitForAssertValue();

			cy.getBlock('core/paragraph')
				.should('have.css', 'display', 'grid')
				.invoke('css', 'grid-template-columns')
				.should('match', /\d/);

			cy.viewport(2560, 1440);
			setDeviceType('Desktop');

			selectCanvasParagraphOpenBlockTabAndStyleTab();
			cy.waitForAssertValue();

			getWPDataObject().then((data) => {
				expect(
					getSelectedBlock(data, 'blockeraGridColumnCount')
				).to.equal(2);
			});
		});

		it('outputs responsive grid on the front (desktop vs mobile viewport)', () => {
			setDeviceType('Mobile Portrait');

			selectCanvasParagraphOpenBlockTabAndStyleTab();

			cy.typeInInputByDataTest('layout-grid-column-count', '4');
			cy.waitForAssertValue();

			savePage();
			redirectToFrontPage();

			const contentParagraph = () =>
				cy.get('p.blockera-block', { timeout: 30000 }).first();

			cy.waitForAssertValue(1500);

			assertFrontendPageStylesInclude(
				'@media screen and (max-width: 478px)'
			);
			assertFrontendPageStylesInclude('repeat(2,');
			assertFrontendPageStylesInclude('repeat(4,');
			assertFrontendPageStylesInclude('minmax(0, 1fr)');

			cy.viewport(1200, 900);
			contentParagraph().should('have.css', 'display', 'grid');
			contentParagraph()
				.invoke('css', 'grid-template-columns')
				.should('match', /\d/);

			cy.viewport(390, 844);
			cy.waitForAssertValue(500);
			contentParagraph().should('have.css', 'display', 'grid');
			contentParagraph()
				.invoke('css', 'grid-template-columns')
				.should('match', /\d/);
		});
	});

	describe('Front-end CSS', () => {
		it('outputs grid display and non-empty grid columns on the front', () => {
			cy.typeInInputByDataTest('layout-grid-column-count', '4');
			cy.waitForAssertValue();

			savePage();
			redirectToFrontPage();

			cy.viewport(1920, 1080);

			cy.get('p.blockera-block', { timeout: 30000 })
				.first()
				.should('have.css', 'display', 'grid');

			cy.waitForAssertValue(1500);

			cy.get('p.blockera-block')
				.first()
				.invoke('css', 'grid-template-columns')
				.should('match', /\d/);

			assertFrontendPageStylesInclude('repeat(4,');
			assertFrontendPageStylesInclude('minmax(0, 1fr)');
		});
	});
});
