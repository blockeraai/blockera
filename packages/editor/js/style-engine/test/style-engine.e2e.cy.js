import {
	appendBlocks,
	createPost,
	getBlockClientId,
	getWPDataObject,
	setBlockState,
	setInnerBlock,
	setDeviceType,
	addBlockState,
	savePage,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Style Engine Testing ...', () => {
	beforeEach(() => {
		createPost();

		appendBlocks(
			`<!-- wp:paragraph -->
<p>Test paragraph WordPress core block with includes <a href="#">Link</a> element</p>
<!-- /wp:paragraph -->`
		);

		// Select target block
		cy.getBlock('core/paragraph').click();
	});

	function setDevice(device) {
		if ('desktop' !== device) {
			if (
				!Cypress.$('iframe[name="editor-canvas"]')
					.find('body')
					.hasClass(`is-${device}-preview`)
			) {
				setDeviceType('Desktop');
				setDeviceType(device);

				return;
			}
		}

		setDeviceType('Desktop');
	}

	describe('Responsive design', () => {
		it('should generate css for desktop device', () => {
			context(
				'sets background-color and transition on normal of desktop device',
				() => {
					// Set background color.
					cy.setColorControlValue('BG Color', '#16e2c1');

					// Set transition.
					cy.getByAriaLabel('Add New Transition').click();

					cy.getBlock('core/paragraph').should(
						'have.css',
						'background-color',
						'rgb(22, 226, 193)'
					);
					cy.getBlock('core/paragraph')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});
				}
			);

			context('add hover on desktop device with assertions', () => {
				// set hover block state.
				addBlockState('hover');

				// Set background color.
				cy.setColorControlValue('BG Color', '#e3178b');

				cy.getBlock('core/paragraph').should(
					'have.css',
					'background-color',
					'rgb(227, 23, 139)'
				);
				cy.getBlock('core/paragraph')
					.should('have.css', 'transition')
					.then((transitionValue) => {
						// Assert the transition value
						expect(transitionValue).to.includes('0.5s');
					});
			});

			context('front end - check style inheritance', () => {
				savePage();
				redirectToFrontPage();

				context('base breakpoint', () => {
					cy.get('.blockera-block').should(
						'have.css',
						'background-color',
						'rgb(22, 226, 193)'
					);
					cy.get('.blockera-block')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});

					cy.get('.blockera-block').realHover();
					cy.get('.blockera-block').should(
						'have.css',
						'background-color',
						'rgb(227, 23, 139)'
					);
					cy.get('.blockera-block')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});
				});

				context('xl-desktop', () => {
					// Set xl-desktop viewport
					cy.viewport(1441, 1920);

					cy.get('.blockera-block').should(
						'have.css',
						'background-color',
						'rgb(22, 226, 193)'
					);
					cy.get('.blockera-block')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});

					cy.get('.blockera-block').realHover();
					cy.get('.blockera-block').should(
						'have.css',
						'background-color',
						'rgb(227, 23, 139)'
					);
					cy.get('.blockera-block')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});
				});

				context('tablet', () => {
					// Set tablet viewport
					cy.viewport(991, 1368);

					cy.get('.blockera-block').should(
						'have.css',
						'background-color',
						'rgb(22, 226, 193)'
					);
					cy.get('.blockera-block')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});

					cy.get('.blockera-block').realHover();
					cy.get('.blockera-block').should(
						'have.css',
						'background-color',
						'rgb(227, 23, 139)'
					);
					cy.get('.blockera-block')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});
				});
			});
		});

		it('should generate css for tablet device', () => {
			context(
				'sets background-color and transition on normal of tablet device',
				() => {
					setDevice('Tablet');

					// Set background color.
					cy.setColorControlValue('BG Color', '#16e2c1');

					// Set transition.
					cy.getByAriaLabel('Add New Transition').click();

					cy.getBlock('core/paragraph').should(
						'have.css',
						'background-color',
						'rgb(22, 226, 193)'
					);
					cy.getBlock('core/paragraph')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});
				}
			);

			context('add hover on tablet device with assertions', () => {
				// set hover block state.
				addBlockState('hover');

				// Set background color.
				cy.setColorControlValue('BG Color', '#e3178b');

				setDevice('Desktop');
				setDevice('Tablet');

				cy.getBlock('core/paragraph').should(
					'have.css',
					'background-color',
					'rgb(227, 23, 139)'
				);
				cy.getBlock('core/paragraph')
					.should('have.css', 'transition')
					.then((transitionValue) => {
						// Assert the transition value
						expect(transitionValue).to.includes('0.5s');
					});
			});

			context(
				'checking generated styles on normal of tablet device',
				() => {
					setDevice('Tablet');
					setBlockState('Normal');

					cy.getBlock('core/paragraph').should(
						'have.css',
						'background-color',
						'rgb(22, 226, 193)'
					);
					cy.getBlock('core/paragraph')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});
				}
			);

			context('checking generated styles on desktop device', () => {
				setDevice('Desktop');

				cy.getBlock('core/paragraph').should(
					'not.have.css',
					'background-color',
					'rgb(22, 226, 193)'
				);
				cy.getBlock('core/paragraph').should(
					'not.have.css',
					'transition',
					'all 0.5s ease 0s'
				);

				cy.getBlock('core/paragraph').realHover();
				cy.getBlock('core/paragraph').should(
					'not.have.css',
					'background-color',
					'rgb(227, 23, 139)'
				);
				cy.getBlock('core/paragraph').should(
					'not.have.css',
					'transition',
					'all 0.5s ease 0s'
				);
			});

			context('front end - check style inheritance', () => {
				savePage();
				redirectToFrontPage();

				context('base breakpoint', () => {
					// Set xl-desktop viewport
					cy.viewport(1441, 1920);

					cy.get('.blockera-block').should(
						'not.have.css',
						'background-color',
						'rgb(22, 226, 193)'
					);
					cy.get('.blockera-block')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes(
								'all 0s ease 0s'
							);
						});
				});

				context('xl-desktop', () => {
					// Set xl-desktop viewport
					cy.viewport(1441, 1920);

					cy.get('.blockera-block').should(
						'not.have.css',
						'background-color',
						'rgb(22, 226, 193)'
					);
					cy.get('.blockera-block')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes(
								'all 0s ease 0s'
							);
						});
				});

				context('tablet', () => {
					// Set tablet viewport
					cy.viewport(991, 1368);

					cy.get('.blockera-block').should(
						'have.css',
						'background-color',
						'rgb(22, 226, 193)'
					);
					cy.get('.blockera-block')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});

					cy.get('.blockera-block').realHover();
					cy.get('.blockera-block').should(
						'have.css',
						'background-color',
						'rgb(227, 23, 139)'
					);
					cy.get('.blockera-block')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});
				});
			});
		});

		it('should generate css for desktop and tablet device on normal and hover states', () => {
			context('desktop', () => {
				context(
					'sets background-color and transition on normal',
					() => {
						// Set background color.
						cy.setColorControlValue('BG Color', '#16e2c1');

						// Set transition.
						cy.getByAriaLabel('Add New Transition').click();

						cy.getBlock('core/paragraph').should(
							'have.css',
							'background-color',
							'rgb(22, 226, 193)'
						);
						cy.getBlock('core/paragraph')
							.should('have.css', 'transition')
							.then((transitionValue) => {
								// Assert the transition value
								expect(transitionValue).to.includes('0.5s');
							});
					}
				);

				context('add hover with assertions', () => {
					// set hover block state.
					addBlockState('hover');

					// Set background color.
					cy.setColorControlValue('BG Color', '#e3178b');

					cy.getBlock('core/paragraph').should(
						'have.css',
						'background-color',
						'rgb(227, 23, 139)'
					);
					cy.getBlock('core/paragraph')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});
				});
			});

			context('tablet', () => {
				context('sets background-color on normal', () => {
					setDevice('Tablet');
					setBlockState('Normal');

					// Set background color.
					cy.setColorControlValue('BG Color', '#16e2c1');

					cy.getBlock('core/paragraph').should(
						'have.css',
						'background-color',
						'rgb(22, 226, 193)'
					);
					cy.getBlock('core/paragraph')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});
				});

				context('add hover with assertions', () => {
					setDevice('Tablet');

					// set hover block state.
					setBlockState('Hover');

					// Set background color.
					cy.setColorControlValue('BG Color', '#e3178b');

					cy.getBlock('core/paragraph').should(
						'have.css',
						'background-color',
						'rgb(227, 23, 139)'
					);
					cy.getBlock('core/paragraph')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});
				});

				context('checking generated styles on normal', () => {
					setDevice('Tablet');
					setBlockState('Normal');

					cy.getBlock('core/paragraph').realHover();
					cy.getBlock('core/paragraph').should(
						'have.css',
						'background-color',
						'rgb(227, 23, 139)'
					);
					cy.getBlock('core/paragraph')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});
				});
			});

			context('front end - check style inheritance', () => {
				savePage();
				redirectToFrontPage();

				context('base breakpoint', () => {
					cy.get('.blockera-block').should(
						'have.css',
						'background-color',
						'rgb(22, 226, 193)'
					);
					cy.get('.blockera-block')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});

					cy.get('.blockera-block').realHover();
					cy.get('.blockera-block').should(
						'have.css',
						'background-color',
						'rgb(227, 23, 139)'
					);
					cy.get('.blockera-block')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});
				});

				context('xl-desktop', () => {
					// Set xl-desktop viewport
					cy.viewport(1441, 1920);

					cy.get('.blockera-block').should(
						'have.css',
						'background-color',
						'rgb(22, 226, 193)'
					);
					cy.get('.blockera-block')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});

					cy.get('.blockera-block').realHover();
					cy.get('.blockera-block').should(
						'have.css',
						'background-color',
						'rgb(227, 23, 139)'
					);
					cy.get('.blockera-block')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});
				});

				context('tablet', () => {
					// Set tablet viewport
					cy.viewport(991, 1368);

					cy.get('.blockera-block').should(
						'have.css',
						'background-color',
						'rgb(22, 226, 193)'
					);
					cy.get('.blockera-block')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});

					cy.get('.blockera-block').realHover();
					cy.get('.blockera-block').should(
						'have.css',
						'background-color',
						'rgb(227, 23, 139)'
					);
					cy.get('.blockera-block')
						.should('have.css', 'transition')
						.then((transitionValue) => {
							// Assert the transition value
							expect(transitionValue).to.includes('0.5s');
						});
				});
			});
		});
	});
});
