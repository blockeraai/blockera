/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { useCommandLoader } from '@wordpress/commands';

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
	switchDocument: (postType: string, postId: string | number) => void;
	prefetchEntity: (
		postType: string | null | undefined,
		postId: string | number | null | undefined
	) => Promise<unknown>;
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
		// Build commands array for all open tabs
		// Note: Visibility is controlled by context + CSS based on add-tab mode
		// Include tabActions in dependencies to ensure callbacks always use latest functions
		const commands = useMemo((): Command[] => {
			if (!tabs || tabs.length === 0) {
				return [];
			}

			return tabs.map((tab) => {
				const icon = getTabIcon({
					postType: tab.type,
					slug: tab.slug,
				});

				// Use custom title if available, otherwise use regular title
				const displayTitle = tab.customTitle ?? tab.title;

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
							// Prefetch entity data before switching for instant tab switch
							await tabActions.prefetchEntity(tab.type, tab.id);
							tabActions.switchDocument(tab.type, tab.id);
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
		}, [tabs, tabActions]);

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
	switchDocument: (postType: string, postId: string | number) => void;
	/** Function to prefetch entity before switching. */
	prefetchEntity: (
		postType: string | null | undefined,
		postId: string | number | null | undefined
	) => Promise<unknown>;
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
}: UseOpenTabsCommandsParams): void {
	// Create a stable reference to tab actions
	const tabActions = useMemo(
		(): OpenTabsTabActions => ({
			switchDocument,
			prefetchEntity,
		}),
		[switchDocument, prefetchEntity]
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
