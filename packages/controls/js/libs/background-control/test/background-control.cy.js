/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Internal dependencies
 */
import BackgroundControl from '../index';
import { STORE_NAME } from '../../repeater-control/store';
import { getControlValue } from '../../../store/selectors';

describe(
	'background control',
	{
		defaultCommandTimeout: 20000,
	},
	() => {
		beforeEach(() => {
			cy.viewport(1280, 720);
		});

		// TODO: temporary skip!
		// We should double check this test suite because this is flaky test!
		// After fix this, we need to update Jira ISSUE status: https://blockera.atlassian.net/browse/BPB-139
		/* @debug-ignore */
		context.skip('Functional', () => {
			context('image type', () => {
				context('size', () => {
					it('should change image-size in data by toggling between size options', () => {
						const name = nanoid();
						cy.withDataProvider({
							component: <BackgroundControl />,
							value: {
								'image-0': { type: 'image', isOpen: true },
							},
							store: STORE_NAME,
							name,
						});

						// Wait for the popover to ensure the component is fully rendered
						cy.get('.blockera-component-popover', {
							timeout: 20000,
						}).should('be.visible');

						cy.get('.blockera-component-popover').within(() => {
							cy.get('[aria-label="Contain"]').click();
							cy.get('[aria-label="Contain"]').should(
								'have.attr',
								'aria-checked',
								'true'
							);
						});

						cy.then(() => {
							const items = getControlValue(name, STORE_NAME);

							expect(items['image-0']['image-size']).to.be.equal(
								'contain'
							);
						});
					});

					it('should be able to enter custom image width via input', () => {
						const name = nanoid();
						cy.withDataProvider({
							component: <BackgroundControl />,
							value: {
								'image-0': { type: 'image', isOpen: true },
							},
							store: STORE_NAME,
							name,
						});

						// Wait for the popover to ensure the component is fully rendered
						cy.get('.blockera-component-popover', {
							timeout: 20000,
						}).should('be.visible');

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
								.siblings('input[type="text"]')
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
								.siblings('input[type="text"]')
								.as('heightInput');

							cy.get('@heightInput').clear();
							cy.get('@heightInput').type('40');
						});

						cy.then(() => {
							const imageWidth = getControlValue(
								name,
								STORE_NAME
							)['image-0']['image-size-width'];

							expect(imageWidth).to.be.equal('50px');

							const items = getControlValue(name, STORE_NAME);

							expect(
								items['image-0']['image-size-height']
							).to.be.equal('40px');
						});
					});
				});

				context('position', () => {
					it('should change image-position in data by entering new value in inputs', () => {
						const name = nanoid();
						cy.withDataProvider({
							component: <BackgroundControl />,
							value: {
								'image-0': { type: 'image', isOpen: true },
							},
							store: STORE_NAME,
							name,
						});

						// Wait for the popover to ensure the component is fully rendered
						cy.get('.blockera-component-popover', {
							timeout: 20000,
						}).should('be.visible');

						cy.get('.blockera-component-popover').within(() => {
							cy.get('input[type="text"]')
								.eq(0)
								.as('positionTopInput');
							cy.get('@positionTopInput').clear();
							cy.get('@positionTopInput').type('80');
						});

						cy.then(() => {
							const items = getControlValue(name, STORE_NAME);

							expect(
								items['image-0']['image-position'].top
							).to.be.equal('80%');
						});
					});
				});

				context('repeat', () => {
					it('should change image-repeat in data when toggling between repeat options', () => {
						const name = nanoid();
						cy.withDataProvider({
							component: <BackgroundControl />,
							value: {
								'image-0': { type: 'image', isOpen: true },
							},
							store: STORE_NAME,
							name,
						});

						// Wait for the popover to ensure the component is fully rendered
						cy.get('.blockera-component-popover', {
							timeout: 20000,
						}).should('be.visible');

						cy.get('.blockera-component-popover').within(() => {
							cy.get('[aria-label="Vertically"]').click();
							cy.get('[aria-label="Vertically"]').should(
								'have.attr',
								'aria-checked',
								'true'
							);
						});

						cy.then(() => {
							const items = getControlValue(name, STORE_NAME);

							expect(
								items['image-0']['image-repeat']
							).to.be.equal('repeat-y');
						});
					});
				});

				context('effect', () => {
					// positive false
					it('should change image-attachment in data when toggling between effect options', () => {
						const name = nanoid();
						cy.withDataProvider({
							component: <BackgroundControl />,
							value: {
								'image-0': { type: 'image', isOpen: true },
							},
							store: STORE_NAME,
							name,
						});

						// Wait for the popover to ensure the component is fully rendered
						cy.get('.blockera-component-popover', {
							timeout: 20000,
						}).should('be.visible');

						cy.get('.blockera-component-popover').within(() => {
							cy.get('button[aria-label="Parallax"]').click();
							cy.get('button[aria-label="Parallax"]').should(
								'have.attr',
								'aria-checked',
								'true'
							);
						});

						cy.then(() => {
							const items = getControlValue(name, STORE_NAME);

							expect(
								items['image-0']['image-attachment']
							).to.be.equal('fixed');
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

					// Wait for the popover to ensure the component is fully rendered
					cy.get('.blockera-component-popover', {
						timeout: 20000,
					}).should('be.visible');

					cy.get('.blockera-component-popover').within(() => {
						cy.get(
							'.components-custom-gradient-picker__gradient-bar-background'
						).as('gradientBar');

						cy.get('@gradientBar').click();
					});

					cy.get('input[maxlength="9"]').clear({ force: true });
					cy.get('input[maxlength="9"]').type('FFA33C ', {
						delay: 0,
					});

					cy.get('@gradientBar').should(($gradientBar) => {
						const background = $gradientBar.css('background');
						expect(background).to.include('rgb(255, 163, 60)');
					});

					cy.then(() => {
						const items = getControlValue(name, STORE_NAME);

						expect(
							items['linear-gradient-0']['linear-gradient']
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

					// Wait for the popover to ensure the component is fully rendered
					cy.get('.blockera-component-popover', {
						timeout: 20000,
					}).should('be.visible');

					cy.get('.blockera-component-popover').within(() => {
						cy.getParentContainer('Angel').within(() => {
							cy.get('input[type="number"]').clear();
							cy.get('input[type="number"]').type('135', {
								delay: 0,
							});
							cy.get('input[type="number"]').should(
								'have.value',
								'135'
							);
						});
					});

					cy.then(() => {
						const items = getControlValue(name, STORE_NAME);

						expect(
							items['linear-gradient-0']['linear-gradient-angel']
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

					// Wait for the popover to ensure the component is fully rendered
					cy.get('.blockera-component-popover', {
						timeout: 20000,
					}).should('exist');

					cy.get('.blockera-component-popover').then(() => {
						cy.get('button[aria-label="Repeat"]').then(($btn) => {
							$btn.click();
						});
						cy.get('button[aria-label="Repeat"]').should(
							'have.attr',
							'aria-checked',
							'true'
						);
					});

					cy.then(() => {
						const items = getControlValue(name, STORE_NAME);

						expect(
							items['linear-gradient-0']['linear-gradient-repeat']
						).to.be.equal('repeat');
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

					// Wait for the popover to ensure the component is fully rendered
					cy.get('.blockera-component-popover', {
						timeout: 20000,
					}).should('be.visible');

					cy.get('.blockera-component-popover').within(() => {
						cy.get('button[aria-label="Parallax"]').click();
						cy.get('button[aria-label="Parallax"]').should(
							'have.attr',
							'aria-checked',
							'true'
						);
					});

					cy.then(() => {
						const items = getControlValue(name, STORE_NAME);

						expect(
							items['linear-gradient-0'][
								'linear-gradient-attachment'
							]
						).to.be.equal('fixed');
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

					// Wait for the popover to ensure the component is fully rendered
					cy.get('.blockera-component-popover', {
						timeout: 20000,
					}).should('be.visible');

					cy.get('.blockera-component-popover').within(() => {
						cy.get(
							'.components-custom-gradient-picker__gradient-bar-background'
						).as('gradientBar');

						cy.get('@gradientBar').click();
					});

					cy.get('input[maxlength="9"]').clear({ force: true });
					cy.get('input[maxlength="9"]').type('FFA33C ');

					cy.get('@gradientBar').should(($gradientBar) => {
						const background = $gradientBar.css('background');
						expect(background).to.include('rgb(255, 163, 60)');
					});

					cy.then(() => {
						const items = getControlValue(name, STORE_NAME);

						expect(
							items['radial-gradient-0']['radial-gradient']
						).to.include('rgb(255,163,60)');
					});
				});

				it('should change radial-gradient-position in data by entering new value in inputs', () => {
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

					// Wait for the popover to ensure the component is fully rendered
					cy.get('.blockera-component-popover', {
						timeout: 20000,
					}).should('be.visible');

					cy.get('.blockera-component-popover').within(() => {
						cy.get('input[type="text"]')
							.eq(0)
							.as('positionTopInput');
						cy.get('@positionTopInput').clear();
						cy.get('@positionTopInput').type('80');
						cy.get('@positionTopInput').should('have.value', '80');
					});

					cy.then(() => {
						const items = getControlValue(name, STORE_NAME);

						expect(
							items['radial-gradient-0'][
								'radial-gradient-position'
							].top
						).to.be.equal('80%');
					});
				});

				it('should change radial-gradient-size in data when toggling between size options', () => {
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

					// Wait for the popover to ensure the component is fully rendered
					cy.get('.blockera-component-popover', {
						timeout: 20000,
					}).should('be.visible');

					cy.get('.blockera-component-popover').within(() => {
						cy.get('button[data-value="closest-corner"]').click();
						cy.get('button[data-value="closest-corner"]').should(
							'have.attr',
							'aria-checked',
							'true'
						);
					});

					cy.then(() => {
						const items = getControlValue(name, STORE_NAME);

						expect(
							items['radial-gradient-0']['radial-gradient-size']
						).to.be.equal('closest-corner');
					});
				});

				it('should change radial-gradient-repeat in data when toggling between repeat options', () => {
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

					cy.get('.blockera-component-popover', {
						timeout: 20000,
					}).should('be.visible');

					cy.get('.blockera-component-popover').within(() => {
						cy.get('button[aria-label="Repeat"]').click();
						cy.get('button[aria-label="Repeat"]').should(
							'have.attr',
							'aria-checked',
							'true'
						);
					});

					cy.then(() => {
						const items = getControlValue(name, STORE_NAME);

						expect(
							items['radial-gradient-0']['radial-gradient-repeat']
						).to.be.equal('repeat');
					});
				});

				it('should change radial-gradient-attachment in data when toggling between effect options', () => {
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

					cy.get('.blockera-component-popover', {
						timeout: 20000,
					}).should('be.visible');

					cy.get('.blockera-component-popover').within(() => {
						cy.get('button[aria-label="Parallax"]').click();

						cy.get('button[aria-label="Parallax"]').should(
							'have.attr',
							'aria-checked',
							'true'
						);
					});

					cy.then(() => {
						const items = getControlValue(name, STORE_NAME);

						expect(
							items['radial-gradient-0'][
								'radial-gradient-attachment'
							]
						).to.be.equal('fixed');
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

						cy.get(
							'.blockera-control-mesh-generator-preview'
						).click();

						cy.get('.blockera-control-mesh-generator-preview').then(
							() => {
								const newColors = getControlValue(
									name,
									STORE_NAME
								)['mesh-gradient-0']['mesh-gradient-colors'];
								expect(newColors.length).to.be.equal(
									colors.length
								);
								expect(newColors).to.not.be.deep.equal(colors);
								const newMesh = getControlValue(
									name,
									STORE_NAME
								)['mesh-gradient-0']['mesh-gradient'];
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
						cy.get('.blockera-component-popover', {
							timeout: 20000,
						}).should('be.visible');

						cy.getByDataCy('repeater-item').eq(3).click();

						cy.get('.blockera-component-popover')
							.last()
							.within(() => {
								cy.get('input[maxlength="9"]').as('colorInput');
								cy.get('@colorInput').clear({ force: true });
								cy.get('@colorInput').type('4fecff ', {
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
						cy.get('.blockera-component-popover', {
							timeout: 20000,
						}).should('be.visible');

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
								expect($items.last().text()).to.match(
									/^#\w{6}$/
								);
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

								const newMesh = getControlValue(
									name,
									STORE_NAME
								)['mesh-gradient-0']['mesh-gradient'];
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
					}).then(() => {
						cy.get('.blockera-component-popover', {
							timeout: 20000,
						}).should('be.visible');

						cy.get('.blockera-component-popover', {
							timeout: 20000,
						}).should('be.visible');

						cy.getByDataId('--c1').realHover();
						cy.getByAriaLabel('Delete c2').should('not.exist');

						cy.getByAriaLabel(
							'Add New Mesh Gradient Color'
						).click();

						cy.getByDataId('--c1').realHover();
						cy.getByAriaLabel('Delete c2').should('exist');
					});
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
						cy.get('.blockera-component-popover', {
							timeout: 20000,
						}).should('be.visible');

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
								const newColors = getControlValue(
									name,
									STORE_NAME
								)['mesh-gradient-0']['mesh-gradient-colors'];
								expect(
									Object.keys(newColors).length
								).to.be.equal(Object.keys(colors).length);

								const newMesh = getControlValue(
									name,
									STORE_NAME
								)['mesh-gradient-0']['mesh-gradient'];

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
					}).then(() => {
						cy.get('.blockera-component-popover', {
							timeout: 20000,
						}).should('be.visible');

						cy.getByAriaLabel('Parallax').click();

						cy.getByAriaLabel('Parallax')
							.should('have.attr', 'aria-checked', 'true')
							.then(() => {
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
	}
);
