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
	setInnerBlock,
	redirectToFrontPage,
	reSelectBlock,
	checkCurrentState,
	createPost,
	getBlockClientId,
} from '../../../../../../cypress/helpers';
import 'cypress-real-events';

describe('Inner Blocks E2E Test', () => {
	beforeEach(() => {
		createPost();
		cy.viewport(1440, 1025);
	});

	const initialSetting = () => {
		appendBlocks(
			`<!-- wp:paragraph {"className":"publisher-core-block publisher-core-block-10bb7854-c3bc-45cd-8202-b6b7c36c6b74","publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"publisherPropsId":"224185412280","publisherCompatId":"224185412280"} -->
			<p class="publisher-core-block publisher-core-block-10bb7854-c3bc-45cd-8202-b6b7c36c6b74"><a href="http://localhost/wordpress/2023/12/16/5746/" data-type="post" data-id="5746" class="my-link">link</a></p>
			<!-- /wp:paragraph -->`
		);
		cy.getIframeBody().find('[data-type="core/paragraph"]').click();
	};

	const checkBlockCard = (labels) => {
		labels.forEach((label, i) => {
			// block card
			cy.getByAriaLabel('Selected Block').within(() => {
				// should exist and have correct order
				cy.get('span').eq(i).should('have.text', label);
			});
		});
	};

	describe('state-container', () => {
		it('Set the "Inner Blocks" color on the root of the container using CSS variables.', () => {
			initialSetting();
			setInnerBlock('Link');

			cy.cssVar(
				'--publisher-tab-panel-active-color',
				'[aria-label="Publisher Block State Container"]:first-child'
			).should('eq', '#cc0000');
		});

		it('Set the "third-party" state (Like: hover, active, etc) color on the root of the container using CSS variables.', () => {
			initialSetting();
			setInnerBlock('Link');
			addBlockState('hover');

			cy.cssVar(
				'--publisher-tab-panel-active-color',
				'[aria-label="Publisher Block State Container"]:first-child'
			).should('eq', '#D47C14');
		});

		it('should block state container title be correct', () => {
			initialSetting();
			setInnerBlock('Link');

			cy.getByAriaLabel('Publisher Block State Container')
				.first()
				.within(() => {
					cy.contains('Inner Block States').should('exist');
				});
		});
	});

	describe('current-state', () => {
		it('Set the hidden style for WordPress block origin features when choose state (apart from normal state)', () => {
			initialSetting();
			setInnerBlock('Link');
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
			setInnerBlock('Link');
			checkBlockCard(['Link']);

			cy.getByAriaLabel('Add New State').click();

			checkCurrentState('hover');
			checkBlockCard(['Link', 'Hover']);

			cy.getByAriaLabel('Add New State').click();

			checkCurrentState('active');
			checkBlockCard(['Link', 'Active']);

			cy.getByAriaLabel('Add New State').click();

			checkCurrentState('focus');
			checkBlockCard(['Link', 'Focus']);
		});
	});

	describe('add new state', () => {
		it('should not display normal when delete hover state ', () => {
			initialSetting();
			setInnerBlock('Link');

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
			setInnerBlock('Link');

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
			setInnerBlock('Link');

			// add
			addBlockState('hover');

			// Check store
			getWPDataObject().then((data) => {
				expect(['normal', 'hover']).to.be.deep.equal(
					Object.keys(
						getSelectedBlock(data, 'publisherInnerBlocks').link
							.attributes.publisherBlockStates
					)
				);
			});

			// update
			cy.getByDataTest('popover-body').within(() => {
				cy.get('select').select('focus');
			});

			// Check store
			getWPDataObject().then((data) => {
				expect(['normal', 'focus']).to.be.deep.equal(
					Object.keys(
						getSelectedBlock(data, 'publisherInnerBlocks').link
							.attributes.publisherBlockStates
					)
				);
			});
		});
	});

	describe('Master -> Normal -> InnerBlock -> Normal', () => {
		it('should set attr in innerBlocks root when default breakPoint', () => {
			initialSetting();
			setInnerBlock('Link');
			//
			checkBlockCard(['Link']);
			// Set overflow
			cy.getByAriaLabel('Hidden Overflow').click();

			// Reselect
			reSelectBlock();
			setInnerBlock('Link');

			// Assert control value
			cy.getByAriaLabel('Hidden Overflow').should(
				'have.attr',
				'aria-pressed',
				'true'
			);

			// Assert block css : inner
			getWPDataObject().then((data) => {
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should('have.css', 'overflow', 'hidden');
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					link: {
						attributes: {
							publisherOverflow: 'hidden',
						},
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherInnerBlocks')
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			// TODO :
			//cy.get('.my-link').should('have.css', 'overflow', 'hidden');

			// Set desktop viewport
			cy.viewport(1441, 1920);

			//cy.get('.my-link').should('have.css', 'overflow', 'hidden');

			// // set Tablet viewport
			cy.viewport(768, 1024);

			//cy.get('.my-link').should('have.css', 'overflow', 'hidden');
		});

		it('should set attribute correctly when breakpoint : Tablet', () => {
			initialSetting();
			setInnerBlock('Link');
			setDeviceType('Tablet');
			//
			checkBlockCard(['Link']);
			// Set overflow
			cy.getByAriaLabel('Hidden Overflow').click();

			// Reselect
			reSelectBlock();
			setInnerBlock('Link');

			// Assert control value
			cy.getByAriaLabel('Hidden Overflow').should(
				'have.attr',
				'aria-pressed',
				'true'
			);

			// Assert block css : inner / tablet
			//TODO
			// getWPDataObject().then((data) => {
			// 	cy.getIframeBody()
			// 		.find(`#block-${getBlockClientId(data)} a`)
			// 		.should('have.css', 'overflow', 'hidden');
			// });

			// Change device to laptop
			setDeviceType('Laptop');

			// Assert control
			cy.getByAriaLabel('Hidden Overflow').should(
				'not.have.attr',
				'aria-checked',
				'true'
			);

			// Assert block css : inner /laptop
			getWPDataObject().then((data) => {
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should('not.have.css', 'overflow', 'hidden');
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherInnerBlocks')
				);

				expect({
					publisherInnerBlocks: {
						link: { attributes: { publisherOverflow: 'hidden' } },
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates').normal
						.breakpoints.tablet.attributes
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			// Assert in default viewport
			cy.get('.my-link').should('not.have.css', 'overflow', 'hidden');

			// Set desktop viewport
			cy.viewport(1441, 1920);

			cy.get('.my-link').should('not.have.css', 'overflow', 'hidden');

			// TODO:
			// set tablet viewport
			cy.viewport(768, 1024);

			//cy.get('.my-link').should('have.css', 'overflow', 'hidden');

			// set mobile viewport
			cy.viewport(320, 480);

			//cy.get('.my-link').should('have.css', 'overflow', 'hidden');
		});
	});

	describe('Master -> Normal -> InnerBlock -> Hover', () => {
		it('should set attribute correctly when : default breakPoint', () => {
			initialSetting();
			setInnerBlock('Link');
			addBlockState('hover');
			//
			checkBlockCard(['Link', 'Hover']);

			// Set overflow
			cy.getByAriaLabel('Hidden Overflow').click();

			// Reselect
			reSelectBlock();
			setInnerBlock('Link');

			// Assert control value
			cy.getByAriaLabel('Hidden Overflow').should(
				'have.attr',
				'aria-pressed',
				'true'
			);
			checkCurrentState('hover');

			// Assert block css : inner / hover
			getWPDataObject().then((data) => {
				// Because we expect block element should have css style to show activated hover state.
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should('have.css', 'overflow', 'hidden');

				// Real hover
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.realHover();
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a:hover`)
					.should('have.css', 'overflow', 'hidden');
			});

			// Change state to normal
			setBlockState('Normal');

			// Assert control value
			cy.getByAriaLabel('Hidden Overflow').should(
				'have.attr',
				'aria-pressed',
				'false'
			);

			// Assert block css : inner / normal
			getWPDataObject().then((data) => {
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should('not.have.css', 'overflow', 'hidden');

				// Real hover
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.realHover();
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a:hover`)
					.should('have.css', 'overflow', 'hidden');
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({ publisherOverflow: 'hidden' }).to.be.deep.equal(
					getSelectedBlock(data, 'publisherInnerBlocks').link
						.attributes.publisherBlockStates.hover.breakpoints
						.laptop.attributes
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			cy.get('.my-link').realHover();
			cy.get('.my-link').should('have.css', 'overflow', 'hidden');

			//TODO:
			// Set desktop viewport
			cy.viewport(1441, 1920);

			//cy.get('.my-link').realHover();
			//cy.get('.my-link').should('have.css', 'overflow', 'hidden');

			// TODO:
			// set tablet viewport
			cy.viewport(768, 1024);

			//cy.get('.my-link').realHover();
			//cy.get('.my-link').should('have.css', 'overflow', 'hidden');
		});

		it('should set attribute correctly when : Tablet', () => {
			initialSetting();
			setInnerBlock('Link');
			addBlockState('hover');
			setDeviceType('Tablet');
			//
			checkBlockCard(['Link', 'Hover']);

			// Set overflow
			cy.getByAriaLabel('Hidden Overflow').click();

			// Reselect
			reSelectBlock();
			setInnerBlock('Link');

			// Assert control value
			cy.getByAriaLabel('Hidden Overflow').should(
				'have.attr',
				'aria-pressed',
				'true'
			);
			checkCurrentState('hover');

			// Assert block css : inner / hover / tablet
			//TODO
			// getWPDataObject().then((data) => {
			// 	// Because we expect block element should have css style to show activated hover state.
			// 	cy.getIframeBody()
			// 		.find(`#block-${getBlockClientId(data)} a`)
			// 		.should('have.css', 'overflow', 'hidden');

			// 	// Real hover
			// 	cy.getIframeBody()
			// 		.find(`#block-${getBlockClientId(data)} a`)
			// 		.realHover();
			// 	cy.getIframeBody()
			// 		.find(`#block-${getBlockClientId(data)} a:hover`)
			// 		.should('have.css', 'overflow', 'hidden');
			// });

			// Change device to laptop
			setDeviceType('Laptop');

			// Assert block css : inner / hover / laptop
			getWPDataObject().then((data) => {
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should('not.have.css', 'overflow', 'hidden');

				// Real hover
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.realHover();
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a:hover`)
					.should('not.have.css', 'overflow', 'hidden');
			});

			// Assert control value
			cy.getByAriaLabel('Hidden Overflow').should(
				'have.attr',
				'aria-pressed',
				'false'
			);

			// Change state to normal
			setBlockState('Normal');

			// Assert block css : inner / normal / laptop
			getWPDataObject().then((data) => {
				// Real hover
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.realHover();
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a:hover`)
					.should('not.have.css', 'overflow', 'hidden');
			});

			// Change device to tablet
			setDeviceType('Tablet');

			// Assert block css : inner / normal / tablet
			//TODO
			// getWPDataObject().then((data) => {
			// 	cy.getIframeBody()
			// 		.find(`#block-${getBlockClientId(data)} a`)
			// 		.should('not.have.css', 'overflow', 'hidden');

			// 	// Real hover
			// 	cy.getIframeBody()
			// 		.find(`#block-${getBlockClientId(data)} a`)
			// 		.realHover();
			// 	cy.getIframeBody()
			// 		.find(`#block-${getBlockClientId(data)} a:hover`)
			// 		.should('have.css', 'overflow', 'hidden');
			// });

			// Assert store data
			getWPDataObject().then((data) => {
				expect({ publisherOverflow: 'hidden' }).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates').normal
						.breakpoints.tablet.attributes.publisherInnerBlocks.link
						.attributes.publisherBlockStates.hover.breakpoints
						.tablet.attributes
				);

				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherInnerBlocks').link
						.attributes.publisherBlockStates.hover.breakpoints
						.laptop.attributes
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			cy.get('.my-link').realHover();
			cy.get('.my-link').should('not.have.css', 'overflow', 'hidden');

			// Set desktop viewport
			cy.viewport(1441, 1920);

			cy.get('.my-link').realHover();
			cy.get('.my-link').should('not.have.css', 'overflow', 'hidden');

			// TODO:
			// set tablet viewport
			cy.viewport(768, 1024);

			// cy.get('.my-link').realHover();
			// cy.get('.my-link').should('have.css', 'overflow', 'hidden');

			// set mobile viewport
			// cy.viewport(320, 480);

			// cy.get('.my-link').realHover();
			//cy.get('.my-link').should('have.css', 'overflow', 'hidden');
		});
	});

	describe('Master -> Normal -> InnerBlock -> update attributes in multiple states and devices', () => {
		context('Inner -> Normal -> set display flex', () => {
			beforeEach(() => {
				initialSetting();
				setInnerBlock('Link');

				cy.getByAriaLabel('Flex').click();

				// Reselect
				reSelectBlock();
				setInnerBlock('Link');

				// Assert control value
				//TODO:
				// cy.getByAriaLabel('Flex').should(
				// 	'have.attr',
				// 	'aria-pressed',
				// 	'true'
				// );

				// alias
				cy.getParentContainer('Flex Layout').as('flex-layout');
			});

			context('Inner -> Hover -> set column direction', () => {
				beforeEach(() => {
					addBlockState('hover');

					// normal state updates should display
					cy.getByAriaLabel('Flex').should(
						'have.attr',
						'aria-pressed',
						'true'
					);

					cy.get('@flex-layout').within(() => {
						cy.getByAriaLabel('Column').click();
					});

					// Reselect
					reSelectBlock();
					setInnerBlock('Link');

					// Assert control value
					//TODO:
					// cy.get('@flex-layout').within(() => {
					// 	cy.getByAriaLabel('Column').should(
					// 		'have.attr',
					// 		'aria-pressed',
					// 		'true'
					// 	);
					// });
				});

				context(
					'Inner -> Active -> set align-items and justify-content to flex-start',
					() => {
						beforeEach(() => {
							addBlockState('active');

							// normal state updates should displa
							cy.getByAriaLabel('Flex').should(
								'have.attr',
								'aria-pressed',
								'true'
							);

							// hover state updates should not display
							cy.get('@flex-layout').within(() => {
								cy.getByAriaLabel('Column').should(
									'not.have.attr',
									'aria-pressed',
									'true'
								);
							});

							// Set data
							cy.get('@flex-layout').within(() => {
								cy.getByDataTest(
									'matrix-top-left-normal'
								).click();
							});

							// Reselect
							reSelectBlock();
							setInnerBlock('Link');

							// Assert control value
							// TODO:
							// cy.get('@flex-layout').within(() => {
							// 	cy.getByDataTest(
							// 		'matrix-top-left-selected'
							// 	).should('exist');
							// });
						});

						context(
							'Inner -> Active -> Tablet -> set align-items and justify-content to flex-end',
							() => {
								beforeEach(() => {
									setDeviceType('Tablet');

									// normal state updates should display
									cy.getByAriaLabel('Flex').should(
										'have.attr',
										'aria-pressed',
										'true'
									);

									cy.get('@flex-layout').within(() => {
										// hover state updates should not display
										cy.getByAriaLabel('Column').should(
											'not.have.attr',
											'aria-pressed',
											'true'
										);

										// active (laptop) state updates should not display
										// TODO:
										// cy.getByDataTest(
										// 	'matrix-top-left-selected'
										// ).should('not.exist');
									});

									// Set data
									cy.get('@flex-layout').within(() => {
										cy.getByDataTest(
											'matrix-bottom-right-normal'
										).click();
									});

									// Reselect
									reSelectBlock();
									setInnerBlock('Link');

									// Assert control value
									// cy.get('@flex-layout').within(() => {
									// 	cy.getByDataTest(
									// 		'matrix-bottom-right-selected'
									// 	).should('exist');
									// });
								});

								it('should control value and attributes be correct, when navigate between states and devices', () => {
									// Assert block css (active/tablet)
									//TODO:
									// getWPDataObject().then((data) => {
									// 	cy.getIframeBody()
									// 		.find(
									// 			`#block-${getBlockClientId(
									// 				data
									// 			)} a`
									// 		)
									// 		.should(
									// 			'have.css',
									// 			'align-items',
									// 			'flex-end'
									// 		)
									// 		.and(
									// 			'have.css',
									// 			'justify-content',
									// 			'flex-end'
									// 		);

									// 	// Real active
									// 	cy.getIframeBody()
									// 		.find(
									// 			`#block-${getBlockClientId(
									// 				data
									// 			)} a`
									// 		)
									// 		.realMouseDown();
									// 	cy.getIframeBody()
									// 		.find(
									// 			`#block-${getBlockClientId(
									// 				data
									// 			)} a:active`
									// 		)
									// 		.should(
									// 			'have.css',
									// 			'align-items',
									// 			'flex-end'
									// 		)
									// 		.and(
									// 			'have.css',
									// 			'justify-content',
									// 			'flex-end'
									// 		);
									// });

									// Change to hover state (tablet)
									setBlockState('Hover');

									// Assert control
									cy.getByAriaLabel('Column').should(
										'not.have.attr',
										'aria-pressed',
										'true'
									);

									// Assert block css
									// TODO: recheck if this assertion is needed??
									getWPDataObject().then((data) => {
										// should not get hover/laptop css
										cy.getIframeBody()
											.find(
												`#block-${getBlockClientId(
													data
												)} a`
											)
											.should(
												'have.css',
												'flex-direction',
												'row'
											);

										// Real hover
										cy.getIframeBody()
											.find(
												`#block-${getBlockClientId(
													data
												)} a`
											)
											.realHover();
										cy.getIframeBody()
											.find(
												`#block-${getBlockClientId(
													data
												)} a:hover`
											)
											.should(
												'have.css',
												'flex-direction',
												'row'
											);
									});

									// Change to laptop device (hover)
									setDeviceType('Laptop');

									// Assert control
									//TODO:
									// cy.getByAriaLabel('Column').should(
									// 	'have.attr',
									// 	'aria-pressed',
									// 	'true'
									// );

									// Assert block css
									// TODO:
									// getWPDataObject().then((data) => {
									// 	cy.getIframeBody()
									// 		.find(
									// 			`#block-${getBlockClientId(
									// 				data
									// 			)} a`
									// 		)
									// 		.should(
									// 			'have.css',
									// 			'flex-direction',
									// 			'column'
									// 		);

									// 	// Real hover
									// 	cy.getIframeBody()
									// 		.find(
									// 			`#block-${getBlockClientId(
									// 				data
									// 			)} a`
									// 		)
									// 		.realHover();
									// 	cy.getIframeBody()
									// 		.find(
									// 			`#block-${getBlockClientId(
									// 				data
									// 			)} a:hover`
									// 		)
									// 		.should(
									// 			'have.css',
									// 			'flex-direction',
									// 			'column'
									// 		);
									// });

									// Change to normal state (laptop)
									setBlockState('Normal');

									// Assert control value
									cy.getByAriaLabel('Flex').should(
										'have.attr',
										'aria-pressed',
										'true'
									);

									cy.get('@flex-layout').within(() => {
										// should not display other device and state changes
										cy.getByDataTest(
											'matrix-bottom-right-selected'
										).should('not.exist');

										cy.getByDataTest(
											'matrix-top-left-selected'
										).should('not.exist');

										//TODO:
										// cy.getByAriaLabel('Column').should(
										// 	'not.have.attr',
										// 	'aria-checked',
										// 	'true'
										// );
									});

									// Assert block css
									getWPDataObject().then((data) => {
										cy.getIframeBody()
											.find(
												`#block-${getBlockClientId(
													data
												)} a`
											)
											.should(
												'have.css',
												'display',
												'flex'
											);
									});

									// Change to active state (laptop)
									setBlockState('Active');
									// Assert control
									cy.get('@flex-layout').within(() => {
										// TODO:
										// cy.getByDataTest(
										// 	'matrix-top-left-selected'
										// ).should('exist');

										// should not display hover state changes
										cy.getByAriaLabel('Column').should(
											'not.have.attr',
											'aria-checked',
											'true'
										);
									});

									// Assert block css
									//TODO:
									// getWPDataObject().then((data) => {
									// 	cy.getIframeBody()
									// 		.find(
									// 			`#block-${getBlockClientId(
									// 				data
									// 			)} a`
									// 		)
									// 		.should(
									// 			'have.css',
									// 			'align-items',
									// 			'flex-start'
									// 		)
									// 		.and(
									// 			'have.css',
									// 			'justify-content',
									// 			'flex-start'
									// 		);

									// 	// Real active
									// 	cy.getIframeBody()
									// 		.find(
									// 			`#block-${getBlockClientId(
									// 				data
									// 			)} a`
									// 		)
									// 		.realMouseDown();
									// 	cy.getIframeBody()
									// 		.find(
									// 			`#block-${getBlockClientId(
									// 				data
									// 			)} a:active`
									// 		)
									// 		.should(
									// 			'have.css',
									// 			'align-items',
									// 			'flex-start'
									// 		)
									// 		.and(
									// 			'have.css',
									// 			'justify-content',
									// 			'flex-start'
									// 		);
									// });

									// Assert data store
									//TODO : active / tablet / direction is wrong
									// getWPDataObject().then((data) => {
									// 	expect({
									// 		laptop: { attributes: {} },
									// 		tablet: {
									// 			attributes: {
									// 				publisherInnerBlocks: {
									// 					link: {
									// 						attributes: {
									// 							publisherBlockStates:
									// 								{
									// 									active: {
									// 										breakpoints:
									// 											{
									// 												tablet: {
									// 													attributes:
									// 														{
									// 															publisherFlexLayout:
									// 																{
									// 																	direction:
									// 																		'row',
									// 																	alignItems:
									// 																		'flex-end',
									// 																	justifyContent:
									// 																		'flex-end',
									// 																},
									// 														},
									// 												},
									// 											},
									// 									},
									// 								},
									// 						},
									// 					},
									// 				},
									// 			},
									// 		},
									// 	}).to.be.deep.eq(
									// 		getSelectedBlock(
									// 			data,
									// 			'publisherBlockStates'
									// 		).normal.breakpoints
									// 	);
									// });

									//TODO : active / laptop / direction is wrong
									// getWPDataObject().then((data) => {
									// 	expect({
									// 		link: {
									// 			attributes: {
									// 				publisherDisplay: 'flex',
									// 				publisherBlockStates: {
									// 					normal: {
									// 						breakpoints: {
									// 							laptop: {
									// 								attributes:
									// 									{},
									// 							},
									// 						},
									// 						isVisible: true,
									// 					},
									// 					hover: {
									// 						breakpoints: {
									// 							laptop: {
									// 								attributes:
									// 									{
									// 										publisherFlexLayout:
									// 											{
									// 												direction:
									// 													'column',
									// 												alignItems:
									// 													'',
									// 												justifyContent:
									// 													'',
									// 											},
									// 									},
									// 							},
									// 						},
									// 						isVisible: true,
									// 					},
									// 					active: {
									// 						breakpoints: {
									// 							laptop: {
									// 								attributes:
									// 									{
									// 										publisherFlexLayout:
									// 											{
									// 												direction:
									// 													'row',
									// 												alignItems:
									// 													'flex-start',
									// 												justifyContent:
									// 													'flex-start',
									// 											},
									// 									},
									// 							},
									// 						},
									// 						isVisible: true,
									// 					},
									// 				},
									// 			},
									// 		},
									// 	}).to.be.deep.eq(
									// 		getSelectedBlock(
									// 			data,
									// 			'publisherInnerBlocks'
									// 		)
									// 	);
									//});

									// frontend
									//TODO
									// savePage();

									// redirectToFrontPage();

									// // Assert in default viewport
									// cy.get('.my-link').should(
									// 	'have.css',
									// 	'display',
									// 	'flex'
									// );

									// // Hover
									// cy.get('.my-link').realHover();
									// cy.get('.my-link')
									// 	.should(
									// 		'have.css',
									// 		'flex-direction',
									// 		'column'
									// 	)
									// 	.realMouseUp();

									// // Active
									// cy.get('.my-link').realMouseDown();
									// cy.get('.my-link')
									// 	.should(
									// 		'have.css',
									// 		'align-items',
									// 		'flex-start'
									// 	)
									// 	.and(
									// 		'have.css',
									// 		'justify-content',
									// 		'flex-start'
									// 	)
									// 	.realMouseUp();

									// // Set desktop viewport
									// cy.viewport(1441, 1920);
									// cy.get('.my-link').should(
									// 	'have.css',
									// 	'display',
									// 	'flex'
									// );

									// // Hover
									// cy.get('.my-link').realHover();
									// cy.get('.my-link')
									// 	.should(
									// 		'have.css',
									// 		'flex-direction',
									// 		'column'
									// 	)
									// 	.realMouseUp();

									// // Active
									// cy.get('.my-link').realMouseDown();
									// cy.get('.my-link')
									// 	.should(
									// 		'have.css',
									// 		'align-items',
									// 		'flex-start'
									// 	)
									// 	.and(
									// 		'have.css',
									// 		'justify-content',
									// 		'flex-start'
									// 	)
									// 	.realMouseUp();

									// // set tablet viewport
									// cy.viewport(768, 1024);
									// cy.get('.my-link').should(
									// 	'have.css',
									// 	'display',
									// 	'flex'
									// );

									// Hover
									// cy.get('.my-link').realHover();
									// cy.get('.my-link')
									// 	.should(
									// 		'have.css',
									// 		'flex-direction',
									// 		'column'
									// 	)
									// 	.realMouseUp();

									// // Active
									// cy.get('.my-link').realMouseDown();
									// cy.get('.my-link')
									// 	.should(
									// 		'have.css',
									// 		'align-items',
									// 		'flex-end'
									// 	)
									// 	.and(
									// 		'have.css',
									// 		'justify-content',
									// 		'flex-end'
									// 	)
									// 	.realMouseUp();

									// Set mobile viewport
									//cy.viewport(380, 470);
									//cy.get('.my-link').should(
									// 	'have.css',
									// 	'display',
									// 	'flex'
									// );

									// // Hover
									// cy.get('.my-link').realHover();
									// cy.get('.my-link')
									// 	.should(
									// 		'have.css',
									// 		'flex-direction',
									// 		'column'
									// 	)
									// 	.realMouseUp();

									// // Active
									// cy.get('.my-link').realMouseDown();
									// cy.get('.my-link')
									// 	.should(
									// 		'have.css',
									// 		'align-items',
									// 		'flex-start'
									// 	)
									// 	.and(
									// 		'have.css',
									// 		'justify-content',
									// 		'flex-start'
									// 	)
									// 	.realMouseUp();
								});
							}
						);
					}
				);
			});
		});
	});

	describe('Master -> Normal -> InnerBlock -> update repeater attributes in multiple states and devices', () => {
		context('Inner -> Normal -> add box shadow item and set blur', () => {
			beforeEach(() => {
				initialSetting();
				setInnerBlock('Link');

				cy.getByAriaLabel('Add New Box Shadow').click();
				// Set blur
				cy.getByDataTest('box-shadow-blur-input').type(`{selectall}20`);

				// Alias
				cy.getParentContainer('Box Shadows').as('box-shadow-container');

				// Reselect
				reSelectBlock();
				setInnerBlock('Link');

				// Assert control value
				cy.get('@box-shadow-container').within(() => {
					cy.getByDataCy('group-control-header')
						.should('have.length', '1')
						.and('include.text', '20');
				});
			});

			context('Inner -> Hover -> set x', () => {
				beforeEach(() => {
					addBlockState('hover');

					cy.get('@box-shadow-container').within(() => {
						// normal state updates should display
						cy.getByDataCy('group-control-header').should(
							'have.length',
							'1'
						);
					});

					// set x
					cy.openRepeaterItem('Box Shadows', 'Outer');
					// alias
					cy.getByDataTest('popover-body').as('box-shadow-popover');
					cy.get('@box-shadow-popover').within(() => {
						// normal state updates should display
						cy.getByDataTest('box-shadow-blur-input').should(
							'have.value',
							'20'
						);

						cy.getByDataTest('box-shadow-x-input').type(
							`{selectall}5`
						);
					});

					// Reselect
					reSelectBlock();
					setInnerBlock('Link');

					// Assert control value
					cy.openRepeaterItem('Box Shadows', 'Outer');
					cy.get('@box-shadow-popover').within(() => {
						cy.getByDataTest('box-shadow-x-input').should(
							'have.value',
							'5'
						);
					});
				});

				context('Inner -> Active -> set new item', () => {
					beforeEach(() => {
						addBlockState('active');

						cy.get('@box-shadow-container').within(() => {
							// normal state updates should display
							cy.getByDataCy('group-control-header').should(
								'have.length',
								'1'
							);
						});

						// hover state updates should not display
						cy.openRepeaterItem('Box Shadows', 'Outer');
						cy.get('@box-shadow-popover').within(() => {
							cy.getByDataTest('box-shadow-x-input').should(
								'not.have.value',
								'5'
							);

							// normal state updates should display
							cy.getByDataTest('box-shadow-blur-input').should(
								'have.value',
								'20'
							);
						});

						// Set data
						cy.getByAriaLabel('Add New Box Shadow').click();
						cy.get('@box-shadow-popover')
							.last()
							.within(() => {
								cy.getByAriaLabel('Inner').click();
							});

						// Reselect
						reSelectBlock();
						setInnerBlock('Link');

						// Assert control value
						checkCurrentState('active');
						cy.get('@box-shadow-container').within(() => {
							cy.getByDataCy('group-control-header').should(
								'have.length',
								'2'
							);
						});

						cy.openRepeaterItem('Box Shadows', 'Inner');
						cy.get('@box-shadow-popover').within(() => {
							cy.getByAriaLabel('Inner').should(
								'have.attr',
								'aria-checked',
								'true'
							);
						});
					});

					context('Inner -> Active -> Tablet -> set y', () => {
						beforeEach(() => {
							setDeviceType('Tablet');

							// normal state updates should display
							cy.get('@box-shadow-container').within(() => {
								cy.getByDataCy('group-control-header')
									.should('have.length', '1')
									.and('include.text', 'Outer');
							});

							cy.openRepeaterItem('Box Shadows', 'Outer');
							cy.get('@box-shadow-popover').within(() => {
								// hover state updates should not display
								cy.getByDataTest('box-shadow-x-input').should(
									'not.have.value',
									'5'
								);

								// normal state updates should display
								cy.getByDataTest(
									'box-shadow-blur-input'
								).should('have.value', '20');

								// Set y
								cy.getByDataTest('box-shadow-y-input').type(
									'{selectall}50'
								);
							});

							// Reselect
							reSelectBlock();
							setInnerBlock('Link');

							// Assert control value
							checkCurrentState('active');

							cy.openRepeaterItem('Box Shadows', 'Outer');
							cy.get('@box-shadow-popover').within(() => {
								cy.getByDataTest(
									'box-shadow-blur-input'
								).should('have.value', '20');

								cy.getByDataTest('box-shadow-x-input').should(
									'have.value',
									'10'
								);

								cy.getByDataTest('box-shadow-y-input').should(
									'have.value',
									'50'
								);
							});
						});

						context(
							'Inner -> Tablet -> Normal -> set blur and spread',
							() => {
								beforeEach(() => {
									setBlockState('Normal');

									// should display only laptop / normal value
									cy.get('@box-shadow-container').within(
										() => {
											cy.getByDataCy(
												'group-control-header'
											)
												.should('have.length', '1')
												.and('include.text', 'Outer');
										}
									);
									cy.openRepeaterItem('Box Shadows', 'Outer');
									cy.get('@box-shadow-popover').within(() => {
										cy.getByDataTest(
											'box-shadow-blur-input'
										).should('have.value', '20');

										cy.getByDataTest(
											'box-shadow-x-input'
										).should('have.value', '10');
										cy.getByDataTest(
											'box-shadow-y-input'
										).should('have.value', '10');

										// Set blur
										cy.getByDataTest(
											'box-shadow-blur-input'
										).type('{selectall}30');

										// Set spread
										cy.getByDataTest(
											'box-shadow-spread-input'
										).type('{selectall}40');
									});
								});

								it('should control value and attributes be correct, when navigate between states and devices', () => {
									// Assert block css (normal/tablet)
									//TODO:
									// getWpDataObject().then((data) => {
									// 	cy.getIframeBody()
									// 		.find(
									// 			`#block-${getBlockClientId(
									// 				data
									// 			)} a`
									// 		)
									// 		.should(
									// 			'have.css',
									// 			'box-shadow',
									// 			'rgba(0, 0, 0, 0.67) 10px 10px 30px 40px'
									// 		);

									// 		// Real active
									// 		cy.getIframeBody()
									// 			.find(`#block-${getBlockClientId(data)} a`)
									// 			.realMouseDown();
									// 		cy.getIframeBody()
									// 			.find(
									// 				`#block-${getBlockClientId(
									// 					data
									// 				)} a:active`
									// 			)
									// 			.should(
									// 				'have.css',
									// 				'box-shadow',
									// 				'rgba(0, 0, 0, 0.67) 10px 50px 30px 40px'
									// 			);
									// 	});
									// });

									// Change to hover state (hover/tablet)
									setBlockState('Hover');

									// Assert control
									cy.openRepeaterItem('Box Shadows', 'Outer');
									cy.get('@box-shadow-popover').within(() => {
										// value displaying flow -> normal / tablet -> normal / laptop
										// should display  normal / tablet value here
										cy.getByDataTest(
											'box-shadow-x-input'
										).should('have.value', '10');

										cy.getByDataTest(
											'box-shadow-y-input'
										).should('have.value', '10');

										cy.getByDataTest(
											'box-shadow-blur-input'
										).should('have.value', '30');

										cy.getByDataTest(
											'box-shadow-spread-input'
										).should('have.value', '40');
									});

									// Change to active state (active/tablet)
									setBlockState('Active');

									// Assert block css (active/tablet)
									//TODO:
									// getWPDataObject().then((data) => {
									// 	cy.getIframeBody()
									// 		.find(`#block-${getBlockClientId(data)} a`)
									// 		.should(
									// 			'have.css',
									// 			'box-shadow',
									// 			'rgba(0, 0, 0, 0.67) 10px 50px 30px 40px'
									// 		);

									// 	// Real active
									// 	cy.getIframeBody()
									// 		.find(`#block-${getBlockClientId(data)} a`)
									// 		.realMouseDown();
									// 	cy.getIframeBody()
									// 		.find(
									// 			`#block-${getBlockClientId(
									// 				data
									// 			)} a:active`
									// 		)
									// 		.should(
									// 			'have.css',
									// 			'box-shadow',
									// 			'rgba(0, 0, 0, 0.67) 10px 50px 30px 40px'
									// 		);
									// });

									// Assert control
									cy.openRepeaterItem('Box Shadows', 'Outer');
									cy.get('@box-shadow-popover').within(() => {
										// it has its own value
										cy.getByDataTest(
											'box-shadow-x-input'
										).should('have.value', '10');

										cy.getByDataTest(
											'box-shadow-y-input'
										).should('have.value', '50');

										cy.getByDataTest(
											'box-shadow-blur-input'
										).should('have.value', '20');

										cy.getByDataTest(
											'box-shadow-spread-input'
										).should('have.value', '0');
									});

									// Change to laptop device (active/laptop)
									setDeviceType('Laptop');

									// Assert control value
									cy.get('@box-shadow-container').within(
										() => {
											cy.getByDataCy(
												'group-control-header'
											).should('have.length', '2');
										}
									);

									cy.openRepeaterItem('Box Shadows', 'Outer');
									cy.get('@box-shadow-popover').within(() => {
										// overwrite normal/laptop value
										cy.getByDataTest(
											'box-shadow-x-input'
										).should('have.value', '10');

										cy.getByDataTest(
											'box-shadow-y-input'
										).should('have.value', '10');

										cy.getByDataTest(
											'box-shadow-blur-input'
										).should('have.value', '20');

										cy.getByDataTest(
											'box-shadow-spread-input'
										).should('have.value', '0');
									});

									cy.openRepeaterItem('Box Shadows', 'Inner');
									cy.get('@box-shadow-popover')
										.last()
										.within(() => {
											// default value
											cy.getByDataTest(
												'box-shadow-x-input'
											).should('have.value', '10');

											cy.getByDataTest(
												'box-shadow-y-input'
											).should('have.value', '10');

											cy.getByDataTest(
												'box-shadow-blur-input'
											).should('have.value', '10');

											cy.getByDataTest(
												'box-shadow-spread-input'
											).should('have.value', '0');
										});

									// Assert block css
									// TODO:
									getWPDataObject().then((data) => {
										cy.getIframeBody()
											.find(
												`#block-${getBlockClientId(
													data
												)} a`
											)
											.should(
												'have.css',
												'box-shadow',
												'rgba(0, 0, 0, 0.67) 10px 10px 20px 0px, rgba(0, 0, 0, 0.67) 10px 10px 10px 0px inset'
											);

										// Real active
										//TODO
										// cy.getIframeBody()
										// 	.find(
										// 		`#block-${getBlockClientId(
										// 			data
										// 		)} a`
										// 	)
										// 	.realMouseDown();
										// cy.getIframeBody()
										// 	.find(
										// 		`#block-${getBlockClientId(
										// 			data
										// 		)} a:active`
										// 	)
										// 	.should(
										// 		'have.css',
										// 		'box-shadow',
										// 		'rgba(0, 0, 0, 0.67) 10px 10px 20px 0px, rgba(0, 0, 0, 0.67) 10px 10px 10px 0px inset'
										// 	);
									});

									// Change to normal state (normal/laptop)
									setBlockState('Normal');

									// Assert control value
									cy.get('@box-shadow-container').within(
										() => {
											cy.getByDataCy(
												'group-control-header'
											).should('have.length', '1');
										}
									);

									cy.openRepeaterItem('Box Shadows', 'Outer');
									cy.get('@box-shadow-popover').within(() => {
										cy.getByDataTest(
											'box-shadow-x-input'
										).should('have.value', '10');

										cy.getByDataTest(
											'box-shadow-y-input'
										).should('have.value', '10');

										cy.getByDataTest(
											'box-shadow-blur-input'
										).should('have.value', '20');

										cy.getByDataTest(
											'box-shadow-spread-input'
										).should('have.value', '0');
									});

									// Assert block css
									getWPDataObject().then((data) => {
										cy.getIframeBody()
											.find(
												`#block-${getBlockClientId(
													data
												)} a`
											)
											.should(
												'have.css',
												'box-shadow',
												'rgba(0, 0, 0, 0.67) 10px 10px 20px 0px'
											);

										// when real hover and active in normal state : should their css generate

										// Real active
										//TODO:
										// cy.getIframeBody()
										// 	.find(
										// 		`#block-${getBlockClientId(
										// 			data
										// 		)} a`
										// 	)
										// 	.realMouseDown();
										// cy.getIframeBody()
										// 	.find(
										// 		`#block-${getBlockClientId(
										// 			data
										// 		)} a:active`
										// 	)
										// 	.should(
										// 		'have.css',
										// 		'box-shadow',
										// 		'rgba(0, 0, 0, 0.67) 10px 10px 20px 0px, rgba(0, 0, 0, 0.67) 10px 10px 10px 0px inset'
										// 	)
										// 	.realMouseUp();

										// Real hover
										cy.getIframeBody()
											.find(
												`#block-${getBlockClientId(
													data
												)} a`
											)
											.realHover();
										cy.getIframeBody()
											.find(
												`#block-${getBlockClientId(
													data
												)} a:hover`
											)
											.should(
												'have.css',
												'box-shadow',
												'rgba(0, 0, 0, 0.67) 5px 10px 20px 0px'
											)
											.realMouseUp();
									});

									// Change to hover state (hover/laptop)
									setBlockState('Hover');

									// Assert control
									cy.get('@box-shadow-container').within(
										() => {
											cy.getByDataCy(
												'group-control-header'
											).should('have.length', '1');
										}
									);
									cy.openRepeaterItem('Box Shadows', 'Outer');
									cy.get('@box-shadow-popover').within(() => {
										cy.getByDataTest(
											'box-shadow-x-input'
										).should('have.value', '5');

										cy.getByDataTest(
											'box-shadow-y-input'
										).should('have.value', '10');

										cy.getByDataTest(
											'box-shadow-blur-input'
										).should('have.value', '20');

										cy.getByDataTest(
											'box-shadow-spread-input'
										).should('have.value', '0');
									});

									// Assert block css
									getWPDataObject().then((data) => {
										cy.getIframeBody()
											.find(
												`#block-${getBlockClientId(
													data
												)} a`
											)
											.should(
												'have.css',
												'box-shadow',
												'rgba(0, 0, 0, 0.67) 5px 10px 20px 0px'
											);

										// Real hover
										cy.getIframeBody()
											.find(
												`#block-${getBlockClientId(
													data
												)} a`
											)
											.realHover();
										cy.getIframeBody()
											.find(
												`#block-${getBlockClientId(
													data
												)} a:hover`
											)
											.should(
												'have.css',
												'box-shadow',
												'rgba(0, 0, 0, 0.67) 5px 10px 20px 0px'
											)
											.realMouseUp();
									});

									// Assert data store
									getWPDataObject().then((data) => {
										expect({
											laptop: { attributes: {} },
											tablet: {
												attributes: {
													publisherInnerBlocks: {
														link: {
															attributes: {
																publisherBoxShadow:
																	{
																		'outer-0':
																			{
																				type: 'outer',
																				x: '10px',
																				y: '10px',
																				blur: '30px',
																				spread: '40px',
																				color: '#000000ab',
																				isVisible: true,
																				order: 0,
																			},
																	},
																publisherBlockStates:
																	{
																		active: {
																			breakpoints:
																				{
																					tablet: {
																						attributes:
																							{
																								publisherBoxShadow:
																									{
																										'outer-0':
																											{
																												type: 'outer',
																												x: '10px',
																												y: '50px',
																												blur: '20px',
																												spread: '0px',
																												color: '#000000ab',
																												isVisible: true,
																												order: 0,
																											},
																									},
																							},
																					},
																				},
																		},
																	},
															},
														},
													},
												},
											},
										}).to.be.deep.eq(
											getSelectedBlock(
												data,
												'publisherBlockStates'
											).normal.breakpoints
										);

										expect({
											link: {
												attributes: {
													publisherBoxShadow: {
														'outer-0': {
															type: 'outer',
															x: '10px',
															y: '10px',
															blur: '20px',
															spread: '0px',
															color: '#000000ab',
															isVisible: true,
															order: 0,
														},
													},
													publisherBlockStates: {
														normal: {
															breakpoints: {
																laptop: {
																	attributes:
																		{},
																},
															},
															isVisible: true,
														},
														hover: {
															breakpoints: {
																laptop: {
																	attributes:
																		{
																			publisherBoxShadow:
																				{
																					'outer-0':
																						{
																							type: 'outer',
																							x: '5px',
																							y: '10px',
																							blur: '20px',
																							spread: '0px',
																							color: '#000000ab',
																							isVisible: true,
																							order: 0,
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
																	attributes:
																		{
																			publisherBoxShadow:
																				{
																					'outer-0':
																						{
																							type: 'outer',
																							x: '10px',
																							y: '10px',
																							blur: '20px',
																							spread: '0px',
																							color: '#000000ab',
																							isVisible: true,
																							order: 0,
																						},
																					'inner-0':
																						{
																							type: 'inner',
																							x: '10px',
																							y: '10px',
																							blur: '10px',
																							spread: '0px',
																							color: '#000000ab',
																							isVisible: true,
																							order: 1,
																						},
																				},
																		},
																},
															},
															isVisible: true,
														},
													},
												},
											},
										}).to.be.deep.eq(
											getSelectedBlock(
												data,
												'publisherInnerBlocks'
											)
										);
									});

									// frontend
									//TODO
									savePage();

									redirectToFrontPage();

									// Assert in default viewport
									cy.viewport(1025, 1440);
									//TODO:
									// cy.get('.my-link').should(
									// 	'have.css',
									// 	'box-shadow',
									// 	'rgba(0, 0, 0, 0.67) 10px 10px 20px 0px'
									// );

									// Hover
									cy.get('.my-link').realHover();
									cy.get('.my-link')
										.should(
											'have.css',
											'box-shadow',
											'rgba(0, 0, 0, 0.67) 5px 10px 20px 0px'
										)
										.realMouseUp();

									// Active
									cy.get('.my-link').realMouseDown();
									cy.get('.my-link')
										.should(
											'have.css',
											'box-shadow',
											'rgba(0, 0, 0, 0.67) 10px 10px 20px 0px, rgba(0, 0, 0, 0.67) 10px 10px 10px 0px inset'
										)
										.realMouseUp();

									cy.go('back');

									// Set desktop viewport
									cy.viewport(1441, 1920);
									//TODO:
									// cy.get('.my-link').should(
									// 	'have.css',
									// 	'box-shadow',
									// 	'rgba(0, 0, 0, 0.67) 10px 10px 20px 0px'
									// );

									// Hover
									// cy.get('.my-link').realHover();
									// cy.get('.my-link')
									// 	.should(
									// 		'have.css',
									// 		'box-shadow',
									// 		'rgba(0, 0, 0, 0.67) 5px 10px 20px 0px'
									// 	)
									// 	.realMouseUp();

									// Active
									// cy.get('.my-link').realMouseDown();
									// cy.get('.my-link')
									// 	.should(
									// 		'have.css',
									// 		'box-shadow',
									// 		'rgba(0, 0, 0, 0.67) 10px 10px 20px 0px, rgba(0, 0, 0, 0.67) 10px 10px 10px 0px inset'
									// 	)
									// 	.realMouseUp();

									//	cy.go('back');

									//  set tablet viewport
									cy.viewport(768, 1024);
									// cy.get('.my-link').should(
									// 	'have.css',
									// 	'box-shadow',
									// 	'rgba(0, 0, 0, 0.67) 10px 10px 30px 40px'
									// );

									// // Hover
									// cy.get('.my-link').realHover();
									// cy.get('.my-link')
									// 	.should(
									// 		'have.css',
									// 		'box-shadow',
									// 		'rgba(0, 0, 0, 0.67) 10px 10px 30px 40px'
									// 	)
									// 	.realMouseUp();

									// // Active
									// cy.get('.my-link').realMouseDown();
									// cy.get('.my-link')
									// 	.should(
									// 		'have.css',
									// 		'box-shadow',
									// 		'rgba(0, 0, 0, 0.67) 10px 50px 20px 0px'
									// 	)
									// 	.realMouseUp();

									// cy.go('back');

									// Set mobile viewport (must inherit styles)
									// cy.viewport(380, 470);

									// cy.get('.my-link').should(
									// 	'have.css',
									// 	'box-shadow',
									// 	'rgba(0, 0, 0, 0.67) 10px 10px 30px 40px'
									// );

									// // Hover
									// cy.get('.my-link').realHover();
									// cy.get('.my-link')
									// 	.should(
									// 		'have.css',
									// 		'box-shadow',
									// 		'rgba(0, 0, 0, 0.67) 10px 10px 30px 40px'
									// 	)
									// 	.realMouseUp();

									// // Active
									// cy.get('.my-link').realMouseDown();
									// cy.get('.my-link')
									// 	.should(
									// 		'have.css',
									// 		'box-shadow',
									// 		'rgba(0, 0, 0, 0.67) 10px 50px 20px 0px'
									// 	)
									// 	.realMouseUp();
								});
							}
						);
					});
				});
			});
		});
	});

	describe('Master -> Pseudo State(hover) -> InnerBlock', () => {
		beforeEach(() => {
			initialSetting();
			addBlockState('hover');
			setInnerBlock('Link');
		});
		it('Normal -> default breakpoint(laptop)', () => {
			//
			checkBlockCard(['Hover', 'Link']);

			// Set font-size
			cy.setInputFieldValue('Font Size', 'Typography', 25);

			// reselect
			reSelectBlock();
			setInnerBlock('Link');

			// Assert control value
			cy.checkInputFieldValue('Font Size', 'Typography', 25);

			// Assert block css : inner
			//TODO : recheck
			// getWPDataObject().then((data) => {
			// 	cy.getIframeBody()
			// 		.find(`#block-${getBlockClientId(data)}:hover a`)
			// 		.should('have.css', 'font-size', '25px');
			// });

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					publisherInnerBlocks: {
						link: {
							attributes: {
								publisherFontSize: '25px',
							},
						},
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates').hover
						.breakpoints.laptop.attributes
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			// default viewport(laptop)
			cy.viewport(1025, 1440);

			// TODO :
			// real hover
			cy.get('.publisher-core-block').realHover();
			cy.get('.my-link').should('have.css', 'font-size', '25px');

			// Set desktop viewport
			cy.viewport(1441, 1920);

			// cy.get('.publisher-core-block').realHover();
			// cy.get('.my-link').should('have.css', 'font-size', '25px');

			//  set Tablet viewport
			cy.viewport(768, 1024);
			//TODO
			// cy.get('.publisher-core-block').realHover();
			// cy.get('.my-link').should('have.css', 'font-size', '25px');
		});

		it('Normal -> mobile breakpoint', () => {
			//
			checkBlockCard(['Hover', 'Link']);

			setDeviceType('Mobile');
			// Set font-size
			cy.setInputFieldValue('Font Size', 'Typography', 25);

			// reselect
			reSelectBlock();
			setInnerBlock('Link');

			// Assert control value
			cy.checkInputFieldValue('Font Size', 'Typography', 25);

			// Assert block css : inner
			//TODO : recheck
			// getWPDataObject().then((data) => {
			// 	cy.getIframeBody()
			// 		.find(`#block-${getBlockClientId(data)}:hover a`)
			// 		.should('have.css', 'font-size', '25px');
			// });

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					publisherInnerBlocks: {
						link: {
							attributes: {
								publisherFontSize: '25px',
							},
						},
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates').hover
						.breakpoints.mobile.attributes
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			// default viewport(laptop)
			cy.viewport(1025, 1440);

			// real hover
			cy.get('.publisher-core-block').realHover();
			cy.get('.my-link').should('not.have.css', 'font-size', '25px');

			// Set desktop viewport
			cy.viewport(1441, 1920);

			cy.get('.publisher-core-block').realHover();
			cy.get('.my-link').should('not.have.css', 'font-size', '25px');

			//  set mobile viewport
			cy.viewport(320, 480);
			//TODO
			// cy.get('.publisher-core-block').realHover();
			// cy.get('.my-link').should('have.css', 'font-size', '25px');
		});

		it('Hover -> default breakpoint', () => {
			addBlockState('hover');

			//
			checkBlockCard(['Hover', 'Link', 'Hover']);

			// Set font-size
			cy.setInputFieldValue('Font Size', 'Typography', 25);

			// reselect
			reSelectBlock();
			setInnerBlock('Link');

			// Assert control value
			cy.checkInputFieldValue('Font Size', 'Typography', 25);
			checkCurrentState('hover');

			// Assert block css : inner
			//TODO: recheck assertion flow
			getWPDataObject().then((data) => {
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should('have.css', 'font-size', '25px');

				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}`)
					.realHover();
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}:hover a`)
					.realHover();

				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}:hover a:hover`)
					.should('have.css', 'font-size', '25px');
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					publisherInnerBlocks: {
						link: {
							attributes: {
								publisherBlockStates: {
									hover: {
										breakpoints: {
											laptop: {
												attributes: {
													publisherFontSize: '25px',
												},
											},
										},
										isVisible: true,
									},
									normal: {
										breakpoints: {
											laptop: {
												attributes: {},
											},
										},
										isVisible: true,
									},
								},
							},
						},
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates').hover
						.breakpoints.laptop.attributes
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			// default viewport(laptop)
			cy.viewport(1025, 1440);

			// TODO :
			// real hover
			// cy.get('.publisher-core-block').realHover();
			// cy.get('.my-link')
			// 	.realHover()
			// 	.should('have.css', 'font-size', '25px');

			// // Set desktop viewport
			// cy.viewport(1441, 1920);

			// cy.get('.publisher-core-block').realHover();
			// cy.get('.my-link')
			// 	.realHover()
			// 	.should('have.css', 'font-size', '25px');

			// //  set Tablet viewport
			// cy.viewport(768, 1024);
			// //TODO
			// cy.get('.publisher-core-block').realHover();
			// cy.get('.my-link')
			// 	.realHover()
			// 	.should('have.css', 'font-size', '25px');
		});

		it.only('Hover -> mobile breakpoint', () => {
			addBlockState('hover');
			setDeviceType('Mobile');

			//
			checkBlockCard(['Hover', 'Link', 'Hover']);

			// Set font-size
			cy.setInputFieldValue('Font Size', 'Typography', 25);

			// reselect
			reSelectBlock();
			setInnerBlock('Link');

			// Assert control value
			cy.checkInputFieldValue('Font Size', 'Typography', 25);
			checkCurrentState('hover');

			// Assert block css : inner
			//TODO: recheck assertion flow
			getWPDataObject().then((data) => {
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should('have.css', 'font-size', '25px');

				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}`)
					.realHover();
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}:hover a`)
					.realHover();

				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)}:hover a:hover`)
					.should('have.css', 'font-size', '25px');
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					publisherInnerBlocks: {
						link: {
							attributes: {
								publisherBlockStates: {
									hover: {
										breakpoints: {
											mobile: {
												attributes: {
													publisherFontSize: '25px',
												},
											},
										},
										isVisible: true,
									},
									normal: {
										breakpoints: {
											laptop: {
												attributes: {},
											},
										},
										isVisible: true,
									},
								},
							},
						},
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherBlockStates').hover
						.breakpoints.mobile.attributes
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			// default viewport(laptop)
			cy.viewport(1025, 1440);

			// real hover
			cy.get('.publisher-core-block').realHover();
			cy.get('.my-link')
				.realHover()
				.should('not.have.css', 'font-size', '25px');

			// Set desktop viewport
			cy.viewport(1441, 1920);

			cy.get('.publisher-core-block').realHover();
			cy.get('.my-link')
				.realHover()
				.should('not.have.css', 'font-size', '25px');

			//   set mobile viewport
			cy.viewport(320, 480);
			// TODO
			// cy.get('.publisher-core-block').realHover();
			// cy.get('.my-link')
			// 	.realHover()
			// 	.should('have.css', 'font-size', '25px');
		});
		// 	describe('multiple', () => {});
		// 	describe('multiple repeater', () => {});
	});

	describe('ValueCleanup', () => {
		it('should not have extra breakpoints and attributes in saved data', () => {
			initialSetting();
			setInnerBlock('Link');
			addBlockState('hover');
			cy.getByAriaLabel('Input Width').type(100, { force: true });

			// Assert store
			getWPDataObject().then((data) => {
				expect(1).to.be.equal(
					Object.keys(
						getSelectedBlock(data, 'publisherInnerBlocks').link
							.attributes
					).length
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'publisherInnerBlocks').link
						.attributes.publisherBlockStates.hover.breakpoints
						.tablet
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'publisherInnerBlocks').link
						.attributes.publisherBlockStates.hover.breakpoints
						.laptop.attributes.publisherHeight
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
					getSelectedBlock(data, 'publisherInnerBlocks').link
						.attributes.publisherBlockStates
				);
			});
		});
	});

	describe('switch block and reload', () => {
		context('add block -> go to inner -> switch state to hover', () => {
			beforeEach(() => {
				initialSetting();
				setInnerBlock('Link');
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
					setInnerBlock('Link');

					checkCurrentState('hover');
				});

				it('should current state be normal, when reload', () => {
					cy.reload();

					cy.getIframeBody()
						.find('[data-type="core/paragraph"]')
						.eq(0)
						.click();

					setInnerBlock('Link');

					checkCurrentState('normal');
				});
			});
		});
	});
});

// test cases:
// master update should not show in inner
// invisible should not create style
