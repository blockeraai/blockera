import MaskControl from '..';
import { STORE_NAME } from '../../repeater-control/store';
import { nanoid } from 'nanoid';
import { select } from '@wordpress/data';
import { modifyControlValue } from '../../../store/actions';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { getControlValue } from '../../../store/selectors';

describe('Mask Control component testing', () => {
	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	const value = {
		0: {
			shape: { type: 'shape', id: 'Blob 1' },
			size: 'custom',
			'size-width': '',
			'size-height': '',
			repeat: 'no-repeat',
			position: { top: '50%', left: '50%' },
			'horizontally-flip': false,
			'vertically-flip': false,
			isVisible: true,
		},
	};

	context('rendering test', () => {
		it('should render correctly, with empty value', () => {
			cy.withDataProvider({
				component: <MaskControl />,
				store: STORE_NAME,
				value: {},
			});

			cy.getByDataCy('group-control-header').should('not.exist');
		});

		it('should render correctly, with value', () => {
			cy.withDataProvider({
				component: <MaskControl />,
				store: STORE_NAME,
				value,
			});

			cy.getByDataCy('group-control-header').should('exist');
		});

		it('should render correctly, with no value and defaultValue', () => {
			cy.withDataProvider({
				component: <MaskControl />,
				store: STORE_NAME,
			});

			cy.getByDataCy('group-control-header').should('not.exist');
		});

		it('should render correctly, with defaultValue', () => {
			cy.withDataProvider({
				component: <MaskControl defaultValue={value} />,
				store: STORE_NAME,
			});

			cy.getByDataCy('group-control-header').should('exist');
		});

		it('should not be cloneable', () => {
			cy.withDataProvider({
				component: <MaskControl />,
				store: STORE_NAME,
				value,
			});

			cy.getByDataCy('group-control-header').within(() => {
				cy.get('[aria-label~="Clone"]').should('not.exist');
			});
		});

		it('mask control max item = 1', () => {
			cy.withDataProvider({
				component: <MaskControl />,
				store: STORE_NAME,
				value: {},
			});

			cy.multiClick('[aria-label="Add New"]', 4);
			cy.getByDataCy('group-control-header').should('have.length', 1);
		});
	});

	context('interaction test', () => {
		const value = {
			0: {
				shape: { type: 'shape', id: 'Blob 1' },
				size: 'custom',
				'size-width': '',
				'size-height': '',
				repeat: 'no-repeat',
				position: { top: '50%', left: '50%' },
				'horizontally-flip': false,
				'vertically-flip': false,
				isVisible: true,
				isOpen: true,
			},
		};
		it('should onChange be called, when interacting', () => {
			const name = nanoid();
			const defaultProps = {
				onChange: (value) => {
					controlReducer(
						select('publisher-core/controls').getControl(name),
						modifyControlValue({
							value,
							controlId: name,
						})
					);
				},
			};
			cy.stub(defaultProps, 'onChange').as('onChange');

			cy.withDataProvider({
				component: <MaskControl {...defaultProps} />,
				value,
				store: STORE_NAME,
				name,
			});

			cy.getByAriaLabel('Cover').click();

			cy.get('@onChange').should('have.been.called');
		});

		it('should update data correctly, when add width', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <MaskControl />,
				store: STORE_NAME,
				value,
				name,
			});

			cy.getParentContainer('Width').within(() => {
				cy.get('input[type="number"]').type(100);
				// check control
				cy.get('input[type="number"]').should('have.value', 100);
			});

			// check data provider
			cy.get('body').then(() => {
				const controlValue = getControlValue(name, STORE_NAME);
				expect({
					0: {
						...controlValue['0'],
						size: 'custom',
						'size-width': '100px',
						'size-height': '',
					},
				}).to.be.deep.equal(controlValue);
			});
		});

		it('should update data correctly, when add height', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <MaskControl />,
				store: STORE_NAME,
				value,
				name,
			});

			cy.getParentContainer('Height').within(() => {
				cy.get('input[type="number"]').type(100);
				// check control
				cy.get('input[type="number"]').should('have.value', 100);
			});

			// check data provider
			cy.get('body').then(() => {
				const controlValue = getControlValue(name, STORE_NAME);
				expect({
					0: {
						...controlValue['0'],
						size: 'custom',
						'size-width': '',
						'size-height': '100px',
					},
				}).to.be.deep.equal(controlValue);
			});
		});

		it('should update data correctly, when change size to cover', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <MaskControl />,
				store: STORE_NAME,
				value,
				name,
			});

			cy.getByAriaLabel('Cover').click();
			// check control
			cy.getByAriaLabel('Cover').should(
				'have.attr',
				'aria-checked',
				'true'
			);

			cy.getByAriaLabel('Width').should('not.exist');
			cy.getByAriaLabel('Height').should('not.exist');

			// check data provider
			cy.get('body').then(() => {
				expect('cover').to.be.deep.equal(
					getControlValue(name, STORE_NAME)['0'].size
				);
			});
		});

		it('should update data correctly, when change size to contain', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <MaskControl />,
				store: STORE_NAME,
				value,
				name,
			});

			cy.getByAriaLabel('Contain').click();
			// check control
			cy.getByAriaLabel('Contain').should(
				'have.attr',
				'aria-checked',
				'true'
			);

			cy.getByAriaLabel('Width').should('not.exist');
			cy.getByAriaLabel('Height').should('not.exist');

			// check data provider
			cy.get('body').then(() => {
				expect('contain').to.be.deep.equal(
					getControlValue(name, STORE_NAME)['0'].size
				);
			});
		});

		it('should update data correctly, when repeat -> Horizontally and Vertically', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <MaskControl />,
				store: STORE_NAME,
				value,
				name,
			});

			cy.getByAriaLabel('Horizontally and Vertically').click();
			// check control
			cy.getByAriaLabel('Horizontally and Vertically').should(
				'have.attr',
				'aria-checked',
				'true'
			);

			// check data provider
			cy.get('body').then(() => {
				expect('repeat').to.be.deep.equal(
					getControlValue(name, STORE_NAME)['0'].repeat
				);
			});
		});

		it('should update data correctly, when repeat -> Horizontally', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <MaskControl />,
				store: STORE_NAME,
				value,
				name,
			});

			cy.getParentContainer('Repeat').within(() => {
				cy.getByAriaLabel('Horizontally').click();
				// check control
				cy.getByAriaLabel('Horizontally').should(
					'have.attr',
					'aria-checked',
					'true'
				);
			});

			// check data provider
			cy.get('body').then(() => {
				expect('repeat-x').to.be.deep.equal(
					getControlValue(name, STORE_NAME)['0'].repeat
				);
			});
		});

		it('should update data correctly, when repeat -> Vertically', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <MaskControl />,
				store: STORE_NAME,
				value,
				name,
			});

			cy.getParentContainer('Repeat').within(() => {
				cy.getByAriaLabel('Vertically').click();
				// check control
				cy.getByAriaLabel('Vertically').should(
					'have.attr',
					'aria-checked',
					'true'
				);
			});

			// check data provider
			cy.get('body').then(() => {
				expect('repeat-y').to.be.deep.equal(
					getControlValue(name, STORE_NAME)['0'].repeat
				);
			});
		});

		it('should update data correctly, when repeat -> No Repeat', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <MaskControl />,
				store: STORE_NAME,
				value: { 0: { ...value[0], repeat: 'repeat' } },
				name,
			});

			cy.getByAriaLabel("Don't Tile").click();
			// check control
			cy.getByAriaLabel("Don't Tile").should(
				'have.attr',
				'aria-checked',
				'true'
			);

			// check data provider
			cy.get('body').then(() => {
				expect('no-repeat').to.be.deep.equal(
					getControlValue(name, STORE_NAME)['0'].repeat
				);
			});
		});

		it('should update data correctly, when update position', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <MaskControl />,
				store: STORE_NAME,
				value,
				name,
			});

			cy.getByDataTest('position-button').click({ force: true });
			// check control
			cy.getByAriaLabel('Alignment Matrix Control').within(() => {
				cy.contains('top center').click({ force: true });
			});

			// check data provider
			cy.get('body').then(() => {
				expect({ top: '0%', left: '50%' }).to.be.deep.equal(
					getControlValue(name, STORE_NAME)['0'].position
				);
			});
		});

		it('should update data correctly, when Flip -> Horizontally', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <MaskControl />,
				store: STORE_NAME,
				value,
				name,
			});

			cy.getParentContainer('Flip').within(() => {
				cy.getParentContainer('Horizontally').within(() => {
					cy.get('input[type="checkbox"]').click({ force: true });

					// check control
					cy.get('input[type="checkbox"]')
						.parent()
						.should('have.class', 'is-checked');
				});
			});

			// check data provider
			cy.get('body').then(() => {
				expect(true).to.be.deep.equal(
					getControlValue(name, STORE_NAME)['0']['horizontally-flip']
				);
			});
		});

		it('should update data correctly, when Flip -> Vertically', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <MaskControl />,
				store: STORE_NAME,
				value,
				name,
			});

			cy.getParentContainer('Flip').within(() => {
				cy.getParentContainer('Vertically').within(() => {
					cy.get('input[type="checkbox"]').click({ force: true });

					// check control
					cy.get('input[type="checkbox"]')
						.parent()
						.should('have.class', 'is-checked');
				});
			});

			// check data provider
			cy.get('body').then(() => {
				expect(true).to.be.deep.equal(
					getControlValue(name, STORE_NAME)['0']['vertically-flip']
				);
			});
		});

		context('should update data correctly, ', () => {
			it('when select Blob 1 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value: {
						0: {
							...value[0],
							shape: { type: 'shape', id: 'blob-2' },
						},
					},
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Blob 1').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('blob-1').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('blob-1').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Blob 1',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Blob 2 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Blob 2').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('blob-2').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('blob-2').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Blob 2',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Blob 3 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Blob 3').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('blob-3').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('blob-3').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Blob 3',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Blob 4 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Blob 4').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('blob-4').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('blob-4').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Blob 4',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Blob 5 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Blob 5').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('blob-5').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('blob-5').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Blob 5',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Blob 6 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Blob 6').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('blob-6').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('blob-6').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Blob 6',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Blob 7 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Blob 7').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('blob-7').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('blob-7').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Blob 7',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Blob 8 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Blob 8').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('blob-8').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('blob-8').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Blob 8',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Blob 9 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Blob 9').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('blob-9').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('blob-9').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Blob 9',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Blob 10 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Blob 10').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('blob-10').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('blob-10').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Blob 10',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Blob 11 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Blob 11').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('blob-11').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('blob-11').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Blob 11',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Blob 12 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Blob 12').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('blob-12').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('blob-12').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Blob 12',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Sketch 1 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Sketch 1').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('sketch-1').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('sketch-1').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Sketch 1',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Sketch 2 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Sketch 2').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('sketch-2').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('sketch-2').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Sketch 2',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Sketch 3 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Sketch 3').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('sketch-3').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('sketch-3').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Sketch 3',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Sketch 4 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Sketch 4').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('sketch-4').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('sketch-4').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Sketch 4',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Sketch 5 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Sketch 5').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('sketch-5').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('sketch-5').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Sketch 5',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Sketch 6 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Sketch 6').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('sketch-6').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('sketch-6').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Sketch 6',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Sketch 7 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Sketch 7').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('sketch-7').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('sketch-7').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Sketch 7',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Sketch 8 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Sketch 8').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('sketch-8').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('sketch-8').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Sketch 8',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Paint Circle 1 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Paint Circle 1').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('paint-circle-1').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('paint-circle-1').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Paint Circle 1',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Paint Circle 2 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Paint Circle 2').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('paint-circle-2').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('paint-circle-2').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Paint Circle 2',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Paint Circle 3 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Paint Circle 3').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('paint-circle-3').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('paint-circle-3').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Paint Circle 3',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Paint Circle 4 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Paint Circle 4').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('paint-circle-4').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('paint-circle-4').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Paint Circle 4',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Splatter 1 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Splatter 1').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('splatter-1').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('splatter-1').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Splatter 1',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Splatter 2 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Splatter 2').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('splatter-2').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('splatter-2').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Splatter 2',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Splatter 3 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Splatter 3').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('splatter-3').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('splatter-3').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Splatter 3',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Splatter 4 shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Splatter 4').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('splatter-4').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('splatter-4').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Splatter 4',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Circle shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Circle').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('circle').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('circle').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Circle',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Triangle shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Triangle').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('triangle').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('triangle').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Triangle',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Hexagon shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Hexagon').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('hexagon').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('hexagon').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Hexagon',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Octagon shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Octagon').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('octagon').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('octagon').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Octagon',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Flower shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Flower').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('flower').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('flower').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Flower',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Multiplication shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Multiplication').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('multiplication').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('multiplication').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Multiplication',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Star shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Star').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('star').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('star').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Star',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});

			it('when select Stairs shape', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <MaskControl />,
					store: STORE_NAME,
					value,
					name,
				});

				cy.getByDataTest('mask-shape-button').click();
				cy.getByDataTest('mask-shape-popover').within(() => {
					cy.getByAriaLabel('Icon Stairs').click();
				});

				//Check control
				cy.getByDataTest('mask-shape-button').within(() => {
					cy.getByDataTest('stairs').should('exist');
				});

				//Check repeater item
				cy.getByDataCy('group-control-header').within(() => {
					cy.getByDataTest('stairs').should('exist');
				});

				//Check data provider
				cy.get('body').then(() => {
					expect({
						type: 'shape',
						id: 'Stairs',
					}).to.be.deep.equal(
						getControlValue(name, STORE_NAME)['0'].shape
					);
				});
			});
		});
	});
});
