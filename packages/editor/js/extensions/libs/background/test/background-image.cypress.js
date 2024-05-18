import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	hexToRGB,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Background Image → Functionality', () => {
	beforeEach(() => {
		createPost();

		// add block, select it, open style tab
		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type("life is too short. isn't it?", {
			delay: 0,
		});

		cy.getByAriaLabel('Settings').eq(1).click({ force: true });

		cy.getByDataTest('style-tab').click();
	});

	describe('Image', () => {
		beforeEach(() => {
			// add bg repeater, open it
			cy.getParentContainer('Image & Gradient').as('image-and-gradient');

			cy.get('@image-and-gradient').within(() => {
				cy.getByAriaLabel('Add New Background').as('bgRepeaterAddBtn');
				cy.get('@bgRepeaterAddBtn').click();
			});

			// add background image before each test in the context to make other settings available
			cy.get('[data-test="popover-header"]')
				.parent()
				.within(() => {
					cy.contains('button', /choose image/i).click();
				});

			cy.get('#menu-item-upload').click();

			cy.get('input[type="file"]').selectFile(
				'cypress/fixtures/bg-extension-test.jpeg',
				{
					force: true,
				}
			);

			cy.get('.media-toolbar-primary > .button').click();
		});

		it('should add background image to block', () => {
			//assert data
			getWPDataObject().then((data) => {
				const backgroundImageState = getSelectedBlock(
					data,
					'blockeraBackground'
				)['image-0'].image;

				expect(backgroundImageState).to.match(/bg-extension-test/);
			});

			//assert editor
			cy.getBlock('core/paragraph')
				.should('have.css', 'background-image')
				.and('match', /bg-extension-test/);

			//assert frontend
			savePage();
			redirectToFrontPage();
			cy.get('.blockera-core-block')
				.should('have.css', 'background-image')
				.and('match', /bg-extension-test/);
		});

		it('should be able to set background size to contain', () => {
			cy.get('.blockera-component-popover').within(() => {
				cy.getParentContainer('Size').within(() => {
					cy.get('button[data-value="contain"]').click();
				});

				getWPDataObject().then((data) => {
					const backgroundImgSizeState = getSelectedBlock(
						data,
						'blockeraBackground'
					)['image-0']['image-size'];

					expect(backgroundImgSizeState).to.be.equal('contain');
				});
			});

			//assert editor
			cy.getBlock('core/paragraph').should(
				'have.css',
				'background-size',
				'contain'
			);

			//assert frontend
			savePage();
			redirectToFrontPage();
			cy.get('.blockera-core-block').should(
				'have.css',
				'background-size',
				'contain'
			);
		});

		it("should apply 'auto auto' by default for bg-size on custom ", () => {
			cy.get('.blockera-component-popover').within(() => {
				cy.getParentContainer('Size').within(() => {
					cy.get('button[data-value="custom"]').click();
				});

				//assert data
				getWPDataObject().then((data) => {
					const backgroundState = getSelectedBlock(
						data,
						'blockeraBackground'
					)['image-0'];

					expect(backgroundState['image-size']).to.be.equal('custom');

					expect(backgroundState['image-size-width']).to.be.equal(
						'auto'
					);

					expect(backgroundState['image-size-width']).to.be.equal(
						'auto'
					);
				});
			});

			//assert editor
			cy.getBlock('core/paragraph').should(
				'have.css',
				'background-size',
				'auto'
			);

			//assert frontend
			savePage();
			redirectToFrontPage();
			cy.get('.blockera-core-block').should(
				'have.css',
				'background-size',
				'auto'
			);
		});

		it('should be able to set background position, Repeat, Effect', () => {
			cy.get('.blockera-component-popover').within(() => {
				cy.getParentContainer('Position').within(() => {
					cy.get('input').each(($input) => {
						cy.wrap($input).clear();
						cy.wrap($input).type('20');
					});
				});

				cy.getParentContainer('Repeat').within(() => {
					cy.get('button[data-value="no-repeat"]').click();
				});

				cy.getParentContainer('Effect').within(() => {
					cy.get('button')
						.contains('button', /parallax/i)
						.click();
				});
			});

			// assert data
			getWPDataObject().then((data) => {
				const backgroundState = getSelectedBlock(
					data,
					'blockeraBackground'
				)['image-0'];

				// assert position data
				expect(backgroundState['image-position'].top).to.be.equal(
					'20%'
				);
				expect(backgroundState['image-position'].left).to.be.equal(
					'20%'
				);

				// assert repeat data
				expect(backgroundState['image-repeat']).to.be.equal(
					'no-repeat'
				);

				// assert effect data
				expect(backgroundState['image-attachment']).to.be.equal(
					'fixed'
				);
			});

			// assert editor
			cy.getBlock('core/paragraph')
				.should('have.css', 'background-position', '20% 20%')
				.and('have.css', 'background-repeat', 'no-repeat')
				.and('have.css', 'background-attachment', 'fixed');

			// assert frontend
			savePage();
			redirectToFrontPage();
			cy.get('.blockera-core-block')
				.should('have.css', 'background-position', '20% 20%')
				.and('have.css', 'background-repeat', 'no-repeat')
				.and('have.css', 'background-attachment', 'fixed');
		});
	});

	describe('Linear Gradient', () => {
		// linear-gradient(90deg,#009efa 10%,#e52e00 90%)
		beforeEach(() => {
			// add bg repeater, open it
			cy.getParentContainer('Image & Gradient').as('image-and-gradient');

			cy.get('@image-and-gradient').within(() => {
				cy.getByAriaLabel('Add New Background').as('bgRepeaterAddBtn');

				cy.get('@bgRepeaterAddBtn').click();
			});

			cy.getByAriaLabel('Linear Gradient').click();
		});

		it('simple value linear gradient', () => {
			cy.get('.blockera-component-popover').within(() => {
				// set angle
				cy.getParentContainer('Angel').within(() => {
					cy.get('input').clear();
					cy.get('input').type('7');
				});

				// set repeat
				cy.getParentContainer('Repeat').within(() => {
					cy.get('button').last().click();
				});

				// set effect
				cy.getParentContainer('Effect').within(() => {
					cy.get('button')
						.contains('button', /parallax/i)
						.click();
				});
			});

			// assert data
			getWPDataObject().then((data) => {
				const backgroundState = getSelectedBlock(
					data,
					'blockeraBackground'
				)['linear-gradient-0'];

				// assert gradient
				expect(backgroundState['linear-gradient']).to.match(
					/linear-gradient/
				);

				// assert angle data
				expect(backgroundState['linear-gradient-angel']).to.be.equal(7);

				// assert repeat data
				expect(backgroundState['linear-gradient-repeat']).to.be.equal(
					'repeat'
				);

				// assert effect data
				expect(
					backgroundState['linear-gradient-attachment']
				).to.be.equal('fixed');
			});

			// assert editor
			cy.getBlock('core/paragraph').should(($block) => {
				// angle + also gradient
				expect($block.css('background-image')).to.match(/7deg,/i);

				// repeat
				expect($block.css('background-repeat')).to.be.equal('repeat');
				expect($block.css('background-image')).to.match(/^repeating-/i);

				// effect
				expect($block.css('background-attachment')).to.be.equal(
					'fixed'
				);
			});

			// assert frontend
			savePage();
			redirectToFrontPage();
			cy.get('.blockera-core-block').should(($block) => {
				// angle + also gradient
				expect($block.css('background-image')).to.match(/7deg,/i);

				// repeat
				expect($block.css('background-repeat')).to.be.equal('repeat');
				expect($block.css('background-image')).to.match(/^repeating-/i);

				// effect
				expect($block.css('background-attachment')).to.be.equal(
					'fixed'
				);
			});
		});

		it('variable linear gradient', () => {
			cy.get('.blockera-component-popover').within(() => {
				cy.getParentContainer('Linear Gradient')
					.last()
					.within(() => {
						cy.openValueAddon();
					});

				// select variable
				cy.selectValueAddonItem('gradient-3');
			});

			// assert data
			getWPDataObject().then((data) => {
				expect({
					settings: {
						name: 'Vertical soft rust to white',
						id: 'gradient-3',
						value: 'linear-gradient(to bottom, #D8613C 0%, #F9F9F9 100%)',
						reference: {
							type: 'theme',
							theme: 'Twenty Twenty-Four',
						},
						type: 'linear-gradient',
						var: '--wp--preset--gradient--gradient-3',
					},
					name: 'Vertical soft rust to white',
					isValueAddon: true,
					valueType: 'variable',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBackground')[
						'linear-gradient-0'
					]['linear-gradient']
				);
			});

			// assert editor
			cy.getBlock('core/paragraph').should(($block) => {
				expect($block.css('background-image')).to.be.equal(
					'linear-gradient(rgb(216, 97, 60) 0%, rgb(249, 249, 249) 100%)'
				);
			});

			// assert frontend
			savePage();
			redirectToFrontPage();
			cy.get('.blockera-core-block').should(($block) => {
				expect($block.css('background-image')).to.be.equal(
					'linear-gradient(rgb(216, 97, 60) 0%, rgb(249, 249, 249) 100%)'
				);
			});
		});
	});

	describe('Radial Gradient', () => {
		beforeEach(() => {
			// add bg repeater, open it
			cy.getParentContainer('Image & Gradient').as('image-and-gradient');

			cy.get('@image-and-gradient').within(() => {
				cy.getByAriaLabel('Add New Background').as('bgRepeaterAddBtn');
				cy.get('@bgRepeaterAddBtn').click();
			});

			// switch to radial gradient type
			cy.get('button[aria-label="Radial Gradient"]').click();
		});

		it('simple value radial gradient', () => {
			cy.get('.blockera-component-popover').within(() => {
				// set position
				cy.getParentContainer('Position').within(() => {
					cy.get('input').each(($input) => {
						cy.wrap($input).clear();
						cy.wrap($input).type('20');
					});
				});

				//  set size
				cy.getParentContainer('Size').within(() => {
					cy.get('button[data-value="closest-side"]').click();
				});

				// set repeat
				cy.getParentContainer('Repeat').within(() => {
					cy.get('button').last().click();
				});

				// set effect
				cy.getParentContainer('Effect').within(() => {
					cy.get('button')
						.contains('button', /parallax/i)
						.click();
				});
			});

			// assert data
			getWPDataObject().then((data) => {
				const backgroundState = getSelectedBlock(
					data,
					'blockeraBackground'
				)['radial-gradient-0'];

				// assert gradient
				expect(backgroundState['radial-gradient']).to.match(
					/radial-gradient/
				);

				// assert position data
				expect(
					backgroundState['radial-gradient-position']
				).to.be.deep.equal({ top: '20%', left: '20%' });

				// assert size data
				expect(backgroundState['radial-gradient-size']).to.be.equal(
					'closest-side'
				);

				// assert repeat data
				expect(backgroundState['radial-gradient-repeat']).to.be.equal(
					'repeat'
				);

				// assert effect data
				expect(
					backgroundState['radial-gradient-attachment']
				).to.be.equal('fixed');
			});

			// assert editor
			cy.getBlock('core/paragraph').should(($block) => {
				// position + also gradient
				expect($block.css('background-image')).to.match(/at 20% 20%,/i);

				// size
				expect($block.css('background-image')).to.match(/closest-side/);

				// repeat
				expect($block.css('background-repeat')).to.be.equal('repeat');
				expect($block.css('background-image')).to.match(/^repeating-/i);

				// effect
				expect($block.css('background-attachment')).to.be.equal(
					'fixed'
				);
			});

			// assert frontend
			savePage();
			redirectToFrontPage();
			cy.get('.blockera-core-block').should(($block) => {
				// position + also gradient
				expect($block.css('background-image')).to.match(/at 20% 20%,/i);

				// size
				expect($block.css('background-image')).to.match(/closest-side/);

				// repeat
				expect($block.css('background-repeat')).to.be.equal('repeat');
				expect($block.css('background-image')).to.match(/^repeating-/i);

				// effect
				expect($block.css('background-attachment')).to.be.equal(
					'fixed'
				);
			});
		});
	});

	describe('Mesh Gradient', () => {
		beforeEach(() => {
			// add bg repeater, open it
			cy.getParentContainer('Image & Gradient').as('image-and-gradient');

			cy.get('@image-and-gradient').within(() => {
				cy.getByAriaLabel('Add New Background').as('bgRepeaterAddBtn');
				cy.get('@bgRepeaterAddBtn').click();
			});

			// switch to mesh gradient type
			cy.get('button[aria-label="Mesh Gradient"]').click();
		});

		it('assert by default value', () => {
			let colorsInUi = [];

			cy.get('.blockera-component-popover').within(() => {
				// get UI colors
				cy.get('.blockera-control-header-label').should(($spans) => {
					colorsInUi = $spans.get().map((span) => ({
						color: span.innerText,
					}));
				});

				// set effect
				cy.getParentContainer('Effect').within(() => {
					cy.get('button')
						.contains('button', /parallax/i)
						.click();
				});
			});

			// assert data
			getWPDataObject().then((data) => {
				const backgroundState = getSelectedBlock(
					data,
					'blockeraBackground'
				)['mesh-gradient-0'];

				// colors
				let index = 0;
				Object.entries(backgroundState['mesh-gradient-colors']).forEach(
					([, colorInState]) => {
						expect(colorInState.color).to.be.equal(
							colorsInUi[index].color
						);

						index++;
					}
				);

				// effect
				expect(backgroundState['mesh-gradient-attachment']).to.be.equal(
					'fixed'
				);
			});

			// assert editor
			cy.getBlock('core/paragraph').should(($block) => {
				// colors + gradient
				colorsInUi.forEach((colorInUi) => {
					const rgbColorInUi = hexToRGB(colorInUi.color);
					expect($block.css('background-image')).to.contain(
						rgbColorInUi
					);
				});

				// effect
				expect($block.css('background-attachment')).to.be.equal(
					'fixed, '.repeat(colorsInUi.length - 1) + 'fixed'
				);
			});

			// assert frontend
			savePage();
			redirectToFrontPage();
			cy.get('.blockera-core-block').then(($block) => {
				// colors + gradient
				colorsInUi.forEach((colorInUi) => {
					const rgbColorInUi = hexToRGB(colorInUi.color);
					expect($block.css('background-image')).to.contain(
						rgbColorInUi
					);
				});

				// effect
				expect($block.css('background-attachment')).to.be.equal(
					'fixed, '.repeat(colorsInUi.length - 1) + 'fixed'
				);
			});
		});
	});
});
