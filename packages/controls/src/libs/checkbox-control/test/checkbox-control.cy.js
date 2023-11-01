import { CheckboxControl } from '../..';
import { getControlValue } from '../../../store/selectors';

describe('checkbox control', () => {
	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	context('Rendering Tests', () => {
		const checkboxLabel = 'Checkbox Label';

		it('should renders input with type checkbox and label for checkbox control', () => {
			cy.withDataProvider({
				component: <CheckboxControl checkboxLabel={checkboxLabel} />,
			});

			cy.get('input[type=checkbox]');
			cy.contains(checkboxLabel);
		});

		it('should render label for checkbox when label is passed.', () => {
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

			cy.getByDataCy('label-control').contains(fieldLabel);
		});
	});

	context('Functional Tests', () => {
		it('user can check and uncheck the checkbox by clicking on checkbox', () => {
			const checkboxLabel = 'Checkbox Label';
			cy.withDataProvider({
				component: <CheckboxControl checkboxLabel={checkboxLabel} />,
				name,
			});

			cy.get('input[type=checkbox]').as('checkbox');

			// visual assertion : check
			cy.get('@checkbox').click();
			cy.get('.components-checkbox-control__input-container').find('svg');
			cy.get('@checkbox').should('have.attr', 'aria-checked', 'true');

			// data assertion : check
			cy.get('@checkbox').then(() => {
				expect(getControlValue(name)).to.be.equal(true);
			});

			// visual assertion : un-check
			cy.get('@checkbox').click();
			cy.get('.components-checkbox-control__input-container')
				.find('svg')
				.should('not.exist');
			cy.get('@checkbox').should('have.attr', 'aria-checked', 'false');

			// data assertion : un-check
			cy.get('@checkbox').then(() => {
				expect(getControlValue(name)).to.be.equal(undefined);
			});
		});

		it('user can check and uncheck the checkbox by clicking on label', () => {
			const checkboxLabel = 'Checkbox Label';
			cy.withDataProvider({
				component: <CheckboxControl checkboxLabel={checkboxLabel} />,
				name,
			});

			cy.get('input[type=checkbox]').as('checkbox');
			cy.contains(checkboxLabel).click();

			// visual assertion : check
			cy.get('.components-checkbox-control__input-container')
				.find('svg')
				.should('exist');
			cy.get('@checkbox').should('have.attr', 'aria-checked', 'true');

			// data assertion : check
			cy.get('@checkbox').then(() => {
				expect(getControlValue(name)).to.be.equal(true);
			});

			// visual assertion : un-check
			cy.contains(checkboxLabel).click();
			cy.get('.components-checkbox-control__input-container')
				.find('svg')
				.should('not.exist');
			cy.get('@checkbox').should('have.attr', 'aria-checked', 'false');

			// data assertion : un-check
			cy.get('@checkbox').then(() => {
				expect(getControlValue(name)).to.be.equal(undefined);
			});
		});
	});

	context('Initial value', () => {
		const checkboxLabel = 'Checkbox Label';

		// 1.
		it('calculated data must be defaultValue, when defaultValue(ok) && id(!ok) value(undefined)', () => {
			cy.withDataProvider({
				component: (
					<CheckboxControl
						checkboxLabel={checkboxLabel}
						defaultValue={true}
					/>
				),
				value: undefined,
			});

			cy.get('input[type=checkbox]').as('checkbox');
			cy.get('@checkbox').should('have.attr', 'aria-checked', 'true');
		});

		// 2.
		it('calculated defaultValue must be value, when defaultValue(ok) && id(!ok) && value(ok)', () => {
			cy.withDataProvider({
				component: (
					<CheckboxControl
						checkboxLabel={checkboxLabel}
						defaultValue={true}
						id="x.y"
					/>
				),
				value: false,
			});

			cy.get('input[type=checkbox]').as('checkbox');
			cy.get('@checkbox').should('have.attr', 'aria-checked', 'true');
		});

		// 3.
		it('calculated data must be defaultValue, when defaultValue(ok) && id(ok) && value(undefined)', () => {
			cy.withDataProvider({
				component: (
					<CheckboxControl
						checkboxLabel={checkboxLabel}
						id="x[0].b[0].c"
						defaultValue={true}
					/>
				),
				value: {
					x: [
						{
							b: [
								{
									c: undefined,
								},
							],
						},
					],
				},
			});

			cy.get('input[type=checkbox]').as('checkbox');
			cy.get('@checkbox').should('have.attr', 'aria-checked', 'true');
		});

		// 4.
		it('calculated data must be value, when id(!ok), defaultValue(!ok), value(root)', () => {
			cy.withDataProvider({
				component: <CheckboxControl checkboxLabel={checkboxLabel} />,
				value: true,
			});

			cy.get('input[type=checkbox]').as('checkbox');
			cy.get('@checkbox').should('have.attr', 'aria-checked', 'true');
		});
	});
});
