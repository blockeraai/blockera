/**
 * Blockera dependencies
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
	getEditedGlobalStylesSetting,
	openGlobalStylesTransitionsScreen,
	savePage,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles UI → transition presets (theme.json + UI)', () => {
	const MU =
		'packages/global-styles-ui/js/test/fixtures/preset-theme-transition.php';
	const MU_NAME = 'blockera-test-gsui-preset-transition.php';

	beforeEach(() => {
		activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	afterEach(() => {
		deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	it('merges theme transition.presets.theme from theme.json, shows in UI, persists duration edit', () => {
		openGlobalStylesTransitionsScreen();

		cy.get('.blockera-transitions-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Transition'
		);

		cy.contains(
			'.blockera-transitions-presets [data-cy="transition-preset-repeater-item-header"]',
			'E2E Theme Transition'
		).click({ force: true });

		cy.get('.blockera-component-popover').within(() => {
			cy.getByDataCy('group-control-header')
				.find('.blockera-control-repeater-group-header')
				.click({ force: true });

			cy.getByDataTest('transition-input-duration').clear({
				force: true,
			});
			cy.getByDataTest('transition-input-duration').type('450', {
				delay: 0,
				force: true,
			});
		});

		cy.realPress('Escape');

		getEditedGlobalStylesSetting('transition.presets.theme').then(
			(rows) => {
				const row = rows.find((r) => r.slug === 'e-2-e-theme-trans');
				expect(String(row.items[0].duration)).to.match(/450/);
			}
		);

		savePage();

		cy.reload();

		openGlobalStylesTransitionsScreen({ reset: false });

		cy.get('.blockera-transitions-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Transition'
		);

		getEditedGlobalStylesSetting('transition.presets.theme').then(
			(rows) => {
				const row = rows.find((r) => r.slug === 'e-2-e-theme-trans');
				expect(String(row.items[0].duration)).to.match(/450/);
			}
		);

		cy.contains(
			'.blockera-transitions-presets [data-cy="transition-preset-repeater-item-header"]',
			'E2E Theme Transition'
		).click({ force: true });

		cy.get('.blockera-component-popover').within(() => {
			cy.getByDataCy('group-control-header')
				.find('.blockera-control-repeater-group-header')
				.click({ force: true });

			cy.getByDataTest('transition-input-duration').should(($el) => {
				expect(String($el.val())).to.match(/450/);
			});
		});
	});
});
