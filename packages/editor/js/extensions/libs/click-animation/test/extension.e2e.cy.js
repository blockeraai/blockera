import { createPost } from '@blockera/dev-cypress/js/helpers';

describe('Click Animation', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
	});

	it('should update border when add same data to all side', () => {
		cy.get('.blockera-extension-click-animation a').scrollIntoView();

		cy.get('.blockera-extension-click-animation a')
			.contains('Coming soon…')
			.should('be.visible');
	});
});
