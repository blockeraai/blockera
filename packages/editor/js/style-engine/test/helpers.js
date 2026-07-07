import { setDeviceType } from '@blockera/dev-cypress/js/helpers';

const isBreakpointPreviewActive = (device) => {
	const normalized = device.trim().toLowerCase();
	const $iframe = Cypress.$('iframe[name="editor-canvas"]').first();

	if (!$iframe.length) {
		return false;
	}

	return $iframe.hasClass(`blockera-breakpoint-${normalized}`);
};

/**
 * Set the device type for the editor.
 *
 * @param {string} device the device type label (e.g. Desktop, Tablet).
 *
 * @return {void}
 */
export function setDevice(device) {
	const normalized = device.trim().toLowerCase();

	if (normalized === 'desktop') {
		setDeviceType('Desktop');
		return;
	}

	if (!isBreakpointPreviewActive(normalized)) {
		setDeviceType('Desktop');
		setDeviceType(device);
	}

	cy.get('iframe[name="editor-canvas"]').should(
		'have.class',
		`blockera-breakpoint-${normalized}`
	);
}
