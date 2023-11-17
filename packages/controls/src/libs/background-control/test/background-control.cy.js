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

	context('Rendering', () => {});
	context('Functional', () => {
		context('image type', () => {
			context('size', () => {
				it('should change image-size in data by toggling between size options', () => {
					const name = nanoid();
					cy.withDataProvider({
						component: <BackgroundControl />,
						value: [{ type: 'image', isOpen: true }],
						store: STORE_NAME,
						name,
					});

					cy.get('[aria-label="Contain"]').click();
					cy.get('[aria-label="Contain"]').then(() => {
						const imageSize = getControlValue(name, STORE_NAME)[0][
							'image-size'
						];
						expect(imageSize).to.be.equal('contain');
					});
				});

				it('should be able to enter custom image width via input', () => {
					const name = nanoid();
					cy.withDataProvider({
						component: <BackgroundControl />,
						value: [{ type: 'image', isOpen: true }],
						store: STORE_NAME,
						name,
					});

					cy.get('[aria-label="Custom"]').click();

					cy.get('[aria-label="Select unit"]')
						.eq(0)
						.as('widthSelect');

					cy.get('@widthSelect')
						.parent()
						.siblings('input[type="number"]')
						.as('widthInput');

					cy.get('@widthSelect').select('px');

					cy.get('@widthInput').clear();
					cy.get('@widthInput').type('50');

					cy.get('@widthInput').then(() => {
						const imageWidth = getControlValue(name, STORE_NAME)[0][
							'image-size-width'
						];

						expect(imageWidth).to.be.equal('50px');
					});
				});
			});

			context('position', () => {
				it('should change image-position in data by entering new value in inputs', () => {
					const name = nanoid();
					cy.withDataProvider({
						component: <BackgroundControl />,
						value: [{ type: 'image', isOpen: true }],
						store: STORE_NAME,
						name,
					});

					cy.get('input[type="number"]').eq(2).as('positionTopInput');
					cy.get('@positionTopInput').clear();
					cy.get('@positionTopInput').type('80');
					cy.get('@positionTopInput').then(() => {
						const positionTop = getControlValue(
							name,
							STORE_NAME
						)[0]['image-position'].top;

						expect(positionTop).to.be.equal('80%');
					});
				});
			});

			context('repeat', () => {
				it('should change image-repeat in data when toggling between repeat options', () => {
					const name = nanoid();
					cy.withDataProvider({
						component: <BackgroundControl />,
						value: [{ type: 'image', isOpen: true }],
						store: STORE_NAME,
						name,
					});

					cy.get('[aria-label="Vertically"').as('verticalRepeatBtn');
					cy.get('@verticalRepeatBtn').click();
					cy.get('@verticalRepeatBtn')
						.should('have.attr', 'aria-checked', 'true')
						.then(() => {
							const imageRepeat = getControlValue(
								name,
								STORE_NAME
							)[0]['image-repeat'];

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
						value: [{ type: 'image', isOpen: true }],
						store: STORE_NAME,
						name,
					});

					cy.get('button[aria-label="Parallax"]').click();
					cy.get('button[aria-label="Parallax"]')
						.should('have.attr', 'aria-checked', 'true')
						.then(() => {
							const imageAttachment = getControlValue(
								name,
								STORE_NAME
							)[0]['image-attachment'];

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
					value: [{ type: 'linear-gradient', isOpen: true }],
					store: STORE_NAME,
					name,
				});

				cy.get(
					'.components-custom-gradient-picker__gradient-bar-background'
				).as('gradientBar');

				cy.get('@gradientBar').click();

				cy.get('input[maxLength="9"]').as('colorInput');
				cy.get('@colorInput').clear();
				cy.get('@colorInput').type('FFA33C');

				cy.get('@gradientBar').should(($gradientBar) => {
					const background = $gradientBar.css('background');
					expect(background).to.include('rgb(255, 163, 60)');

					const linearGradient = getControlValue(name, STORE_NAME)[0][
						'linear-gradient'
					];
					expect(linearGradient).to.include('rgb(255,163,60)');
				});
			});

			it('should change linear-gradient-angel in data when entering new value in angel input', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: [{ type: 'linear-gradient', isOpen: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Angel"]')
					.parent()
					.siblings()
					.find('input[type="number"]')
					.as('angelInput');

				cy.get('@angelInput').clear();
				cy.get('@angelInput').type('135');

				cy.get('@angelInput').then(() => {
					const angel = getControlValue(name, STORE_NAME)[0][
						'linear-gradient-angel'
					];

					expect(angel).to.be.equal(135);
				});
			});

			it('should change linear-gradient-repeat in data when toggling between repeat options', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: [{ type: 'linear-gradient', isOpen: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('button[aria-label="Repeat"]').click();
				cy.get('button[aria-label="Repeat"]').then(() => {
					const repeat = getControlValue(name, STORE_NAME)[0][
						'linear-gradient-repeat'
					];

					expect(repeat).to.be.equal('repeat');
				});
			});

			it('should change linear-gradient-attachment in data when toggling between effect options', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: [{ type: 'linear-gradient', isOpen: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('button[aria-label="Parallax"]').click();
				cy.get('button[aria-label="Parallax"]')
					.should('have.attr', 'aria-checked', 'true')
					.then(() => {
						const linearGradientAttachment = getControlValue(
							name,
							STORE_NAME
						)[0]['linear-gradient-attachment'];

						expect(linearGradientAttachment).to.be.equal('fixed');
					});
			});
		});
		context('radial-gradient type', () => {
			it('should be able to add new color into gradient', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: [{ type: 'radial-gradient', isOpen: true }],
					store: STORE_NAME,
					name,
				});

				cy.get(
					'.components-custom-gradient-picker__gradient-bar-background'
				).as('gradientBar');

				cy.get('@gradientBar').click();

				cy.get('input[maxLength="9"]').as('colorInput');
				cy.get('@colorInput').clear();
				cy.get('@colorInput').type('FFA33C');

				cy.get('@gradientBar').should(($gradientBar) => {
					const background = $gradientBar.css('background');
					expect(background).to.include('rgb(255, 163, 60)');

					const radialGradient = getControlValue(name, STORE_NAME)[0][
						'radial-gradient'
					];
					expect(radialGradient).to.include('rgb(255,163,60)');
				});
			});

			it('should change radial-gradient-position in data by entering new value in inputs', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: [{ type: 'radial-gradient', isOpen: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('input[type="number"]').eq(0).as('positionTopInput');
				cy.get('@positionTopInput').clear();
				cy.get('@positionTopInput').type('80');

				cy.get('@positionTopInput').then(() => {
					const positionTop = getControlValue(name, STORE_NAME)[0][
						'radial-gradient-position'
					].top;

					expect(positionTop).to.be.equal('80%');
				});
			});

			it('should change radial-gradient-size in data when toggling between size options', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: [{ type: 'radial-gradient', isOpen: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('button[data-value="closest-corner"]').click();
				cy.get('button[data-value="closest-corner"]').then(() => {
					const size = getControlValue(name, STORE_NAME)[0][
						'radial-gradient-size'
					];

					expect(size).to.be.equal('closest-corner');
				});
			});

			it('should change radial-gradient-repeat in data when toggling between repeat options', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: [{ type: 'radial-gradient', isOpen: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('button[aria-label="Repeat"]').click();
				cy.get('button[aria-label="Repeat"]').then(() => {
					const repeat = getControlValue(name, STORE_NAME)[0][
						'radial-gradient-repeat'
					];

					expect(repeat).to.be.equal('repeat');
				});
			});

			it('should change radial-gradient-attachment in data when toggling between effect options', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: [{ type: 'radial-gradient', isOpen: true }],
					store: STORE_NAME,
					name,
				});

				cy.get('button[aria-label="Parallax"]').click();
				cy.get('button[aria-label="Parallax"]')
					.should('have.attr', 'aria-checked', 'true')
					.then(() => {
						const linearGradientAttachment = getControlValue(
							name,
							STORE_NAME
						)[0]['radial-gradient-attachment'];

						expect(linearGradientAttachment).to.be.equal('fixed');
					});
			});
		});

		context('mesh-gradient type', () => {
			it('should replace existing colors with random colors by clicking on Regenerate btn or preview', () => {
				const colors = [
					{ color: '#fefe' },
					{ color: '#35ff4c' },
					{ color: '#4deaff' },
				];
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: [
						{
							type: 'mesh-gradient',
							'mesh-gradient': '',
							'mesh-gradient-colors': colors,
							'mesh-gradient-attachment': 'scroll',
							isVisible: true,
							isOpen: true,
						},
					],
					store: STORE_NAME,
					name,
				});

				cy.get('.publisher-control-mesh-generator-preview').click();
				cy.get('.publisher-control-mesh-generator-preview').then(() => {
					const newColors = getControlValue(name, STORE_NAME)[0][
						'mesh-gradient-colors'
					];
					expect(newColors).to.not.be.deep.equal(colors);
					expect(newColors.length).to.be.equal(colors.length);
				});
			});

			it('should be able to change existing colors', () => {
				const colors = [
					{ color: '#fefe' },
					{ color: '#35ff4c' },
					{ color: '#4deaff' },
				];
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: [
						{
							type: 'mesh-gradient',
							'mesh-gradient': '',
							'mesh-gradient-colors': colors,
							'mesh-gradient-attachment': 'scroll',
							isVisible: true,
							isOpen: true,
						},
					],
					store: STORE_NAME,
					name,
				});

				cy.getByDataCy('control-group').last().click();
				cy.get('input[maxLength="9"]').as('colorInput');
				cy.get('@colorInput').clear();
				cy.get('@colorInput').type('4fecff');
				cy.get('@colorInput').then(() => {
					cy.getByDataCy('control-group')
						.last()
						.should('contain', '#4fecff');

					const newColors = getControlValue(name, STORE_NAME)[0][
						'mesh-gradient-colors'
					];
					expect(newColors[newColors.length - 1].color).to.be.equal(
						'#4fecff'
					);
				});
			});

			it('should add new random color at the end by clicking add btn', () => {
				const colors = [
					{ color: '#fefe' },
					{ color: '#35ff4c' },
					{ color: '#4deaff' },
				];
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: [
						{
							type: 'mesh-gradient',
							'mesh-gradient': '',
							'mesh-gradient-colors': colors,
							'mesh-gradient-attachment': 'scroll',
							isVisible: true,
							isOpen: true,
						},
					],
					store: STORE_NAME,
					name,
				});

				cy.get('[aria-label="Add New Mesh Gradient Color"]')
					.as('addColor')
					.click();

				cy.getByDataCy('control-group')
					.should('have.length', '5')
					.last()
					.invoke('text')
					.should('match', /^#\w{6}/)
					.then(() => {
						const newColors = getControlValue(name, STORE_NAME)[0][
							'mesh-gradient-colors'
						];

						expect(newColors.length).to.be.equal(4);
						expect(newColors.slice(-1)[0].color).to.match(
							/^#\w{6}/
						);
					});
			});

			it.skip('should regenerate new gradient by adding new color', () => {
				const colors = [
					{ color: '#fefe' },
					{ color: '#35ff4c' },
					{ color: '#4deaff' },
				];
				const name = nanoid();
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: [
						{
							type: 'mesh-gradient',
							'mesh-gradient': '',
							'mesh-gradient-colors': colors,
							'mesh-gradient-attachment': 'scroll',
							isVisible: true,
							isOpen: true,
						},
					],
					store: STORE_NAME,
					name,
				});
			});

			it('should change mesh-gradient-attachment in data when toggling between effect options', () => {
				const name = nanoid();
				const colors = [
					{ color: '#fefe' },
					{ color: '#35ff4c' },
					{ color: '#4deaff' },
				];
				cy.withDataProvider({
					component: <BackgroundControl />,
					value: [
						{
							type: 'mesh-gradient',
							'mesh-gradient': '',
							'mesh-gradient-colors': colors,
							'mesh-gradient-attachment': 'scroll',
							isVisible: true,
							isOpen: true,
						},
					],
					store: STORE_NAME,
					name,
				});

				cy.get('button[aria-label="Parallax"]').click();
				cy.get('button[aria-label="Parallax"]')
					.should('have.attr', 'aria-checked', 'true')
					.then(() => {
						const meshGradientAttachment = getControlValue(
							name,
							STORE_NAME
						)[0]['mesh-gradient-attachment'];

						expect(meshGradientAttachment).to.be.equal('fixed');
					});
			});
		});
	});

	context('Initial Value', () => {
		const defaultValue = [
			{
				type: 'radial-gradient',
				image: '',
				'image-size': 'contain',
				'image-size-width': '1auto',
				'image-size-height': '1auto',
				'image-position': {
					top: '50%',
					left: '50%',
				},
				'image-repeat': 'repeat',
				'image-attachment': 'scroll',
				'linear-gradient':
					'linear-gradient(90deg,#009efa 10%,#e52e00 90%)',
				'linear-gradient-angel': '90',
				'linear-gradient-repeat': 'no-repeat',
				'linear-gradient-attachment': 'scroll',
				'radial-gradient':
					'radial-gradient(rgb(0,159,251) 0%,rgb(229,46,0) 100%)',
				'radial-gradient-position': {
					top: '50%',
					left: '50%',
				},
				'radial-gradient-size': 'farthest-corner',
				'radial-gradient-repeat': 'no-repeat',
				'radial-gradient-attachment': 'scroll',
				'mesh-gradient':
					'radial-gradient(at 0% 0%, var(--c0) 0px, transparent 50%),radial-gradient(at 19% 18%, var(--c1) 0px, transparent 55%),radial-gradient(at 27% 57%, var(--c2) 0px, transparent 51%),radial-gradient(at 51% 54%, var(--c3) 0px, transparent 64%)',
				'mesh-gradient-colors': [
					{
						color: '#4dffa9',
					},
					{
						color: '#51fcff',
					},
					{
						color: '#96ff35',
					},
					{
						color: '#ff65fc',
					},
				],
				'mesh-gradient-attachment': 'scroll',
				isVisible: true,
				isOpen: true,
			},
		];

		const value = [
			{
				type: 'linear-gradient',
				image: '',
				'image-size': 'contain',
				'image-size-width': '1auto',
				'image-size-height': '1auto',
				'image-position': {
					top: '50%',
					left: '50%',
				},
				'image-repeat': 'repeat',
				'image-attachment': 'scroll',
				'linear-gradient':
					'linear-gradient(90deg,#009efa 10%,#e52e00 90%)',
				'linear-gradient-angel': '90',
				'linear-gradient-repeat': 'no-repeat',
				'linear-gradient-attachment': 'scroll',
				'radial-gradient':
					'radial-gradient(rgb(0,159,251) 0%,rgb(229,46,0) 100%)',
				'radial-gradient-position': {
					top: '50%',
					left: '50%',
				},
				'radial-gradient-size': 'farthest-corner',
				'radial-gradient-repeat': 'no-repeat',
				'radial-gradient-attachment': 'scroll',
				'mesh-gradient':
					'radial-gradient(at 0% 0%, var(--c0) 0px, transparent 50%),radial-gradient(at 19% 18%, var(--c1) 0px, transparent 55%),radial-gradient(at 27% 57%, var(--c2) 0px, transparent 51%),radial-gradient(at 51% 54%, var(--c3) 0px, transparent 64%)',
				'mesh-gradient-colors': [
					{
						color: '#4dffa9',
					},
					{
						color: '#51fcff',
					},
					{
						color: '#96ff35',
					},
					{
						color: '#ff65fc',
					},
				],
				'mesh-gradient-attachment': 'scroll',
				isVisible: true,
				isOpen: true,
			},
		];

		// 1. positive false -> since there is no value, takes nothing
		it('calculated data must be defaultValue, when defaultValue(ok) && id(!ok) value(undefined)', () => {
			const name = nanoid();

			cy.withDataProvider({
				component: <BackgroundControl defaultValue={defaultValue} />,
				value: undefined,
				store: STORE_NAME,
				name,
			});
		});

		// 2. positive false -> takes value!
		it('calculated data must be defaultValue, when defaultValue(ok) && id(!ok) && value(ok)', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<BackgroundControl defaultValue={defaultValue} id="x.y" />
				),
				value,
				store: STORE_NAME,
				name,
			});

			cy.get('button[aria-label="Image"]').should(
				'have.attr',
				'aria-checked',
				'true'
			);
		});

		// 3. positive false -> since there is no value, takes nothing.
		it('calculated data must be defaultValue, when defaultValue(ok) && id(ok) && value(undefined)', () => {
			cy.withDataProvider({
				component: (
					<BackgroundControl
						id="x[0].b[0].c"
						defaultValue={defaultValue}
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
				store: STORE_NAME,
			});

			cy.get('button[aria-label="Image"]').should(
				'have.attr',
				'aria-checked',
				'true'
			);
		});

		// 4. passes
		it('calculated data must be value, when id(!ok), defaultValue(!ok), value(root)', () => {
			cy.withDataProvider({
				component: <BackgroundControl />,
				value,
				store: STORE_NAME,
			});

			cy.get('button[aria-label="Linear Gradient"]').should(
				'have.attr',
				'aria-checked',
				'true'
			);
		});
	});
});
