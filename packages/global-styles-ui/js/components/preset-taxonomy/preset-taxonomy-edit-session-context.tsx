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

type PresetTaxonomyEditSessionContextValue = {
	beginEditSession: (slug: string) => void;
	endEditSession: (slug: string) => void;
	registerFlush: (slug: string, fn: FlushFn) => void;
	unregisterFlush: (slug: string) => void;
	flushSession: (slug: string) => void;
	isSessionOpen: (slug: string) => boolean;
	/** Ref-count of open taxonomy preset popovers — used to freeze tree layout while editing. */
	activeSessionCount: number;
};

const PresetTaxonomyEditSessionContext =
	createContext<PresetTaxonomyEditSessionContextValue | null>(null);

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

	const value = useMemo(
		(): PresetTaxonomyEditSessionContextValue => ({
			beginEditSession,
			endEditSession,
			registerFlush,
			unregisterFlush,
			flushSession,
			isSessionOpen,
			activeSessionCount,
		}),
		[
			activeSessionCount,
			beginEditSession,
			endEditSession,
			flushSession,
			isSessionOpen,
			registerFlush,
			unregisterFlush,
		]
	);

	return (
		<PresetTaxonomyEditSessionContext.Provider value={value}>
			{children}
		</PresetTaxonomyEditSessionContext.Provider>
	);
}

export function usePresetTaxonomyEditSession(): PresetTaxonomyEditSessionContextValue {
	const ctx = useContext(PresetTaxonomyEditSessionContext);
	if (!ctx) {
		throw new Error(
			'usePresetTaxonomyEditSession must be used within PresetTaxonomyEditSessionProvider'
		);
	}
	return ctx;
}

/** Optional hook — returns null outside taxonomy edit session provider. */
export function usePresetTaxonomyEditSessionOptional(): PresetTaxonomyEditSessionContextValue | null {
	return useContext(PresetTaxonomyEditSessionContext);
}
