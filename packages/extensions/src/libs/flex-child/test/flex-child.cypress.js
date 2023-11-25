import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	appendBlocks,
} from '../../../../../../cypress/helpers';

describe('Flex Child', () => {
	//describe('Extension Initializing', () => {...});
	describe('', () => {
		beforeEach(() => {
			const code = `<!-- wp:paragraph {"publisherPropsId":"1025142054679"} -->
<p>This is a test text.</p>
<!-- /wp:paragraph -->`;

			appendBlocks(code);

			cy.getIframeBody().find(`[data-type="core/paragraph"]`).click();
			cy.getByDataTest('style-tab').click();
		});

		it('should not have flex-child extension, if parents display is not flex', () => {
			cy.contains('Flex Child').should('not.exist');
		});
	});

	describe('Sizing', () => {
		beforeEach(() => {
			const code = `<!-- wp:group {"className":"publisher-group","layout":{"type":"constrained"},"publisherDisplay":"flex","publisherPropsId":"1025111558103"} -->
<div class="wp-block-group publisher-group"><!-- wp:paragraph {"className":"publisher-paragraph","publisherAttributes":[],"publisherPropsId":"102511163356"} -->
<p class="publisher-paragraph">This is a test text.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`;
			appendBlocks(code);

			cy.getIframeBody().find(`[data-type="core/paragraph"]`).click();
			cy.getByDataTest('style-tab').click();
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should add flex, when click on shrink shortcut', () => {
				cy.getParentContainer('Sizing', 'base-control').within(() => {
					cy.getByAriaLabel('Shrink').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'flex', '0 1 auto');

				//Check store
				getWPDataObject().then((data) => {
					expect('shrink').to.be.equal(
						getSelectedBlock(data, 'publisherFlexChildSizing')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'flex',
					'0 1 auto'
				);
			});

			it('should add flex, when click on grow shortcut', () => {
				cy.getParentContainer('Sizing', 'base-control').within(() => {
					cy.getByAriaLabel('Grow').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'flex', '1 1 0%');

				//Check store
				getWPDataObject().then((data) => {
					expect('grow').to.be.equal(
						getSelectedBlock(data, 'publisherFlexChildSizing')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'flex',
					'1 1 0%'
				);
			});

			it('should add flex, when click on no grow or shrink shortcut', () => {
				cy.getParentContainer('Sizing', 'base-control').within(() => {
					cy.getByAriaLabel('No Grow or Shrink').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'flex', '0 0 auto');

				//Check store
				getWPDataObject().then((data) => {
					expect('no').to.be.equal(
						getSelectedBlock(data, 'publisherFlexChildSizing')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'flex',
					'0 0 auto'
				);
			});

			it('should update correctly, when adding custom data', () => {
				cy.getParentContainer('Sizing', 'base-control').within(() => {
					cy.getByAriaLabel('Custom').click();
					cy.getByAriaLabel('Custom Grow').type(1);
					cy.getByAriaLabel('Custom Shrink').type(2);
					cy.get('select').select('%');
					cy.getByAriaLabel('Custom Basis').type(10);
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'flex', '1 2 10%');

				//Check store
				getWPDataObject().then((data) => {
					expect('custom').to.be.equal(
						getSelectedBlock(data, 'publisherFlexChildSizing')
					);
					expect('1').to.be.equal(
						getSelectedBlock(data, 'publisherFlexChildGrow')
					);
					expect('2').to.be.equal(
						getSelectedBlock(data, 'publisherFlexChildShrink')
					);
					expect('10%').to.be.equal(
						getSelectedBlock(data, 'publisherFlexChildBasis')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'flex',
					'1 2 10%'
				);
			});
		});
	});

	describe('Align', () => {
		beforeEach(() => {
			const code = `<!-- wp:group {"className":"publisher-group","layout":{"type":"constrained"},"publisherDisplay":"flex","publisherPropsId":"1025111558103"} -->
<div class="wp-block-group publisher-group"><!-- wp:paragraph {"className":"publisher-paragraph","publisherAttributes":[],"publisherPropsId":"102511163356"} -->
<p class="publisher-paragraph">This is a test text.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`;
			appendBlocks(code);

			cy.getIframeBody().find(`[data-type="core/paragraph"]`).click();
			cy.getByDataTest('style-tab').click();
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should add align-self, when click on flex-start shortcut', () => {
				cy.getParentContainer('Align', 'base-control').within(() => {
					cy.getByAriaLabel('Flex Start').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'align-self', 'flex-start');

				//Check store
				getWPDataObject().then((data) => {
					expect('flex-start').to.be.equal(
						getSelectedBlock(data, 'publisherFlexChildAlign')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'align-self',
					'flex-start'
				);
			});

			it('should add align-self, when click on center shortcut', () => {
				cy.getParentContainer('Align', 'base-control').within(() => {
					cy.getByAriaLabel('Center').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'align-self', 'center');

				//Check store
				getWPDataObject().then((data) => {
					expect('center').to.be.equal(
						getSelectedBlock(data, 'publisherFlexChildAlign')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'align-self',
					'center'
				);
			});

			it('should add align-self, when click on flex-end shortcut', () => {
				cy.getParentContainer('Align', 'base-control').within(() => {
					cy.getByAriaLabel('Flex End').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'align-self', 'flex-end');

				//Check store
				getWPDataObject().then((data) => {
					expect('flex-end').to.be.equal(
						getSelectedBlock(data, 'publisherFlexChildAlign')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'align-self',
					'flex-end'
				);
			});

			it('should add align-self, when click on stretch shortcut', () => {
				cy.getParentContainer('Align', 'base-control').within(() => {
					cy.getByAriaLabel('Stretch').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'align-self', 'stretch');

				//Check store
				getWPDataObject().then((data) => {
					expect('stretch').to.be.equal(
						getSelectedBlock(data, 'publisherFlexChildAlign')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'align-self',
					'stretch'
				);
			});

			it('should add align-self, when click on baseline shortcut', () => {
				cy.getParentContainer('Align', 'base-control').within(() => {
					cy.getByAriaLabel('Baseline').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'align-self', 'baseline');

				//Check store
				getWPDataObject().then((data) => {
					expect('baseline').to.be.equal(
						getSelectedBlock(data, 'publisherFlexChildAlign')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'align-self',
					'baseline'
				);
			});
		});
	});

	describe('Order', () => {
		beforeEach(() => {
			const code = `<!-- wp:group {"className":"publisher-group","layout":{"type":"constrained"},"publisherDisplay":"flex","publisherPropsId":"1025111558103"} -->
<div class="wp-block-group publisher-group"><!-- wp:paragraph {"className":"publisher-paragraph","publisherAttributes":[],"publisherPropsId":"102511163356"} -->
<p class="publisher-paragraph">This is a test text.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`;
			appendBlocks(code);

			cy.getIframeBody().find(`[data-type="core/paragraph"]`).click();
			cy.getByDataTest('style-tab').click();
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should add order, when click on first shortcut', () => {
				cy.getParentContainer('Order', 'base-control').within(() => {
					cy.getByAriaLabel('First').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'order', '-1');

				//Check store
				getWPDataObject().then((data) => {
					expect('first').to.be.equal(
						getSelectedBlock(data, 'publisherFlexChildOrder')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'order',
					'-1'
				);
			});

			it('should add order, when click on last shortcut', () => {
				cy.getParentContainer('Order', 'base-control').within(() => {
					cy.getByAriaLabel('Last').click();
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'order', '100');

				//Check store
				getWPDataObject().then((data) => {
					expect('last').to.be.equal(
						getSelectedBlock(data, 'publisherFlexChildOrder')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'order',
					'100'
				);
			});

			it('should update correctly, when adding custom order', () => {
				cy.getParentContainer('Order', 'base-control').within(() => {
					cy.getByAriaLabel('Custom Order').click();
					cy.get('input').type(10, { force: true });
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'order', '10');

				//Check store
				getWPDataObject().then((data) => {
					expect('10').to.be.equal(
						getSelectedBlock(data, 'publisherFlexChildOrderCustom')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'order',
					'10'
				);
			});
		});
	});
});
