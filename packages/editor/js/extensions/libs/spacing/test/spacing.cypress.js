import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Spacing Extension', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Margin', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'blockera-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('This is test text.');

			cy.getByDataTest('style-tab').click();
		});

		//describe('WordPress Compatibility', () => {...});
		describe('Functionality', () => {
			it('should update margin, when add data', () => {
				/* Top */
				cy.get('[aria-label="Top Margin"]').click();
				cy.getByDataTest('popover-body').within(() => {
					cy.get('input[type="number"]').type(10);
				});

				/* Right */
				cy.get('[aria-label="Right Margin"]').click();
				cy.getByDataTest('popover-body').within(() => {
					cy.get('input[type="number"]').type(20);
				});

				/* Bottom */
				cy.get('[aria-label="Bottom Margin"]').click();
				cy.getByDataTest('popover-body').within(() => {
					cy.get('[aria-label="Set 10px"]').click();
				});

				/* Left */
				cy.get('[aria-label="Left Margin"]').click();
				cy.getByDataTest('popover-body').within(() => {
					cy.get('input[type="number"]').type(30);
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'margin-top', '10px')
					.and('have.css', 'margin-right', '20px')
					.and('have.css', 'margin-bottom', '10px')
					.and('have.css', 'margin-left', '30px');

				//Check store
				getWPDataObject().then((data) => {
					expect({
						padding: { top: '', right: '', bottom: '', left: '' },
						margin: {
							top: '10px',
							right: '20px',
							bottom: '10px',
							left: '30px',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraSpacing')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.blockera-paragraph')
					.should('have.css', 'margin-top', '10px')
					.and('have.css', 'margin-right', '20px')
					.and('have.css', 'margin-bottom', '10px')
					.and('have.css', 'margin-left', '30px');
			});
		});
	});

	describe('Padding', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'blockera-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('This is test text.');

			cy.getByDataTest('style-tab').click();
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should update padding, when add data', () => {
				/* Top */
				cy.get('[aria-label="Top Padding"]').click();
				cy.getByDataTest('popover-body').within(() => {
					cy.get('input[type="number"]').type(10);
				});

				/* Right */
				cy.get('[aria-label="Right Padding"]').click();
				cy.getByDataTest('popover-body').within(() => {
					cy.get('input[type="number"]').type(20);
				});

				/* Bottom */
				cy.get('[aria-label="Bottom Padding"]').click();
				cy.getByDataTest('popover-body').within(() => {
					cy.get('[aria-label="Set 10px"]').click();
				});

				/* Left */
				cy.get('[aria-label="Left Padding"]').click();
				cy.getByDataTest('popover-body').within(() => {
					cy.get('input[type="number"]').type(30);
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'padding-top', '10px')
					.and('have.css', 'padding-right', '20px')
					.and('have.css', 'padding-bottom', '10px')
					.and('have.css', 'padding-left', '30px');
				//Check store
				getWPDataObject().then((data) => {
					expect({
						padding: {
							top: '10px',
							right: '20px',
							bottom: '10px',
							left: '30px',
						},
						margin: {
							top: '',
							right: '',
							bottom: '',
							left: '',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraSpacing')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.blockera-paragraph')
					.should('have.css', 'padding-top', '10px')
					.and('have.css', 'padding-right', '20px')
					.and('have.css', 'padding-bottom', '10px')
					.and('have.css', 'padding-left', '30px');
			});
		});
	});
});
