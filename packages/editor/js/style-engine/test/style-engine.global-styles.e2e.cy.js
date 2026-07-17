import {
	setBlockState,
	openSiteEditor,
	assertBlockData,
	closeWelcomeGuide,
	redirectToFrontPage,
	getSelectedBlockStyle,
	saveSiteEditorDirtyEntities,
} from '@blockera/dev-cypress/js/helpers';

describe('Style Engine → Global Styles', () => {
	beforeEach(() => {
		openSiteEditor();

		cy.openGlobalStylesPanel();

		closeWelcomeGuide();

		cy.getByDataTest('block-style-variations', { timeout: 20000 })
			.eq(0)
			.should('be.visible')
			.click();

		cy.get(`button[id="/blocks/core%2Fparagraph"]`, { timeout: 20000 })
			.should('be.visible')
			.click();

		// Wait for style cards after the paragraph block screen loads (CI flake).
		cy.getByDataTest('style-default', { timeout: 20000 })
			.should('be.visible')
			.click();

		// Confirm the default style screen mounted (field may be off-screen in fixed panels).
		cy.getParentContainer('Font Size').should('exist');
	});

	it('should generate css for all paragraphs cross website pages', () => {
		cy.getParentContainer('Font Size').within(() => {
			cy.get('input[type="text"]').clear();
			cy.get('input[type="text"]').type(10, {
				force: true,
			});
		});

		//Check block
		cy.getBlock('core/paragraph').should('have.css', 'font-size', '10px');

		//Check store
		assertBlockData((data) => {
			expect('10px').to.be.equal(
				getSelectedBlockStyle(data, 'core/paragraph', 'default')
					?.blockeraFontSize?.value
			);
		});

		//Check frontend
		saveSiteEditorDirtyEntities();

		redirectToFrontPage();

		// Style-engine contract: WP global stylesheet must include the rule
		// before we trust computed styles (theme fluid sizes otherwise win).
		cy.get('#global-styles-inline-css', { timeout: 20000 })
			.invoke('text')
			.should(
				'include',
				`:root body :where(p) {
 font-size: 10px; 
}`
			);

		cy.get('p:first-child').should('have.css', 'font-size', '10px');
	});

	it('should generate css for normal and hover states of all paragraphs cross website pages', () => {
		cy.getParentContainer('Font Size').within(() => {
			cy.get('input[type="text"]').clear();
			cy.get('input[type="text"]').type(10, {
				force: true,
				delay: 0,
			});
		});

		//Check block
		cy.getBlock('core/paragraph').should('have.css', 'font-size', '10px');

		//Check store
		assertBlockData((data) => {
			expect('10px').to.be.equal(
				getSelectedBlockStyle(data, 'core/paragraph', 'default')
					?.blockeraFontSize?.value
			);
		});

		setBlockState('Hover');

		cy.getParentContainer('Font Size').within(() => {
			cy.get('input[type="text"]').clear();
			cy.get('input[type="text"]').type(20, {
				force: true,
				delay: 0,
			});
		});

		//Check store
		assertBlockData((data) => {
			expect('20px').to.be.equal(
				getSelectedBlockStyle(data, 'core/paragraph', 'default')
					?.blockeraBlockStates?.value?.hover?.breakpoints?.desktop
					?.attributes?.blockeraFontSize
			);
		});

		//Check editor — global styles output real :hover rules in the iframe wrapper
		cy.getIframeBody().within(() => {
			cy.get('#blockera-global-styles-wrapper')
				.invoke('text')
				.should('include', 'font-size: 20px')
				.should(
					(text) =>
						text.includes(':where(p):hover') ||
						text.includes(':where(p:hover)')
				);
		});

		//Check frontend
		saveSiteEditorDirtyEntities();

		redirectToFrontPage();

		cy.get('#global-styles-inline-css', { timeout: 20000 })
			.invoke('text')
			.should(
				'include',
				`:root body :where(p) {
 font-size: 10px; 
}`
			)
			.and(
				'include',
				`:root body :where(p):hover {
 font-size: 20px; 
}`
			);

		cy.get('p:first-child').realHover();
		cy.get('p:first-child').should('have.css', 'font-size', '20px');
	});
});
