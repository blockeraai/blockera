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
	isBlockInspectorContainerReady,
	readBlockeraTabFromInspectorDom,
	observeInspectorTabLists,
	resolveInspectorRoot,
	getWordPressInspectorTabCount,
	hasMoreThanTwoWordPressInspectorTabs,
	getBlockInspectorGroup,
	DEFAULT_BLOCKERA_INSPECTOR_TAB,
} from '../../hooks/use-block-side-effects/utils';
import { requestWordPressInspectorTab } from '../../utils/block-editor-private-apis';
import { useBlockInspectorContainer } from './use-block-inspector-container';
import { isInnerBlock } from './utils';

/**
 * Inspector tab rules (per blockName::variation, session persistence):
 *
 * | WP tabs   | First open (no saved tab)     | Re-select same block type | User changes tab |
 * |-----------|-------------------------------|---------------------------|------------------|
 * | 2         | Default Styles + request WP   | Restore saved + request WP| Persist + request|
 * | >2        | Follow WP active tab only     | Restore saved + request WP| Persist (+ WP if |
 * |           | (no requestInspectorTab)      |                           |  user via Blockera)|
 * | Inner blk | Force Styles + request WP     | —                         | —                |
 */

/** @type {Map<string, string>} Session-only tab per block type + variation. */
const blockInspectorTabByKey = new Map();

/** Ignore WP→Blockera observer reads briefly after programmatic tab changes. */
const WP_TAB_SYNC_SUPPRESS_MS = 600;

const ACTIVATION_RETRY_MAX_FRAMES = 48;

/**
 * Persistence API for the activated inspector tab (cleared on full page reload).
 */
export const blockInspectorTabPersistence = {
	getKey: (blockName, blockVariation = '') =>
		`${blockName}::${blockVariation || ''}`,

	get: (blockName, blockVariation = '') =>
		blockInspectorTabByKey.get(
			blockInspectorTabPersistence.getKey(blockName, blockVariation)
		),

	getByKey: (persistenceKey) =>
		persistenceKey ? blockInspectorTabByKey.get(persistenceKey) : undefined,

	set: (blockName, blockVariation, tab) => {
		const key = blockInspectorTabPersistence.getKey(
			blockName,
			blockVariation
		);

		blockInspectorTabPersistence.setByKey(key, tab);
	},

	setByKey: (persistenceKey, tab) => {
		if (persistenceKey && typeof tab === 'string' && tab) {
			blockInspectorTabByKey.set(persistenceKey, tab);
		}
	},
};

const getInspectorRoot = (inspectorContainer) =>
	resolveInspectorRoot({
		insideBlockInspector: true,
		inspectorContainer,
	});

const requestWordPressTabForBlockeraTab = (blockeraTab) => {
	const wordPressTab = getBlockInspectorGroup(blockeraTab);

	if (wordPressTab) {
		requestWordPressInspectorTab(wordPressTab);
	}
};

/**
 * @typedef {'inner-block'|'persisted'|'two-tab-default'|'wordpress-default'} InspectorTabActivationMode
 */

/**
 * Plans which Blockera tab to activate and whether to request a WP tab switch.
 * Returns `null` while the inspector DOM is not ready (avoids stale tab reads).
 *
 * @param {Object}                        options
 * @param {string}                        options.persistenceKey
 * @param {HTMLElement|null|undefined}    options.inspector
 * @param {boolean}                       options.isInnerBlock
 * @param {boolean}                       [options.isFirstBlockTypeSelection] First open for this block type in the session.
 * @param {boolean}                       [options.allowMultiTabDomRead]      Whether >2-tab DOM reads are trusted (after settle or retry timeout).
 * @return {{ tab: string, syncWordPress: boolean, mode: InspectorTabActivationMode }|null} Activation plan, or null while the inspector DOM is not ready.
 */
export const getInspectorTabActivationPlan = ({
	persistenceKey,
	inspector,
	isInnerBlock,
	isFirstBlockTypeSelection = false,
	allowMultiTabDomRead = true,
}) => {
	if (isInnerBlock) {
		return {
			tab: DEFAULT_BLOCKERA_INSPECTOR_TAB,
			syncWordPress: true,
			mode: 'inner-block',
		};
	}

	const persistedTab = blockInspectorTabPersistence.getByKey(persistenceKey);

	if (typeof persistedTab === 'string' && persistedTab) {
		return {
			tab: persistedTab,
			syncWordPress: true,
			mode: 'persisted',
		};
	}

	if (!inspector || !isBlockInspectorContainerReady(inspector)) {
		return null;
	}

	const tabCount = getWordPressInspectorTabCount(inspector);

	if (tabCount === 0) {
		return null;
	}

	if (hasMoreThanTwoWordPressInspectorTabs(inspector)) {
		if (isFirstBlockTypeSelection && !allowMultiTabDomRead) {
			return null;
		}

		const tab = readBlockeraTabFromInspectorDom(inspector);

		if (!tab) {
			return null;
		}

		return {
			tab,
			syncWordPress: false,
			mode: 'wordpress-default',
		};
	}

	return {
		tab: DEFAULT_BLOCKERA_INSPECTOR_TAB,
		syncWordPress: true,
		mode: 'two-tab-default',
	};
};

