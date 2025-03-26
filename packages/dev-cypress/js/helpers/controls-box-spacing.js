/**
 * Set a box spacing side value
 *
 * @param {string}  side   	Name of the panel to open
 * @param {string}  value   The value to type
 */
export function setBoxSpacingSide(side, value) {
	openBoxSpacingSide(side);

	cy.get('[data-wp-component="Popover"]')
		.last()
		.within(() => {
			cy.get('input[type=text]').clear({ force: true });
			cy.get('input[type=text]').clear({ force: true });
			cy.get('input[type=text]').type(value, { delay: 0, force: true });
		});
}

/**
 * Clear box spacing side value
 *
 * @param {string}  side   	Name of the panel to open
 */
export function clearBoxSpacingSide(side) {
	openBoxSpacingSide(side);

	cy.get('[data-wp-component="Popover"]')
		.last()
		.within(() => {
			cy.get('input[type=text]').clear({ force: true });
			cy.get('input[type=text]').clear({ force: true });
		});
}

/**
 * Open box spacing side popover
 *
 * @param {string}  side   Name of the panel to open
 */
export function openBoxSpacingSide(side, element = 'label') {
	if (element === 'label') {
		cy.get(
			`[data-cy="box-spacing-${side}"] [data-cy="label-control"]`
		).click();
	} else if (element === 'shape') {
		cy.get(`[data-cy="box-spacing-control"]`).within(() => {
			cy.get(
				`path.blockera-control-spacing-shape-side.side-${side}`
			).then(($el) => {
				// Get the center coordinates of the path element
				const bbox = $el[0].getBBox();
				const x = bbox.x + bbox.width / 2;
				const y = bbox.y + bbox.height / 2;

				// Click at the calculated coordinates
				cy.wrap($el)
					.trigger('mouseover', x, y, { force: true })
					.trigger('mousedown', x, y, { force: true })
					.wait(100)
					.trigger('mouseup', x, y, { force: true })
					.trigger('click', x, y, { force: true });
			});
		});
	}
}
