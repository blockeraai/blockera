/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { useCommandLoader } from '@wordpress/commands';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { TAB_COMMAND_MARKER } from '../utils/wrapCommandLoaderHook';
import type {
	Command,
	CommandLoaderResult,
} from '../utils/wrapCommandLoaderHook';
import type { Tab } from '../../tabs/types';
import { getTabIcon } from '../../tabs/utils/getTabIcon';
import { isEditorPage } from '../../utils/isEditorPage';

// Use entity-edit context to show commands by default in the contextual group
// This matches the context used by WordPress when editing entities
// CSS hides them when NOT in add-tab mode
const ENTITY_EDIT_CONTEXT = 'entity-edit';

/**
 * Tab actions interface for switching to open tabs.
 */
interface OpenTabsTabActions {
	switchDocument: (
		postType: string,
		postId: string | number
	) => Promise<boolean>;
	prefetchEntity: (
		postType: string | null | undefined,
		postId: string | number | null | undefined
	) => Promise<unknown>;
	onDocumentInaccessible?: (info: {
		key: string;
		type: string;
		id: string | number;
		title: string;
	}) => void;
}

/**
 * Command loader hook that returns commands for all open tabs
 * Context-based loader - commands show by default when context is active
 *
 * @param tabs - Array of open tabs
 * @param tabActions - Tab action functions
 * @return The command loader hook
 */
function getOpenTabsCommandsLoader(
	tabs: Tab[],
	tabActions: OpenTabsTabActions
): () => CommandLoaderResult {
	return function useOpenTabsCommandsLoader(): CommandLoaderResult {
		// Resolve labels from core-data when possible: persisted tab titles can lag behind
		// entity titles (e.g. after "Add new page" used a static label). Command palette
		// search uses these strings, so they must match the real document title.
		//
		// @wordpress/data useSelect shallow-compares the returned array: if each string
		// equals the previous render, subscribers do not re-render (new [] is OK).
		const tabCommandLabels = useSelect(
			(select) => {
				const { getEntityRecord } = select(coreStore) as {
					getEntityRecord: (
						kind: string,
						name: string,
						id: string | number
					) => { title?: string | { rendered?: string } } | undefined;
				};

				return tabs.map((tab) => {
					// Explicit user override (including "") — do not replace with entity title.
					if (
						tab.customTitle !== undefined &&
						tab.customTitle !== null
					) {
						return tab.customTitle;
					}
					try {
						const record = getEntityRecord(
							'postType',
							tab.type,
							tab.id
						);
						if (
							record?.title !== undefined &&
							record?.title !== null
						) {
							const t = record.title;
							const resolved =
								typeof t === 'string' ? t : (t.rendered ?? '');
							if (resolved) {
								return resolved;
							}
						}
					} catch {
						// Record not in store yet — getEntityRecord can throw before resolution.
					}
					return tab.title;
				});
			},
			// tabs comes from getOpenTabsCommandsLoader(tabs) closure; list must update when workspace tabs change.
			// eslint-disable-next-line react-hooks/exhaustive-deps -- not component props; factory-injected
			[tabs]
		);

		// Build commands array for all open tabs
		// Note: Visibility is controlled by context + CSS based on add-tab mode
		// Include tabActions in dependencies to ensure callbacks always use latest functions
		const commands = useMemo((): Command[] => {
			if (!tabs || tabs.length === 0) {
				return [];
			}

			return tabs.map((tab, index) => {
				const icon = getTabIcon({
					postType: tab.type,
					slug: tab.slug,
				});

				const displayTitle =
					tabCommandLabels[index] ?? tab.customTitle ?? tab.title;

				return {
					name: `blockera-tabs/switch-to-tab-${tab.key}`,
					label: displayTitle,
					searchLabel: `${displayTitle} ${TAB_COMMAND_MARKER}`,
					icon,
					callback: async ({ close }) => {
						if (!isEditorPage()) {
							close?.();
							return;
						}

						try {
							const record = await tabActions.prefetchEntity(
								tab.type,
								tab.id
							);
							if (!record) {
								tabActions.onDocumentInaccessible?.({
									key: tab.key,
									type: tab.type,
									id: tab.id,
									title:
										typeof tab.customTitle === 'string' &&
										tab.customTitle !== ''
											? tab.customTitle
											: tab.title,
								});
								close?.();
								return;
							}
							const ok = await tabActions.switchDocument(
								tab.type,
								tab.id
							);
							if (!ok) {
								tabActions.onDocumentInaccessible?.({
									key: tab.key,
									type: tab.type,
									id: tab.id,
									title:
										typeof tab.customTitle === 'string' &&
										tab.customTitle !== ''
											? tab.customTitle
											: tab.title,
								});
							}
							close?.();
						} catch (error) {
							// @debug-ignore
							// eslint-disable-next-line no-console
							console.error(
								`Failed to switch to tab ${tab.key}:`,
								error
							);
							close?.();
						}
					},
				};
			});
			// tabs/tabActions are factory closure values; include them so callbacks and rows match current workspace.
			// eslint-disable-next-line react-hooks/exhaustive-deps -- not component props; factory-injected
		}, [tabs, tabActions, tabCommandLabels]);

		return {
			commands,
			isLoading: false,
		};
	};
}

/**
 * Parameters for useOpenTabsCommands hook.
 */
export interface UseOpenTabsCommandsParams {
	/** Array of open tabs. */
	tabs: Tab[];
	/** Function to switch to a document. */
	switchDocument: (
		postType: string,
		postId: string | number
	) => Promise<boolean>;
	/** Function to prefetch entity before switching. */
	prefetchEntity: (
		postType: string | null | undefined,
		postId: string | number | null | undefined
	) => Promise<unknown>;
	/** Optional handler when the tab target cannot be loaded. */
	onDocumentInaccessible?: (info: {
		key: string;
		type: string;
		id: string | number;
		title: string;
	}) => void;
}

/**
 * Hook to register commands for all open tabs
 * Uses useCommandLoader with entity-edit context to show commands by default
 *
 * @param params - Parameters
 */
export function useOpenTabsCommands({
	tabs,
	switchDocument,
	prefetchEntity,
	onDocumentInaccessible,
}: UseOpenTabsCommandsParams): void {
	// Create a stable reference to tab actions
	const tabActions = useMemo(
		(): OpenTabsTabActions => ({
			switchDocument,
			prefetchEntity,
			onDocumentInaccessible,
		}),
		[switchDocument, prefetchEntity, onDocumentInaccessible]
	);

	// Create the loader hook with current tabs
	const loaderHook = useMemo(
		() => getOpenTabsCommandsLoader(tabs, tabActions),
		[tabs, tabActions]
	);

	// Register the command loader WITH entity-edit context
	// Commands show by default when editing entities
	// CSS hides them when not in add-tab mode
	useCommandLoader({
		name: 'blockera-tabs/open-tabs-commands',
		hook: loaderHook,
		context: ENTITY_EDIT_CONTEXT,
	});
}
