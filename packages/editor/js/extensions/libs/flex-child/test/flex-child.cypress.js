import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	appendBlocks,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Flex Child', () => {
	beforeEach(() => {
		createPost();
	});

	describe('', () => {
		beforeEach(() => {
			const code = `<!-- wp:paragraph {"blockeraPropsId":"1025142054679"} -->
<p>This is a test text.</p>
<!-- /wp:paragraph -->`;

			appendBlocks(code);

			cy.getBlock('core/paragraph').click();
			cy.getByDataTest('style-tab').click();
		});

		it('should not have flex-child extension, if parents display is not flex', () => {
			cy.contains('Flex Child').should('not.exist');
		});
	});

	describe('Self Size', () => {
		beforeEach(() => {
			const code = `<!-- wp:group {"className":"blockera-group","layout":{"type":"constrained"},"blockeraDisplay":"flex","blockeraPropsId":"1025111558103"} -->
<div class="wp-block-group blockera-group"><!-- wp:paragraph {"className":"blockera-paragraph","blockeraAttributes":[],"blockeraPropsId":"102511163356"} -->
<p class="blockera-paragraph">This is a test text.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`;
			appendBlocks(code);

			cy.getBlock('core/paragraph').click();
			cy.getByDataTest('style-tab').click();
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('Sizing Buttons (Shrink & Grow)', () => {
				//
				// Shrink
				//
				cy.getParentContainer('Self Size', 'base-control').within(
					() => {
						cy.getByAriaLabel('Shrink').click();
					}
				);

				//Check block
				cy.getBlock('core/paragraph').should(
					'have.css',
					'flex',
					'0 1 auto'
				);

				//Check store
				getWPDataObject().then((data) => {
					expect('shrink').to.be.equal(
						getSelectedBlock(data, 'blockeraFlexChildSizing')
					);
				});

				//
				// Grow
				//
				cy.getParentContainer('Self Size', 'base-control').within(
					() => {
						cy.getByAriaLabel('Grow').click();
					}
				);

				//Check block
				cy.getBlock('core/paragraph').should(
					'have.css',
					'flex',
					'1 1 0%'
				);

				//Check store
				getWPDataObject().then((data) => {
					expect('grow').to.be.equal(
						getSelectedBlock(data, 'blockeraFlexChildSizing')
					);
				});

				//
				// No Grow or Shrink
				//
				cy.getParentContainer('Self Size', 'base-control').within(
					() => {
						cy.getByAriaLabel('No Grow or Shrink').click();
					}
				);

				//Check block
				cy.getBlock('core/paragraph').should(
					'have.css',
					'flex',
					'0 0 auto'
				);

				//Check store
				getWPDataObject().then((data) => {
					expect('no').to.be.equal(
						getSelectedBlock(data, 'blockeraFlexChildSizing')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.blockera-paragraph').should(
					'have.css',
					'flex',
					'0 0 auto'
				);
			});

			it('should update correctly, when adding custom data', () => {
				cy.getParentContainer('Self Size', 'base-control').within(
					() => {
						cy.getByAriaLabel('Custom').click();
						cy.getByAriaLabel('Custom Grow').type(1, {
							force: true,
						});
						cy.getByAriaLabel('Custom Shrink').type(2, {
							force: true,
						});
						cy.getByAriaLabel('Select Unit').last().select('%');
						cy.getByAriaLabel('Custom Basis').type(10, {
							force: true,
						});
					}
				);

				//Check block
				cy.getBlock('core/paragraph').should(
					'have.css',
					'flex',
					'1 2 10%'
				);

				//Check store
				getWPDataObject().then((data) => {
					expect('custom').to.be.equal(
						getSelectedBlock(data, 'blockeraFlexChildSizing')
					);
					expect('1').to.be.equal(
						getSelectedBlock(data, 'blockeraFlexChildGrow')
					);
					expect('2').to.be.equal(
						getSelectedBlock(data, 'blockeraFlexChildShrink')
					);
					expect('10%').to.be.equal(
						getSelectedBlock(data, 'blockeraFlexChildBasis')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.blockera-paragraph').should(
					'have.css',
					'flex',
					'1 2 10%'
				);
			});
		});
	});

	describe('Align', () => {
		// beforeEach(() => {
		//
		// });

		//describe('WordPress Compatibility', () => {...});

		it('Functionality', () => {
			const code = `<!-- wp:group {"className":"blockera-group","layout":{"type":"constrained"},"blockeraDisplay":"flex","blockeraPropsId":"1025111558103"} -->
<div class="wp-block-group blockera-group"><!-- wp:paragraph {"className":"blockera-paragraph","blockeraAttributes":[],"blockeraPropsId":"102511163356"} -->
<p class="blockera-paragraph">This is a test text.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`;
			appendBlocks(code);

			cy.getBlock('core/paragraph').click();
			cy.getByDataTest('style-tab').click();

			//
			// Flex Start
			//
			cy.getParentContainer('Self Align', 'base-control').within(() => {
				cy.getByAriaLabel('Flex Start').click();
			});

			//Check block
			cy.getBlock('core/paragraph').should(
				'have.css',
				'align-self',
				'flex-start'
			);

			//Check store
			getWPDataObject().then((data) => {
				expect('flex-start').to.be.equal(
					getSelectedBlock(data, 'blockeraFlexChildAlign')
				);
			});

			//
			// Center
			//
			cy.getParentContainer('Self Align', 'base-control').within(() => {
				cy.getByAriaLabel('Center').click();
			});

			//Check block
			cy.getBlock('core/paragraph').should(
				'have.css',
				'align-self',
				'center'
			);

			//Check store
			getWPDataObject().then((data) => {
				expect('center').to.be.equal(
					getSelectedBlock(data, 'blockeraFlexChildAlign')
				);
			});

			//
			// Flex End
			//
			cy.getParentContainer('Self Align', 'base-control').within(() => {
				cy.getByAriaLabel('Flex End').click();
			});

			//Check block
			cy.getBlock('core/paragraph').should(
				'have.css',
				'align-self',
				'flex-end'
			);

			//Check store
			getWPDataObject().then((data) => {
				expect('flex-end').to.be.equal(
					getSelectedBlock(data, 'blockeraFlexChildAlign')
				);
			});

			//
			// Stretch
			//
			cy.getParentContainer('Self Align', 'base-control').within(() => {
				cy.getByAriaLabel('Stretch').click();
			});

			//Check block
			cy.getBlock('core/paragraph').should(
				'have.css',
				'align-self',
				'stretch'
			);

			//Check store
			getWPDataObject().then((data) => {
				expect('stretch').to.be.equal(
					getSelectedBlock(data, 'blockeraFlexChildAlign')
				);
			});

			//
			// Baseline
			//
			cy.getParentContainer('Self Align', 'base-control').within(() => {
				cy.getByAriaLabel('Baseline').click();
			});

			//Check block
			cy.getBlock('core/paragraph').should(
				'have.css',
				'align-self',
				'baseline'
			);

			//Check store
			getWPDataObject().then((data) => {
				expect('baseline').to.be.equal(
					getSelectedBlock(data, 'blockeraFlexChildAlign')
				);
			});

			//Check frontend
			savePage();

			redirectToFrontPage();

			cy.get('.blockera-paragraph').should(
				'have.css',
				'align-self',
				'baseline'
			);
		});
	});

	describe('Order', () => {
		describe('Functionality', () => {
			beforeEach(() => {
				const code = `<!-- wp:group {"className":"blockera-group","layout":{"type":"constrained"},"blockeraDisplay":"flex","blockeraPropsId":"1025111558103"} -->
<div class="wp-block-group blockera-group"><!-- wp:paragraph {"className":"blockera-paragraph","blockeraAttributes":[],"blockeraPropsId":"102511163356"} -->
<p class="blockera-paragraph">This is a test text.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`;
				appendBlocks(code);

				cy.getBlock('core/paragraph').click();
				cy.getByDataTest('style-tab').click();
			});

			it('first and last options', () => {
				//
				// First
				//
				cy.getParentContainer('Self Order', 'base-control').within(
					() => {
						cy.getByAriaLabel('First').click();
					}
				);

				//Check block
				cy.getBlock('core/paragraph').should('have.css', 'order', '-1');

				//Check store
				getWPDataObject().then((data) => {
					expect('first').to.be.equal(
						getSelectedBlock(data, 'blockeraFlexChildOrder')
					);
				});

				//
				// Last
				//
				cy.getParentContainer('Self Order', 'base-control').within(
					() => {
						cy.getByAriaLabel('Last').click();
					}
				);

				//Check block
				cy.getBlock('core/paragraph').should(
					'have.css',
					'order',
					'100'
				);

				//Check store
				getWPDataObject().then((data) => {
					expect('last').to.be.equal(
						getSelectedBlock(data, 'blockeraFlexChildOrder')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.blockera-paragraph').should(
					'have.css',
					'order',
					'100'
				);
			});

			it('should update correctly, when adding custom order', () => {
				cy.getParentContainer('Self Order', 'base-control').within(
					() => {
						cy.getByAriaLabel('Custom Order').click();
						cy.get('input').type(10, { force: true });
					}
				);

				//Check block
				cy.getBlock('core/paragraph').should('have.css', 'order', '10');

				//Check store
				getWPDataObject().then((data) => {
					expect('10').to.be.equal(
						getSelectedBlock(data, 'blockeraFlexChildOrderCustom')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.blockera-paragraph').should('have.css', 'order', '10');
			});
		});
	});
});
