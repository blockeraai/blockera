import LayoutMatrixControl from '..';
import { getControlValue } from '../../../store/selectors';
import { nanoid } from 'nanoid';
//dense

describe('Layout Matrix Control component testing', () => {
	beforeEach(() => {
		cy.viewport(1280, 720);
	});
	const value = {
		direction: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		dense: false,
	};

	describe('rendering test', () => {
		it('should render correctly', () => {
			cy.withDataProvider({
				component: <LayoutMatrixControl />,
			});

			cy.getByDataTest('layout-matrix').should('exist');
			cy.contains('Dense').should('not.exist');
		});

		it('should render correctly, with defaultValue', () => {
			cy.withDataProvider({
				component: (
					<LayoutMatrixControl
						defaultValue={{
							direction: 'column',
							alignItems: '',
							justifyContent: '',
							dense: false,
						}}
					/>
				),
			});

			cy.getByAriaLabel('Column').should(
				'have.attr',
				'aria-Checked',
				'true'
			);
		});

		it('should render correctly, with value', () => {
			cy.withDataProvider({
				component: <LayoutMatrixControl />,
				value,
			});

			cy.getByAriaLabel('Row').should(
				'have.attr',
				'aria-Checked',
				'true'
			);
		});

		it('should render correctly, when direction inactive', () => {
			cy.withDataProvider({
				component: <LayoutMatrixControl isDirectionActive={false} />,
				value,
			});

			cy.getByAriaLabel('Row').should('not.exist');
		});

		it('should render correctly, when dense active', () => {
			cy.withDataProvider({
				component: <LayoutMatrixControl isDenseActive={true} />,
				value,
			});

			cy.contains('Dense');
		});
	});

	describe('interaction test', () => {
		describe('Direction', () => {
			it('should set column direction', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <LayoutMatrixControl />,
					value,
					name,
				});

				// Check control
				cy.getByDataTest('matrix-normal-center-center-row').should(
					'exist'
				);

				cy.getByAriaLabel('Column').click();

				cy.getByDataTest('matrix-normal-center-center-row').should(
					'not.exist'
				);
				cy.getByDataTest('matrix-normal-center-center-column').should(
					'exist'
				);

				// Check data provider
				cy.get('body').then(() => {
					expect('column').to.be.deep.equal(
						getControlValue(name).direction
					);
				});
			});

			it('should set row direction', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <LayoutMatrixControl />,
					value: { ...value, direction: 'column' },
					name,
				});

				// Check control
				cy.getByDataTest('matrix-normal-center-center-column').should(
					'exist'
				);

				cy.getByAriaLabel('Row').click();

				cy.getByDataTest('matrix-normal-center-center-column').should(
					'not.exist'
				);
				cy.getByDataTest('matrix-normal-center-center-row').should(
					'exist'
				);

				// Check data provider
				cy.get('body').then(() => {
					expect('row').to.be.deep.equal(
						getControlValue(name).direction
					);
				});
			});
		});

		describe('Dense', () => {
			it('should set dense correctly', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <LayoutMatrixControl isDenseActive={true} />,
					value,
					name,
				});

				cy.contains('Dense').click();
				cy.get('input[type="checkbox"]').should(
					'have.attr',
					'aria-checked',
					'true'
				);
			});
		});

		describe('Justify Content & Align Items', () => {
			const setCustomSelectOption = (index, option) => {
				cy.get('button[aria-haspopup="listbox"]').eq(index).click();
				cy.get('ul[aria-hidden="false"]').within(() => {
					cy.contains(option).click();
				});
			};

			it('should set align items = start', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <LayoutMatrixControl />,
					value,
					name,
				});

				setCustomSelectOption(0, 'Start');

				// Check control
				cy.getByDataTest('matrix-top-center-selected').should('exist');

				// Check data provider
				cy.get('body').then(() => {
					expect('flex-start').to.be.equal(
						getControlValue(name).alignItems
					);
				});
			});

			it('should set align items = center', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <LayoutMatrixControl />,
					value,
					name,
				});

				setCustomSelectOption(0, 'Center');

				// Check control
				cy.getByDataTest('matrix-center-center-selected').should(
					'exist'
				);

				// Check data provider
				cy.get('body').then(() => {
					expect('center').to.be.equal(
						getControlValue(name).alignItems
					);
				});
			});

			it('should set align items = end', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <LayoutMatrixControl />,
					value,
					name,
				});

				setCustomSelectOption(0, 'End');

				// Check control
				cy.getByDataTest('matrix-bottom-center-selected').should(
					'exist'
				);

				// Check data provider
				cy.get('body').then(() => {
					expect('flex-end').to.be.equal(
						getControlValue(name).alignItems
					);
				});
			});

			it('should set align items = stretch', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <LayoutMatrixControl />,
					value,
					name,
				});

				setCustomSelectOption(0, 'Stretch');

				// Check control
				cy.getByDataTest('matrix-center-selected').should('exist');
				cy.getByDataTest('matrix-stretch-row').should('exist');

				// Check data provider
				cy.get('body').then(() => {
					expect('stretch').to.be.equal(
						getControlValue(name).alignItems
					);
				});
			});

			it('should set justify content = start', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <LayoutMatrixControl />,
					value,
					name,
				});

				setCustomSelectOption(1, 'Start');

				// Check control
				cy.getByDataTest('matrix-center-left-selected').should('exist');

				// Check data provider
				cy.get('body').then(() => {
					expect('flex-start').to.be.equal(
						getControlValue(name).justifyContent
					);
				});
			});

			it('should set justify content = center', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <LayoutMatrixControl />,
					value: { ...value, justifyContent: 'flex-start' },
					name,
				});

				setCustomSelectOption(1, 'Center');

				// Check control
				cy.getByDataTest('matrix-center-center-selected').should(
					'exist'
				);

				// Check data provider
				cy.get('body').then(() => {
					expect('center').to.be.equal(
						getControlValue(name).justifyContent
					);
				});
			});

			it('should set justify content = End', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <LayoutMatrixControl />,
					value,
					name,
				});

				setCustomSelectOption(1, 'End');

				// Check control
				cy.getByDataTest('matrix-center-right-selected').should(
					'exist'
				);

				// Check data provider
				cy.get('body').then(() => {
					expect('flex-end').to.be.equal(
						getControlValue(name).justifyContent
					);
				});
			});

			it('should set justify content = space around', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <LayoutMatrixControl />,
					value,
					name,
				});

				setCustomSelectOption(1, 'Space Around');

				// Check control
				cy.getByDataTest('matrix-space-around-center-fill-row').should(
					'exist'
				);

				// Check data provider
				cy.get('body').then(() => {
					expect('space-around').to.be.equal(
						getControlValue(name).justifyContent
					);
				});
			});

			it('should set justify content = space between', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <LayoutMatrixControl />,
					value,
					name,
				});

				setCustomSelectOption(1, 'Space Between');

				// Check control
				cy.getByDataTest('matrix-space-between-center-fill-row').should(
					'exist'
				);

				// Check data provider
				cy.get('body').then(() => {
					expect('space-between').to.be.equal(
						getControlValue(name).justifyContent
					);
				});
			});

			it('should set justify content = space between & align items = stretch', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <LayoutMatrixControl />,
					value,
					name,
				});

				setCustomSelectOption(0, 'Stretch');
				setCustomSelectOption(1, 'Space Between');

				// Check control
				cy.getByDataTest('matrix-stretch-space-between-row').should(
					'exist'
				);

				// Check data provider
				cy.get('body').then(() => {
					expect({
						alignItems: 'stretch',
						justifyContent: 'space-between',
						dense: false,
						direction: 'row',
					}).to.be.deep.equal(getControlValue(name));
				});
			});

			it('should set justify content = space around & align items = stretch', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <LayoutMatrixControl />,
					value,
					name,
				});

				setCustomSelectOption(0, 'Stretch');
				setCustomSelectOption(1, 'Space Around');

				// Check control
				cy.getByDataTest('matrix-stretch-space-around-row').should(
					'exist'
				);

				// Check data provider
				cy.get('body').then(() => {
					expect({
						alignItems: 'stretch',
						justifyContent: 'space-around',
						dense: false,
						direction: 'row',
					}).to.be.deep.equal(getControlValue(name));
				});
			});
		});

		describe('Matrix', () => {
			const checkSelectOption = (index, dataTest) => {
				cy.get('button[aria-haspopup="listbox"]')
					.eq(index)
					.within(() => {
						cy.getByDataTest(dataTest);
					});
			};

			it('should set correct data, when click on matrix items', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <LayoutMatrixControl />,
					value,
					name,
				});

				cy.getByDataTest('matrix-top-left-normal').click();

				// Check control
				cy.getByDataTest('matrix-top-left-normal').should('not.exist');
				cy.getByDataTest('matrix-top-left-selected').should('exist');
				//
				checkSelectOption(0, 'layout-matrix-align-start');
				checkSelectOption(1, 'layout-matrix-justify-start');

				// Check data provider
				cy.get('body').then(() => {
					expect({
						alignItems: 'flex-start',
						justifyContent: 'flex-start',
						dense: false,
						direction: 'row',
					}).to.be.deep.equal(getControlValue(name));
				});
			});

			it('should set correct data, when double click on matrix normal item', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <LayoutMatrixControl />,
					value,
					name,
				});

				cy.getByDataTest('matrix-top-right-normal').dblclick();

				// Check control
				cy.getByDataTest('matrix-top-right-normal').should('not.exist');
				cy.getByDataTest('matrix-space-between-start-fill-row').should(
					'exist'
				);
				//
				checkSelectOption(0, 'layout-matrix-align-start');
				checkSelectOption(1, 'layout-matrix-justify-between');

				// Check data provider
				cy.get('body').then(() => {
					expect({
						alignItems: 'flex-start',
						justifyContent: 'space-between',
						dense: false,
						direction: 'row',
					}).to.be.deep.equal(getControlValue(name));
				});
			});

			it('should set correct data, when double click on matrix space-between item', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <LayoutMatrixControl />,
					value: { ...value, justifyContent: 'space-between' },
					name,
				});

				cy.getByDataTest('matrix-center-selected').dblclick();

				// Check control
				cy.getByDataTest('matrix-space-around-center-fill-row').should(
					'exist'
				);
				//
				checkSelectOption(0, 'layout-matrix-align-center');
				checkSelectOption(1, 'layout-matrix-justify-around');

				// Check data provider
				cy.get('body').then(() => {
					expect({
						alignItems: 'center',
						justifyContent: 'space-around',
						dense: false,
						direction: 'row',
					}).to.be.deep.equal(getControlValue(name));
				});
			});

			it('should set correct data, when double click on matrix space-around item', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <LayoutMatrixControl />,
					value: { ...value, justifyContent: 'space-around' },
					name,
				});

				cy.getByDataTest('matrix-center-selected').dblclick();

				// Check control
				cy.getByDataTest('matrix-center-selected').within(() => {
					cy.getByDataTest('matrix-stretch-row').should('exist');
				});
				//
				checkSelectOption(0, 'layout-matrix-align-stretch');
				checkSelectOption(1, 'layout-matrix-justify-center');

				// Check data provider
				cy.get('body').then(() => {
					expect({
						alignItems: 'stretch',
						justifyContent: 'center',
						dense: false,
						direction: 'row',
					}).to.be.deep.equal(getControlValue(name));
				});
			});

			it('should set correct data, when double click on matrix stretch item', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <LayoutMatrixControl />,
					value: { ...value, alignItems: 'stretch' },
					name,
				});

				cy.getByDataTest('matrix-center-selected').dblclick();

				// Check control
				cy.getByDataTest('matrix-center-center-selected').should(
					'exist'
				);
				//
				checkSelectOption(0, 'layout-matrix-align-center');
				checkSelectOption(1, 'layout-matrix-justify-center');

				// Check data provider
				cy.get('body').then(() => {
					expect({
						alignItems: 'center',
						justifyContent: 'center',
						dense: false,
						direction: 'row',
					}).to.be.deep.equal(getControlValue(name));
				});
			});

			it('should onChange be called, when interacting', () => {
				const name = nanoid();
				const defaultProps = {
					onChange: (value) => {
						controlReducer(
							select('blockera-core/controls').getControl(name),
							modifyControlValue({
								value,
								controlId: name,
							})
						);
					},
				};
				cy.stub(defaultProps, 'onChange').as('onChange');

				cy.withDataProvider({
					component: <LayoutMatrixControl {...defaultProps} />,
					value,
					name,
				});

				cy.getByAriaLabel('Column').click();
				cy.get('@onChange').should('have.been.called');
			});
		});
	});
});

