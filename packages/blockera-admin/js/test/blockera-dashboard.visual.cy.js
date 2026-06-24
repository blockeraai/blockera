/**
 * Visual snapshot test for Blockera Dashboard
 */
import { goTo } from '@blockera/dev-cypress/js/helpers';

describe('Blockera Dashboard → Visual Test', () => {
	it('screenshot dashboard', () => {
		goTo('/wp-admin/admin.php?page=blockera-settings-dashboard');

		cy.window().then((win) => {
			const wpfooter = win.document.querySelector('#wpfooter');

			if (wpfooter) {
				wpfooter.style.display = 'none';
			}

			const adminmenuwrap = win.document.querySelector('#adminmenuwrap');

			if (adminmenuwrap) {
				adminmenuwrap.style.position = 'relative';
			}
		});

		cy.get('body').scrollIntoView();
		cy.viewport(1600, 1500);

		cy.compareSnapshot({
			name: 'dashboard',
			testThreshold: 0.02,
		});
	});
});
