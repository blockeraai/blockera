import {
	getWPDataObject,
	getSelectedBlock,
	createPost,
	setBlockState,
	addBlockState,
	setDeviceType,
} from '@blockera/dev-cypress/js/helpers';

describe('Toggle Select Control label testing (Overflow)', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	it('should display changed value on Overflow -> Normal -> Desktop', () => {
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
		cy.checkStateGraph('Size', 'Overflow', { desktop: ['Normal'] });
	});

	it('should display changed value on Overflow -> Hover -> Desktop', () => {
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
		cy.checkStateGraph('Size', 'Overflow', { desktop: ['Hover'] });
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
			desktop: ['Normal', 'Hover'],
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
		 * Desktop device
		 */
		setDeviceType('Desktop');

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
		 * Desktop device
		 */
		setDeviceType('Desktop');

		// Assert label
		cy.checkLabelClassName('Size', 'Overflow', 'changed-in-other-state');

		// Assert control
		cy.getByAriaLabel('Hidden Overflow').should(
			'not.have.attr',
			'aria-pressed',
			'true'
		);

		/**
		 * Normal (desktop)
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
			// Set value in normal/desktop
			cy.getByAriaLabel('Visible Overflow').click();

			// Set value in hover/desktop
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
						desktop: ['Hover', 'Normal'],
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
						desktop: ['Hover', 'Normal'],
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
				'should correctly reset blockeraOverflow, and display effected fields(label, control, stateGraph) in normal/desktop',
				() => {
					setDeviceType('Desktop');
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
						desktop: ['Hover'],
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
				'should correctly reset blockeraOverflow, and display effected fields(label, control, stateGraph) in hover/desktop',
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
								.breakpoints.desktop.attributes
						);
					});
				}
			);
		});

		it('set value in normal/desktop and navigate between states', () => {
			setBlockState('Normal');
			// Set value
			cy.getByAriaLabel('Scroll Overflow').click();

			// Assert state graph
			cy.checkStateGraph('Size', 'Overflow', {
				desktop: ['Normal'],
			});

			// Assert control
			cy.getByAriaLabel('Scroll Overflow').should(
				'have.attr',
				'aria-pressed',
				'true'
			);

			// Navigate between states :
			// Hover/Desktop
			setBlockState('Hover');
			cy.getByAriaLabel('Scroll Overflow').should(
				'have.attr',
				'aria-pressed',
				'true'
			);
			cy.checkStateGraph('Size', 'Overflow', {
				desktop: ['Normal'],
			});

			// Hover/Tablet
			setDeviceType('Tablet');

			cy.getByAriaLabel('Scroll Overflow').should(
				'have.attr',
				'aria-pressed',
				'true'
			);
			cy.checkStateGraph('Size', 'Overflow', {
				desktop: ['Normal'],
			});

			// Normal/Desktop
			setBlockState('Normal');

			cy.getByAriaLabel('Scroll Overflow').should(
				'have.attr',
				'aria-pressed',
				'true'
			);
			cy.checkStateGraph('Size', 'Overflow', {
				desktop: ['Normal'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect('scroll').to.be.eq(
					getSelectedBlock(data, 'blockeraOverflow')
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes
				);

				expect({}).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});
		});

		it('set value in hover/desktop and navigate between states', () => {
			// Set value
			cy.getByAriaLabel('Scroll Overflow').click();

			// Assert state graph
			cy.checkStateGraph('Size', 'Overflow', {
				desktop: ['Hover'],
			});

			// Assert control
			cy.getByAriaLabel('Scroll Overflow').should(
				'have.attr',
				'aria-pressed',
				'true'
			);

			// Navigate between states :
			// Normal/Desktop
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
				desktop: ['Hover'],
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

			cy.getByAriaLabel('Visible Overflow').should(
				'not.have.attr',
				'aria-pressed',
				'true'
			);

			cy.checkStateGraph('Size', 'Overflow', {
				desktop: ['Hover'],
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

			cy.getByAriaLabel('Visible Overflow').should(
				'not.have.attr',
				'aria-pressed',
				'true'
			);

			cy.checkStateGraph('Size', 'Overflow', {
				desktop: ['Hover'],
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect('').to.be.eq(getSelectedBlock(data, 'blockeraOverflow'));

				expect(undefined).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.desktop
				);

				expect({ blockeraOverflow: 'scroll' }).to.be.deep.eq(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.desktop.attributes
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
			// Set value in normal/desktop
			cy.getByAriaLabel('Visible Overflow').click();

			// Set value in hover/desktop
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

					// Hover/Desktop
					setDeviceType('Desktop');
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

					// Normal/Desktop
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
								.breakpoints.desktop.attributes
						);

						expect({}).to.be.deep.eq(
							getSelectedBlock(data, 'blockeraBlockStates').hover
								.breakpoints.tablet.attributes
						);
					});
				}
			);
		});

		it('set value in normal/desktop and navigate between states', () => {
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
			cy.checkStateGraph('Size', 'Overflow', { desktop: ['Normal'] });

			// Navigate between states and devices :
			// Hover/Desktop
			setBlockState('Hover');
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
			cy.checkStateGraph('Size', 'Overflow', { desktop: ['Normal'] });

			// Hover/Tablet
			setDeviceType('Tablet');
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
			cy.checkStateGraph('Size', 'Overflow', { desktop: ['Normal'] });

			// Normal/Tablet
			setBlockState('Normal');
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
			cy.checkStateGraph('Size', 'Overflow', { desktop: ['Normal'] });

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
						.breakpoints.desktop.attributes
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

			// Hover/Desktop
			setDeviceType('Desktop');
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

			// Normal/Desktop
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
						.breakpoints.desktop.attributes
				);

				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').hover
						.breakpoints.tablet.attributes
				);
			});
		});
	});
});
