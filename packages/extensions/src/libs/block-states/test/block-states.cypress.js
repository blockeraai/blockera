/**
 * Internal dependencies
 */
import {
	getWPDataObject,
	getSelectedBlock,
	appendBlocks,
	setDeviceType,
	addBlockState,
	setBlockState,
	savePage,
	redirectToFrontPage,
	reSelectBlock,
	checkCurrentState,
} from '../../../../../../cypress/helpers';
import 'cypress-real-events';

describe('Block State E2E Test', () => {
	beforeEach(() => {
		cy.viewport(1440, 1025);
	});

	//TODO: check strange behave of cypress beforeEach
	const initialSetting = () => {
		appendBlocks(
			'<!-- wp:paragraph -->\n' +
				'<p>Test</p>\n' +
				'<!-- /wp:paragraph -->'
		);
		cy.getIframeBody()
			.find(`[data-type="core/paragraph"]`)
			.click({ force: true });
	};

	describe('state-container', () => {
		it('Set the "Normal" state color on the root of the container using CSS variables.', () => {
			initialSetting();

			cy.cssVar(
				'--publisher-tab-panel-active-color',
				'[aria-label="Publisher Block State Container"]:first-child'
			).should('eq', '#147EB8');
		});
		it('Set the "third-party" state (Like: hover, active, etc) color on the root of the container using CSS variables.', () => {
			initialSetting();

			cy.getByAriaLabel('Add New State').click();

			cy.cssVar(
				'--publisher-tab-panel-active-color',
				'[aria-label="Publisher Block State Container"]:first-child'
			).should('eq', '#D47C14');
		});
	});

	describe('current-state', () => {
		it('Set the hidden style for WordPress block origin features when choose state (apart from normal state)', () => {
			initialSetting();
			cy.getByAriaLabel('Add New State').click();

			//In this assertion not available data attribute for this selector، Please don't be sensitive.
			cy.get('button')
				.contains('Advanced')
				.parent()
				.parent()
				.parent()
				.parent()
				.parent()
				.should('have.class', 'publisher-not-allowed');
		});

		it('Set the current state when add new block states', () => {
			initialSetting();

			cy.getByAriaLabel('Add New State').click();

			checkCurrentState('hover');

			cy.getByAriaLabel('Add New State').click();

			checkCurrentState('active');

			cy.getByAriaLabel('Add New State').click();

			checkCurrentState('focus');
		});
	});

	describe('add new state', () => {
		it('should not display normal when delete hover state ', () => {
			initialSetting();
			// do not render normal when adding new state
			cy.contains('Normal').should('not.exist');

			cy.getByAriaLabel('Add New State').click();
			// render normal when adding new state
			cy.contains('Hover').should('exist');

			//
			cy.getByAriaLabel('Delete hover').click({ force: true });

			//
			cy.contains('Normal').should('not.exist');
			cy.contains('Hover').should('not.exist');
		});

		it('should add correct item, when once delete', () => {
			initialSetting();
			cy.multiClick('[aria-label="Add New State"]', 5);

			// remove active
			cy.getByAriaLabel('Delete active').click({ force: true });

			// add new state
			cy.getByAriaLabel('Add New State').click();
			checkCurrentState('active');

			// add new state
			cy.getByAriaLabel('Add New State').click();
			checkCurrentState('after');
		});

		it('should create correct id for repeater item when update states', () => {
			initialSetting();
			// add
			addBlockState('hover');

			// Check store
			getWPDataObject().then((data) => {
				expect(['normal', 'hover']).to.be.deep.equal(
					Object.keys(getSelectedBlock(data, 'publisherBlockStates'))
				);
			});

			// update
			cy.getByDataTest('popover-body').within(() => {
				cy.get('select').select('focus');
			});

			// Check store
			getWPDataObject().then((data) => {
				expect(['normal', 'focus']).to.be.deep.equal(
					Object.keys(getSelectedBlock(data, 'publisherBlockStates'))
				);
			});
		});
	});

	describe('Normal', () => {
		it('should set attr in root when default breakPoint', () => {
			initialSetting();
			// Set width
			cy.getByAriaLabel('Input Width').type(100, { force: true });

			// Reselect
			reSelectBlock();

			// Assert control value
			cy.getByAriaLabel('Input Width').should('have.value', '100');

			//TODO
			// Assert block css
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should('have.css', 'width', '100px');

			// Assert store data
			getWPDataObject().then((data) => {
				expect('100px').to.be.equal(
					getSelectedBlock(data, 'publisherWidth')
				);
				expect(undefined).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates').normal
						.breakpoints.laptop.attributes
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			cy.get('.publisher-core-block').should(
				'have.css',
				'width',
				'100px'
			);

			// Set desktop viewport
			cy.viewport(1441, 1920);

			cy.get('.publisher-core-block').should(
				'have.css',
				'width',
				'100px'
			);

			// // set Tablet viewport
			// TODO :
			// cy.viewport(768, 1024);

			// cy.get('.publisher-core-block').should(
			// 	'have.css',
			// 	'width',
			// 	'100px'
			// );
		});

		it('should set attribute correctly when breakpoint : Tablet', () => {
			initialSetting();
			setDeviceType('Tablet');
			// Set Width
			cy.getByAriaLabel('Input Width').type(100, { force: true });

			// Reselect
			reSelectBlock();

			//TODO:fix
			// Assert control value
			//cy.getByAriaLabel('Input Width').should('have.value', '100');

			// Assert block css
			// TODO:

			// Change device to laptop
			setDeviceType('Laptop');

			// Assert control
			cy.getByAriaLabel('Input Width').should('not.have.value', '100');

			// Assert block css
			//TODO

			// Assert store data
			getWPDataObject().then((data) => {
				expect({ publisherWidth: '100px' }).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates').normal
						.breakpoints.tablet.attributes
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			// Assert in default viewport
			cy.get('.publisher-core-block').should(
				'not.have.css',
				'width',
				'100px'
			);

			// Set desktop viewport
			cy.viewport(1441, 1920);

			cy.get('.publisher-core-block').should(
				'not.have.css',
				'width',
				'100px'
			);

			// set tablet viewport
			cy.viewport(768, 1024);

			cy.get('.publisher-core-block').should(
				'have.css',
				'width',
				'100px'
			);

			// TODO:
			// // set mobile viewport
			// cy.viewport(320, 480);

			// cy.get('.publisher-core-block').should(
			// 	'have.css',
			// 	'width',
			// 	'100px'
			// );
		});
	});

	describe('Hover', () => {
		it('should set attribute correctly when : Normal -> Hover (default breakPoint)', () => {
			initialSetting();
			addBlockState('hover');

			//Set width
			cy.getByAriaLabel('Input Width').type(100, { force: true });

			// Reselect
			reSelectBlock();

			// Assert control value
			cy.getByAriaLabel('Input Width').should('have.value', '100');

			// Assert block css
			//TODO:

			// Change state to normal
			setBlockState('Normal');

			// Assert control value
			cy.getByAriaLabel('Input Width').should('not.have.value', '100');

			// Assert block css
			//TODO

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					laptop: { attributes: { publisherWidth: '100px' } },
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates').hover
						.breakpoints
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			cy.get('.publisher-core-block').realHover();
			cy.get('.publisher-core-block').should(
				'have.css',
				'width',
				'100px'
			);

			// // Set desktop viewport
			// cy.viewport(1441, 1920);

			// //.get('.publisher-core-block').realHover();
			// cy.get('.publisher-core-block').should(
			// 	'have.css',
			// 	'width',
			// 	'100px'
			// );

			// TODO:
			// // set tablet viewport
			// cy.viewport(768, 1024);

			// cy.get('.publisher-core-block').realHover();
			// cy.get('.publisher-core-block').should(
			// 	'have.css',
			// 	'width',
			// 	'100px'
			// );
		});

		it('should set attribute correctly when : Normal -> Hover -> Tablet', () => {
			initialSetting();
			addBlockState('hover');
			setDeviceType('Tablet');

			// Set Width
			cy.getByAriaLabel('Input Width').type(100, { force: true });

			reSelectBlock();

			// Assert control value
			//TODO:
			//cy.getByAriaLabel('Input Width').should('have.value', '100');

			// Assert block css
			//TODO

			// Change device to laptop
			setDeviceType('Laptop');
			// Assert block css
			//TODO

			// Assert control value
			cy.getByAriaLabel('Input Width').should('not.have.value', '100');

			// Assert store data
			getWPDataObject().then((data) => {
				expect({ publisherWidth: '100px' }).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			cy.get('.publisher-core-block').realHover();
			cy.get('.publisher-core-block').should(
				'not.have.css',
				'width',
				'100px'
			);

			// Set desktop viewport
			cy.viewport(1441, 1920);

			cy.get('.publisher-core-block').realHover();
			cy.get('.publisher-core-block').should(
				'not.have.css',
				'width',
				'100px'
			);

			// set tablet viewport
			cy.viewport(768, 1024);

			cy.get('.publisher-core-block').realHover();
			cy.get('.publisher-core-block').should(
				'have.css',
				'width',
				'100px'
			);

			//TODO
			// // set mobile viewport
			// cy.viewport(320, 480);

			// cy.get('.publisher-core-block').realHover();
			// cy.get('.publisher-core-block').should(
			// 	'have.css',
			// 	'width',
			// 	'100px'
			// );
		});

		it('should set attribute correctly when : Normal -> Tablet -> Hover', () => {
			initialSetting();
			setDeviceType('Tablet');
			addBlockState('hover');
			// Set width
			cy.getByAriaLabel('Input Width').type(100, { force: true });

			reSelectBlock();

			// Assert control value
			//TODO:
			//cy.getByAriaLabel('Input Width').should('have.value', '100');

			// Assert block css
			//TODO

			// Change device to laptop
			setDeviceType('Laptop');
			// Assert block css
			//TODO

			// Assert control value
			//TODO:
			cy.getByAriaLabel('Input Width').should('not.have.value', '100');

			// Assert store data
			getWPDataObject().then((data) => {
				expect({ publisherWidth: '100px' }).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			cy.get('.publisher-core-block').realHover();
			cy.get('.publisher-core-block').should(
				'not.have.css',
				'width',
				'100px'
			);
			// Set desktop viewport
			cy.viewport(1441, 1920);

			cy.get('.publisher-core-block').realHover();
			cy.get('.publisher-core-block').should(
				'not.have.css',
				'width',
				'100px'
			);

			// set Tablet viewport
			//TODO:Fix
			cy.viewport(768, 1024);

			cy.get('.publisher-core-block').realHover();
			cy.get('.publisher-core-block').should(
				'have.css',
				'width',
				'100px'
			);

			// TODO:
			// // set mobile viewport
			// cy.viewport(320, 480);

			// cy.get('.publisher-core-block').realHover();
			// cy.get('.publisher-core-block').should(
			// 	'have.css',
			// 	'width',
			// 	'100px'
			// );
		});
	});

	describe.skip('Custom Class & Parent Class', () => {
		it('should set attribute correctly when : Normal -> Custom Class / Parent Class', () => {
			initialSetting();
			addBlockState('custom-class');

			/**
			 * Custom Class
			 */
			cy.getByDataTest('popover-body').within(() => {
				cy.get('input[type="text"]').type('.test');
			});
			cy.getByAriaLabel('Input Width').type(100, { force: true });

			// Reselect
			reSelectBlock();

			// Assert control value
			cy.getByAriaLabel('Input Width').should('have.value', '100');

			// Assert block css
			//TODO: recheck
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style').as('style-tag');
				});

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.invoke('attr', 'id')
				.then((id) => {
					cy.get('@style-tag')
						.invoke('text')
						.should('include', `.test,#${id}{width: 100px`);
				});

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should('have.class', 'test');

			// Change state to normal
			setBlockState('Normal');

			// Assert block css
			cy.getIframeBody(8)
				.find(`[data-type="core/paragraph"]`)
				.should('have.css', 'width', '100px');

			// Assert store data
			getWPDataObject().then((data) => {
				expect({ publisherWidth: '100px' }).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates')[
						'custom-class'
					].breakpoints.laptop.attributes
				);
				expect('.test').to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates')[
						'custom-class'
					]['css-class']
				);
			});

			/**
			 * Parent Class
			 */
			addBlockState('parent-class');
			cy.getByDataTest('popover-body').within(() => {
				cy.get('input[type="text"]').type('.parent-class');
			});

			cy.getByAriaLabel('Input Width').type(300, { force: true });

			// Reselect
			reSelectBlock();

			// Assert control value
			cy.getByAriaLabel('Input Width').should('have.value', '300');
			checkCurrentState('parent-class');

			// Assert block css
			//TODO:recheck
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.invoke('attr', 'id')
				.then((id) => {
					cy.get('@style-tag')
						.invoke('text')
						.should('include', `.parent-class #${id}{width: 300px`);
				});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					laptop: { attributes: { publisherWidth: '300px' } },
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates')[
						'parent-class'
					].breakpoints
				);
				expect('.parent-class').to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates')[
						'parent-class'
					]['css-class']
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			// Assert in default viewport
			//TODO:
		});

		it('should set attribute correctly when : Normal -> Tablet -> Custom Class', () => {
			initialSetting();
			setDeviceType('Tablet');
			addBlockState('custom-class');

			//
			cy.getByDataTest('popover-body').within(() => {
				cy.get('input[type="text"]').type('.test');
			});
			cy.getByAriaLabel('Input Width').type(100, { force: true });

			// Reselect
			reSelectBlock();

			// Assert control value
			cy.getByAriaLabel('Input Width').should('have.value', '100');
			checkCurrentState('custom-class');

			// Assert block css
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style').as('style-tag');
				});
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.invoke('attr', 'id')
				.then((id) => {
					cy.get('@style-tag')
						.invoke('text')
						.should(
							'include',
							`.test,.is-tablet-preview #${id}{width: 100px`
						);
				});

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should('have.class', 'test')
				.and('have.css', 'width', '100px');

			// Change device to laptop
			setDeviceType('Laptop');

			// Assert block css
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.should('not.have.css', 'width', '100px');

			// Assert store data
			getWPDataObject().then((data) => {
				expect({ publisherWidth: '100px' }).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates')[
						'custom-class'
					].breakpoints.tablet.attributes
				);
				expect('.test').to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates')[
						'custom-class'
					]['css-class']
				);
			});

			// frontend:TODO
		});

		it('should set attribute correctly when : Normal -> Tablet -> Parent Class', () => {
			initialSetting();
			setDeviceType('Tablet');
			setBlockState('parent-class');

			//
			cy.getByDataTest('popover-body').within(() => {
				cy.get('input[type="text"]').type('.test');
			});
			cy.getByAriaLabel('Input Width').type(100, { force: true });

			// Reselect
			reSelectBlock();

			// Assert control value
			cy.getByAriaLabel('Input Width').should('have.value', '100');
			checkCurrentState('parent-class');

			// Assert block css
			//TODO:recheck
			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.parent()
				.within(() => {
					cy.get('style').as('style-tag');
				});

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.invoke('attr', 'id')
				.then((id) => {
					cy.get('@style-tag')
						.invoke('text')
						.should(
							'include',
							`.test .is-tablet-preview #${id}{width: 100px`
						);
				});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({ publisherWidth: '100px' }).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates')[
						'parent-class'
					].breakpoints.tablet.attributes
				);
				expect('.test').to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates')[
						'parent-class'
					]['css-class']
				);
			});

			// frontend: TODO
		});
	});

	describe('ValueCleanup', () => {
		it('should not have extra breakpoints and attributes in saved data', () => {
			initialSetting();
			addBlockState('hover');
			cy.getByAriaLabel('Input Width').type(100, { force: true });

			//Check store
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'publisherBlockStates').hover
						.breakpoints.tablet
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'publisherBlockStates').hover
						.breakpoints.laptop.attributes.publisherHeight
				);

				expect({
					normal: {
						breakpoints: {
							laptop: { attributes: {} },
						},
						isVisible: true,
					},
					hover: {
						breakpoints: {
							laptop: { attributes: { publisherWidth: '100px' } },
						},
						isVisible: true,
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates')
				);
			});
		});
	});

	describe('update attributes in multiple states and devices', () => {
		context('Normal -> set border-width', () => {
			beforeEach(() => {
				initialSetting();

				cy.getByDataTest('border-control-width').type(5);

				// Reselect
				reSelectBlock();

				// Assert control value
				cy.getByDataTest('border-control-width').should(
					'have.value',
					'5'
				);
			});

			context('Hover -> set border-color', () => {
				beforeEach(() => {
					addBlockState('hover');

					cy.getByDataTest('border-control-color').click();
					cy.getByDataTest('popover-body')
						.last()
						.within(() => {
							cy.get('input[maxlength="9"]').clear();
							cy.get('input[maxlength="9"]').type('ccc');
						});

					// normal state updates should visible
					cy.getByDataTest('border-control-width').should(
						'have.value',
						'5'
					);

					// Reselect
					reSelectBlock();

					// Assert control value
					cy.getByDataTest('border-control-width').should(
						'have.value',
						'5'
					);
					cy.getByDataTest('border-control-color').should(
						'have.class',
						'is-not-empty'
					);
					checkCurrentState('hover');
				});

				context('Active -> set border-style', () => {
					beforeEach(() => {
						addBlockState('active');

						cy.getByDataTest('border-control-component').within(
							() => {
								cy.getByDataTest('border-control-color')
									.next()
									.click();

								// dotted
								cy.get('ul').within(() =>
									cy.get('li').eq(2).click({ force: true })
								);
							}
						);

						// normal state updates should visible
						cy.getByDataTest('border-control-width').should(
							'have.value',
							'5'
						);

						// hover state updates should not visible
						cy.getByDataTest('border-control-color').should(
							'have.class',
							'is-empty'
						);

						// Reselect
						reSelectBlock();

						// Assert control value
						cy.getByDataTest('border-control-width').should(
							'have.value',
							'5'
						);
						cy.getByDataTest('border-control-color').should(
							'have.class',
							'is-empty'
						);
						cy.getByDataTest('border-control-component').within(
							() => {
								cy.getByDataTest('border-control-color')
									.next()
									.click();

								// dotted
								cy.get('ul').within(() =>
									cy
										.get('li')
										.eq(2)
										.should(
											'have.attr',
											'aria-selected',
											'true'
										)
								);
							}
						);
						checkCurrentState('active');
					});

					context(
						'Active -> Mobile -> set custom border-width',
						() => {
							beforeEach(() => {
								setDeviceType('Mobile');
								cy.getByAriaLabel('Custom Box Border').click();

								// top border
								cy.getByDataTest('border-control-width')
									.eq(0)
									.clear();
								cy.getByDataTest('border-control-width')
									.eq(0)
									.type(3);

								// Reselect
								reSelectBlock();
								//TODO:fix
								// Assert control value
								// cy.getByDataTest('border-control-width')
								// 	.eq(0)
								// 	.should('have.value', '3');
								// cy.getByDataTest('border-control-width')
								// 	.eq(1)
								// 	.should('have.value', '5');
								// cy.getByDataTest('border-control-color').should(
								// 	'have.class',
								// 	'is-empty'
								// );
								checkCurrentState('active');
							});

							it('should control value and attributes be correct, when navigate between states and devices', () => {
								// Active / Mobile
								// Assert block css
								//TODO

								// Normal / Laptop
								// Assert block css
								setDeviceType('Laptop');
								setBlockState('Normal');
								cy.getIframeBody()
									.find(`[data-type="core/paragraph"]`)
									.should(
										'have.css',
										'border',
										'5px solid rgb(0, 0, 0)'
									);
								// Assert control
								cy.getByDataTest('border-control-width').should(
									'have.value',
									'5'
								);

								// Active / Laptop
								setBlockState('Active');
								// Assert block css
								//TODO:
								// Assert control
								cy.getByDataTest(
									'border-control-component'
								).within(() => {
									cy.getByDataTest('border-control-color')
										.next()
										.click();

									// dotted
									cy.get('ul').within(() =>
										cy
											.get('li')
											.eq(2)
											.should(
												'have.attr',
												'aria-selected',
												'true'
											)
									);
								});

								// Hover / Laptop
								setBlockState('Hover');
								// Assert block css
								//TODO:
								// Assert control
								cy.getByDataTest('border-control-color').should(
									'have.class',
									'is-not-empty'
								);

								// Asset store data
								getWPDataObject().then((data) => {
									expect({
										type: 'all',
										all: {
											width: '5px',
											style: 'solid',
											color: '',
										},
									}).to.be.deep.equal(
										getSelectedBlock(
											data,
											'publisherBorder'
										)
									);

									expect({
										normal: {
											breakpoints: {
												laptop: { attributes: {} },
											},
											isVisible: true,
										},
										hover: {
											breakpoints: {
												laptop: {
													attributes: {
														publisherBorder: {
															type: 'all',
															all: {
																width: '5px',
																style: 'solid',
																color: '#cccccc',
															},
														},
													},
												},
											},
											isVisible: true,
										},
										active: {
											breakpoints: {
												laptop: {
													attributes: {
														publisherBorder: {
															type: 'all',
															all: {
																width: '5px',
																style: 'dotted',
																color: '',
															},
														},
													},
												},
												mobile: {
													attributes: {
														publisherBorder: {
															type: 'custom',
															all: {
																width: '5px',
																style: 'solid',
																color: '',
															},
															right: {
																width: '5px',
																style: 'solid',
																color: '',
															},
															bottom: {
																width: '5px',
																style: 'solid',
																color: '',
															},
															left: {
																width: '5px',
																style: 'solid',
																color: '',
															},
															top: {
																width: '3px',
																style: '',
																color: '',
															},
														},
													},
												},
											},
											isVisible: true,
										},
									}).to.be.deep.equal(
										getSelectedBlock(
											data,
											'publisherBlockStates'
										)
									);
								});

								// frontend
								savePage();

								redirectToFrontPage();

								// Assert in default viewport
								cy.get('.publisher-core-block').should(
									'have.css',
									'border',
									'5px solid rgb(0, 0, 0)'
								);

								// Hover
								cy.get('.publisher-core-block').realHover();
								cy.get('.publisher-core-block')
									.should(
										'have.css',
										'border',
										'5px solid rgb(204, 204, 204)'
									)
									.realMouseUp();

								// Active
								cy.get('.publisher-core-block').realMouseDown();
								cy.get('.publisher-core-block')
									.should(
										'have.css',
										'border',
										'5px dotted rgb(0, 0, 0)'
									)
									.realMouseUp();

								// Set desktop viewport
								cy.viewport(1441, 1920);

								cy.get('.publisher-core-block').should(
									'have.css',
									'border',
									'5px solid rgb(0, 0, 0)'
								);

								// Hover
								// TODO:
								//cy.get('.publisher-core-block').realHover();
								// cy.get('.publisher-core-block')
								// 	.should(
								// 		'have.css',
								// 		'border',
								// 		'5px solid rgb(204, 204, 204)'
								// 	)
								// 	.realMouseUp();

								// Active
								// TODO:
								// cy.get('.publisher-core-block').realMouseDown();
								// cy.get('.publisher-core-block')
								// 	.should(
								// 		'have.css',
								// 		'border',
								// 		'5px dotted rgb(0, 0, 0)'
								// 	)
								// 	.realMouseUp();

								// set mobile viewport
								cy.viewport(320, 480);

								// Active
								cy.get('.publisher-core-block').realMouseDown();
								cy.get('.publisher-core-block')
									.should(
										'have.css',
										'border-top',
										'3px solid rgb(0, 0, 0)'
									)
									.and(
										'have.css',
										'border-right',
										'5px solid rgb(0, 0, 0)'
									);
							});
						}
					);
				});
			});
		});
	});

	describe('update repeater attributes in multiple states and devices', () => {
		const openBackgroundItem = () => {
			cy.getParentContainer('Image & Gradient').within(() => {
				cy.getByDataCy('group-control-header').click();
			});
		};
		context('Normal -> set background type', () => {
			beforeEach(() => {
				initialSetting();

				cy.getByAriaLabel('Add New Background').click();
				cy.getByAriaLabel('Linear Gradient').click();

				// Reselect
				reSelectBlock();

				// Assert control value
				cy.getParentContainer('Image & Gradient').within(() => {
					cy.getByDataCy('group-control-header').should(
						'have.length',
						'1'
					);
					cy.contains('Linear Gradient').should('exist');
				});
			});

			context('Hover -> set angle', () => {
				beforeEach(() => {
					addBlockState('hover');
					openBackgroundItem();
					cy.getByDataTest('popover-body').within(() => {
						cy.getByAriaLabel('Rotate Left').click();
					});

					// normal state updates should visible
					cy.getParentContainer('Image & Gradient').within(() => {
						cy.getByDataCy('group-control-header').should(
							'have.length',
							'1'
						);
						cy.contains('Linear Gradient').should('exist');
					});

					// Reselect
					reSelectBlock();

					// Assert control value
					openBackgroundItem();
					cy.getByDataTest('popover-body').within(() => {
						cy.getParentContainer('Angel').within(() => {
							cy.get('input[inputmode="numeric"]').should(
								'have.value',
								'0'
							);
						});
					});
				});

				context('Active -> set repeat', () => {
					beforeEach(() => {
						addBlockState('active');
						openBackgroundItem();
						cy.getByDataTest('popover-body').within(() => {
							cy.get('button[aria-label="Repeat"]').click();

							// normal state updates should visible
							cy.getByAriaLabel('Linear Gradient').should(
								'have.attr',
								'aria-checked',
								'true'
							);

							// hover state updates should not visible
							cy.getParentContainer('Angel').within(() => {
								cy.get('input[inputmode="numeric"]').should(
									'have.value',
									'90'
								);
							});
						});

						// Reselect
						reSelectBlock();

						// Assert control value
						openBackgroundItem();
						cy.getByDataTest('popover-body').within(() => {
							cy.getParentContainer('Angel').within(() => {
								cy.get('input[inputmode="numeric"]').should(
									'have.value',
									'90'
								);
							});

							cy.get('button[aria-label="Repeat"]').should(
								'have.attr',
								'aria-checked',
								'true'
							);
						});
					});

					context('Active -> Mobile -> set effect', () => {
						beforeEach(() => {
							setDeviceType('Mobile');
							openBackgroundItem();

							cy.getByDataTest('popover-body').within(() => {
								cy.getByAriaLabel('Parallax').click();
								//TODO:fix
								// active state updates should visible
								// cy.getByAriaLabel('Repeat').should(
								// 	'have.attr',
								// 	'aria-checked',
								// 	'true'
								// );

								// hover state updates should not visible
								cy.getParentContainer('Angel').within(() => {
									cy.get('input[inputmode="numeric"]').should(
										'have.value',
										'90'
									);
								});
							});
							// reselect TODO:
							reSelectBlock();

							// Assert control
						});

						it('should control value and attributes be correct, when navigate between states and devices', () => {
							// Active / Mobile
							// Assert block css
							//TODO

							// Normal / Laptop
							setDeviceType('Laptop');
							setBlockState('Normal');
							// Assert block css
							//TODO:
							cy.getIframeBody()
								.find(`[data-type="core/paragraph"]`)
								.should(
									'have.css',
									'background-image',
									'linear-gradient(90deg, rgb(0, 158, 250) 10%, rgb(229, 46, 0) 90%)'
								);

							// Assert control
							openBackgroundItem();
							cy.getByDataTest('popover-body').within(() => {
								cy.getByAriaLabel("Don't Repeat").should(
									'have.attr',
									'aria-checked',
									'true'
								);
								cy.getByAriaLabel('Parallax').should(
									'not.have.attr',
									'aria-checked',
									'true'
								);

								cy.getParentContainer('Angel').within(() => {
									cy.get('input[inputmode="numeric"]').should(
										'have.value',
										'90'
									);
								});
							});

							// Active / Laptop
							setBlockState('Active');
							// Assert block css
							//TODO:
							//Assert control
							openBackgroundItem();
							cy.getByDataTest('popover-body').within(() => {
								cy.getByAriaLabel("Don't Repeat").should(
									'not.have.attr',
									'aria-checked',
									'true'
								);

								cy.getByAriaLabel('Parallax').should(
									'not.have.attr',
									'aria-checked',
									'true'
								);
							});

							// Hover / Laptop
							setBlockState('Hover');
							// check block
							//TODO:
							// Assert control
							openBackgroundItem();
							cy.getByDataTest('popover-body').within(() => {
								cy.getByAriaLabel("Don't Repeat").should(
									'have.attr',
									'aria-checked',
									'true'
								);

								cy.getParentContainer('Angel').within(() => {
									cy.get('input[inputmode="numeric"]').should(
										'have.value',
										'0'
									);
								});

								cy.getByAriaLabel('Parallax').should(
									'not.have.attr',
									'aria-checked',
									'true'
								);
							});

							// Assert store data
							getWPDataObject().then((data) => {
								expect({
									'linear-gradient-0': {
										isVisible: true,
										'linear-gradient':
											'linear-gradient(90deg,#009efa 10%,#e52e00 90%)',
										'linear-gradient-angel': '90',
										'linear-gradient-attachment': 'scroll',
										'linear-gradient-repeat': 'no-repeat',
										order: 0,
										type: 'linear-gradient',
									},
								}).to.be.deep.equal(
									getSelectedBlock(
										data,
										'publisherBackground'
									)
								);

								expect({
									normal: {
										breakpoints: {
											laptop: { attributes: {} },
										},
										isVisible: true,
									},
									hover: {
										breakpoints: {
											laptop: {
												attributes: {
													publisherBackground: {
														'linear-gradient-0': {
															isVisible: true,
															'linear-gradient':
																'linear-gradient(90deg,#009efa 10%,#e52e00 90%)',
															'linear-gradient-angel': 0,
															'linear-gradient-attachment':
																'scroll',
															'linear-gradient-repeat':
																'no-repeat',
															order: 0,
															type: 'linear-gradient',
														},
													},
												},
											},
										},
										isVisible: true,
									},
									active: {
										breakpoints: {
											laptop: {
												attributes: {
													publisherBackground: {
														'linear-gradient-0': {
															isVisible: true,
															'linear-gradient':
																'linear-gradient(90deg,#009efa 10%,#e52e00 90%)',
															'linear-gradient-angel':
																'90',
															'linear-gradient-attachment':
																'scroll',
															'linear-gradient-repeat':
																'repeat',
															order: 0,
															type: 'linear-gradient',
														},
													},
												},
											},
											mobile: {
												attributes: {
													publisherBackground: {
														'linear-gradient-0': {
															isVisible: true,
															'linear-gradient':
																'linear-gradient(90deg,#009efa 10%,#e52e00 90%)',
															'linear-gradient-angel':
																'90',
															'linear-gradient-attachment':
																'fixed',
															'linear-gradient-repeat':
																'no-repeat',
															order: 0,
															type: 'linear-gradient',
														},
													},
												},
											},
										},
										isVisible: true,
									},
								}).to.be.deep.equal(
									getSelectedBlock(
										data,
										'publisherBlockStates'
									)
								);
							});

							// frontend
							savePage();

							redirectToFrontPage();

							// Assert in default viewport
							cy.get('.publisher-core-block').should(
								'have.css',
								'background-image',
								'linear-gradient(90deg, rgb(0, 158, 250) 10%, rgb(229, 46, 0) 90%)'
							);

							// Hover
							cy.get('.publisher-core-block').realHover();
							cy.get('.publisher-core-block')
								.should(
									'have.css',
									'background-image',
									'linear-gradient(0deg, rgb(0, 158, 250) 10%, rgb(229, 46, 0) 90%)'
								)
								.realMouseUp();

							// Active
							cy.get('.publisher-core-block').realMouseDown();
							cy.get('.publisher-core-block')
								.should(
									'have.css',
									'background-image',
									'linear-gradient(90deg, rgb(0, 158, 250) 10%, rgb(229, 46, 0) 90%)'
								)
								.and('have.css', 'background-repeat', 'repeat')
								.realMouseUp();

							// Set desktop viewport
							cy.viewport(1441, 1920);
							cy.get('.publisher-core-block').should(
								'have.css',
								'background-image',
								'linear-gradient(90deg, rgb(0, 158, 250) 10%, rgb(229, 46, 0) 90%)'
							);

							// Hover
							//cy.get('.publisher-core-block').realHover();
							// cy.get('.publisher-core-block')
							// 	.should(
							// 		'have.css',
							// 		'background-image',
							// 		'linear-gradient(0deg, rgb(0, 158, 250) 10%, rgb(229, 46, 0) 90%)'
							// 	)
							// 	.realMouseUp();

							// Active
							//cy.get('.publisher-core-block').realMouseDown();
							// cy.get('.publisher-core-block')
							// 	.should(
							// 		'have.css',
							// 		'background-image',
							// 		'linear-gradient(90deg, rgb(0, 158, 250) 10%, rgb(229, 46, 0) 90%)'
							// 	)
							// 	.and('have.css', 'background-repeat', 'repeat')
							// 	.realMouseUp();

							// set mobile viewport
							cy.viewport(380, 470);
							cy.get('.publisher-core-block').realMouseDown();
							cy.get('.publisher-core-block')
								.should(
									'have.css',
									'background-image',
									'linear-gradient(90deg, rgb(0, 158, 250) 10%, rgb(229, 46, 0) 90%)'
								)
								.and(
									'have.css',
									'background-attachment',
									'fixed'
								);
						});
					});
				});
			});
		});
	});

	describe('switch block and reload', () => {
		context('add block + switch state to hover', () => {
			beforeEach(() => {
				initialSetting();
				addBlockState('hover');
			});

			context('switch block + select first block', () => {
				beforeEach(() => {
					// unfocus block
					cy.getIframeBody().find('[aria-label="Add title"]').click();
					// add new block
					cy.getIframeBody().find('[aria-label="Add block"]').click();

					cy.get('.block-editor-inserter__panel-content').within(
						() => {
							cy.contains('Paragraph').click();
						}
					);

					//
					cy.getIframeBody()
						.find('[data-type="core/paragraph"]')
						.eq(0)
						.click();

					//
					savePage();
				});

				it('should current state be hover', () => {
					checkCurrentState('hover');
				});

				it('should current state be normal, when reload', () => {
					cy.reload();

					cy.getIframeBody()
						.find('[data-type="core/paragraph"]')
						.eq(0)
						.click();

					checkCurrentState('normal');
				});
			});
		});
	});
});
