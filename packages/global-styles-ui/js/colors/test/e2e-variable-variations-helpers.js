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

/** Global Styles color palette: PresetGroup uses `getOriginVariablesLabel( 'theme' )`. */
export const THEME_PRESET_GROUP_LABELS = ['Theme variables', 'Theme'];

/** Cypress chainable scoped to the theme color preset repeater section. */
export function withinThemePresetGroup(fn) {
	return cy.getParentContainer(THEME_PRESET_GROUP_LABELS).within(fn);
}

/** @param {string} categoryLabel */
export function expandTaxonomyCategoryAccordion(categoryLabel) {
	cy.contains('[data-cy="taxonomy-category-header-label"]', categoryLabel, {
		timeout: 20000,
	})
		.parents('[data-cy="control-group"]')
		.first()
		.then(($group) => {
			if ($group.hasClass('is-close')) {
				cy.wrap($group)
					.find('.blockera-control-group-header')
					.first()
					.click({ force: true });
			}
		});
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

/** Scoped chainable for the visible variable-picker popover. */
export function withinVariablePickerPopover(fn) {
	return cy
		.getByDataTest('variable-picker-popover', { timeout: 20000 })
		.filter(':visible')
		.first()
		.should('be.visible')
		.within(fn);
}

/** Types into the variable picker search field. */
export function typeInVariablePickerSearch(query) {
	withinVariablePickerPopover(() => {
		cy.get('.blockera-control-var-picker-search input[type="search"]', {
			timeout: 20000,
		})
			.should('be.visible')
			.clear({ force: true })
			.type(query, { delay: 0, force: true });
	});
}

/** Clears the variable picker search field via the empty-state button. */
export function clearVariablePickerSearchViaButton() {
	withinVariablePickerPopover(() => {
		cy.contains('button', 'Clear search', { timeout: 20000 })
			.should('be.visible')
			.click({ force: true });
	});
}

/** Clears the variable picker search field. */
export function clearVariablePickerSearch() {
	withinVariablePickerPopover(() => {
		cy.get('.blockera-control-var-picker-search input[type="search"]', {
			timeout: 20000,
		})
			.should('be.visible')
			.clear({ force: true });
	});
}

/** @param {string} headerLabel */
export function assertColorPresetVisibleInVariablePicker(headerLabel) {
	withinVariablePickerPopover(() => {
		cy.contains('[data-cy="color-repeater-item-header"]', headerLabel, {
			timeout: 20000,
		}).should('be.visible');
	});
}

/** @param {string} headerLabel */
export function assertColorPresetNotInVariablePicker(headerLabel) {
	withinVariablePickerPopover(() => {
		cy.contains(
			'[data-cy="color-repeater-item-header"]',
			headerLabel
		).should('not.exist');
	});
}

/** Picker closes after a selection; reopen via the value-addon control (open or selected state). */
export function reopenVariablePickerPopover() {
	cy.getParentContainer('Text Color').within(() => {
		cy.get(
			'[data-cy="value-addon-btn-open"], [data-cy="value-addon-btn"]',
			{ timeout: 20000 }
		)
			.first()
			.click({ force: true });
	});

	cy.getByDataTest('variable-picker-popover', { timeout: 20000 })
		.filter(':visible')
		.first()
		.should('be.visible');
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
				.parents('[data-cy="control-group"]')
				.first()
				.then(($group) => {
					if ($group.hasClass('is-close')) {
						cy.wrap($group)
							.find('.blockera-control-group-header')
							.first()
							.click({ force: true });
					}
				});
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
				.scrollIntoView()
				.should('be.visible')
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
	withinThemePresetGroup(() => {
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
 * Retries until the editor store exposes MU color preset with name-based taxonomy on theme palette.
 *
 * @param {string} presetSlug
 * @param {string} expectedName Full preset name (may use `/` segments).
 */
/** MU fixture slugs for color-variable-picker-search E2E (TEMP CI debug). */
export const COLOR_PICKER_SEARCH_MU_SLUGS = [
	'e-2-e-search-on-brand',
	'e-2-e-search-accent',
	'e-2-e-search-neutral',
];

/**
 * Read theme color palette rows from the editor `core` store (no assertions).
 *
 * @param {Window} win
 * @return {Array<{ slug: string, name: string }>}
 */
export function readEditorThemeColorPaletteRows(win) {
	const select = win.wp?.data?.select?.('core');
	if (
		!select ||
		typeof select.__experimentalGetCurrentThemeBaseGlobalStyles !==
			'function'
	) {
		return [];
	}

	const base = select.__experimentalGetCurrentThemeBaseGlobalStyles();
	const settings = base?.settings ?? base ?? {};
	const pal = settings?.color?.palette;
	const themePalette = Array.isArray(pal?.theme)
		? pal.theme
		: Array.isArray(pal)
			? pal
			: [];

	return themePalette.map((row) => ({
		slug: String(row?.slug ?? ''),
		name: String(row?.name ?? ''),
	}));
}

/**
 * TEMP CI debug — log editor store + picker DOM to Cypress command log.
 * Remove after flaky root cause on CI is identified.
 *
 * @param {string} [label]
 */
export function logVariablePickerColorPresetDebugSnapshot(label = '') {
	const prefix = label
		? `[color-picker-search debug: ${label}]`
		: '[color-picker-search debug]';

	cy.window().then((win) => {
		const viewMode = win.localStorage.getItem(
			'blockera-variables-view-mode'
		);
		cy.log(`${prefix} localStorage viewMode=${viewMode ?? '(unset)'}`);

		const themePalette = readEditorThemeColorPaletteRows(win);
		const summary = themePalette
			.map((row) => `${row.slug}:${row.name}`)
			.join(' | ');
		cy.log(
			`${prefix} theme palette count=${themePalette.length}${summary ? ` rows=${summary.slice(0, 400)}` : ''}`
		);

		for (const slug of COLOR_PICKER_SEARCH_MU_SLUGS) {
			const row = themePalette.find((r) => r.slug === slug);
			cy.log(
				`${prefix} fixture ${slug} => ${row ? row.name : 'MISSING in editor store'}`
			);
		}
	});

	cy.get('body').then(($body) => {
		const $popover = $body
			.find('[data-test="variable-picker-popover"]')
			.filter(':visible')
			.first();
		if (!$popover.length) {
			cy.log(`${prefix} variable-picker-popover not visible in DOM`);
			return;
		}

		const headers = $popover
			.find('[data-cy="color-repeater-item-header"]')
			.toArray()
			.map((el) => el.textContent?.trim())
			.filter(Boolean);
		cy.log(
			`${prefix} picker color-repeater headers (${headers.length}): ${headers.join(' | ').slice(0, 400) || '(none)'}`
		);

		const taxonomyGroups = $popover.find(
			'[data-test="preset-taxonomy-group-shell"]'
		).length;
		cy.log(`${prefix} taxonomy group shells=${taxonomyGroups}`);

		const searchValue =
			$popover
				.find(
					'.blockera-control-var-picker-search input[type="search"]'
				)
				.val() ?? '';
		cy.log(`${prefix} search input value="${String(searchValue)}"`);

		const emptyVisible = $popover
			.find('[data-test="var-picker-search-empty"]')
			.filter(':visible').length;
		cy.log(`${prefix} var-picker-search-empty visible=${emptyVisible > 0}`);
	});
}

export function assertEditorThemeBaseHasMuColorTaxonomy(
	presetSlug,
	expectedName
) {
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
			String(row?.name ?? ''),
			`preset "${presetSlug}" must retain name "${expectedName}"`
		).to.eq(expectedName);
		expect(
			String(row?.name ?? '').includes('/'),
			`preset "${presetSlug}" name must use / for taxonomy`
		).to.eq(true);
	});
}

export { openGlobalStylesColorPaletteScreen, getWPDataObject };