/**
 * Applies a tab change to Blockera state and optionally requests the matching WP tab.
 * Persistence is handled by BlockBase `setCurrentTab`.
 *
 * @param {Object}   options
 * @param {string}   options.tab
 * @param {Function} options.setCurrentTab
 * @param {boolean}  options.syncWordPress
 */
const applyInspectorTabChange = ({ tab, setCurrentTab, syncWordPress }) => {
	if (typeof tab !== 'string' || !tab) {
		return;
	}

	setCurrentTab(tab);

	if (syncWordPress) {
		requestWordPressTabForBlockeraTab(tab);
	}
};

/**
 * Keeps BlockBase `currentTab` aligned with WordPress block-inspector tabs.
 *
 * Blockera → WordPress: `requestInspectorTab` store API.
 * WordPress → Blockera: `aria-selected` observer (user tab clicks only).
 *
 * @param {Object}   options
 * @param {string}   options.blockName            Block type name (e.g. core/paragraph).
 * @param {string}   options.blockVariation       Active block variation name, if any.
 * @param {string}   options.inspectorClientId    Client id for inspector portal deferral only.
 * @param {boolean}  options.insideBlockInspector Whether the block uses the block inspector.
 * @param {boolean}  options.enabled              Selected block instance.
 * @param {string}   options.currentTab           Blockera tab from BlockBase.
 * @param {Function} options.setCurrentTab        BlockBase tab setter (persists per block type).
 * @return {{ setCurrentTab: Function }} Setter that syncs WordPress when the user changes tabs.
 */
