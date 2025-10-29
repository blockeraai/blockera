import DividerControl from '..';
import { STORE_NAME } from '../../repeater-control/store';
import { nanoid } from 'nanoid';
import { select } from '@wordpress/data';
import { modifyControlValue } from '../../../store/actions';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { getControlValue } from '../../../store/selectors';
describe('divider-control component testing', () => {
	const defaultValue = {
		0: {
			position: 'top',
			shape: {
				type: 'shape',
				id: 'wave-opacity',
			},
			color: '',
			size: { width: '100%', height: '100px' },
			animate: false,
			duration: '',
			flip: false,
			onFront: false,
			isVisible: true,
		},
	};

	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	context('rendering test', () => {
		it('should render correctly, with empty value', () => {
			cy.withDataProvider({
				component: <DividerControl />,
				store: STORE_NAME,
				value: {},
			});

			cy.getByDataCy('group-control-header').should('not.exist');
		});

		it('should render correctly, with value', () => {
			cy.withDataProvider({
				component: <DividerControl />,
				store: STORE_NAME,
				value: {
					0: {
						position: 'top',
						shape: {
							type: 'shape',
							id: 'triangle-5',
						},
						color: '',
						size: { width: '', height: '' },
						animate: false,
						duration: '',
						flip: false,
						onFront: false,
						isVisible: true,
					},
				},
			});

			cy.getByDataCy('group-control-header').should('exist');
		});

		it('should render correctly, with no value and defaultValue', () => {
			cy.withDataProvider({
				component: <DividerControl />,
				store: STORE_NAME,
			});

			cy.getByDataCy('group-control-header').should('not.exist');
		});

		it('should render correctly, with defaultValue', () => {
			cy.withDataProvider({
				component: (
					<DividerControl
						defaultValue={{
							0: {
								position: 'top',
								shape: {
									type: 'shape',
									id: 'triangle-5',
								},
								color: '',
								size: { width: '', height: '' },
								animate: false,
								duration: '',
								flip: false,
								onFront: false,
								isVisible: true,
							},
						}}
					/>
				),
				store: STORE_NAME,
			});

			cy.getByDataCy('group-control-header').should('exist');
		});

		it('should control icon color be default, when color is white', () => {
			cy.withDataProvider({
				component: (
					<DividerControl
						defaultValue={{
							0: {
								position: 'top',
								shape: {
									type: 'shape',
									id: 'triangle-5',
								},
								color: '#ffffff',
								size: { width: '', height: '' },
								animate: false,
								duration: '',
								flip: false,
								onFront: false,
								isVisible: true,
							},
						}}
					/>
				),
				store: STORE_NAME,
			});

			cy.getByDataTest('divider-item-header').should(
				'not.have.attr',
				'style'
			);
		});
	});

	context('interaction test', () => {
		it('should onChange be called, when interacting', () => {
			const name = nanoid();
			const defaultProps = {
				onChange: (value) => {
					controlReducer(
						select('blockera/controls').getControl(name),
						modifyControlValue({
							value,
							controlId: name,
						})
					);
				},
			};
			cy.stub(defaultProps, 'onChange').as('onChange');

			cy.withDataProvider({
				component: <DividerControl {...defaultProps} />,
				value: defaultValue,
				store: STORE_NAME,
				name,
			});

			cy.getByDataCy('group-control-header').click();

			cy.getByAriaLabel('Bottom').click();

			cy.get('@onChange').should('have.been.called');
		});

		it('should update data correctly, when change position', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <DividerControl />,
				store: STORE_NAME,
				value: defaultValue,
				name,
			});

			//
			cy.getByDataCy('group-control-header').click();
			cy.getByAriaLabel('Bottom').click({ force: true });

			//Check control
			cy.getByAriaLabel('Bottom').should(
				'have.attr',
				'aria-checked',
				'true'
			);

			//Check icons
			cy.getByDataTest('popover-body').within(() => {
				cy.getByDataTest('divider-shape-button')
					.children()
					.first()
					.should('have.class', 'bottom');

				cy.getByDataTest('divider-shape-button').click();
			});
			cy.getByDataTest('divider-shape-popover').within(() => {
				cy.getParentContainer('Shapes', 'base-control').within(() => {
					cy.get('svg').parent().should('have.class', 'bottom');
				});
			});

			//Check repeater item
			cy.getByDataTest('divider-item-header').should(
				'have.class',
				'bottom'
			);

			//Check data provider
			cy.get('body').then(() => {
				expect({
					0: {
						...defaultValue[0],
						position: 'bottom',
					},
				}).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});

		it('should update data correctly, when add color', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <DividerControl />,
				store: STORE_NAME,
				value: defaultValue,
				name,
			});

			cy.getByDataCy('group-control-header').click();

			cy.getByDataCy('color-btn').click();
			cy.getByDataTest('popover-body')
				.last()
				.within(() => {
					cy.get('input[maxlength="9"]').clear({ force: true });
					cy.get('input[maxlength="9"]').type('43d5b7', { delay: 0 });
				});

			//Check control
			cy.getByDataCy('color-btn').contains('#43d5b7');

			//Check icon

			cy.getByDataTest('divider-shape-button')
				.children()
				.first()
				.should('have.attr', 'style')
				.should('include', 'fill: rgb(67, 213, 183)');

			cy.getByDataTest('divider-shape-button').click();

			//Check repeater item
			cy.getByDataTest('divider-item-header')
				.should('have.attr', 'style')
				.should('include', 'fill: rgb(67, 213, 183)');

			//Check data provider
			cy.get('body').then(() => {
				expect({
					0: {
						...defaultValue[0],
						color: '#43d5b7',
					},
				}).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});

		it('should update data correctly, when add size', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <DividerControl />,
				store: STORE_NAME,
				value: defaultValue,
				name,
			});

			cy.getByDataCy('group-control-header').click();
			cy.getByDataTest('popover-body').within(() => {
				cy.getByDataTest('divider-width-input').clear();
				cy.getByDataTest('divider-width-input').type('100');
				cy.getByDataTest('divider-height-input').clear();
				cy.getByDataTest('divider-height-input').type('50');
			});

			//Check control
			cy.getByDataTest('divider-width-input').should('have.value', '100');
			cy.getByDataTest('divider-height-input').should('have.value', '50');

			//Check data provider
			cy.get('body').then(() => {
				expect({
					0: {
						...defaultValue[0],
						size: { width: '100%', height: '50px' },
					},
				}).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});

		it('should update data correctly, when active animation', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <DividerControl />,
				store: STORE_NAME,
				value: defaultValue,
				name,
			});

			cy.getByDataCy('group-control-header').click();
			cy.getParentContainer('Animation', 'base-control').within(() => {
				cy.get('input[type="checkbox"]').click();
			});

			//Render duration
			cy.getByDataTest('divider-duration-input').should('exist');

			//Check data provider
			cy.get('body').then(() => {
				expect({
					0: {
						...defaultValue[0],
						animate: true,
					},
				}).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});

		it('should update data correctly, when add duration', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <DividerControl />,
				store: STORE_NAME,
				value: defaultValue,
				name,
			});

			cy.getByDataCy('group-control-header').click();
			cy.getParentContainer('Animation', 'base-control').within(() => {
				cy.get('input[type="checkbox"]').click();
				cy.get('input[type="text"]').type(10);

				//Check control
				cy.get('input[type="text"]').should('have.value', '10');
			});

			//Check data provider
			cy.get('body').then(() => {
				expect({
					0: {
						...defaultValue[0],
						animate: true,
						duration: '10ms',
					},
				}).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});

		it('should update data correctly, when active flip', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <DividerControl />,
				store: STORE_NAME,
				value: defaultValue,
				name,
			});

			cy.getByDataCy('group-control-header').click();
			cy.getParentContainer('Flip', 'base-control').within(() => {
				cy.get('input[type="checkbox"]').click();
			});

			//Check data provider
			cy.get('body').then(() => {
				expect({
					0: {
						...defaultValue[0],
						flip: true,
					},
				}).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});

		it('should update data correctly, when active on front', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <DividerControl />,
				store: STORE_NAME,
				value: defaultValue,
				name,
			});

			cy.getByDataCy('group-control-header').click();
			cy.getParentContainer('On Front', 'base-control').within(() => {
				cy.get('input[type="checkbox"]').click();
			});

			//Check data provider
			cy.get('body').then(() => {
				expect({
					0: {
						...defaultValue[0],
						onFront: true,
					},
				}).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});

		context('should update data correctly, ', () => {
			it('when select wave-1 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon wave-1').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('wave-1').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('wave-1').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'wave-1',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select wave-2 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon wave-2').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('wave-2').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('wave-2').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'wave-2',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select curve-1 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon curve-1').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('curve-1').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('curve-1').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'curve-1',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select curve-2 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon curve-2').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('curve-2').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('curve-2').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'curve-2',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select triangle-1 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon triangle-1').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('triangle-1').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('triangle-1').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'triangle-1',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select triangle-2 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon triangle-2').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('triangle-2').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('triangle-2').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'triangle-2',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select triangle-3 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon triangle-3').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('triangle-3').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('triangle-3').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'triangle-3',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select triangle-4 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon triangle-4').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('triangle-4').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('triangle-4').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'triangle-4',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select triangle-5 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon triangle-5').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('triangle-5').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('triangle-5').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'triangle-5',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select triangle-6 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon triangle-6').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('triangle-6').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('triangle-6').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'triangle-6',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select title-1 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon title-1').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('title-1').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('title-1').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'title-1',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select title-2 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon title-2').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('title-2').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('title-2').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'title-2',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select title-3 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon title-3').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('title-3').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('title-3').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'title-3',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select title-4 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon title-4').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('title-4').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('title-4').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'title-4',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select title-5 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon title-5').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('title-5').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('title-5').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'title-5',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select title-6 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon title-6').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('title-6').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('title-6').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'title-6',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select title-7 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon title-7').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('title-7').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('title-7').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'title-7',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select title-8 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon title-8').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('title-8').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('title-8').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'title-8',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select arrow-1 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon arrow-1').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('arrow-1').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('arrow-1').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'arrow-1',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select arrow-2 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon arrow-2').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('arrow-2').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('arrow-2').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'arrow-2',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('when select arrow-3 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <DividerControl />,
					store: STORE_NAME,
					value: defaultValue,
					name,
				});

				cy.getByDataCy('group-control-header').click();

				cy.getByDataTest('divider-shape-button').click();
				cy.getByDataTest('divider-shape-popover').within(() => {
					cy.getByAriaLabel('Icon arrow-3').click();
				});

				//Check control
				cy.getByDataTest('divider-shape-button').within(() => {
					cy.getByDataTest('arrow-3').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('arrow-3').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						0: {
							...defaultValue[0],
							shape: {
								type: 'shape',
								id: 'arrow-3',
							},
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});
		});
	});
});
