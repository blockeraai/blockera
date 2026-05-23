/**
 * Internal dependencies
 */
import { isWordPress70OrHigher, normalizeWordPressVersion } from './version';

/**
 * DOM integration points for overriding the WordPress Global Styles panel.
 *
 * Pre-WP 7.0 classes use the `edit-site-global-styles-*` prefix (edit-site package).
 * WP 7.0+ classes use `global-styles-ui-*` / `editor-global-styles-sidebar*` (editor package).
 */
export type GlobalStylesPanelSelectors = {
	navigatorScreen: string;
	navigatorProvider: string;
	screenRoot: string;
	activeStyleTile: string;
	globalStylesScreen: string;
	screenBody: string;
	screenHeader: string;
	headerDescription: string;
	sidebarHeaderTitle: string;
	blockTypesSearch: string;
	blockTypesItemList: string;
	blockPreviewPanel: string;
	blocksButton: string;
	blockScreenListItem: string;
	blockTypesSearchInput: string;
	styleBookIframe: string;
	presetPanelMount: string;
	navigatorBackButton: string;
	globalStylesSidebarButton: string;
};

const LEGACY_SELECTORS: GlobalStylesPanelSelectors = {
	navigatorScreen: '.edit-site-global-styles-sidebar__navigator-screen',
	navigatorProvider: '.edit-site-global-styles-sidebar__navigator-provider',
	screenRoot: '.edit-site-global-styles-screen-root',
	activeStyleTile: '.edit-site-global-styles-screen-root__active-style-tile',
	globalStylesScreen: '.edit-site-global-styles-screen',
	screenBody: '.edit-site-global-styles-screen > div',
	screenHeader: '.edit-site-global-styles-header',
	headerDescription: '.edit-site-global-styles-header__description',
	sidebarHeaderTitle: '.edit-site-global-styles-sidebar__header-title',
	blockTypesSearch: '.edit-site-block-types-search',
	blockTypesItemList: '.edit-site-block-types-item-list',
	blockPreviewPanel: '.edit-site-global-styles__block-preview-panel',
	blocksButton: 'button[id="/blocks"]',
	blockScreenListItem:
		'button[id^="/blocks/core%2F"]:not([id*="/variations/"])',
	blockTypesSearchInput: '.edit-site-block-types-search input[type="search"]',
	styleBookIframe: 'iframe.edit-site-style-book__iframe',
	presetPanelMount:
		'.edit-site-global-styles-sidebar__navigator-screen .edit-site-global-styles-screen > div[data-wp-component="VStack"]',
	navigatorBackButton: 'button[data-wp-component="Navigator.BackButton"]',
	globalStylesSidebarButton:
		'button[aria-controls="edit-site:global-styles"]',
};

const WP70_SELECTORS: GlobalStylesPanelSelectors = {
	navigatorScreen: '.global-styles-ui-sidebar__navigator-screen',
	navigatorProvider: '.global-styles-ui-sidebar__navigator-provider',
	screenRoot: '.global-styles-ui-screen-root',
	activeStyleTile: '.global-styles-ui-screen-root__active-style-tile',
	// Blocks list screen marker (SearchControl). Not present on per-block style screens.
	globalStylesScreen: '.global-styles-ui-block-types-search',
	screenBody: '.global-styles-ui-screen-body',
	screenHeader: '.global-styles-ui-header',
	headerDescription: '.global-styles-ui-header__description',
	sidebarHeaderTitle: '.editor-global-styles-sidebar__header-title',
	blockTypesSearch: '.global-styles-ui-block-types-search',
	blockTypesItemList: '.global-styles-ui-block-types-item-list',
	blockPreviewPanel: '.global-styles-ui__block-preview-panel',
	blocksButton: 'button[id="/blocks"]',
	blockScreenListItem:
		'button[id^="/blocks/core%2F"]:not([id*="/variations/"])',
	blockTypesSearchInput:
		'.global-styles-ui-block-types-search input[type="search"]',
	styleBookIframe: 'iframe.editor-style-book__iframe',
	presetPanelMount:
		'.global-styles-ui-sidebar__navigator-screen .global-styles-ui-screen-body div[data-wp-component="VStack"]',
	navigatorBackButton: 'button[data-wp-component="Navigator.BackButton"]',
	globalStylesSidebarButton:
		'button[aria-controls="edit-site:global-styles"]',
};

/**
 * Backward-compatible alias used by the editor package `getTargets` API.
 */
export type GlobalStylesPanelTargets = GlobalStylesPanelSelectors & {
	/** @deprecated Use `navigatorScreen`. Kept for legacy editor integrations. */
	screen: string;
};

const toPanelTargets = (
	selectors: GlobalStylesPanelSelectors
): GlobalStylesPanelTargets => ({
	...selectors,
	screen: selectors.navigatorScreen,
});

/**
 * Version-aware selector map for Global Styles panel DOM integration.
 */
export const getGlobalStylesPanelSelectors = (
	version = ''
): GlobalStylesPanelSelectors => {
	const normalizedVersion = normalizeWordPressVersion(version);

	if (isWordPress70OrHigher(normalizedVersion)) {
		return { ...WP70_SELECTORS };
	}

	return { ...LEGACY_SELECTORS };
};

/**
 * Editor-facing selector bundle (extends legacy `getTargets` return shape).
 */
export const getGlobalStylesPanelTargets = (
	version = ''
): GlobalStylesPanelTargets =>
	toPanelTargets(getGlobalStylesPanelSelectors(version));

/**
 * Query the first element matching any known Global Styles root selector.
 * Useful when version metadata is unavailable at call time.
 */
export const queryGlobalStylesPanelElement = <
	K extends keyof GlobalStylesPanelSelectors,
>(
	key: K
): Element | null => {
	const legacy = document.querySelector(LEGACY_SELECTORS[key]);
	if (legacy) {
		return legacy;
	}

	return document.querySelector(WP70_SELECTORS[key]);
};

/**
 * Comma-separated selector list for SCSS `@extend`-less dual targeting in JS.
 */
export const getDualGlobalStylesSelector = (
	key: keyof GlobalStylesPanelSelectors
): string => `${LEGACY_SELECTORS[key]}, ${WP70_SELECTORS[key]}`;

/**
 * Style Book block example id (`example-{blockName}`) — stable across WP versions.
 */
export const getStyleBookBlockExampleSelector = (blockName: string): string =>
	`[id="example-${blockName}"]`;

/**
 * Returns the visible Global Styles navigator screen (WP mounts one per route).
 */
export const queryActiveGlobalStylesNavigatorScreen = (): Element | null => {
	const screens = document.querySelectorAll(
		getDualGlobalStylesSelector('navigatorScreen')
	);

	for (const screen of screens) {
		if (!(screen instanceof HTMLElement)) {
			continue;
		}

		if (screen.hasAttribute('hidden')) {
			continue;
		}

		if (screen.getAttribute('aria-hidden') === 'true') {
			continue;
		}

		const { display, visibility } = getComputedStyle(screen);

		if (display === 'none' || visibility === 'hidden') {
			continue;
		}

		return screen;
	}

	return queryGlobalStylesPanelElement('navigatorScreen');
};

/**
 * Locate the Style Book iframe (legacy edit-site or WP 7 editor package).
 */
export const queryStyleBookIframe = (): HTMLIFrameElement | null => {
	const iframe = document.querySelector(
		getDualGlobalStylesSelector('styleBookIframe')
	);

	return iframe instanceof HTMLIFrameElement ? iframe : null;
};
