import {
	createPost,
	openSettingsPanel,
} from '@blockera/dev-cypress/js/helpers';

describe('Custom CSS', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	it('should disable custom CSS code editor when block editing in free plugin', () => {
		openSettingsPanel('Custom CSS');

		cy.getParentContainer('Custom CSS Code').within(() => {
			cy.get('.monaco-editor').should('have.css', 'user-select', 'none');
		});
	});
});