export function useSyncBlockInspectorTab({
	blockName,
	blockVariation = '',
	inspectorClientId = '',
	insideBlockInspector,
	enabled,
	currentTab,
	setCurrentTab,
}) {
	const persistenceKey = blockInspectorTabPersistence.getKey(
		blockName,
		blockVariation
	);
	const inspectorContainer = useBlockInspectorContainer();
	const isInnerBlockTarget = useSelect((select) =>
		isInnerBlock(select('blockera/extensions').getExtensionCurrentBlock())
	);
	const isInspectorBlockeraReady = useShouldRenderBlockInspectorCardPortal(
		insideBlockInspector && enabled ? inspectorClientId : ''
	);
	const canSyncWordPressTabs = Boolean(
		insideBlockInspector && enabled && isInspectorBlockeraReady
	);

	const syncStateRef = useRef({
		currentTab,
		setCurrentTab,
		persistenceKey,
		canSyncWordPressTabs,
		isInnerBlockTarget,
	});
	const suppressWpSyncUntilRef = useRef(0);
	const awaitingBlockTypeActivationRef = useRef(false);
	const inspectorTabsSettledRef = useRef(false);
	const previousPersistenceKeyRef = useRef(null);

	syncStateRef.current.currentTab = currentTab;
	syncStateRef.current.setCurrentTab = setCurrentTab;
	syncStateRef.current.persistenceKey = persistenceKey;
	syncStateRef.current.canSyncWordPressTabs = canSyncWordPressTabs;
	syncStateRef.current.isInnerBlockTarget = isInnerBlockTarget;

	const beginWpSyncSuppress = useCallback(() => {
		suppressWpSyncUntilRef.current = Date.now() + WP_TAB_SYNC_SUPPRESS_MS;
	}, []);

	const isWpSyncSuppressed = useCallback(
		() => Date.now() < suppressWpSyncUntilRef.current,
		[]
	);

	const applyTab = useCallback(
		(tab, { syncWordPress = false, suppressWpObserver = true } = {}) => {
			if (suppressWpObserver) {
				beginWpSyncSuppress();
			}

			applyInspectorTabChange({
				tab,
				setCurrentTab: syncStateRef.current.setCurrentTab,
				syncWordPress,
			});
		},
		[beginWpSyncSuppress]
	);

	const activatePreferredTab = useCallback(
		(activationAttempt = 0) => {
			const {
				persistenceKey: activePersistenceKey,
				canSyncWordPressTabs: canSyncTabs,
				isInnerBlockTarget: isInnerBlockSelection,
			} = syncStateRef.current;
			const inspector = getInspectorRoot(inspectorContainer);
			const isFirstBlockTypeSelection =
				awaitingBlockTypeActivationRef.current &&
				!blockInspectorTabPersistence.getByKey(activePersistenceKey);
			const plan = getInspectorTabActivationPlan({
				persistenceKey: activePersistenceKey,
				inspector,
				isInnerBlock: isInnerBlockSelection,
				isFirstBlockTypeSelection,
				allowMultiTabDomRead:
					inspectorTabsSettledRef.current ||
					activationAttempt >= ACTIVATION_RETRY_MAX_FRAMES,
			});

			if (!plan) {
				return false;
			}

			const shouldSyncWordPress =
				plan.syncWordPress &&
				canSyncTabs &&
				inspector &&
				isBlockInspectorContainerReady(inspector);

			applyTab(plan.tab, { syncWordPress: shouldSyncWordPress });
			awaitingBlockTypeActivationRef.current = false;

			return true;
		},
		[applyTab, inspectorContainer]
	);

	const setCurrentTabAligned = useCallback(
		(nextTab) => {
			if (
				typeof nextTab !== 'string' ||
				!nextTab ||
				nextTab === syncStateRef.current.currentTab
			) {
				return;
			}

			applyTab(nextTab, { syncWordPress: canSyncWordPressTabs });
		},
		[applyTab, canSyncWordPressTabs]
	);

	useEffect(() => {
		if (!insideBlockInspector || !enabled || !blockName) {
			return undefined;
		}

		const persistenceKeyChanged =
			previousPersistenceKeyRef.current !== persistenceKey;

		previousPersistenceKeyRef.current = persistenceKey;

		if (!blockInspectorTabPersistence.getByKey(persistenceKey)) {
			awaitingBlockTypeActivationRef.current = true;

			if (persistenceKeyChanged) {
				inspectorTabsSettledRef.current = false;
			}
		}

		let frameId = 0;
		let attempts = 0;
		const activationTabObservers = [];

		const tryActivate = () => {
			if (activatePreferredTab(attempts)) {
				return;
			}

			if (attempts < ACTIVATION_RETRY_MAX_FRAMES) {
				attempts += 1;
				frameId = requestAnimationFrame(tryActivate);
			}
		};

		tryActivate();

		const inspector = getInspectorRoot(inspectorContainer);

		if (inspector && isBlockInspectorContainerReady(inspector)) {
			activationTabObservers.push(
				...observeInspectorTabLists(inspector, () => {
					inspectorTabsSettledRef.current = true;

					if (awaitingBlockTypeActivationRef.current) {
						tryActivate();
					}
				})
			);
		}

		return () => {
			if (frameId) {
				cancelAnimationFrame(frameId);
			}

			activationTabObservers.forEach((observer) => observer.disconnect());
		};
	}, [
		blockName,
		persistenceKey,
		inspectorClientId,
		enabled,
		insideBlockInspector,
		isInnerBlockTarget,
		canSyncWordPressTabs,
		inspectorContainer,
		activatePreferredTab,
	]);

	useEffect(() => {
		if (!canSyncWordPressTabs) {
			return;
		}

		const inspector = getInspectorRoot(inspectorContainer);

		if (!isBlockInspectorContainerReady(inspector)) {
			return;
		}

		const handleWordPressTabChange = () => {
			const { currentTab: activeTab } = syncStateRef.current;

			if (!isBlockInspectorContainerReady(inspector)) {
				return;
			}

			if (
				awaitingBlockTypeActivationRef.current ||
				isWpSyncSuppressed()
			) {
				return;
			}

			if (isInnerBlockTarget) {
				if (activeTab !== DEFAULT_BLOCKERA_INSPECTOR_TAB) {
					applyTab(DEFAULT_BLOCKERA_INSPECTOR_TAB, {
						syncWordPress: true,
					});
				}

				return;
			}

			const nextTab = readBlockeraTabFromInspectorDom(inspector);

			if (!nextTab || nextTab === activeTab) {
				return;
			}

			applyTab(nextTab);
		};

		const tabObservers = observeInspectorTabLists(
			inspector,
			handleWordPressTabChange
		);

		return () => {
			tabObservers.forEach((observer) => observer.disconnect());
		};
	}, [
		applyTab,
		canSyncWordPressTabs,
		inspectorContainer,
		isInnerBlockTarget,
	]);

	return { setCurrentTab: setCurrentTabAligned };
}
