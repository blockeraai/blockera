import {
	openSiteEditor,
	getWPDataObject,
	closeWelcomeGuide,
} from '@blockera/dev-cypress/js/helpers';

describe('Block Type Empowered Blocker Global Styles', () => {
	beforeEach(() => {
		openSiteEditor();

		cy.openGlobalStylesPanel();

		closeWelcomeGuide();
	});

	it('should show the block type empowered icon global styles', () => {
		cy.getByDataTest('block-style-variations').eq(1).click();

		getWPDataObject().then((data) => {
			data.select('core/blocks')
				.getBlockTypes()
				.forEach((block) => {
					if (!block.attributes?.blockeraPropsId) {
						return;
					}

					if ('core/social-link' === block.name) {
						block.name += 's';
					}

					const selector = `button[id="/blocks/${block.name.replace(
						'/',
						'%2F'
					)}"]`;

					if (!Cypress.$(selector).length) {
						return;
					}

					cy.get(selector).within(() => {
						cy.get(
							'.blockera-block-icon-wrapper svg:last-child'
						).should('be.exist');
					});
				});
		});
	});

	it('should show the block type empowered icon global styles on searching results', () => {
		cy.getByDataTest('block-style-variations').eq(1).click();

		cy.get('input[type="search"]').type('heading');

		getWPDataObject().then((data) => {
			data.select('core/blocks')
				.getBlockTypes()
				.forEach((block) => {
					if (!block.attributes?.blockeraPropsId) {
						return;
					}

					if ('core/social-link' === block.name) {
						block.name += 's';
					}

					const selector = `button[id="/blocks/${block.name.replace(
						'/',
						'%2F'
					)}"]`;

					if (
						!block.attributes?.blockeraPropsId ||
						!Cypress.$(selector)?.length
					) {
						return;
					}

					if (!Cypress.$(selector).length) {
						return;
					}

					cy.get(selector).within(() => {
						cy.get(
							'.blockera-block-icon-wrapper svg:last-child'
						).should('be.exist');
					});
				});
		});

		cy.get('input[type="search"]').type('text for no results');
		cy.get('input[type="search"]').clear();

		getWPDataObject().then((data) => {
			data.select('core/blocks')
				.getBlockTypes()
				.forEach((block) => {
					if (!block.attributes?.blockeraPropsId) {
						return;
					}

					if ('core/social-link' === block.name) {
						block.name += 's';
					}

					const selector = `button[id="/blocks/${block.name.replace(
						'/',
						'%2F'
					)}"]`;

					if (!Cypress.$(selector).length) {
						return;
					}

					cy.get(selector).within(() => {
						cy.get(
							'.blockera-block-icon-wrapper svg:last-child'
						).should('be.exist');
					});
				});
		});
	});
});
