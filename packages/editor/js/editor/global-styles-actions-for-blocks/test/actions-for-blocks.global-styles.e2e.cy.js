/**
 * Global Styles Actions For Blocks Plugin → Functionality
 */
import {
	openSiteEditor,
	closeWelcomeGuide,
	getWPDataObject,
} from '@blockera/dev-cypress/js/helpers';

const openBlockStyleVariationsTab = () => {
	cy.openGlobalStylesPanel();
	closeWelcomeGuide();
	cy.getByDataTest('block-style-variations').eq(0).click();
};

describe('Global Styles Actions For Blocks Plugin → Functionality (Global Styles)', () => {
	beforeEach(() => {
		openSiteEditor();
		openBlockStyleVariationsTab();
	});

	it('should activate panel when global styles screen is visible', () => {
		cy.get('body').then(($body) => {
			if ($body.find('button[id="/blocks/core%2Fgroup"]').length) {
				cy.get('button[id="/blocks/core%2Fgroup"]').click();
				cy.getByDataTest('blockera-block-card').should('be.visible');
			}
		});
	});

	it('should set selected block style when global styles button is clicked', () => {
		cy.get('body').then(($body) => {
			if ($body.find('button[id="/blocks/core%2Fgroup"]').length) {
				cy.get('button[id="/blocks/core%2Fgroup"]').click();
				cy.getByDataTest('blockera-block-card').should('be.visible');
			}
		});

		cy.get('body').then(($body) => {
			const globalStylesButton = $body.find(
				'button[aria-controls="edit-site:global-styles"]'
			);

			if (globalStylesButton.length) {
				cy.get('button[aria-controls="edit-site:global-styles"]')
					.first()
					.click();

				getWPDataObject().then((data) => {
					expect(
						data.select('blockera/editor').getSelectedBlockStyle()
					).to.equal('');
				});
			}
		});
	});

	it('should handle block type click events', () => {
		cy.get('body').then(($body) => {
			if ($body.find('button[id="/blocks/core%2Fgroup"]').length) {
				cy.get('button[id="/blocks/core%2Fgroup"]').click();

				cy.get(
					'body[data-test="has-blockera-global-styles-ui"]'
				).should('be.visible');

				getWPDataObject().then((data) => {
					expect(
						data.select('blockera/editor').getSelectedBlockRef()
					).to.not.equal(undefined);
				});
			}
		});
	});
});
