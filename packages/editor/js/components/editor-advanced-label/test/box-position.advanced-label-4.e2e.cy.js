import {
	getWPDataObject,
	getSelectedBlock,
	createPost,
	setBlockState,
	addBlockState,
	setDeviceType,
	appendBlocks,
} from '@blockera/dev-cypress/js/helpers';

describe('Position Control label testing', () => {
	beforeEach(() => {
		createPost();
	});

	const setPositionValue = (label, value) => {
		cy.get(`@${label}`).click({ force: true });

		cy.getByDataTest('popover-body').within(() => {
			cy.get('input[type="number"]').clear({ force: true });
			cy.get('input[type="number"]').type(value);
		});

		// close popover
		cy.getByDataTest('popover-header').within(() =>
			cy.getByAriaLabel('Close').click()
		);
	};

	const checkPositionValue = (label, value) => {
		cy.get(`@${label}`).should('include.text', value);
	};

	const checkPositionLabelClass = (side, cssClass) => {
		cy.get(`@${label}`).should('include.text', value);
	};

	describe('Check while editing sides', () => {
		beforeEach(() => {
			cy.getBlock('default').type('This is test paragraph', { delay: 0 });
			cy.getByDataTest('style-tab').click();

			cy.getParentContainer('Position').within(() => {
				cy.customSelect('Relative');
			});

			// Alias
			cy.getByDataCy('box-position-control').within(() => {
				cy.getByAriaLabel('Top Position').as('top-position');
				cy.getByAriaLabel('Right Position').as('right-position');
				cy.getByAriaLabel('Bottom Position').as('bottom-position');
				cy.getByAriaLabel('Left Position').as('left-position');
			});
		});

		it('Changed value on Desktop → Normal', () => {
			/**
			 * Desktop device
			 */

			/**
			 * Normal state
			 */

			// Assert side labels before set value
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxPositionLabelClassName(
					side,
					[
						'changed-in-normal-state',
						'changed-in-secondary-state',
						'changed-in-other-state',
					],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '-');
			});

			// assert box label
			cy.checkBoxPositionLabelClassName(
				'box',
				[
					'changed-in-normal-state',
					'changed-in-secondary-state',
					'changed-in-other-state',
				],
				'not-have'
			);

			// assert control label
			cy.checkBoxPositionLabelClassName(
				'control',
				['changed-in-normal-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'control',
				['changed-in-secondary-state', 'changed-in-other-state'],
				'not-have'
			);

			/**
			 * Set value and assert labels
			 */
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				setPositionValue(`${side}-position`, 20);

				// Assert side label after set value
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-normal-state'],
					'have'
				);
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-secondary-state', 'changed-in-other-state'],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '20');
			});

			// Assert box label
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-normal-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-secondary-state', 'changed-in-other-state'],
				'not-have'
			);

			// assert control label
			cy.checkBoxPositionLabelClassName(
				'control',
				['changed-in-normal-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'control',
				['changed-in-secondary-state', 'changed-in-other-state'],
				'not-have'
			);

			/**
			 * Tablet device
			 */
			setDeviceType('Tablet');

			/**
			 * Normal state
			 */

			// Assert label
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-normal-state'],
					'have'
				);
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-secondary-state', 'changed-in-other-state'],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '20');
			});

			// Assert box label
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-normal-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-secondary-state', 'changed-in-other-state'],
				'not-have'
			);

			// assert control label
			cy.checkBoxPositionLabelClassName(
				'control',
				['changed-in-normal-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'control',
				['changed-in-secondary-state', 'changed-in-other-state'],
				'not-have'
			);

			// Assert state graph
			cy.checkStateGraph('Position', 'Relative', { desktop: ['Normal'] });
		});

		it('Changed value on Desktop → Hover', () => {
			/**
			 * Desktop device
			 */

			/**
			 * Hover
			 */
			addBlockState('hover');

			// Assert side labels before set value
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxPositionLabelClassName(
					side,
					[
						'changed-in-normal-state',
						'changed-in-secondary-state',
						'changed-in-other-state',
					],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '-');
			});

			// assert box label
			cy.checkBoxPositionLabelClassName(
				'box',
				[
					'changed-in-normal-state',
					'changed-in-secondary-state',
					'changed-in-other-state',
				],
				'not-have'
			);

			// assert control label
			cy.checkBoxPositionLabelClassName(
				'control',
				['changed-in-normal-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'control',
				[
					'changed-in-secondary-state',
					//'changed-in-other-state', // TODO: @reza - this should be exist but it does
				],
				'not-have'
			);

			/**
			 * Set value and assert labels
			 */
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				setPositionValue(`${side}-position`, 30);

				// Assert side label after set value
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-secondary-state'],
					'have'
				);
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-normal-state', 'changed-in-other-state'],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '30');
			});

			// Assert box label
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-secondary-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-normal-state', 'changed-in-other-state'],
				'not-have'
			);

			// assert control label
			cy.checkBoxPositionLabelClassName(
				'control',
				['changed-in-secondary-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'control',
				[
					'changed-in-normal-state',
					//'changed-in-other-state', // TODO: @reza - this should be exist but it does
				],
				'not-have'
			);

			// Assert state graph
			cy.checkStateGraph('Position', 'Relative', { desktop: ['Hover'] });

			/**
			 * Tablet device
			 */
			setDeviceType('Tablet');

			/**
			 * Hover state
			 */

			// Assert label
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-secondary-state'],
					'have'
				);
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-normal-state', 'changed-in-other-state'],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '-');
			});

			// Assert box label
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-secondary-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-normal-state', 'changed-in-other-state'],
				'not-have'
			);

			// assert control label
			cy.checkBoxPositionLabelClassName(
				'control',
				['changed-in-normal-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'control',
				[
					'changed-in-secondary-state',
					//'changed-in-other-state', // TODO: @reza - this should be exist but it does
				],
				'not-have'
			);

			/**
			 * Desktop device
			 */
			setDeviceType('Desktop');

			/**
			 * Normal State
			 */
			setBlockState('Normal');

			// Assert label
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-other-state'],
					'have'
				);
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-normal-state', 'changed-in-secondary-state'],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '-');
			});
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-other-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-normal-state', 'changed-in-secondary-state'],
				'not-have'
			);

			// Assert state graph
			cy.checkStateGraph('Position', 'Relative', { desktop: ['Hover'] });
		});

		it('Changed value on Desktop → Normal & Hover the Tablet → Normal & Hover', () => {
			/**
			 * Normal State
			 */

			/**
			 * Set value and assert labels
			 */
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				setPositionValue(`${side}-position`, 20);

				// Assert side label after set value
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-normal-state'],
					'have'
				);
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-secondary-state', 'changed-in-other-state'],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '20');
			});

			// Assert state graph
			cy.checkStateGraph('Position', 'Relative', {
				desktop: ['Normal'],
			});

			/**
			 * Hover State
			 */

			addBlockState('hover');

			/**
			 * Set value and assert labels
			 */
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				setPositionValue(`${side}-position`, 30);

				// Assert side label after set value
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-secondary-state'],
					'have'
				);
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-normal-state', 'changed-in-other-state'],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '30');
			});

			// assert box label
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-secondary-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-normal-state', 'changed-in-other-state'],
				'not-have'
			);

			// assert control label
			cy.checkBoxPositionLabelClassName(
				'control',
				['changed-in-secondary-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'control',
				['changed-in-normal-state', 'changed-in-other-state'],
				'not-have'
			);

			// Assert state graph
			cy.checkStateGraph('Position', 'Relative', {
				desktop: ['Normal', 'Hover'],
			});

			/**
			 * Tablet device
			 */
			setDeviceType('Tablet');

			/**
			 * Normal State
			 */
			setBlockState('Normal');

			/**
			 * Set value and assert labels
			 */
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				// Assert side before set value
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-normal-state'],
					'have'
				);
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-secondary-state', 'changed-in-other-state'],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '20');

				setPositionValue(`${side}-position`, 40);

				// Assert side label after set value
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-normal-state'],
					'have'
				);
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-secondary-state', 'changed-in-other-state'],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '40');
			});

			// Assert state graph
			cy.checkStateGraph('Position', 'Relative', {
				desktop: ['Normal', 'Hover'],
				tablet: ['Normal'],
			});

			/**
			 * Hover State
			 */
			setBlockState('Hover');

			/**
			 * Set value and assert labels
			 */
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				// Assert side before set value
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-normal-state'],
					'have'
				);
				cy.checkBoxPositionLabelClassName(
					side,
					[
						'changed-in-secondary-state',
						//'changed-in-other-state', // TODO: @reza - this should be exist but it does
					],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '20');

				setPositionValue(`${side}-position`, 45);

				// Assert side label after set value
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-secondary-state'],
					'have'
				);
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-normal-state', 'changed-in-other-state'],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '45');
			});

			// Assert state graph
			cy.checkStateGraph('Position', 'Relative', {
				desktop: ['Normal', 'Hover'],
				tablet: ['Normal', 'Hover'],
			});
		});

		it('Changed value on Tablet → Normal', () => {
			/**
			 * Tablet device
			 */
			setDeviceType('Tablet');

			/**
			 * Normal
			 */

			// Assert side labels before set value
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxPositionLabelClassName(
					side,
					[
						'changed-in-normal-state',
						'changed-in-secondary-state',
						'changed-in-other-state',
					],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '-');
			});

			// assert box label
			cy.checkBoxPositionLabelClassName(
				'box',
				[
					'changed-in-normal-state',
					'changed-in-secondary-state',
					'changed-in-other-state',
				],
				'not-have'
			);

			// assert control label
			cy.checkBoxPositionLabelClassName(
				'control',
				['changed-in-normal-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'control',
				[
					'changed-in-secondary-state',
					//'changed-in-other-state', // TODO: @reza - this should be exist but it does
				],
				'not-have'
			);

			/**
			 * Set value and assert labels
			 */
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				setPositionValue(`${side}-position`, 35);

				// Assert side label after set value
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-normal-state'],
					'have'
				);
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-secondary-state', 'changed-in-other-state'],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '35');
			});

			// Assert box label
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-normal-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-secondary-state', 'changed-in-other-state'],
				'not-have'
			);

			// assert control label
			cy.checkBoxPositionLabelClassName(
				'control',
				['changed-in-normal-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'control',
				[
					'changed-in-secondary-state',
					// 'changed-in-other-state', // TODO: @reza - this should be exist but it does
				],
				'not-have'
			);

			// Assert state graph
			cy.checkStateGraph('Position', 'Relative', { tablet: ['Normal'] });

			/**
			 * Desktop device
			 */
			setDeviceType('Desktop');

			/**
			 * Normal state
			 */

			// Assert label
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-other-state'],
					'have'
				);
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-normal-state', 'changed-in-secondary-state'],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '-');
			});

			// Assert box label
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-other-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-normal-state', 'changed-in-secondary-state'],
				'not-have'
			);

			// assert control label
			cy.checkBoxPositionLabelClassName(
				'control',
				['changed-in-normal-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'control',
				[
					'changed-in-secondary-state',
					//'changed-in-other-state', // TODO: @reza - this should be exist but it does
				],
				'not-have'
			);

			// Assert state graph
			cy.checkStateGraph('Position', 'Relative', { tablet: ['Normal'] });
		});

		it('Changed value on Tablet → Hover', () => {
			/**
			 * Tablet device
			 */
			setDeviceType('Tablet');

			/**
			 * Hover
			 */
			addBlockState('hover');

			// Assert side labels before set value
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxPositionLabelClassName(
					side,
					[
						'changed-in-normal-state',
						'changed-in-secondary-state',
						'changed-in-other-state',
					],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '-');
			});

			// assert box label
			cy.checkBoxPositionLabelClassName(
				'box',
				[
					'changed-in-normal-state',
					'changed-in-secondary-state',
					'changed-in-other-state',
				],
				'not-have'
			);

			// assert control label
			cy.checkBoxPositionLabelClassName(
				'control',
				['changed-in-normal-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'control',
				[
					'changed-in-secondary-state',
					//'changed-in-other-state', // TODO: @reza - this should be exist but it does
				],
				'not-have'
			);

			/**
			 * Set value and assert labels
			 */
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				setPositionValue(`${side}-position`, 45);

				// Assert side label after set value
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-secondary-state'],
					'have'
				);
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-normal-state', 'changed-in-other-state'],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '45');
			});

			// Assert box label
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-secondary-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-normal-state', 'changed-in-other-state'],
				'not-have'
			);

			// assert control label
			cy.checkBoxPositionLabelClassName(
				'control',
				['changed-in-secondary-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'control',
				[
					'changed-in-normal-state',
					//'changed-in-other-state', // TODO: @reza - this should be exist but it does
				],
				'not-have'
			);

			// Assert state graph
			cy.checkStateGraph('Position', 'Relative', { tablet: ['Hover'] });

			/**
			 * Tablet device
			 */

			/**
			 * Normal state
			 */
			setBlockState('Normal');

			// Assert label
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-other-state'],
					'have'
				);
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-normal-state', 'changed-in-secondary-state'],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '-');
			});

			// Assert box label
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-other-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-normal-state', 'changed-in-secondary-state'],
				'not-have'
			);

			// assert control label
			cy.checkBoxPositionLabelClassName(
				'control',
				['changed-in-normal-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'control',
				[
					'changed-in-secondary-state',
					//'changed-in-other-state', // TODO: @reza - this should be exist but it does
				],
				'not-have'
			);

			/**
			 * Desktop device
			 */
			setDeviceType('Desktop');

			/**
			 * Normal state
			 */

			// Assert label
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-other-state'],
					'have'
				);
				cy.checkBoxPositionLabelClassName(
					side,
					['changed-in-normal-state', 'changed-in-secondary-state'],
					'not-have'
				);

				cy.checkBoxPositionLabelContent(side, '-');
			});

			// Assert box label
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-other-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'box',
				['changed-in-normal-state', 'changed-in-secondary-state'],
				'not-have'
			);

			// assert control label
			cy.checkBoxPositionLabelClassName(
				'control',
				['changed-in-normal-state'],
				'have'
			);
			cy.checkBoxPositionLabelClassName(
				'control',
				[
					'changed-in-secondary-state',
					//'changed-in-other-state', // TODO: @reza - this should be exist but it does
				],
				'not-have'
			);

			// Assert state graph
			cy.checkStateGraph('Position', 'Relative', { tablet: ['Hover'] });
		});
	});

	describe('Reset Buttons', () => {
		beforeEach(() => {
			// we use prepared block to run test faster
			appendBlocks(`<!-- wp:paragraph {"className":"blockera-block blockera-block-9a93cf21-70bc-427c-a2a2-b774084972d8","blockeraPosition":{"type":"relative","position":{"top":"20px","right":"20px","bottom":"20px","left":"20px"}},"blockeraBlockStates":{"hover":{"breakpoints":{"desktop":{"attributes":{"blockeraPosition":{"type":"relative","position":{"top":"25px","right":"25px","bottom":"25px","left":"25px"}}}},"tablet":{"attributes":{"blockeraPosition":{"type":"relative","position":{"top":"35px","right":"35px","bottom":"35px","left":"35px"}}}},"mobile":{"attributes":{"blockeraPosition":{"type":"relative","position":{"top":"45px","right":"45px","bottom":"45px","left":"45px"}}}}},"isVisible":true},"normal":{"breakpoints":{"tablet":{"attributes":{"blockeraPosition":{"type":"relative","position":{"top":"30px","right":"30px","bottom":"30px","left":"30px"}}}},"mobile":{"attributes":{"blockeraPosition":{"type":"relative","position":{"top":"40px","right":"40px","bottom":"40px","left":"40px"}}}}},"isVisible":true}},"blockeraPropsId":"61823453747","blockeraCompatId":"61823453806"} -->
<p class="blockera-block blockera-block-9a93cf21-70bc-427c-a2a2-b774084972d8">This is test paragraph</p>
<!-- /wp:paragraph -->`);

			cy.getBlock('core/paragraph').click();

			// Alias
			cy.getByDataCy('box-position-control').within(() => {
				cy.getByAriaLabel('Top Position').as('top-position');
				cy.getByAriaLabel('Right Position').as('right-position');
				cy.getByAriaLabel('Bottom Position').as('bottom-position');
				cy.getByAriaLabel('Left Position').as('left-position');
			});
		});

		describe('Desktop → Normal', () => {
			describe('Single Reset', () => {
				it('Reset by clicking on each side label (Single Reset)', () => {
					/**
					 * Desktop device
					 */
					setDeviceType('Desktop');

					/**
					 * Normal state
					 */
					setBlockState('Normal');

					/**
					 * reset and assert labels
					 */
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.resetBoxPositionAttribute(side, 'reset');

						// Assert side label after set value
						cy.checkBoxPositionLabelClassName(
							side,
							['changed-in-other-state'],
							'have'
						);
						cy.checkBoxPositionLabelClassName(
							side,
							[
								'changed-in-normal-state',
								'changed-in-secondary-state',
							],
							'not-have'
						);

						// Assert label value
						cy.checkBoxPositionLabelContent(side, '-');
					});

					// Assert box label
					cy.checkBoxPositionLabelClassName(
						'box',
						['changed-in-other-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'box',
						[
							'changed-in-normal-state',
							'changed-in-secondary-state',
						],
						'not-have'
					);

					// assert control label
					cy.checkBoxPositionLabelClassName(
						'control',
						['changed-in-normal-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'control',
						[
							'changed-in-secondary-state',
							'changed-in-other-state',
						],
						'not-have'
					);

					// Assert sides graph
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxPositionStateGraph(side, {
							desktop: ['Hover'],
							tablet: ['Normal', 'Hover'],
							mobile: ['Normal', 'Hover'],
						});
					});

					// Assert box label graph
					cy.checkBoxPositionStateGraph('box', {
						desktop: ['Hover'],
						tablet: ['Normal', 'Hover'],
						mobile: ['Normal', 'Hover'],
					});

					// Assert control label graph
					cy.checkBoxPositionStateGraph('control', {
						desktop: ['Normal', 'Hover'],
						tablet: ['Normal', 'Hover'],
						mobile: ['Normal', 'Hover'],
					});
				});

				// TODO @reza we have a strange issue in this because reset by clicking on box label is working very slow!
				// we should fix it at first to run the test correctly
				// i commented it for now but it should be fixed and uncommented
				// it('Reset by clicking on box label (Single Reset)', () => {

				// 	/**
				// 	 * Desktop device
				// 	 */
				// 	setDeviceType('Desktop');

				// 	/**
				// 	 * Normal state
				// 	 */
				// 	setBlockState('Normal');

				// 	/**
				// 	 * reset by clicking on whole box label
				// 	 */
				// 	cy.resetBoxPositionAttribute('box', 'reset'); // TODO @reza here issue happens

				// 	// Assert box label
				// 	cy.checkBoxPositionLabelClassName(
				// 		'box',
				// 		[
				// 			'changed-in-other-state',
				// 		],
				// 		'have'
				// 	);
				// 	cy.checkBoxPositionLabelClassName(
				// 		'box',
				// 		[
				// 			'changed-in-normal-state',
				// 			'changed-in-secondary-state',
				// 		],
				// 		'not-have'
				// 	);

				// 	/**
				// 	 * reset and assert labels
				// 	 */
				// 	['top', 'right', 'bottom', 'left'].forEach((side) => {

				// 		// Assert side label after set value
				// 		cy.checkBoxPositionLabelClassName(
				// 			side,
				// 			[
				// 				'changed-in-other-state',
				// 			],
				// 			'have'
				// 		);
				// 		cy.checkBoxPositionLabelClassName(
				// 			side,
				// 			[
				// 				'changed-in-normal-state',
				// 				'changed-in-secondary-state',
				// 			],
				// 			'not-have'
				// 		);

				// 		// Assert label value
				// 		cy.checkBoxPositionLabelContent(side, '-');
				// 	});

				// 	// assert control label
				// 	cy.checkBoxPositionLabelClassName(
				// 		'control',
				// 		[
				// 			'changed-in-normal-state',
				// 		],
				// 		'have'
				// 	);
				// 	cy.checkBoxPositionLabelClassName(
				// 		'control',
				// 		[
				// 			'changed-in-secondary-state',
				// 			'changed-in-other-state',
				// 		],
				// 		'not-have'
				// 	);

				// 	// Assert sides graph
				// 	['top', 'right', 'bottom', 'left'].forEach((side) => {
				// 		cy.checkBoxPositionStateGraph(side, {
				// 			desktop: ['Hover'],
				// 			tablet: ['Normal', 'Hover'],
				// 			mobile: ['Normal', 'Hover'],
				// 		});
				// 	});

				// 	// Assert box label graph
				// 	cy.checkBoxPositionStateGraph('box', {
				// 		desktop: ['Hover'],
				// 		tablet: ['Normal', 'Hover'],
				// 		mobile: ['Normal', 'Hover'],
				// 	});

				// 	// Assert control label graph
				// 	cy.checkBoxPositionStateGraph('control', {
				// 		desktop: ['Normal', 'Hover'],
				// 		tablet: ['Normal', 'Hover'],
				// 		mobile: ['Normal', 'Hover'],
				// 	});
				// });

				it('Reset by clicking control label (Single Reset)', () => {
					/**
					 * Desktop device
					 */
					setDeviceType('Desktop');

					/**
					 * Normal state
					 */
					setBlockState('Normal');

					/**
					 * reset by clicking on control label
					 */
					cy.resetBoxPositionAttribute('control', 'reset');

					// Assert side label to not exist
					cy.get(`[data-cy="box-position-label-box"]`).should(
						'not.exist'
					);
					cy.get(`[data-cy="box-position-label-top"]`).should(
						'not.exist'
					);
					cy.get(`[data-cy="box-position-label-right"]`).should(
						'not.exist'
					);
					cy.get(`[data-cy="box-position-label-bottom"]`).should(
						'not.exist'
					);
					cy.get(`[data-cy="box-position-label-left"]`).should(
						'not.exist'
					);

					// Assert control label
					cy.checkBoxPositionLabelClassName(
						'control',
						['changed-in-other-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'control',
						[
							'changed-in-normal-state',
							'changed-in-secondary-state',
						],
						'not-have'
					);

					// Assert control label graph
					cy.checkBoxPositionStateGraph('control', {
						desktop: ['Hover'],
						tablet: ['Normal', 'Hover'],
						mobile: ['Normal', 'Hover'],
					});
				});
			});

			describe('Reset All', () => {
				it('Reset by clicking on each side label (Reset All)', () => {
					/**
					 * Desktop device
					 */
					setDeviceType('Desktop');

					/**
					 * Normal state
					 */
					setBlockState('Normal');

					/**
					 * reset and assert labels
					 */
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.resetBoxPositionAttribute(side, 'reset-all');

						// Assert side label after set value
						cy.checkBoxPositionLabelClassName(
							side,
							[
								'changed-in-normal-state',
								'changed-in-secondary-state',
								// 'changed-in-other-state', // TODO @reza - it should be reseted in all states and there should not be the 'other' states changed class
							],
							'not-have'
						);

						// Assert label value
						cy.checkBoxPositionLabelContent(side, '-');
					});

					// Assert box label
					cy.checkBoxPositionLabelClassName(
						'box',
						[
							'changed-in-normal-state',
							'changed-in-secondary-state',
							// 'changed-in-other-state', // TODO @reza - it should be reseted in all states and there should not be the 'other' states changed class
						],
						'not-have'
					);

					// assert control label
					cy.checkBoxPositionLabelClassName(
						'control',
						['changed-in-normal-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'control',
						[
							'changed-in-secondary-state',
							'changed-in-other-state',
						],
						'not-have'
					);

					// TODO @reza - if reset all works correctly then the 'Normal' should not exists
					// Assert sides graph
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxPositionStateGraph(side, {
							desktop: ['Hover'],
							tablet: ['Normal', 'Hover'],
							mobile: ['Normal', 'Hover'],
						});
					});

					// TODO @reza - if reset all works correctly then the 'Normal' should not exists
					// Assert box label graph
					cy.checkBoxPositionStateGraph('box', {
						desktop: ['Hover'],
						tablet: ['Normal', 'Hover'],
						mobile: ['Normal', 'Hover'],
					});

					// Assert control label graph
					cy.checkBoxPositionStateGraph('control', {
						desktop: ['Normal', 'Hover'],
						tablet: ['Normal', 'Hover'],
						mobile: ['Normal', 'Hover'],
					});
				});

				// TODO @reza we have a strange issue in this because reset by clicking on box label is working very slow!
				// we should fix it at first to run the test correctly
				// i commented it for now but it should be fixed and uncommented
				// it('Reset by clicking on box label (Reset All)', () => {

				// 	/**
				// 	 * Desktop device
				// 	 */
				// 	setDeviceType('Desktop');

				// 	/**
				// 	 * Normal state
				// 	 */
				// 	setBlockState('Normal');

				// 	/**
				// 	 * reset by clicking on box label
				// 	 */
				// 	cy.resetBoxPositionAttribute('box', 'reset-all'); // TODO @reza - issue happens here!

				// 	// Assert box label
				// 	cy.checkBoxPositionLabelClassName(
				// 		'box',
				// 		[
				// 			'changed-in-normal-state',
				// 			'changed-in-secondary-state',
				// 			// 'changed-in-other-state', // TODO @reza - it should be reseted in all states and there should not be the 'other' states changed class
				// 		],
				// 		'not-have'
				// 	);

				// 	/**
				// 	 * reset and assert labels
				// 	 */
				// 	['top', 'right', 'bottom', 'left'].forEach((side) => {

				// 		// Assert side label after set value
				// 		cy.checkBoxPositionLabelClassName(
				// 			side,
				// 			[
				// 				'changed-in-normal-state',
				// 				'changed-in-secondary-state',
				// 				// 'changed-in-other-state', // TODO @reza - it should be reseted in all states and there should not be the 'other' states changed class
				// 			],
				// 			'not-have'
				// 		);

				// 		// Assert label value
				// 		cy.checkBoxPositionLabelContent(side, '-');
				// 	});

				// 	// assert control label
				// 	cy.checkBoxPositionLabelClassName(
				// 		'control',
				// 		[
				// 			'changed-in-normal-state',
				// 		],
				// 		'have'
				// 	);
				// 	cy.checkBoxPositionLabelClassName(
				// 		'control',
				// 		[
				// 			'changed-in-secondary-state',
				// 			'changed-in-other-state',
				// 		],
				// 		'not-have'
				// 	);

				// 	// TODO @reza - if reset all works correctly then the 'Normal' should not exists
				// 	// Assert sides graph
				// 	['top', 'right', 'bottom', 'left'].forEach((side) => {
				// 		cy.checkBoxPositionStateGraph(side, {
				// 			desktop: ['Hover'],
				// 			tablet: ['Normal', 'Hover'],
				// 			mobile: ['Normal', 'Hover'],
				// 		});
				// 	});

				// 	// TODO @reza - if reset all works correctly then the 'Normal' should not exists
				// 	// Assert box label graph
				// 	cy.checkBoxPositionStateGraph('box', {
				// 		desktop: ['Hover'],
				// 		tablet: ['Normal', 'Hover'],
				// 		mobile: ['Normal', 'Hover'],
				// 	});

				// 	// Assert control label graph
				// 	cy.checkBoxPositionStateGraph('control', {
				// 		desktop: ['Normal', 'Hover'],
				// 		tablet: ['Normal', 'Hover'],
				// 		mobile: ['Normal', 'Hover'],
				// 	});
				// });

				it('Reset by clicking control label (Single All)', () => {
					/**
					 * Desktop device
					 */
					setDeviceType('Desktop');

					/**
					 * Normal state
					 */
					setBlockState('Normal');

					/**
					 * reset by clicking on control label
					 */
					cy.resetBoxPositionAttribute('control', 'reset-all');

					// Assert side label to not exist
					cy.get(`[data-cy="box-position-label-box"]`).should(
						'not.exist'
					);
					cy.get(`[data-cy="box-position-label-top"]`).should(
						'not.exist'
					);
					cy.get(`[data-cy="box-position-label-right"]`).should(
						'not.exist'
					);
					cy.get(`[data-cy="box-position-label-bottom"]`).should(
						'not.exist'
					);
					cy.get(`[data-cy="box-position-label-left"]`).should(
						'not.exist'
					);

					// Assert control label
					cy.checkBoxPositionLabelClassName(
						'control',
						[
							'changed-in-normal-state',
							'changed-in-secondary-state',
							'changed-in-other-state',
						],
						'not-have'
					);

					// Assert control label graph
					cy.checkBoxPositionStateGraph('control', {});
				});
			});
		});

		describe('Tablet → Normal', () => {
			describe('Single Reset', () => {
				it('Reset by clicking on each side label (Single Reset)', () => {
					/**
					 * Tablet device
					 */
					setDeviceType('Tablet');

					/**
					 * Normal state
					 */
					setBlockState('Normal');

					/**
					 * reset and assert labels
					 */
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.resetBoxPositionAttribute(side, 'reset');

						// Assert side label after set value
						cy.checkBoxPositionLabelClassName(
							side,
							['changed-in-normal-state'],
							'have'
						);
						cy.checkBoxPositionLabelClassName(
							side,
							[
								'changed-in-secondary-state',
								'changed-in-other-state',
							],
							'not-have'
						);

						// Assert label value
						cy.checkBoxPositionLabelContent(side, '20');
					});

					// Assert box label
					cy.checkBoxPositionLabelClassName(
						'box',
						['changed-in-normal-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'box',
						[
							'changed-in-secondary-state',
							'changed-in-other-state',
						],
						'not-have'
					);

					// assert control label
					cy.checkBoxPositionLabelClassName(
						'control',
						['changed-in-normal-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'control',
						[
							'changed-in-secondary-state',
							'changed-in-other-state',
						],
						'not-have'
					);

					// Assert sides graph
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxPositionStateGraph(side, {
							desktop: ['Normal', 'Hover'],
							tablet: ['Hover'],
							mobile: ['Normal', 'Hover'],
						});
					});

					// Assert box label graph
					cy.checkBoxPositionStateGraph('box', {
						desktop: ['Normal', 'Hover'],
						tablet: ['Hover'],
						mobile: ['Normal', 'Hover'],
					});

					// Assert control label graph
					cy.checkBoxPositionStateGraph('control', {
						desktop: ['Normal', 'Hover'],
						tablet: ['Hover'],
						mobile: ['Normal', 'Hover'],
					});
				});

				it('Reset by clicking on box label (Single Reset)', () => {
					/**
					 * Tablet device
					 */
					setDeviceType('Tablet');

					/**
					 * Hover state
					 */
					setBlockState('Hover');

					/**
					 * reset by clicking on whole box label
					 */
					cy.resetBoxPositionAttribute('box', 'reset');

					// Assert box label
					cy.checkBoxPositionLabelClassName(
						'box',
						['changed-in-normal-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'box',
						[
							'changed-in-secondary-state',
							'changed-in-other-state',
						],
						'not-have'
					);

					/**
					 * reset and assert labels
					 */
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						// Assert side label after set value
						cy.checkBoxPositionLabelClassName(
							side,
							['changed-in-normal-state'],
							'have'
						);
						cy.checkBoxPositionLabelClassName(
							side,
							[
								'changed-in-secondary-state',
								'changed-in-other-state',
							],
							'not-have'
						);

						// Assert label value
						cy.checkBoxPositionLabelContent(side, '-');
					});

					// assert control label
					cy.checkBoxPositionLabelClassName(
						'control',
						['changed-in-secondary-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'control',
						['changed-in-normal-state', 'changed-in-other-state'],
						'not-have'
					);

					// Assert sides graph
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxPositionStateGraph(side, {
							desktop: ['Normal', 'Hover'],
							tablet: ['Normal'],
							mobile: ['Normal', 'Hover'],
						});
					});

					// Assert box label graph
					cy.checkBoxPositionStateGraph('box', {
						desktop: ['Normal', 'Hover'],
						tablet: ['Normal'],
						mobile: ['Normal', 'Hover'],
					});

					// Assert control label graph
					cy.checkBoxPositionStateGraph('control', {
						desktop: ['Normal', 'Hover'],
						tablet: ['Normal', 'Hover'],
						mobile: ['Normal', 'Hover'],
					});
				});

				it('Reset by clicking control label (Single Reset)', () => {
					/**
					 * Tablet device
					 */
					setDeviceType('Tablet');

					/**
					 * Normal state
					 */
					setBlockState('Normal');

					/**
					 * reset by clicking on control label
					 */
					cy.resetBoxPositionAttribute('control', 'reset');

					/**
					 * reset and assert labels
					 */
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						// Assert side label after set value
						cy.checkBoxPositionLabelClassName(
							side,
							['changed-in-normal-state'],
							'have'
						);
						cy.checkBoxPositionLabelClassName(
							side,
							[
								'changed-in-secondary-state',
								'changed-in-other-state',
							],
							'not-have'
						);

						// Assert label value
						cy.checkBoxPositionLabelContent(side, '20');
					});

					// assert control label
					cy.checkBoxPositionLabelClassName(
						'control',
						['changed-in-normal-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'control',
						[
							'changed-in-secondary-state',
							'changed-in-other-state',
						],
						'not-have'
					);

					// Assert sides graph
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxPositionStateGraph(side, {
							desktop: ['Normal', 'Hover'],
							tablet: ['Hover'],
							mobile: ['Normal', 'Hover'],
						});
					});

					// Assert box label graph
					cy.checkBoxPositionStateGraph('box', {
						desktop: ['Normal', 'Hover'],
						tablet: ['Hover'],
						mobile: ['Normal', 'Hover'],
					});

					// Assert control label graph
					cy.checkBoxPositionStateGraph('control', {
						desktop: ['Normal', 'Hover'],
						tablet: ['Hover'],
						mobile: ['Normal', 'Hover'],
					});
				});
			});

			describe('Reset All', () => {
				it('Reset by clicking on each side label (Reset All)', () => {
					/**
					 * Tablet device
					 */
					setDeviceType('Tablet');

					/**
					 * Normal state
					 */
					setBlockState('Normal');

					/**
					 * reset and assert labels
					 */
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.resetBoxPositionAttribute(side, 'reset-all');

						// Assert side label after set value
						cy.checkBoxPositionLabelClassName(
							side,
							['changed-in-other-state'],
							'have'
						);
						cy.checkBoxPositionLabelClassName(
							side,
							[
								'changed-in-normal-state',
								'changed-in-secondary-state',
							],
							'not-have'
						);

						// Assert label value
						cy.checkBoxPositionLabelContent(side, '-');
					});

					// Assert box label
					cy.checkBoxPositionLabelClassName(
						'box',
						['changed-in-other-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'box',
						[
							'changed-in-normal-state',
							'changed-in-secondary-state',
						],
						'not-have'
					);

					// assert control label
					cy.checkBoxPositionLabelClassName(
						'control',
						['changed-in-normal-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'control',
						[
							'changed-in-secondary-state',
							'changed-in-other-state',
						],
						'not-have'
					);

					// TODO @reza - if reset all works correctly then the 'Normal' should not exists for mobile
					// Assert sides graph
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxPositionStateGraph(side, {
							desktop: ['Hover'],
							tablet: ['Hover'],
							mobile: ['Normal', 'Hover'],
						});
					});

					// TODO @reza - if reset all works correctly then the 'Normal' should not exists for mobile
					// Assert box label graph
					cy.checkBoxPositionStateGraph('box', {
						desktop: ['Hover'],
						tablet: ['Hover'],
						mobile: ['Normal', 'Hover'],
					});

					// TODO @reza - if reset all works correctly then the 'Normal' should not exists for desktop & mobile
					// Assert control label graph
					cy.checkBoxPositionStateGraph('control', {
						desktop: ['Normal', 'Hover'],
						tablet: ['Hover'],
						mobile: ['Normal', 'Hover'],
					});
				});

				it('Reset by clicking on box label (Reset All)', {}, () => {
					/**
					 * Tablet device
					 */
					setDeviceType('Tablet');

					/**
					 * Normal state
					 */
					setBlockState('Normal');

					/**
					 * reset by clicking on box label
					 */
					cy.resetBoxPositionAttribute('box', 'reset-all');

					/**
					 * reset and assert labels
					 */
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxPositionLabelClassName(
							side,
							[
								'changed-in-normal-state',
								'changed-in-secondary-state',
								'changed-in-other-state',
							],
							'not-have'
						);

						// Assert label value
						cy.checkBoxPositionLabelContent(side, '-');
					});

					// Assert box label
					cy.checkBoxPositionLabelClassName(
						'box',
						[
							'changed-in-normal-state',
							'changed-in-secondary-state',
							'changed-in-other-state',
						],
						'not-have'
					);

					// assert control label
					cy.checkBoxPositionLabelClassName(
						'control',
						['changed-in-normal-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'control',
						[
							'changed-in-secondary-state',
							'changed-in-other-state',
						],
						'not-have'
					);

					// Assert sides graph
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxPositionStateGraph(side, {});
					});

					// Assert box label graph
					cy.checkBoxPositionStateGraph('box', {});

					// Assert control label graph
					cy.checkBoxPositionStateGraph('control', {
						desktop: ['Normal'],
					});
				});

				it('Reset by clicking control label (Single All)', () => {
					/**
					 * Tablet device
					 */
					setDeviceType('Tablet');

					/**
					 * Normal state
					 */
					setBlockState('Normal');

					/**
					 * reset by clicking on control label
					 */
					cy.resetBoxPositionAttribute('control', 'reset-all');

					// Assert side label to not exist
					cy.get(`[data-cy="box-position-label-box"]`).should(
						'not.exist'
					);
					cy.get(`[data-cy="box-position-label-top"]`).should(
						'not.exist'
					);
					cy.get(`[data-cy="box-position-label-right"]`).should(
						'not.exist'
					);
					cy.get(`[data-cy="box-position-label-bottom"]`).should(
						'not.exist'
					);
					cy.get(`[data-cy="box-position-label-left"]`).should(
						'not.exist'
					);

					// Assert control label
					cy.checkBoxPositionLabelClassName(
						'control',
						[
							'changed-in-normal-state',
							'changed-in-secondary-state',
							'changed-in-other-state',
						],
						'not-have'
					);

					// Assert control label graph
					cy.checkBoxPositionStateGraph('control', {});
				});
			});
		});

		describe('Tablet → Hover', () => {
			describe('Single Reset', () => {
				it('Reset by clicking on each side label (Single Reset)', () => {
					/**
					 * Tablet device
					 */
					setDeviceType('Tablet');

					/**
					 * Hover state
					 */
					setBlockState('Hover');

					/**
					 * reset and assert labels
					 */
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.resetBoxPositionAttribute(side, 'reset');

						// Assert side label after set value
						cy.checkBoxPositionLabelClassName(
							side,
							['changed-in-normal-state'],
							'have'
						);
						cy.checkBoxPositionLabelClassName(
							side,
							[
								'changed-in-secondary-state',
								//'changed-in-other-state', // TODO @reza this class should not exists
							],
							'not-have'
						);

						// Assert label value
						cy.checkBoxPositionLabelContent(side, '20');
					});

					// Assert box label
					cy.checkBoxPositionLabelClassName(
						'box',
						['changed-in-normal-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'box',
						[
							'changed-in-secondary-state',
							//'changed-in-other-state', // TODO @reza this class should not exists
						],
						'not-have'
					);

					// assert control label
					cy.checkBoxPositionLabelClassName(
						'control',
						['changed-in-normal-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'control',
						[
							'changed-in-secondary-state',
							//'changed-in-other-state', // TODO @reza this class should not exists
						],
						'not-have'
					);

					// Assert sides graph
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxPositionStateGraph(side, {
							desktop: ['Normal', 'Hover'],
							tablet: ['Normal'],
							mobile: ['Normal', 'Hover'],
						});
					});

					// Assert box label graph
					cy.checkBoxPositionStateGraph('box', {
						desktop: ['Normal', 'Hover'],
						tablet: ['Normal'],
						mobile: ['Normal', 'Hover'],
					});

					// Assert control label graph
					cy.checkBoxPositionStateGraph('control', {
						desktop: ['Normal', 'Hover'],
						tablet: ['Normal'],
						mobile: ['Normal', 'Hover'],
					});
				});

				it('Reset by clicking on box label (Single Reset)', () => {
					/**
					 * Tablet device
					 */
					setDeviceType('Tablet');

					/**
					 * Hover state
					 */
					setBlockState('Hover');

					/**
					 * reset by clicking on whole box label
					 */
					cy.resetBoxPositionAttribute('box', 'reset');

					// Assert box label
					cy.checkBoxPositionLabelClassName(
						'box',
						['changed-in-normal-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'box',
						[
							'changed-in-secondary-state',
							'changed-in-other-state',
						],
						'not-have'
					);

					/**
					 * reset and assert labels
					 */
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						// Assert side label after set value
						cy.checkBoxPositionLabelClassName(
							side,
							['changed-in-normal-state'],
							'have'
						);
						cy.checkBoxPositionLabelClassName(
							side,
							[
								'changed-in-secondary-state',
								'changed-in-other-state',
							],
							'not-have'
						);

						// Assert label value
						cy.checkBoxPositionLabelContent(side, '-');
					});

					// assert control label
					cy.checkBoxPositionLabelClassName(
						'control',
						['changed-in-secondary-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'control',
						['changed-in-normal-state', 'changed-in-other-state'],
						'not-have'
					);

					// Assert sides graph
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxPositionStateGraph(side, {
							desktop: ['Normal', 'Hover'],
							tablet: ['Normal'],
							mobile: ['Normal', 'Hover'],
						});
					});

					// Assert box label graph
					cy.checkBoxPositionStateGraph('box', {
						desktop: ['Normal', 'Hover'],
						tablet: ['Normal'],
						mobile: ['Normal', 'Hover'],
					});

					// Assert control label graph
					cy.checkBoxPositionStateGraph('control', {
						desktop: ['Normal', 'Hover'],
						tablet: ['Normal', 'Hover'],
						mobile: ['Normal', 'Hover'],
					});
				});

				it('Reset by clicking control label (Single Reset)', () => {
					/**
					 * Tablet device
					 */
					setDeviceType('Tablet');

					/**
					 * Hover state
					 */
					setBlockState('Hover');

					/**
					 * reset by clicking on control label
					 */
					cy.resetBoxPositionAttribute('control', 'reset');

					/**
					 * reset and assert labels
					 */
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						// Assert side label after set value
						cy.checkBoxPositionLabelClassName(
							side,
							['changed-in-normal-state'],
							'have'
						);
						cy.checkBoxPositionLabelClassName(
							side,
							[
								'changed-in-secondary-state',
								//'changed-in-other-state', // TODO @reza this class should not exists
							],
							'not-have'
						);

						// Assert label value
						cy.checkBoxPositionLabelContent(side, '20');
					});

					// assert control label
					cy.checkBoxPositionLabelClassName(
						'control',
						['changed-in-normal-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'control',
						[
							'changed-in-secondary-state',
							//'changed-in-other-state', // TODO @reza this class should not exists
						],
						'not-have'
					);

					// Assert sides graph
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxPositionStateGraph(side, {
							desktop: ['Normal', 'Hover'],
							tablet: ['Normal'],
							mobile: ['Normal', 'Hover'],
						});
					});

					// Assert box label graph
					cy.checkBoxPositionStateGraph('box', {
						desktop: ['Normal', 'Hover'],
						tablet: ['Normal'],
						mobile: ['Normal', 'Hover'],
					});

					// Assert control label graph
					cy.checkBoxPositionStateGraph('control', {
						desktop: ['Normal', 'Hover'],
						tablet: ['Normal'],
						mobile: ['Normal', 'Hover'],
					});
				});
			});

			describe('Reset All', () => {
				it('Reset by clicking on each side label (Reset All)', () => {
					/**
					 * Tablet device
					 */
					setDeviceType('Tablet');

					/**
					 * Hover state
					 */
					setBlockState('Hover');

					/**
					 * reset and assert labels
					 */
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.resetBoxPositionAttribute(side, 'reset-all');

						// Assert side label after set value
						cy.checkBoxPositionLabelClassName(
							side,
							['changed-in-normal-state'],
							'have'
						);
						cy.checkBoxPositionLabelClassName(
							side,
							[
								'changed-in-secondary-state',
								//'changed-in-other-state', // TODO @reza this class should not exists
							],
							'not-have'
						);

						// Assert label value
						cy.checkBoxPositionLabelContent(side, '-');
					});

					// Assert box label
					cy.checkBoxPositionLabelClassName(
						'box',
						['changed-in-normal-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'box',
						[
							'changed-in-secondary-state',
							//'changed-in-other-state', // TODO @reza this class should not exists
						],
						'not-have'
					);

					// assert control label
					cy.checkBoxPositionLabelClassName(
						'control',
						['changed-in-normal-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'control',
						[
							'changed-in-secondary-state',
							//'changed-in-other-state', // TODO @reza this class should not exists
						],
						'not-have'
					);

					// TODO @reza - if reset all works correctly then the values should not exists in all states and breakpoint
					// Assert sides graph
					// ['top', 'right', 'bottom', 'left'].forEach((side) => {
					// cy.checkBoxPositionStateGraph(side, {});
					// });

					// TODO @reza - if reset all works correctly then the values should not exists in all states and breakpoint
					// Assert box label graph
					// cy.checkBoxPositionStateGraph('box', {});

					// TODO @reza - if reset all works correctly then the 'Normal' should not exists for desktop & mobile
					// Assert control label graph
					cy.checkBoxPositionStateGraph('control', {
						desktop: ['Normal', 'Hover'],
						tablet: ['Normal'],
						mobile: ['Normal', 'Hover'],
					});
				});

				it('Reset by clicking on box label (Reset All)', {}, () => {
					/**
					 * Tablet device
					 */
					setDeviceType('Tablet');

					/**
					 * Hover state
					 */
					setBlockState('Hover');

					/**
					 * reset by clicking on box label
					 */
					cy.resetBoxPositionAttribute('box', 'reset-all');

					/**
					 * reset and assert labels
					 */
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxPositionLabelClassName(
							side,
							[
								'changed-in-normal-state',
								'changed-in-secondary-state',
								'changed-in-other-state',
							],
							'not-have'
						);

						// Assert label value
						cy.checkBoxPositionLabelContent(side, '-');
					});

					// Assert box label
					cy.checkBoxPositionLabelClassName(
						'box',
						[
							'changed-in-normal-state',
							'changed-in-secondary-state',
							'changed-in-other-state',
						],
						'not-have'
					);

					// assert control label
					cy.checkBoxPositionLabelClassName(
						'control',
						['changed-in-normal-state'],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						'control',
						[
							'changed-in-secondary-state',
							//'changed-in-other-state', // TODO @reza this class should not exists
						],
						'not-have'
					);

					// Assert sides graph
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxPositionStateGraph(side, {});
					});

					// Assert box label graph
					cy.checkBoxPositionStateGraph('box', {});

					// Assert control label graph
					cy.checkBoxPositionStateGraph('control', {
						desktop: ['Normal'],
					});
				});

				it('Reset by clicking control label (Single All)', () => {
					/**
					 * Tablet device
					 */
					setDeviceType('Tablet');

					/**
					 * Hover state
					 */
					setBlockState('Hover');

					/**
					 * reset by clicking on control label
					 */
					cy.resetBoxPositionAttribute('control', 'reset-all');

					// Assert side label to not exist
					cy.get(`[data-cy="box-position-label-box"]`).should(
						'not.exist'
					);
					cy.get(`[data-cy="box-position-label-top"]`).should(
						'not.exist'
					);
					cy.get(`[data-cy="box-position-label-right"]`).should(
						'not.exist'
					);
					cy.get(`[data-cy="box-position-label-bottom"]`).should(
						'not.exist'
					);
					cy.get(`[data-cy="box-position-label-left"]`).should(
						'not.exist'
					);

					// Assert control label
					cy.checkBoxPositionLabelClassName(
						'control',
						[
							'changed-in-normal-state',
							'changed-in-secondary-state',
							'changed-in-other-state',
						],
						'not-have'
					);

					// Assert control label graph
					cy.checkBoxPositionStateGraph('control', {});
				});
			});
		});
	});

	describe('Switching between states and devices', () => {
		beforeEach(() => {
			// we use prepared block to run test faster
			appendBlocks(`<!-- wp:paragraph {"className":"blockera-block blockera-block-9a93cf21-70bc-427c-a2a2-b774084972d8","blockeraPosition":{"type":"relative","position":{"top":"20px","right":"20px","bottom":"20px","left":"20px"}},"blockeraBlockStates":{"hover":{"breakpoints":{"desktop":{"attributes":{"blockeraPosition":{"type":"relative","position":{"top":"25px","right":"25px","bottom":"25px","left":"25px"}}}},"tablet":{"attributes":{"blockeraPosition":{"type":"relative","position":{"top":"35px","right":"35px","bottom":"35px","left":"35px"}}}},"mobile":{"attributes":{"blockeraPosition":{"type":"relative","position":{"top":"45px","right":"45px","bottom":"45px","left":"45px"}}}}},"isVisible":true},"normal":{"breakpoints":{"tablet":{"attributes":{"blockeraPosition":{"type":"relative","position":{"top":"30px","right":"30px","bottom":"30px","left":"30px"}}}},"mobile":{"attributes":{"blockeraPosition":{"type":"relative","position":{"top":"40px","right":"40px","bottom":"40px","left":"40px"}}}}},"isVisible":true}},"blockeraPropsId":"61823453747","blockeraCompatId":"61823453806"} -->
<p class="blockera-block blockera-block-9a93cf21-70bc-427c-a2a2-b774084972d8">This is test paragraph</p>
<!-- /wp:paragraph -->`);

			cy.getBlock('core/paragraph').click();

			// Alias
			cy.getByDataCy('box-position-control').within(() => {
				cy.getByAriaLabel('Top Position').as('top-position');
				cy.getByAriaLabel('Right Position').as('right-position');
				cy.getByAriaLabel('Bottom Position').as('bottom-position');
				cy.getByAriaLabel('Left Position').as('left-position');
			});
		});

		it('Try multiple switch between devices and states to broke label', () => {
			const labelValues = {
				Desktop: {
					Normal: '20',
					Hover: '25',
				},
				Tablet: {
					Normal: '30',
					Hover: '35',
				},
				'Mobile Portrait': {
					Normal: '40',
					Hover: '45',
				},
			};

			[
				['Desktop', 'Normal'],
				['Desktop', 'Hover'],
				['Tablet', 'Normal'],
				['Tablet', 'Hover'],
				['Mobile Portrait', 'Normal'],
				['Mobile Portrait', 'Hover'],
				['Desktop', 'Hover'],
				['Tablet', 'Hover'],
				['Mobile Portrait', 'Normal'],
				['Desktop', 'Normal'],
				['Tablet', 'Hover'],
				['Mobile Portrait', 'Hover'],
				['Desktop', 'Normal'],
			].forEach((item) => {
				const device = item[0];
				const state = item[1];

				/**
				 * Switch device
				 */
				setDeviceType(device);

				/**
				 * Switch state
				 */
				setBlockState(state);

				['top', 'right', 'bottom', 'left'].forEach((side) => {
					// Assert label value
					cy.checkBoxPositionLabelContent(
						side,
						labelValues[device][state]
					);

					cy.checkBoxPositionLabelClassName(
						side,
						[
							state === 'Hover'
								? 'changed-in-secondary-state'
								: 'changed-in-normal-state',
						],
						'have'
					);
					cy.checkBoxPositionLabelClassName(
						side,
						[
							state === 'Hover'
								? 'changed-in-normal-state'
								: 'changed-in-secondary-state',
							'changed-in-other-state',
						],
						'not-have'
					);
				});

				// assert the box label
				cy.checkBoxPositionLabelClassName(
					'box',
					[
						state === 'Hover'
							? 'changed-in-secondary-state'
							: 'changed-in-normal-state',
					],
					'have'
				);
				cy.checkBoxPositionLabelClassName(
					'box',
					[
						state === 'Hover'
							? 'changed-in-normal-state'
							: 'changed-in-secondary-state',
						'changed-in-other-state',
					],
					'not-have'
				);
			});
		});
	});
});
