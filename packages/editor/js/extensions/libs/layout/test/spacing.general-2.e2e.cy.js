/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	reSelectBlock,
	assertBlockData,
	getSelectedBlock,
	redirectToFrontPage,
	setBoxSpacingSide,
	openBoxSpacingSide,
	clearBoxSpacingSide,
} from '@blockera/dev-cypress/js/helpers';

describe('Spacing Extension', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });

		cy.getByAriaControls('styles-view').click();

		cy.get('.blockera-control-box-spacing').as('spacing');
	});

	describe('Margin', () => {
		it('Simple value', () => {
			setBoxSpacingSide('margin-top', 10);
			setBoxSpacingSide('margin-right', 20);
			setBoxSpacingSide('margin-bottom', 10);
			setBoxSpacingSide('margin-left', 30);

			//Check block
			cy.getBlock('core/paragraph')
				.should('have.css', 'margin-top', '10px')
				.and('have.css', 'margin-right', '20px')
				.and('have.css', 'margin-bottom', '10px')
				.and('have.css', 'margin-left', '30px');

			//Check store
			assertBlockData((data) => {
				expect({
					margin: {
						top: '10px',
						right: '20px',
						bottom: '10px',
						left: '30px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('p.blockera-block')
				.should('have.css', 'margin-top', '10px')
				.and('have.css', 'margin-right', '20px')
				.and('have.css', 'margin-bottom', '10px')
				.and('have.css', 'margin-left', '30px');
		});

		it('Variable value', () => {
			setBoxSpacingSide('margin-top', '20', true);
			setBoxSpacingSide('margin-right', '30', true);
			setBoxSpacingSide('margin-bottom', '40', true);
			setBoxSpacingSide('margin-left', '50', true);

			// Check block style
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should(
						'include',
						'margin-top: var(--wp--preset--spacing--20, 10px)'
					)
					.should(
						'include',
						'margin-right: var(--wp--preset--spacing--30, 20px)'
					)
					.should(
						'include',
						'margin-bottom: var(--wp--preset--spacing--40, 30px)'
					)
					.should(
						'include',
						'margin-left: var(--wp--preset--spacing--50, clamp(30px, 5vw, 50px))'
					);
			});

			// Check block attributes
			assertBlockData((data) => {
				expect({
					margin: {
						top: {
							settings: {
								name: 'Tiny',
								id: '20',
								value: '10px',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--20',
							},
							name: 'Tiny',
							isValueAddon: true,
							valueType: 'variable',
						},
						right: {
							settings: {
								name: 'X-Small',
								id: '30',
								value: '20px',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--30',
							},
							name: 'X-Small',
							isValueAddon: true,
							valueType: 'variable',
						},
						bottom: {
							settings: {
								name: 'Small',
								id: '40',
								value: '30px',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--40',
							},
							name: 'Small',
							isValueAddon: true,
							valueType: 'variable',
						},
						left: {
							settings: {
								name: 'Regular',
								id: '50',
								value: 'clamp(30px, 5vw, 50px)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--50',
							},
							name: 'Regular',
							isValueAddon: true,
							valueType: 'variable',
						},
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#blockera-inline-css')
				.invoke('text')
				.should(
					'include',
					'margin-top: var(--wp--preset--spacing--20, 10px)'
				)
				.should(
					'include',
					'margin-right: var(--wp--preset--spacing--30, 20px)'
				)
				.should(
					'include',
					'margin-bottom: var(--wp--preset--spacing--40, 30px)'
				)
				.should(
					'include',
					'margin-left: var(--wp--preset--spacing--50, clamp(30px, 5vw, 50px))'
				);
		});
	});

	describe('Padding', () => {
		it('Simple value', () => {
			setBoxSpacingSide('padding-top', 10);
			setBoxSpacingSide('padding-right', 20);
			setBoxSpacingSide('padding-bottom', 10);
			setBoxSpacingSide('padding-left', 30);

			//Check block
			cy.getBlock('core/paragraph')
				.should('have.css', 'padding-top', '10px')
				.and('have.css', 'padding-right', '20px')
				.and('have.css', 'padding-bottom', '10px')
				.and('have.css', 'padding-left', '30px');

			//Check store
			assertBlockData((data) => {
				expect({
					padding: {
						top: '10px',
						right: '20px',
						bottom: '10px',
						left: '30px',
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('p.blockera-block')
				.should('have.css', 'padding-top', '10px')
				.and('have.css', 'padding-right', '20px')
				.and('have.css', 'padding-bottom', '10px')
				.and('have.css', 'padding-left', '30px');
		});

		it('Variable value', () => {
			setBoxSpacingSide('padding-top', '20', true);
			setBoxSpacingSide('padding-right', '30', true);
			setBoxSpacingSide('padding-bottom', '40', true);
			setBoxSpacingSide('padding-left', '50', true);

			// Check block style
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should(
						'include',
						'padding-top: var(--wp--preset--spacing--20, 10px)'
					)
					.should(
						'include',
						'padding-right: var(--wp--preset--spacing--30, 20px)'
					)
					.should(
						'include',
						'padding-bottom: var(--wp--preset--spacing--40, 30px)'
					)
					.should(
						'include',
						'padding-left: var(--wp--preset--spacing--50, clamp(30px, 5vw, 50px))'
					);
			});

			// Check block attributes
			assertBlockData((data) => {
				expect({
					padding: {
						top: {
							settings: {
								name: 'Tiny',
								id: '20',
								value: '10px',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--20',
							},
							name: 'Tiny',
							isValueAddon: true,
							valueType: 'variable',
						},
						right: {
							settings: {
								name: 'X-Small',
								id: '30',
								value: '20px',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--30',
							},
							name: 'X-Small',
							isValueAddon: true,
							valueType: 'variable',
						},
						bottom: {
							settings: {
								name: 'Small',
								id: '40',
								value: '30px',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--40',
							},
							name: 'Small',
							isValueAddon: true,
							valueType: 'variable',
						},
						left: {
							settings: {
								name: 'Regular',
								id: '50',
								value: 'clamp(30px, 5vw, 50px)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--50',
							},
							name: 'Regular',
							isValueAddon: true,
							valueType: 'variable',
						},
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#blockera-inline-css')
				.invoke('text')
				.should(
					'include',
					'padding: var(--wp--preset--spacing--20, 10px) var(--wp--preset--spacing--30, 20px) var(--wp--preset--spacing--40, 30px) var(--wp--preset--spacing--50, clamp(30px, 5vw, 50px))'
				);
		});
	});

	describe('Both Padding + Margin', () => {
		it('All sides + Simple and Variable values', () => {
			//
			// Set Paddings
			//
			setBoxSpacingSide('padding-top', 10);
			setBoxSpacingSide('padding-right', '20', true);
			setBoxSpacingSide('padding-bottom', 30);
			setBoxSpacingSide('padding-left', '40', true);

			//
			// Set Margins
			//
			setBoxSpacingSide('margin-top', 20);
			setBoxSpacingSide('margin-right', '30', true);
			setBoxSpacingSide('margin-bottom', 40);
			setBoxSpacingSide('margin-left', '50', true);

			// Check block style
			cy.getIframeBody().within(() => {
				cy.get('#blockera-styles-wrapper')
					.invoke('text')
					.should('include', 'padding-top: 10px')
					.should(
						'include',
						'padding-right: var(--wp--preset--spacing--20, 10px)'
					)
					.should('include', 'padding-bottom: 30px')
					.should(
						'include',
						'padding-left: var(--wp--preset--spacing--40, 30px)'
					)
					.should('include', 'margin-top: 20px')
					.should(
						'include',
						'margin-right: var(--wp--preset--spacing--30, 20px)'
					)
					.should('include', 'margin-bottom: 40px')
					.should(
						'include',
						'margin-left: var(--wp--preset--spacing--50, clamp(30px, 5vw, 50px))'
					);
			});

			// Check block attributes
			assertBlockData((data) => {
				expect({
					margin: {
						top: '20px',
						right: {
							settings: {
								name: 'X-Small',
								id: '30',
								value: '20px',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--30',
							},
							name: 'X-Small',
							isValueAddon: true,
							valueType: 'variable',
						},
						bottom: '40px',
						left: {
							settings: {
								name: 'Regular',
								id: '50',
								value: 'clamp(30px, 5vw, 50px)',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--50',
							},
							name: 'Regular',
							isValueAddon: true,
							valueType: 'variable',
						},
					},
					padding: {
						top: '10px',
						right: {
							settings: {
								name: 'Tiny',
								id: '20',
								value: '10px',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--20',
							},
							name: 'Tiny',
							isValueAddon: true,
							valueType: 'variable',
						},
						bottom: '30px',
						left: {
							settings: {
								name: 'Small',
								id: '40',
								value: '30px',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'spacing',
								var: '--wp--preset--spacing--40',
							},
							name: 'Small',
							isValueAddon: true,
							valueType: 'variable',
						},
					},
				}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('style#blockera-inline-css')
				.invoke('text')
				.should(
					'include',
					'padding: 10px var(--wp--preset--spacing--20, 10px) 30px var(--wp--preset--spacing--40, 30px)'
				)
				.should('include', 'margin-top: 20px')
				.should(
					'include',
					'margin-right: var(--wp--preset--spacing--30, 20px)'
				)
				.should('include', 'margin-bottom: 40px')
				.should(
					'include',
					'margin-left: var(--wp--preset--spacing--50, clamp(30px, 5vw, 50px))'
				);
		});
	});

	it('simple lock + check reselect then unlock', () => {
		//
		// Test 1: Default lock state
		//

		//
		// Simple locked by default
		//
		setBoxSpacingSide('margin-top-bottom', 10);
		setBoxSpacingSide('margin-left-right', 20);
		setBoxSpacingSide('padding-top-bottom', 10);
		setBoxSpacingSide('padding-left-right', 20);

		//
		// Reselect current block
		//
		reSelectBlock('core/paragraph');

		//
		// Check controls availability to validate lock detection on block selection
		//
		cy.get(`input[data-test="margin-top-bottom"]`).should('exist');
		cy.get(`input[data-test="margin-left-right"]`).should('exist');
		cy.get(`input[data-test="margin-top"]`).should('not.exist');
		cy.get(`input[data-test="margin-right"]`).should('not.exist');
		cy.get(`input[data-test="margin-bottom"]`).should('not.exist');
		cy.get(`input[data-test="margin-left"]`).should('not.exist');

		cy.get(`input[data-test="padding-top-bottom"]`).should('exist');
		cy.get(`input[data-test="padding-left-right"]`).should('exist');
		cy.get(`input[data-test="padding-top"]`).should('not.exist');
		cy.get(`input[data-test="padding-right"]`).should('not.exist');
		cy.get(`input[data-test="padding-bottom"]`).should('not.exist');
		cy.get(`input[data-test="padding-left"]`).should('not.exist');

		//
		// Check store
		//
		assertBlockData((data) => {
			expect({
				padding: {
					top: '10px',
					right: '20px',
					bottom: '10px',
					left: '20px',
				},
				margin: {
					top: '10px',
					right: '20px',
					bottom: '10px',
					left: '20px',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
		});

		//
		// Test 2: Unlock then set value and lock again (top or left value)
		//

		// this command unlocks and then sets value
		setBoxSpacingSide('margin-top', '50');
		setBoxSpacingSide('padding-top', '50');

		//
		// Check store
		//
		assertBlockData((data) => {
			expect({
				padding: {
					top: '50px',
					right: '20px',
					bottom: '10px',
					left: '20px',
				},
				margin: {
					top: '50px',
					right: '20px',
					bottom: '10px',
					left: '20px',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
		});

		//
		// Lock again, (top value should be used again for top and bottom)
		//
		cy.get(
			`.blockera-field-box-spacing-padding button[data-test="padding-lock"]`
		).click();

		cy.get(
			`.blockera-field-box-spacing-margin button[data-test="margin-lock"]`
		).click();

		//
		// Check store
		//
		assertBlockData((data) => {
			expect({
				padding: {
					top: '50px',
					right: '20px',
					bottom: '50px',
					left: '20px',
				},
				margin: {
					top: '50px',
					right: '20px',
					bottom: '50px',
					left: '20px',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
		});

		//
		// Test 3: Unlock then set value and lock again (bottom or right value)
		//

		// clear all edges first
		clearBoxSpacingSide('margin-top');
		clearBoxSpacingSide('margin-right');
		clearBoxSpacingSide('margin-bottom');
		clearBoxSpacingSide('margin-left');
		clearBoxSpacingSide('padding-top');
		clearBoxSpacingSide('padding-right');
		clearBoxSpacingSide('padding-bottom');
		clearBoxSpacingSide('padding-left');

		// Set value to second edge
		setBoxSpacingSide('margin-bottom', '50');
		setBoxSpacingSide('margin-right', '60');
		setBoxSpacingSide('padding-bottom', '50');
		setBoxSpacingSide('padding-right', '60');

		//
		// Check store
		//
		assertBlockData((data) => {
			expect({
				margin: {
					right: '60px',
					bottom: '50px',
				},
				padding: {
					right: '60px',
					bottom: '50px',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
		});

		//
		// Lock again, (top value should be used again for top and bottom)
		//
		cy.get(
			`.blockera-field-box-spacing-padding button[data-test="padding-lock"]`
		).click();

		cy.get(
			`.blockera-field-box-spacing-margin button[data-test="margin-lock"]`
		).click();

		//
		// Check store
		//
		assertBlockData((data) => {
			expect({
				padding: {
					top: '50px',
					right: '60px',
					bottom: '50px',
					left: '60px',
				},
				margin: {
					top: '50px',
					right: '60px',
					bottom: '50px',
					left: '60px',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
		});
	});

	it('Clear value button', () => {
		//
		// Test 1: Reset Padding
		//
		setBoxSpacingSide('margin-top', 10);
		setBoxSpacingSide('margin-right', 20);
		setBoxSpacingSide('margin-bottom', 10);
		setBoxSpacingSide('margin-left', 30);

		setBoxSpacingSide('padding-top', 40);
		setBoxSpacingSide('padding-right', 50);
		setBoxSpacingSide('padding-bottom', 60);
		setBoxSpacingSide('padding-left', 70);

		//Check store
		assertBlockData((data) => {
			expect({
				margin: {
					top: '10px',
					right: '20px',
					bottom: '10px',
					left: '30px',
				},
				padding: {
					top: '40px',
					right: '50px',
					bottom: '60px',
					left: '70px',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
		});

		cy.resetBlockeraAttribute('Layout', 'Padding', 'reset');

		//Check store
		assertBlockData((data) => {
			expect({
				margin: {
					top: '10px',
					right: '20px',
					bottom: '10px',
					left: '30px',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
		});

		//
		// Test 2: Reset Margin
		//
		setBoxSpacingSide('padding-top', 40);
		setBoxSpacingSide('padding-right', 50);
		setBoxSpacingSide('padding-bottom', 60);
		setBoxSpacingSide('padding-left', 70);

		//Check store
		assertBlockData((data) => {
			expect({
				margin: {
					top: '10px',
					right: '20px',
					bottom: '10px',
					left: '30px',
				},
				padding: {
					top: '40px',
					right: '50px',
					bottom: '60px',
					left: '70px',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
		});

		cy.resetBlockeraAttribute('Layout', 'Margin', 'reset');

		//Check store
		assertBlockData((data) => {
			expect({
				padding: {
					top: '40px',
					right: '50px',
					bottom: '60px',
					left: '70px',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
		});

		//
		// Test 3: Reset Margin & Padding
		//
		setBoxSpacingSide('margin-top', 10);
		setBoxSpacingSide('margin-right', 20);
		setBoxSpacingSide('margin-bottom', 10);
		setBoxSpacingSide('margin-left', 30);

		cy.resetBlockeraAttribute('Layout', 'Padding', 'reset');
		cy.resetBlockeraAttribute('Layout', 'Margin', 'reset');

		//Check store
		assertBlockData((data) => {
			expect({
				margin: {
					top: '',
					right: '',
					bottom: '',
					left: '',
				},
				padding: {
					top: '',
					right: '',
					bottom: '',
					left: '',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'blockeraSpacing'));
		});
	});
});
