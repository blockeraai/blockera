import {
	createPost,
	setBlockState,
	addBlockState,
	setDeviceType,
	setBoxSpacingSide,
	appendBlocks,
} from '@blockera/dev-cypress/js/helpers';

describe('Box spacing label testing (Box Spacing Control)', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	it('Change value on Desktop → Normal', () => {
		/**
		 * Desktop device
		 */
		setDeviceType('Desktop');

		// Assert label before set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					[
						'changed-in-normal-state',
						'changed-in-secondary-state',
						'changed-in-other-state',
					],
					'not-have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '-');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				[
					'changed-in-normal-state',
					'changed-in-secondary-state',
					'changed-in-other-state',
				],
				'not-have'
			);
		});

		// set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				setBoxSpacingSide(`${type}-${side}`, 10);
			});
		});

		// Assert label after set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					'changed-in-normal-state',
					'have'
				);

				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					['changed-in-secondary-state', 'changed-in-other-state'],
					'not-have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '10');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				'changed-in-normal-state',
				'have'
			);
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				['changed-in-secondary-state', 'changed-in-other-state'],
				'not-have'
			);
		});

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label after set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					'changed-in-normal-state',
					'have'
				);
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					['changed-in-secondary-state', 'changed-in-other-state'],
					'not-have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '10');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				'changed-in-normal-state',
				'have'
			);
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				['changed-in-secondary-state', 'changed-in-other-state'],
				'not-have'
			);
		});

		// Assert state graph
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingStateGraph(type, side, {
					desktop: ['Normal'],
				});
			});

			cy.checkBoxSpacingStateGraph(type, '', {
				desktop: ['Normal'],
			});
		});
	});

	it('Change value on Desktop → Hover', () => {
		/**
		 * Desktop device
		 */
		setDeviceType('Desktop');

		/**
		 * Hover state
		 */
		addBlockState('Hover');

		// Assert label before set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					[
						'changed-in-normal-state',
						'changed-in-secondary-state',
						'changed-in-other-state',
					],
					'not-have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '-');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				[
					'changed-in-normal-state',
					'changed-in-secondary-state',
					'changed-in-other-state',
				],
				'not-have'
			);
		});

		// set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				setBoxSpacingSide(`${type}-${side}`, 20);
			});
		});

		// Assert label after set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					['changed-in-normal-state', 'changed-in-other-state'],
					'not-have'
				);

				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					'changed-in-secondary-state',
					'have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '20');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				['changed-in-normal-state', 'changed-in-other-state'],
				'not-have'
			);
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				'changed-in-secondary-state',
				'have'
			);
		});

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label after set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					['changed-in-normal-state', 'changed-in-secondary-state'],
					'not-have'
				);

				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					'changed-in-other-state',
					'have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '-');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				['changed-in-normal-state', 'changed-in-secondary-state'],
				'not-have'
			);
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				'changed-in-other-state',
				'have'
			);
		});

		// Assert state graph
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingStateGraph(type, side, {
					desktop: ['Hover'],
				});
			});

			cy.checkBoxSpacingStateGraph(type, '', {
				desktop: ['Hover'],
			});
		});
	});

	it('Change value on Desktop → Normal & Hover', () => {
		/**
		 * Desktop device
		 */
		setDeviceType('Desktop');

		// set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				setBoxSpacingSide(`${type}-${side}`, 20);
			});
		});

		// Assert label after set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					'changed-in-normal-state',
					'have'
				);

				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					['changed-in-secondary-state', 'changed-in-other-state'],
					'not-have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '20');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				'changed-in-normal-state',
				'have'
			);
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				['changed-in-secondary-state', 'changed-in-other-state'],
				'not-have'
			);
		});

		/**
		 * Hover
		 */
		addBlockState('hover');

		// Assert label before set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					'changed-in-normal-state',
					'have'
				);

				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					['changed-in-secondary-state', 'changed-in-other-state'],
					'not-have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '20');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				'changed-in-normal-state',
				'have'
			);
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				['changed-in-secondary-state', 'changed-in-other-state'],
				'not-have'
			);
		});

		// set value in hover
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				setBoxSpacingSide(`${type}-${side}`, 30);
			});
		});

		// Assert label before set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					'changed-in-secondary-state',
					'have'
				);

				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					['changed-in-normal-state', 'changed-in-other-state'],
					'not-have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '30');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				'changed-in-secondary-state',
				'have'
			);
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				['changed-in-normal-state', 'changed-in-other-state'],
				'not-have'
			);
		});

		// Assert state graph
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingStateGraph(type, side, {
					desktop: ['Normal', 'Hover'],
				});
			});

			cy.checkBoxSpacingStateGraph(type, '', {
				desktop: ['Normal', 'Hover'],
			});
		});
	});

	it('Change value on Tablet → Normal', () => {
		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label before set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					[
						'changed-in-normal-state',
						'changed-in-secondary-state',
						'changed-in-other-state',
					],
					'not-have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '-');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				[
					'changed-in-normal-state',
					'changed-in-secondary-state',
					'changed-in-other-state',
				],
				'not-have'
			);
		});

		// set value in hover
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				setBoxSpacingSide(`${type}-${side}`, 20);
			});
		});

		// Assert label after set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					'changed-in-normal-state',
					'have'
				);
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					['changed-in-secondary-state', 'changed-in-other-state'],
					'not-have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '20');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				'changed-in-normal-state',
				'have'
			);
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				['changed-in-secondary-state', 'changed-in-other-state'],
				'not-have'
			);
		});

		/**
		 * Desktop device
		 */
		setDeviceType('Desktop');

		// Assert label
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					'changed-in-other-state',
					'have'
				);

				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					['changed-in-normal-state', 'changed-in-secondary-state'],
					'not-have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '-');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				['changed-in-other-state'],
				'have'
			);
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				['changed-in-normal-state', 'changed-in-secondary-state'],
				'not-have'
			);
		});

		// Assert state graph
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingStateGraph(type, side, {
					tablet: ['Normal'],
				});
			});

			cy.checkBoxSpacingStateGraph(type, '', {
				tablet: ['Normal'],
			});
		});
	});

	it('Change value on Tablet → Hover', () => {
		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		/**
		 * Hover
		 */
		addBlockState('hover');

		// Assert label before set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					[
						'changed-in-normal-state',
						'changed-in-secondary-state',
						'changed-in-other-state',
					],
					'not-have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '-');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				[
					'changed-in-normal-state',
					'changed-in-secondary-state',
					'changed-in-other-state',
				],
				'not-have'
			);
		});

		// set value in hover
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				setBoxSpacingSide(`${type}-${side}`, 20);
			});
		});

		// Assert label after set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					['changed-in-secondary-state'],
					'have'
				);

				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					['changed-in-normal-state', 'changed-in-other-state'],
					'not-have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '20');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				['changed-in-secondary-state'],
				'have'
			);
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				['changed-in-normal-state', 'changed-in-other-state'],
				'not-have'
			);
		});

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					['changed-in-other-state'],
					'have'
				);

				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					['changed-in-normal-state', 'changed-in-secondary-state'],
					'not-have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '-');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				['changed-in-other-state'],
				'have'
			);
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				['changed-in-normal-state', 'changed-in-secondary-state'],
				'not-have'
			);
		});

		/**
		 * Desktop device
		 */
		setDeviceType('Desktop');

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					['changed-in-other-state'],
					'have'
				);

				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					['changed-in-normal-state', 'changed-in-secondary-state'],
					'not-have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '-');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				['changed-in-other-state'],
				'have'
			);
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				['changed-in-normal-state', 'changed-in-secondary-state'],
				'not-have'
			);
		});

		// Assert state graph
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingStateGraph(type, side, {
					tablet: ['Hover'],
				});
			});

			cy.checkBoxSpacingStateGraph(type, '', {
				tablet: ['Hover'],
			});
		});
	});

	describe('Single Reset', () => {
		beforeEach(() => {
			// we use prepared block to run test faster
			appendBlocks(`<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"20px","right":"20px","bottom":"20px","left":"20px"},"padding":{"top":"20px","right":"20px","bottom":"20px","left":"20px"}}},"blockeraSpacing":{"margin":{"top":"20px","right":"20px","bottom":"20px","left":"20px"},"padding":{"top":"20px","right":"20px","bottom":"20px","left":"20px"}},"blockeraBlockStates":{"hover":{"breakpoints":{"desktop":{"attributes":{"blockeraSpacing":{"margin":{"right":"25px","bottom":"25px","left":"25px","top":"25px"},"padding":{"top":"25px","right":"25px","bottom":"25px","left":"25px"}}}},"tablet":{"attributes":{"blockeraSpacing":{"margin":{"right":"35px","bottom":"35px","left":"35px","top":"35px"},"padding":{"top":"35px","right":"35px","bottom":"35px","left":"35px"}}}}},"isVisible":true},"normal":{"breakpoints":{"tablet":{"attributes":{"blockeraSpacing":{"margin":{"right":"30px","bottom":"30px","left":"30px","top":"30px"},"padding":{"top":"30px","right":"30px","bottom":"30px","left":"30px"}}}}},"isVisible":true}},"blockeraPropsId":"61714437610","blockeraCompatId":"61714437692"} -->
<p style="margin-top:20px;margin-right:20px;margin-bottom:20px;margin-left:20px;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px">This is test paragraph</p>
<!-- /wp:paragraph -->`);

			cy.getBlock('core/paragraph').click();
		});

		describe('Desktop → Normal', () => {
			it('reset by clicking on each side label', () => {
				/**
				 * Desktop device
				 */
				setDeviceType('Desktop');

				/**
				 * Normal state
				 */
				setBlockState('Normal');

				// Reset to normal
				['margin', 'padding'].forEach((type) => {
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxSpacingLabelContent(type, side, '20');

						cy.resetBoxSpacingAttribute(type, side, 'reset');

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							['changed-in-other-state'],
							'have'
						);

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							[
								'changed-in-normal-state',
								'changed-in-secondary-state',
							],
							'not-have'
						);

						cy.checkBoxSpacingLabelContent(type, side, '-');
					});

					// assert the spacing type label
					cy.checkBoxSpacingLabelClassName(
						type,
						'',
						['changed-in-other-state'],
						'have'
					);
					cy.checkBoxSpacingLabelClassName(
						type,
						'',
						[
							'changed-in-normal-state',
							'changed-in-secondary-state',
						],
						'not-have'
					);
				});

				// Assert state graph
				['margin', 'padding'].forEach((type) => {
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxSpacingStateGraph(type, side, {
							tablet: ['Hover', 'Normal'],
							desktop: ['Hover'],
						});
					});

					cy.checkBoxSpacingStateGraph(type, '', {
						tablet: ['Hover', 'Normal'],
						desktop: ['Hover'],
					});
				});
			});

			it('reset by clicking on whole type label', () => {
				/**
				 * Desktop device
				 */
				setDeviceType('Desktop');

				/**
				 * Normal state
				 */
				setBlockState('Normal');

				// Reset to normal
				['margin', 'padding'].forEach((type) => {
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxSpacingLabelContent(type, side, '20');

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							['changed-in-normal-state'],
							'have'
						);

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							[
								'changed-in-other-state',
								'changed-in-secondary-state',
							],
							'not-have'
						);
					});

					// reset the type to remove all sides
					cy.resetBoxSpacingAttribute(type, '', 'reset');

					// assert sides label
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxSpacingLabelContent(type, side, '-');

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							['changed-in-other-state'],
							'have'
						);

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							[
								'changed-in-normal-state',
								'changed-in-secondary-state',
							],
							'not-have'
						);
					});

					// assert the spacing type label
					cy.checkBoxSpacingLabelClassName(
						type,
						'',
						['changed-in-other-state'],
						'have'
					);
					cy.checkBoxSpacingLabelClassName(
						type,
						'',
						[
							'changed-in-normal-state',
							'changed-in-secondary-state',
						],
						'not-have'
					);
				});

				// Assert state graph
				['margin', 'padding'].forEach((type) => {
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxSpacingStateGraph(type, side, {
							tablet: ['Hover', 'Normal'],
							desktop: ['Hover'],
						});
					});

					cy.checkBoxSpacingStateGraph(type, '', {
						tablet: ['Hover', 'Normal'],
						desktop: ['Hover'],
					});
				});
			});
		});

		describe('Tablet → Normal', () => {
			it('reset by clicking on each side label', () => {
				/**
				 * Tablet device
				 */
				setDeviceType('Tablet');

				/**
				 * Normal state
				 */
				setBlockState('Normal');

				// Reset to normal
				['margin', 'padding'].forEach((type) => {
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxSpacingLabelContent(type, side, '30');

						cy.resetBoxSpacingAttribute(type, side, 'reset');

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							['changed-in-normal-state'],
							'have'
						);

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							[
								'changed-in-other-state',
								'changed-in-secondary-state',
							],
							'not-have'
						);

						cy.checkBoxSpacingLabelContent(type, side, '20');
					});

					// assert the spacing type label
					cy.checkBoxSpacingLabelClassName(
						type,
						'',
						['changed-in-normal-state'],
						'have'
					);
					cy.checkBoxSpacingLabelClassName(
						type,
						'',
						[
							'changed-in-other-state',
							'changed-in-secondary-state',
						],
						'not-have'
					);
				});

				// Assert state graph
				['margin', 'padding'].forEach((type) => {
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxSpacingStateGraph(type, side, {
							tablet: ['Hover'],
							desktop: ['Hover', 'Normal'],
						});
					});

					cy.checkBoxSpacingStateGraph(type, '', {
						tablet: ['Hover'],
						desktop: ['Hover', 'Normal'],
					});
				});

				// TODO @reza - fix this - the normal and tablet attrs are reset and should not exist
				// Assert store data
				// getWPDataObject().then((data) => {
				// 	expect({}).to.be.deep.eq(
				// 		getSelectedBlock(data, 'blockeraBlockStates').normal
				// 			.breakpoints.tablet.attributes
				// 	);
				// });
			});

			it('reset by clicking on whole type label', () => {
				/**
				 * Tablet device
				 */
				setDeviceType('Tablet');

				/**
				 * Normal state
				 */
				setBlockState('Normal');

				// Reset to normal
				['margin', 'padding'].forEach((type) => {
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxSpacingLabelContent(type, side, '30');

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							['changed-in-normal-state'],
							'have'
						);

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							[
								'changed-in-other-state',
								'changed-in-secondary-state',
							],
							'not-have'
						);
					});

					// reset the type to remove all sides
					cy.resetBoxSpacingAttribute(type, '', 'reset');

					// assert sides label
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						// TODO - @reza - fix this - by resetting a type (margin or padding) all sides should be removed and value of side should be 20 (normal on desktop)
						// cy.checkBoxSpacingLabelContent(
						// 	type,
						// 	side,
						// 	'20'
						// );

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							['changed-in-normal-state'],
							'have'
						);

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							[
								'changed-in-other-state',
								'changed-in-secondary-state',
							],
							'not-have'
						);
					});

					// assert the spacing type label
					cy.checkBoxSpacingLabelClassName(
						type,
						'',
						['changed-in-normal-state'],
						'have'
					);
					cy.checkBoxSpacingLabelClassName(
						type,
						'',
						[
							'changed-in-other-state',
							'changed-in-secondary-state',
						],
						'not-have'
					);
				});

				// Assert state graph
				['margin', 'padding'].forEach((type) => {
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxSpacingStateGraph(type, side, {
							tablet: ['Hover'],
							desktop: ['Hover', 'Normal'],
						});
					});

					cy.checkBoxSpacingStateGraph(type, '', {
						tablet: ['Hover'],
						desktop: ['Hover', 'Normal'],
					});
				});

				// TODO @reza - fix this - the normal and tablet attrs are reset and should not exist
				// Assert store data
				// getWPDataObject().then((data) => {
				// 	expect({}).to.be.deep.eq(
				// 		getSelectedBlock(data, 'blockeraBlockStates').normal
				// 			.breakpoints.tablet.attributes
				// 	);
				// });
			});
		});

		describe('Tablet → Hover', () => {
			it('reset by clicking on each side label', () => {
				/**
				 * Tablet device
				 */
				setDeviceType('Tablet');

				/**
				 * Hover state
				 */
				setBlockState('Hover');

				// Reset to normal
				['margin', 'padding'].forEach((type) => {
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxSpacingLabelContent(type, side, '35');

						cy.resetBoxSpacingAttribute(type, side, 'reset');

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							['changed-in-normal-state'],
							'have'
						);

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							[
								'changed-in-other-state',
								'changed-in-secondary-state',
							],
							'not-have'
						);

						// TODO @reza - fix this - hover value reset so the label should be 30 (normal value on tablet)
						// cy.checkBoxSpacingLabelContent(
						// 	type,
						// 	side,
						// 	'30'
						// );
					});

					// assert the spacing type label
					cy.checkBoxSpacingLabelClassName(
						type,
						'',
						['changed-in-normal-state'],
						'have'
					);
					cy.checkBoxSpacingLabelClassName(
						type,
						'',
						[
							'changed-in-other-state',
							'changed-in-secondary-state',
						],
						'not-have'
					);
				});

				// Assert state graph
				['margin', 'padding'].forEach((type) => {
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxSpacingStateGraph(type, side, {
							tablet: ['Normal'],
							desktop: ['Hover', 'Normal'],
						});
					});

					cy.checkBoxSpacingStateGraph(type, '', {
						tablet: ['Normal'],
						desktop: ['Hover', 'Normal'],
					});
				});

				// TODO @reza - fix this - the hover and tablet attrs are reset and should not exist
				// Assert store data
				// getWPDataObject().then((data) => {
				// 	expect({}).to.be.deep.eq(
				// 		getSelectedBlock(data, 'blockeraBlockStates').hover
				// 			.breakpoints.tablet.attributes
				// 	);
				// });
			});

			it('reset by clicking on whole type label', () => {
				/**
				 * Tablet device
				 */
				setDeviceType('Tablet');

				/**
				 * Hover state
				 */
				setBlockState('Hover');

				// Reset to normal
				['margin', 'padding'].forEach((type) => {
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxSpacingLabelContent(type, side, '35');

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							['changed-in-secondary-state'],
							'have'
						);

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							[
								'changed-in-normal-state',
								'changed-in-other-state',
							],
							'not-have'
						);
					});

					// reset the type to remove all sides
					cy.resetBoxSpacingAttribute(type, '', 'reset');

					// assert sides label
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						// TODO - @reza - fix this - by resetting a type (margin or padding) all sides should be removed and value of side should be 20 (normal on desktop)
						// cy.checkBoxSpacingLabelContent(
						// 	type,
						// 	side,
						// 	'30'
						// );

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							['changed-in-normal-state'],
							'have'
						);

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							[
								'changed-in-other-state',
								'changed-in-secondary-state',
							],
							'not-have'
						);
					});

					// assert the spacing type label
					cy.checkBoxSpacingLabelClassName(
						type,
						'',
						['changed-in-normal-state'],
						'have'
					);
					cy.checkBoxSpacingLabelClassName(
						type,
						'',
						[
							'changed-in-other-state',
							'changed-in-secondary-state',
						],
						'not-have'
					);
				});

				// Assert state graph
				['margin', 'padding'].forEach((type) => {
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxSpacingStateGraph(type, side, {
							tablet: ['Normal'],
							desktop: ['Hover', 'Normal'],
						});
					});

					cy.checkBoxSpacingStateGraph(type, '', {
						tablet: ['Normal'],
						desktop: ['Hover', 'Normal'],
					});
				});

				// TODO @reza - fix this - the normal and tablet attrs are reset and should not exist
				// Assert store data
				// getWPDataObject().then((data) => {
				// 	expect({}).to.be.deep.eq(
				// 		getSelectedBlock(data, 'blockeraBlockStates').hover
				// 			.breakpoints.tablet.attributes
				// 	);
				// });
			});
		});
	});

	describe('Reset All', () => {
		beforeEach(() => {
			// we use prepared block to run test faster
			appendBlocks(`<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"20px","right":"20px","bottom":"20px","left":"20px"},"padding":{"top":"20px","right":"20px","bottom":"20px","left":"20px"}}},"blockeraSpacing":{"margin":{"top":"20px","right":"20px","bottom":"20px","left":"20px"},"padding":{"top":"20px","right":"20px","bottom":"20px","left":"20px"}},"blockeraBlockStates":{"hover":{"breakpoints":{"desktop":{"attributes":{"blockeraSpacing":{"margin":{"right":"25px","bottom":"25px","left":"25px","top":"25px"},"padding":{"top":"25px","right":"25px","bottom":"25px","left":"25px"}}}},"tablet":{"attributes":{"blockeraSpacing":{"margin":{"right":"35px","bottom":"35px","left":"35px","top":"35px"},"padding":{"top":"35px","right":"35px","bottom":"35px","left":"35px"}}}}},"isVisible":true},"normal":{"breakpoints":{"tablet":{"attributes":{"blockeraSpacing":{"margin":{"right":"30px","bottom":"30px","left":"30px","top":"30px"},"padding":{"top":"30px","right":"30px","bottom":"30px","left":"30px"}}}}},"isVisible":true}},"blockeraPropsId":"61714437610","blockeraCompatId":"61714437692"} -->
<p style="margin-top:20px;margin-right:20px;margin-bottom:20px;margin-left:20px;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px">This is test paragraph</p>
<!-- /wp:paragraph -->`);

			cy.getBlock('core/paragraph').click();
		});

		describe('Desktop → Normal', () => {
			it('reset all by clicking on each side label', () => {
				/**
				 * Desktop device
				 */
				setDeviceType('Desktop');

				/**
				 * Normal state
				 */
				setBlockState('Normal');

				// Reset to normal
				['margin', 'padding'].forEach((type) => {
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxSpacingLabelContent(type, side, '20');

						cy.resetBoxSpacingAttribute(type, side, 'reset-all');

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							[
								'changed-in-normal-state',
								'changed-in-secondary-state',
								// 'changed-in-other-state', // TODO @reza - fix this - reset all not works
							],
							'not-have'
						);

						cy.checkBoxSpacingLabelContent(type, side, '-');
					});

					// assert the spacing type label
					cy.checkBoxSpacingLabelClassName(
						type,
						'',
						[
							'changed-in-normal-state',
							'changed-in-secondary-state',
							// 'changed-in-other-state', // TODO @reza - fix this - reset all not works
						],
						'not-have'
					);
				});

				// TODO: @reza - fix this - the reset should remove all graph history!
				// // Assert state graph
				// ['margin', 'padding'].forEach((type) => {
				// 	['top', 'right', 'bottom', 'left'].forEach((side) => {
				// 		cy.checkBoxSpacingStateGraph(type, side, {});
				// 	});

				// 	cy.checkBoxSpacingStateGraph(type, '', {});
				// });
			});

			it('reset all by clicking on whole type label', () => {
				/**
				 * Desktop device
				 */
				setDeviceType('Desktop');

				/**
				 * Normal state
				 */
				setBlockState('Normal');

				// Reset to normal
				['margin', 'padding'].forEach((type) => {
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxSpacingLabelContent(type, side, '20');

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							['changed-in-normal-state'],
							'have'
						);

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							[
								'changed-in-other-state',
								'changed-in-secondary-state',
							],
							'not-have'
						);
					});

					// reset the type to remove all sides
					cy.resetBoxSpacingAttribute(type, '', 'reset-all');

					// assert sides label
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxSpacingLabelContent(type, side, '-');

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							[
								'changed-in-normal-state',
								'changed-in-secondary-state',
								// 'changed-in-other-state', // TODO @reza - fix this - reset all not works
							],
							'not-have'
						);
					});

					// assert the spacing type label
					cy.checkBoxSpacingLabelClassName(
						type,
						'',
						[
							'changed-in-normal-state',
							'changed-in-secondary-state',
							// 'changed-in-other-state', // TODO @reza - fix this - reset all not works
						],
						'not-have'
					);
				});

				// Assert state graph
				['margin', 'padding'].forEach((type) => {
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxSpacingStateGraph(type, side, {});
					});

					cy.checkBoxSpacingStateGraph(type, '', {});
				});
			});
		});
	});

	describe('Switching between states and devices', () => {
		beforeEach(() => {
			// we use prepared block to run test faster
			appendBlocks(`<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"20px","right":"20px","bottom":"20px","left":"20px"},"padding":{"top":"20px","right":"20px","bottom":"20px","left":"20px"}}},"blockeraSpacing":{"margin":{"top":"20px","right":"20px","bottom":"20px","left":"20px"},"padding":{"top":"20px","right":"20px","bottom":"20px","left":"20px"}},"blockeraBlockStates":{"hover":{"breakpoints":{"desktop":{"attributes":{"blockeraSpacing":{"margin":{"right":"25px","bottom":"25px","left":"25px","top":"25px"},"padding":{"top":"25px","right":"25px","bottom":"25px","left":"25px"}}}},"tablet":{"attributes":{"blockeraSpacing":{"margin":{"right":"35px","bottom":"35px","left":"35px","top":"35px"},"padding":{"top":"35px","right":"35px","bottom":"35px","left":"35px"}}}},"mobile":{"attributes":{"blockeraSpacing":{"margin":{"top":"45px","right":"45px","bottom":"45px","left":"45px"},"padding":{"top":"45px","right":"45px","bottom":"45px","left":"45px"}}}}},"isVisible":true},"normal":{"breakpoints":{"tablet":{"attributes":{"blockeraSpacing":{"margin":{"right":"30px","bottom":"30px","left":"30px","top":"30px"},"padding":{"top":"30px","right":"30px","bottom":"30px","left":"30px"}}}},"mobile":{"attributes":{"blockeraSpacing":{"margin":{"top":"40px","right":"40px","bottom":"40px","left":"40px"},"padding":{"top":"40px","right":"40px","bottom":"40px","left":"40px"}}}}},"isVisible":true}},"blockeraPropsId":"61714437610","blockeraCompatId":"61714437692"} -->
<p style="margin-top:20px;margin-right:20px;margin-bottom:20px;margin-left:20px;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px">This is test paragraph</p>
<!-- /wp:paragraph -->`);

			cy.getBlock('core/paragraph').click();
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

				['margin', 'padding'].forEach((type) => {
					['top', 'right', 'bottom', 'left'].forEach((side) => {
						cy.checkBoxSpacingLabelContent(
							type,
							side,
							labelValues[device][state]
						);

						cy.checkBoxSpacingLabelClassName(
							type,
							side,
							[
								state === 'Hover'
									? 'changed-in-secondary-state'
									: 'changed-in-normal-state',
							],
							'have'
						);

						cy.checkBoxSpacingLabelClassName(
							type,
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

					// assert the spacing type label
					cy.checkBoxSpacingLabelClassName(
						type,
						'',
						[
							state === 'Hover'
								? 'changed-in-secondary-state'
								: 'changed-in-normal-state',
						],
						'have'
					);
					cy.checkBoxSpacingLabelClassName(
						type,
						'',
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
});
