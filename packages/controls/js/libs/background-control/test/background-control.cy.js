/**
 * Internal dependencies
 */
import BackgroundControl from '../index';
import { STORE_NAME } from '../../repeater-control/store';
import { getControlValue } from '../../../store/selectors';
import { nanoid } from 'nanoid';

describe('background control', () => {
	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	context('Functional', () => {
		context('image type', () => {
			context('size', () => {
				it('should change image-size in data by toggling between size options', () => {
					const name = nanoid();
					cy.withDataProvider({
						component: <BackgroundControl />,
						value: { 'image-0': { type: 'image', isOpen: true } },
						store: STORE_NAME,
						name,
					});

					cy.wait(500);

					cy.get('.blockera-component-popover').within(() => {
						cy.get('[aria-label="Contain"]').click();
					});

					cy.then(() => {
						const imageSize = getControlValue(name, STORE_NAME)[
							'image-0'
						]['image-size'];
						expect(imageSize).to.be.equal('contain');
					});
				});

				it('should be able to enter custom image width via input', () => {
					const name = nanoid();
					cy.withDataProvider({
						component: <BackgroundControl />,
						value: { 'image-0': { type: 'image', isOpen: true } },
						store: STORE_NAME,
						name,
					});

					cy.wait(500);

					cy.get('.blockera-component-popover').within(() => {
						cy.get('[aria-label="Custom"]').click();

						//
						// Width
						//
						cy.get('[aria-label="Select Unit"]')
							.eq(0)
							.as('widthSelect');

						cy.get('@widthSelect').select('px');

						cy.get('@widthSelect')
							.parent()
							.siblings('input[type="number"]')
							.as('widthInput');

						cy.get('@widthInput').clear();
						cy.get('@widthInput').type('50');

						//
						// Height
						//
						cy.get('[aria-label="Select Unit"]')
							.eq(1)
							.as('heightSelect');

						cy.get('@heightSelect').select('px');

						cy.get('@heightSelect')
							.parent()
							.siblings('input[type="number"]')
							.as('heightInput');

						cy.get('@heightInput').clear();
						cy.get('@heightInput').type('40');
					});

					cy.then(() => {
						const imageWidth = getControlValue(name, STORE_NAME)[
							'image-0'
						]['image-size-width'];

						expect(imageWidth).to.be.equal('50px');

						const imageHeight = getControlValue(name, STORE_NAME)[
							'image-0'
						]['image-size-height'];

						expect(imageHeight).to.be.equal('40px');
					});
				});
			});

			context('position', () => {
				it('should change image-position in data by entering new value in inputs', () => {
					const name = nanoid();
					cy.withDataProvider({
						component: <BackgroundControl />,
						value: { 'image-0': { type: 'image', isOpen: true } },
						store: STORE_NAME,
						name,
					});

					cy.wait(500);

					cy.get('.blockera-component-popover').within(() => {
						cy.get('input[type="number"]')
							.eq(0)
							.as('positionTopInput');
						cy.get('@positionTopInput').clear();
						cy.get('@positionTopInput').type('80');
					});

					cy.then(() => {
						const positionTop = getControlValue(name, STORE_NAME)[
							'image-0'
						]['image-position'].top;

						expect(positionTop).to.be.equal('80%');
					});
				});
			});

			context('repeat', () => {
				it('should change image-repeat in data when toggling between repeat options', () => {
					const name = nanoid();
					cy.withDataProvider({
						component: <BackgroundControl />,
						value: { 'image-0': { type: 'image', isOpen: true } },
						store: STORE_NAME,
						name,
					});

					cy.wait(500);

					cy.get('.blockera-component-popover').within(() => {
						cy.get('[aria-label="Vertically"]').click();
						cy.get('[aria-label="Vertically"]').should(
							'have.attr',
							'aria-checked',
							'true'
						);
					});

					cy.then(() => {
						const imageRepeat = getControlValue(name, STORE_NAME)[
							'image-0'
						]['image-repeat'];

						expect(imageRepeat).to.be.equal('repeat-y');
					});
				});
			});

			context('effect', () => {
				// positive false
				it('should change image-attachment in data when toggling between effect options', () => {
					const name = nanoid();
					cy.withDataProvider({
						component: <BackgroundControl />,
						value: { 'image-0': { type: 'image', isOpen: true } },
						store: STORE_NAME,
						name,
					});

					cy.wait(500);

					cy.get('.blockera-component-popover').within(() => {
						cy.get('button[aria-label="Parallax"]').click();
						cy.get('button[aria-label="Parallax"]').should(
							'have.attr',
							'aria-checked',
							'true'
						);
					});

					cy.then(() => {
						const imageAttachment = getControlValue(
							name,
							STORE_NAME
						)['image-0']['image-attachment'];

						expect(imageAttachment).to.be.equal('fixed');
					});
				});
			});
		});

		context('linear-gradient type', () => {
			it('should be able to add new color into gradient', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: {
						'linear-gradient-0': {
							type: 'linear-gradient',
							isOpen: true,
						},
					},
					store: STORE_NAME,
					name,
				});

				cy.wait(500);

				cy.get('.blockera-component-popover').within(() => {
					cy.get(
						'.components-custom-gradient-picker__gradient-bar-background'
					).as('gradientBar');

					cy.get('@gradientBar').click();
				});

				cy.get('input[maxLength="9"]').clear();
				cy.get('input[maxLength="9"]').type('FFA33C', { delay: 0 });

				cy.get('@gradientBar').should(($gradientBar) => {
					const background = $gradientBar.css('background');
					expect(background).to.include('rgb(255, 163, 60)');
				});

				cy.then(() => {
					const linearGradient = getControlValue(name, STORE_NAME);

					expect(
						linearGradient['linear-gradient-0']['linear-gradient']
					).to.include('rgb(255,163,60)');
				});
			});

			it('should change linear-gradient-angel in data when entering new value in angel input', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: {
						'linear-gradient-0': {
							type: 'linear-gradient',
							isOpen: true,
						},
					},
					store: STORE_NAME,
					name,
				});

				cy.wait(500);

				cy.get('.blockera-component-popover').within(() => {
					cy.getParentContainer('Angel').within(() => {
						cy.get('input[type="number"]').clear();
						cy.get('input[type="number"]').type('135', {
							delay: 0,
						});
					});
				});

				cy.then(() => {
					const angel = getControlValue(name, STORE_NAME);

					expect(
						angel['linear-gradient-0']['linear-gradient-angel']
					).to.be.equal(135);
				});
			});

			it('should change linear-gradient-repeat in data when toggling between repeat options', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: {
						'linear-gradient-0': {
							type: 'linear-gradient',
							isOpen: true,
						},
					},
					store: STORE_NAME,
					name,
				});

				cy.wait(500);

				cy.get('.blockera-component-popover').then(() => {
					cy.get('button[aria-label="Repeat"]').click();
				});

				cy.then(() => {
					const repeat = getControlValue(name, STORE_NAME)[
						'linear-gradient-0'
					]['linear-gradient-repeat'];

					expect(repeat).to.be.equal('repeat');
				});
			});

			it('should change linear-gradient-attachment in data when toggling between effect options', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: {
						'linear-gradient-0': {
							type: 'linear-gradient',
							isOpen: true,
						},
					},
					store: STORE_NAME,
					name,
				});

				cy.wait(500);

				cy.get('.blockera-component-popover').within(() => {
					cy.get('button[aria-label="Parallax"]').click();
					cy.get('button[aria-label="Parallax"]').should(
						'have.attr',
						'aria-checked',
						'true'
					);
				});

				cy.then(() => {
					const linearGradientAttachment = getControlValue(
						name,
						STORE_NAME
					)['linear-gradient-0']['linear-gradient-attachment'];

					expect(linearGradientAttachment).to.be.equal('fixed');
				});
			});
		});

		context('radial-gradient type', () => {
			it('should be able to add new color into gradient', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: {
						'radial-gradient-0': {
							type: 'radial-gradient',
							isOpen: true,
						},
					},
					store: STORE_NAME,
					name,
				});

				cy.wait(500);

				cy.get('.blockera-component-popover').within(() => {
					cy.get(
						'.components-custom-gradient-picker__gradient-bar-background'
					).as('gradientBar');

					cy.get('@gradientBar').click();
				});

				cy.get('input[maxLength="9"]').clear();
				cy.get('input[maxLength="9"]').type('FFA33C');

				cy.get('@gradientBar').should(($gradientBar) => {
					const background = $gradientBar.css('background');
					expect(background).to.include('rgb(255, 163, 60)');
				});

				cy.then(() => {
					const radialGradient = getControlValue(name, STORE_NAME)[
						'radial-gradient-0'
					]['radial-gradient'];
					expect(radialGradient).to.include('rgb(255,163,60)');
				});
			});

			it('should change radial-gradient-position in data by entering new value in inputs', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: {
						'radial-gradient-0': {
							type: 'radial-gradient',
						},
					},
					store: STORE_NAME,
					name,
				});

				cy.wait(500);

				cy.getByDataCy('repeater-item').click();

				cy.get('.blockera-component-popover').within(() => {
					cy.get('input[type="number"]').eq(0).as('positionTopInput');
					cy.get('@positionTopInput').clear();
					cy.get('@positionTopInput').type('80');
				});

				cy.then(() => {
					const positionTop = getControlValue(name, STORE_NAME)[
						'radial-gradient-0'
					]['radial-gradient-position'].top;

					expect(positionTop).to.be.equal('80%');
				});
			});

			it('should change radial-gradient-size in data when toggling between size options', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: {
						'radial-gradient-0': {
							type: 'radial-gradient',
						},
					},
					store: STORE_NAME,
					name,
				});

				cy.wait(500);

				cy.getByDataCy('repeater-item').click();

				cy.get('.blockera-component-popover').within(() => {
					cy.get('button[data-value="closest-corner"]').click();
				});

				cy.then(() => {
					const size = getControlValue(name, STORE_NAME)[
						'radial-gradient-0'
					]['radial-gradient-size'];

					expect(size).to.be.equal('closest-corner');
				});
			});

			it('should change radial-gradient-repeat in data when toggling between repeat options', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: {
						'radial-gradient-0': {
							type: 'radial-gradient',
						},
					},
					store: STORE_NAME,
					name,
				});

				cy.wait(500);

				cy.getByDataCy('repeater-item').click();

				cy.get('.blockera-component-popover').within(() => {
					cy.get('button[aria-label="Repeat"]').click();
				});

				cy.then(() => {
					const repeat = getControlValue(name, STORE_NAME)[
						'radial-gradient-0'
					]['radial-gradient-repeat'];

					expect(repeat).to.be.equal('repeat');
				});
			});

			it('should change radial-gradient-attachment in data when toggling between effect options', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: {
						'radial-gradient-0': {
							type: 'radial-gradient',
						},
					},
					store: STORE_NAME,
					name,
				});

				cy.wait(500);

				cy.getByDataCy('repeater-item').click();

				cy.get('.blockera-component-popover').within(() => {
					cy.get('button[aria-label="Parallax"]').click();

					cy.get('button[aria-label="Parallax"]').should(
						'have.attr',
						'aria-checked',
						'true'
					);
				});

				cy.then(() => {
					const linearGradientAttachment = getControlValue(
						name,
						STORE_NAME
					)['radial-gradient-0']['radial-gradient-attachment'];

					expect(linearGradientAttachment).to.be.equal('fixed');
				});
			});
		});

		context('mesh-gradient type', () => {
			it('should randomly re-generate colors and gradient by click on preview', () => {
				const colors = {
					'--c0': { color: '#fefe', order: 0 },
					'--c1': { color: '#35ff4c', order: 1 },
					'--c2': { color: '#4deaff', order: 2 },
				};

				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: {
						'mesh-gradient-0': {
							type: 'mesh-gradient',
							'mesh-gradient': '',
							'mesh-gradient-colors': colors,
							'mesh-gradient-attachment': 'scroll',
							isVisible: true,
							isOpen: true,
						},
					},
					store: STORE_NAME,
					name,
				}).then(() => {
					const prevMesh = getControlValue(name, STORE_NAME)[
						'mesh-gradient-0'
					]['mesh-gradient'];

					cy.get('.blockera-control-mesh-generator-preview').click();

					cy.get('.blockera-control-mesh-generator-preview').then(
						() => {
							const newColors = getControlValue(name, STORE_NAME)[
								'mesh-gradient-0'
							]['mesh-gradient-colors'];
							expect(newColors.length).to.be.equal(colors.length);
							expect(newColors).to.not.be.deep.equal(colors);
							const newMesh = getControlValue(name, STORE_NAME)[
								'mesh-gradient-0'
							]['mesh-gradient'];
							expect(newMesh).to.not.deep.equal(prevMesh);
						}
					);
				});
			});

			it("should change existed color's value and update gradient with new value for changed color", () => {
				const colors = {
					'--c0': { color: '#fefe', order: 0 },
					'--c1': { color: '#35ff4c', order: 1 },
					'--c2': { color: '#4deaff', order: 2 },
				};

				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: {
						'mesh-gradient-0': {
							type: 'mesh-gradient',
							'mesh-gradient': '',
							'mesh-gradient-colors': colors,
							'mesh-gradient-attachment': 'scroll',
							isVisible: true,
							isOpen: true,
						},
					},
					store: STORE_NAME,
					name,
				}).then(() => {
					cy.getByDataCy('repeater-item').eq(3).click();

					cy.get('.blockera-component-popover')
						.last()
						.within(() => {
							cy.get('input[maxLength="9"]').as('colorInput');
							cy.get('@colorInput').clear();
							cy.get('@colorInput').type('4fecff', {
								delay: 0,
								force: true,
							});
						});

					cy.getByDataCy('repeater-item')
						.eq(0)
						.within(() => {
							const newColors = Object.values(
								getControlValue(name, STORE_NAME)[
									'mesh-gradient-0'
								]['mesh-gradient-colors']
							);

							// color value change assertion
							expect(
								newColors[newColors.length - 1].color
							).to.be.equal('#4fecff');
						});

					// gradient assertion
					cy.get('.blockera-control-mesh-generator-preview').then(
						($el) => {
							const elementStyles = window.getComputedStyle(
								$el[0]
							);
							expect(
								elementStyles.getPropertyValue(
									`--c${Object.keys(colors).length - 1}`
								)
							).to.be.equal('#4fecff');
						}
					);
				});
			});

			it('should add new random color at the end and regenerate gradient', () => {
				const colors = {
					'--c0': { color: '#fefe', order: 0 },
					'--c1': { color: '#35ff4c', order: 1 },
					'--c2': { color: '#4deaff', order: 2 },
				};

				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: {
						'mesh-gradient-0': {
							type: 'mesh-gradient',
							'mesh-gradient': '',
							'mesh-gradient-colors': colors,
							'mesh-gradient-attachment': 'scroll',
							isVisible: true,
							isOpen: true,
						},
					},
					store: STORE_NAME,
					name,
				}).then(() => {
					const prevMesh = getControlValue(name, STORE_NAME)[
						'mesh-gradient-0'
					]['mesh-gradient'];

					cy.get('[aria-label="Add New Mesh Gradient Color"]')
						.as('addColor')
						.click();

					cy.contains('Colors')
						.parent()
						.siblings('[data-cy="repeater-item"]')
						.should(($items) => {
							expect($items).to.have.length(
								Object.keys(colors).length + 1
							);
							expect($items.last().text()).to.match(/^#\w{6}$/);
						})
						.then(() => {
							const newColors = Object.values(
								getControlValue(name, STORE_NAME)[
									'mesh-gradient-0'
								]['mesh-gradient-colors']
							);

							expect(newColors.length).to.be.equal(
								Object.keys(colors).length + 1
							);
							expect(newColors.slice(-1)[0].color).to.match(
								/^#\w{6}/
							);

							const newMesh = getControlValue(name, STORE_NAME)[
								'mesh-gradient-0'
							]['mesh-gradient'];
							expect(newMesh).to.be.not.deep.equal(prevMesh);
						});
				});
			});

			it('should not be available to delete color when there are less than 4 colors.', () => {
				const colors = {
					'--c0': { color: '#fefe', order: 0 },
					'--c1': { color: '#35ff4c', order: 1 },
					'--c2': { color: '#4deaff', order: 2 },
				};
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: {
						'mesh-gradient-0': {
							type: 'mesh-gradient',
							'mesh-gradient': [],
							'mesh-gradient-colors': colors,
							'mesh-gradient-attachment': 'scroll',
							isVisible: true,
							isOpen: true,
						},
					},
					store: STORE_NAME,
					name,
				});

				cy.getByDataId('--c1').realHover();
				cy.getByAriaLabel('Delete c2').should('not.exist');

				cy.getByAriaLabel('Add New Mesh Gradient Color').click();

				cy.getByDataId('--c1').realHover();
				cy.getByAriaLabel('Delete c2').should('exist');
			});

			it('should remove color and regenerate gradient', () => {
				const colors = {
					'--c0': { color: '#fefe', order: 0 },
					'--c1': { color: '#35ff4c', order: 1 },
					'--c2': { color: '#4deaff', order: 2 },
				};
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: {
						'mesh-gradient-0': {
							type: 'mesh-gradient',
							'mesh-gradient': [],
							'mesh-gradient-colors': colors,
							'mesh-gradient-attachment': 'scroll',
							isVisible: true,
							isOpen: true,
						},
					},
					store: STORE_NAME,
					name,
				}).then(() => {
					const prevMesh = getControlValue(name, STORE_NAME)[
						'mesh-gradient-0'
					]['mesh-gradient'];

					cy.get('[aria-label="Add New Mesh Gradient Color"]')
						.as('addColor')
						.click();

					cy.get('[data-id="--c1"]').within(() => {
						cy.get('[aria-label~="Delete"]').click({
							force: true,
						});
					});
					cy.contains('Colors')
						.parent()
						.siblings('[data-cy="repeater-item"]')
						.should(($items) => {
							expect($items).to.have.length(
								Object.keys(colors).length
							);
						})
						.then(() => {
							const newColors = getControlValue(name, STORE_NAME)[
								'mesh-gradient-0'
							]['mesh-gradient-colors'];
							expect(Object.keys(newColors).length).to.be.equal(
								Object.keys(colors).length
							);

							const newMesh = getControlValue(name, STORE_NAME)[
								'mesh-gradient-0'
							]['mesh-gradient'];

							expect(newMesh).to.be.not.deep.equal(prevMesh);
						});
				});
			});

			// attachment
			it('should change mesh-gradient-attachment in data when toggling between effect options', () => {
				const name = nanoid();
				const colors = {
					'--c0': { color: '#fefe', order: 0 },
					'--c1': { color: '#35ff4c', order: 1 },
					'--c2': { color: '#4deaff', order: 2 },
				};
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: {
						'mesh-gradient-0': {
							type: 'mesh-gradient',
							'mesh-gradient': '',
							'mesh-gradient-colors': colors,
							'mesh-gradient-attachment': 'scroll',
							isVisible: true,
							isOpen: true,
						},
					},
					store: STORE_NAME,
					name,
				});

				cy.get('.blockera-component-popover').within(() => {
					cy.getByAriaLabel('Parallax').click();

					cy.getByAriaLabel('Parallax').should(
						'have.attr',
						'aria-checked',
						'true'
					);
				});

				cy.then(() => {
					const meshGradientAttachment = getControlValue(
						name,
						STORE_NAME
					);

					expect(
						meshGradientAttachment['mesh-gradient-0'][
							'mesh-gradient-attachment'
						]
					).to.be.equal('fixed');
				});
			});
		});
	});
});
