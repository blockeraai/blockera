import {
	savePage,
	openSiteEditor,
	getWPDataObject,
	closeWelcomeGuide,
	redirectToFrontPage,
	getSelectedBlockStyle,
	getEditedGlobalStylesRecord,
} from '@blockera/dev-cypress/js/helpers';

describe('Style Variations Inside Global Styles Panel → Functionality', () => {
	beforeEach(() => {
		openSiteEditor();

		cy.openGlobalStylesPanel();

		closeWelcomeGuide();

		cy.getByDataTest('block-style-variations').eq(1).click();

		cy.get(`button[id="/blocks/core%2Fgroup"]`).click();
	});

	it('should be able to duplicate specific style variation', () => {
		cy.getByDataTest('open-default-contextmenu').click();

		cy.get('.blockera-component-popover-body button')
			.contains('Duplicate')
			.click();

		cy.getByDataTest('style-default-copy').should('be.visible');

		cy.getByDataTest('open-default-copy-contextmenu').click();

		cy.get('.blockera-component-popover-body button')
			.contains('Duplicate')
			.click();

		cy.getByDataTest('style-default-copy-1').should('be.visible');

		cy.getByDataTest('open-style-section-1-contextmenu').click();

		cy.get('.blockera-component-popover-body button')
			.contains('Duplicate')
			.click();

		cy.getByDataTest('style-style-section-1-copy').should('be.visible');
	});

	it('should be able to clear customizations from specific style variation', () => {
		cy.getByDataTest('style-section-1').click();

		// add alias to the feature container
		cy.getParentContainer('BG Color').as('bgColorContainer');

		// act: clicking on color button
		cy.get('@bgColorContainer').within(() => {
			cy.openValueAddon();
		});

		// select variable
		cy.selectValueAddonItem('accent-4');

		cy.waitForAssertValue();

		//assert data
		getWPDataObject().then((data) => {
			expect({
				settings: {
					name: 'Accent 4',
					id: 'accent-4',
					value: '#686868',
					reference: {
						type: 'theme',
						theme: 'Twenty Twenty-Five',
					},
					type: 'color',
					var: '--wp--preset--color--accent-4',
				},
				name: 'Accent 4',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(
				getSelectedBlockStyle(data, 'core/group', 'section-1')
					?.blockeraBackgroundColor?.value
			);
		});

		cy.getByDataTest('open-section-1-contextmenu').eq(1).click();

		cy.get('.blockera-component-popover-body button')
			.contains('Clear all customizations')
			.click();

		cy.waitForAssertValue();

		//assert blockera data
		getWPDataObject().then((data) => {
			expect(undefined).to.be.deep.equal(
				getSelectedBlockStyle(data, 'core/group', 'section-1')
					?.blockeraBackgroundColor?.value
			);
		});

		//assert WordPress data
		getWPDataObject().then((data) => {
			expect({}).to.be.deep.equal(
				getEditedGlobalStylesRecord(data, 'styles')
			);
		});
	});

	it('should be able to rename specific style variation', () => {
		cy.getByDataTest('style-section-1').click();

		cy.getByDataTest('open-section-1-contextmenu').eq(1).click();

		cy.get('.blockera-component-popover-body button')
			.contains('Rename')
			.click();

		cy.get('.components-modal__content').within(() => {
			cy.getParentContainer('Name').within(() => {
				cy.get('input').clear();
				cy.get('input').type('New Name');
			});

			cy.getByDataTest('save-rename-button').click();
		});

		cy.getByDataTest('style-section-1').contains('New Name');
	});

	it('should be able to rename with new ID specific style variation', () => {
		cy.getByDataTest('style-section-1').click();

		cy.getByDataTest('open-section-1-contextmenu').eq(1).click();

		cy.get('.blockera-component-popover-body button')
			.contains('Rename')
			.click();

		cy.get('.components-modal__content').within(() => {
			cy.getParentContainer('Name').within(() => {
				cy.get('input').clear();
				cy.get('input').type('New Name');
			});

			cy.getParentContainer('ID').within(() => {
				cy.get('input').clear();
				cy.get('input').type('new id');
			});

			cy.get('input[type="checkbox"]').check();

			cy.getByDataTest('save-rename-button').click();
		});

		cy.getByDataTest('style-new-id').contains('New Name');
	});
});
