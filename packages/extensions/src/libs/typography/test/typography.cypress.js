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
							cy.get('input[type="number"]').clear();
							cy.get('input[type="number"]').type(10);
						});
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.parent()
						.within(() => {
							cy.get('style')
								.invoke('text')
								.should('include', 'line-height: 10px');
						});

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
						cy.get('[aria-label="Left to Right"]').click();
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'direction', 'ltr');

					//Check store
					getWPDataObject().then((data) => {
						expect('ltr').to.be.equal(
							getSelectedBlock(data, 'publisherDirection')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').should(
						'have.css',
						'direction',
						'ltr'
					);
				});
			});
		});

		context('Spacing', () => {
			//describe('WordPress Compatibility', () => {...});

			describe('Functionality', () => {
				it('should update letter-spacing, when add data', () => {
					cy.get('@typography-popover').within(() => {
						cy.getParentContainer('Letters', 'base-control')
							.first()
							.within(() => {
								cy.get('input').type(5);
							});
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'letter-spacing', '5px');

					//Check store
					getWPDataObject().then((data) => {
						expect('5px').to.be.equal(
							getSelectedBlock(data, 'publisherLetterSpacing')
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
				});

				it('should update word-spacing, when add data', () => {
					cy.get('@typography-popover').within(() => {
						cy.getParentContainer('Words', 'base-control')
							.first()
							.within(() => {
								cy.get('input').type(5);
							});
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'word-spacing', '5px');

					//Check store
					getWPDataObject().then((data) => {
						expect('5px').to.be.equal(
							getSelectedBlock(data, 'publisherWordSpacing')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').should(
						'have.css',
						'word-spacing',
						'5px'
					);
				});

				it('should update text-indent, when add data', () => {
					cy.get('@typography-popover').within(() => {
						cy.getParentContainer('Text Indent', 'base-control')
							.first()
							.within(() => {
								cy.get('input').type(5);
							});
					});

					//Check block
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
					cy.get('@typography-popover').within(() => {
						cy.get(
							'[aria-label="vertically from top to bottom, and the next vertical line is positioned to the right of the previous line"]'
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

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph')
						.should('have.css', 'writing-mode', 'vertical-lr')
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
						expect('none').to.be.equal(
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

				it('should update column-count, when add column-2', () => {
					cy.get('@typography-popover').within(() => {
						cy.get('[aria-label="2 Columns Text"]').click();
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'column-count', '2');

					//Check store
					getWPDataObject().then((data) => {
						expect('2-columns').to.be.equal(
							getSelectedBlock(data, 'publisherTextColumns')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').should(
						'have.css',
						'column-count',
						'2'
					);
				});

				it('should update column-count & column-gap, when add column2 + gap', () => {
					cy.get('@typography-popover').within(() => {
						cy.getParentContainer('Columns', 'base-control').within(
							() => {
								cy.get('[aria-label="2 Columns Text"]').click();
								cy.get('input[type="range"]').setSliderValue(5);
							}
						);
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'column-gap', '5px');

					//Check store
					getWPDataObject().then((data) => {
						expect('5px').to.be.equal(
							getSelectedBlock(data, 'publisherTextColumnsGap')
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
						expect('1px').to.be.equal(
							getSelectedBlock(
								data,
								'publisherTextColumnsDividerWidth'
							)
						);
						expect('#36eade').to.be.equal(
							getSelectedBlock(
								data,
								'publisherTextColumnsDividerColor'
							)
						);
						expect('dotted').to.be.equal(
							getSelectedBlock(
								data,
								'publisherTextColumnsDividerStyle'
							)
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
				it('should update text-stroke-color, when add data', () => {
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

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').should(
						'have.css',
						'-webkit-text-stroke-color',
						'rgb(90, 34, 164)'
					);
				});

				it('should update text-stroke-color & text-stroke-width, when add data', () => {
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
						.should(
							'have.css',
							'-webkit-text-stroke-color',
							'rgb(90, 34, 164)'
						)
						.and('have.css', '-webkit-text-stroke-width', '10px');

					//Check store
					getWPDataObject().then((data) => {
						expect('#5a22a4').to.be.equal(
							getSelectedBlock(data, 'publisherTextStrokeColor')
						);
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
});
