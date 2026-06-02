/**
 * Blockera dependencies
 */
import {
	BLOCK_INSPECTOR_SELECTOR,
	isBlockInspectorContainerReady,
} from '../../extensions/components/use-block-inspector-container';

export { BLOCK_INSPECTOR_SELECTOR, isBlockInspectorContainerReady };

/**
 * Normalize legacy Blockera tab ids for settings-outside-tabs visibility only.
 */
export const normalizeBlockeraTab = (tab) => {
	if (!tab) {
		return 'style';
	}

	if ('setting' === tab || 'settings' === tab) {
		return 'settings';
	}

	if ('styles' === tab || 'style' === tab) {
		return 'style';
	}

	if ('interactions' === tab) {
		return 'style';
	}

	return tab;
};

export const isSettingsInspectorTab = (tab) => 'settings' === tab;

export const isStylesInspectorTab = (tab) =>
	'style' === normalizeBlockeraTab(tab);

export const INSPECTOR_TABS_SELECTOR = '.block-editor-block-inspector__tabs';

/** WordPress `InspectorControlsTabs` tab names (see block-editor TAB_* constants). */
export const WORDPRESS_INSPECTOR_TAB_NAMES = [
	'settings',
	'styles',
	'effects',
	'content',
	'list',
];

export const isInspectorTabChrome = (element) =>
	Boolean(element?.closest('[role="tablist"]'));

/** Maps Blockera tab names to WordPress InspectorControls group ids. */
export const getBlockInspectorGroup = (tabName) => {
	switch (normalizeBlockeraTab(tabName)) {
		case 'settings':
			return 'settings';
		case 'style':
			return 'styles';
		default:
			return tabName;
	}
};

export const getSettingsTabPanel = (inspector) => {
	const tabsRoot = inspector?.querySelector(INSPECTOR_TABS_SELECTOR);

	if (!tabsRoot) {
		return null;
	}

	const selectedTab = tabsRoot.querySelector(
		'[role="tab"][aria-selected="true"]'
	);
	const tabId =
		selectedTab?.getAttribute('data-tab-id') ||
		selectedTab?.getAttribute('id') ||
		'';

	if (tabId && !tabId.includes('settings')) {
		return null;
	}

	const panels = tabsRoot.querySelectorAll('[role="tabpanel"]');

	for (const panel of panels) {
		if (panel.hidden) {
			continue;
		}

		if (tabId.includes('settings')) {
			return panel;
		}
	}

	return null;
};

/**
 * Parses a WordPress inspector tab name from an instanced tab id or related attribute.
 *
 * @param {string} value Tab `id`, `data-tab-id`, or `aria-controls` value.
 * @return {string|null} Core tab name (`settings`, `styles`, …) or null.
 */
export const parseWordPressInspectorTabName = (value) => {
	if (!value) {
		return null;
	}

	const normalized = value.toLowerCase();

	for (let i = 0; i < WORDPRESS_INSPECTOR_TAB_NAMES.length; i++) {
		const name = WORDPRESS_INSPECTOR_TAB_NAMES[i];
		const boundary = new RegExp(`(^|[-_/])${name}($|[-_/])`);

		if (boundary.test(normalized) || normalized === name) {
			return name;
		}
	}

	return null;
};

/**
 * Reads the WordPress tab name from a selected tab element.
 *
 * @param {HTMLElement|null|undefined} tabElement Selected `[role="tab"]` node.
 * @return {string|null} Core tab name or null.
 */
export const readWordPressInspectorTabNameFromElement = (tabElement) => {
	if (!tabElement) {
		return null;
	}

	const attributeCandidates = [
		tabElement.getAttribute('data-tab-id'),
		tabElement.getAttribute('id'),
		tabElement.getAttribute('aria-controls'),
	];

	for (let i = 0; i < attributeCandidates.length; i++) {
		const parsed = parseWordPressInspectorTabName(attributeCandidates[i]);

		if (parsed) {
			return parsed;
		}
	}

	const label = (
		tabElement.getAttribute('aria-label') ||
		tabElement.textContent ||
		''
	).toLowerCase();

	if (label.includes('setting') || label.includes('general')) {
		return 'settings';
	}

	if (label.includes('effect') || label.includes('animation')) {
		return 'effects';
	}

	if (label.includes('style')) {
		return 'styles';
	}

	if (label.includes('list')) {
		return 'list';
	}

	if (label.includes('content')) {
		return 'content';
	}

	return null;
};

/**
 * Maps a WordPress inspector tab name to Blockera `currentTab` state values.
 *
 * @param {string|null} wordPressTabName Core tab name.
 * @return {string|null} Blockera tab (`setting`, `styles`) or null.
 */
export const mapWordPressInspectorTabNameToBlockeraTab = (wordPressTabName) => {
	switch (wordPressTabName) {
		case 'settings':
			return 'setting';
		case 'styles':
		case 'effects':
			return 'styles';
		default:
			return null;
	}
};

/**
 * Active WordPress block-inspector tab name from the DOM.
 *
 * @param {HTMLElement|null|undefined} inspector `.block-editor-block-inspector` root.
 * @return {string|null} Core tab name (`settings`, `styles`, `effects`, …) or null.
 */
