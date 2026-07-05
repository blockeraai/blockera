/**
 * Shared Cypress helpers for global-styles-ui variable-variations (color shades) E2E specs.
 *
 * MU fixture paths are relative to the Blockera plugin root.
 */
import {
	createPost,
	getWPDataObject,
	openGlobalStylesColorPaletteScreen,
	closeWelcomeGuide,
	disableGutenbergFeatures,
	setAbsoluteBlockToolbar,
} from '@blockera/dev-cypress/js/helpers';
import { PRESET_VARIABLES_VIEW_MODE_STORAGE_KEY } from '@blockera/dev-cypress/js/helpers/preset-variables-view';

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
			.type(query, { delay: 0, force: true })
			.should('have.value', query);
	});

	// Wait for the filtered catalog or empty state to settle after search input changes.
	if (query.trim() !== '') {
		withinVariablePickerPopover(() => {
			cy.get(
				'[data-cy="color-repeater-item-header"], [data-test="var-picker-search-empty"]',
				{ timeout: 20000 }
			).should('exist');
		});
	}
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

/** @param {string} slug Preset slug (`data-variable-slug`). */
export function assertColorPresetSlugVisibleInVariablePicker(slug) {
	withinVariablePickerPopover(() => {
		cy.get(`[data-variable-slug="${slug}"]`, { timeout: 20000 })
			.first()
			.scrollIntoView()
			.should('exist');
	});
}

