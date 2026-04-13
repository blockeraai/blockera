/**
 * Set a box spacing side value
 *
 * @param {string}  side   	Name of the panel to open
 * @param {string}  value   The value to type
 */
export function setBoxSpacingSide(side, value, variable = false) {
	openBoxSpacingSide(side);

	if (variable) {
		cy.get(`.blockera-control.spacing-` + side)
			.scrollIntoView()
			.within(($element) => {
				const openBtn = Cypress.$($element).find(
					'.blockera-control-value-addon-pointers.active-addon-pointers [data-cy="value-addon-btn-open"]'
				);

				if (openBtn.length > 0) {
					cy.clickValueAddonButton();
				} else {
					cy.openValueAddon();
				}
			});

		cy.selectValueAddonItem(value);
	} else {
		cy.get(`input[data-test="${side}"]`).clear({ force: true });
		cy.get(`input[data-test="${side}"]`).type(value, {
			delay: 0,
			force: true,
		});
	}
}

/**
 * Clear box spacing side value
 *
 * @param {string}  side   	Name of the panel to open
 */
export function clearBoxSpacingSide(side, variable = false) {
	openBoxSpacingSide(side);

	if (variable) {
		cy.get(`.blockera-control.spacing-` + side)
			.scrollIntoView()
			.within(() => {
				cy.removeValueAddon();
			});
	} else {
		cy.get(`input[data-test="${side}"]`).clear({ force: true });
	}
}

/**
 * Open box spacing side popover
 *
 * @param {string}  side   Name of the panel to open
 */
export function openBoxSpacingSide(side) {
	const sideType = side.includes('padding') ? 'padding' : 'margin';

	const edgesList = [
		`${sideType}-top`,
		`${sideType}-right`,
		`${sideType}-bottom`,
		`${sideType}-left`,
	];

	const lockedEdgesList = [
		`${sideType}-top-bottom`,
		`${sideType}-left-right`,
	];

	cy.get(
		`.blockera-field-box-spacing-${sideType} button[data-test="${sideType}-lock"]`
	).then((element) => {
		if (edgesList.includes(side)) {
			if (!element.hasClass('is-toggled')) {
				element.click();
			}
		} else if (lockedEdgesList.includes(side)) {
			if (element.hasClass('is-toggled')) {
				element.click();
			}
		}
	});
}
