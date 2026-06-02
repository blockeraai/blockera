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
		return 'interactions';
	}

	return tab;
};

export const isSettingsInspectorTab = (tab) => 'settings' === tab;

export const isStylesInspectorTab = (tab) =>
	'style' === tab || 'styles' === tab || 'interactions' === tab;

export const INSPECTOR_TABS_SELECTOR = '.block-editor-block-inspector__tabs';

export const isInspectorTabChrome = (element) =>
	Boolean(element?.closest('[role="tablist"]'));

/** Maps Blockera tab names to WordPress InspectorControls group ids. */
export const getBlockInspectorGroup = (tabName) => {
	switch (normalizeBlockeraTab(tabName)) {
		case 'settings':
			return 'settings';
		case 'style':
			return 'styles';
		case 'interactions':
			return 'effects';
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

export const getEffectiveInspectorTab = ({
	insideBlockInspector,
	currentTab,
	inspector,
}) => {
	const normalized = normalizeBlockeraTab(currentTab);

	if (!insideBlockInspector || !inspector) {
		return normalized;
	}

	const nestedTab = inspector.querySelector(
		'.block-editor-block-inspector__tabs [role="tab"][aria-selected="true"]'
	);

	if (nestedTab) {
		const tabId =
			nestedTab.getAttribute('data-tab-id') ||
			nestedTab.getAttribute('id') ||
			'';

		if (tabId.includes('settings')) {
			return 'settings';
		}

		if (tabId.includes('styles')) {
			return 'style';
		}

		if (tabId.includes('effects')) {
			return 'interactions';
		}

		if (tabId.includes('list') || tabId.includes('content')) {
			return 'style';
		}
	}

	const complementaryArea =
		inspector.closest('.interface-complementary-area') ||
		document.querySelector('.interface-complementary-area');

	const sidebarTab = complementaryArea?.querySelector(
		'[role="tab"][aria-selected="true"]'
	);

	if (sidebarTab) {
		const label = (
			sidebarTab.getAttribute('aria-label') ||
			sidebarTab.textContent ||
			''
		).toLowerCase();

		if (label.includes('setting') || label.includes('general')) {
			return 'settings';
		}

		if (label.includes('style')) {
			return 'style';
		}

		if (label.includes('effect') || label.includes('animation')) {
			return 'interactions';
		}
	}

	return normalized;
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
