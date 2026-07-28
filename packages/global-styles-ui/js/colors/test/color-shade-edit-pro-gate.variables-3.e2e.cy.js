/**
 * Free-tier E2E: editing shade-ramp colors in the preset edit popover is Pro-gated
 * and opens the UpgradePrompt instead of the color picker.
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
	getCustomPresetEditPopover,
} from '@blockera/dev-cypress/js/helpers';
import { clearPresetVariablesViewModeStorage } from '@blockera/dev-cypress/js/helpers/preset-variables-view';
import {
	assertColorPickerPopoverNotPresent,
	assertColorShadeEditUpgradePromptVisible,
	clickShadeRampSwatchInCustomPresetEditPopover,
	MU_FIX,
	openThemeColorPresetEditPopoverFromPalette,
} from './e2e-variable-variations-helpers';

const MU = `${MU_FIX}/e2e-color-variations-no-taxonomy.php`;
const MU_NAME = 'e2e-color-variations-no-taxonomy.php';
const BASE_PRESET_LABEL = 'E2E Var Shade Base';

describe('Global Styles UI → Color shade edit Pro gate (free)', () => {
	beforeEach(() => {
		clearPresetVariablesViewModeStorage();
		activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	afterEach(() => {
		deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	it('opens UpgradePrompt when clicking a shade ramp swatch; color picker stays closed', () => {
		openThemeColorPresetEditPopoverFromPalette(BASE_PRESET_LABEL);

		getCustomPresetEditPopover().within(() => {
			cy.contains('label', 'Enable Color Shades', {
				timeout: 20000,
			}).should('be.visible');
			cy.get(
				'.blockera-component-editor-variable-variations-fields-wrapper [data-cy="color-btn"]',
				{ timeout: 20000 }
			).should('have.length.at.least', 2);
		});

		clickShadeRampSwatchInCustomPresetEditPopover(0);

		assertColorShadeEditUpgradePromptVisible();
		assertColorPickerPopoverNotPresent();

		cy.realPress('Escape');

		cy.getByDataTest('promote-color-shade-edit').should('not.exist');
		getCustomPresetEditPopover().should('be.visible');
	});
});
