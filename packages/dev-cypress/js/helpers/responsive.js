export function setDeviceType(deviceType) {
	cy.waitForAssertValue();
	cy.getByAriaLabel('Breakpoints')
		.first()
		.within(() => {
			cy.getByAriaLabel(deviceType).click({ force: true });
		});
}
