import { createPost, setDeviceType } from '@blockera/dev-cypress/js/helpers';
import { experimental } from '@blockera/env';

if (experimental().get('editor.extensions.effectsExtension.divider')) {
	describe('Toggle Control', () => {
		beforeEach(() => {
			createPost();

			cy.getBlock('default').type('This is test paragraph', { delay: 0 });
			cy.getByDataTest('style-tab').click();

			// Add divider
			cy.getByAriaLabel('Add New Divider').click();

			//Alias
			cy.getParentContainer('Animation').within(() => {
				cy.get('input[type="checkbox"]').as('animation-checkbox');
			});

			cy.getByDataTest('divider-item-header').as('divider-item');
		});

		it('should display changed value on Divider/Animation -> Normal -> Desktop', () => {
			// Assert label before set value
			cy.getByAriaLabel('Animation').should(
				'not.have.class',
				'changed-in-normal-state'
			);

			// Set value
			cy.get('@animation-checkbox').click({ force: true });

			// Assert label after set value
			cy.getByAriaLabel('Animation').should(
				'have.class',
				'changed-in-normal-state'
			);

			// Assert control
			cy.get('@animation-checkbox')
				.parent()
				.should('have.class', 'is-checked');

			/**
			 * Tablet device
			 */
			setDeviceType('Tablet');
			cy.get('@divider-item').click();

			// Assert label
			cy.getByAriaLabel('Animation').should(
				'have.class',
				'changed-in-normal-state'
			);

			// Assert control
			cy.get('@animation-checkbox')
				.parent()
				.should('have.class', 'is-checked');

			// Assert state graph
			cy.checkStateGraph('', 'Animation', { desktop: ['Normal'] }, true);
		});

		it('should display changed value on Divider/Animation -> Normal -> Tablet', () => {
			setDeviceType('Tablet');
			cy.get('@divider-item').click();

			// Assert label before set value
			cy.getByAriaLabel('Animation').should(
				'not.have.class',
				'changed-in-normal-state'
			);

			// Set value
			cy.get('@animation-checkbox').click({ force: true });

			// Assert label after set value
			cy.getByAriaLabel('Animation').should(
				'have.class',
				'changed-in-normal-state'
			);

			// Assert control
			cy.get('@animation-checkbox')
				.parent()
				.should('have.class', 'is-checked');

			/**
			 * Desktop device
			 */
			setDeviceType('Desktop');
			cy.get('@divider-item').click();

			// Assert label
			cy.getByAriaLabel('Animation').should(
				'have.class',
				'changed-in-other-state'
			);

			// Assert control
			cy.get('@animation-checkbox')
				.parent()
				.should('not.have.class', 'is-checked');

			// Assert state graph
			cy.checkStateGraph('', 'Animation', { tablet: ['Normal'] }, true);
		});

		// TODO: add pseudo state test if this control is used in features which are available in pseudo states
		// TODO: reset
	});
}
