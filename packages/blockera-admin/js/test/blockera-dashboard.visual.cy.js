import { goTo } from '@blockera/dev-cypress/js/helpers';

describe('Visual Regression Test', () => {
	it('screenshot dashboard', () => {
		goTo('/wp-admin/admin.php?page=blockera-settings-dashboard');

		// disable wp footer to avoid screenshot issue
		cy.get('#wpfooter').invoke('css', 'display', 'none');

		// disable sticky menu to avoid screenshot issue
		cy.get('#adminmenuwrap').invoke('css', 'position', 'relative');

		cy.compareSnapshot({
			name: 'dashboard',
			testThreshold: 0.02,
		});
	});
});
