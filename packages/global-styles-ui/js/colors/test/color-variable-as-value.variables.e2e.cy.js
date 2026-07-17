/**
 * Regression: binding one color variable to another must persist a live CSS `var(…)`
 * (no Blockera `var(…),slug` composite). Broken storage yields invalid
 * `--wp--preset--color--*` custom properties in editor and on the front.
 */
import {
	activateMuPlugin,
	createPost,
	deactivateMuPlugin,
	getEditedGlobalStylesSetting,
	getSelectedBlock,
	assertBlockData,
	openGlobalStylesColorPaletteScreen,
	redirectToFrontPage,
	savePage,
	saveSiteEditorDirtyEntities,
} from '@blockera/dev-cypress/js/helpers';
import {
	MU_FIX,
	withinThemePresetGroup,
} from './e2e-variable-variations-helpers';

const MU = `${MU_FIX}/e2e-color-variable-as-value.php`;
const MU_NAME = 'e2e-color-variable-as-value.php';

const SOURCE_SLUG = 'e-2-e-var-link-source';
const TARGET_SLUG = 'e-2-e-var-link-target';
const SOURCE_NAME = 'E2E Var Link Source';
const TARGET_NAME = 'E2E Var Link Target';
const SOURCE_HEX = '#1D86EF';
const SOURCE_RGB = 'rgb(29, 134, 239)';

/** Live CSS token stored on the target palette row (no `,slug` suffix). */
const EXPECTED_TARGET_COLOR = `var(--wp--preset--color--${SOURCE_SLUG}, ${SOURCE_HEX})`;

/** Broken legacy composite that must never be written to theme.json / CSS. */
const BROKEN_COMPOSITE_COLOR = `${EXPECTED_TARGET_COLOR},${SOURCE_SLUG}`;

/** Custom property declaration WordPress emits for the target preset. */
const EXPECTED_PRESET_CSS = `--wp--preset--color--${TARGET_SLUG}: ${EXPECTED_TARGET_COLOR}`;

/**
 * @param {string} cssText
 */
function assertPresetLinkCssText(cssText) {
	const normalized = String(cssText).toLowerCase();
	expect(normalized, 'live var() custom property').to.include(
		EXPECTED_PRESET_CSS.toLowerCase()
	);
	expect(
		normalized,
		'no composite slug suffix on custom property'
	).to.not.include(BROKEN_COMPOSITE_COLOR.toLowerCase());
}

/**
 * Collects authored CSS text from the editor canvas (inline stylesheets).
 * Prefer `global-styles-inline-css`; fall back to all `<style>` tags.
 *
 * @return {Cypress.Chainable<string>}
 */
function getEditorCanvasGlobalStylesCssText() {
	return cy
		.get('iframe[name="editor-canvas"]')
		.its('0.contentDocument')
		.should('exist')
		.then((doc) => {
			const globalStyles = doc.getElementById('global-styles-inline-css');
			if (globalStyles?.textContent) {
				return globalStyles.textContent;
			}
			return Array.from(doc.querySelectorAll('style'))
				.map((el) => el.textContent || '')
				.join('\n');
		});
}

/**
 * Opens the target theme preset edit popover and binds Color to the source variable.
 */
function bindTargetColorToSourceVariable() {
	withinThemePresetGroup(() => {
		cy.contains('[data-cy="color-repeater-item-header"]', TARGET_NAME, {
			timeout: 20000,
		})
			.closest('[data-cy="repeater-item"]')
			.within(() => {
				cy.get('[data-cy="color-repeater-item-header"]')
					.first()
					.click({ force: true });
			});
	});

	cy.get('.components-popover')
		.filter(':visible')
		.last()
		.within(() => {
			cy.getParentContainer('Color').within(() => {
				cy.openValueAddon();
			});
		});

	cy.getByDataTest('variable-picker-popover', { timeout: 20000 })
		.filter(':visible')
		.first()
		.should('be.visible')
		.within(() => {
			cy.get('.blockera-control-var-picker-search input[type="search"]', {
				timeout: 20000,
			})
				.should('be.visible')
				.clear({ force: true })
				.type(SOURCE_NAME, { delay: 0, force: true });
		});

	cy.selectValueAddonItem(SOURCE_SLUG);

	cy.realPress('Escape');
}

describe('Global Styles UI → color variable as value for another variable', () => {
	beforeEach(() => {
		activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	afterEach(() => {
		deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	it('persists live var() (not var(),slug) and emits valid preset CSS in editor and front', () => {
		openGlobalStylesColorPaletteScreen();

		bindTargetColorToSourceVariable();

		getEditedGlobalStylesSetting('color.palette.theme').then((rows) => {
			const list = Array.isArray(rows) ? rows : [];
			const row = list.find((r) => String(r?.slug ?? '') === TARGET_SLUG);
			expect(row, `theme palette row "${TARGET_SLUG}"`).to.exist;
			expect(String(row.color)).to.equal(EXPECTED_TARGET_COLOR);
			expect(String(row.color)).to.not.equal(BROKEN_COMPOSITE_COLOR);
			expect(String(row.color)).to.not.match(
				new RegExp(`\\),\\s*${SOURCE_SLUG}\\s*$`)
			);
		});

		saveSiteEditorDirtyEntities();

		createPost();

		cy.getBlock('default').type('Variable-as-value paragraph.', {
			delay: 0,
		});
		cy.getByAriaControls('styles-view').click();

		cy.getParentContainer('Text Color').within(() => {
			cy.openValueAddon();
		});

		cy.getByDataTest('variable-picker-popover', { timeout: 20000 })
			.filter(':visible')
			.first()
			.within(() => {
				cy.get(
					'.blockera-control-var-picker-search input[type="search"]',
					{ timeout: 20000 }
				)
					.should('be.visible')
					.clear({ force: true })
					.type(TARGET_NAME, { delay: 0, force: true });
			});

		cy.selectValueAddonItem(TARGET_SLUG);

		const expectedBlockColorDeclaration = `color: var(--wp--preset--color--${TARGET_SLUG}, ${EXPECTED_TARGET_COLOR})`;

		// Editor: canvas global-styles CSS must author a live var() (not var(),slug).
		getEditorCanvasGlobalStylesCssText().then((cssText) => {
			expect(cssText, 'editor canvas has global styles CSS').to.not.equal(
				''
			);
			assertPresetLinkCssText(cssText);
		});

		cy.getIframeBody().within(() => {
			cy.get('#blockera-styles-wrapper')
				.invoke('text')
				.should('include', expectedBlockColorDeclaration)
				.and('not.include', BROKEN_COMPOSITE_COLOR);
		});

		cy.getBlock('core/paragraph').should('have.css', 'color', SOURCE_RGB);

		assertBlockData((data) => {
			const fontColor = getSelectedBlock(data, 'blockeraFontColor');
			expect(fontColor.isValueAddon).to.equal(true);
			expect(fontColor.valueType).to.equal('variable');
			expect(fontColor.settings.var).to.equal(
				`--wp--preset--color--${TARGET_SLUG}`
			);
		});

		savePage();

		redirectToFrontPage();

		cy.get('style#global-styles-inline-css', { timeout: 20000 })
			.invoke('text')
			.then(assertPresetLinkCssText);

		cy.get('style#blockera-inline-css')
			.invoke('text')
			.should('include', expectedBlockColorDeclaration)
			.and('not.include', BROKEN_COMPOSITE_COLOR);

		cy.get('.blockera-block').should('have.css', 'color', SOURCE_RGB);
	});
});
