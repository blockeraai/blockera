/**
 * E2E tests focused on **color shade ramp / variable variations** (OKLCH stack UI, accordion ramp,
 * variable picker selection). Uses existing MU fixtures under `test/fixtures/`.
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
	getSelectedBlock,
} from '@blockera/dev-cypress/js/helpers';
import {
	assertEditorThemeBaseHasMuColorTaxonomy,
	expandColorPresetVariationsAccordionInVariablePicker,
	expandColorPresetVariationsAccordionOnPaletteScreen,
	expandTaxonomyCategoryAccordion,
	expandTaxonomyCategoryAccordionInVariablePicker,
	getWPDataObject,
	MU_FIX,
	openGlobalStylesColorPaletteScreen,
	openParagraphTextColorVariablePickerPopover,
} from './e2e-variable-variations-helpers';

/** Matches COLOR_SHADE_STEPS length in `color-shades-generator.ts` (50–950 ramp). */
const SHADE_STACK_SWATCH_COUNT = 11;

describe('Global Styles UI → Color shade variations (ramp & picker)', () => {
	describe('global styles: flat list shade stack & variations accordion', () => {
		const MU = `${MU_FIX}/e2e-color-variations-no-taxonomy.php`;
		const MU_NAME = 'e2e-color-variations-no-taxonomy.php';

		beforeEach(() => {
			activateMuPlugin(MU, MU_NAME);
		});

		afterEach(() => {
			deactivateMuPlugin(MU, MU_NAME);
		});

		it('renders a full Tailwind-style shade indicator stack (one swatch per step)', () => {
			openGlobalStylesColorPaletteScreen();

			cy.getParentContainer('Theme').within(() => {
				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Var Shade Base',
					{ timeout: 20000 }
				)
					.closest('[data-cy="repeater-item"]')
					.find('[data-cy="color-preset-shade-stack"]')
					.find('.global-styles-color-shade-swatch--indicator-stack')
					.should('have.length', SHADE_STACK_SWATCH_COUNT);
			});
		});

		it('opens variations accordion and shows generated/persisted shade row (500) in the ramp', () => {
			openGlobalStylesColorPaletteScreen();

			cy.getParentContainer('Theme').within(() => {
				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Var Shade Base',
					{ timeout: 20000 }
				)
					.parents('.blockera-control-repeater-item-variations-group')
					.first()
					.find('.blockera-control-btn-toggle')
					.click({ force: true });

				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Var Shade Base'
				)
					.parents('.blockera-control-repeater-item-variations-group')
					.first()
					.should('have.class', 'is-open');

				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Var Shade Base - Shade 500'
				).should('be.visible');
			});
		});

		it('palette screen: expands accordion from helper used by shade workflow', () => {
			openGlobalStylesColorPaletteScreen();
			expandColorPresetVariationsAccordionOnPaletteScreen(
				'E2E Var Shade Base'
			);

			cy.getParentContainer('Theme').within(() => {
				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Var Shade Base - Shade 500'
				).should('be.visible');
			});
		});
	});

	describe('variable picker: flat theme ramp selection', () => {
		const MU = `${MU_FIX}/e2e-color-variations-no-taxonomy.php`;
		const MU_NAME = 'e2e-color-variations-no-taxonomy.php';

		beforeEach(() => {
			activateMuPlugin(MU, MU_NAME);
		});

		afterEach(() => {
			deactivateMuPlugin(MU, MU_NAME);
		});

		it('selects persisted shade slug after expanding the variations accordion', () => {
			openParagraphTextColorVariablePickerPopover();

			expandColorPresetVariationsAccordionInVariablePicker(
				'E2E Var Shade Base'
			);

			cy.getByDataTest('variable-picker-popover').within(() => {
				cy.contains(
					'[data-cy="color-repeater-item-header"]',
					'E2E Var Shade Base - Shade 500'
				).should('be.visible');
			});

			cy.selectValueAddonItem('e-2-e-var-base-shade-500');

			getWPDataObject().then((data) => {
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

			getWPDataObject().then((data) => {
				expect(
					getSelectedBlock(data, 'blockeraFontColor').settings.var
				).to.equal('--wp--preset--color--e-2-e-var-base-shade-500');
			});

			cy.openValueAddon();

			cy.getByDataTest('variable-picker-popover', {
				timeout: 20000,
			}).should('be.visible');

			cy.selectValueAddonItem('e-2-e-var-base');

			getWPDataObject().then((data) => {
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
			activateMuPlugin(MU, MU_NAME);
		});

		afterEach(() => {
			deactivateMuPlugin(MU, MU_NAME);
		});

		it('shows shade stack on taxonomy base row after category expand', () => {
			openGlobalStylesColorPaletteScreen();

			assertEditorThemeBaseHasMuColorTaxonomy(
				'e-2-e-tax-var-ramp',
				'e-2-e-tax-cat-var-base'
			);

			expandTaxonomyCategoryAccordion('E2E Tax Var Ramp Category');

			cy.contains(
				'[data-cy="color-repeater-item-header"]',
				'E2E Tax Cat Var Base',
				{ timeout: 20000 }
			)
				.closest('[data-cy="repeater-item"]')
				.find('[data-cy="header-values"]')
				.find('[data-cy="color-preset-shade-stack"]')
				.should('be.visible');
		});

		it('picker: selects shade from taxonomy inline strip after category expand', () => {
			openParagraphTextColorVariablePickerPopover();

			expandTaxonomyCategoryAccordionInVariablePicker(
				'E2E Tax Var Ramp Category'
			);

			cy.selectValueAddonItem('e-2-e-tax-cat-var-base-shade-500');

			getWPDataObject().then((data) => {
				const fontColor = getSelectedBlock(data, 'blockeraFontColor');
				expect(fontColor.settings.var).to.equal(
					'--wp--preset--color--e-2-e-tax-cat-var-base-shade-500'
				);
			});
		});

		it('picker: selects taxonomy base slug (anchor) from strip', () => {
			openParagraphTextColorVariablePickerPopover();

			expandTaxonomyCategoryAccordionInVariablePicker(
				'E2E Tax Var Ramp Category'
			);

			cy.selectValueAddonItem('e-2-e-tax-cat-var-base');

			getWPDataObject().then((data) => {
				const fontColor = getSelectedBlock(data, 'blockeraFontColor');
				expect(fontColor.settings.var).to.equal(
					'--wp--preset--color--e-2-e-tax-cat-var-base'
				);
			});
		});
	});
});
