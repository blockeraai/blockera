/**
 * Basic E2E coverage for **color variable variations** (preset shade ramp UI + variable picker entry).
 * Deeper ramp/accordion/strip scenarios live in `js/colors/test/color-shade-variations.e2e.cy.js`.
 */
import {
	assertBlockData,
	activateMuPlugin,
	deactivateMuPlugin,
	getSelectedBlock,
} from '@blockera/dev-cypress/js/helpers';
import {
	assertEditorThemeBaseHasMuColorTaxonomy,
	getWPDataObject,
	MU_FIX,
	openGlobalStylesColorPaletteScreen,
	openParagraphTextColorVariablePickerPopover,
	withinThemePresetGroup,
} from '../colors/test/e2e-variable-variations-helpers';

describe('Global Styles UI → Variable variations (basic, colors)', () => {
	describe('flat theme palette: base + persisted shade (no taxonomy)', () => {
		const MU = `${MU_FIX}/e2e-color-variations-no-taxonomy.php`;
		const MU_NAME = 'e2e-color-variations-no-taxonomy.php';

		beforeEach(() => {
			activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		afterEach(() => {
			deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		it('exposes a Theme color row wired for variable variations (shade stack on site editor)', () => {
			openGlobalStylesColorPaletteScreen();

			cy.get('.blockera-color-palette-presets', {
				timeout: 20000,
			}).should('be.visible');

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

		it('paragraph Text Color variable picker lists the Theme base preset and applies base slug', () => {
			openParagraphTextColorVariablePickerPopover();

			cy.getByDataTest('variable-picker-popover').within(() => {
				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Var Shade Base'
				).should('be.visible');
			});

			cy.selectValueAddonItem('e-2-e-var-base');

			assertBlockData((data) => {
				const fontColor = getSelectedBlock(data, 'blockeraFontColor');
				expect(fontColor.isValueAddon).to.equal(true);
				expect(fontColor.valueType).to.equal('variable');
				expect(fontColor.settings.var).to.equal(
					'--wp--preset--color--e-2-e-var-base'
				);
			});
		});
	});

	describe('taxonomy group shell coexists with variable-variations data path', () => {
		const MU = `${MU_FIX}/e2e-color-taxonomy-group-direct.php`;
		const MU_NAME = 'e2e-color-taxonomy-group-direct.php';

		beforeEach(() => {
			activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		afterEach(() => {
			deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
		});

		it('loads name-based color taxonomy bridge after MU theme.json layer', () => {
			openGlobalStylesColorPaletteScreen();

			cy.get('.blockera-color-palette-presets', {
				timeout: 20000,
			}).should('be.visible');

			assertEditorThemeBaseHasMuColorTaxonomy(
				'e-2-e-tax-root-alpha',
				'E2E Tax Root Group/E2E Tax Root Alpha'
			);

			cy.contains(
				'.blockera-preset-taxonomy-group-shell',
				'E2E Tax Root Group',
				{
					timeout: 20000,
				}
			)
				.scrollIntoView()
				.should('exist');

			cy.get('.blockera-preset-taxonomy-repeater', {
				timeout: 20000,
			}).should('exist');

			cy.contains(
				'[data-cy="color-repeater-item-header"]',
				'E2E Tax Root Alpha'
			).should('exist');
		});
	});
});
