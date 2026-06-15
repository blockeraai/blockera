/**
 * Shared Cypress helpers for global-styles-ui variable-variations (color shades) E2E specs.
 *
 * MU fixture paths are relative to the Blockera plugin root.
 */
import {
	createPost,
	getWPDataObject,
	openGlobalStylesColorPaletteScreen,
} from '@blockera/dev-cypress/js/helpers';

export const MU_FIX = 'packages/global-styles-ui/js/colors/test/fixtures';

/** @param {string} categoryLabel */
export function expandTaxonomyCategoryAccordion(categoryLabel) {
	cy.contains('[data-cy="taxonomy-category-header-label"]', categoryLabel, {
		timeout: 20000,
	})
		.parents('.blockera-preset-taxonomy-accordion')
		.first()
		.find('.blockera-control-group-header')
		.first()
		.click({ force: true });
}

/** Opens paragraph → Style → Text Color → variable picker popover. */
export function openParagraphTextColorVariablePickerPopover() {
	createPost();

	cy.getBlock('default').type('Color variable variations.', { delay: 0 });
	cy.getByAriaControls('styles-view').click();

	cy.getParentContainer('Text Color').within(() => {
		cy.openValueAddon();
	});

	cy.getByDataTest('variable-picker-popover', { timeout: 20000 }).should(
		'be.visible'
	);
}

/** @param {string} categoryLabel */
export function expandTaxonomyCategoryAccordionInVariablePicker(categoryLabel) {
	cy.getByDataTest('variable-picker-popover')
		.filter(':visible')
		.first()
		.within(() => {
			cy.contains(
				'[data-cy="taxonomy-category-header-label"]',
				categoryLabel,
				{
					timeout: 20000,
				}
			)
				.parents('.blockera-preset-taxonomy-accordion')
				.first()
				.find('.blockera-control-group-header')
				.first()
				.click({ force: true });
		});
}

/** @param {string} headerLabel Preset header label text inside the picker. */
export function expandColorPresetVariationsAccordionInVariablePicker(
	headerLabel
) {
	cy.getByDataTest('variable-picker-popover')
		.filter(':visible')
		.first()
		.within(() => {
			cy.contains('[data-cy="color-repeater-item-header"]', headerLabel, {
				timeout: 20000,
			})
				.parents('.blockera-control-repeater-item-variations-group')
				.first()
				.find('.blockera-control-btn-toggle')
				.click({ force: true });
		});
}

/** @param {string} headerLabel Preset header under Theme on the palette screen. */
export function expandColorPresetVariationsAccordionOnPaletteScreen(
	headerLabel
) {
	cy.getParentContainer('Theme').within(() => {
		cy.contains('[data-cy="color-repeater-item-header"]', headerLabel, {
			timeout: 20000,
		})
			.parents('.blockera-control-repeater-item-variations-group')
			.first()
			.find('.blockera-control-btn-toggle')
			.click({ force: true });
	});
}

/**
 * Retries until the editor store exposes MU color taxonomy on theme base global styles.
 *
 * @param {string} groupSlug
 * @param {string} presetSlug
 */
export function assertEditorThemeBaseHasMuColorTaxonomy(groupSlug, presetSlug) {
	cy.window({ timeout: 30000 }).should((win) => {
		const select = win.wp?.data?.select?.('core');
		expect(select, 'wp.data select(core)').to.exist;
		expect(
			typeof select.__experimentalGetCurrentThemeBaseGlobalStyles,
			'__experimentalGetCurrentThemeBaseGlobalStyles'
		).to.eq('function');

		const base = select.__experimentalGetCurrentThemeBaseGlobalStyles();
		expect(base, 'theme base global styles object').to.exist;

		const settings = base.settings ?? base;
		const groups = settings?.color?.groups;
		expect(
			Array.isArray(groups) && groups.length > 0,
			'settings.color.groups must be a non-empty array for taxonomy UI'
		).to.eq(true);
		expect(
			groups.some((g) => String(g?.slug ?? '') === groupSlug),
			`settings.color.groups must contain slug "${groupSlug}"`
		).to.eq(true);

		const pal = settings?.color?.palette;
		const themePalette = Array.isArray(pal?.theme)
			? pal.theme
			: Array.isArray(pal)
				? pal
				: [];
		expect(
			themePalette.length > 0,
			'settings.color.palette.theme (or palette) must list theme colors'
		).to.eq(true);

		const row = themePalette.find(
			(r) => String(r?.slug ?? '') === presetSlug
		);
		expect(row, `theme palette must include MU preset "${presetSlug}"`).to
			.exist;
		expect(
			String(row?.meta?.group ?? ''),
			`preset "${presetSlug}" must retain meta.group "${groupSlug}"`
		).to.eq(groupSlug);
	});
}

export { openGlobalStylesColorPaletteScreen, getWPDataObject };
