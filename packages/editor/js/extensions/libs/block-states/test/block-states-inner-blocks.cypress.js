/**
 * External dependencies
 */
import 'cypress-real-events';

/**
 * Blockera dependencies
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
	checkBlockCard,
} from '@blockera/dev-cypress/js/helpers';

describe('Inner Blocks E2E Test', () => {
	beforeEach(() => {
		createPost();
		cy.viewport(1440, 1025);
	});

	const initialSetting = () => {
		appendBlocks(
			`<!-- wp:paragraph {"className":"blockera-block blockera-block-10bb7854-c3bc-45cd-8202-b6b7c36c6b74","blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"blockeraPropsId":"224185412280","blockeraCompatId":"224185412280"} -->
			<p class="blockera-block blockera-block-10bb7854-c3bc-45cd-8202-b6b7c36c6b74"><a href="http://localhost/wordpress/2023/12/16/5746/" data-type="post" data-id="5746" class="my-link">link</a></p>
			<!-- /wp:paragraph -->`
		);
		cy.getIframeBody().find('[data-type="core/paragraph"]').click();
	};

	describe('state-container', () => {
		it('Set the "Inner Blocks" color on the root of the container using CSS variables.', () => {
			initialSetting();
			setInnerBlock('Link');

			cy.cssVar(
				'--blockera-tab-panel-active-color',
				'[aria-label="Blockera Block State Container"]:first-child'
			).should('eq', '#cc0000');
		});

		it('Set the "third-party" state (Like: hover, active, etc) color on the root of the container using CSS variables.', () => {
			initialSetting();
			setInnerBlock('Link');
			addBlockState('hover');

			cy.cssVar(
				'--blockera-tab-panel-active-color',
				'[aria-label="Blockera Block State Container"]:first-child'
			).should('eq', '#D47C14');
		});

		it('should block state container title be correct', () => {
			initialSetting();
			setInnerBlock('Link');

			cy.getByAriaLabel('Blockera Block State Container')
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
				.should('have.class', 'blockera-not-allowed');
		});

		it('Set the current state when add new block states', () => {
			initialSetting();
			setInnerBlock('Link');
			checkBlockCard([
				{
					label: 'Link',
					type: 'Inner Block',
				},
			]);

			cy.getByAriaLabel('Add New State').click();

			checkCurrentState('hover');
			checkBlockCard([
				{
					label: 'Link',
					type: 'Inner Block',
				},
				{
					label: 'Hover',
					type: 'State',
				},
			]);

			cy.getByAriaLabel('Add New State').click();

			checkCurrentState('active');
			checkBlockCard([
				{
					label: 'Link',
					type: 'Inner Block',
				},
				{
					label: 'active',
					type: 'State',
				},
			]);

			cy.getByAriaLabel('Add New State').click();

			checkCurrentState('focus');
			checkBlockCard([
				{
					label: 'Link',
					type: 'Inner Block',
				},
				{
					label: 'Hover',
					type: 'Focus',
				},
			]);
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
						getSelectedBlock(data, 'blockeraInnerBlocks').link
							.attributes.blockeraBlockStates
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
						getSelectedBlock(data, 'blockeraInnerBlocks').link
							.attributes.blockeraBlockStates
					)
				);
			});
		});
	});

	describe('master block updates should not display in inner blocks', () => {
		it('Master -> set width -> Inner', () => {
			initialSetting();

			// Set width
			cy.setInputFieldValue('Width', 'Size', 50);

			// Inner
			setInnerBlock('Link');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '');
		});

		it('Master -> Hover-> set width -> Inner', () => {
			initialSetting();
			addBlockState('hover');

			// Set width
			cy.setInputFieldValue('Width', 'Size', 50);

			// Inner
			setInnerBlock('Link');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '');
			addBlockState('hover');
			cy.checkInputFieldValue('Width', 'Size', '');
		});
	});

	describe('Master -> Normal -> InnerBlock -> Normal', () => {
		it('should set attr in innerBlocks root when default breakPoint', () => {
			initialSetting();
			setInnerBlock('Link');
			//
			checkBlockCard([
				{
					label: 'Link',
					type: 'Inner Block',
				},
			]);
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
							blockeraOverflow: 'hidden',
						},
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')
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
			checkBlockCard([
				{
					label: 'Link',
					type: 'Inner Block',
				},
			]);
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
					getSelectedBlock(data, 'blockeraInnerBlocks')
				);

				expect({
					blockeraInnerBlocks: {
						link: { attributes: { blockeraOverflow: 'hidden' } },
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').normal
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
			checkBlockCard([
				{
					label: 'Link',
					type: 'Inner Block',
				},
				{
					label: 'Hover',
					type: 'State',
				},
			]);

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
				expect({ blockeraOverflow: 'hidden' }).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks').link
						.attributes.blockeraBlockStates.hover.breakpoints.laptop
						.attributes
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
			checkBlockCard([
				{
					label: 'Link',
					type: 'Inner Block',
				},
				{
					label: 'Hover',
					type: 'State',
				},
			]);

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
				expect({ blockeraOverflow: 'hidden' }).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes.blockeraInnerBlocks.link
						.attributes.blockeraBlockStates.hover.breakpoints.tablet
						.attributes
				);

				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks').link
						.attributes.blockeraBlockStates.hover.breakpoints.laptop
						.attributes
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

							// normal state updates should display
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

								it('should control value and styles be correct, when navigate between states and devices', () => {
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
									// 				blockeraInnerBlocks: {
									// 					link: {
									// 						attributes: {
									// 							blockeraBlockStates:
									// 								{
									// 									active: {
									// 										breakpoints:
									// 											{
									// 												tablet: {
									// 													attributes:
									// 														{
									// 															blockeraFlexLayout:
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
									// 			'blockeraBlockStates'
									// 		).normal.breakpoints
									// 	);
									// });

									//TODO : active / laptop / direction is wrong
									// getWPDataObject().then((data) => {
									// 	expect({
									// 		link: {
									// 			attributes: {
									// 				blockeraDisplay: 'flex',
									// 				blockeraBlockStates: {
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
									// 										blockeraFlexLayout:
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
									// 										blockeraFlexLayout:
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
									// 			'blockeraInnerBlocks'
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
													blockeraInnerBlocks: {
														link: {
															attributes: {
																blockeraBoxShadow:
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
																blockeraBlockStates:
																	{
																		active: {
																			breakpoints:
																				{
																					tablet: {
																						attributes:
																							{
																								blockeraBoxShadow:
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
												'blockeraBlockStates'
											).normal.breakpoints
										);

										expect({
											link: {
												attributes: {
													blockeraBoxShadow: {
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
													blockeraBlockStates: {
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
																			blockeraBoxShadow:
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
																			blockeraBoxShadow:
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
												'blockeraInnerBlocks'
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
			checkBlockCard([
				{
					label: 'Hover',
					type: 'State',
				},
				{
					label: 'Link',
					type: 'Inner Block',
				},
			]);

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
					blockeraInnerBlocks: {
						link: {
							attributes: {
								blockeraFontSize: '25px',
							},
						},
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
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
			cy.get('.blockera-block').realHover();
			cy.get('.my-link').should('have.css', 'font-size', '25px');

			// Set desktop viewport
			cy.viewport(1441, 1920);

			// cy.get('.blockera-block').realHover();
			// cy.get('.my-link').should('have.css', 'font-size', '25px');

			//  set Tablet viewport
			cy.viewport(768, 1024);
			//TODO
			// cy.get('.blockera-block').realHover();
			// cy.get('.my-link').should('have.css', 'font-size', '25px');
		});

		it('Normal -> mobile breakpoint', () => {
			//
			checkBlockCard([
				{
					label: 'Hover',
					type: 'State',
				},
				{
					label: 'Link',
					type: 'Inner Block',
				},
			]);

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
					blockeraInnerBlocks: {
						link: {
							attributes: {
								blockeraFontSize: '25px',
							},
						},
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.mobile.attributes
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			// default viewport(laptop)
			cy.viewport(1025, 1440);

			// real hover
			cy.get('.blockera-block').realHover();
			cy.get('.my-link').should('not.have.css', 'font-size', '25px');

			// Set desktop viewport
			cy.viewport(1441, 1920);

			cy.get('.blockera-block').realHover();
			cy.get('.my-link').should('not.have.css', 'font-size', '25px');

			//  set mobile viewport
			cy.viewport(320, 480);
			//TODO
			// cy.get('.blockera-block').realHover();
			// cy.get('.my-link').should('have.css', 'font-size', '25px');
		});

		it('Hover -> default breakpoint', () => {
			addBlockState('hover');

			//
			checkBlockCard([
				{
					label: 'Hover',
					type: 'State',
				},
				{
					label: 'Link',
					type: 'Inner Block',
				},
				{
					label: 'Hover',
					type: 'State',
				},
			]);

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
					blockeraInnerBlocks: {
						link: {
							attributes: {
								blockeraBlockStates: {
									hover: {
										breakpoints: {
											laptop: {
												attributes: {
													blockeraFontSize: '25px',
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
					getSelectedBlock(data, 'blockeraBlockStates').hover
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
			// cy.get('.blockera-block').realHover();
			// cy.get('.my-link')
			// 	.realHover()
			// 	.should('have.css', 'font-size', '25px');

			// // Set desktop viewport
			// cy.viewport(1441, 1920);

			// cy.get('.blockera-block').realHover();
			// cy.get('.my-link')
			// 	.realHover()
			// 	.should('have.css', 'font-size', '25px');

			// //  set Tablet viewport
			// cy.viewport(768, 1024);
			// //TODO
			// cy.get('.blockera-block').realHover();
			// cy.get('.my-link')
			// 	.realHover()
			// 	.should('have.css', 'font-size', '25px');
		});

		it('Hover -> mobile breakpoint', () => {
			addBlockState('hover');
			setDeviceType('Mobile');

			//
			checkBlockCard([
				{
					label: 'Hover',
					type: 'State',
				},
				{
					label: 'Link',
					type: 'Inner Block',
				},
				{
					label: 'Hover',
					type: 'State',
				},
			]);

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
					blockeraInnerBlocks: {
						link: {
							attributes: {
								blockeraBlockStates: {
									hover: {
										breakpoints: {
											mobile: {
												attributes: {
													blockeraFontSize: '25px',
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
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.mobile.attributes
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			// default viewport(laptop)
			cy.viewport(1025, 1440);

			// real hover
			cy.get('.blockera-block').realHover();
			cy.get('.my-link')
				.realHover()
				.should('not.have.css', 'font-size', '25px');

			// Set desktop viewport
			cy.viewport(1441, 1920);

			cy.get('.blockera-block').realHover();
			cy.get('.my-link')
				.realHover()
				.should('not.have.css', 'font-size', '25px');

			//   set mobile viewport
			cy.viewport(320, 480);
			// TODO
			// cy.get('.blockera-block').realHover();
			// cy.get('.my-link')
			// 	.realHover()
			// 	.should('have.css', 'font-size', '25px');
		});

		describe('update attributes in multiple states and devices', () => {
			context('Normal -> set border radius', () => {
				beforeEach(() => {
					cy.setInputFieldValue('Radius', 'Border And Shadow', 5);

					// Reselect
					reSelectBlock();
					setInnerBlock('Link');

					// Assert Control
					cy.checkInputFieldValue('Radius', 'Border And Shadow', 5);
				});

				context('Hover -> set custom radius', () => {
					beforeEach(() => {
						addBlockState('hover');
						//
						checkBlockCard([
							{
								label: 'Hover',
								type: 'State',
							},
							{
								label: 'Link',
								type: 'Inner Block',
							},
							{
								label: 'Hover',
								type: 'State',
							},
						]);

						// Normal state updates should display
						cy.checkInputFieldValue(
							'Radius',
							'Border And Shadow',
							5
						);

						// Set
						cy.getByAriaLabel('Custom Border Radius').click();
						cy.getParentContainer('Radius').within(() => {
							// Top Left
							cy.get('input[type="number"]')
								.eq(0)
								.type('{selectall}10');
						});

						// Reselect
						reSelectBlock();
						setInnerBlock('Link');

						// Assert Control
						checkCurrentState('hover');
						cy.getParentContainer('Radius').as('radius-container');
						cy.get('@radius-container').within(() => {
							// Top Left
							cy.get('input[type="number"]')
								.eq(0)
								.should('have.value', 10);
							cy.get('input[type="number"]')
								.eq(1)
								.should('have.value', 5);
							cy.get('input[type="number"]')
								.eq(2)
								.should('have.value', 5);
							cy.get('input[type="number"]')
								.eq(3)
								.should('have.value', 5);
						});
					});

					context('Focus -> update border radius', () => {
						beforeEach(() => {
							addBlockState('Focus');
							//
							checkBlockCard([
								{
									label: 'Hover',
									type: 'State',
								},
								{
									label: 'Link',
									type: 'Inner Block',
								},
								{
									label: 'Focus',
									type: 'State',
								},
							]);

							// Normal state updates should display
							cy.checkInputFieldValue(
								'Radius',
								'Border And Shadow',
								5
							);

							// Hover state updates should not display
							cy.get('@radius-container').within(() => {
								cy.get('input[type="number"]').should(
									'have.length',
									1
								);
							});

							// Set
							cy.setInputFieldValue(
								'Radius',
								'Border And Shadow',
								15,
								true
							);

							// Reselect
							reSelectBlock();
							setInnerBlock('Link');

							// Assert control
							checkCurrentState('focus');
							cy.checkInputFieldValue(
								'Radius',
								'Border And Shadow',
								15
							);
						});

						context(
							'Hover -> mobile -> update border radius ',
							() => {
								beforeEach(() => {
									setBlockState('Hover');
									setDeviceType('Mobile');
									// TODO : remove next line after fix related bug: master -> hover -> inner -> hover -> change device -> current state ?????
									setBlockState('Hover');
									//
									checkBlockCard([
										{
											label: 'Hover',
											type: 'State',
										},
										{
											label: 'Link',
											type: 'Inner Block',
										},
										{
											label: 'Hover',
											type: 'State',
										},
									]);

									// should not display any value
									cy.checkInputFieldValue(
										'Radius',
										'Border And Shadow',
										''
									);

									// Hover state updates should not display
									cy.get('@radius-container').within(() => {
										cy.get('input[type="number"]').should(
											'have.length',
											1
										);
									});

									// Set
									cy.setInputFieldValue(
										'Radius',
										'Border And Shadow',
										20
									);

									// Reselect
									reSelectBlock();
									setInnerBlock('Link');

									// Assert control
									checkCurrentState('hover');
									cy.checkInputFieldValue(
										'Radius',
										'Border And Shadow',
										20
									);
								});

								context(
									'Mobile -> Normal -> set custom radius',
									() => {
										beforeEach(() => {
											setBlockState('Normal');
											//
											checkBlockCard([
												{
													label: 'Hover',
													type: 'State',
												},
												{
													label: 'Link',
													type: 'Inner Block',
												},
											]);

											// Should not display any value
											cy.checkInputFieldValue(
												'Radius',
												'Border And Shadow',
												''
											);

											// Hover state updates should not display
											cy.get('@radius-container').within(
												() => {
													cy.get(
														'input[type="number"]'
													).should('have.length', 1);
												}
											);

											// Set
											cy.getByAriaLabel(
												'Custom Border Radius'
											).click();
											cy.getParentContainer(
												'Radius'
											).within(() => {
												// Bottom Right
												cy.get('input[type="number"]')
													.eq(3)
													.type('{selectall}30');
											});

											// Reselect
											reSelectBlock();
											setInnerBlock('Link');

											// Assert Control
											checkCurrentState('normal');

											cy.get('@radius-container').within(
												() => {
													cy.get(
														'input[type="number"]'
													)
														.eq(0)
														.should(
															'have.value',
															''
														);
													cy.get(
														'input[type="number"]'
													)
														.eq(1)
														.should(
															'have.value',
															''
														);
													cy.get(
														'input[type="number"]'
													)
														.eq(2)
														.should(
															'have.value',
															''
														);
													cy.get(
														'input[type="number"]'
													)
														.eq(3)
														.should(
															'have.value',
															30
														);
												}
											);
										});

										it('should control value and styles be correct, when navigate between states and devices', () => {
											// (normal/mobile)
											// // Assert block css
											//	getWPDataObject().then((data) => {
											//TODO
											// cy.getIframeBody()
											// 	.find(
											// 		`#block-${getBlockClientId(
											// 			data
											// 		)} a`
											// 	)
											// 	.should(
											// 		'have.css',
											// 		'border-bottom-right-radius',
											// 		'30px'
											// 	);
											//Real hover
											// cy.getIframeBody()
											// 	.find(
											// 		`#block-${getBlockClientId(
											// 			data
											// 		)}`
											// 	)
											// 	.realHover();
											// cy.getIframeBody()
											// 	.find(
											// 		`#block-${getBlockClientId(
											// 			data
											// 		)}:hover a`
											// 	)
											// 	.should(
											// 		'have.css',
											// 		'border-bottom-right-radius',
											// 		'30px'
											// 	);
											//	});

											// Change to focus state
											setBlockState('Focus');

											// (focus/mobile)
											// Assert control value (display normal/mobile value)
											cy.get('@radius-container').within(
												() => {
													cy.get(
														'input[type="number"]'
													)
														.eq(0)
														.should(
															'have.value',
															''
														);
													cy.get(
														'input[type="number"]'
													)
														.eq(1)
														.should(
															'have.value',
															''
														);
													cy.get(
														'input[type="number"]'
													)
														.eq(2)
														.should(
															'have.value',
															''
														);
													cy.get(
														'input[type="number"]'
													)
														.eq(3)
														.should(
															'have.value',
															30
														);
												}
											);

											// No need to assert block css, no attribute updated

											// Change to hover state
											setBlockState('Hover');

											// (hover/mobile)
											// Assert control value
											cy.checkInputFieldValue(
												'Radius',
												'Border And Shadow',
												20
											);

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
														'border-radius',
														'20px'
													);

												//Real hover
												cy.getIframeBody()
													.find(
														`#block-${getBlockClientId(
															data
														)}`
													)
													.realHover();
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
														)}:hover a:hover`
													)
													.should(
														'have.css',
														'border-radius',
														'20px'
													);
											});

											// Set device to default(laptop)
											setDeviceType('Laptop');
											// (hover/laptop)

											// Assert control
											cy.get('@radius-container').within(
												() => {
													cy.get(
														'input[type="number"]'
													)
														.eq(0)
														.should(
															'have.value',
															10
														);
													cy.get(
														'input[type="number"]'
													)
														.eq(1)
														.should(
															'have.value',
															5
														);
													cy.get(
														'input[type="number"]'
													)
														.eq(2)
														.should(
															'have.value',
															5
														);
													cy.get(
														'input[type="number"]'
													)
														.eq(3)
														.should(
															'have.value',
															5
														);
												}
											);

											// Assert block css
											//getWPDataObject().then((data) => {
											//TODO
											// cy.getIframeBody()
											// 	.find(
											// 		`#block-${getBlockClientId(
											// 			data
											// 		)} a`
											// 	)
											// 	.should(
											// 		'have.css',
											// 		'border-radius',
											// 		'10px 5px 5px 5px'
											// 	);
											//Real hover
											// cy.getIframeBody()
											// 	.find(
											// 		`#block-${getBlockClientId(
											// 			data
											// 		)}`
											// 	)
											// 	.realHover();
											// cy.getIframeBody()
											// 	.find(
											// 		`#block-${getBlockClientId(
											// 			data
											// 		)} a`
											// 	)
											// 	.realHover();
											// cy.getIframeBody()
											// 	.find(
											// 		`#block-${getBlockClientId(
											// 			data
											// 		)}:hover a:hover`
											// 	)
											// 	.should(
											// 		'have.css',
											// 		'border-radius',
											// 		'10px 5px 5px 5px'
											// 	);
											//});

											// Change state to normal
											// (normal/laptop)
											setBlockState('Normal');

											// Assert control
											cy.checkInputFieldValue(
												'Radius',
												'Border And Shadow',
												5
											);

											// Assert block css
											//getWPDataObject().then((data) => {
											//TODO
											// cy.getIframeBody()
											// 	.find(
											// 		`#block-${getBlockClientId(
											// 			data
											// 		)} a`
											// 	)
											// 	.should(
											// 		'have.css',
											// 		'border-radius',
											// 		'5px'
											// 	);
											// //Real hover
											// cy.getIframeBody()
											// 	.find(
											// 		`#block-${getBlockClientId(
											// 			data
											// 		)}`
											// 	)
											// 	.realHover();
											// cy.getIframeBody()
											// 	.find(
											// 		`#block-${getBlockClientId(
											// 			data
											// 		)}:hover a`
											// 	)
											// 	.should(
											// 		'have.css',
											// 		'border-radius',
											// 		'5px'
											// 	);
											//});

											// Change state to focus
											// (focus/laptop)
											setBlockState('Focus');

											// Assert control
											cy.checkInputFieldValue(
												'Radius',
												'Border And Shadow',
												15
											);

											// Assert block css
											//getWPDataObject().then((data) => {
											//TODO
											// cy.getIframeBody()
											// 	.find(
											// 		`#block-${getBlockClientId(
											// 			data
											// 		)} a`
											// 	)
											// 	.should(
											// 		'have.css',
											// 		'border-radius',
											// 		'15px'
											// 	);
											//Real hover
											// cy.getIframeBody()
											// 	.find(
											// 		`#block-${getBlockClientId(
											// 			data
											// 		)}`
											// 	)
											// 	.realHover();
											// // Focus
											// cy.getIframeBody()
											// 	.find(
											// 		`#block-${getBlockClientId(
											// 			data
											// 		)} a`
											// 	)
											// 	.focus();
											// cy.getIframeBody()
											// 	.find(
											// 		`#block-${getBlockClientId(
											// 			data
											// 		)}:hover a:focus`
											// 	)
											// 	.should(
											// 		'have.css',
											// 		'border-radius',
											// 		'15px'
											// 	);
											//});

											// Assert store data
											getWPDataObject().then((data) => {
												expect({
													laptop: {
														attributes: {
															blockeraInnerBlocks:
																{
																	link: {
																		attributes:
																			{
																				blockeraBorderRadius:
																					{
																						type: 'all',
																						all: '5px',
																					},
																				blockeraBlockStates:
																					{
																						focus: {
																							isVisible: true,
																							breakpoints:
																								{
																									laptop: {
																										attributes:
																											{
																												blockeraBorderRadius:
																													{
																														type: 'all',
																														all: '15px',
																													},
																											},
																									},
																								},
																						},
																						hover: {
																							isVisible: true,
																							breakpoints:
																								{
																									laptop: {
																										attributes:
																											{
																												blockeraBorderRadius:
																													{
																														type: 'custom',
																														all: '5px',
																														topLeft:
																															'10px',
																														topRight:
																															'5px',
																														bottomLeft:
																															'5px',
																														bottomRight:
																															'5px',
																													},
																											},
																									},
																									mobile: {
																										attributes:
																											{
																												blockeraBorderRadius:
																													{
																														type: 'all',
																														all: '20px',
																													},
																											},
																									},
																								},
																						},
																						normal: {
																							isVisible: true,
																							breakpoints:
																								{
																									laptop: {
																										attributes:
																											{},
																									},
																								},
																						},
																					},
																			},
																	},
																},
														},
													},
													mobile: {
														attributes: {
															blockeraInnerBlocks:
																{
																	link: {
																		attributes:
																			{
																				blockeraBorderRadius:
																					{
																						type: 'custom',
																						all: '',
																						topLeft:
																							'',
																						topRight:
																							'',
																						bottomLeft:
																							'',
																						bottomRight:
																							'30px',
																					},
																				blockeraBlockStates:
																					{
																						focus: {
																							breakpoints:
																								{
																									laptop: {
																										attributes:
																											{
																												blockeraBorderRadius:
																													{
																														type: 'all',
																														all: '15px',
																													},
																											},
																									},
																								},
																							isVisible: true,
																						},
																						hover: {
																							breakpoints:
																								{
																									laptop: {
																										attributes:
																											{
																												blockeraBorderRadius:
																													{
																														type: 'custom',
																														all: '5px',
																														topLeft:
																															'10px',
																														topRight:
																															'5px',
																														bottomLeft:
																															'5px',
																														bottomRight:
																															'5px',
																													},
																											},
																									},
																									mobile: {
																										attributes:
																											{
																												blockeraBorderRadius:
																													{
																														type: 'all',
																														all: '20px',
																													},
																											},
																									},
																								},
																							isVisible: true,
																						},
																						normal: {
																							breakpoints:
																								{
																									laptop: {
																										attributes:
																											{},
																									},
																								},
																							isVisible: true,
																						},
																					},
																			},
																	},
																},
														},
													},
												}).to.be.deep.equal(
													getSelectedBlock(
														data,
														'blockeraBlockStates'
													).hover.breakpoints
												);
											});

											// frontend
											//TODO
											savePage();

											redirectToFrontPage();

											// Assert in default viewport
											cy.viewport(1025, 1440);
											cy.get(
												'.blockera-block'
											).realHover();

											cy.get('.my-link').should(
												'have.css',
												'border-radius',
												'5px'
											);

											// // Hover
											// cy.get('.my-link').realHover();
											// cy.get('.my-link')
											// 	.should(
											// 		'have.css',
											// 		'border-radius',
											// 		'10px 5px 5px 5px'
											// 	)
											// 	.realMouseUp();

											// // Focus
											// cy.get('.my-link').focus();
											// cy.get('.my-link')
											// 	.should(
											// 		'have.css',
											// 		'border-radius',
											// 		'15px'
											// 	)
											// 	.realMouseUp();

											// Set desktop viewport
											cy.viewport(1441, 1920);
											cy.get(
												'.blockera-block'
											).realHover();

											// cy.get('.my-link').should(
											// 	'have.css',
											// 	'border-radius',
											// 	'5px'
											// );

											// Hover
											// cy.get('.my-link').realHover();
											// cy.get('.my-link')
											// 	.should(
											// 		'have.css',
											// 		'border-radius',
											// 		'10px 5px 5px 5px'
											// 	)
											// 	.realMouseUp();

											// // Focus
											// cy.get('.my-link').focus();
											// cy.get('.my-link')
											// 	.should(
											// 		'have.css',
											// 		'border-radius',
											// 		'15px'
											// 	)
											// 	.realMouseUp();

											// Set mobile viewport
											cy.viewport(380, 470);
											cy.get(
												'.blockera-block'
											).realHover();

											// cy.get('.my-link').should(
											// 	'have.css',
											// 		'border-bottom-right-radius',
											// 		'30px'
											// );

											// Hover
											// cy.get('.my-link').realHover();
											// cy.get('.my-link')
											// 	.should(
											// 		'have.css',
											// 		'border-radius',
											// 		'2px'
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
		});

		describe('update repeater attributes in multiple states and devices', () => {
			// TODO: complete test after fixing related bug
			// bug : repeater wrong item and value

			context(
				'Normal -> add filter item -> set drop-shadow-x = 20',
				() => {
					beforeEach(() => {
						//
						checkBlockCard([
							{
								label: 'Hover',
								type: 'State',
							},
							{
								label: 'Link',
								type: 'Inner Block',
							},
						]);

						// Add item
						cy.getByAriaLabel('Add New Filter Effect').click();

						// Alias
						cy.getParentContainer('Filters')
							.as('filter-container')
							.within(() =>
								cy
									.getByDataCy('group-control-header')
									.as('filter-items')
							);
						cy.getByDataTest('popover-body')
							.as('filter-popover')
							.within(() => {
								cy.getParentContainer('Type').within(() => {
									cy.get('select').as('type-select');
								});
							});

						// Set drop-shadow-x
						cy.get('@filter-popover').within(() => {
							cy.get('@type-select').select('drop-shadow');

							cy.getByDataTest('filter-drop-shadow-x-input').type(
								'{selectall}20'
							);
						});

						// Reselect
						reSelectBlock();
						setInnerBlock('Link');

						// Assert control value
						cy.openRepeaterItem('Filters', 'Drop Shadow');
						cy.get('@filter-popover').within(() => {
							cy.getByDataTest(
								'filter-drop-shadow-x-input'
							).should('have.value', 20);
						});
					});

					context('After -> set drop-shadow-y = 15', () => {
						beforeEach(() => {
							addBlockState('after');
							//
							checkBlockCard([
								{
									label: 'Hover',
									type: 'State',
								},
								{
									label: 'Link',
									type: 'Inner Block',
								},
								{
									label: 'After',
									type: 'State',
								},
							]);

							// Normal state updates should display
							cy.get('@filter-items').should('have.length', '1');
							cy.openRepeaterItem('Filters', 'Drop Shadow');
							cy.get('@filter-popover').within(() => {
								cy.getByDataTest(
									'filter-drop-shadow-x-input'
								).should('have.value', 20);

								// Set drop-shadow-y
								cy.getByDataTest(
									'filter-drop-shadow-y-input'
								).type('{selectall}15');
							});

							// Reselect
							reSelectBlock();
							setInnerBlock('Link');

							// Assert control
							cy.openRepeaterItem('Filters', 'Drop Shadow');
							cy.get('@filter-popover').within(() => {
								cy.getByDataTest(
									'filter-drop-shadow-x-input'
								).should('have.value', 20);

								cy.getByDataTest(
									'filter-drop-shadow-y-input'
								).should('have.value', 15);
							});
						});

						context('Focus -> add new item -> set blur = 5', () => {
							beforeEach(() => {
								addBlockState('focus');
								//
								checkBlockCard([
									{
										label: 'Hover',
										type: 'State',
									},
									{
										label: 'Link',
										type: 'Inner Block',
									},
									{
										label: 'Focus',
										type: 'State',
									},
								]);

								// Normal state updates should display
								cy.get('@filter-items').should(
									'have.length',
									'1'
								);
								cy.openRepeaterItem('Filters', 'Drop Shadow');
								cy.get('@filter-popover').within(() => {
									cy.getByDataTest(
										'filter-drop-shadow-x-input'
									).should('have.value', 20);

									//  After state updates should not display
									cy.getByDataTest(
										'filter-drop-shadow-y-input'
									).should('not.have.value', 15);
								});

								// Add new item
								cy.getByAriaLabel('Add New Filter Effect');
								cy.get('@filter-popover').within(() => {
									// Set blur
									cy.getByDataTest('filter-blur-input').type(
										'{selectall}5'
									);
								});

								// Reselect
								reSelectBlock();
								setInnerBlock('Link');

								// Assert control
								cy.get('@filter-items').should(
									'have.length',
									'2'
								);

								cy.openRepeaterItem('Filters', 'Blur');
								cy.get('@filter-popover').within(() => {
									cy.getByDataTest(
										'filter-blur-input'
									).should('have.value', 5);
								});
							});

							context(
								'Normal -> Mobile -> set drop-shadow-blur = 30 & update drop-shadow-x = 5',
								() => {
									beforeEach(() => {
										setBlockState('Normal');
										setDeviceType('Mobile');
										//
										checkBlockCard([
											{
												label: 'Hover',
												type: 'State',
											},
											{
												label: 'Link',
												type: 'Inner Block',
											},
										]);

										// laptop/normal updates should display
										cy.get('@filter-items').should(
											'have.length',
											1
										);
										cy.openRepeaterItem(
											'Filters',
											'Drop Shadow'
										);
										cy.get('@filter-popover').within(() => {
											cy.getByDataTest(
												'filter-drop-shadow-x-input'
											).should('have.value', 20);

											cy.getByDataTest(
												'filter-drop-shadow-y-input'
											).should('have.value', 15);

											// Set blur
											cy.getByDataTest(
												'filter-drop-shadow-blur-input'
											).type('{selectall}30');

											// Update x
											cy.getByDataTest(
												'filter-drop-shadow-x-input'
											).type('{selectall}5');
										});

										// Reselect
										reSelectBlock();
										setInnerBlock('Link');

										// Assert control
										cy.openRepeaterItem(
											'Filters',
											'Drop Shadow'
										);
										cy.get('@filter-popover').within(() => {
											cy.getByDataTest(
												'filter-drop-shadow-x-input'
											).should('have.value', 5);

											cy.getByDataTest(
												'filter-drop-shadow-y-input'
											).should('have.value', 15);

											cy.getByDataTest(
												'filter-drop-shadow-blur-input'
											).should('have.value', 30);
										});
									});

									context(
										'Mobile -> Focus -> update drp-shadow-y = 35',
										() => {
											beforeEach(() => {
												setBlockState('Focus');
												//
												checkBlockCard([
													{
														label: 'Hover',
														type: 'State',
													},
													{
														label: 'Link',
														type: 'Inner Block',
													},
													{
														label: 'Focus',
														type: 'State',
													},
												]);

												// mobile/normal updates should display
												cy.openRepeaterItem(
													'Filters',
													'Drop Shadow'
												);
												cy.get(
													'@filter-popover'
												).within(() => {
													cy.getByDataTest(
														'filter-drop-shadow-x-input'
													).should('have.value', 5);

													cy.getByDataTest(
														'filter-drop-shadow-y-input'
													).should('have.value', 15);

													cy.getByDataTest(
														'filter-drop-shadow-blur-input'
													).should('have.value', 30);

													// Update y
													cy.getByDataTest(
														'filter-drop-shadow-y-input'
													).type('{selectall}35');
												});

												// Reselect
												reSelectBlock();
												setInnerBlock('Link');

												// Assert control
												cy.openRepeaterItem(
													'Filters',
													'Drop Shadow'
												);
												cy.get(
													'@filter-popover'
												).within(() => {
													cy.getByDataTest(
														'filter-drop-shadow-x-input'
													).should('have.value', 5);

													cy.getByDataTest(
														'filter-drop-shadow-y-input'
													).should('have.value', 35);

													cy.getByDataTest(
														'filter-drop-shadow-blur-input'
													).should('have.value', 30);
												});
											});

											it('should control value and styles be correct, when navigate between states and devices', () => {});
										}
									);
								}
							);
						});
					});
				}
			);
		});
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
						getSelectedBlock(data, 'blockeraInnerBlocks').link
							.attributes
					).length
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks').link
						.attributes.blockeraBlockStates.hover.breakpoints.tablet
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks').link
						.attributes.blockeraBlockStates.hover.breakpoints.laptop
						.attributes.blockeraHeight
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
							laptop: { attributes: { blockeraWidth: '100px' } },
						},
						isVisible: true,
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks').link
						.attributes.blockeraBlockStates
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
