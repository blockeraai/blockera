import {
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	createPost,
	setBlockState,
	addBlockState,
	setDeviceType,
} from '../../../../../dev-cypress/js/helpers';

describe('Select Control label testing (Position)', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		// Alias
		cy.getParentContainer('Position').as('position-container');
	});

	it('should display changed value on Position -> Normal -> Laptop', () => {
		// Assert label before set value
		cy.checkLabelClassName(
			'Position',
			'Position',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		cy.get('@position-container').within(() => {
			cy.customSelect('Relative');
		});

		// Assert label after set value
		cy.checkLabelClassName(
			'Position',
			'Position',
			'changed-in-normal-state'
		);

		// Assert control
		cy.get('@position-container').within(() => {
			cy.contains('Relative');
		});

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Position',
			'changed-in-normal-state'
		);
		// Assert control
		cy.get('@position-container').within(() => {
			cy.contains('Relative');
		});

		/**
		 * Pseudo State (Hover/Tablet)
		 */
		addBlockState('hover');

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Position',
			'changed-in-normal-state'
		);
		// Assert control
		cy.get('@position-container').within(() => {
			cy.contains('Relative');
		});

		// Assert state graph
		cy.checkStateGraph('Position', 'Position', { laptop: ['Normal'] });
	});

	it('should display changed value on Position -> Hover -> Laptop', () => {
		/**
		 * Hover
		 */
		addBlockState('hover');

		// Assert label before set value
		cy.checkLabelClassName(
			'Position',
			'Position',
			'changed-in-secondary-state',
			'not-have'
		);

		// Set value
		cy.get('@position-container').within(() => {
			cy.customSelect('Relative');
		});

		// Assert label after set value
		cy.checkLabelClassName(
			'Position',
			'Position',
			'changed-in-secondary-state'
		);
		// Assert control
		cy.get('@position-container').within(() => {
			cy.contains('Relative');
		});

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Position',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@position-container').within(() => {
			cy.contains('Relative').should('not.exist');
		});

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Position',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@position-container').within(() => {
			cy.contains('Relative').should('not.exist');
		});

		// Assert state graph
		cy.checkStateGraph('Position', 'Position', { laptop: ['Hover'] });
	});

	it('should display changed value on Position, when set value in two states', () => {
		/**
		 * Normal
		 */
		// Set value
		cy.get('@position-container').within(() => {
			cy.customSelect('Relative');
		});

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Position',
			'changed-in-normal-state'
		);

		/**
		 * Hover
		 */
		addBlockState('hover');

		// Assert label before set value
		cy.checkLabelClassName(
			'Position',
			'Position',
			'changed-in-normal-state'
		);

		// Set value
		cy.get('@position-container').within(() => {
			cy.customSelect('Absolute');
		});

		// Assert label after set value
		cy.checkLabelClassName(
			'Position',
			'Position',
			'changed-in-secondary-state'
		);

		// Assert control
		cy.get('@position-container').within(() => {
			cy.contains('Absolute');
		});

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Position',
			'changed-in-normal-state'
		);

		// Assert control
		cy.get('@position-container').within(() => {
			cy.contains('Relative');
		});

		// Assert state graph
		cy.checkStateGraph('Position', 'Position', {
			laptop: ['Normal', 'Hover'],
		});
	});

	it('should display changed value on Position -> Normal -> Mobile', () => {
		setDeviceType('Mobile');
		// Assert label before set value
		cy.checkLabelClassName(
			'Position',
			'Position',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		cy.get('@position-container').within(() => {
			cy.customSelect('Relative');
		});

		// Assert label after set value
		cy.checkLabelClassName(
			'Position',
			'Position',
			'changed-in-normal-state'
		);

		// Assert control
		cy.get('@position-container').within(() => {
			cy.contains('Relative');
		});

		/**
		 * Laptop device
		 */
		setDeviceType('Laptop');

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Position',
			'changed-in-other-state'
		);
		// Assert control
		cy.get('@position-container').within(() => {
			cy.contains('Relative').should('not.exist');
		});

		// Assert state graph
		cy.checkStateGraph('Position', 'Position', { mobile: ['Normal'] });
	});

	it('should display changed value on Position -> Hover -> Mobile', () => {
		setDeviceType('Mobile');
		/**
		 * Hover
		 */
		addBlockState('hover');
		// Assert label before set value
		cy.checkLabelClassName(
			'Position',
			'Position',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		cy.get('@position-container').within(() => {
			cy.customSelect('Relative');
		});

		// Assert label after set value
		cy.checkLabelClassName(
			'Position',
			'Position',
			'changed-in-secondary-state'
		);
		// Assert control
		cy.get('@position-container').within(() => {
			cy.contains('Relative');
		});

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Position',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@position-container').within(() => {
			cy.contains('Relative').should('not.exist');
		});

		/**
		 * Laptop device (Active)
		 */
		setDeviceType('Laptop');

		// Assert label
		cy.checkLabelClassName(
			'Position',
			'Position',
			'changed-in-other-state'
		);

		// Assert control
		cy.get('@position-container').within(() => {
			cy.contains('Relative').should('not.exist');
		});

		// Assert state graph
		cy.checkStateGraph('Position', 'Position', { mobile: ['Hover'] });
	});

	describe('reset action testing...', () => {
		beforeEach(() => {
			// Set value in normal/laptop
			cy.get('@position-container').within(() => {
				cy.customSelect('Relative');
			});

			// Set value in hover/laptop
			addBlockState('hover');
			cy.get('@position-container').within(() => {
				cy.customSelect('Absolute');
			});

			// Set value in hover/tablet
			setDeviceType('Tablet');
			cy.get('@position-container').within(() => {
				cy.customSelect('Fixed');
			});

			// Set value in normal/tablet
			setBlockState('Normal');
			cy.get('@position-container').within(() => {
				cy.customSelect('Sticky');
			});

			context(
				'should correctly reset blockeraPosition, and display effected fields(label, control, stateGraph) in normal/tablet',
				() => {
					// Reset to default
					cy.resetBlockeraAttribute('Position', 'Position', 'reset');

					// Assert label
					cy.checkLabelClassName(
						'Position',
						'Position',
						'changed-in-normal-state'
					);

					// Assert control
					cy.get('@position-container').within(() => {
						cy.contains('Relative');
					});

					// Assert state graph
					cy.checkStateGraph('Position', 'Position', {
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
				'should correctly reset blockeraPosition, and display effected fields(label, control, stateGraph) in hover/tablet',
				() => {
					setBlockState('Hover');
					// Reset to default
					cy.resetBlockeraAttribute('Position', 'Position', 'reset');

					// // Assert label
					cy.checkLabelClassName(
						'Position',
						'Position',
						'changed-in-normal-state'
					);

					// Assert control
					cy.get('@position-container').within(() => {
						cy.contains('Relative');
					});

					// Assert state graph
					cy.checkStateGraph('Position', 'Position', {
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
				'should correctly reset blockeraPosition, and display effected fields(label, control, stateGraph) in normal/laptop',
				() => {
					setDeviceType('Laptop');
					setBlockState('Normal');
					// Reset to default
					cy.resetBlockeraAttribute('Position', 'Position', 'reset');

					// Assert label
					cy.checkLabelClassName(
						'Position',
						'Position',
						'changed-in-other-state'
					);

					//Assert control
					cy.get('@position-container').within(() => {
						cy.contains('Default');
					});

					// Assert state graph
					cy.checkStateGraph('Position', 'Position', {
						laptop: ['Hover'],
					});

					// Assert store data
					getWPDataObject().then((data) => {
						expect({
							type: 'static',
							position: {
								top: '',
								right: '',
								left: '',
								bottom: '',
							},
						}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraPosition')
						);
					});
				}
			);

			context(
				'should correctly reset blockeraPosition, and display effected fields(label, control, stateGraph) in hover/tablet',
				() => {
					setBlockState('Hover');
					// Reset to default
					cy.resetBlockeraAttribute('Position', 'Position', 'reset');

					// Assert label
					cy.checkLabelClassName(
						'Position',
						'Position',
						'changed-in-secondary-state',
						'not-have'
					);

					// Assert control
					cy.get('@position-container').within(() => {
						cy.contains('Default');
					});

					// Assert state graph
					cy.checkStateGraph('Position', 'Position', {});

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

		it('set value in normal/laptop(root) and navigate between states', () => {
			setBlockState('Normal');
			// Set value
			cy.get('@position-container').within(() => {
				cy.customSelect('Sticky');
			});

			// Assert label
			cy.checkLabelClassName(
				'Position',
				'Position',
				'changed-in-normal-state'
			);

			// Assert control
			cy.get('@position-container').within(() => {
				cy.contains('Sticky');
			});

			// Assert state graph
			cy.checkStateGraph('Position', 'Position', {
				laptop: ['Normal'],
			});

			// Navigate between states :
			// Hover/Laptop
			setBlockState('Hover');

			// Assert label
			cy.checkLabelClassName(
				'Position',
				'Position',
				'changed-in-normal-state'
			);

			// Assert control
			cy.get('@position-container').within(() => {
				cy.contains('Sticky');
			});

			// Assert state graph
			cy.checkStateGraph('Position', 'Position', {
				laptop: ['Normal'],
			});

			// Hover/Tablet
			setDeviceType('Tablet');

			// Assert label
			cy.checkLabelClassName(
				'Position',
				'Position',
				'changed-in-normal-state'
			);

			// Assert control
			cy.get('@position-container').within(() => {
				cy.contains('Sticky');
			});

			// Assert state graph
			cy.checkStateGraph('Position', 'Position', {
				laptop: ['Normal'],
			});

			// Normal/Tablet
			setBlockState('Normal');
			// Assert label
			cy.checkLabelClassName(
				'Position',
				'Position',
				'changed-in-normal-state'
			);

			// Assert control
			cy.get('@position-container').within(() => {
				cy.contains('Sticky');
			});

			// Assert state graph
			cy.checkStateGraph('Position', 'Position', {
				laptop: ['Normal'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					type: 'sticky',
					position: {
						top: '',
						right: '',
						left: '',
						bottom: '',
					},
				}).to.be.deep.eq(getSelectedBlock(data, 'blockeraPosition'));

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.laptop.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});
		});

		it('set value in hover/laptop and navigate between states', () => {
			// Set value
			cy.get('@position-container').within(() => {
				cy.customSelect('Sticky');
			});

			// Assert label
			cy.checkLabelClassName(
				'Position',
				'Position',
				'changed-in-secondary-state'
			);

			// Assert control
			cy.get('@position-container').within(() => {
				cy.contains('Sticky');
			});

			// Assert state graph
			cy.checkStateGraph('Position', 'Position', {
				laptop: ['Hover'],
			});

			// Navigate between states :
			// Normal/Laptop
			setBlockState('Normal');

			// Assert label
			cy.checkLabelClassName(
				'Position',
				'Position',
				'changed-in-other-state'
			);

			// Assert control
			cy.get('@position-container').within(() => {
				cy.contains('Default');
			});

			// Assert state graph
			cy.checkStateGraph('Position', 'Position', {
				laptop: ['Hover'],
			});

			// Normal/Tablet
			setDeviceType('Tablet');
			// Assert label
			cy.checkLabelClassName(
				'Position',
				'Position',
				'changed-in-other-state'
			);

			// Assert control
			cy.get('@position-container').within(() => {
				cy.contains('Default');
			});

			// Assert state graph
			cy.checkStateGraph('Position', 'Position', {
				laptop: ['Hover'],
			});

			// Hover/Tablet
			setBlockState('Hover');

			// Assert label
			cy.checkLabelClassName(
				'Position',
				'Position',
				'changed-in-other-state'
			);

			// Assert control
			cy.get('@position-container').within(() => {
				cy.contains('Default');
			});

			// Assert state graph
			cy.checkStateGraph('Position', 'Position', {
				laptop: ['Hover'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					type: 'sticky',
					position: { top: '', left: '', right: '', bottom: '' },
				}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.laptop.attributes.blockeraPosition
				);

				expect({
					type: 'static',
					position: {
						top: '',
						left: '',
						right: '',
						bottom: '',
					},
				}).to.be.deep.eq(getSelectedBlock(data, 'blockeraPosition'));

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes
				);
			});
		});
	});

	describe('reset-all action testing...', () => {
		beforeEach(() => {
			// Set value in normal/laptop
			cy.get('@position-container').within(() => {
				cy.customSelect('Relative');
			});

			// Set value in hover/laptop
			addBlockState('hover');
			cy.get('@position-container').within(() => {
				cy.customSelect('Absolute');
			});

			// Set value in hover/tablet
			setDeviceType('Tablet');
			cy.get('@position-container').within(() => {
				cy.customSelect('Fixed');
			});

			// Set value in normal/tablet
			setBlockState('Normal');
			cy.get('@position-container').within(() => {
				cy.customSelect('Sticky');
			});

			// Reset All
			cy.resetBlockeraAttribute('Position', 'Position', 'reset-all');

			context(
				'should correctly reset blockeraPosition, and display effected fields(label, control, stateGraph) in all states',
				() => {
					// Normal/Tablet
					// Assert label
					cy.checkLabelClassName(
						'Position',
						'Position',
						'changed-in-normal-state',
						'not-have'
					);

					// Assert control
					cy.get('@position-container').within(() => {
						cy.contains('Default');
					});

					// Assert state graph
					cy.checkStateGraph('Position', 'Position', {});

					// Hover/Tablet
					setBlockState('Hover');
					// Assert label
					cy.checkLabelClassName(
						'Position',
						'Position',
						'changed-in-normal-state',
						'not-have'
					);

					// Assert control
					cy.get('@position-container').within(() => {
						cy.contains('Default');
					});

					// Assert state graph
					cy.checkStateGraph('Position', 'Position', {});

					// Hover/Laptop
					setDeviceType('Laptop');
					// Assert label
					cy.checkLabelClassName(
						'Position',
						'Position',
						'changed-in-normal-state',
						'not-have'
					);

					// Assert control
					cy.get('@position-container').within(() => {
						cy.contains('Default');
					});

					// Assert state graph
					cy.checkStateGraph('Position', 'Position', {});

					// Normal/Laptop
					setBlockState('Normal');
					// Assert label
					cy.checkLabelClassName(
						'Position',
						'Position',
						'changed-in-normal-state',
						'not-have'
					);

					// Assert control
					cy.get('@position-container').within(() => {
						cy.contains('Default');
					});

					// Assert state graph
					cy.checkStateGraph('Position', 'Position', {});

					// Assert store data
					getWPDataObject().then((data) => {
						expect('static').to.be.deep.eq(
							getSelectedBlock(data, 'blockeraPosition').type
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
			// Set value
			cy.get('@position-container').within(() => {
				cy.customSelect('Sticky');
			});

			// Assert label
			cy.checkLabelClassName(
				'Position',
				'Position',
				'changed-in-normal-state'
			);

			// Assert control
			cy.get('@position-container').within(() => {
				cy.contains('Sticky');
			});

			// Assert state graph
			cy.checkStateGraph('Position', 'Position', { laptop: ['Normal'] });

			// Navigate between states and devices
			// Hover/Laptop
			setBlockState('Hover');
			// Assert label
			cy.checkLabelClassName(
				'Position',
				'Position',
				'changed-in-normal-state'
			);

			// Assert control
			cy.get('@position-container').within(() => {
				cy.contains('Sticky');
			});

			// Assert state graph
			cy.checkStateGraph('Position', 'Position', { laptop: ['Normal'] });

			// Hover/Tablet
			setDeviceType('Tablet');
			// Assert label
			cy.checkLabelClassName(
				'Position',
				'Position',
				'changed-in-normal-state'
			);

			cy.get('@position-container').within(() => {
				cy.contains('Sticky');
			});

			// Assert state graph
			cy.checkStateGraph('Position', 'Position', { laptop: ['Normal'] });

			// Normal/Tablet
			setBlockState('Normal');
			// Assert label
			cy.checkLabelClassName(
				'Position',
				'Position',
				'changed-in-normal-state'
			);

			// Assert control
			cy.get('@position-container').within(() => {
				cy.contains('Sticky');
			});

			// Assert state graph
			cy.checkStateGraph('Position', 'Position', { laptop: ['Normal'] });

			// Assert store data
			getWPDataObject().then((data) => {
				expect('sticky').to.be.eq(
					getSelectedBlock(data, 'blockeraPosition').type
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

			// Set value
			cy.get('@position-container').within(() => {
				cy.customSelect('Sticky');
			});

			// Assert label
			cy.checkLabelClassName(
				'Position',
				'Position',
				'changed-in-secondary-state'
			);

			// Assert control
			cy.get('@position-container').within(() => {
				cy.contains('Sticky');
			});

			// Assert state graph
			cy.checkStateGraph('Position', 'Position', { laptop: ['Hover'] });

			// Navigate between states and devices
			// Normal/Laptop
			setBlockState('Normal');
			// Assert label
			cy.checkLabelClassName(
				'Position',
				'Position',
				'changed-in-other-state'
			);

			// Assert control
			cy.get('@position-container').within(() => {
				cy.contains('Default');
			});

			// Assert state graph
			cy.checkStateGraph('Position', 'Position', { laptop: ['Hover'] });

			// Normal/Tablet
			setDeviceType('Tablet');

			// Assert label
			cy.checkLabelClassName(
				'Position',
				'Position',
				'changed-in-other-state'
			);

			// Assert control
			cy.get('@position-container').within(() => {
				cy.contains('Default');
			});

			// Assert state graph
			cy.checkStateGraph('Position', 'Position', { laptop: ['Hover'] });

			// Hover/Tablet
			setBlockState('Hover');

			// Assert label
			cy.checkLabelClassName(
				'Position',
				'Position',
				'changed-in-other-state'
			);

			// Assert control
			cy.get('@position-container').within(() => {
				cy.contains('Default');
			});

			// Assert state graph
			cy.checkStateGraph('Position', 'Position', { laptop: ['Hover'] });

			// Assert store data
			getWPDataObject().then((data) => {
				expect('static').to.be.eq(
					getSelectedBlock(data, 'blockeraPosition').type
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes
				);

				expect({
					blockeraPosition: {
						type: 'sticky',
						position: { top: '', left: '', right: '', bottom: '' },
					},
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
