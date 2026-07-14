/**
 * E2E tests for color shade preset edit interactions in the variable picker:
 * - nested shade rows stay collapsed when the variations accordion expands
 * - main preset edit popover opens while the variations accordion is open
 * - edit popover and variable picker stay open during inner control clicks
 * - variable picker stays open when re-activating the already-bound base preset
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
	getCustomPresetEditPopover,
} from '@blockera/dev-cypress/js/helpers';
import { clearPresetVariablesViewModeStorage } from '@blockera/dev-cypress/js/helpers/preset-variables-view';
import {
	assertNestedShadeRowsHaveNoOpenEditPopover,
	assertVariablePickerPopoverVisible,
	clickEnableColorShadesToggleInCustomPresetEditPopover,
	clickEnableColorShadesToggleInEditPopoverScope,
	expandColorPresetVariationsAccordionInVariablePicker,
	MU_FIX,
	openColorPresetEditPopoverInVariablePicker,
	openParagraphTextColorVariablePickerPopover,
	prepareSelectedBaseColorPresetEditSessionInPicker,
	withinVariablePickerPopover,
} from './e2e-variable-variations-helpers';

const MU = `${MU_FIX}/e2e-color-variations-no-taxonomy.php`;
const MU_NAME = 'e2e-color-variations-no-taxonomy.php';
const BASE_PRESET_LABEL = 'E2E Var Shade Base';
const BASE_PRESET_SLUG = 'e-2-e-var-base';

function assertEditPopoverAndPickerRemainOpen() {
	getCustomPresetEditPopover().should('be.visible');
	assertVariablePickerPopoverVisible();
}

describe('Global Styles UI → Color shade edit interaction (variable picker)', () => {
	beforeEach(() => {
		clearPresetVariablesViewModeStorage();
		activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	afterEach(() => {
		deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	it('keeps nested shade rows collapsed when the variations accordion expands', () => {
		openParagraphTextColorVariablePickerPopover();

		expandColorPresetVariationsAccordionInVariablePicker(BASE_PRESET_LABEL);

		assertNestedShadeRowsHaveNoOpenEditPopover(BASE_PRESET_LABEL);
	});

	it('opens the main preset edit popover while the variations accordion is open', () => {
		openParagraphTextColorVariablePickerPopover();

		openColorPresetEditPopoverInVariablePicker(BASE_PRESET_LABEL);

		getCustomPresetEditPopover().should('be.visible');
		assertVariablePickerPopoverVisible();
	});

	it('keeps the edit popover open when clicking inner shade toggle controls on the selected base preset', () => {
		prepareSelectedBaseColorPresetEditSessionInPicker(
			BASE_PRESET_LABEL,
			BASE_PRESET_SLUG
		);

		getCustomPresetEditPopover().should('be.visible');

		getCustomPresetEditPopover().within(() => {
			clickEnableColorShadesToggleInEditPopoverScope();

			cy.contains('Shade variables will be removed', {
				timeout: 20000,
			}).should('be.visible');

			cy.contains(
				'I understand the shade variables will be removed and may affect existing blocks.',
				{ timeout: 20000 }
			).click({ force: true });

			cy.contains('button', 'Discard').click({ force: true });
		});

		assertEditPopoverAndPickerRemainOpen();
	});

	it('keeps the variable picker open when toggling shades off on the selected base preset', () => {
		prepareSelectedBaseColorPresetEditSessionInPicker(
			BASE_PRESET_LABEL,
			BASE_PRESET_SLUG
		);

		clickEnableColorShadesToggleInCustomPresetEditPopover();
		assertVariablePickerPopoverVisible();
		getCustomPresetEditPopover()
			.contains('Shade variables will be removed')
			.should('be.visible');
	});
});
