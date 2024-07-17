/**
 * External dependencies
 */
import 'cypress-real-events';

/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setDeviceType,
	addBlockState,
	reSelectBlock,
	setBlockState,
	setInnerBlock,
	checkBlockCard,
	getWPDataObject,
	getSelectedBlock,
	getBlockClientId,
	getBlockInserter,
	checkCurrentState,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Block State E2E Test', () => {
	beforeEach(() => {
		cy.viewport(1440, 1025);

		createPost();
	});

	const initialSetting = () => {
		appendBlocks(
			'<!-- wp:paragraph -->\n' +
				'<p>Test</p>\n' +
				'<!-- /wp:paragraph -->'
		);
		cy.getBlock('core/paragraph').click();
	};

	describe('state-container component testing ...', () => {
		it('set the "Normal" state color on the root of the container using CSS variables.', () => {
			initialSetting();

			cy.cssVar(
				'--blockera-tab-panel-active-color',
				'[aria-label="Blockera Block State Container"]:first-child'
			).should('eq', '#147EB8');
		});
		it('set the "third-party" state (Like: hover, active, etc) color on the root of the container using CSS variables.', () => {
			initialSetting();

			// add hover(or other pseudo state) state.
			cy.getByAriaLabel('Add New State').click();

			// assert hover(or other pseudo state) state color.
			cy.cssVar(
				'--blockera-tab-panel-active-color',
				'[aria-label="Blockera Block State Container"]:first-child'
			).should('eq', '#D47C14');
		});
	});

	describe('current-state testing ...', () => {
		it('set the hidden style for WordPress block origin features when choose state (apart from normal state)', () => {
			initialSetting();

			// add hover(or other pseudo state) state.
			cy.getByAriaLabel('Add New State').click();

			//In this assertion not available data attribute for this selector، Please don't be sensitive.
			cy.get('button')
				.contains('Advanced')
				.parent()
				.parent()
				.parent()
				.parent()
				.parent()
				.should('have.class', 'blockera-not-allowed');
		});

		it('set the current state when add new block states', () => {
			initialSetting();

			// add hover state.
			cy.getByAriaLabel('Add New State').click();

			checkCurrentState('hover');
			// Check block card
			checkBlockCard([
				{
					label: 'Hover',
					type: 'State',
				},
			]);
		});

		it('should hidden normal state after delete hover state', () => {
			initialSetting();

			// should not render normal in breadcrumb component when still not added any other state!
			cy.contains('Normal').should('not.exist');

			// add hover state.
			cy.getByAriaLabel('Add New State').click();

			// should render normal in breadcrumb component in this step!
			cy.contains('Hover').should('exist');

			// delete hover state, we have just normal state in block-state component.
			cy.getByAriaLabel('Delete hover').click({ force: true });

			// normal item must be hidden.
			cy.contains('Normal').should('not.exist');
			// hover is deleted, so should not render that.
			cy.contains('Hover').should('not.exist');
		});
	});

	describe('block states value cleanup testing ...', () => {
		it('should "blockeraBlockStates" attribute is clean for master block', () => {
			initialSetting();

			addBlockState('hover');

			cy.getByAriaLabel('Input Width').type(100, { force: true });

			//Check store
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover.isOpen
				);

				expect({
					hover: {
						breakpoints: {
							desktop: { attributes: { blockeraWidth: '100px' } },
						},
						isVisible: true,
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates')
				);
			});

			setInnerBlock('Link');

			addBlockState('hover');

			//Check store
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes.blockeraInnerBlocks
				);
			});
		});
	});

	describe('normal state testing ...', () => {
		it('should correctly set attribute and generate styles when breakpoint is: Desktop', () => {
			initialSetting();

			// Set width.
			cy.getByAriaLabel('Input Width').type(100, { force: true });

			// Reselect.
			reSelectBlock();

			// Assert control value to testing useCalculateCurrentAttributes Hook.
			cy.getByAriaLabel('Input Width').should('have.value', '100');

			// Assert block css.
			getWPDataObject().then((data) => {
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}`)
					.should('have.css', 'width', '100px');
			});

			// Assert store data.
			getWPDataObject().then((data) => {
				expect('100px').to.be.equal(
					getSelectedBlock(data, 'blockeraWidth')
				);
				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates')
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			// Set xl-desktop viewport
			cy.viewport(1441, 1920);
			cy.get('.blockera-block').should('have.css', 'width', '100px');

			// Set l-desktop viewport
			cy.viewport(1366, 768);
			cy.get('.blockera-block').should('have.css', 'width', '100px');

			// set mobile-landscape viewport
			cy.viewport(768, 1024);

			cy.get('.blockera-block').should('have.css', 'width', '100px');
		});

		it('should correctly set attribute and generate styles when breakpoint is: Tablet', () => {
			initialSetting();

			setDeviceType('Tablet');

			// Set Width.
			cy.getByAriaLabel('Input Width').type(100, { force: true });

			// Reselect.
			reSelectBlock();

			// Assert control value to testing useCalculateCurrentAttributes Hook.
			cy.getByAriaLabel('Input Width').should('have.value', '100');

			// Assert block css.
			getWPDataObject().then((data) => {
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}`)
					.should('have.css', 'width', '100px');
			});

			// Change device to desktop.
			setDeviceType('Desktop');

			// Assert control value to testing useCalculateCurrentAttributes Hook.
			cy.getByAriaLabel('Input Width').should('not.have.value', '100');

			// Assert block css.
			getWPDataObject().then((data) => {
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}`)
					.should('not.have.css', 'width', '100px');
			});

			// Assert store data.
			getWPDataObject().then((data) => {
				expect({ blockeraWidth: '100px' }).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes
				);
			});

			// frontend.
			savePage();

			redirectToFrontPage();

			// Set xl-desktop viewport
			cy.viewport(1441, 1920);
			cy.get('.blockera-block').should('not.have.css', 'width', '100px');

			// Set l-desktop viewport.
			cy.viewport(1366, 768);
			cy.get('.blockera-block').should('not.have.css', 'width', '100px');

			// Set mobile-landscape viewport.
			cy.viewport(768, 1024);
			cy.get('.blockera-block').should('have.css', 'width', '100px');

			// Set mobile-portrait viewport.
			cy.viewport(478, 580);
			cy.get('.blockera-block').should('have.css', 'width', '100px');
		});
	});

	describe('hover state testing ...', () => {
		it('should correctly set attribute and generate styles when state is: Hover (on desktop)', () => {
			initialSetting();

			addBlockState('hover');

			checkBlockCard([
				{
					label: 'Hover',
					type: 'State',
				},
			]);

			// Assert control value to testing useCalculateCurrentAttributes Hook.
			cy.getByAriaLabel('Input Width').type(150, { force: true });

			// Reselect
			reSelectBlock();

			// Assert control value.
			cy.getByAriaLabel('Input Width').should('have.value', '150');

			// Assert block css.
			getWPDataObject().then((data) => {
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}`)
					.should('have.css', 'width', '150px');

				// Real hover.
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}`)
					.realHover();

				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}:hover`)
					.should('have.css', 'width', '150px');

				// to stop hover.
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}`)
					.realMouseMove(50, 50);
			});

			// Change state to normal.
			setBlockState('Normal');

			// Assert control value to testing useCalculateCurrentAttributes Hook.
			cy.getByAriaLabel('Input Width').should('not.have.value', '150');

			// Assert block css.
			getWPDataObject().then((data) => {
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}`)
					.should('not.have.css', 'width', '150px');

				// Real hover.
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}`)
					.realHover();

				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}:hover`)
					.should('have.css', 'width', '150px');
			});

			// Assert store data.
			getWPDataObject().then((data) => {
				expect({
					desktop: { attributes: { blockeraWidth: '150px' } },
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints
				);
			});

			savePage();

			redirectToFrontPage();

			// Set Desktop viewport
			cy.viewport(1025, 1200);
			cy.get('.blockera-block').should('not.have.css', 'width', '150px');
			cy.get('.blockera-block').realHover();
			cy.get('.blockera-block').should('have.css', 'width', '150px');

			// Set mobile-landscape viewport
			cy.viewport(768, 1024);
			cy.get('.blockera-block').realHover();
			cy.get('.blockera-block').should('have.css', 'width', '150px');
		});

		it('should correctly set attribute and generate styles when state is: Hover (on tablet)', () => {
			initialSetting();

			addBlockState('hover');

			setDeviceType('Tablet');

			// Set Width.
			cy.getByAriaLabel('Input Width').type(100, { force: true });

			reSelectBlock();

			// Assert control value to testing useCalculateCurrentAttributes Hook.
			cy.getByAriaLabel('Input Width').should('have.value', '100');

			// Assert block css.
			getWPDataObject().then((data) => {
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}`)
					.should('have.css', 'width', '100px');

				// Real hover.
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}`)
					.realHover();

				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}:hover`)
					.should('have.css', 'width', '100px');

				// to stop hover.
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}`)
					.realMouseMove(50, 50);
			});

			// Change device to desktop.
			setDeviceType('Desktop');

			// Assert block css.
			getWPDataObject().then((data) => {
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}`)
					.should('not.have.css', 'width', '100px');

				// Real hover.
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}`)
					.realHover();

				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}:hover`)
					.should('not.have.css', 'width', '100px');
			});

			// Assert control value to testing useCalculateCurrentAttributes Hook.
			cy.getByAriaLabel('Input Width').should('not.have.value', '100');

			// Assert store data
			getWPDataObject().then((data) => {
				expect({ blockeraWidth: '100px' }).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			// Set Desktop viewport
			cy.viewport(1025, 1200);
			cy.get('.blockera-block').realHover();
			cy.get('.blockera-block').should('not.have.css', 'width', '100px');

			// Set mobile-landscape viewport
			cy.viewport(768, 1024);
			cy.get('.blockera-block').realHover();
			cy.get('.blockera-block').should('have.css', 'width', '100px');

			// Set mobile-portrait viewport
			cy.viewport(320, 480);
			cy.get('.blockera-block').realHover();
			cy.get('.blockera-block').should('have.css', 'width', '100px');
		});
	});

	describe('multiple states testing ...', () => {
		beforeEach(() => {
			initialSetting();
		});

		it('can manipulate settings', () => {
			cy.getByDataTest('border-control-width').type(5);

			reSelectBlock();

			// Assert control value
			cy.getByDataTest('border-control-width').should('have.value', '5');

			context(
				'can manipulate settings on hover state with inherit other settings of normal state',
				() => {
					addBlockState('hover');

					cy.getByDataTest('border-control-color').click();
					cy.getByDataTest('popover-body')
						.last()
						.within(() => {
							cy.get('input[maxlength="9"]').clear();
							cy.get('input[maxlength="9"]').type('ccc');
						});

					// inherit of normal.
					cy.getByDataTest('border-control-width').should(
						'have.value',
						'5'
					);

					reSelectBlock();

					// inherit of normal.
					cy.getByDataTest('border-control-width').should(
						'have.value',
						'5'
					);

					// hover settings data.
					cy.getByDataTest('border-control-color').should(
						'have.class',
						'is-not-empty'
					);

					checkCurrentState('hover');
				}
			);

			context(
				'should correctly set attribute and generate styles in all existed state',
				() => {
					setBlockState('Normal');

					// Assert block css when state is "Normal" and breakpoint is "Desktop".
					getWPDataObject().then((data) => {
						cy.getIframeBody()
							.find(`#block-${getBlockClientId(data)}`)
							.should(
								'have.css',
								'border',
								'5px solid rgb(17, 17, 17)'
							);

						// Hover
						cy.getIframeBody()
							.find(`#block-${getBlockClientId(data)}`)
							.realHover();
						cy.getIframeBody()
							.find(`#block-${getBlockClientId(data)}:hover`)
							.should(
								'have.css',
								'border',
								'5px solid rgb(204, 204, 204)'
							);

						cy.getIframeBody()
							.find(`#block-${getBlockClientId(data)}`)
							.realMouseMove(50, 50);
					});

					setBlockState('Hover');

					// Assert block css when state is "Hover" and breakpoint is "Desktop".
					getWPDataObject().then((data) => {
						cy.getIframeBody()
							.find(`#block-${getBlockClientId(data)}`)
							.should(
								'have.css',
								'border',
								'5px solid rgb(204, 204, 204)'
							);

						// Real hover
						cy.getIframeBody()
							.find(`#block-${getBlockClientId(data)}`)
							.realHover();
						cy.getIframeBody()
							.find(`#block-${getBlockClientId(data)}:hover`)
							.should(
								'have.css',
								'border',
								'5px solid rgb(204, 204, 204)'
							)
							.realMouseUp();
					});

					// frontend
					savePage();

					redirectToFrontPage();

					// Set l-desktop viewport
					cy.viewport(1025, 1200);
					cy.get('.blockera-block').should(
						'have.css',
						'border',
						'5px solid rgb(17, 17, 17)'
					);

					// Hover
					cy.get('.blockera-block').realHover();
					cy.get('.blockera-block')
						.should(
							'have.css',
							'border',
							'5px solid rgb(204, 204, 204)'
						)
						.realMouseUp();

					// Set xl-desktop viewport
					cy.viewport(1441, 1920);

					cy.get('.blockera-block').should(
						'have.css',
						'border',
						'5px solid rgb(17, 17, 17)'
					);

					// Hover
					cy.get('.blockera-block').realHover();
					cy.get('.blockera-block')
						.should(
							'have.css',
							'border',
							'5px solid rgb(204, 204, 204)'
						)
						.realMouseUp();
				}
			);
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
						cy.getByAriaLabel('Rotate Anti-clockwise').click();
					});

					// normal state updates should display
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
						cy.getByAriaLabel('Rotate Anti-clockwise').click();
					});
				});

				it('should control value and attributes be correct, when navigate between states and devices', () => {
					// Normal / Desktop
					setDeviceType('Desktop');
					setBlockState('Normal');
					// Assert block css
					getWPDataObject().then((data) => {
						cy.getIframeBody()
							.find(`#block-${getBlockClientId(data)}`)
							.should(
								'have.css',
								'background-image',
								'linear-gradient(90deg, rgb(0, 158, 250) 10%, rgb(229, 46, 0) 90%)'
							);

						// Hover
						cy.getIframeBody()
							.find(`#block-${getBlockClientId(data)}`)
							.realHover();

						cy.getIframeBody()
							.find(`#block-${getBlockClientId(data)}:hover`)
							.should(
								'have.css',
								'background-image',
								'linear-gradient(0deg, rgb(0, 158, 250) 10%, rgb(229, 46, 0) 90%)'
							)
							.realMouseMove(50, 50);
					});

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

					// Hover / Desktop
					setBlockState('Hover');
					// Assert block css
					getWPDataObject().then((data) => {
						cy.getIframeBody()
							.find(`#block-${getBlockClientId(data)}`)
							.should(
								'have.css',
								'background-image',
								'linear-gradient(0deg, rgb(0, 158, 250) 10%, rgb(229, 46, 0) 90%)'
							);

						// Hover
						cy.getIframeBody()
							.find(`#block-${getBlockClientId(data)}`)
							.realHover();

						cy.getIframeBody()
							.find(`#block-${getBlockClientId(data)}:hover`)
							.should(
								'have.css',
								'background-image',
								'linear-gradient(0deg, rgb(0, 158, 250) 10%, rgb(229, 46, 0) 90%)'
							)
							.realMouseMove(50, 50);
					});

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

					getWPDataObject().then((data) => {
						expect({
							hover: {
								breakpoints: {
									desktop: {
										attributes: {
											blockeraBackground: {
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
						}).to.be.deep.equal(
							getSelectedBlock(data, 'blockeraBlockStates')
						);
					});

					// frontend
					savePage();

					redirectToFrontPage();

					// Assert in l-desktop viewport
					cy.viewport(1025, 1440);
					cy.get('.blockera-block').should(
						'have.css',
						'background-image',
						'linear-gradient(90deg, rgb(0, 158, 250) 10%, rgb(229, 46, 0) 90%)'
					);

					// Hover
					cy.get('.blockera-block').realHover();
					cy.get('.blockera-block')
						.should(
							'have.css',
							'background-image',
							'linear-gradient(0deg, rgb(0, 158, 250) 10%, rgb(229, 46, 0) 90%)'
						)
						.realMouseMove(50, 50);

					// Set desktop viewport
					cy.viewport(1441, 1920);
					cy.get('.blockera-block').should(
						'have.css',
						'background-image',
						'linear-gradient(90deg, rgb(0, 158, 250) 10%, rgb(229, 46, 0) 90%)'
					);

					// Hover
					cy.get('.blockera-block').realHover();
					cy.get('.blockera-block')
						.should(
							'have.css',
							'background-image',
							'linear-gradient(0deg, rgb(0, 158, 250) 10%, rgb(229, 46, 0) 90%)'
						)
						.realMouseMove(50, 50);

					// set mobile viewport
					cy.viewport(380, 470);
					cy.get('.blockera-block').should(
						'have.css',
						'background-image',
						'linear-gradient(90deg, rgb(0, 158, 250) 10%, rgb(229, 46, 0) 90%)'
					);
				});
			});
		});
	});

	describe('update attributes in multiple devices', () => {
		context('Desktop(default) -> set width', () => {
			beforeEach(() => {
				initialSetting();

				cy.setInputFieldValue('Width', 'Size', 150);
			});

			context('Tablet -> update width', () => {
				beforeEach(() => {
					setDeviceType('Tablet');

					// Should display desktop value as default
					cy.checkInputFieldValue('Width', 'Size', 150);

					cy.setInputFieldValue('Width', 'Size', 100, true);
				});

				context('Mobile -> update width', () => {
					beforeEach(() => {
						setDeviceType('Mobile Portrait');

						// Should display desktop value as default
						cy.checkInputFieldValue('Width', 'Size', 150);

						cy.setInputFieldValue('Width', 'Size', 50, true);
					});

					it('should control value and devices be correct, when navigate between devices', () => {
						// Mobile
						// Assert control
						cy.checkInputFieldValue('Width', 'Size', 50);

						// Assert block css
						getWPDataObject().then((data) => {
							//TODO
							cy.getIframeBody()
								.find(`#block-${getBlockClientId(data)}`)
								.should('have.css', 'width', '50px');
						});

						// Tablet
						setDeviceType('Tablet');

						// Assert control
						cy.checkInputFieldValue('Width', 'Size', 100);

						// Assert block css
						getWPDataObject().then((data) => {
							//TODO
							cy.getIframeBody()
								.find(`#block-${getBlockClientId(data)}`)
								.should('have.css', 'width', '100px');
						});

						// Desktop
						setDeviceType('Desktop');

						// Assert control
						cy.checkInputFieldValue('Width', 'Size', 150);

						// Assert block css
						getWPDataObject().then((data) => {
							cy.getIframeBody()
								.find(`#block-${getBlockClientId(data)}`)
								.should('have.css', 'width', '150px');
						});

						// frontend
						savePage();

						redirectToFrontPage();

						// default breakpoint
						cy.get('.blockera-block').should(
							'have.css',
							'width',
							'150px'
						);

						// Set xl-desktop viewport
						cy.viewport(1441, 1920);
						cy.get('.blockera-block').should(
							'have.css',
							'width',
							'150px'
						);

						// set mobile-landscape viewport
						cy.viewport(768, 1024);
						cy.get('.blockera-block').should(
							'have.css',
							'width',
							'100px'
						);

						// set mobile-portrait viewport
						cy.viewport(320, 480);
						cy.get('.blockera-block').should(
							'have.css',
							'width',
							'50px'
						);
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

				cy.setInputFieldValue('Width', 'Size', 150);
			});

			context('switch block + select first block', () => {
				beforeEach(() => {
					// unfocus block
					cy.getIframeBody().find('[aria-label="Add title"]').click();
					// add new block
					getBlockInserter().click();

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
