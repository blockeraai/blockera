import { CheckboxControl } from '../..';

describe('checkbox control', () => {
	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	context('Default', () => {
		const checkboxLabel = 'Checkbox Label';
		it('renders input and label', () => {
			cy.withDataProvider({
				component: <CheckboxControl checkboxLabel={checkboxLabel} />,
			});

			cy.get('input[type=checkbox]');
			cy.contains(checkboxLabel);
		});

		it('get correct default value', () => {
			const checkboxLabel = 'Checkbox Label';
			cy.withDataProvider({
				component: <CheckboxControl checkboxLabel={checkboxLabel} />,
			});

			cy.get('.components-checkbox-control__input-container')
				.find('svg')
				.should('not.exist');
		});

		it('user can check and uncheck the checkbox by clicking on checkbox', () => {
			const checkboxLabel = 'Checkbox Label';
			cy.withDataProvider({
				component: <CheckboxControl checkboxLabel={checkboxLabel} />,
			});

			cy.get('input[type=checkbox]').as('checkbox');

			cy.get('@checkbox').click();
			cy.get('.components-checkbox-control__input-container')
				.find('svg')
				.should('exist');

			cy.get('@checkbox').click();
			cy.get('.components-checkbox-control__input-container')
				.find('svg')
				.should('not.exist');
		});

		it('user can check and uncheck the checkbox by clicking on label', () => {
			const checkboxLabel = 'Checkbox Label';
			cy.withDataProvider({
				component: <CheckboxControl checkboxLabel={checkboxLabel} />,
			});

			cy.contains(checkboxLabel).click();
			cy.get('.components-checkbox-control__input-container')
				.find('svg')
				.should('exist');

			cy.contains(checkboxLabel).click();
			cy.get('.components-checkbox-control__input-container')
				.find('svg')
				.should('not.exist');
		});

		it('the onChanged passed to control get called', () => {
			const checkboxLabel = 'Checkbox Label';
			const mockOnChange = cy.stub().as('mockOnChange');
			cy.withDataProvider({
				component: (
					<CheckboxControl
						checkboxLabel={checkboxLabel}
						onChange={mockOnChange}
					/>
				),
			});

			cy.get('input[type=checkbox]').as('checkbox');

			cy.get('@checkbox').click();
			cy.get('@checkbox').click();

			cy.get('@mockOnChange').should('have.been.calledTwice');
		});
	});

	context('Field', () => {
		it('renders label for checkbox', () => {
			const checkboxLabel = 'Checkbox Label';
			const fieldLabel = 'Field Label';
			cy.withDataProvider({
				component: (
					<CheckboxControl
						checkboxLabel={checkboxLabel}
						label={fieldLabel}
					/>
				),
			});

			cy.get('.publisher-field-label').contains(fieldLabel);
		});
	});

	context('useControlContext', () => {
		it('should retrieve data from useControlContext with simple value without id', () => {
			const checkboxLabel = 'Checkbox Label';
			cy.withDataProvider({
				component: <CheckboxControl checkboxLabel={checkboxLabel} />,
				value: true,
			});

			cy.get('.components-checkbox-control__input-container')
				.find('svg')
				.should('exist');
		});

		it('should retrieve data from useControlContext with complex value with id', () => {
			const checkboxLabel = 'Checkbox Label';
			cy.withDataProvider({
				component: (
					<CheckboxControl
						checkboxLabel={checkboxLabel}
						id="x.y[0].z"
					/>
				),
				value: {
					x: {
						y: [{ z: true }],
					},
				},
			});

			cy.get('.components-checkbox-control__input-container')
				.find('svg')
				.should('exist');
		});
	});
});