export const readActiveWordPressInspectorTabName = (inspector) => {
	if (!inspector) {
		return null;
	}

	const tabsRoot = inspector.querySelector(INSPECTOR_TABS_SELECTOR);

	if (tabsRoot) {
		const selectedTab = tabsRoot.querySelector(
			'[role="tab"][aria-selected="true"]'
		);
		const tabName = readWordPressInspectorTabNameFromElement(selectedTab);

		if (tabName) {
			return tabName;
		}
	}

	return null;
};

/**
 * Reads the active WordPress block inspector tab as a Blockera `currentTab` value.
 *
 * @param {HTMLElement|null|undefined} inspector Block inspector root element.
 * @return {string|null} Blockera tab name or null when unknown / non-Blockera tab.
 */
export const readBlockeraTabFromInspectorDom = (inspector) => {
	const wordPressTab = readActiveWordPressInspectorTabName(inspector);

	return mapWordPressInspectorTabNameToBlockeraTab(wordPressTab);
};

/**
 * Clicks the WordPress inspector tab that matches a Blockera `currentTab` value.
 *
 * @param {HTMLElement|null|undefined} inspector Block inspector root element.
 * @param {string} blockeraTab Blockera tab (`setting`, `styles`, …).
 * @return {boolean} Whether a tab control was activated.
 */
export const activateWordPressInspectorTabForBlockeraTab = (
	inspector,
	blockeraTab
) => {
	if (!inspector || !blockeraTab) {
		return false;
	}

	const normalized = normalizeBlockeraTab(blockeraTab);
	let targetWordPressTab = null;

	if ('settings' === normalized) {
		targetWordPressTab = 'settings';
	} else if ('style' === normalized) {
		targetWordPressTab = 'styles';
	}

	if (!targetWordPressTab) {
		return false;
	}

	const tabsRoot = inspector.querySelector(INSPECTOR_TABS_SELECTOR);

	if (!tabsRoot) {
		return false;
	}

	const tabs = tabsRoot.querySelectorAll('[role="tab"]');

	for (let i = 0; i < tabs.length; i++) {
		const tab = tabs[i];

		if (
			readWordPressInspectorTabNameFromElement(tab) === targetWordPressTab
		) {
			if ('true' !== tab.getAttribute('aria-selected')) {
				tab.click();
			}

			return true;
		}
	}

	return false;
};

const DEFAULT_BLOCKERA_INSPECTOR_TAB = 'styles';

/**
 * Activates the WordPress Styles inspector tab (retries while the inspector rebuilds).
 *
 * @param {HTMLElement|null|undefined} inspector Block inspector root element.
 * @param {number}                         maxAttempts Maximum retry frames.
 * @return {boolean} Whether the styles tab is selected.
 */
export const ensureWordPressInspectorStylesTab = (
	inspector,
	maxAttempts = 12
) => {
	if (!inspector) {
		return false;
	}

	let attempts = 0;
	let activated = false;

	const tryActivate = () => {
		if (!document.contains(inspector)) {
			return;
		}

		activated = activateWordPressInspectorTabForBlockeraTab(
			inspector,
			DEFAULT_BLOCKERA_INSPECTOR_TAB
		);

		if (!activated && attempts < maxAttempts) {
			attempts += 1;
			requestAnimationFrame(tryActivate);
		}
	};

	tryActivate();

	return activated;
};

export { DEFAULT_BLOCKERA_INSPECTOR_TAB };

/**
 * Effective tab for side effects — always derived from BlockBase `currentTab`.
 *
 * @param {Object} options
 * @param {string} options.currentTab Blockera tab from BlockBase state.
 * @return {string} Normalized tab id (`settings`, `style`, …).
 */
export const getEffectiveInspectorTab = ({ currentTab }) =>
	normalizeBlockeraTab(currentTab);

export const observeInspectorTabLists = (inspector, onTabChange) => {
	const observers = [];

	if (!inspector) {
		return observers;
	}

	const tabLists = new Set();
	const tabsRoot = inspector.querySelector(INSPECTOR_TABS_SELECTOR);

	if (tabsRoot) {
		const blockInspectorTabList =
			tabsRoot.querySelector('[role="tablist"]');

		if (blockInspectorTabList) {
			tabLists.add(blockInspectorTabList);
		}
	}

	tabLists.forEach((tabList) => {
		const observer = new MutationObserver(onTabChange);

		observer.observe(tabList, {
			attributes: true,
			subtree: true,
			attributeFilter: ['aria-selected'],
		});

		observers.push(observer);
	});

	return observers;
};

export const getSettingsOutsideInspectorTabs = (inspector) => {
	if (!inspector) {
		return [];
	}

	return inspector.querySelectorAll('div[class^="css-"]');
};

export const resolveInspectorRoot = ({
	insideBlockInspector,
	inspectorContainer,
}) => {
	if (insideBlockInspector) {
		return isBlockInspectorContainerReady(inspectorContainer)
			? inspectorContainer
			: null;
	}

	const inspector = document.querySelector(BLOCK_INSPECTOR_SELECTOR);

	return isBlockInspectorContainerReady(inspector) ? inspector : null;
};
