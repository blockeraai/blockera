/**
 * External dependencies
 */
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from '@wordpress/element';

type FlushFn = () => void;

type PresetTaxonomyEditSessionActions = {
	beginEditSession: (slug: string) => void;
	endEditSession: (slug: string) => void;
	registerFlush: (slug: string, fn: FlushFn) => void;
	unregisterFlush: (slug: string) => void;
	flushSession: (slug: string) => void;
	isSessionOpen: (slug: string) => boolean;
};

export type PresetTaxonomyEditSessionContextValue =
	PresetTaxonomyEditSessionActions & {
		/** Ref-count of open taxonomy preset popovers — used to freeze tree layout while editing. */
		activeSessionCount: number;
	};

const PresetTaxonomyEditSessionActionsContext =
	createContext<PresetTaxonomyEditSessionActions | null>(null);

const PresetTaxonomyEditSessionCountContext = createContext<number>(0);

export function PresetTaxonomyEditSessionProvider({
	children,
}: {
	children: ReactNode;
}) {
	const openSessionsRef = useRef(new Set<string>());
	const flushMapRef = useRef(new Map<string, FlushFn>());
	const [activeSessionCount, setActiveSessionCount] = useState(0);

	const syncSessionCount = useCallback(() => {
		setActiveSessionCount(openSessionsRef.current.size);
	}, []);

	const beginEditSession = useCallback(
		(slug: string) => {
			const key = String(slug);
			if (key === '' || openSessionsRef.current.has(key)) {
				return;
			}
			openSessionsRef.current.add(key);
			syncSessionCount();
		},
		[syncSessionCount]
	);

	const endEditSession = useCallback(
		(slug: string) => {
			const key = String(slug);
			if (!openSessionsRef.current.delete(key)) {
				return;
			}
			syncSessionCount();
		},
		[syncSessionCount]
	);

	const registerFlush = useCallback((slug: string, fn: FlushFn) => {
		flushMapRef.current.set(String(slug), fn);
	}, []);

	const unregisterFlush = useCallback((slug: string) => {
		flushMapRef.current.delete(String(slug));
	}, []);

	const flushSession = useCallback((slug: string) => {
		const fn = flushMapRef.current.get(String(slug));
		fn?.();
	}, []);

	const isSessionOpen = useCallback((slug: string) => {
		return openSessionsRef.current.has(String(slug));
	}, []);

	const actions = useMemo(
		(): PresetTaxonomyEditSessionActions => ({
			beginEditSession,
			endEditSession,
			registerFlush,
			unregisterFlush,
			flushSession,
			isSessionOpen,
		}),
		[
			beginEditSession,
			endEditSession,
			flushSession,
			isSessionOpen,
			registerFlush,
			unregisterFlush,
		]
	);

	return (
		<PresetTaxonomyEditSessionActionsContext.Provider value={actions}>
			<PresetTaxonomyEditSessionCountContext.Provider
				value={activeSessionCount}
			>
				{children}
			</PresetTaxonomyEditSessionCountContext.Provider>
		</PresetTaxonomyEditSessionActionsContext.Provider>
	);
}

/** Stable session actions — identity does not change when activeSessionCount updates. */
export function usePresetTaxonomyEditSessionActions(): PresetTaxonomyEditSessionActions {
	const ctx = useContext(PresetTaxonomyEditSessionActionsContext);
	if (!ctx) {
		throw new Error(
			'usePresetTaxonomyEditSessionActions must be used within PresetTaxonomyEditSessionProvider'
		);
	}
	return ctx;
}

export function usePresetTaxonomyEditSessionActionsOptional(): PresetTaxonomyEditSessionActions | null {
	return useContext(PresetTaxonomyEditSessionActionsContext);
}

export function usePresetTaxonomyEditSessionActiveCount(): number {
	return useContext(PresetTaxonomyEditSessionCountContext);
}

export function usePresetTaxonomyEditSession(): PresetTaxonomyEditSessionContextValue {
	const actions = usePresetTaxonomyEditSessionActions();
	const activeSessionCount = usePresetTaxonomyEditSessionActiveCount();

	return useMemo(
		(): PresetTaxonomyEditSessionContextValue => ({
			...actions,
			activeSessionCount,
		}),
		[actions, activeSessionCount]
	);
}

/** Optional hook — returns null outside taxonomy edit session provider. */
export function usePresetTaxonomyEditSessionOptional(): PresetTaxonomyEditSessionContextValue | null {
	const actions = usePresetTaxonomyEditSessionActionsOptional();
	const activeSessionCount = usePresetTaxonomyEditSessionActiveCount();

	return useMemo(() => {
		if (!actions) {
			return null;
		}

		return {
			...actions,
			activeSessionCount,
		};
	}, [actions, activeSessionCount]);
}
