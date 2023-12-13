import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('Typography Extension', () => {
	//describe('Extension Initializing', () => {...});

	describe('Typography', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('This is test text.');

			cy.getByDataTest('style-tab').click();

			cy.getParentContainer('Typography', 'base-control').within(() => {
				cy.get('button').click();
			});

			cy.getByDataTest('popover-body').as('typography-popover');
		});

		context('Font Size', () => {
			//describe('WordPress Compatibility', () => {...});

			describe('Functionality', () => {
				it('should update font-size, when add data', () => {
					cy.get('@typography-popover').within(() => {
						cy.getParentContainer(
							'Font Size',
							'base-control'
						).within(() => {
							cy.get('input[type="number"]').clear();
							cy.get('input[type="number"]').type(10);
						});
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'font-size', '10px');

					//Check store
					getWPDataObject().then((data) => {
						expect('10px').to.be.equal(
							getSelectedBlock(data, 'publisherFontSize')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').should(
						'have.css',
						'font-size',
						'10px'
					);
				});
			});
		});

		context('Line Height', () => {
			//describe('WordPress Compatibility', () => {...});

			describe('Functionality', () => {
				it('should update line-height, when add data', () => {
					cy.get('@typography-popover').within(() => {
						cy.getParentContainer(
							'Line Height',
							'base-control'
						).within(() => {
							cy.get('input[type="number"]').focus();
							cy.get('input[type="number"]').type(10);
						});
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'line-height');

					//Check store
					getWPDataObject().then((data) => {
						expect('10').to.be.equal(
							getSelectedBlock(data, 'publisherLineHeight')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').should(
						'have.css',
						'line-height'
					);
				});

				it('change line height to px', () => {
					cy.get('@typography-popover').within(() => {
						cy.getParentContainer(
							'Line Height',
							'base-control'
						).within(() => {
							cy.get('input[type="number"]').focus();
							cy.get('input[type="number"]').type(10);
							cy.get('[aria-label="Select Unit"]').select('px');
						});
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'line-height', '10px');

					//Check store
					getWPDataObject().then((data) => {
						expect('10px').to.be.equal(
							getSelectedBlock(data, 'publisherLineHeight')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').should(
						'have.css',
						'line-height',
						'10px'
					);
				});
			});
		});

		context('Align', () => {
			//describe('WordPress Compatibility', () => {...});

			describe('Functionality', () => {
				it('should update text-align, when add center', () => {
					cy.get('@typography-popover').within(() => {
						cy.getByAriaLabel('Center').click();
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'text-align', 'center');

					//Check store
					getWPDataObject().then((data) => {
						expect('center').to.be.equal(
							getSelectedBlock(data, 'publisherTextAlign')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').should(
						'have.css',
						'text-align',
						'center'
					);
				});
			});
		});

		context('Decoration', () => {
			//describe('WordPress Compatibility', () => {...});

			describe('Functionality', () => {
				it('should update text-decoration, when add overline', () => {
					cy.get('@typography-popover').within(() => {
						cy.getByAriaLabel('Overline').click();
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'text-decoration')
						.should('include', 'overline');

					//Check store
					getWPDataObject().then((data) => {
						expect('overline').to.be.equal(
							getSelectedBlock(data, 'publisherTextDecoration')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph')
						.should('have.css', 'text-decoration')
						.should('include', 'overline');
				});
			});
		});

		context('Style', () => {
			//describe('WordPress Compatibility', () => {...});

			describe('Functionality', () => {
				it('should update font-style, when add italic', () => {
					cy.get('@typography-popover').within(() => {
						cy.getByAriaLabel('Italic').click();
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'font-style', 'italic');

					//Check store
					getWPDataObject().then((data) => {
						expect('italic').to.be.equal(
							getSelectedBlock(data, 'publisherFontStyle')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').should(
						'have.css',
						'font-style',
						'italic'
					);
				});
			});
		});

		context('Capitalizing', () => {
			//describe('WordPress Compatibility', () => {...});

			describe('Functionality', () => {
				it('should update text-transform, when add uppercase', () => {
					cy.get('@typography-popover').within(() => {
						cy.getByAriaLabel('Uppercase').click();
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'text-transform', 'uppercase');

					//Check store
					getWPDataObject().then((data) => {
						expect('uppercase').to.be.equal(
							getSelectedBlock(data, 'publisherTextTransform')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').should(
						'have.css',
						'text-transform',
						'uppercase'
					);
				});
			});
		});

		context('Direction', () => {
			//describe('WordPress Compatibility', () => {...});

			describe('Functionality', () => {
				it('should update direction, when add ltr', () => {
					cy.get('@typography-popover').within(() => {
						cy.get('[aria-label="Right to Left"]').click();
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'direction', 'rtl');

					//Check store
					getWPDataObject().then((data) => {
						expect('rtl').to.be.equal(
							getSelectedBlock(data, 'publisherDirection')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').should(
						'have.css',
						'direction',
						'rtl'
					);
				});
			});
		});

		context('Spacing', () => {
			//describe('WordPress Compatibility', () => {...});

			describe('Functionality', () => {
				it('all together', () => {
					cy.get('@typography-popover').within(() => {
						cy.getParentContainer('Letters', 'base-control')
							.first()
							.within(() => {
								cy.get('input').focus();
								cy.get('input').type(5);
							});
					});

					cy.get('@typography-popover').within(() => {
						cy.getParentContainer('Words', 'base-control')
							.first()
							.within(() => {
								cy.get('input').focus();
								cy.get('input').type(5);
							});
					});

					cy.get('@typography-popover').within(() => {
						cy.getParentContainer('Text Indent', 'base-control')
							.first()
							.within(() => {
								cy.get('input').focus();
								cy.get('input').type(5);
							});
					});

					//Check letter spacing
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'letter-spacing', '5px');

					//Check store
					getWPDataObject().then((data) => {
						expect('5px').to.be.equal(
							getSelectedBlock(data, 'publisherLetterSpacing')
						);
					});

					//Check letter spacing
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'word-spacing', '5px');

					//Check store
					getWPDataObject().then((data) => {
						expect('5px').to.be.equal(
							getSelectedBlock(data, 'publisherWordSpacing')
						);
					});

					//Check text indent
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'text-indent', '5px');

					//Check store
					getWPDataObject().then((data) => {
						expect('5px').to.be.equal(
							getSelectedBlock(data, 'publisherTextIndent')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').should(
						'have.css',
						'letter-spacing',
						'5px'
					);

					cy.get('.publisher-paragraph').should(
						'have.css',
						'word-spacing',
						'5px'
					);

					cy.get('.publisher-paragraph').should(
						'have.css',
						'text-indent',
						'5px'
					);
				});
			});
		});

		context('Orientation', () => {
			//describe('WordPress Compatibility', () => {...});

			describe('Functionality', () => {
				it('should add two property to css:writing-mode & text-orientation, when click on shortcut', () => {
					//
					// Style 1
					//
					cy.get('@typography-popover').within(() => {
						cy.get(
							'[aria-label="Text will display vertically from left to right with a mixed orientation"]'
						).click();
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'writing-mode', 'vertical-lr')
						.and('have.css', 'text-orientation', 'mixed');

					//Check store
					getWPDataObject().then((data) => {
						expect({
							'writing-mode': 'vertical-lr',
							'text-orientation': 'mixed',
						}).to.be.deep.equal(
							getSelectedBlock(data, 'publisherTextOrientation')
						);
					});

					//
					// Style 2
					//
					cy.get('@typography-popover').within(() => {
						cy.get(
							'[aria-label="Text will display vertically from right to left with a mixed orientation"]'
						).click();
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'writing-mode', 'vertical-rl')
						.and('have.css', 'text-orientation', 'mixed');

					//Check store
					getWPDataObject().then((data) => {
						expect({
							'writing-mode': 'vertical-rl',
							'text-orientation': 'mixed',
						}).to.be.deep.equal(
							getSelectedBlock(data, 'publisherTextOrientation')
						);
					});

					//
					// Style 3
					//
					cy.get('@typography-popover').within(() => {
						cy.get(
							'[aria-label="Text will appear vertically from left to right with an upright orientation"]'
						).click();
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'writing-mode', 'vertical-lr')
						.and('have.css', 'text-orientation', 'upright');

					//Check store
					getWPDataObject().then((data) => {
						expect({
							'writing-mode': 'vertical-lr',
							'text-orientation': 'upright',
						}).to.be.deep.equal(
							getSelectedBlock(data, 'publisherTextOrientation')
						);
					});

					//
					// Style 4
					//
					cy.get('@typography-popover').within(() => {
						cy.get(
							'[aria-label="Text will appear vertically from right to left with an upright orientation"]'
						).click();
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'writing-mode', 'vertical-rl')
						.and('have.css', 'text-orientation', 'upright');

					//Check store
					getWPDataObject().then((data) => {
						expect({
							'writing-mode': 'vertical-rl',
							'text-orientation': 'upright',
						}).to.be.deep.equal(
							getSelectedBlock(data, 'publisherTextOrientation')
						);
					});

					//
					// Style None
					//
					cy.get('@typography-popover').within(() => {
						cy.get('[aria-label="No text orientation"]').click();
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'writing-mode', 'horizontal-tb')
						.and('have.css', 'text-orientation', 'mixed');

					//Check store
					getWPDataObject().then((data) => {
						expect({
							'writing-mode': 'horizontal-tb',
							'text-orientation': 'mixed',
						}).to.be.deep.equal(
							getSelectedBlock(data, 'publisherTextOrientation')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph')
						.should('have.css', 'writing-mode', 'horizontal-tb')
						.and('have.css', 'text-orientation', 'mixed');
				});
			});
		});

		context('Column', () => {
			//describe('WordPress Compatibility', () => {...});

			describe('Functionality', () => {
				it('should not render column-gap and column-rule components,when value is initial', () => {
					cy.get('@typography-popover').within(() => {
						cy.getParentContainer('Columns', 'base-control').within(
							() => {
								cy.get('[aria-label="None"]').click();
							}
						);
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.parent()
						.within(() => {
							cy.get('style')
								.invoke('text')
								.should('include', 'column-count: initial');
						});

					//Check store
					getWPDataObject().then((data) => {
						expect({
							columns: 'none',
							gap: '',
							divider: {
								width: '',
								color: '',
								style: 'solid',
							},
						}).to.be.deep.equal(
							getSelectedBlock(data, 'publisherTextColumns')
						);
					});

					//Check rendering
					cy.get('@typography-popover').within(() => {
						cy.getByAriaLabel('Gap').should('not.exist');
					});

					//Check frontend
					savePage();

					redirectToFrontPage();
					//initial=>auto
					cy.get('.publisher-paragraph').should(
						'have.css',
						'column-count',
						'auto'
					);
				});

				it('should update column-count & column-gap, when add column2 + gap', () => {
					cy.get('@typography-popover').within(() => {
						cy.getParentContainer('Columns', 'base-control').within(
							() => {
								cy.get('[aria-label="2 Columns Text"]').click();
								cy.get('input[type=number]').eq(0).focus();
								cy.get('input[type=number]').eq(0).clear();
								cy.get('input[type=number]').eq(0).type(5);
							}
						);
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'column-gap', '5px');

					//Check store
					getWPDataObject().then((data) => {
						expect({
							columns: '2-columns',
							gap: '5px',
							divider: {
								width: '',
								color: '',
								style: 'solid',
							},
						}).to.be.deep.equal(
							getSelectedBlock(data, 'publisherTextColumns')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').should(
						'have.css',
						'column-gap',
						'5px'
					);
				});

				it('should update column-count & column-rule, when add column2 + rule', () => {
					cy.get('@typography-popover').within(() => {
						cy.getParentContainer('Columns', 'base-control').within(
							() => {
								cy.get('[aria-label="2 Columns Text"]').click();
								//add divider style
								cy.getByDataTest(
									'border-control-width'
								).clear();
								cy.getByDataTest('border-control-width').type(
									1
								);

								cy.get('[aria-haspopup="listbox"]').trigger(
									'click'
								);
								cy.get('li').eq(2).trigger('click');

								cy.getByDataTest(
									'border-control-color'
								).click();
							}
						);
					});

					cy.getByDataTest('popover-body')
						.last()
						.within(() => {
							cy.get('input[maxlength="9"]').clear({
								force: true,
							});
							cy.get('input[maxlength="9"]').type('36eade', {
								force: true,
							});
						});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'column-rule-width', '1px')
						.and('have.css', 'column-rule-style', 'dotted')
						.and(
							'have.css',
							'column-rule-color',
							'rgb(54, 234, 222)'
						);

					//Check store
					getWPDataObject().then((data) => {
						expect({
							columns: '2-columns',
							gap: '',
							divider: {
								width: '1px',
								color: '#36eade',
								style: 'dotted',
							},
						}).to.be.deep.equal(
							getSelectedBlock(data, 'publisherTextColumns')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph')
						.should('have.css', 'column-rule-width', '1px')
						.and('have.css', 'column-rule-style', 'dotted')
						.and(
							'have.css',
							'column-rule-color',
							'rgb(54, 234, 222)'
						);
				});
			});
		});

		context('Stroke', () => {
			//describe('WordPress Compatibility', () => {...});

			describe('Functionality', () => {
				it('should update text-stroke, when add data', () => {
					/* Color */
					cy.get('@typography-popover').within(() => {
						cy.getParentContainer('Stroke', 'base-control').within(
							() => {
								cy.getByDataCy('color-btn').click();
							}
						);
					});
					cy.getByDataTest('popover-body')
						.last()
						.within(() => {
							cy.get('input[maxlength="9"]').clear();
							cy.get('input[maxlength="9"]').type('5a22a4');
						});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should(
							'have.css',
							'-webkit-text-stroke-color',
							'rgb(90, 34, 164)'
						);

					//Check store
					getWPDataObject().then((data) => {
						expect('#5a22a4').to.be.equal(
							getSelectedBlock(data, 'publisherTextStrokeColor')
						);
					});

					/* Width */
					cy.get('@typography-popover')
						.first()
						.within(() => {
							cy.getParentContainer(
								'Stroke',
								'base-control'
							).within(() => {
								cy.get('input[type="number"]').type(10);
							});
						});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.and('have.css', '-webkit-text-stroke-width', '10px');

					//Check store
					getWPDataObject().then((data) => {
						expect('10px').to.be.equal(
							getSelectedBlock(data, 'publisherTextStrokeWidth')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph')
						.should(
							'have.css',
							'-webkit-text-stroke-color',
							'rgb(90, 34, 164)'
						)
						.and('have.css', '-webkit-text-stroke-width', '10px');
				});
			});
		});

		context('Break', () => {
			//describe('WordPress Compatibility', () => {...});

			describe('Functionality', () => {
				it('should update word-break, when add data', () => {
					cy.get('@typography-popover').within(() => {
						cy.getParentContainer(
							'Breaking',
							'base-control'
						).within(() => {
							cy.get('[aria-haspopup="listbox"]').click();
						});
					});
					cy.contains('Break Word').click();

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'word-break', 'break-word');

					//Check store
					getWPDataObject().then((data) => {
						expect('break-word').to.be.equal(
							getSelectedBlock(data, 'publisherWordBreak')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').should(
						'have.css',
						'word-break',
						'break-word'
					);
				});
			});
		});
	});

	describe('Text Color', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('This is test text.');

			cy.getByDataTest('style-tab').click();
		});
		it('should update text-color, when add data', () => {
			cy.getParentContainer('Text Color', 'base-control').within(() => {
				cy.getByDataCy('color-btn').click();
			});

			cy.getByDataTest('popover-body').within(() => {
				cy.get('input[maxlength="9"]').clear();
				cy.get('input[maxlength="9"]').type('70ca9e');
			});

			//Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should('have.css', 'color', 'rgb(112, 202, 158)');

			//Check store
			getWPDataObject().then((data) => {
				expect('#70ca9e').to.be.equal(
					getSelectedBlock(data, 'publisherFontColor')
				);
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('.publisher-paragraph').should(
				'have.css',
				'color',
				'rgb(112, 202, 158)'
			);
		});
	});

	describe('Text Shadow', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('This is test text.');

			cy.getByDataTest('style-tab').click();
		});

		it('should update text-shadow, when add data', () => {
			/* One Text Shadow */
			cy.getParentContainer('Text Shadows', 'base-control').within(() => {
				cy.getByAriaLabel('Add New Text Shadow').click();
				cy.getByDataCy('group-control-header').click();
			});

			cy.getByDataTest('popover-body').within(() => {
				/* eslint-disable cypress/unsafe-to-chain-command */
				cy.get('[aria-label="Vertical Distance"]')
					.clear()
					.type(2)
					.should('have.value', '2');

				/* eslint-disable cypress/unsafe-to-chain-command */
				cy.get('[aria-label="Horizontal Distance"]')
					.clear()
					.type(3)
					.should('have.value', '3');

				/* eslint-disable cypress/unsafe-to-chain-command */
				cy.get('[aria-label="Blur Effect"]')
					.clear()
					.type(4)
					.should('have.value', '4');

				cy.getByDataCy('color-btn').click();
			});

			cy.getByDataTest('popover-body')
				.last()
				.within(() => {
					cy.get('input[maxlength="9"]').clear({ force: true });
					cy.get('input[maxlength="9"]').type('70ca9e', {
						force: true,
					});
				});

			//Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should(
					'have.css',
					'text-shadow',
					'rgb(112, 202, 158) 2px 3px 4px'
				);

			//Check store
			getWPDataObject().then((data) => {
				expect([
					{
						x: '2px',
						y: '3px',
						blur: '4px',
						color: '#70ca9e',
						isVisible: true,
					},
				]).to.be.deep.equal(
					getSelectedBlock(data, 'publisherTextShadow')
				);
			});

			/* Multiple Text Shadow */
			cy.getParentContainer('Text Shadows', 'base-control').within(() => {
				cy.getByAriaLabel('Add New Text Shadow').click();
				cy.getByDataCy('group-control-header').eq(1).click();
			});

			cy.getByDataTest('popover-body').within(() => {
				/* eslint-disable cypress/unsafe-to-chain-command */
				cy.get('[aria-label="Vertical Distance"]')
					.clear()
					.type(5)
					.should('have.value', '5');

				/* eslint-disable cypress/unsafe-to-chain-command */
				cy.get('[aria-label="Horizontal Distance"]')
					.clear()
					.type(6)
					.should('have.value', '6');

				/* eslint-disable cypress/unsafe-to-chain-command */
				cy.get('[aria-label="Blur Effect"]')
					.clear()
					.type(7)
					.should('have.value', '7');

				cy.getByDataCy('color-btn').click();
			});

			cy.getByDataTest('popover-body')
				.last()
				.within(() => {
					cy.get('input[maxlength="9"]').clear({ force: true });
					cy.get('input[maxlength="9"]').type('70ca9e', {
						force: true,
					});
				});

			//Check block
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should(
					'have.css',
					'text-shadow',
					'rgb(112, 202, 158) 2px 3px 4px, rgb(112, 202, 158) 5px 6px 7px'
				);

			//Check store
			getWPDataObject().then((data) => {
				expect([
					{
						x: '2px',
						y: '3px',
						blur: '4px',
						color: '#70ca9e',
						isVisible: true,
					},
					{
						x: '5px',
						y: '6px',
						blur: '7px',
						color: '#70ca9e',
						isVisible: true,
					},
				]).to.be.deep.equal(
					getSelectedBlock(data, 'publisherTextShadow')
				);
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('.publisher-paragraph').should(
				'have.css',
				'text-shadow',
				'rgb(112, 202, 158) 2px 3px 4px, rgb(112, 202, 158) 5px 6px 7px'
			);
		});
	});
});
