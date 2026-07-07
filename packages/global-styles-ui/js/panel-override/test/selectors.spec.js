import { getGlobalStylesPanelTargets } from '../selectors';
import { isWordPress70OrHigher, normalizeWordPressVersion } from '../version';

describe('panel-override selectors', () => {
	it('returns legacy edit-site selectors before WordPress 7.0', () => {
		const selectors = getGlobalStylesPanelTargets('6.7.3-beta-12345');

		expect(selectors.navigatorScreen).toBe(
			'.edit-site-global-styles-sidebar__navigator-screen'
		);
		expect(selectors.screenRoot).toBe(
			'.edit-site-global-styles-screen-root'
		);
		expect(selectors.activeStyleTile).toBe(
			'.edit-site-global-styles-screen-root__active-style-tile'
		);
		expect(selectors.screen).toBe(selectors.navigatorScreen);
	});

	it('returns global-styles-ui selectors for WordPress 7.0+', () => {
		const selectors = getGlobalStylesPanelTargets('7.0');

		expect(selectors.navigatorScreen).toBe(
			'.global-styles-ui-sidebar__navigator-screen'
		);
		expect(selectors.screenRoot).toBe('.global-styles-ui-screen-root');
		expect(selectors.activeStyleTile).toBe(
			'.global-styles-ui-screen-root__active-style-tile'
		);
		expect(selectors.presetPanelMount).toContain(
			'.global-styles-ui-screen-body'
		);
		expect(selectors.globalStylesScreen).toBe(
			'.global-styles-ui-block-types-search'
		);
		expect(selectors.sidebarHeaderTitle).toBe(
			'.editor-global-styles-sidebar__header-title'
		);
	});

	it('normalizes alpha and beta version strings', () => {
		expect(normalizeWordPressVersion('6.6.3-alpha-59007')).toBe('6.6.3');
		expect(isWordPress70OrHigher('6.9.9')).toBe(false);
		expect(isWordPress70OrHigher('7.0-beta1')).toBe(true);
	});
});
