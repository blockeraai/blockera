import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

function hexToRGB(hex) {
	let r = 0,
		g = 0,
		b = 0;

	// 3 digits
	if (hex.length === 4) {
		r = '0x' + hex[1] + hex[1];
		g = '0x' + hex[2] + hex[2];
		b = '0x' + hex[3] + hex[3];

		// 6 digits
	} else if (hex.length === 7) {
		r = '0x' + hex[1] + hex[2];
		g = '0x' + hex[3] + hex[4];
		b = '0x' + hex[5] + hex[6];
	}

	return 'rgb(' + +r + ', ' + +g + ', ' + +b + ')';
}

describe('background extension', () => {
	// describe('Extension Initializing', () => {...});

	describe('Image & Gradient', () => {
		beforeEach(() => {
			// add block, select it, open style tab
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type("life is too short. isn't it?");
			cy.get('[aria-label="Settings"]').click({ force: true });
			cy.getByDataTest('style-tab').click();

			// add bg repeater, open it
			cy.get('[aria-label="Image & Gradient"]')
				.parents('[data-cy="base-control"]')
				.as('image-and-gradient');

			cy.get('@image-and-gradient').within(() => {
				cy.get('[aria-label="Add New Background"]').as(
					'bgRepeaterAddBtn'
				);
				cy.get('@bgRepeaterAddBtn').click();
				cy.getByDataCy('repeater-item').click();
			});
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			context('Image', () => {
				beforeEach(() => {
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
							'publisherBackground'
						)[0].image;

						expect(backgroundImageState).to.match(
							/bg-extension-test/
						);
					});

					//assert editor
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'background-image')
						.and('match', /bg-extension-test/);

					//assert frontend
					savePage();
					redirectToFrontPage();
					cy.get('.publisher-paragraph')
						.should('have.css', 'background-image')
						.and('match', /bg-extension-test/);
				});

				// TODO Positive False -> inline styles prevent user style to be applied
				it('should be able to set background size to contain', () => {
					cy.get('[data-test="popover-header"]')
						.parent()
						.within(() => {
							cy.get('[aria-label="Size"]')
								.parent()
								.siblings()
								.contains('button', /contain/i)
								.as('containBtn');

							cy.get('@containBtn').click();

							//assert data
							getWPDataObject().then((data) => {
								const backgroundImgSizeState = getSelectedBlock(
									data,
									'publisherBackground'
								)[0]['image-size'];

								expect(backgroundImgSizeState).to.be.equal(
									'contain'
								);
							});
						});
					//assert editor
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'background-size', 'contain');

					//assert frontend
					savePage();
					redirectToFrontPage();
					cy.get('.publisher-paragraph').should(
						'have.css',
						'background-size',
						'contain'
					);
				});

				// TODO positive False -> inline styles prevent user styles to be applied
				it("should apply 'auto auto' by default for bg-size on custom ", () => {
					cy.get('[data-test="popover-header"]')
						.parent()
						.within(() => {
							cy.get('[aria-label="Size"]')
								.parent()
								.siblings()
								.contains('button', /custom/i)
								.as('customBtn');

							cy.get('@customBtn').click();

							//assert data
							getWPDataObject().then((data) => {
								const backgroundState = getSelectedBlock(
									data,
									'publisherBackground'
								)[0];

								expect(
									backgroundState['image-size']
								).to.be.equal('custom');
								expect(
									backgroundState['image-size-width']
								).to.be.equal('1auto');
								expect(
									backgroundState['image-size-width']
								).to.be.equal('1auto');
							});
						});

					//assert editor
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'background-size', 'auto auto');

					//assert frontend
					savePage();
					redirectToFrontPage();
					cy.get('.publisher-paragraph').should(
						'have.css',
						'background-size',
						'auto auto'
					);
				});

				it('should be able to set background position, Repeat, Effect', () => {
					cy.get('[data-test="popover-header"]')
						.parent()
						.within(() => {
							// set position
							cy.get('[aria-label="Position"]')
								.parent()
								.siblings()
								.children()
								.find('input')
								.each(($input) => {
									cy.wrap($input).clear();
									cy.wrap($input).type('20');
								});

							// set repeat
							cy.get('[aria-label="Repeat"]')
								.parent()
								.siblings()
								.find('button[data-value="no-repeat"]')
								.click();

							// set effect
							cy.get('[aria-label="Effect"]')
								.parent()
								.siblings()
								.contains('button', /parallax/i)
								.click();
						});

					// assert data
					getWPDataObject().then((data) => {
						const backgroundState = getSelectedBlock(
							data,
							'publisherBackground'
						)[0];

						// assert position data
						expect(
							backgroundState['image-position'].top
						).to.be.equal('20%');
						expect(
							backgroundState['image-position'].left
						).to.be.equal('20%');

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
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'background-position', '20% 20%')
						.and('have.css', 'background-repeat', 'no-repeat')
						.and('have.css', 'background-attachment', 'fixed');

					// assert frontend
					savePage();
					redirectToFrontPage();
					cy.get('.publisher-paragraph')
						.should('have.css', 'background-position', '20% 20%')
						.and('have.css', 'background-repeat', 'no-repeat')
						.and('have.css', 'background-attachment', 'fixed');
				});
			});

			context('Linear Gradient', () => {
				// linear-gradient(90deg,#009efa 10%,#e52e00 90%)
				beforeEach(() => {
					cy.get('button[aria-label="Linear Gradient"]').click();
				});

				it('should set linear-gradient, angel, repeat, effect', () => {
					cy.get('[data-test="popover-header"]')
						.parent()
						.within(() => {
							// set angle
							cy.get('[aria-label="Angel"]')
								.parent()
								.siblings()
								.find('input')
								.as('angleInput');
							cy.get('@angleInput').clear();
							cy.get('@angleInput').type('7');

							// set repeat
							cy.get('[aria-label="Repeat"]')
								.parent()
								.siblings()
								.find('button')
								.last()
								.click();

							// set effect
							cy.get('[aria-label="Effect"]')
								.parent()
								.siblings()
								.contains('button', /parallax/i)
								.click();
						});

					// assert data

					getWPDataObject().then((data) => {
						const backgroundState = getSelectedBlock(
							data,
							'publisherBackground'
						)[0];

						// assert gradient
						expect(backgroundState['linear-gradient']).to.match(
							/linear-gradient/
						);

						// assert angle data
						expect(
							backgroundState['linear-gradient-angel']
						).to.be.equal(7);

						// assert repeat data
						expect(
							backgroundState['linear-gradient-repeat']
						).to.be.equal('repeat');

						// assert effect data
						expect(
							backgroundState['linear-gradient-attachment']
						).to.be.equal('fixed');
					});

					// assert editor
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should(($block) => {
							// angle + also gradient
							expect($block.css('background-image')).to.match(
								/7deg,/i
							);

							// repeat
							expect($block.css('background-repeat')).to.be.equal(
								'repeat'
							);
							expect($block.css('background-image')).to.match(
								/^repeating-/i
							);

							// effect
							expect(
								$block.css('background-attachment')
							).to.be.equal('fixed');
						});

					// assert frontend
					savePage();
					redirectToFrontPage();
					cy.get('.publisher-paragraph').should(($block) => {
						// angle + also gradient
						expect($block.css('background-image')).to.match(
							/7deg,/i
						);

						// repeat
						expect($block.css('background-repeat')).to.be.equal(
							'repeat'
						);
						expect($block.css('background-image')).to.match(
							/^repeating-/i
						);

						// effect
						expect($block.css('background-attachment')).to.be.equal(
							'fixed'
						);
					});
				});
			});

			context('Radial Gradient', () => {
				beforeEach(() => {
					cy.get('button[aria-label="Radial Gradient"]').click();
				});

				it('should set radial-gradient, angel, repeat, effect', () => {
					cy.get('[data-test="popover-header"]')
						.parent()
						.within(() => {
							// set position
							cy.get('[aria-label="Position"]')
								.parent()
								.siblings()
								.find('input')
								.each(($input) => {
									cy.wrap($input).clear();
									cy.wrap($input).type('20');
								});

							//  set size
							cy.get('[aria-label="Size"]')
								.parent()
								.siblings()
								.find('button[data-value="closest-side"]')
								.click();

							// set repeat
							cy.get('[aria-label="Repeat"]')
								.parent()
								.siblings()
								.find('button')
								.last()
								.click();

							// set effect
							cy.get('[aria-label="Effect"]')
								.parent()
								.siblings()
								.contains('button', /parallax/i)
								.click();
						});

					// assert data
					getWPDataObject().then((data) => {
						const backgroundState = getSelectedBlock(
							data,
							'publisherBackground'
						)[0];

						// assert gradient
						expect(backgroundState['radial-gradient']).to.match(
							/radial-gradient/
						);

						// assert position data
						expect(
							backgroundState['radial-gradient-position']
						).to.be.deep.equal({ top: '20%', left: '20%' });

						// assert size data
						expect(
							backgroundState['radial-gradient-size']
						).to.be.equal('closest-side');

						// assert repeat data
						expect(
							backgroundState['radial-gradient-repeat']
						).to.be.equal('repeat');

						// assert effect data
						expect(
							backgroundState['radial-gradient-attachment']
						).to.be.equal('fixed');
					});

					// assert editor
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should(($block) => {
							// position + also gradient
							expect($block.css('background-image')).to.match(
								/at 20% 20%,/i
							);

							// size
							expect($block.css('background-image')).to.match(
								/closest-side/
							);

							// repeat
							expect($block.css('background-repeat')).to.be.equal(
								'repeat'
							);
							expect($block.css('background-image')).to.match(
								/^repeating-/i
							);

							// effect
							expect(
								$block.css('background-attachment')
							).to.be.equal('fixed');
						});

					// assert frontend
					savePage();
					redirectToFrontPage();
					cy.get('.publisher-paragraph').should(($block) => {
						// position + also gradient
						expect($block.css('background-image')).to.match(
							/at 20% 20%,/i
						);

						// size
						expect($block.css('background-image')).to.match(
							/closest-side/
						);

						// repeat
						expect($block.css('background-repeat')).to.be.equal(
							'repeat'
						);
						expect($block.css('background-image')).to.match(
							/^repeating-/i
						);

						// effect
						expect($block.css('background-attachment')).to.be.equal(
							'fixed'
						);
					});
				});
			});

			context('Mesh Gradient', () => {
				beforeEach(() => {
					cy.get('button[aria-label="Mesh Gradient"]').click();
				});

				it('assert by default value', () => {
					let colorsInUi = [];
					cy.get('[data-test="popover-header"]')
						.parent()
						.within(() => {
							// get UI colors
							cy.get('.publisher-control-header-label').then(
								($spans) => {
									colorsInUi = $spans.get().map((span) => ({
										color: span.innerText,
									}));
								}
							);

							// set effect
							cy.get('[aria-label="Effect"]')
								.parent()
								.siblings()
								.contains('button', /parallax/i)
								.click();
						});

					// assert data
					getWPDataObject().then((data) => {
						const backgroundState = getSelectedBlock(
							data,
							'publisherBackground'
						)[0];

						console.log(backgroundState);

						// colors
						backgroundState['mesh-gradient-colors'].forEach(
							(colorInState, idx) => {
								expect(colorInState.color).to.be.equal(
									colorsInUi[idx].color
								);
							}
						);

						// effect
						expect(
							backgroundState['mesh-gradient-attachment']
						).to.be.equal('fixed');
					});

					// assert editor
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.then(($block) => {
							// colors + gradient
							colorsInUi.forEach((colorInUi) => {
								const rgbColorInUi = hexToRGB(colorInUi.color);
								expect(
									$block.css('background-image')
								).to.contain(rgbColorInUi);
							});

							console.log(
								'attach',
								$block.css('background-attachment')
							);
							// effect
							expect(
								$block.css('background-attachment')
							).to.be.equal(
								'fixed, '.repeat(colorsInUi.length - 1) +
									'fixed'
							);
						});

					// assert frontend
					savePage();
					redirectToFrontPage();
					cy.get('.publisher-paragraph').then(($block) => {
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
	});

	describe('Color', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');
			cy.getIframeBody().find(`[data-type="core/paragraph"]`).click();
			cy.get('[aria-label="Settings"]').click({ force: true });
			cy.getByDataTest('style-tab').click();

			// add alias to the feature container
			cy.get('[aria-label="BG Color"]')
				.parents('[data-cy="base-control"]')
				.as('bgColorContainer');
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should change background-color', () => {
				// act: clicking on color button
				cy.get('@bgColorContainer').within(() => {
					cy.get('button').as('colorBtn');
					cy.get('@colorBtn').click();
				});

				// act: entering new hexColor
				cy.get('.components-popover').within(() => {
					cy.get('input').as('hexColorInput');
					cy.get('@hexColorInput').clear();
					cy.get('@hexColorInput').type('666');
				});

				//assert data
				getWPDataObject().then((data) => {
					const bgColorState = getSelectedBlock(
						data,
						'publisherBackgroundColor'
					);
					expect(bgColorState).to.be.equal('#666666');
				});

				// assert editor
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should(
						'have.css',
						'backgroundColor',
						'rgb(102, 102, 102)'
					);

				//assert frontend
				savePage();
				redirectToFrontPage();
				cy.get('.publisher-paragraph').should(
					'have.css',
					'background-color',
					'rgb(102, 102, 102)'
				);
			});
		});
	});

	describe('Clip', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');
			cy.getIframeBody().find(`[data-type="core/paragraph"]`).click();
			cy.get('[aria-label="Settings"]').click({ force: true });
			cy.getByDataTest('style-tab').click();

			// add alias to the feature container
			cy.get('[aria-label="Clipping"]')
				.parents('[data-cy="base-control"]')
				.as('clippingContainer');
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			const clippingOptions = [
				'none',
				'padding-box',
				'content-box',
				'inherit',
			];

			clippingOptions.forEach((clipItem) => {
				it(`should set ${clipItem} clipping when clicking on Corresponding option`, () => {
					cy.get('@clippingContainer').within(() => {
						// act: clicking on clipping button
						cy.get('button').as('clippingBtn');
						cy.get('@clippingBtn').click();

						// select corresponding option
						cy.contains(
							'li',
							new RegExp(`${clipItem.split('-')[0]}`, 'i')
						).click();
					});

					//assert data
					getWPDataObject().then((data) => {
						const bgClipState = getSelectedBlock(
							data,
							'publisherBackgroundClip'
						);
						expect(bgClipState).to.be.equal(clipItem);
					});

					const expectedBgClip =
						clipItem === 'padding-box' || clipItem === 'content-box'
							? clipItem
							: 'border-box';

					//assert block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'background-clip', expectedBgClip);

					//assert  frontend
					savePage();
					redirectToFrontPage();

					cy.get('.publisher-paragraph').should(
						'have.css',
						'background-clip',
						expectedBgClip
					);
				});
			});

			// TODO positive false -> should be fixed with php
			it('should set text clipping when block has text and background-mage', () => {
				// type to block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.type('smile =)');

				// cy.get('[aria-label="Settings"]').click({ force: true });
				cy.getByDataTest('style-tab').click();

				cy.get('[aria-label="Image & Gradient"]')
					.parents('[data-cy="base-control"]')
					.as('image-and-gradient');

				cy.get('@image-and-gradient').within(() => {
					// add bg repeater item
					cy.get('[aria-label="Add New Background"]').as(
						'bgRepeaterAddBtn'
					);
					cy.get('@bgRepeaterAddBtn').click();

					// click on bg repeater item to open modal
					cy.getByDataCy('repeater-item').click();
				});

				// add background image
				cy.get('.components-popover').within(() => {
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

				// act : selecting clip to text
				cy.get('@clippingContainer').within(() => {
					cy.get('button').as('clippingBtn');
					cy.get('@clippingBtn').click();
					cy.contains('li', /text/i).click();
				});

				//assert data
				getWPDataObject().then((data) => {
					const bgClipState = getSelectedBlock(
						data,
						'publisherBackgroundClip'
					);
					expect(bgClipState).to.be.equal('text');
				});

				//assert block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'background-clip', 'text')
					.and(
						'have.css',
						'-webkit-text-fill-color',
						'rgba(0, 0, 0, 0)'
					);

				//assert  frontend
				savePage();
				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'background-clip',
					'text'
				);
			});
		});
	});
});
