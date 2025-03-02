import { goTo } from '@blockera/dev-cypress/js/helpers';

describe('Visual Regression Test', () => {
	it('screenshot dashboard', () => {
		goTo('/wp-admin/admin.php?page=blockera-settings-dashboard');

		cy.compareSnapshot({
			name: 'dashboard',
			testThreshold: 0.2,
		});
	});
});
