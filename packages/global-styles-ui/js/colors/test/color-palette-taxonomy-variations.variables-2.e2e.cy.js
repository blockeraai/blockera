/**
 * Blockera dependencies
 */
import {
	activateMuPlugin,
	createPost,
	deactivateMuPlugin,
	getSelectedBlock,
	getWPDataObject,
	openGlobalStylesColorPaletteScreen,
} from '@blockera/dev-cypress/js/helpers';
import {
	THEME_PRESET_GROUP_LABELS,
	reopenVariablePickerPopover,
	withinThemePresetGroup,
} from './e2e-variable-variations-helpers';

/** MU fixtures live next to this spec under js/colors/test/fixtures (paths relative to plugin root). */
const MU_FIX = 'packages/global-styles-ui/js/colors/test/fixtures';

/**
 * Fast local iteration: set `debugColorTaxonomyE2E: 'group-only'` in cypress.env.json
 * (or `CYPRESS_debugColorTaxonomyE2E=group-only`) to run only the first taxonomy scenario.
 */
const describeGroupOnlyScenario =
	Cypress.env('debugColorTaxonomyE2E') === 'group-only'
		? describe.only
		: describe;

/**
 * Opens a taxonomy category accordion by its visible header label.
 *
 * @param {string} categoryLabel
 */
