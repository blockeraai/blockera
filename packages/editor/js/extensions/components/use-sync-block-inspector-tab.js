/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';
import { useCallback, useEffect, useRef } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { useShouldRenderBlockInspectorCardPortal } from '../libs/block-card';

/**
 * Internal dependencies
 */
import {
	INSPECTOR_TABS_SELECTOR,
	isBlockInspectorContainerReady,
	readBlockeraTabFromInspectorDom,
	readActiveWordPressInspectorTabName,
	observeInspectorTabLists,
	resolveInspectorRoot,
	activateWordPressInspectorTabForBlockeraTab,
	ensureWordPressInspectorStylesTab,
	DEFAULT_BLOCKERA_INSPECTOR_TAB,
} from '../../hooks/use-block-side-effects/utils';
import { useBlockInspectorContainer } from './use-block-inspector-container';
import { isInnerBlock } from './utils';

const WP_TAB_SYNC_SUPPRESS_MS = 400;

/**
 * Keeps BlockBase `currentTab` aligned with WordPress block-inspector tabs.
 *
 * @param {Object}   options
 * @param {string}   options.clientId             Selected block client id.
 * @param {boolean}  options.insideBlockInspector Whether the block uses the block inspector.
 * @param {boolean}  options.enabled              Whether sync should run for this block instance.
 * @param {string}   options.currentTab           Blockera tab state from BlockBase.
 * @param {Function} options.setCurrentTab        BlockBase tab setter.
 * @return {{ setCurrentTab: Function }} Setter that also activates the matching WP tab.
 */
