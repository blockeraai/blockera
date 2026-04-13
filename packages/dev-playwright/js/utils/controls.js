/**
 * Controls helper utilities for Playwright e2e tests.
 */

const { openSettingsPanel } = require('./editor');

/**
 * Set input value in settings panel.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} panelName - Panel name to open.
 * @param {string} settingName - Setting name to find.
 * @param {string} value - Value to type.
 * @param {boolean} ignoreCase - Case sensitivity (default: true).
 * @return {Promise<void>}
 */
async function setInputValue(
	page,
	panelName,
	settingName,
	value,
	ignoreCase = true
) {
	await openSettingsPanel(
		page,
		ignoreCase ? new RegExp(panelName, 'i') : panelName
	);

	const sidebar = page.locator('.edit-post-sidebar');
	const settingSection = sidebar
		.locator(
			'text=' + (ignoreCase ? new RegExp(settingName, 'i') : settingName)
		)
		.filter({ hasNotText: '.block-editor-block-card__description' })
		.first();

	const input = settingSection.locator('..').locator('input[type="number"]');

	await input.focus();
	await input.fill(value);
}

/**
 * Set color settings foldable setting.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} settingName - Setting name ('background' or 'text').
 * @param {string} hexColor - Hex color value (e.g., '#ff0000').
 * @return {Promise<void>}
 */
async function setColorSettingsFoldableSetting(page, settingName, hexColor) {
	const formattedHex = hexColor.replace('#', '');

	const dropdown = page
		.locator('.block-editor-panel-color-gradient-settings__dropdown')
		.filter({ hasText: new RegExp(settingName, 'i') });

	await dropdown.click();
	await page.locator('.components-color-palette__custom-color').click();

	const colorPicker = page.locator('.components-color-picker');
	const input = colorPicker.locator('.components-input-control__input');

	await input.click();
	await input.clear();
	await input.fill(formattedHex);

	await dropdown.click({ force: true });
}

/**
 * Set color panel setting.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} settingName - Setting name.
 * @param {string} hexColor - Hex color value.
 * @return {Promise<void>}
 */
async function setColorPanelSetting(page, settingName, hexColor) {
	const formattedHex = hexColor.replace('#', '');

	const dropdown = page
		.locator('.block-editor-panel-color-gradient-settings__dropdown')
		.filter({ hasText: new RegExp(settingName, 'i') });

	await dropdown.click();
	await page.locator('.components-color-palette__custom-color').click();

	const colorPicker = page.locator('.components-color-picker');
	const input = colorPicker.locator('.components-input-control__input');

	await input.click();
	await input.clear();
	await input.fill(formattedHex);

	await dropdown.click();
}

/**
 * Toggle a checkbox in the settings panel.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} checkboxLabelText - Checkbox label text.
 * @return {Promise<void>}
 */
async function toggleSettingCheckbox(page, checkboxLabelText) {
	const label = page
		.locator('.components-toggle-control__label')
		.filter({ hasText: checkboxLabelText });

	const checkbox = label
		.locator('..')
		.locator('.components-base-control__field')
		.locator('.components-form-toggle__input');

	await checkbox.click();
}

module.exports = {
	setInputValue,
	setColorSettingsFoldableSetting,
	setColorPanelSetting,
	toggleSettingCheckbox,
};
