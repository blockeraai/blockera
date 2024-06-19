/**
 * Set a value within the input box
 *
 * @param {string}  panelName   Name of the panel to open
 * @param {string}  settingName The name of the setting to search for
 * @param {string}  value       The value to type
 * @param {boolean} ignoreCase  Optional case sensitivity. Default will ignore case.
 */
export function setInputValue(
	panelName,
	settingName,
	value,
	ignoreCase = true
) {
	openSettingsPanel(ignoreCase ? RegExp(panelName, 'i') : panelName);
	// eslint-disable-next-line
	cy.get('.edit-post-sidebar')
		.contains(ignoreCase ? RegExp(settingName, 'i') : settingName)
		.not('.block-editor-block-card__description')
		.then(($settingSection) => {
			// eslint-disable-next-line
			cy.get(Cypress.$($settingSection).parent())
				.find('input[type="number"]')
				.focus()
				.type(`{selectall}${value}`);
		});
}

/**
 * Set a Color Setting value to a custom hex color
 *
 * @param {string} settingName The setting to update. background|text
 * @param {string} hexColor
 */
export function setColorSettingsFoldableSetting(settingName, hexColor) {
	const formattedHex = hexColor.split('#')[1];

	cy.get('.block-editor-panel-color-gradient-settings__dropdown')
		.contains(settingName, { matchCase: false })
		.click();
	cy.get('.components-color-palette__custom-color').click();
	// eslint-disable-next-line
	cy.get('.components-color-picker')
		.find('.components-input-control__input')
		.click()
		.clear()
		.type(formattedHex);

	cy.get('.block-editor-panel-color-gradient-settings__dropdown')
		.contains(settingName, { matchCase: false })
		.click({ force: true });
}

export function setColorPanelSetting(settingName, hexColor) {
	const formattedHex = hexColor.split('#')[1];

	cy.get('.block-editor-panel-color-gradient-settings__dropdown')
		.contains(settingName, { matchCase: false })
		.click();
	cy.get('.components-color-palette__custom-color').click();
	// eslint-disable-next-line
	cy.get('.components-color-picker')
		.find('.components-input-control__input')
		.click()
		.clear()
		.type(formattedHex);

	cy.get('.block-editor-panel-color-gradient-settings__dropdown')
		.contains(settingName, { matchCase: false })
		.click();
}

/**
 * Toggle an checkbox in the settings panel of the block editor
 *
 * @param {string} checkboxLabelText The checkbox label text. eg: Drop Cap
 */
export function toggleSettingCheckbox(checkboxLabelText) {
	cy.get('.components-toggle-control__label')
		.contains(checkboxLabelText)
		.closest('.components-base-control__field')
		.find('.components-form-toggle__input')
		.click();
}
