/**
 * WordPress dependencies
 */
import { useEffect, useRef, useCallback } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as commandsStore } from '@wordpress/commands';

/**
 * Internal dependencies
 */
import { openOrFocusTab } from '../../tabs/utils/openOrFocusTab';
import {
	createWrappedHook,
	NAVIGATION_LOADER_NAMES,
} from '../utils/wrapCommandLoaderHook';
import type {
	CommandLoaderHook,
	TabActions,
} from '../utils/wrapCommandLoaderHook';
import { isEditorPage } from '../../utils/isEditorPage';
import type { Tab } from '../../tabs/types';

// Max time to wait for loaders to register (ms)
const LOADER_WAIT_TIMEOUT = 5000;
const LOADER_CHECK_INTERVAL = 500;

/**
 * Command loader object from WordPress commands store.
 */
interface CommandLoader {
	name: string;
	hook: CommandLoaderHook;
	context?: string;
}

/**
 * WordPress commands store selector type.
 */
interface CommandsStoreSelect {
	getCommandLoaders: (includeContext: boolean) => CommandLoader[];
}

/**
 * Parameters for useCommandBarIntegration hook.
 */
export interface UseCommandBarIntegrationParams {
	/** Function to add a tab. */
	addTab: (
		postType: string,
		postId: string | number,
		title?: string | null,
		slug?: string | null,
		status?: string | null
	) => Promise<void>;
	/** Function to switch documents. */
	switchDocument: (postType: string, postId: string | number) => void;
	/** Function to prefetch entity before switching. */
	prefetchEntity: (
		postType: string | null | undefined,
		postId: string | number | null | undefined
	) => Promise<unknown>;
	/** Current tabs array. */
	tabs: Tab[];
}

/**
 * Hook to intercept command bar entity navigation commands and redirect them to Blockera Tabs
 *
 * Wraps Gutenberg's navigation command loaders to open entities in tabs instead of navigating.
 *
 * @param params - Parameters object
 */
export function useCommandBarIntegration({
	addTab,
	switchDocument,
	prefetchEntity,
	tabs,
}: UseCommandBarIntegrationParams): void {
	const { registerCommandLoader, unregisterCommandLoader } = useDispatch(
		commandsStore
	) as {
		registerCommandLoader: (loader: CommandLoader) => void;
		unregisterCommandLoader: (name: string) => void;
	};

	// Track wrapped loaders and their original hooks
	const wrappedLoadersRef = useRef(new Set<string>());
	const originalHooksRef = useRef(new Map<string, CommandLoaderHook>());

	// Stable reference for tab actions
	const tabActionsRef = useRef<TabActions | null>(null);
	tabActionsRef.current = {
		openOrFocusTab: (params) =>
			openOrFocusTab({
				...params,
				addTab,
				switchDocument,
				prefetchEntity,
			}),
	};

	// Wrap a single loader
	const wrapLoader = useCallback(
		(loader: CommandLoader): boolean => {
			const { name: loaderName, hook: originalHook, context } = loader;

			if (!originalHook || wrappedLoadersRef.current.has(loaderName)) {
				return false;
			}

			originalHooksRef.current.set(loaderName, originalHook);
			const wrappedHook = createWrappedHook(
				originalHook,
				tabActionsRef.current as TabActions,
				tabs
			);

			unregisterCommandLoader(loaderName);
			registerCommandLoader({
				name: loaderName,
				hook: wrappedHook,
				context,
			});
			wrappedLoadersRef.current.add(loaderName);

			return true;
		},
		[tabs, registerCommandLoader, unregisterCommandLoader]
	);

	// Find and wrap all navigation loaders
	const wrapNavigationLoaders = useCallback((): boolean => {
		const select = (
			window as {
				wp?: {
					data?: { select: (store: string) => CommandsStoreSelect };
				};
			}
		).wp?.data?.select('core/commands');
		if (!select) {
			return false;
		}

		const allLoaders = select.getCommandLoaders(false) ?? [];
		let wrapped = false;

		allLoaders.forEach((loader) => {
			if (NAVIGATION_LOADER_NAMES.includes(loader.name)) {
				if (wrapLoader(loader)) {
					wrapped = true;
				}
			}
		});

		return wrapped;
	}, [wrapLoader]);

	// Effect to wrap loaders after Gutenberg registers them
	useEffect(() => {
		if (!isEditorPage()) {
			return;
		}

		const startTime = Date.now();

		// Initial check after short delay
		const timeoutId = setTimeout(wrapNavigationLoaders, 300);

		// Periodic checks for late registrations
		const intervalId = setInterval(() => {
			wrapNavigationLoaders();

			// Stop if all loaders wrapped or timeout reached
			const allWrapped =
				wrappedLoadersRef.current.size >=
				NAVIGATION_LOADER_NAMES.length;
			const timedOut = Date.now() - startTime > LOADER_WAIT_TIMEOUT;

			if (allWrapped || timedOut) {
				clearInterval(intervalId);
			}
		}, LOADER_CHECK_INTERVAL);

		return () => {
			clearTimeout(timeoutId);
			clearInterval(intervalId);
		};
	}, [wrapNavigationLoaders]);

	// Re-wrap when tabs change
	useEffect(() => {
		if (!isEditorPage() || wrappedLoadersRef.current.size === 0) {
			return;
		}

		wrappedLoadersRef.current.forEach((loaderName) => {
			const originalHook = originalHooksRef.current.get(loaderName);
			if (!originalHook) {
				return;
			}

			const wrappedHook = createWrappedHook(
				originalHook,
				tabActionsRef.current as TabActions,
				tabs
			);
			unregisterCommandLoader(loaderName);
			registerCommandLoader({ name: loaderName, hook: wrappedHook });
		});
	}, [tabs, registerCommandLoader, unregisterCommandLoader]);
}
