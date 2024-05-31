import {
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	createPost,
	setBlockState,
	addBlockState,
	setDeviceType,
} from '../../../../../dev-cypress/js/helpers';

describe('Color Control label testing (BG Color)', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		// Alias
		cy.getParentContainer('BG Color').within(() => {
			cy.getByDataCy('color-label').as('color-label');
		});
	});

	it('should display changed value on BG Color -> Normal -> Laptop', () => {
		// Assert label before set value
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		cy.setColorControlValue('BG Color', 'ccc');

		// Assert label after set value
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-normal-state'
		);

		// Assert control
		cy.get('@color-label').should('include.text', 'ccc');

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-normal-state'
		);

		// Assert control
		cy.get('@color-label').should('include.text', 'ccc');

		/**
		 * Pseudo State (Hover/Tablet)
		 */
		addBlockState('hover');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-normal-state'
		);

		// Assert control
		cy.get('@color-label').should('include.text', 'ccc');

		// Assert state graph
		cy.checkStateGraph('Background', 'BG Color', {
			laptop: ['Normal'],
		});
	});

	it('should display changed value on BG Color -> Hover -> Laptop', () => {
		/**
		 * Hover
		 */
		addBlockState('hover');
		// Assert label before set value
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		cy.setColorControlValue('BG Color', 'ccc');

		// Assert label after set value
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-secondary-state'
		);
		// Assert control
		cy.get('@color-label').should('include.text', 'ccc');

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@color-label').should('not.include.text', 'ccc');

		/**
		 * Active
		 */
		addBlockState('active');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@color-label').should('not.include.text', 'ccc');

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@color-label').should('not.include.text', 'ccc');

		// Assert state graph
		cy.checkStateGraph('Background', 'BG Color', { laptop: ['Hover'] });
	});

	it('should display changed value on BG Color, when set value in two states', () => {
		/**
		 * Normal
		 */
		// Set value
		cy.setColorControlValue('BG Color', 'ccc');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-normal-state'
		);

		/**
		 * Hover
		 */
		addBlockState('hover');

		// Assert label before set value
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-normal-state'
		);

		// Set value
		cy.setColorControlValue('BG Color', 'fff');

		// Assert label after set value
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-secondary-state'
		);

		// Assert control
		cy.get('@color-label').should('include.text', 'fff');

		/**
		 * Active
		 */
		addBlockState('active');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-normal-state'
		);

		// Assert control
		cy.get('@color-label').should('include.text', 'ccc');

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-normal-state'
		);

		// Assert control
		cy.get('@color-label').should('include.text', 'ccc');

		// Assert state graph
		cy.checkStateGraph('Background', 'BG Color', {
			laptop: ['Normal', 'Hover'],
		});
	});

	it('should display changed value on BG Color -> Normal -> Tablet', () => {
		setDeviceType('Tablet');
		// Assert label before set value
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		cy.setColorControlValue('BG Color', 'ccc');

		// Assert label after set value
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-normal-state'
		);

		// Assert control
		cy.get('@color-label').should('include.text', 'ccc');

		/**
		 * Laptop device
		 */
		setDeviceType('Laptop');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@color-label').should('not.include.text', 'ccc');

		// Assert state graph
		cy.checkStateGraph('Background', 'BG Color', {
			tablet: ['Normal'],
		});
	});

	it('should display changed value on BG Color -> Hover -> Tablet', () => {
		setDeviceType('Tablet');
		/**
		 * Hover
		 */
		addBlockState('hover');
		// Assert label before set value
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		cy.setColorControlValue('BG Color', 'ccc');

		// Assert label after set value
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-secondary-state'
		);
		// Assert control
		cy.get('@color-label').should('include.text', 'ccc');

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@color-label').should('not.include.text', 'ccc');

		/**
		 * Active
		 */
		addBlockState('active');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@color-label').should('not.include.text', 'ccc');

		/**
		 * Laptop device (Active)
		 */
		setDeviceType('Laptop');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@color-label').should('not.include.text', 'ccc');

		/**
		 * Laptop device (Normal)
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName(
			'Background',
			'BG Color',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@color-label').should('not.include.text', 'ccc');

		// Assert state graph
		cy.checkStateGraph('Background', 'BG Color', { tablet: ['Hover'] });
	});

	describe('reset action testing...', () => {
		beforeEach(() => {
			// Set value in normal/laptop
			cy.setColorControlValue('BG Color', 'ccc');

			// Set value in hover/laptop
			addBlockState('hover');
			cy.setColorControlValue('BG Color', 'bbb');

			// Set value in hover/tablet
			setDeviceType('Tablet');
			cy.setColorControlValue('BG Color', 'aaa');

			// Set value in normal/tablet
			setBlockState('Normal');
			cy.setColorControlValue('BG Color', 'eee');

			context(
				'should correctly reset blockeraBackgroundColor, and display effected fields(label, control, stateGraph) in normal/tablet',
				() => {
					// Reset to normal
					cy.resetBlockeraAttribute(
						'Background',
						'BG Color',
						'reset'
					);

					// Assert label
					cy.checkLabelClassName(
						'Background',
						'BG Color',
						'changed-in-normal-state'
					);

					// Assert control
					cy.get('@color-label').should('include.text', 'ccc');

					// Assert state graph
					cy.checkStateGraph('Background', 'BG Color', {
						tablet: ['Hover'],
						laptop: ['Hover', 'Normal'],
					});

					// Assert store data
					getWPDataObject().then((data) => {
						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').normal
								.breakpoints.tablet.attributes
						);
					});
				}
			);

			context(
				'should correctly reset blockeraBackgroundColor, and display effected fields(label, control, stateGraph) in hover/tablet',
				() => {
					setBlockState('Hover');
					// Reset to normal
					cy.resetBlockeraAttribute(
						'Background',
						'BG Color',
						'reset'
					);

					// Assert label
					cy.checkLabelClassName(
						'Background',
						'BG Color',
						'changed-in-normal-state'
					);

					// Assert control
					cy.get('@color-label').should('include.text', 'ccc');

					// Assert state graph
					cy.checkStateGraph('Background', 'BG Color', {
						laptop: ['Hover', 'Normal'],
					});

					// Assert store data
					getWPDataObject().then((data) => {
						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').hover
								.breakpoints.tablet.attributes
						);
					});
				}
			);

			context(
				'should correctly reset blockeraBackgroundColor, and display effected fields(label, control, stateGraph) in normal/laptop',
				() => {
					setDeviceType('Laptop');
					setBlockState('Normal');
					// Reset to default
					cy.resetBlockeraAttribute(
						'Background',
						'BG Color',
						'reset'
					);

					// Assert label
					cy.checkLabelClassName(
						'Background',
						'BG Color',
						'changed-in-other-state'
					);

					// Assert control
					cy.get('@color-label').should('include.text', 'None');

					// Assert state graph
					cy.checkStateGraph('Background', 'BG Color', {
						laptop: ['Hover'],
					});

					// Assert store data
					getWPDataObject().then((data) => {
						expect('').to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBackgroundColor')
						);
					});
				}
			);

			context(
				'should correctly reset blockeraBackgroundColor, and display effected fields(label, control, stateGraph) in hover/laptop',
				() => {
					setBlockState('Hover');
					// Reset to normal
					cy.resetBlockeraAttribute(
						'Background',
						'BG Color',
						'reset'
					);

					// Assert label
					cy.checkLabelClassName(
						'Background',
						'BG Color',
						'changed-in-secondary-state',
						'not-have'
					);

					// Assert control
					cy.get('@color-label').should('include.text', 'None');

					// Assert state graph
					cy.checkStateGraph('Background', 'BG Color', {});

					// Assert store data
					getWPDataObject().then((data) => {
						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').hover
								.breakpoints.laptop.attributes
						);
					});
				}
			);
		});

		it('set value in normal/laptop and navigate between states', () => {
			setBlockState('Normal');

			cy.setColorControlValue('BG Color', '1db0cc');

			// Assert label
			cy.checkLabelClassName(
				'Background',
				'BG Color',
				'changed-in-normal-state'
			);
			// Assert control
			cy.get('@color-label').should('include.text', '1db0cc');

			// Assert state graph
			cy.checkStateGraph('Background', 'BG Color', {
				laptop: ['Normal'],
			});

			// Navigate between states and devices
			// Hover/Laptop
			setBlockState('Hover');
			// Assert label
			cy.checkLabelClassName(
				'Background',
				'BG Color',
				'changed-in-normal-state'
			);
			// Assert control
			// TODO: wrong control value
			// cy.get('@color-label').should('include.text', '1db0cc');

			// Assert state graph
			cy.checkStateGraph('Background', 'BG Color', {
				laptop: ['Normal'],
			});

			// Hover/Tablet
			setDeviceType('Tablet');
			// Assert label
			cy.checkLabelClassName(
				'Background',
				'BG Color',
				'changed-in-normal-state'
			);
			// Assert control
			// TODO
			//cy.get('@color-label').should('include.text', '1db0cc');

			// Assert state graph
			cy.checkStateGraph('Background', 'BG Color', {
				laptop: ['Normal'],
			});

			// Normal/Tablet
			setBlockState('Normal');
			// Assert label
			cy.checkLabelClassName(
				'Background',
				'BG Color',
				'changed-in-normal-state'
			);
			// Assert control
			// TODO
			//cy.get('@color-label').should('include.text', '1db0cc');

			// Assert state graph
			cy.checkStateGraph('Background', 'BG Color', {
				laptop: ['Normal'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect('#1db0cc').to.be.eq(
					getSelectedBlock(data, 'blockeraBackgroundColor')
				);

				// TODO
				// expect({}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').normal
				// 		.breakpoints.tablet.attributes
				// );

				// TODO
				// expect({}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').hover
				// 		.breakpoints.laptop.attributes
				// );

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});
		});

		it('set value in hover/laptop and navigate between states', () => {
			cy.setColorControlValue('BG Color', '1db0cc');

			// Assert label
			cy.checkLabelClassName(
				'Background',
				'BG Color',
				'changed-in-secondary-state'
			);

			// Assert control
			cy.get('@color-label').should('include.text', '1db0cc');

			// Assert state graph
			cy.checkStateGraph('Background', 'BG Color', {
				laptop: ['Hover'],
			});

			// Navigate between states and devices:
			// Normal/Laptop
			setBlockState('Normal');
			// Assert label
			cy.checkLabelClassName(
				'Background',
				'BG Color',
				'changed-in-other-state'
			);

			// Assert control
			cy.get('@color-label').should('include.text', 'None');

			// Assert state graph
			cy.checkStateGraph('Background', 'BG Color', {
				laptop: ['Hover'],
			});

			// Normal/Tablet
			setDeviceType('Tablet');
			// Assert label
			cy.checkLabelClassName(
				'Background',
				'BG Color',
				'changed-in-other-state'
			);

			// Assert control
			// TODO
			//cy.get('@color-label').should('include.text', 'None');

			// Assert state graph
			cy.checkStateGraph('Background', 'BG Color', {
				laptop: ['Hover'],
			});

			// Hover/Tablet
			setBlockState('Hover');
			// Assert label
			cy.checkLabelClassName(
				'Background',
				'BG Color',
				'changed-in-other-state'
			);

			// Assert control
			// TODO
			//cy.get('@color-label').should('include.text', 'None');

			// Assert state graph
			cy.checkStateGraph('Background', 'BG Color', {
				laptop: ['Hover'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect('').to.be.eq(
					getSelectedBlock(data, 'blockeraBackgroundColor')
				);

				// TODO
				// expect({}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').normal
				// 		.breakpoints.tablet.attributes
				// );

				expect({
					blockeraBackgroundColor: '#1db0cc',
				}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.laptop.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});
		});
	});

	describe('reset-all action testing...', () => {
		beforeEach(() => {
			// Set value in normal/laptop
			cy.setColorControlValue('BG Color', 'ccc');

			// Set value in hover/laptop
			addBlockState('hover');
			cy.setColorControlValue('BG Color', 'bbb');

			// Set value in hover/tablet
			setDeviceType('Tablet');
			cy.setColorControlValue('BG Color', 'aaa');

			// Set value in normal/tablet
			setBlockState('Normal');
			cy.setColorControlValue('BG Color', 'eee');

			// Reset All
			cy.resetBlockeraAttribute('Background', 'BG Color', 'reset-all');

			context(
				'should correctly reset blockeraBackgroundColor, and display effected fields(label, control, stateGraph) in all states',
				() => {
					// Normal/Tablet
					// Assert label
					cy.checkLabelClassName(
						'Background',
						'BG Color',
						'changed-in-normal-state',
						'not-have'
					);

					// Assert control
					cy.get('@color-label').should('include.text', 'None');

					// Assert state graph
					cy.checkStateGraph('Background', 'BG Color', {});

					// Hover/Tablet
					setBlockState('Hover');
					// Assert label
					cy.checkLabelClassName(
						'Background',
						'BG Color',
						'changed-in-secondary-state',
						'not-have'
					);

					// Assert control
					cy.get('@color-label').should('include.text', 'None');

					// Assert state graph
					cy.checkStateGraph('Background', 'BG Color', {});

					// Hover/Laptop
					setDeviceType('Laptop');
					// Assert label
					cy.checkLabelClassName(
						'Background',
						'BG Color',
						'changed-in-secondary-state',
						'not-have'
					);

					// Assert control
					cy.get('@color-label').should('include.text', 'None');

					// Assert state graph
					cy.checkStateGraph('Background', 'BG Color', {});

					// Normal/Laptop
					setBlockState('Normal');
					// Assert label
					cy.checkLabelClassName(
						'Background',
						'BG Color',
						'changed-in-normal-state',
						'not-have'
					);

					// Assert control
					cy.get('@color-label').should('include.text', 'None');

					// Assert state graph
					cy.checkStateGraph('Background', 'BG Color', {});

					// Assert store data
					getWPDataObject().then((data) => {
						expect('').to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBackgroundColor')
						);

						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').normal
								.breakpoints.tablet.attributes
						);

						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').hover
								.breakpoints.laptop.attributes
						);

						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').hover
								.breakpoints.tablet.attributes
						);
					});
				}
			);
		});

		it('set value in normal/laptop and navigate between states', () => {
			cy.setColorControlValue('BG Color', '{selectall}c4c4c4');

			// Assert label
			cy.checkLabelClassName(
				'Background',
				'BG Color',
				'changed-in-normal-state'
			);

			// Assert control
			cy.get('@color-label').should('include.text', 'c4c4c4');

			// Assert state graph
			cy.checkStateGraph('Background', 'BG Color', {
				laptop: ['Normal'],
			});

			// Navigate between states and devices
			// Hover/Laptop
			setBlockState('Hover');
			// Assert label
			cy.checkLabelClassName(
				'Background',
				'BG Color',
				'changed-in-normal-state'
			);

			// Assert control
			// TODO
			//cy.get('@color-label').should('include.text', 'c4c4c4');

			// Assert state graph
			cy.checkStateGraph('Background', 'BG Color', {
				laptop: ['Normal'],
			});

			// Hover/Tablet
			setDeviceType('Tablet');
			// Assert label
			cy.checkLabelClassName(
				'Background',
				'BG Color',
				'changed-in-normal-state'
			);

			// Assert control
			// TODO
			//cy.get('@color-label').should('include.text', 'c4c4c4');

			// Assert state graph
			cy.checkStateGraph('Background', 'BG Color', {
				laptop: ['Normal'],
			});

			// Normal/Laptop
			setBlockState('Normal');
			// Assert label
			cy.checkLabelClassName(
				'Background',
				'BG Color',
				'changed-in-normal-state'
			);

			// Assert control
			// TODO
			//	cy.get('@color-label').should('include.text', 'c4c4c4');

			// Assert state graph
			cy.checkStateGraph('Background', 'BG Color', {
				laptop: ['Normal'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect('#c4c4c4').to.be.eq(
					getSelectedBlock(data, 'blockeraBackgroundColor')
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.laptop.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});
		});

		it('set value in hover/laptop and navigate between states', () => {
			setBlockState('Hover');

			cy.setColorControlValue('BG Color', '{selectall}c4c4c4');

			// Assert label
			cy.checkLabelClassName(
				'Background',
				'BG Color',
				'changed-in-secondary-state'
			);

			// Assert control
			cy.get('@color-label').should('include.text', 'c4c4c4');

			// Assert state graph
			cy.checkStateGraph('Background', 'BG Color', {
				laptop: ['Hover'],
			});

			// Navigate between states and devices
			// Normal/Laptop
			setBlockState('Normal');
			// Assert label
			cy.checkLabelClassName(
				'Background',
				'BG Color',
				'changed-in-other-state'
			);

			// Assert control
			cy.get('@color-label').should('include.text', 'None');

			// Assert state graph
			cy.checkStateGraph('Background', 'BG Color', {
				laptop: ['Hover'],
			});

			// Normal/Tablet
			setDeviceType('Tablet');
			// Assert label
			cy.checkLabelClassName(
				'Background',
				'BG Color',
				'changed-in-other-state'
			);

			// Assert control
			cy.get('@color-label').should('include.text', 'None');

			// Assert state graph
			cy.checkStateGraph('Background', 'BG Color', {
				laptop: ['Hover'],
			});

			// Hover/Tablet
			setBlockState('Hover');
			// Assert label
			cy.checkLabelClassName(
				'Background',
				'BG Color',
				'changed-in-other-state'
			);

			// Assert control
			cy.get('@color-label').should('include.text', 'None');

			// Assert state graph
			cy.checkStateGraph('Background', 'BG Color', {
				laptop: ['Hover'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect('').to.be.eq(
					getSelectedBlock(data, 'blockeraBackgroundColor')
				);

				// TODO
				//expect({}).to.be.deep.eq(
				//	getSelectedBlock(data, 'blockeraBlockStates').normal
				//		.breakpoints.tablet.attributes
				//);

				expect({
					blockeraBackgroundColor: '#c4c4c4',
				}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.laptop.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});
		});
	});
});
