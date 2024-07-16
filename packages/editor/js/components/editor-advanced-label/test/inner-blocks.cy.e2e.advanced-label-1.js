import {
	createPost,
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

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();

		// Alias
		cy.getParentContainer('Text Color').within(() => {
			cy.getByDataCy('color-label').as('color-label');
		});
	});

	it('should display changed value on Test Color -> Inner -> Normal -> Desktop', () => {
		// Set Inner Block
		setInnerBlock('Link');
		// Assert label before set value
		cy.checkLabelClassName(
			'Typography',
			'Text Color',
			'changed-in-inner-normal-state',
			'not-have'
		);

		// Set value
		cy.setColorControlValue('Text Color', 'ccc');

		// Assert label after set value
		cy.checkLabelClassName(
			'Typography',
			'Text Color',
			'changed-in-inner-normal-state'
		);

		// Assert control
		cy.get('@color-label').should('include.text', 'ccc');

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
		setInnerBlock('Link');

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
		setInnerBlock('Link');
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
		cy.setColorControlValue('Text Color', 'ccc');

		// Assert label after set value
		cy.checkLabelClassName(
			'Typography',
			'Text Color',
			'changed-in-secondary-state'
		);
		// Assert control
		cy.get('@color-label').should('include.text', 'ccc');

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
				setInnerBlock('Link');

				// Assert label before set value
				cy.checkLabelClassName(
					'Typography',
					'Text Color',
					'changed-in-inner-normal-state',
					'not-have'
				);

				// Set value
				cy.setColorControlValue('Text Color', 'aaa');

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
				cy.setColorControlValue('Text Color', 'eee');

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
			cy.setColorControlValue('Text Color', 'bbb');

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
				setInnerBlock('Link');

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
		beforeEach(() => {
			/**
			 * Normal -> Inner
			 */
			setInnerBlock('Link');

			// Set value in normal/desktop
			cy.setColorControlValue('Text Color', 'ccc');

			// Set value in hover/desktop
			addBlockState('hover');
			cy.setColorControlValue('Text Color', 'bbb');

			// Set value in hover/tablet
			setDeviceType('Tablet');
			cy.setColorControlValue('Text Color', 'aaa');

			// Set value in normal/tablet
			setBlockState('Normal');
			cy.setColorControlValue('Text Color', 'eee');

			/**
			 * Hover -> Inner
			 */
			reSelectBlock();
			addBlockState('hover');
			setInnerBlock('Link');

			// Set value in normal/tablet
			cy.setColorControlValue('Text Color', 'fff');

			// Set value in normal/desktop
			setDeviceType('Desktop');
			cy.setColorControlValue('Text Color', '777');

			// Set value in hover/desktop
			setBlockState('Hover');
			cy.setColorControlValue('Text Color', '555');

			context(
				'should correctly reset blockeraFontColor, and display effected fields(label, control, stateGraph) in Hover -> Inner -> hover/desktop',
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
					cy.get('@color-label').should('include.text', '777');

					// Assert state graph
					cy.checkStateGraph('Typography', 'Text Color', {
						desktop: ['Normal', 'Hover'],
						tablet: ['Normal', 'Hover'],
					});

					// Assert store data
					getWPDataObject().then((data) => {
						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').hover
								.breakpoints.desktop.attributes
								.blockeraInnerBlocks.link.attributes
								.blockeraBlockStates.hover.breakpoints.desktop
								.attributes
						);
					});
				}
			);

			context(
				'should correctly reset blockeraFontColor, and display effected fields(label, control, stateGraph) in Hover -> Inner -> normal/tablet',
				() => {
					setBlockState('Normal');
					setDeviceType('Tablet');

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
					cy.get('@color-label').should('include.text', '777');

					// Assert state graph
					cy.checkStateGraph('Typography', 'Text Color', {
						desktop: ['Normal', 'Hover'],
						tablet: ['Normal', 'Hover'],
					});

					// Assert store data
					getWPDataObject().then((data) => {
						expect(undefined).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').hover
								.breakpoints.tablet.attributes
								.blockeraInnerBlocks.link.attributes
								.blockeraFontColor
						);
					});
				}
			);

			context(
				'should correctly reset blockeraFontColor, and display effected fields(label, control, stateGraph) in Hover -> Inner -> normal/desktop',
				() => {
					setDeviceType('Desktop');

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
							getSelectedBlock(data, 'blockeraBlockStates').hover
								.breakpoints.desktop.attributes
								.blockeraInnerBlocks.link.attributes
								.blockeraFontColor
						);
					});
				}
			);

			context(
				'should correctly reset blockeraFontColor, and display effected fields(label, control, stateGraph) in Normal -> Inner -> normal/desktop',
				() => {
					reSelectBlock();
					setBlockState('Normal');
					setInnerBlock('Link');

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
						'changed-in-inner-normal-state',
						'not-have'
					);
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
						tablet: ['Normal', 'Hover'],
					});

					// Assert store data
					getWPDataObject().then((data) => {
						expect(undefined).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraInnerBlocks').link
								.attributes.blockeraFontColor
						);
					});
				}
			);

			context(
				'should correctly reset blockeraFontColor, and display effected fields(label, control, stateGraph) in Normal -> Inner -> hover/desktop',
				() => {
					setBlockState('Hover');

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
						'changed-in-secondary-state',
						'not-have'
					);

					cy.checkLabelClassName(
						'Typography',
						'Text Color',
						'changed-in-other-state'
					);

					// Assert control
					cy.get('@color-label').should('include.text', 'None');

					// Assert state graph
					cy.checkStateGraph('Typography', 'Text Color', {
						tablet: ['Normal', 'Hover'],
					});

					// Assert store data
					getWPDataObject().then((data) => {
						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraInnerBlocks').link
								.attributes.blockeraBlockStates.hover
								.breakpoints.desktop.attributes
						);
					});
				}
			);

			context(
				'should correctly reset blockeraFontColor, and display effected fields(label, control, stateGraph) in Normal -> Inner -> hover/tablet',
				() => {
					setDeviceType('Tablet');

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
						'changed-in-secondary-state',
						'not-have'
					);
					cy.checkLabelClassName(
						'Typography',
						'Text Color',
						'changed-in-inner-normal-state'
					);

					// Assert control
					cy.get('@color-label').should('include.text', 'eee');

					// Assert state graph
					cy.checkStateGraph('Typography', 'Text Color', {
						tablet: ['Normal'],
					});

					// Assert store data
					getWPDataObject().then((data) => {
						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').normal
								.breakpoints.tablet.attributes
								.blockeraInnerBlocks.link.attributes
								.blockeraBlockStates.hover.breakpoints.tablet
								.attributes
						);
					});
				}
			);

			context(
				'should correctly reset blockeraFontColor, and display effected fields(label, control, stateGraph) in Normal -> Inner -> normal/tablet',
				() => {
					setBlockState('Normal');

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
						'changed-in-inner-state',
						'not-have'
					);
				}
			);
		});

		it('should value is undefined after resetting on Normal -> Tablet of inner block attribute', () => {
			// Assert control
			cy.get('@color-label').should('include.text', 'None');

			// Assert state graph
			cy.checkStateGraph('Typography', 'Text Color', {});

			// Assert store data
			getWPDataObject().then((data) => {
				expect(undefined).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes.blockeraInnerBlocks.link
						.attributes.blockeraFontColor
				);
			});
		});
	});

	describe.skip('reset-all action testing...', () => {
		beforeEach(() => {
			/**
			 * Normal -> Inner ->
			 */
			setInnerBlock('Link');

			// Set value in normal/desktop
			cy.setColorControlValue('Text Color', 'ccc');

			// Set value in hover/desktop
			addBlockState('hover');
			cy.setColorControlValue('Text Color', 'bbb');

			// Set value in hover/tablet
			setDeviceType('Tablet');
			cy.setColorControlValue('Text Color', 'aaa');

			// Set value in normal/tablet
			setBlockState('Normal');
			cy.setColorControlValue('Text Color', 'eee');

			/**
			 * Hover -> inner ->
			 */
			reSelectBlock();
			addBlockState('hover');
			setInnerBlock('Link');

			// Set value in normal/tablet
			cy.setColorControlValue('Text Color', 'c4c4c4');

			// Set value in hover/desktop
			setBlockState('Hover');
			setDeviceType('Desktop');
			cy.setColorControlValue('Text Color', 'fff');

			// Reset All
			cy.resetBlockeraAttribute('Typography', 'Text Color', 'reset-all');

			context(
				'should correctly reset blockeraFontColor, and display effected fields(label, control, stateGraph) in all states',
				() => {
					// Hover -> inner -> Hover/Desktop
					// Assert label
					cy.checkLabelClassName(
						'Typography',
						'Text Color',
						'changed-in-secondary-state',
						'not-have'
					);

					// Assert control
					cy.get('@color-label').should('include.text', 'None');

					// Assert state graph
					cy.checkStateGraph('Typography', 'Text Color', {});

					// Hover -> inner -> Normal/Tablet
					setDeviceType('Tablet');
					setBlockState('Normal');

					// Assert label
					cy.checkLabelClassName(
						'Typography',
						'Text Color',
						'changed-in-inner-normal-state',
						'not-have'
					);

					// Assert control
					cy.get('@color-label').should('include.text', 'None');

					// Assert state graph
					cy.checkStateGraph('Typography', 'Text Color', {});

					// Hover -> inner -> Hover/Tablet
					setBlockState('Hover');
					// Assert label
					cy.checkLabelClassName(
						'Typography',
						'Text Color',
						'changed-in-inner-normal-state',
						'not-have'
					);

					// Assert control
					cy.get('@color-label').should('include.text', 'None');

					// Assert state graph
					cy.checkStateGraph('Typography', 'Text Color', {});

					// Normal -> inner -> Hover/Tablet
					reSelectBlock();
					setBlockState('Normal');
					setInnerBlock('Link');

					// Assert label
					cy.checkLabelClassName(
						'Typography',
						'Text Color',
						'changed-in-secondary-state',
						'not-have'
					);

					// Assert control
					cy.get('@color-label').should('include.text', 'None');

					// Assert state graph
					cy.checkStateGraph('Typography', 'Text Color', {});

					// Normal -> inner -> Normal/Tablet
					setBlockState('Normal');

					// Assert label
					cy.checkLabelClassName(
						'Typography',
						'Text Color',
						'changed-in-inner-normal-state',
						'not-have'
					);

					// Assert control
					cy.get('@color-label').should('include.text', 'None');

					// Assert state graph
					cy.checkStateGraph('Typography', 'Text Color', {});

					// Normal -> inner -> Normal/Desktop
					setDeviceType('Desktop');

					// Assert label
					cy.checkLabelClassName(
						'Typography',
						'Text Color',
						'changed-in-inner-normal-state',
						'not-have'
					);

					// Assert control
					cy.get('@color-label').should('include.text', 'None');

					// Assert state graph
					cy.checkStateGraph('Typography', 'Text Color', {});

					// Normal -> inner -> Hover/Desktop
					setBlockState('Hover');

					// Assert label
					cy.checkLabelClassName(
						'Typography',
						'Text Color',
						'changed-in-secondary-state',
						'not-have'
					);

					// Assert control
					cy.get('@color-label').should('include.text', 'None');

					// Assert state graph
					cy.checkStateGraph('Typography', 'Text Color', {});

					// Assert store data
					getWPDataObject().then((data) => {
						expect(undefined).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraInnerBlocks').link
								.attributes.blockeraFontColor
						);

						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraInnerBlocks').link
								.attributes.blockeraBlockStates.hover
								.breakpoints.desktop.attributes
						);

						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').hover
								.breakpoints.desktop.attributes
								.blockeraInnerBlocks.link.attributes
								.blockeraBlockStates.hover.breakpoints.desktop
								.attributes
						);

						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').hover
								.breakpoints.tablet.attributes
								.blockeraInnerBlocks.link.attributes
						);

						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').normal
								.breakpoints.tablet.attributes
								.blockeraInnerBlocks.link.attributes
								.blockeraBlockStates.hover.breakpoints.tablet
								.attributes
						);

						expect(undefined).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').normal
								.breakpoints.tablet.attributes
								.blockeraInnerBlocks.link.attributes
								.blockeraFontColor
						);
					});
				}
			);
		});

		it('set value in Normal -> Inner -> Normal/desktop and navigate between states and devices', () => {
			setBlockState('Normal');
			cy.setColorControlValue('Text Color', '333');

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-inner-normal-state'
			);

			// Assert control
			cy.get('@color-label').should('include.text', '333');

			// Assert state graph
			cy.checkStateGraph('Typography', 'Text Color', {
				desktop: ['Normal'],
			});

			// Navigate between states and devices

			/**
			 * Normal -> inner
			 */

			// Hover/Desktop
			setBlockState('Hover');

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-inner-normal-state'
			);

			// Assert control
			// TODO
			//	cy.get('@color-label').should('include.text', '333');

			// Assert state graph
			cy.checkStateGraph('Typography', 'Text Color', {
				desktop: ['Normal'],
			});

			// Hover/Tablet
			setDeviceType('Tablet');
			// **should not display prev changes

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-inner-normal-state',
				'not-have'
			);

			// Assert control
			// TODO : what value should control display ??

			// Assert state graph
			cy.checkStateGraph('Typography', 'Text Color', {});

			// Normal/Tablet
			setBlockState('Normal');

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-inner-normal-state',
				'not-have'
			);

			// Assert control
			// TODO : what value should control display ??

			// Assert state graph
			cy.checkStateGraph('Typography', 'Text Color', {});

			/**
			 * Hover -> inner
			 */
			// Normal/Tablet
			reSelectBlock();
			setBlockState('Hover');
			setInnerBlock('Link');

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-inner-normal-state',
				'not-have'
			);

			// Assert control
			// TODO : what value should control display ??

			// Assert state graph
			cy.checkStateGraph('Typography', 'Text Color', {});

			// Hover/Desktop
			setBlockState('Hover');
			setDeviceType('Desktop');

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-inner-normal-state',
				'not-have'
			);

			// Assert control
			// TODO : what value should control display ??

			// Assert state graph
			cy.checkStateGraph('Typography', 'Text Color', {});

			// Assert store data
			getWPDataObject().then((data) => {
				expect('#333333').to.be.deep.eq(
					getSelectedBlock(data, 'blockeraInnerBlocks').link
						.attributes.blockeraFontColor
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraInnerBlocks').link
						.attributes.blockeraBlockStates.hover.breakpoints
						.desktop.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes.blockeraInnerBlocks.link
						.attributes.blockeraBlockStates.hover.breakpoints
						.desktop.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes.blockeraInnerBlocks.link
						.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes.blockeraInnerBlocks.link
						.attributes.blockeraBlockStates.hover.breakpoints.tablet
						.attributes
				);

				expect(undefined).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes.blockeraInnerBlocks.link
						.attributes.blockeraFontColor
				);
			});
		});

		it('set value in Normal -> Inner -> Hover/Tablet and navigate between states and devices', () => {
			setDeviceType('Tablet');
			cy.setColorControlValue('Text Color', '333');

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-secondary-state'
			);

			// Assert control
			cy.get('@color-label').should('include.text', '333');

			// Assert state graph
			cy.checkStateGraph('Typography', 'Text Color', {
				tablet: ['Hover'],
			});

			// Navigate between states and devices

			/**
			 * Normal -> inner
			 */

			// Normal/Tablet
			setBlockState('Normal');

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
				tablet: ['Hover'],
			});

			// Normal/Desktop
			setDeviceType('Desktop');
			// **should not display prev changes

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-other-state',
				'not-have'
			);

			// Assert control
			cy.get('@color-label').should('include.text', 'None');

			// Assert state graph
			cy.checkStateGraph('Typography', 'Text Color', {});

			// Hover/Desktop
			setBlockState('Hover');

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-other-state',
				'not-have'
			);

			// Assert control
			cy.get('@color-label').should('include.text', 'None');

			// Assert state graph
			cy.checkStateGraph('Typography', 'Text Color', {});

			/**
			 * Hover -> inner
			 */
			// Hover/Desktop
			reSelectBlock();
			setBlockState('Hover');
			setInnerBlock('Link');

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-other-state',
				'not-have'
			);

			// Assert control
			cy.get('@color-label').should('include.text', 'None');

			// Assert state graph
			cy.checkStateGraph('Typography', 'Text Color', {});

			// Normal/Tablet
			setBlockState('Normal');
			setDeviceType('Tablet');

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-other-state',
				'not-have'
			);

			// Assert control
			cy.get('@color-label').should('include.text', 'None');

			// Assert state graph
			cy.checkStateGraph('Typography', 'Text Color', {});

			// Assert store data
			getWPDataObject().then((data) => {
				expect(undefined).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraInnerBlocks').link
						.attributes.blockeraFontColor
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraInnerBlocks').link
						.attributes.blockeraBlockStates.hover.breakpoints
						.desktop.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes.blockeraInnerBlocks.link
						.attributes.blockeraBlockStates.hover.breakpoints
						.desktop.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes.blockeraInnerBlocks.link
						.attributes
				);

				expect({ blockeraFontColor: '#333333' }).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes.blockeraInnerBlocks.link
						.attributes.blockeraBlockStates.hover.breakpoints.tablet
						.attributes
				);

				expect(undefined).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes.blockeraInnerBlocks.link
						.attributes.blockeraFontColor
				);
			});
		});

		it('set value in Hover -> Inner -> Normal/Desktop and navigate between states and devices', () => {
			reSelectBlock();
			setBlockState('Hover');
			setInnerBlock('Link');
			setBlockState('Normal');

			cy.setColorControlValue('Text Color', '333');

			// Assert label
			// TODO : doesn't show changes
			// cy.checkLabelClassName(
			// 	'Typography',
			// 	'Text Color',
			// 	'changed-in-inner-normal-state'
			// );

			// Assert control
			cy.get('@color-label').should('include.text', '333');

			// Assert state graph
			// TODO
			// cy.checkStateGraph('Typography', 'Text Color', {
			// 	normal: ['Normal'],
			// });

			// Navigate between states and devices

			/**
			 * Hover -> inner
			 */

			// Hover/Desktop
			setBlockState('Hover');

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-inner-normal-state'
			);

			// Assert control
			// TODO : what value should control display?

			// Assert state graph
			// TODO
			// cy.checkStateGraph('Typography', 'Text Color', {
			// 	normal: ['Normal'],
			// });

			// Hover/Tablet
			setDeviceType('Tablet');
			// **should not display prev changes

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-inner-normal-state',
				'not-have'
			);

			// Assert control
			cy.get('@color-label').should('include.text', 'None');

			// Assert state graph
			cy.checkStateGraph('Typography', 'Text Color', {});

			// Normal/Tablet
			setBlockState('Normal');

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-inner-normal-state',
				'not-have'
			);

			// Assert control
			cy.get('@color-label').should('include.text', 'None');

			// Assert state graph
			cy.checkStateGraph('Typography', 'Text Color', {});

			/**
			 * Normal -> inner
			 */
			reSelectBlock();
			setBlockState('Normal');
			setInnerBlock('Link');

			// Normal/Tablet

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-other-state',
				'not-have'
			);

			// Assert control
			cy.get('@color-label').should('include.text', 'None');

			// Assert state graph
			cy.checkStateGraph('Typography', 'Text Color', {});

			// Hover/Tablet
			setBlockState('Hover');

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-other-state',
				'not-have'
			);

			// Assert control
			cy.get('@color-label').should('include.text', 'None');

			// Assert state graph
			cy.checkStateGraph('Typography', 'Text Color', {});

			// Hover/Desktop
			setDeviceType('Desktop');

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-other-state',
				'not-have'
			);

			// Assert control
			cy.get('@color-label').should('include.text', 'None');

			// Assert state graph
			cy.checkStateGraph('Typography', 'Text Color', {});

			// Normal/Desktop
			setBlockState('Normal');

			// Assert label
			cy.checkLabelClassName(
				'Typography',
				'Text Color',
				'changed-in-other-state',
				'not-have'
			);

			// Assert control
			cy.get('@color-label').should('include.text', 'None');

			// Assert state graph
			cy.checkStateGraph('Typography', 'Text Color', {});

			// Assert store data
			getWPDataObject().then((data) => {
				expect(undefined).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraInnerBlocks').link
						.attributes.blockeraFontColor
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraInnerBlocks').link
						.attributes.blockeraBlockStates.hover.breakpoints
						.desktop.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes.blockeraInnerBlocks.link
						.attributes.blockeraBlockStates.hover.breakpoints
						.desktop.attributes
				);

				expect('#333333').to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes.blockeraInnerBlocks.link
						.attributes.blockeraFontColor
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes.blockeraInnerBlocks.link
						.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes.blockeraInnerBlocks.link
						.attributes.blockeraBlockStates.hover.breakpoints.tablet
						.attributes
				);

				expect(undefined).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes.blockeraInnerBlocks.link
						.attributes.blockeraFontColor
				);
			});
		});
	});
});
