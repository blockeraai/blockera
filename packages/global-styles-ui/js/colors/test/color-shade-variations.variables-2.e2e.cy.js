/**
 * E2E tests focused on **color shade ramp / variable variations** (OKLCH stack UI, accordion ramp,
 * variable picker selection). Uses existing MU fixtures under `test/fixtures/`.
 */
import {
	assertBlockData,
	activateMuPlugin,
	deactivateMuPlugin,
	getSelectedBlock,
} from '@blockera/dev-cypress/js/helpers';
import { clearPresetVariablesViewModeStorage } from '@blockera/dev-cypress/js/helpers/preset-variables-view';
import {
	assertEditorThemeBaseHasMuColorTaxonomy,
	expandColorPresetVariationsAccordionInVariablePicker,
	getWPDataObject,
	MU_FIX,
	openGlobalStylesColorPaletteScreen,
	openParagraphTextColorVariablePickerPopover,
	reopenVariablePickerPopover,
	withinThemePresetGroup,
} from './e2e-variable-variations-helpers';

/** Compact stack preview steps: 100, 300, 500, 700, 900. */
const SHADE_STACK_SWATCH_COUNT = 5;

describe('Global Styles UI → Color shade variations (ramp & picker)', () => {
	describe('global styles: flat list shade stack & variations accordion', () => {
		const MU = `${MU_FIX}/e2e-color-variations-no-taxonomy.php`;
		const MU_NAME = 'e2e-color-variations-no-taxonomy.php';

		beforeEach(() => {
			clearPresetVariablesViewModeStorage();
			activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		afterEach(() => {
			deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		it('renders a full Tailwind-style shade indicator stack (one swatch per step)', () => {
			openGlobalStylesColorPaletteScreen();

			withinThemePresetGroup(() => {
				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Var Shade Base',
					{ timeout: 20000 }
				)
					.closest('[data-cy="repeater-item"]')
					.find('[data-cy="color-preset-shade-stack"]')
					.find('.blockera-component-color-indicator')
					.should('have.length', SHADE_STACK_SWATCH_COUNT);
			});
		});

		it('site editor palette omits variations accordion (shade stack only)', () => {
			openGlobalStylesColorPaletteScreen();

			withinThemePresetGroup(() => {
				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Var Shade Base',
					{ timeout: 20000 }
				)
					.parents('.blockera-control-repeater-item-variations-group')
					.should('not.exist');
			});
		});

		it('variable picker inline strip lists persisted shade row (500) in the ramp', () => {
			openParagraphTextColorVariablePickerPopover();

			cy.getByDataTest('variable-picker-popover').within(() => {
				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Var Shade Base',
					{ timeout: 20000 }
				)
					.find(
						'.blockera-component-preset-variable-variations-strip'
					)
					.contains('[data-cy="color-repeater-item-header"]', '500')
					.should('be.visible');
			});
		});
	});

	describe('variable picker: flat theme ramp selection', () => {
		const MU = `${MU_FIX}/e2e-color-variations-no-taxonomy.php`;
		const MU_NAME = 'e2e-color-variations-no-taxonomy.php';

		beforeEach(() => {
			clearPresetVariablesViewModeStorage();
			activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		afterEach(() => {
			deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		it('picker: selects persisted shade from inline strip via color indicator (no taxonomy)', () => {
			openParagraphTextColorVariablePickerPopover();

			cy.getByDataTest('variable-picker-popover').within(() => {
				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Var Shade Base'
				)
					.find(
						'.blockera-component-preset-variable-variations-strip'
					)
					.contains('[data-cy="color-repeater-item-header"]', '500')
					.find('.blockera-component-color-indicator')
					.first()
					.click({ force: true });
			});

			cy.get(
				'.blockera-component-popover.blockera-control-group-popover',
				{
					timeout: 1000,
				}
			).should('not.exist');

			assertBlockData((data) => {
				const fontColor = getSelectedBlock(data, 'blockeraFontColor');
				expect(fontColor.settings.var).to.equal(
					'--wp--preset--color--e-2-e-var-base-shade-500'
				);
			});
		});

		it('picker: selects persisted shade from inline strip (no taxonomy)', () => {
			openParagraphTextColorVariablePickerPopover();

			cy.getByDataTest('variable-picker-popover').within(() => {
				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Var Shade Base'
				).should('be.visible');
			});

			cy.selectValueAddonItem('e-2-e-var-base-shade-500');

			cy.get(
				'.blockera-component-popover.blockera-control-group-popover',
				{
					timeout: 1000,
				}
			).should('not.exist');

			assertBlockData((data) => {
				const fontColor = getSelectedBlock(data, 'blockeraFontColor');
				expect(fontColor.settings.var).to.equal(
					'--wp--preset--color--e-2-e-var-base-shade-500'
				);
			});
		});

		it('picker: selects base slug (anchor) from inline strip (no taxonomy)', () => {
			openParagraphTextColorVariablePickerPopover();

			cy.selectValueAddonItem('e-2-e-var-base');

			cy.get(
				'.blockera-component-popover.blockera-control-group-popover',
				{
					timeout: 1000,
				}
			).should('not.exist');

			assertBlockData((data) => {
				const fontColor = getSelectedBlock(data, 'blockeraFontColor');
				expect(fontColor.settings.var).to.equal(
					'--wp--preset--color--e-2-e-var-base'
				);
			});
		});

		it('selects persisted shade slug after expanding the variations accordion', () => {
			openParagraphTextColorVariablePickerPopover();

			expandColorPresetVariationsAccordionInVariablePicker(
				'E2E Var Shade Base'
			);

			cy.selectValueAddonItem('e-2-e-var-base-shade-500');

			assertBlockData((data) => {
				const fontColor = getSelectedBlock(data, 'blockeraFontColor');
				expect(fontColor.settings.var).to.equal(
					'--wp--preset--color--e-2-e-var-base-shade-500'
				);
			});
		});

		it('switches variable selection from shade preset back to base preset slug', () => {
			openParagraphTextColorVariablePickerPopover();

			expandColorPresetVariationsAccordionInVariablePicker(
				'E2E Var Shade Base'
			);
			cy.selectValueAddonItem('e-2-e-var-base-shade-500');

			assertBlockData((data) => {
				expect(
					getSelectedBlock(data, 'blockeraFontColor').settings.var
				).to.equal('--wp--preset--color--e-2-e-var-base-shade-500');
			});

			reopenVariablePickerPopover();

			expandColorPresetVariationsAccordionInVariablePicker(
				'E2E Var Shade Base'
			);

			cy.selectValueAddonItem('e-2-e-var-base');

			assertBlockData((data) => {
				expect(
					getSelectedBlock(data, 'blockeraFontColor').settings.var
				).to.equal('--wp--preset--color--e-2-e-var-base');
			});
		});
	});

	describe('taxonomy + shades: global styles & picker strip', () => {
		const MU = `${MU_FIX}/e2e-color-taxonomy-category-variations.php`;
		const MU_NAME = 'e2e-color-taxonomy-category-variations.php';

		beforeEach(() => {
			activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		afterEach(() => {
			deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		it('shows shade stack on taxonomy base row after category expand', () => {
			openGlobalStylesColorPaletteScreen();

			assertEditorThemeBaseHasMuColorTaxonomy(
				'e-2-e-tax-cat-var-base',
				'E2E Tax Var Ramp Group/E2E Tax Var Ramp Category/E2E Tax Cat Var Base'
			);

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
					'E2E Tax Cat Var Base',
					{ timeout: 20000 }
				)
					.closest('[data-cy="repeater-item"]')
					.find('[data-cy="color-preset-shade-stack"]')
					.should('be.visible');
			});
		});

		it('picker: selects shade from taxonomy inline strip after category expand', () => {
			openParagraphTextColorVariablePickerPopover();

			cy.getByDataTest('variable-picker-popover').within(() => {
				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Tax Cat Var Base'
				).should('be.visible');
			});

			cy.selectValueAddonItem('e-2-e-tax-cat-var-base-shade-500');

			assertBlockData((data) => {
				const fontColor = getSelectedBlock(data, 'blockeraFontColor');
				expect(fontColor.settings.var).to.equal(
					'--wp--preset--color--e-2-e-tax-cat-var-base-shade-500'
				);
			});
		});

		it('picker: selects taxonomy base slug (anchor) from strip', () => {
			openParagraphTextColorVariablePickerPopover();

			cy.getByDataTest('variable-picker-popover').within(() => {
				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Tax Cat Var Base'
				).should('be.visible');
			});

			cy.selectValueAddonItem('e-2-e-tax-cat-var-base');

			assertBlockData((data) => {
				const fontColor = getSelectedBlock(data, 'blockeraFontColor');
				expect(fontColor.settings.var).to.equal(
					'--wp--preset--color--e-2-e-tax-cat-var-base'
				);
			});
		});
	});
});
