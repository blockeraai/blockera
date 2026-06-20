// @flow
/**
 * External dependencies
 */
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from '@wordpress/element';

export const PRESET_VARIABLES_VIEW_MODE_STORAGE_KEY =
	'blockera-variables-view-mode';

export const PRESET_VARIABLES_VIEW_MODE_CHANGE_EVENT =
	'blockera-variables-view-mode-change';

export type PresetVariablesViewMode = 'grouped' | 'list';

const DEFAULT_VIEW_MODE: PresetVariablesViewMode = 'grouped';

function isValidViewMode(value: mixed): boolean {
	return value === 'grouped' || value === 'list';
}

export function loadPresetVariablesViewMode(): PresetVariablesViewMode {
	try {
		const stored = localStorage.getItem(
			PRESET_VARIABLES_VIEW_MODE_STORAGE_KEY
		);
		if (isValidViewMode(stored)) {
			return stored;
		}
	} catch {
		// localStorage may be disabled.
	}
	return DEFAULT_VIEW_MODE;
}

export function savePresetVariablesViewMode(
	mode: PresetVariablesViewMode
): void {
	try {
		localStorage.setItem(PRESET_VARIABLES_VIEW_MODE_STORAGE_KEY, mode);
		window.dispatchEvent(
			new CustomEvent(PRESET_VARIABLES_VIEW_MODE_CHANGE_EVENT, {
				detail: { mode },
			})
		);
	} catch {
		// localStorage may be full or disabled.
	}
}

type PresetVariablesViewModeContextValue = {
	viewMode: PresetVariablesViewMode,
	setViewMode: (mode: PresetVariablesViewMode) => void,
};

const PresetVariablesViewModeContext: React$Context<PresetVariablesViewModeContextValue | null> =
	createContext(null);

export function PresetVariablesViewModeProvider({
	children,
}: {
	children: React$Node,
}): React$Node {
	const [viewMode, setViewModeState] = useState<PresetVariablesViewMode>(
		loadPresetVariablesViewMode
	);

	useEffect(() => {
		const handleChange = (event: Event) => {
			const detail = (event: CustomEvent<{ mode?: mixed }>).detail;
			if (isValidViewMode(detail?.mode)) {
				setViewModeState(detail.mode);
			}
		};

		window.addEventListener(
			PRESET_VARIABLES_VIEW_MODE_CHANGE_EVENT,
			handleChange
		);
		return () => {
			window.removeEventListener(
				PRESET_VARIABLES_VIEW_MODE_CHANGE_EVENT,
				handleChange
			);
		};
	}, []);

	const setViewMode = useCallback((mode: PresetVariablesViewMode) => {
		savePresetVariablesViewMode(mode);
		setViewModeState(mode);
	}, []);

	const value = useMemo(
		() => ({
			viewMode,
			setViewMode,
		}),
		[viewMode, setViewMode]
	);

	return (
		<PresetVariablesViewModeContext.Provider value={value}>
			{children}
		</PresetVariablesViewModeContext.Provider>
	);
}

export function usePresetVariablesViewMode(): PresetVariablesViewModeContextValue {
	const context = useContext(PresetVariablesViewModeContext);
	const [viewMode, setViewModeState] = useState<PresetVariablesViewMode>(
		loadPresetVariablesViewMode
	);

	useEffect(() => {
		if (context) {
			return undefined;
		}

		const handleChange = (event: Event) => {
			const detail = (event: CustomEvent<{ mode?: mixed }>).detail;
			if (isValidViewMode(detail?.mode)) {
				setViewModeState(detail.mode);
			}
		};

		window.addEventListener(
			PRESET_VARIABLES_VIEW_MODE_CHANGE_EVENT,
			handleChange
		);
		return () => {
			window.removeEventListener(
				PRESET_VARIABLES_VIEW_MODE_CHANGE_EVENT,
				handleChange
			);
		};
	}, [context]);

	const setViewMode = useCallback((mode: PresetVariablesViewMode) => {
		savePresetVariablesViewMode(mode);
		setViewModeState(mode);
	}, []);

	if (context) {
		return context;
	}

	return { viewMode, setViewMode };
}
