import { setDeviceType } from '@blockera/dev-cypress/js/helpers';

/**
 * Set the device type for the editor.
 *
 * @param {string} device the device type.
 *
 * @return {void}
 */
export function setDevice(device) {
	if ('desktop' !== device) {
		if (
			!Cypress.$('iframe[name="editor-canvas"]')
				.find('body')
				.hasClass(`is-${device}-preview`)
		) {
			setDeviceType('Desktop');
			setDeviceType(device);

			return;
		}
	}

	setDeviceType('Desktop');
}
