export function setDeviceType(deviceType) {
	cy.getByAriaLabel('Breakpoints').within(() => {
		cy.getByAriaLabel(deviceType).click();
	});
}
