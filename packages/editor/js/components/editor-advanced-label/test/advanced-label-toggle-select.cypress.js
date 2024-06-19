import {
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	createPost,
	setBlockState,
	addBlockState,
	setDeviceType,
} from '../../../../../dev-cypress/js/helpers';

describe('Toggle Select Control label testing (Overflow)', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');
	});

	it('should display changed value on Overflow -> Normal -> Laptop', () => {
		// Assert label before set value
		cy.checkLabelClassName(
			'Size',
			'Overflow',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		cy.getByAriaLabel('Hidden Overflow').click();

		// Assert label after set value
		cy.checkLabelClassName('Size', 'Overflow', 'changed-in-normal-state');

		// Assert control
		cy.getByAriaLabel('Hidden Overflow').should(
			'have.attr',
			'aria-pressed',
			'true'
		);

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName('Size', 'Overflow', 'changed-in-normal-state');

		// Assert control
		cy.getByAriaLabel('Hidden Overflow').should(
			'have.attr',
			'aria-pressed',
			'true'
		);

		/**
		 * Pseudo State (Hover/Tablet)
		 */
		addBlockState('hover');

		// Assert label
		cy.checkLabelClassName('Size', 'Overflow', 'changed-in-normal-state');

		// Assert control
		cy.getByAriaLabel('Hidden Overflow').should(
			'have.attr',
			'aria-pressed',
			'true'
		);

		// Assert state graph
		cy.checkStateGraph('Size', 'Overflow', { laptop: ['Normal'] });
	});

	it('should display changed value on Overflow -> Hover -> Laptop', () => {
		/**
		 * Hover
		 */
		addBlockState('hover');
		// Assert label before set value
		cy.checkLabelClassName(
			'Size',
			'Overflow',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		cy.getByAriaLabel('Hidden Overflow').click();

		// Assert label after set value
		cy.checkLabelClassName(
			'Size',
			'Overflow',
			'changed-in-secondary-state'
		);
		// Assert control
		cy.getByAriaLabel('Hidden Overflow').should(
			'have.attr',
			'aria-pressed',
			'true'
		);

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label in normal state
		cy.checkLabelClassName('Size', 'Overflow', 'changed-in-other-state');

		// Assert control in normal state
		cy.getByAriaLabel('Hidden Overflow').should(
			'not.have.attr',
			'aria-pressed',
			'true'
		);
		/**
		 * Active
		 */
		addBlockState('active');

		// Assert label
		cy.checkLabelClassName('Size', 'Overflow', 'changed-in-other-state');

		// Assert control
		cy.getByAriaLabel('Hidden Overflow').should(
			'not.have.attr',
			'aria-pressed',
			'true'
		);

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName('Size', 'Overflow', 'changed-in-other-state');

		// Assert control
		cy.getByAriaLabel('Hidden Overflow').should(
			'not.have.attr',
			'aria-pressed',
			'true'
		);
		// Assert state graph
		cy.checkStateGraph('Size', 'Overflow', { laptop: ['Hover'] });
	});

	it('should display changed value on Overflow, when set value in two states', () => {
		/**
		 * Normal
		 */
		// Set value
		cy.getByAriaLabel('Hidden Overflow').click();

		// Assert label
		cy.checkLabelClassName('Size', 'Overflow', 'changed-in-normal-state');

		/**
		 * Hover
		 */
		addBlockState('hover');

		// Assert label before set value
		cy.checkLabelClassName('Size', 'Overflow', 'changed-in-normal-state');

		// Set value
		cy.getByAriaLabel('Visible Overflow').click();

		// Assert label after set value
		cy.checkLabelClassName(
			'Size',
			'Overflow',
			'changed-in-secondary-state'
		);

		// Assert control
		cy.getByAriaLabel('Visible Overflow').should(
			'have.attr',
			'aria-pressed',
			'true'
		);

		/**
		 * Active
		 */
		addBlockState('active');

		// Assert label
		cy.checkLabelClassName('Size', 'Overflow', 'changed-in-normal-state');

		// Assert control
		cy.getByAriaLabel('Hidden Overflow').should(
			'have.attr',
			'aria-pressed',
			'true'
		);

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label
		cy.checkLabelClassName('Size', 'Overflow', 'changed-in-normal-state');

		// Assert control
		cy.getByAriaLabel('Hidden Overflow').should(
			'have.attr',
			'aria-pressed',
			'true'
		);
		// Assert state graph
		cy.checkStateGraph('Size', 'Overflow', {
			laptop: ['Normal', 'Hover'],
		});
	});

	it('should display changed value on Overflow -> Normal -> Tablet', () => {
		setDeviceType('Tablet');
		// Assert label before set value
		cy.checkLabelClassName(
			'Size',
			'Overflow',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		cy.getByAriaLabel('Hidden Overflow').click();

		// Assert label after set value
		cy.checkLabelClassName('Size', 'Overflow', 'changed-in-normal-state');

		// Assert control
		cy.getByAriaLabel('Hidden Overflow').should(
			'have.attr',
			'aria-pressed',
			'true'
		);

		/**
		 * Laptop device
		 */
		setDeviceType('Laptop');

		// Assert label
		cy.checkLabelClassName('Size', 'Overflow', 'changed-in-other-state');

		// Assert control
		cy.getByAriaLabel('Hidden Overflow').should(
			'not.have.attr',
			'aria-pressed',
			'true'
		);

		// Assert state graph
		cy.checkStateGraph('Size', 'Overflow', { tablet: ['Normal'] });
	});

	it('should display changed value on Overflow -> Hover -> Tablet', () => {
		setDeviceType('Tablet');
		/**
		 * Hover
		 */
		addBlockState('hover');
		// Assert label before set value
		cy.checkLabelClassName(
			'Size',
			'Overflow',
			'changed-in-normal-state',
			'not-have'
		);

		// Set value
		cy.getByAriaLabel('Hidden Overflow').click();

		// Assert label after set value
		cy.checkLabelClassName(
			'Size',
			'Overflow',
			'changed-in-secondary-state'
		);
		// Assert control
		cy.getByAriaLabel('Hidden Overflow').should(
			'have.attr',
			'aria-pressed',
			'true'
		);

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label in normal state
		cy.checkLabelClassName('Size', 'Overflow', 'changed-in-other-state');

		// Assert control in normal state
		cy.getByAriaLabel('Hidden Overflow').should(
			'not.have.attr',
			'aria-pressed',
			'true'
		);
		/**
		 * Active
		 */
		addBlockState('active');

		// Assert label
		cy.checkLabelClassName('Size', 'Overflow', 'changed-in-other-state');

		// Assert control
		cy.getByAriaLabel('Hidden Overflow').should(
			'not.have.attr',
			'aria-pressed',
			'true'
		);

		/**
		 * Laptop device
		 */
		setDeviceType('Laptop');

		// Assert label
		cy.checkLabelClassName('Size', 'Overflow', 'changed-in-other-state');

		// Assert control
		cy.getByAriaLabel('Hidden Overflow').should(
			'not.have.attr',
			'aria-pressed',
			'true'
		);

		/**
		 * Normal (laptop)
		 */
		setBlockState('Normal');

		// Assert label
		cy.checkLabelClassName('Size', 'Overflow', 'changed-in-other-state');

		// Assert control
		cy.getByAriaLabel('Hidden Overflow').should(
			'not.have.attr',
			'aria-pressed',
			'true'
		);

		// Assert state graph
		cy.checkStateGraph('Size', 'Overflow', { tablet: ['Hover'] });
	});

	describe('reset action testing...', () => {
		beforeEach(() => {
			// Set value in normal/laptop
			cy.getByAriaLabel('Visible Overflow').click();

			// Set value in hover/laptop
			addBlockState('hover');
			cy.getByAriaLabel('Hidden Overflow').click();

			// Set value in hover/tablet
			setDeviceType('Tablet');
			cy.getByAriaLabel('Scroll Overflow').click();

			// Set value in normal/tablet
			setBlockState('Normal');
			cy.getByAriaLabel('Hidden Overflow').click();

			context(
				'should correctly reset blockeraOverflow, and display effected fields(label, control, stateGraph) in normal/tablet',
				() => {
					// Reset to normal
					cy.resetBlockeraAttribute('Size', 'Overflow', 'reset');

					// Assert label
					cy.checkLabelClassName(
						'Size',
						'Overflow',
						'changed-in-normal-state'
					);

					// Assert control
					cy.getByAriaLabel('Visible Overflow').should(
						'have.attr',
						'aria-pressed',
						'true'
					);

					// Assert state graph
					cy.checkStateGraph('Size', 'Overflow', {
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
				'should correctly reset blockeraOverflow, and display effected fields(label, control, stateGraph) in hover/tablet',
				() => {
					setBlockState('Hover');
					// Reset to normal
					cy.resetBlockeraAttribute('Size', 'Overflow', 'reset');

					// Assert label
					cy.checkLabelClassName(
						'Size',
						'Overflow',
						'changed-in-normal-state'
					);

					// Assert control
					cy.getByAriaLabel('Visible Overflow').should(
						'have.attr',
						'aria-pressed',
						'true'
					);

					// Assert state graph
					cy.checkStateGraph('Size', 'Overflow', {
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
				'should correctly reset blockeraOverflow, and display effected fields(label, control, stateGraph) in normal/laptop',
				() => {
					setDeviceType('Laptop');
					setBlockState('Normal');
					// Reset to default
					cy.resetBlockeraAttribute('Size', 'Overflow', 'reset');

					// Assert label
					cy.checkLabelClassName(
						'Size',
						'Overflow',
						'changed-in-other-state'
					);
					// Assert control
					cy.getByAriaLabel('Visible Overflow').should(
						'not.have.attr',
						'aria-pressed',
						'true'
					);

					// Assert state graph
					cy.checkStateGraph('Size', 'Overflow', {
						laptop: ['Hover'],
					});

					// Assert store data
					getWPDataObject().then((data) => {
						expect('').to.be.deep.eq(
							getSelectedBlock(data, 'blockeraOverflow')
						);
					});
				}
			);

			context(
				'should correctly reset blockeraOverflow, and display effected fields(label, control, stateGraph) in hover/laptop',
				() => {
					setBlockState('Hover');
					// Reset to default
					cy.resetBlockeraAttribute('Size', 'Overflow', 'reset');

					// Assert label
					cy.checkLabelClassName(
						'Size',
						'Overflow',
						'changed-in-secondary-state',
						'not-have'
					);

					// Assert control
					cy.getByAriaLabel('Visible Overflow').should(
						'not.have.attr',
						'aria-pressed',
						'true'
					);
					cy.getByAriaLabel('Hidden Overflow').should(
						'not.have.attr',
						'aria-pressed',
						'true'
					);

					// Assert state graph
					cy.checkStateGraph('Size', 'Overflow', {});

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
			// Set value
			cy.getByAriaLabel('Scroll Overflow').click();

			// Assert state graph
			cy.checkStateGraph('Size', 'Overflow', {
				laptop: ['Normal'],
			});

			// Assert control
			cy.getByAriaLabel('Scroll Overflow').should(
				'have.attr',
				'aria-pressed',
				'true'
			);

			// Navigate between states :
			// Hover/Laptop
			setBlockState('Hover');
			// TODO : no selected item
			// cy.getByAriaLabel('Scroll Overflow').should(
			// 	'have.attr',
			// 	'aria-pressed',
			// 	'true'
			// );
			cy.checkStateGraph('Size', 'Overflow', {
				laptop: ['Normal'],
			});

			// Hover/Tablet
			setDeviceType('Tablet');
			// TODO : wrong control value
			// cy.getByAriaLabel('Scroll Overflow').should(
			// 	'have.attr',
			// 	'aria-pressed',
			// 	'true'
			// );
			cy.checkStateGraph('Size', 'Overflow', {
				laptop: ['Normal'],
			});

			// Normal/Laptop
			setBlockState('Normal');
			// TODO : same bug*
			// cy.getByAriaLabel('Scroll Overflow').should(
			// 	'have.attr',
			// 	'aria-pressed',
			// 	'true'
			// );
			cy.checkStateGraph('Size', 'Overflow', {
				laptop: ['Normal'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect('scroll').to.be.eq(
					getSelectedBlock(data, 'blockeraOverflow')
				);

				// TODO : tablet is not exist in breakpoints
				// expect({}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').normal
				// 		.breakpoints.tablet.attributes
				// );

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.laptop.attributes
				);

				// TODO : tablet is not exist in breakpoints
				// expect({}).to.be.deep.eq(
				// 	getSelectedBlock(data, 'blockeraBlockStates').hover
				// 		.breakpoints.tablet.attributes
				// );
			});
		});

		it('set value in hover/laptop and navigate between states', () => {
			// Set value
			cy.getByAriaLabel('Scroll Overflow').click();

			// Assert state graph
			cy.checkStateGraph('Size', 'Overflow', {
				laptop: ['Hover'],
			});

			// Assert control
			cy.getByAriaLabel('Scroll Overflow').should(
				'have.attr',
				'aria-pressed',
				'true'
			);

			// Navigate between states :
			// Normal/Laptop
			setBlockState('Normal');

			cy.getByAriaLabel('Scroll Overflow').should(
				'not.have.attr',
				'aria-pressed',
				'true'
			);
			cy.getByAriaLabel('Hidden Overflow').should(
				'not.have.attr',
				'aria-pressed',
				'true'
			);
			cy.getByAriaLabel('Visible Overflow').should(
				'not.have.attr',
				'aria-pressed',
				'true'
			);

			cy.checkStateGraph('Size', 'Overflow', {
				laptop: ['Hover'],
			});

			// Normal/Tablet
			setDeviceType('Tablet');
			cy.getByAriaLabel('Scroll Overflow').should(
				'not.have.attr',
				'aria-pressed',
				'true'
			);
			cy.getByAriaLabel('Hidden Overflow').should(
				'not.have.attr',
				'aria-pressed',
				'true'
			);
			// TODO
			// cy.getByAriaLabel('Visible Overflow').should(
			// 	'not.have.attr',
			// 	'aria-pressed',
			// 	'true'
			// );

			cy.checkStateGraph('Size', 'Overflow', {
				laptop: ['Hover'],
			});

			// Hover/Tablet
			setBlockState('Hover');
			cy.getByAriaLabel('Scroll Overflow').should(
				'not.have.attr',
				'aria-pressed',
				'true'
			);
			cy.getByAriaLabel('Hidden Overflow').should(
				'not.have.attr',
				'aria-pressed',
				'true'
			);
			// TODO
			// cy.getByAriaLabel('Visible Overflow').should(
			// 	'not.have.attr',
			// 	'aria-pressed',
			// 	'true'
			// );

			cy.checkStateGraph('Size', 'Overflow', {
				laptop: ['Hover'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect('').to.be.eq(getSelectedBlock(data, 'blockeraOverflow'));

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.laptop.attributes
				);

				expect({ blockeraOverflow: 'scroll' }).to.be.deep.eq(
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
			cy.getByAriaLabel('Visible Overflow').click();

			// Set value in hover/laptop
			addBlockState('hover');
			cy.getByAriaLabel('Hidden Overflow').click();

			// Set value in hover/tablet
			setDeviceType('Tablet');
			cy.getByAriaLabel('Scroll Overflow').click();

			// Set value in normal/tablet
			setBlockState('Normal');
			cy.getByAriaLabel('Hidden Overflow').click();

			// Reset All
			cy.resetBlockeraAttribute('Size', 'Overflow', 'reset-all');

			context(
				'should correctly reset-all blockeraOverflow, and display effected fields(label, control, stateGraph) in all states and devices',
				() => {
					// Normal/Tablet
					// Assert label
					cy.checkLabelClassName(
						'Size',
						'Overflow',
						'changed-in-normal-state',
						'not-have'
					);

					// Assert control
					cy.getByAriaLabel('Visible Overflow').should(
						'not.have.attr',
						'aria-pressed',
						'true'
					);
					cy.getByAriaLabel('Hidden Overflow').should(
						'not.have.attr',
						'aria-pressed',
						'true'
					);
					cy.getByAriaLabel('Scroll Overflow').should(
						'not.have.attr',
						'aria-pressed',
						'true'
					);

					// Assert state graph
					cy.checkStateGraph('Size', 'Overflow', {});

					// Hover/Tablet
					setBlockState('Hover');
					// Assert label
					cy.checkLabelClassName(
						'Size',
						'Overflow',
						'changed-in-secondary-state',
						'not-have'
					);

					// Assert control
					cy.getByAriaLabel('Visible Overflow').should(
						'not.have.attr',
						'aria-pressed',
						'true'
					);
					cy.getByAriaLabel('Hidden Overflow').should(
						'not.have.attr',
						'aria-pressed',
						'true'
					);
					cy.getByAriaLabel('Scroll Overflow').should(
						'not.have.attr',
						'aria-pressed',
						'true'
					);

					// Assert state graph
					cy.checkStateGraph('Size', 'Overflow', {});

					// Hover/Laptop
					setDeviceType('Laptop');
					// Assert label
					cy.checkLabelClassName(
						'Size',
						'Overflow',
						'changed-in-secondary-state',
						'not-have'
					);

					// Assert control
					cy.getByAriaLabel('Visible Overflow').should(
						'not.have.attr',
						'aria-pressed',
						'true'
					);
					cy.getByAriaLabel('Hidden Overflow').should(
						'not.have.attr',
						'aria-pressed',
						'true'
					);
					cy.getByAriaLabel('Scroll Overflow').should(
						'not.have.attr',
						'aria-pressed',
						'true'
					);

					// Assert state graph
					cy.checkStateGraph('Size', 'Overflow', {});

					// Normal/Laptop
					setBlockState('Normal');
					// Assert label
					cy.checkLabelClassName(
						'Size',
						'Overflow',
						'changed-in-normal-state',
						'not-have'
					);

					// Assert control
					cy.getByAriaLabel('Visible Overflow').should(
						'not.have.attr',
						'aria-pressed',
						'true'
					);
					cy.getByAriaLabel('Hidden Overflow').should(
						'not.have.attr',
						'aria-pressed',
						'true'
					);
					cy.getByAriaLabel('Scroll Overflow').should(
						'not.have.attr',
						'aria-pressed',
						'true'
					);

					// Assert state graph
					cy.checkStateGraph('Size', 'Overflow', {});

					// Assert store data
					getWPDataObject().then((data) => {
						expect('').to.be.deep.eq(
							getSelectedBlock(data, 'blockeraOverflow')
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
			cy.getByAriaLabel('Scroll Overflow').click();

			// Assert control
			cy.getByAriaLabel('Scroll Overflow').should(
				'have.attr',
				'aria-pressed',
				'true'
			);

			// Assert label
			cy.checkLabelClassName(
				'Size',
				'Overflow',
				'changed-in-normal-state'
			);

			// Assert state graph
			cy.checkStateGraph('Size', 'Overflow', { laptop: ['Normal'] });

			// Navigate between states and devices :
			// Hover/Laptop
			setBlockState('Hover');
			// Assert control
			// TODO : no selected item
			// cy.getByAriaLabel('Scroll Overflow').should(
			// 	'have.attr',
			// 	'aria-pressed',
			// 	'true'
			// );

			// Assert label
			cy.checkLabelClassName(
				'Size',
				'Overflow',
				'changed-in-normal-state'
			);

			// Assert state graph
			cy.checkStateGraph('Size', 'Overflow', { laptop: ['Normal'] });

			// Hover/Tablet
			setDeviceType('Tablet');
			// Assert control
			// TODO
			// cy.getByAriaLabel('Scroll Overflow').should(
			// 	'have.attr',
			// 	'aria-pressed',
			// 	'true'
			// );

			// Assert label
			cy.checkLabelClassName(
				'Size',
				'Overflow',
				'changed-in-normal-state'
			);

			// Assert state graph
			cy.checkStateGraph('Size', 'Overflow', { laptop: ['Normal'] });

			// Normal/Tablet
			setBlockState('Normal');
			// Assert control
			// TODO
			// cy.getByAriaLabel('Scroll Overflow').should(
			// 	'have.attr',
			// 	'aria-pressed',
			// 	'true'
			// );

			// Assert label
			cy.checkLabelClassName(
				'Size',
				'Overflow',
				'changed-in-normal-state'
			);

			// Assert state graph
			cy.checkStateGraph('Size', 'Overflow', { laptop: ['Normal'] });

			// Assert store data
			getWPDataObject().then((data) => {
				expect('scroll').to.be.equal(
					getSelectedBlock(data, 'blockeraOverflow')
				);

				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes
				);

				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.laptop.attributes
				);

				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});
		});

		it('set value in normal/tablet and navigate between states', () => {
			setDeviceType('Tablet');
			cy.getByAriaLabel('Scroll Overflow').click();

			// Assert control
			cy.getByAriaLabel('Scroll Overflow').should(
				'have.attr',
				'aria-pressed',
				'true'
			);

			// Assert label
			cy.checkLabelClassName(
				'Size',
				'Overflow',
				'changed-in-normal-state'
			);

			// Assert state graph
			cy.checkStateGraph('Size', 'Overflow', {
				tablet: ['Normal'],
			});

			// Navigate between states and devices :
			// Hover/Tablet
			setBlockState('Hover');
			// Assert control
			cy.getByAriaLabel('Visible Overflow').should(
				'not.have.attr',
				'aria-pressed',
				'true'
			);
			cy.getByAriaLabel('Hidden Overflow').should(
				'not.have.attr',
				'aria-pressed',
				'true'
			);
			cy.getByAriaLabel('Scroll Overflow').should(
				'not.have.attr',
				'aria-pressed',
				'true'
			);

			// Assert label
			cy.checkLabelClassName(
				'Size',
				'Overflow',
				'changed-in-normal-state'
			);

			// Assert state graph
			cy.checkStateGraph('Size', 'Overflow', {
				tablet: ['Normal'],
			});

			// Hover/Laptop
			setDeviceType('Laptop');
			// Assert control
			cy.getByAriaLabel('Visible Overflow').should(
				'not.have.attr',
				'aria-pressed',
				'true'
			);
			cy.getByAriaLabel('Hidden Overflow').should(
				'not.have.attr',
				'aria-pressed',
				'true'
			);
			cy.getByAriaLabel('Scroll Overflow').should(
				'not.have.attr',
				'aria-pressed',
				'true'
			);

			// Assert label
			cy.checkLabelClassName(
				'Size',
				'Overflow',
				'changed-in-other-state'
			);

			// Assert state graph
			cy.checkStateGraph('Size', 'Overflow', {
				tablet: ['Normal'],
			});

			// Normal/Laptop
			setBlockState('Normal');
			// Assert control
			cy.getByAriaLabel('Visible Overflow').should(
				'not.have.attr',
				'aria-pressed',
				'true'
			);
			cy.getByAriaLabel('Hidden Overflow').should(
				'not.have.attr',
				'aria-pressed',
				'true'
			);
			cy.getByAriaLabel('Scroll Overflow').should(
				'not.have.attr',
				'aria-pressed',
				'true'
			);

			// Assert label
			cy.checkLabelClassName(
				'Size',
				'Overflow',
				'changed-in-other-state'
			);

			// Assert state graph
			cy.checkStateGraph('Size', 'Overflow', {
				tablet: ['Normal'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraOverflow')
				);

				expect({ blockeraOverflow: 'scroll' }).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes
				);

				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.laptop.attributes
				);

				// TODO : tablet is not exist in breakpoints
				// expect({}).to.be.deep.equal(
				// 	getSelectedBlock(data, 'blockeraBlockStates').hover
				// 		.breakpoints.tablet.attributes
				// );
			});
		});
	});
});