function expandTaxonomyCategoryAccordion(categoryLabel) {
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

/**
 * Opens paragraph → Style → Text Color value addon (variable picker with ColorPalettePresetContent).
 */
function openParagraphTextColorVariablePickerPopover() {
	createPost();

	cy.getBlock('default').type('Taxonomy variable picker.', { delay: 0 });
	cy.getByAriaControls('styles-view').click();

	cy.getParentContainer('Text Color').within(() => {
		cy.openValueAddon();
	});

	cy.getByDataTest('variable-picker-popover', { timeout: 20000 }).should(
		'be.visible'
	);
}

/**
 * Expands a taxonomy category accordion inside the visible variable-picker popover only.
 *
 * @param {string} categoryLabel
 */
function expandTaxonomyCategoryAccordionInVariablePicker(categoryLabel) {
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

/**
 * Opens the shade/variations accordion inside the variable picker for a preset row (header label text).
 *
 * @param {string} headerLabel
 */
function expandColorPresetVariationsAccordionInVariablePicker(headerLabel) {
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

describe('Global Styles UI → Color palette taxonomy & variations (theme.json scenarios)', () => {
	describeGroupOnlyScenario(
		'taxonomy: group-only presets (no categories)',
		() => {
			const MU = `${MU_FIX}/e2e-color-taxonomy-group-direct.php`;
			const MU_NAME = 'e2e-color-taxonomy-group-direct.php';

			before(() => {
				return activateMuPlugin({
					pluginPath: MU,
					pluginName: MU_NAME,
				});
			});

			after(() => {
				return deactivateMuPlugin({
					pluginPath: MU,
					pluginName: MU_NAME,
				});
			});

			it('renders taxonomy bridge with group header and a color row under the group', () => {
				openGlobalStylesColorPaletteScreen();

				cy.get('.blockera-color-palette-presets', {
					timeout: 20000,
				}).should('be.visible');

				cy.get('.blockera-preset-taxonomy-repeater', {
					timeout: 20000,
				}).should('be.visible');

				cy.contains(
					'.blockera-preset-taxonomy-group-shell',
					'E2E Tax Root Group'
				).should('be.visible');

				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Tax Root Alpha'
				).should('be.visible');
			});
		}
	);

	describe('taxonomy: category accordion + interface-size small', () => {
		const MU = `${MU_FIX}/e2e-color-taxonomy-category.php`;
		const MU_NAME = 'e2e-color-taxonomy-category.php';

		before(() => {
			return activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		after(() => {
			return deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		it('shows presets inside category accordion and applies half-width class for small rows', () => {
			openGlobalStylesColorPaletteScreen();

			cy.get('.blockera-preset-taxonomy-repeater', {
				timeout: 20000,
			}).should('be.visible');

			cy.contains(
				'.blockera-preset-taxonomy-group-shell',
				'E2E Tax Brand Group'
			).should('be.visible');

			expandTaxonomyCategoryAccordion('E2E Tax Text Category');

			cy.contains(
				'[data-cy="color-repeater-item-header"]',
				'E2E Tax Crimson'
			).should('be.visible');

			cy.contains(
				'[data-cy="color-repeater-item-header"]',
				'E2E Tax Small Slot'
			)
				.closest('[data-cy="repeater-item"]')
				.should(
					'have.class',
					'blockera-preset-taxonomy-row--interface-small'
				);
		});
	});

	describe('taxonomy: sub-category single preset (flattened under parent)', () => {
		const MU = `${MU_FIX}/e2e-color-taxonomy-subcategory.php`;
		const MU_NAME = 'e2e-color-taxonomy-subcategory.php';

		before(() => {
			return activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		after(() => {
			return deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		it('shows direct row and single sub-category row after expanding parent only (no nested sub accordion)', () => {
			openGlobalStylesColorPaletteScreen();

			cy.get('.blockera-preset-taxonomy-repeater', {
				timeout: 20000,
			}).should('be.visible');

			expandTaxonomyCategoryAccordion('E2E Tax Parent Category');

			cy.contains(
				'[data-cy="taxonomy-category-header-label"]',
				'E2E Tax Sub Slot'
			).should('not.exist');

			cy.contains(
				'[data-cy="color-repeater-item-header"]',
				'E2E Tax Parent Direct'
			).should('be.visible');

			cy.contains(
				'[data-cy="color-repeater-item-header"]',
				'E2E Tax Sub Nested'
			).should('be.visible');
		});
	});

	describe('taxonomy: sole preset across category + sub-categories (flatten)', () => {
		const MU = `${MU_FIX}/e2e-color-taxonomy-category-sole-sub-only.php`;
		const MU_NAME = 'e2e-color-taxonomy-category-sole-sub-only.php';

		before(() => {
			return activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		after(() => {
			return deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		it('renders the lone preset row without a category accordion wrapper', () => {
			openGlobalStylesColorPaletteScreen();

			cy.get('.blockera-preset-taxonomy-repeater', {
				timeout: 20000,
			}).should('be.visible');

			cy.contains(
				'.blockera-preset-taxonomy-group-shell',
				'E2E Tax Sole Flat Group'
			)
				.should('be.visible')
				.find('.blockera-preset-taxonomy-accordion')
				.should('have.length', 0);

			cy.contains(
				'.blockera-preset-taxonomy-group-shell',
				'E2E Tax Sole Flat Group'
			).within(() => {
				cy.contains(
					'[data-cy="taxonomy-category-header-label"]',
					'E2E Tax Sole Parent Cat'
				).should('not.exist');
			});

			cy.contains(
				'[data-cy="color-repeater-item-header"]',
				'E2E Tax Sole Sub Only'
			).should('be.visible');
		});
	});

	describe('taxonomy: single-row sub-category under multi-row category (omit nested accordion)', () => {
		const MU = `${MU_FIX}/e2e-color-taxonomy-subsection-single-flat.php`;
		const MU_NAME = 'e2e-color-taxonomy-subsection-single-flat.php';

		before(() => {
			return activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		after(() => {
			return deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		it('shows direct row and single sub-category row without a nested accordion header', () => {
			openGlobalStylesColorPaletteScreen();

			cy.get('.blockera-preset-taxonomy-repeater', {
				timeout: 20000,
			}).should('be.visible');

			cy.contains(
				'.blockera-preset-taxonomy-group-shell',
				'E2E Tax Sub Flat Group'
			)
				.should('be.visible')
				.find('.blockera-preset-taxonomy-accordion')
				.should('have.length', 1);

			expandTaxonomyCategoryAccordion('E2E Tax Parent Flat Cat');

			cy.contains(
				'.blockera-preset-taxonomy-group-shell',
				'E2E Tax Sub Flat Group'
			).within(() => {
				cy.contains(
					'[data-cy="taxonomy-category-header-label"]',
					'E2E Tax Sub Flat Slot'
				).should('not.exist');
			});

			cy.contains(
				'[data-cy="color-repeater-item-header"]',
				'E2E Tax Direct Flat'
			).should('be.visible');

			cy.contains(
				'[data-cy="color-repeater-item-header"]',
				'E2E Tax Sub Single Flat'
			).should('be.visible');
		});
	});

	describe('taxonomy: category accordion expand', () => {
		const MU = `${MU_FIX}/e2e-color-taxonomy-initial-open-true.php`;
		const MU_NAME = 'e2e-color-taxonomy-initial-open-true.php';

		before(() => {
			return activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		after(() => {
			return deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		it('shows preset rows after expanding the category accordion', () => {
			openGlobalStylesColorPaletteScreen();

			cy.get('.blockera-preset-taxonomy-repeater', {
				timeout: 20000,
			}).should('be.visible');

			cy.contains(
				'.blockera-preset-taxonomy-group-shell',
				'E2E Tax Init Open Group'
			).should('be.visible');

			cy.contains(
				'[data-cy="taxonomy-category-header-label"]',
				'E2E Tax Init Open Cat'
			).should('be.visible');

			expandTaxonomyCategoryAccordion('E2E Tax Init Open Cat');

			cy.contains(
				'[data-cy="color-repeater-item-header"]',
				'E2E Tax Init Open A'
			).should('be.visible');

			cy.contains(
				'[data-cy="color-repeater-item-header"]',
				'E2E Tax Init Open B'
			).should('be.visible');
		});
	});

	describe('taxonomy: nested sub-category accordion expand', () => {
		const MU = `${MU_FIX}/e2e-color-taxonomy-subcategory-initial-open.php`;
		const MU_NAME = 'e2e-color-taxonomy-subcategory-initial-open.php';

		before(() => {
			return activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		after(() => {
			return deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		it('shows nested preset rows after expanding parent and sub-category accordions', () => {
			openGlobalStylesColorPaletteScreen();

			cy.get('.blockera-preset-taxonomy-repeater', {
				timeout: 20000,
			}).should('be.visible');

			expandTaxonomyCategoryAccordion('E2E Tax Sub IO Parent Cat');
			expandTaxonomyCategoryAccordion('E2E Tax Sub IO Slot');

			cy.contains(
				'[data-cy="color-repeater-item-header"]',
				'E2E Tax Sub IO A'
			).should('be.visible');

			cy.contains(
				'[data-cy="color-repeater-item-header"]',
				'E2E Tax Sub IO B'
			).should('be.visible');
		});
	});

	describe('taxonomy: category with base + shade variations', () => {
		const MU = `${MU_FIX}/e2e-color-taxonomy-category-variations.php`;
		const MU_NAME = 'e2e-color-taxonomy-category-variations.php';

		before(() => {
			return activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		after(() => {
			return deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		it('shows shade preview stack on the taxonomy base row inside an expanded category', () => {
			openGlobalStylesColorPaletteScreen();

			cy.get('.blockera-preset-taxonomy-repeater', {
				timeout: 20000,
			}).should('be.visible');

			cy.contains(
				'.blockera-preset-taxonomy-group-shell',
				'E2E Tax Var Ramp Group'
			).within(() => {
				cy.contains(
					'[data-cy="taxonomy-category-header-label"]',
					'E2E Tax Var Ramp Category'
				).should('not.exist');

				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Tax Cat Var Base'
				)
					.closest('[data-cy="repeater-item"]')
					.find('[data-cy="color-preset-shade-stack"]')
					.should('be.visible');
			});
		});
	});

	describe('variable picker popover (Text Color) → taxonomy mirrors palette screen', () => {
		describe('picker: group-only presets (no categories)', () => {
			const MU = `${MU_FIX}/e2e-color-taxonomy-group-direct.php`;
			const MU_NAME = 'e2e-color-taxonomy-group-direct.php';

			before(() => {
				return activateMuPlugin({
					pluginPath: MU,
					pluginName: MU_NAME,
				});
			});

			after(() => {
				return deactivateMuPlugin({
					pluginPath: MU,
					pluginName: MU_NAME,
				});
			});

			it('shows group shell row and selects preset by slug', () => {
				openParagraphTextColorVariablePickerPopover();

				cy.getByDataTest('variable-picker-popover').within(() => {
					cy.get('.blockera-preset-taxonomy-repeater', {
						timeout: 20000,
					}).should('be.visible');

					cy.contains(
						'.blockera-preset-taxonomy-group-shell',
						'E2E Tax Root Group'
					).should('be.visible');

					cy.contains(
						'[data-cy="color-repeater-item-header"]',
						'E2E Tax Root Alpha'
					).should('be.visible');
				});

				cy.selectValueAddonItem('e-2-e-tax-root-alpha');

				getWPDataObject().then((data) => {
					const fontColor = getSelectedBlock(
						data,
						'blockeraFontColor'
					);

					expect(fontColor.settings.var).to.equal(
						'--wp--preset--color--e-2-e-tax-root-alpha'
					);
				});
			});
		});

		describe('picker: category accordion + selectable preset', () => {
			const MU = `${MU_FIX}/e2e-color-taxonomy-category.php`;
			const MU_NAME = 'e2e-color-taxonomy-category.php';

			before(() => {
				return activateMuPlugin({
					pluginPath: MU,
					pluginName: MU_NAME,
				});
			});

			after(() => {
				return deactivateMuPlugin({
					pluginPath: MU,
					pluginName: MU_NAME,
				});
			});

			it('shows grouped taxonomy in the picker, expands category, selects preset by slug', () => {
				openParagraphTextColorVariablePickerPopover();

				cy.getByDataTest('variable-picker-popover').within(() => {
					cy.get('.blockera-preset-taxonomy-repeater', {
						timeout: 20000,
					}).should('be.visible');

					cy.contains(
						'.blockera-preset-taxonomy-group-shell',
						'E2E Tax Brand Group'
					).should('be.visible');
				});

				expandTaxonomyCategoryAccordionInVariablePicker(
					'E2E Tax Text Category'
				);

				cy.selectValueAddonItem('e-2-e-tax-crimson');

				getWPDataObject().then((data) => {
					const fontColor = getSelectedBlock(
						data,
						'blockeraFontColor'
					);

					expect(fontColor.isValueAddon).to.equal(true);
					expect(fontColor.valueType).to.equal('variable');
					expect(fontColor.settings.var).to.equal(
						'--wp--preset--color--e-2-e-tax-crimson'
					);
				});
			});
		});

		describe('picker: sub-category single preset (flattened under parent)', () => {
			const MU = `${MU_FIX}/e2e-color-taxonomy-subcategory.php`;
			const MU_NAME = 'e2e-color-taxonomy-subcategory.php';

			before(() => {
				return activateMuPlugin({
					pluginPath: MU,
					pluginName: MU_NAME,
				});
			});

			after(() => {
				return deactivateMuPlugin({
					pluginPath: MU,
					pluginName: MU_NAME,
				});
			});

			it('selects sub-category preset after expanding parent only (no nested sub accordion)', () => {
				openParagraphTextColorVariablePickerPopover();

				cy.getByDataTest('variable-picker-popover').within(() => {
					cy.get('.blockera-preset-taxonomy-repeater', {
						timeout: 20000,
					}).should('be.visible');
				});

				expandTaxonomyCategoryAccordionInVariablePicker(
					'E2E Tax Parent Category'
				);

				cy.getByDataTest('variable-picker-popover').within(() => {
					cy.contains(
						'[data-cy="taxonomy-category-header-label"]',
						'E2E Tax Sub Slot'
					).should('not.exist');

					cy.contains(
						'[data-cy="color-repeater-item-header"]',
						'E2E Tax Sub Nested'
					).should('be.visible');
				});

				cy.selectValueAddonItem('e-2-e-tax-sub-nested');

				getWPDataObject().then((data) => {
					const fontColor = getSelectedBlock(
						data,
						'blockeraFontColor'
					);

					expect(fontColor.settings.var).to.equal(
						'--wp--preset--color--e-2-e-tax-sub-nested'
					);
				});
			});
		});

		describe('picker: sole preset flatten', () => {
			const MU = `${MU_FIX}/e2e-color-taxonomy-category-sole-sub-only.php`;
			const MU_NAME = 'e2e-color-taxonomy-category-sole-sub-only.php';

			before(() => {
				return activateMuPlugin({
					pluginPath: MU,
					pluginName: MU_NAME,
				});
			});

			after(() => {
				return deactivateMuPlugin({
					pluginPath: MU,
					pluginName: MU_NAME,
				});
			});

			it('omits category accordion and selects the lone preset', () => {
				openParagraphTextColorVariablePickerPopover();

				cy.getByDataTest('variable-picker-popover').within(() => {
					cy.contains(
						'.blockera-preset-taxonomy-group-shell',
						'E2E Tax Sole Flat Group'
					)
						.should('be.visible')
						.find('.blockera-preset-taxonomy-accordion')
						.should('have.length', 0);

					cy.contains(
						'[data-cy="color-repeater-item-header"]',
						'E2E Tax Sole Sub Only'
					).should('be.visible');
				});

				cy.selectValueAddonItem('e-2-e-tax-sole-sub-only');

				getWPDataObject().then((data) => {
					const fontColor = getSelectedBlock(
						data,
						'blockeraFontColor'
					);

					expect(fontColor.settings.var).to.equal(
						'--wp--preset--color--e-2-e-tax-sole-sub-only'
					);
				});
			});
		});

		describe('picker: subsection single-row flatten', () => {
			const MU = `${MU_FIX}/e2e-color-taxonomy-subsection-single-flat.php`;
			const MU_NAME = 'e2e-color-taxonomy-subsection-single-flat.php';

			before(() => {
				return activateMuPlugin({
					pluginPath: MU,
					pluginName: MU_NAME,
				});
			});

			after(() => {
				return deactivateMuPlugin({
					pluginPath: MU,
					pluginName: MU_NAME,
				});
			});

			it('shows direct + single sub row without nested sub accordion header', () => {
				openParagraphTextColorVariablePickerPopover();

				cy.getByDataTest('variable-picker-popover').within(() => {
					cy.contains(
						'.blockera-preset-taxonomy-group-shell',
						'E2E Tax Sub Flat Group'
					)
						.should('be.visible')
						.find('.blockera-preset-taxonomy-accordion')
						.should('have.length', 1);
				});

				expandTaxonomyCategoryAccordionInVariablePicker(
					'E2E Tax Parent Flat Cat'
				);

				cy.getByDataTest('variable-picker-popover').within(() => {
					cy.contains(
						'.blockera-preset-taxonomy-group-shell',
						'E2E Tax Sub Flat Group'
					).within(() => {
						cy.contains(
							'[data-cy="taxonomy-category-header-label"]',
							'E2E Tax Sub Flat Slot'
						).should('not.exist');
					});

					cy.contains(
						'[data-cy="color-repeater-item-header"]',
						'E2E Tax Direct Flat'
					).should('be.visible');

					cy.contains(
						'[data-cy="color-repeater-item-header"]',
						'E2E Tax Sub Single Flat'
					).should('be.visible');
				});

				cy.selectValueAddonItem('e-2-e-tax-sub-single-flat');

				getWPDataObject().then((data) => {
					const fontColor = getSelectedBlock(
						data,
						'blockeraFontColor'
					);

					expect(fontColor.settings.var).to.equal(
						'--wp--preset--color--e-2-e-tax-sub-single-flat'
					);
				});
			});
		});

		describe('picker: category accordion expand', () => {
			const MU = `${MU_FIX}/e2e-color-taxonomy-initial-open-true.php`;
			const MU_NAME = 'e2e-color-taxonomy-initial-open-true.php';

			before(() => {
				return activateMuPlugin({
					pluginPath: MU,
					pluginName: MU_NAME,
				});
			});

			after(() => {
				return deactivateMuPlugin({
					pluginPath: MU,
					pluginName: MU_NAME,
				});
			});

			it('shows category preset rows after expanding accordion in picker', () => {
				openParagraphTextColorVariablePickerPopover();

				expandTaxonomyCategoryAccordionInVariablePicker(
					'E2E Tax Init Open Cat'
				);

				cy.getByDataTest('variable-picker-popover').within(() => {
					cy.contains(
						'[data-cy="color-repeater-item-header"]',
						'E2E Tax Init Open A'
					).should('be.visible');

					cy.contains(
						'[data-cy="color-repeater-item-header"]',
						'E2E Tax Init Open B'
					).should('be.visible');
				});

				cy.selectValueAddonItem('e-2-e-tax-init-open-b');

				getWPDataObject().then((data) => {
					const fontColor = getSelectedBlock(
						data,
						'blockeraFontColor'
					);

					expect(fontColor.settings.var).to.equal(
						'--wp--preset--color--e-2-e-tax-init-open-b'
					);
				});
			});
		});

		describe('picker: nested sub-category accordion expand', () => {
			const MU = `${MU_FIX}/e2e-color-taxonomy-subcategory-initial-open.php`;
			const MU_NAME = 'e2e-color-taxonomy-subcategory-initial-open.php';

			before(() => {
				return activateMuPlugin({
					pluginPath: MU,
					pluginName: MU_NAME,
				});
			});

			after(() => {
				return deactivateMuPlugin({
					pluginPath: MU,
					pluginName: MU_NAME,
				});
			});

			it('shows nested presets after expanding parent and sub accordions in picker', () => {
				openParagraphTextColorVariablePickerPopover();

				expandTaxonomyCategoryAccordionInVariablePicker(
					'E2E Tax Sub IO Parent Cat'
				);
				expandTaxonomyCategoryAccordionInVariablePicker(
					'E2E Tax Sub IO Slot'
				);

				cy.getByDataTest('variable-picker-popover').within(() => {
					cy.contains(
						'[data-cy="color-repeater-item-header"]',
						'E2E Tax Sub IO A'
					).should('be.visible');

					cy.contains(
						'[data-cy="color-repeater-item-header"]',
						'E2E Tax Sub IO B'
					).should('be.visible');
				});

				cy.selectValueAddonItem('e-2-e-tax-sub-io-a');

				getWPDataObject().then((data) => {
					const fontColor = getSelectedBlock(
						data,
						'blockeraFontColor'
					);

					expect(fontColor.settings.var).to.equal(
						'--wp--preset--color--e-2-e-tax-sub-io-a'
					);
				});
			});
		});

		describe('picker: category with base + shade (taxonomy)', () => {
			const MU = `${MU_FIX}/e2e-color-taxonomy-category-variations.php`;
			const MU_NAME = 'e2e-color-taxonomy-category-variations.php';

			before(() => {
				return activateMuPlugin({
					pluginPath: MU,
					pluginName: MU_NAME,
				});
			});

			after(() => {
				return deactivateMuPlugin({
					pluginPath: MU,
					pluginName: MU_NAME,
				});
			});

			it('selects base from inline shade strip without opening the variations accordion', () => {
				openParagraphTextColorVariablePickerPopover();

				cy.getByDataTest('variable-picker-popover').within(() => {
					cy.contains(
						'[data-cy="color-repeater-item-header"]',
						'E2E Tax Cat Var Base'
					).should('be.visible');
				});

				cy.selectValueAddonItem('e-2-e-tax-cat-var-base');

				getWPDataObject().then((data) => {
					const fontColor = getSelectedBlock(
						data,
						'blockeraFontColor'
					);

					expect(fontColor.settings.var).to.equal(
						'--wp--preset--color--e-2-e-tax-cat-var-base'
					);
				});
			});

			it('selects persisted shade slug from the inline strip after category expand', () => {
				openParagraphTextColorVariablePickerPopover();

				cy.getByDataTest('variable-picker-popover').within(() => {
					cy.contains(
						'[data-cy="color-repeater-item-header"]',
						'E2E Tax Cat Var Base'
					).should('be.visible');
				});

				cy.selectValueAddonItem('e-2-e-tax-cat-var-base-shade-500');

				getWPDataObject().then((data) => {
					const fontColor = getSelectedBlock(
						data,
						'blockeraFontColor'
					);

					expect(fontColor.settings.var).to.equal(
						'--wp--preset--color--e-2-e-tax-cat-var-base-shade-500'
					);
				});
			});

			it('switches taxonomy selection from shade slug back to base slug', () => {
				openParagraphTextColorVariablePickerPopover();

				cy.getByDataTest('variable-picker-popover').within(() => {
					cy.contains(
						'[data-cy="color-repeater-item-header"]',
						'E2E Tax Cat Var Base'
					).should('be.visible');
				});

				cy.selectValueAddonItem('e-2-e-tax-cat-var-base-shade-500');

				getWPDataObject().then((data) => {
					expect(
						getSelectedBlock(data, 'blockeraFontColor').settings.var
					).to.equal(
						'--wp--preset--color--e-2-e-tax-cat-var-base-shade-500'
					);
				});

				reopenVariablePickerPopover();

				cy.selectValueAddonItem('e-2-e-tax-cat-var-base');

				getWPDataObject().then((data) => {
					expect(
						getSelectedBlock(data, 'blockeraFontColor').settings.var
					).to.equal('--wp--preset--color--e-2-e-tax-cat-var-base');
				});
			});
		});
	});

	describe('taxonomy + simple theme repeater row (no preset meta)', () => {
		const MU = `${MU_FIX}/e2e-color-taxonomy-mixed-simple.php`;
		const MU_NAME = 'e2e-color-taxonomy-mixed-simple.php';

		before(() => {
			return activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		after(() => {
			return deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		it('renders taxonomy leaf and a plain theme repeater row inside Theme', () => {
			openGlobalStylesColorPaletteScreen();

			cy.get('.blockera-preset-taxonomy-repeater', {
				timeout: 20000,
			}).should('be.visible');

			cy.contains(
				'.blockera-preset-taxonomy-group-shell',
				'E2E Tax Mixed Group'
			).within(() => {
				cy.contains(
					'[data-cy="taxonomy-category-header-label"]',
					'E2E Tax Mixed Category'
				).should('not.exist');

				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Tax Mixed Leaf'
				).should('be.visible');
			});

			cy.getParentContainer(THEME_PRESET_GROUP_LABELS).within(() => {
				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Tax Simple Only'
				).should('be.visible');
			});
		});
	});

	describe('variable variations: shade stack on base preset (no taxonomy declarations)', () => {
		const MU = `${MU_FIX}/e2e-color-variations-no-taxonomy.php`;
		const MU_NAME = 'e2e-color-variations-no-taxonomy.php';

		before(() => {
			return activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		after(() => {
			return deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		it('shows collapsed shade stack on base row when a shade slug exists in theme palette', () => {
			openGlobalStylesColorPaletteScreen();

			cy.get('.blockera-color-palette-presets', {
				timeout: 20000,
			}).should('be.visible');

			withinThemePresetGroup(() => {
				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Var Shade Base'
				)
					.closest('[data-cy="repeater-item"]')
					.find('[data-cy="color-preset-shade-stack"]')
					.should('be.visible');
			});
		});

		it('site editor palette shows shade stack only (variations accordion is picker-only)', () => {
			openGlobalStylesColorPaletteScreen();

			withinThemePresetGroup(() => {
				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Var Shade Base',
					{ timeout: 20000 }
				)
					.closest('[data-cy="repeater-item"]')
					.find('[data-cy="color-preset-shade-stack"]')
					.should('be.visible');

				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Var Shade Base'
				)
					.parents('.blockera-control-repeater-item-variations-group')
					.should('not.exist');
			});
		});
	});

	describe('variable variations: flat theme colors in variable picker (no taxonomy)', () => {
		const MU = `${MU_FIX}/e2e-color-variations-no-taxonomy.php`;
		const MU_NAME = 'e2e-color-variations-no-taxonomy.php';

		before(() => {
			return activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		after(() => {
			return deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		it('selects the base color preset by slug from the Theme list in the picker', () => {
			openParagraphTextColorVariablePickerPopover();

			cy.getByDataTest('variable-picker-popover').within(() => {
				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Var Shade Base'
				).should('be.visible');
			});

			cy.selectValueAddonItem('e-2-e-var-base');

			getWPDataObject().then((data) => {
				const fontColor = getSelectedBlock(data, 'blockeraFontColor');

				expect(fontColor.settings.var).to.equal(
					'--wp--preset--color--e-2-e-var-base'
				);
			});
		});

		it('selects persisted shade after expanding variations accordion (strip not wired for flat rows)', () => {
			openParagraphTextColorVariablePickerPopover();

			expandColorPresetVariationsAccordionInVariablePicker(
				'E2E Var Shade Base'
			);

			cy.getByDataTest('variable-picker-popover').within(() => {
				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Var Shade Base'
				)
					.parents('.blockera-control-repeater-item-variations-group')
					.first()
					.contains('[data-cy="color-repeater-item-header"]', '500')
					.should('be.visible');
			});

			cy.selectValueAddonItem('e-2-e-var-base-shade-500');

			getWPDataObject().then((data) => {
				const fontColor = getSelectedBlock(data, 'blockeraFontColor');

				expect(fontColor.settings.var).to.equal(
					'--wp--preset--color--e-2-e-var-base-shade-500'
				);
			});
		});

		it('switches flat palette selection from shade back to base slug', () => {
			openParagraphTextColorVariablePickerPopover();

			expandColorPresetVariationsAccordionInVariablePicker(
				'E2E Var Shade Base'
			);

			cy.selectValueAddonItem('e-2-e-var-base-shade-500');

			getWPDataObject().then((data) => {
				expect(
					getSelectedBlock(data, 'blockeraFontColor').settings.var
				).to.equal('--wp--preset--color--e-2-e-var-base-shade-500');
			});

			reopenVariablePickerPopover();

			expandColorPresetVariationsAccordionInVariablePicker(
				'E2E Var Shade Base'
			);

			cy.selectValueAddonItem('e-2-e-var-base');

			getWPDataObject().then((data) => {
				expect(
					getSelectedBlock(data, 'blockeraFontColor').settings.var
				).to.equal('--wp--preset--color--e-2-e-var-base');
			});
		});
	});
});
