import {
	createPost,
	appendBlocks,
	setBlockState,
	addBlockState,
	setDeviceType,
	setInnerBlock,
	reSelectBlock,
	getWPDataObject,
	getSelectedBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('Inner Blocks label testing', () => {
	beforeEach(() => {
		createPost();

		appendBlocks(
			`<!-- wp:paragraph -->
<p>This is test paragraph block with <a href="#">link</a> as virtual block.</p>
<!-- /wp:paragraph -->`
		);

		cy.getBlock('core/paragraph').click();

		// Alias
		cy.getParentContainer('Text Color').within(() => {
			cy.getByDataCy('color-label').as('color-label');
		});
	});

	it('should display changed value on Test Color -> Inner -> Normal -> Desktop', () => {
		// Set Inner Block
		setInnerBlock('elements/link');
		// Assert label before set value
		cy.checkLabelClassName(
			'Typography',
			'Text Color',
			'changed-in-inner-normal-state',
			'not-have'
		);

		// Set value
		cy.setColorControlValue('Text Color', 'cccccc');

		// Assert label after set value
		cy.checkLabelClassName(
			'Typography',
			'Text Color',
			'changed-in-inner-normal-state'
		);

		// Assert control
		cy.get('@color-label').should('include.text', 'cccccc');

		/**
		 * Pseudo State (Hover)
		 */
		addBlockState('hover');

		// Assert label
		cy.checkLabelClassName(
			'Typography',
			'Text Color',
			'changed-in-inner-normal-state'
		);

		// Assert control
		cy.get('@color-label').should('include.text', 'ccc');

		// Assert state graph
		cy.checkStateGraph('Typography', 'Text Color', {
			desktop: ['Normal'],
		});

		/**
		 * should not display changed on label when master block is in pseudo state
		 */
		reSelectBlock();
		addBlockState('hover');
		// Set inner
		setInnerBlock('elements/link');

		/**
		 * Hover -> inner-> Hover
		 */
		// Assert label
		cy.checkLabelClassName(
			'Typography',
			'Text Color',
			'changed-in-inner-normal-state'
		);

		// Assert state graph
		cy.checkStateGraph('Typography', 'Text Color', {
			desktop: ['Normal'],
		});

		/**
		 * Hover -> inner-> Normal
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName(
			'Typography',
			'Text Color',
			'changed-in-inner-normal-state'
		);

		// Assert state graph
		cy.checkStateGraph('Typography', 'Text Color', {
			desktop: ['Normal'],
		});
	});

	it('should display changed value on Text Color -> Inner -> Hover -> Desktop', () => {
		// Set Inner Block
		setInnerBlock('elements/link');
		/**
		 * Hover
		 */
		addBlockState('hover');
		// Assert label before set value
		cy.checkLabelClassName(
			'Typography',
			'Text Color',
			'changed-in-inner-normal-state',
			'not-have'
		);

		// Set value
		cy.setColorControlValue('Text Color', 'cccccc');

		// Assert label after set value
		cy.checkLabelClassName(
			'Typography',
			'Text Color',
			'changed-in-secondary-state'
		);
		// Assert control
		cy.get('@color-label').should('include.text', 'cccccc');

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label in normal state
		cy.checkLabelClassName(
			'Typography',
			'Text Color',
			'changed-in-other-state'
		);

		// Assert control in normal state
		cy.get('@color-label').should('include.text', 'None');

		// Assert state graph
		cy.checkStateGraph('Typography', 'Text Color', {
			desktop: ['Hover'],
		});

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName(
			'Typography',
			'Text Color',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@color-label').should('include.text', 'None');

		// Assert state graph
		cy.checkStateGraph('Typography', 'Text Color', {
			desktop: ['Hover'],
		});
	});

	it('set value in multiple states and devices', () => {
		context(
			'should display changed value on Text Color -> Hover -> inner -> Normal',
			() => {
				addBlockState('hover');
				// Set Inner Block
				setInnerBlock('elements/link');

				// Assert label before set value
				cy.checkLabelClassName(
					'Typography',
					'Text Color',
					'changed-in-inner-normal-state',
					'not-have'
				);

				// Set value
				cy.setColorControlValue('Text Color', 'aaaaaa');

				// Assert label after set value
				cy.checkLabelClassName(
					'Typography',
					'Text Color',
					'changed-in-inner-normal-state'
				);

				// Asset state graph
				cy.checkStateGraph('Typography', 'Text Color', {
					desktop: ['Normal'],
				});

				/**
				 * Inner -> Hover(desktop)
				 */
				addBlockState('Hover');
				// Assert label before set value
				cy.checkLabelClassName(
					'Typography',
					'Text Color',
					'changed-in-inner-normal-state'
				);

				// Set value
				cy.setColorControlValue('Text Color', 'eeeeee');

				// Assert label after set value
				cy.checkLabelClassName(
					'Typography',
					'Text Color',
					'changed-in-secondary-state'
				);

				// Asset state graph
				cy.checkStateGraph('Typography', 'Text Color', {
					desktop: ['Normal', 'Hover'],
				});
			}
		);

		context('should display value on Text Color on tablet device', () => {
			setDeviceType('Tablet');
			// Hover/Tablet
			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-inner-normal-state'
			);

			// Normal/Tablet
			setBlockState('Normal');

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-inner-normal-state'
			);

			// Asset state graph
			cy.checkStateGraph('Typography', 'Text Color', {
				desktop: ['Normal', 'Hover'],
			});

			// Set value
			cy.setColorControlValue('Text Color', 'bbbbbb');

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-inner-normal-state'
			);

			// Asset state graph
			cy.checkStateGraph('Typography', 'Text Color', {
				tablet: ['Normal'],
				desktop: ['Normal', 'Hover'],
			});
		});

		context(
			'should display tablets changes on Text Color on desktop device',
			() => {
				setDeviceType('Desktop');

				// Asset state graph
				cy.checkStateGraph('Typography', 'Text Color', {
					desktop: ['Normal', 'Hover'],
					tablet: ['Normal'],
				});
			}
		);

		context(
			'should display any changes so far, when inner is in master normal state',
			() => {
				reSelectBlock();
				setBlockState('Normal');
				setInnerBlock('elements/link');

				/**
				 * Normal -> Inner -> Normal
				 */
				// Assert label
				cy.checkLabelClassName(
					'Typography',
					'Text Color',
					'changed-in-other-state'
				);

				// Asset state graph
				cy.checkStateGraph('Typography', 'Text Color', {
					desktop: ['Normal', 'Hover'],
					tablet: ['Normal'],
				});

				// Set value
				cy.setColorControlValue('Text Color', 'c4c4c4');

				// Assert label
				cy.checkLabelClassName(
					'Typography',
					'Text Color',
					'changed-in-inner-normal-state'
				);

				// Asset state graph
				cy.checkStateGraph('Typography', 'Text Color', {
					desktop: ['Normal', 'Hover'],
					tablet: ['Normal'],
				});

				/**
				 * Normal -> inner -> Hover
				 */

				// Assert label
				cy.checkLabelClassName(
					'Typography',
					'Text Color',
					'changed-in-inner-normal-state'
				);

				// Assert control
				cy.get('@color-label').should('include.text', 'c4c4c4');
			}
		);

		context('should display changes when breakpoint is mobile', () => {
			setDeviceType('Mobile Portrait');

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-inner-normal-state'
			);

			// Asset state graph
			cy.checkStateGraph('Typography', 'Text Color', {
				desktop: ['Normal', 'Hover'],
				tablet: ['Normal'],
			});
		});
	});

	describe('reset action testing...', () => {
		it('should resetting blockeraFontColor on any states with correctly values while switching between states', () => {
			setInnerBlock('elements/link');

			context(
				'sets values for blockeraFontColor on desktop and laptop devices on normal and hover states',
				() => {
					// Set value in elements/link/normal/desktop
					cy.setColorControlValue('Text Color', 'cccccc');

					addBlockState('hover');

					// Set value in elements/link/hover/desktop
					cy.setColorControlValue('Text Color', 'bbbbbb');

					// Set value in elements/link/hover/tablet
					setDeviceType('Tablet');
					cy.setColorControlValue('Text Color', 'aaaaaa');

					setBlockState('Normal');

					// Set value in elements/link/normal/tablet
					cy.setColorControlValue('Text Color', 'eeeeee');
				}
			);

			context(
				'reselect block and add hover state on tablet device for master block',
				() => {
					reSelectBlock();

					addBlockState('hover');
				}
			);

			setInnerBlock('elements/link');

			context(
				'sets values for blockeraFontColor on "master/hover/[tablet, desktop]/elements/link"',
				() => {
					context('tablet on [normal, hover]', () => {
						// Set value in master/hover/tablet/elements/link/normal/tablet
						cy.setColorControlValue('Text Color', 'ffffff');

						setBlockState('Hover');

						// Set value in master/hover/tablet/elements/link/hover/tablet
						cy.setColorControlValue('Text Color', '000000');
					});

					context('desktop on [hover, normal]', () => {
						setDeviceType('Desktop');

						// Set value in master/hover/desktop/elements/link/hover/desktop
						cy.setColorControlValue('Text Color', '777777');

						setBlockState('Normal');

						// Set value in master/hover/desktop/elements/link/normal/desktop
						cy.setColorControlValue('Text Color', '555555');
					});
				}
			);

			context('reset blockeraFontColor to normal value', () => {
				context(
					'on "master/hover/desktop/elements/link/normal/desktop" state',
					() => {
						cy.resetBlockeraAttribute(
							'Typography',
							'Text Color',
							'reset'
						);

						context(
							'should resets value to normal and with checking other states values and real attributes values',
							() => {
								// Assert label
								cy.checkLabelClassName(
									'Typography',
									'Text Color',
									'changed-in-inner-normal-state'
								);

								// Assert control
								cy.get('@color-label').should(
									'include.text',
									'ccc'
								);

								// Assert state graph
								cy.checkStateGraph('Typography', 'Text Color', {
									desktop: ['Normal', 'Hover'],
									tablet: ['Normal', 'Hover'],
								});

								// Assert store data
								getWPDataObject().then((data) => {
									expect(undefined).to.be.deep.eq(
										getSelectedBlock(
											data,
											'blockeraBlockStates'
										).hover.breakpoints.desktop.attributes
											.blockeraInnerBlocks[
											'elements/link'
										].attributes.blockeraFontColor
									);
								});
							}
						);
					}
				);

				setBlockState('Hover');

				context(
					'on "master/hover/desktop/elements/link/hover/desktop" state',
					() => {
						cy.resetBlockeraAttribute(
							'Typography',
							'Text Color',
							'reset'
						);

						context(
							'should resets value to normal and with checking other states values and real attributes values',
							() => {
								// Assert label
								cy.checkLabelClassName(
									'Typography',
									'Text Color',
									'changed-in-inner-normal-state'
								);

								// Assert control
								cy.get('@color-label').should(
									'include.text',
									'ccc'
								);

								// Assert state graph
								cy.checkStateGraph('Typography', 'Text Color', {
									desktop: ['Normal', 'Hover'],
									tablet: ['Normal', 'Hover'],
								});

								// Assert store data
								getWPDataObject().then((data) => {
									expect({}).to.be.deep.eq(
										getSelectedBlock(
											data,
											'blockeraBlockStates'
										).hover.breakpoints.desktop.attributes
											.blockeraInnerBlocks[
											'elements/link'
										].attributes.blockeraBlockStates.hover
											.breakpoints.desktop.attributes
									);
								});
							}
						);
					}
				);

				setDeviceType('Tablet');

				context(
					'on "master/hover/tablet/elements/link/hover/tablet" state',
					() => {
						// Reset to normal
						cy.resetBlockeraAttribute(
							'Typography',
							'Text Color',
							'reset'
						);

						// Assert label
						cy.checkLabelClassName(
							'Typography',
							'Text Color',
							'changed-in-inner-normal-state'
						);

						// Assert control
						cy.get('@color-label').should('include.text', 'fff');

						// Assert state graph
						cy.checkStateGraph('Typography', 'Text Color', {
							desktop: ['Normal', 'Hover'],
							tablet: ['Normal', 'Hover'],
						});

						// Assert store data
						getWPDataObject().then((data) => {
							expect(undefined).to.be.deep.eq(
								getSelectedBlock(data, 'blockeraBlockStates')
									.hover.breakpoints.tablet.attributes
									.blockeraInnerBlocks['elements/link']
									.attributes.blockeraBlockStates.hover
									.breakpoints.tablet.attributes
									.blockeraFontColor
							);
						});
					}
				);

				setBlockState('Normal');

				context(
					'on "master/hover/tablet/elements/link/normal/tablet" state',
					() => {
						// Reset to normal
						cy.resetBlockeraAttribute(
							'Typography',
							'Text Color',
							'reset'
						);

						// Assert label
						cy.checkLabelClassName(
							'Typography',
							'Text Color',
							'changed-in-inner-normal-state'
						);

						// Assert control
						cy.get('@color-label').should('include.text', 'ccc');

						// Assert state graph
						cy.checkStateGraph('Typography', 'Text Color', {
							desktop: ['Normal', 'Hover'],
							tablet: ['Normal', 'Hover'],
						});

						// Assert store data
						getWPDataObject().then((data) => {
							expect(undefined).to.be.deep.eq(
								getSelectedBlock(data, 'blockeraBlockStates')
									.hover.breakpoints.tablet.attributes
									.blockeraInnerBlocks['elements/link']
									.attributes.blockeraFontColor
							);
						});
					}
				);

				reSelectBlock();
				setBlockState('Normal');
				setInnerBlock('elements/link');

				context(
					'on "master/normal/tablet/elements/link/normal/tablet"',
					() => {
						// Reset to normal
						cy.resetBlockeraAttribute(
							'Typography',
							'Text Color',
							'reset'
						);

						// Assert label
						cy.checkLabelClassName(
							'Typography',
							'Text Color',
							'changed-in-inner-normal-state'
						);

						// Assert control
						cy.get('@color-label').should('include.text', 'ccc');

						// Assert state graph
						cy.checkStateGraph('Typography', 'Text Color', {
							desktop: ['Normal', 'Hover'],
							tablet: ['Hover'],
						});

						// Assert store data
						getWPDataObject().then((data) => {
							expect(undefined).to.be.deep.eq(
								getSelectedBlock(data, 'blockeraBlockStates')
									.normal.breakpoints.tablet.attributes
									.blockeraInnerBlocks['elements/link']
									.attributes.blockeraFontColor
							);
						});
					}
				);

				setBlockState('Hover');

				context(
					'on "master/normal/tablet/elements/link/hover/tablet"',
					() => {
						// Reset to normal
						cy.resetBlockeraAttribute(
							'Typography',
							'Text Color',
							'reset'
						);

						// Assert label
						cy.checkLabelClassName(
							'Typography',
							'Text Color',
							'changed-in-inner-normal-state'
						);

						// Assert control
						cy.get('@color-label').should('include.text', 'ccc');

						// Assert state graph
						cy.checkStateGraph('Typography', 'Text Color', {
							desktop: ['Normal', 'Hover'],
						});

						// Assert store data
						getWPDataObject().then((data) => {
							expect(undefined).to.be.deep.eq(
								getSelectedBlock(data, 'blockeraBlockStates')
									.normal.breakpoints.tablet.attributes
									.blockeraInnerBlocks['elements/link']
									.attributes.blockeraBlockStates.hover
									.breakpoints.tablet.attributes
									.blockeraFontColor
							);
						});
					}
				);

				setDeviceType('Desktop');

				context(
					'on "master/normal/desktop/elements/link/hover/desktop"',
					() => {
						// Reset to normal
						cy.resetBlockeraAttribute(
							'Typography',
							'Text Color',
							'reset'
						);

						// Assert label
						cy.checkLabelClassName(
							'Typography',
							'Text Color',
							'changed-in-inner-normal-state'
						);

						// Assert control
						cy.get('@color-label').should('include.text', 'ccc');

						// Assert state graph
						cy.checkStateGraph('Typography', 'Text Color', {
							desktop: ['Normal'],
						});

						// Assert store data
						getWPDataObject().then((data) => {
							expect(undefined).to.be.deep.eq(
								getSelectedBlock(data, 'blockeraInnerBlocks')[
									'elements/link'
								].attributes.blockeraBlockStates.hover
									.breakpoints.desktop.attributes
									.blockeraFontColor
							);
						});
					}
				);

				setBlockState('Normal');

				context(
					'on "master/normal/desktop/elements/link/normal/desktop"',
					() => {
						// Reset to normal
						cy.resetBlockeraAttribute(
							'Typography',
							'Text Color',
							'reset'
						);

						// Assert label
						cy.checkLabelClassName(
							'Typography',
							'Text Color',
							'changed-in-inner-normal-state'
						);

						// Assert control
						cy.get('@color-label').should('include.text', 'None');

						// Assert state graph
						cy.checkStateGraph('Typography', 'Text Color', {});

						// Assert store data
						getWPDataObject().then((data) => {
							expect(undefined).to.be.deep.eq(
								getSelectedBlock(data, 'blockeraInnerBlocks')[
									'elements/link'
								].attributes.blockeraFontColor
							);
						});
					}
				);
			});
		});
	});

	describe('reset-all action testing...', () => {
		it('should resetting all blockeraFontColor on any states', () => {
			setInnerBlock('elements/link');

			context(
				'sets values for blockeraFontColor on desktop and laptop devices on normal and hover states',
				() => {
					// Set value in elements/link/normal/desktop
					cy.setColorControlValue('Text Color', 'cccccc');

					addBlockState('hover');

					// Set value in elements/link/hover/desktop
					cy.setColorControlValue('Text Color', 'bbbbbb');

					// Set value in elements/link/hover/tablet
					setDeviceType('Tablet');
					cy.setColorControlValue('Text Color', 'aaaaaa');

					setBlockState('Normal');

					// Set value in elements/link/normal/tablet
					cy.setColorControlValue('Text Color', 'eeeeee');
				}
			);

			context(
				'reselect block and add hover state on tablet device for master block',
				() => {
					reSelectBlock();

					addBlockState('hover');
				}
			);

			setInnerBlock('elements/link');

			context(
				'sets values for blockeraFontColor on "master/hover/[tablet, desktop]/elements/link"',
				() => {
					context('tablet on [normal, hover]', () => {
						// Set value in master/hover/tablet/elements/link/normal/tablet
						cy.setColorControlValue('Text Color', 'ffffff');

						setBlockState('Hover');

						// Set value in master/hover/tablet/elements/link/hover/tablet
						cy.setColorControlValue('Text Color', '000000');
					});

					context('desktop on [hover, normal]', () => {
						setDeviceType('Desktop');

						// Set value in master/hover/desktop/elements/link/hover/desktop
						cy.setColorControlValue('Text Color', '777777');

						setBlockState('Normal');

						// Set value in master/hover/desktop/elements/link/normal/desktop
						cy.setColorControlValue('Text Color', '555555');
					});
				}
			);

			// Reset All
			cy.resetBlockeraAttribute('Typography', 'Text Color', 'reset-all');

			context('checking values on all states', () => {
				// Assert control
				cy.get('@color-label').should('include.text', 'None');

				setBlockState('Normal');

				// Assert control
				cy.get('@color-label').should('include.text', 'None');

				setDeviceType('Tablet');

				// Assert control
				cy.get('@color-label').should('include.text', 'None');

				setBlockState('Hover');

				reSelectBlock();
				setBlockState('Normal');
				setInnerBlock('elements/link');

				// Assert control
				cy.get('@color-label').should('include.text', 'None');

				setBlockState('Normal');

				// Assert control
				cy.get('@color-label').should('include.text', 'None');

				// Assert store data
				getWPDataObject().then((data) => {
					// root
					expect(undefined).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/link'
						].attributes.blockeraFontColor
					);

					// root/desktop/hover
					expect({}).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/link'
						].attributes.blockeraBlockStates.hover.breakpoints
							.desktop.attributes
					);

					// parent/hover/desktop/hover
					expect({}).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').hover
							.breakpoints.desktop.attributes.blockeraInnerBlocks[
							'elements/link'
						].attributes.blockeraBlockStates.hover.breakpoints
							.desktop.attributes
					);

					// parent/hover/desktop
					expect(undefined).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').hover
							.breakpoints.desktop.attributes.blockeraInnerBlocks[
							'elements/link'
						].attributes.blockeraFontColor
					);

					// parent/hover/tablet/normal
					expect(undefined).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').hover
							.breakpoints.tablet.attributes.blockeraInnerBlocks[
							'elements/link'
						].attributes.blockeraFontColor
					);

					// parent/hover/tablet/hover/tablet
					expect({}).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').hover
							.breakpoints.tablet.attributes.blockeraInnerBlocks[
							'elements/link'
						].attributes.blockeraBlockStates.hover.breakpoints
							.tablet.attributes
					);

					// parent/normal/tablet/hover/tablet
					expect({}).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').normal
							.breakpoints.tablet.attributes.blockeraInnerBlocks[
							'elements/link'
						].attributes.blockeraBlockStates.hover.breakpoints
							.tablet.attributes
					);

					// parent/normal/tablet/normal
					expect(undefined).to.be.deep.eq(
						getSelectedBlock(data, 'blockeraBlockStates').normal
							.breakpoints.tablet.attributes.blockeraInnerBlocks[
							'elements/link'
						].attributes.blockeraFontColor
					);
				});
			});
		});
	});
});
