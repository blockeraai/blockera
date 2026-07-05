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

/** Waits until core/global-styles entities needed by the variable picker are resolved. */
export function waitForEditorGlobalStylesReady() {
	cy.window({ timeout: 30000 }).should((win) => {
		const select = win.wp?.data?.select?.('core');
		expect(select, 'wp.data select(core)').to.exist;
		expect(
			select.hasFinishedResolution(
				'__experimentalGetCurrentGlobalStylesId'
			),
			'__experimentalGetCurrentGlobalStylesId resolution'
		).to.eq(true);

		const globalStylesId =
			select.__experimentalGetCurrentGlobalStylesId?.();
		if (!globalStylesId) {
			return;
		}

		const canEdit =
			typeof select.canUser === 'function'
				? select.canUser('update', {
						kind: 'root',
						name: 'globalStyles',
						id: globalStylesId,
					})
				: true;

		if (canEdit === true) {
			expect(
				select.hasFinishedResolution('getEditedEntityRecord', [
					'root',
					'globalStyles',
					globalStylesId,
				]),
				'getEditedEntityRecord(globalStyles) resolution'
			).to.eq(true);
			return;
		}

		expect(
			select.hasFinishedResolution('getEntityRecord', [
				'root',
				'globalStyles',
				globalStylesId,
				{ context: 'view' },
			]),
			'getEntityRecord(globalStyles) resolution'
		).to.eq(true);
	});
}

/**
 * Theme palette rows the color variable picker reads (matches `useGetColors` / `resolveColorPaletteThemeRows`).
 *
 * @param {Window} win
 */
function getEditorColorPickerThemePaletteRows(win) {
	const select = win.wp?.data?.select?.('core');
	const baseColor =
		select?.__experimentalGetCurrentThemeBaseGlobalStyles?.()?.settings
			?.color ?? {};
	const baseThemeRows = getColorPaletteThemeRowsFromSettings(baseColor);

	const globalStylesId = select?.__experimentalGetCurrentGlobalStylesId?.();
	const userColor = globalStylesId
		? (select.getEditedEntityRecord('root', 'globalStyles', globalStylesId)
				?.settings?.color ?? {})
		: {};
	const userThemeRows = getColorPaletteThemeRowsFromSettings(userColor);

	return userThemeRows.length > 0 ? userThemeRows : baseThemeRows;
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

		const themePalette = getEditorColorPickerThemePaletteRows(win);
		expect(
			themePalette.length > 0,
			'editor theme palette rows must be available for the color picker'
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

/** MU search-fixture presets from `e2e-color-variable-picker-search.php`. */
export const COLOR_VARIABLE_PICKER_SEARCH_FIXTURE_PRESETS = [
	{ slug: 'e-2-e-search-on-brand', name: 'Base / Primary / On Brand' },
	{ slug: 'e-2-e-search-accent', name: 'Accent / Secondary Tone' },
	{ slug: 'e-2-e-search-neutral', name: 'Neutral Surface' },
];

/** Slug used to confirm the search-fixture catalog rendered in the variable picker. */
export const COLOR_VARIABLE_PICKER_SEARCH_FIXTURE_READY_SLUG =
	'e-2-e-search-neutral';

/** Waits until all search-fixture color presets are present in the editor theme palette. */
export function waitForColorVariablePickerSearchFixturesInEditor() {
	waitForEditorGlobalStylesReady();

	for (const { slug, name } of COLOR_VARIABLE_PICKER_SEARCH_FIXTURE_PRESETS) {
		assertEditorThemeBaseHasMuColorPreset(slug, name);
	}
}

/** Waits until a search-fixture preset row is visible in the open variable picker. */
export function waitForColorPresetSlugInVariablePicker(
	slug = COLOR_VARIABLE_PICKER_SEARCH_FIXTURE_READY_SLUG
) {
	withinVariablePickerPopover(() => {
		cy.get(`[data-variable-slug="${slug}"]`, { timeout: 30000 })
			.first()
			.scrollIntoView()
			.should('be.visible');
	});
}

/**
 * Loads the block editor with stable localStorage for variable-picker search E2E.
 */
function createPostForColorVariablePickerSearchE2E() {
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

/**
 * Opens the Text Color variable picker after MU search fixtures are loaded and rendered.
 * Use for `color-variable-picker-search` E2E (avoids CI race where the popover opens before theme presets hydrate).
 */
export function openColorVariablePickerSearchTestPopover() {
	createPostForColorVariablePickerSearchE2E();
	waitForColorVariablePickerSearchFixturesInEditor();

	cy.getBlock('default').type('Color variable variations.', { delay: 0 });
	cy.getByAriaControls('styles-view').click();

	cy.getParentContainer('Text Color').within(() => {
		cy.openValueAddon();
	});

	cy.getByDataTest('variable-picker-popover', { timeout: 20000 }).should(
		'be.visible'
	);

	withinVariablePickerPopover(() => {
		cy.get('.blockera-control-var-picker-search input[type="search"]', {
			timeout: 20000,
		}).should('be.visible');
	});

	waitForColorPresetSlugInVariablePicker();
}

export { openGlobalStylesColorPaletteScreen, getWPDataObject };
