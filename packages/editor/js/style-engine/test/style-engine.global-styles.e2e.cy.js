import {
	savePage,
	setBlockState,
	openSiteEditor,
	getWPDataObject,
	closeWelcomeGuide,
	redirectToFrontPage,
	getSelectedBlockStyle,
} from '@blockera/dev-cypress/js/helpers';

describe('Style Engine → Global Styles', () => {
	beforeEach(() => {
		openSiteEditor();

		cy.openGlobalStylesPanel();

		closeWelcomeGuide();

		cy.getByDataTest('block-style-variations').eq(1).click();

		cy.get(`button[id="/blocks/core%2Fparagraph"]`).click();
	});

	it('should generate css for all paragraphs cross website pages', () => {
		cy.getByDataTest('style-default').click();

		cy.getParentContainer('Size').within(() => {
			cy.get('input[type="text"]').clear();
			cy.get('input[type="text"]').type(10, {
				force: true,
			});
		});

		//Check block
		cy.getBlock('core/paragraph').should('have.css', 'font-size', '10px');

		//Check store
		getWPDataObject().then((data) => {
			expect('10px').to.be.equal(
				getSelectedBlockStyle(data, 'core/paragraph', 'default')
					?.blockeraFontSize?.value
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should('have.css', 'font-size', '10px');

		cy.get('#global-styles-inline-css')
			.invoke('text')
			.should(
				'include',
				`:root :where(p) {
 font-size: 10px !important; 
}`
			);
	});

	it('should generate css for normal and hover states of all paragraphs cross website pages', () => {
		cy.getByDataTest('style-default').click();

		cy.getParentContainer('Size').within(() => {
			cy.get('input[type="text"]').clear();
			cy.get('input[type="text"]').type(10, {
				force: true,
			});
		});

		//Check block
		cy.getBlock('core/paragraph').should('have.css', 'font-size', '10px');

		//Check store
		getWPDataObject().then((data) => {
			expect('10px').to.be.equal(
				getSelectedBlockStyle(data, 'core/paragraph', 'default')
					?.blockeraFontSize?.value
			);
		});

		setBlockState('Hover');

		cy.getParentContainer('Size').within(() => {
			cy.get('input[type="text"]').clear();
			cy.get('input[type="text"]').type(20, {
				force: true,
			});
		});

		//Check block
		cy.getBlock('core/paragraph').realHover();
		cy.getBlock('core/paragraph').should('have.css', 'font-size', '20px');

		//Check store
		getWPDataObject().then((data) => {
			expect('20px').to.be.equal(
				getSelectedBlockStyle(data, 'core/paragraph', 'default')
					?.blockeraFontSize?.value
			);
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.blockera-block').should('have.css', 'font-size', '10px');
		cy.get('.blockera-block').realHover();
		cy.get('.blockera-block').should('have.css', 'font-size', '20px');

		cy.get('#global-styles-inline-css')
			.invoke('text')
			.should(
				'include',
				`:root :where(p) {
 font-size: 10px !important; 
}`
			);

		cy.get('#global-styles-inline-css')
			.invoke('text')
			.should(
				'include',
				`:root :where(p:hover) {
 font-size: 20px !important; 
}`
			);
	});
});