export function useSyncBlockInspectorTab({
	clientId,
	insideBlockInspector,
	enabled,
	currentTab,
	setCurrentTab,
}) {
	const inspectorContainer = useBlockInspectorContainer();
	const currentBlock = useSelect(
		(select) => select('blockera/extensions').getExtensionCurrentBlock(),
		[]
	);
	const isInnerBlockTarget = isInnerBlock(currentBlock);
	const isInspectorBlockeraReady = useShouldRenderBlockInspectorCardPortal(
		insideBlockInspector && enabled ? clientId : ''
	);
	const canSyncInspectorTabs = Boolean(
		insideBlockInspector && enabled && isInspectorBlockeraReady
	);
	const currentTabRef = useRef(currentTab);
	const isSyncingFromWordPressRef = useRef(false);
	const suppressWpSyncUntilRef = useRef(0);
	const previousClientIdRef = useRef(clientId);
	const previousEnabledRef = useRef(enabled);
	const previousInspectorReadyRef = useRef(isInspectorBlockeraReady);

	useEffect(() => {
		currentTabRef.current = currentTab;
	}, [currentTab]);

	const applyDefaultStylesTabStateOnly = useCallback(() => {
		suppressWpSyncUntilRef.current = Date.now() + WP_TAB_SYNC_SUPPRESS_MS;
		setCurrentTab(DEFAULT_BLOCKERA_INSPECTOR_TAB);
		currentTabRef.current = DEFAULT_BLOCKERA_INSPECTOR_TAB;
	}, [setCurrentTab]);

	const applyDefaultStylesTab = useCallback(() => {
		applyDefaultStylesTabStateOnly();

		const inspector = resolveInspectorRoot({
			insideBlockInspector: true,
			inspectorContainer,
		});

		if (inspector) {
			ensureWordPressInspectorStylesTab(inspector);
		}
	}, [applyDefaultStylesTabStateOnly, inspectorContainer]);

	const setCurrentTabAligned = useCallback(
		(nextTab) => {
			if (!nextTab || nextTab === currentTabRef.current) {
				return;
			}

			setCurrentTab(nextTab);

			if (!canSyncInspectorTabs || isSyncingFromWordPressRef.current) {
				return;
			}

			const inspector = resolveInspectorRoot({
				insideBlockInspector: true,
				inspectorContainer,
			});

			if (!inspector) {
				return;
			}

			activateWordPressInspectorTabForBlockeraTab(inspector, nextTab);
		},
		[canSyncInspectorTabs, inspectorContainer, setCurrentTab]
	);

	// New block selected (or inspector controls become active): default to Styles.
	useEffect(() => {
		if (!insideBlockInspector || !enabled || !clientId) {
			previousClientIdRef.current = clientId;
			previousEnabledRef.current = enabled;
			return;
		}

		const clientIdChanged = previousClientIdRef.current !== clientId;
		const becameActive = !previousEnabledRef.current && enabled;

		previousClientIdRef.current = clientId;
		previousEnabledRef.current = enabled;

		if (clientIdChanged || becameActive) {
			if (canSyncInspectorTabs) {
				applyDefaultStylesTab();
			} else {
				// Content-only pattern before "Edit pattern": keep Blockera state only.
				applyDefaultStylesTabStateOnly();
			}
		}
	}, [
		clientId,
		enabled,
		canSyncInspectorTabs,
		insideBlockInspector,
		applyDefaultStylesTab,
		applyDefaultStylesTabStateOnly,
	]);

	// Entering content-only "Edit pattern" mode: same as selecting a block (Styles tab).
	useEffect(() => {
		if (!insideBlockInspector || !enabled) {
			previousInspectorReadyRef.current = isInspectorBlockeraReady;
			return;
		}

		const enteredPatternEditMode =
			!previousInspectorReadyRef.current && isInspectorBlockeraReady;

		previousInspectorReadyRef.current = isInspectorBlockeraReady;

		if (enteredPatternEditMode) {
			applyDefaultStylesTab();
		}
	}, [
		insideBlockInspector,
		enabled,
		isInspectorBlockeraReady,
		applyDefaultStylesTab,
	]);

	// Inner blocks only expose the Styles panel — keep Blockera + WP on Styles.
	useEffect(() => {
		if (!insideBlockInspector || !enabled || !isInnerBlockTarget) {
			return;
		}

		if (canSyncInspectorTabs) {
			applyDefaultStylesTab();
		} else {
			applyDefaultStylesTabStateOnly();
		}
	}, [
		insideBlockInspector,
		enabled,
		isInnerBlockTarget,
		canSyncInspectorTabs,
		applyDefaultStylesTab,
		applyDefaultStylesTabStateOnly,
	]);

	// Inspector DOM is rebuilt after selection — activate Styles once the container exists.
	useEffect(() => {
		if (!canSyncInspectorTabs) {
			return;
		}

		if (DEFAULT_BLOCKERA_INSPECTOR_TAB !== currentTabRef.current) {
			return;
		}

		const inspector = resolveInspectorRoot({
			insideBlockInspector: true,
			inspectorContainer,
		});

		if (!isBlockInspectorContainerReady(inspector)) {
			return;
		}

		if ('styles' !== readActiveWordPressInspectorTabName(inspector)) {
			suppressWpSyncUntilRef.current =
				Date.now() + WP_TAB_SYNC_SUPPRESS_MS;
			ensureWordPressInspectorStylesTab(inspector);
		}
	}, [canSyncInspectorTabs, inspectorContainer]);

	useEffect(() => {
		if (!canSyncInspectorTabs) {
			return;
		}

		const syncTabFromWordPress = () => {
			if (Date.now() < suppressWpSyncUntilRef.current) {
				return;
			}

			const inspector = resolveInspectorRoot({
				insideBlockInspector: true,
				inspectorContainer,
			});

			if (!isBlockInspectorContainerReady(inspector)) {
				return;
			}

			if (isInnerBlockTarget) {
				if ('styles' !== currentTabRef.current) {
					isSyncingFromWordPressRef.current = true;
					applyDefaultStylesTabStateOnly();
					isSyncingFromWordPressRef.current = false;
				}

				if (
					'styles' !== readActiveWordPressInspectorTabName(inspector)
				) {
					suppressWpSyncUntilRef.current =
						Date.now() + WP_TAB_SYNC_SUPPRESS_MS;
					ensureWordPressInspectorStylesTab(inspector);
				}

				return;
			}

			const nextTab = readBlockeraTabFromInspectorDom(inspector);

			if (!nextTab || nextTab === currentTabRef.current) {
				return;
			}

			isSyncingFromWordPressRef.current = true;
			setCurrentTab(nextTab);
			isSyncingFromWordPressRef.current = false;
			currentTabRef.current = nextTab;
		};

		const inspector = resolveInspectorRoot({
			insideBlockInspector: true,
			inspectorContainer,
		});

		if (!isBlockInspectorContainerReady(inspector)) {
			return;
		}

		syncTabFromWordPress();

		const tabObservers = observeInspectorTabLists(
			inspector,
			syncTabFromWordPress
		);

		const tabsRoot = inspector.querySelector(INSPECTOR_TABS_SELECTOR);
		let tabsRootObserver = null;

		if (tabsRoot) {
			tabsRootObserver = new MutationObserver(syncTabFromWordPress);
			tabsRootObserver.observe(tabsRoot, {
				childList: true,
				subtree: true,
			});
		}

		return () => {
			tabsRootObserver?.disconnect();
			tabObservers.forEach((observer) => observer.disconnect());
		};
	}, [
		canSyncInspectorTabs,
		inspectorContainer,
		setCurrentTab,
		isInnerBlockTarget,
		applyDefaultStylesTabStateOnly,
	]);

	return { setCurrentTab: setCurrentTabAligned };
}