/** @param {string} slug Preset slug (`data-variable-slug`). */
export function assertColorPresetSlugNotInVariablePicker(slug) {
	withinVariablePickerPopover(() => {
		cy.get(`[data-variable-slug="${slug}"]`).should('not.exist');
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
export function expandTaxonomyCategoryAccordionInVariablePicker(
	categoryLabel,
	{ groupLabel } = {}
) {
	cy.getByDataTest('variable-picker-popover')
		.filter(':visible')
		.first()
		.within(() => {
			const expandCategory = () => {
				cy.contains(
					'[data-cy="taxonomy-category-header-label"]',
					categoryLabel,
					{ timeout: 20000 }
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
			};

			if (groupLabel) {
				cy.contains(
					'.blockera-preset-taxonomy-group-shell',
					groupLabel,
					{ timeout: 20000 }
				).within(expandCategory);
				return;
			}

			expandCategory();
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

/** @param {unknown} colorSettings `settings.color` from global styles config. */
function getColorPaletteThemeRowsFromSettings(colorSettings) {
	if (!colorSettings || typeof colorSettings !== 'object') {
		return [];
	}

	const palette = colorSettings.palette;
	if (Array.isArray(palette)) {
		return palette;
	}

	if (
		palette &&
		typeof palette === 'object' &&
		Array.isArray(palette.theme)
	) {
		return palette.theme;
	}

	return [];
}

/** Theme palette rows from the theme.json base layer (where MU fixtures inject presets). */
function getThemeBaseColorPaletteRows(win) {
	const select = win.wp?.data?.select?.('core');
	const baseColor =
		select?.__experimentalGetCurrentThemeBaseGlobalStyles?.()?.settings
			?.color ?? {};

	return getColorPaletteThemeRowsFromSettings(baseColor);
}

/**
 * Retries until the editor store exposes a MU theme color preset on the theme palette.
 *
 * @param {string} presetSlug
 * @param {string} expectedName Full preset name (may use `/` segments).
 * @param {{ requireTaxonomyName?: boolean }} [options]
 */
export function assertEditorThemeBaseHasMuColorPreset(
	presetSlug,
	expectedName,
	{ requireTaxonomyName = false } = {}
) {
	cy.window({ timeout: 30000 }).should((win) => {
		const select = win.wp?.data?.select?.('core');
		expect(select, 'wp.data select(core)').to.exist;
		expect(
			typeof select.__experimentalGetCurrentThemeBaseGlobalStyles,
			'__experimentalGetCurrentThemeBaseGlobalStyles'
		).to.eq('function');

		const themePalette = getThemeBaseColorPaletteRows(win);
		expect(
			themePalette.length > 0,
			'theme base palette must list theme colors (MU fixtures inject here)'
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

		if (requireTaxonomyName) {
			expect(
				String(row?.name ?? '').includes('/'),
				`preset "${presetSlug}" name must use / for taxonomy`
			).to.eq(true);
		}
	});
}

/**
 * Retries until the editor store exposes MU color preset with name-based taxonomy on theme palette.
 *
 * @param {string} presetSlug
 * @param {string} expectedName Full preset name (may use `/` segments).
 */
export function assertEditorThemeBaseHasMuColorTaxonomy(
	presetSlug,
	expectedName
) {
	assertEditorThemeBaseHasMuColorPreset(presetSlug, expectedName, {
		requireTaxonomyName: true,
	});
}

/** MU search-fixture slugs from `e2e-color-variable-picker-search.php`. */
export const COLOR_VARIABLE_PICKER_SEARCH_FIXTURE_SLUGS = [
	'e-2-e-search-on-brand',
	'e-2-e-search-accent',
	'e-2-e-search-neutral',
];

/** Expected MU preset rows for store hydration checks. */
const COLOR_VARIABLE_PICKER_SEARCH_FIXTURE_PRESETS = [
	{
		slug: 'e-2-e-search-on-brand',
		name: 'E2E Search / E2E Brand / E2E On Brand Leaf',
	},
	{
		slug: 'e-2-e-search-accent',
		name: 'E2E Search / E2E Accent Row',
	},
	{
		slug: 'e-2-e-search-neutral',
		name: 'E2E Search Neutral Flat',
	},
];

/** Waits until all MU search fixtures are on the theme base palette in wp.data. */
function waitForColorVariablePickerSearchFixturesInEditorStore() {
	for (const { slug, name } of COLOR_VARIABLE_PICKER_SEARCH_FIXTURE_PRESETS) {
		assertEditorThemeBaseHasMuColorPreset(slug, name);
	}
}

/** Loads the block editor with stable localStorage for variable-picker search E2E. */
function createPostForVariablePickerSearchE2E() {
	const testURL = Cypress.env('testURL');
	let path = '/wp-admin/post-new.php?post_type=post';

	if (
		(testURL.endsWith('/') && !path.startsWith('/')) ||
		(!testURL.endsWith('/') && path.startsWith('/'))
	) {
		path = `${testURL}${path}`;
	} else if (!testURL.endsWith('/') && !path.startsWith('/')) {
		path = `${testURL}/${path}`;
	} else if (testURL.endsWith('/') && path.startsWith('/')) {
		path = `${testURL.slice(0, -1)}${path}`;
	} else {
		path = `${testURL}${path}`;
	}

	return cy
		.visit(path, {
			onBeforeLoad(win) {
				win.localStorage.removeItem('blockeraEditorZoomPercent');
				win.localStorage.removeItem(
					PRESET_VARIABLES_VIEW_MODE_STORAGE_KEY
				);
			},
		})
		.then(() => {
			// eslint-disable-next-line cypress/no-unnecessary-waiting
			cy.wait(2000);

			closeWelcomeGuide();
			disableGutenbergFeatures();
			setAbsoluteBlockToolbar();

			return getWPDataObject();
		});
}

/** Waits until every MU search-fixture slug exists in the open picker catalog. */
function waitForColorVariablePickerSearchFixtureSlugs() {
	for (const slug of COLOR_VARIABLE_PICKER_SEARCH_FIXTURE_SLUGS) {
		withinVariablePickerPopover(() => {
			cy.get(`[data-variable-slug="${slug}"]`, { timeout: 30000 })
				.first()
				.scrollIntoView()
				.should('exist');
		});
	}
}

/**
 * Opens the Text Color variable picker for search-fixture E2E.
 * Clears persisted view mode, waits for MU fixtures in the editor store, then in the picker.
 */
export function openColorVariablePickerSearchTestPopover() {
	createPostForVariablePickerSearchE2E();
	waitForColorVariablePickerSearchFixturesInEditorStore();

	cy.getBlock('default').type('Color variable variations.', { delay: 0 });
	cy.getByAriaControls('styles-view').click();

	cy.getParentContainer('Text Color').within(() => {
		cy.openValueAddon();
	});

	cy.getByDataTest('variable-picker-popover', { timeout: 20000 }).should(
		'be.visible'
	);

	waitForColorVariablePickerSearchFixtureSlugs();
}

export { openGlobalStylesColorPaletteScreen, getWPDataObject };
