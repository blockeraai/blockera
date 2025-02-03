export function setDeviceType(deviceType) {
	cy.getByAriaLabel('Breakpoints')
		.first()
		.within(() => {
			cy.getByAriaLabel(deviceType).click({ force: true });
		});
}
