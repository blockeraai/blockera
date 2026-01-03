/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Breakpoint information from Blockera editor store.
 */
interface BreakpointInfo {
	type?: string;
	base?: boolean;
	settings?: {
		max?: string;
	};
}

/**
 * Return type for useBreakpoint hook.
 */
export interface UseBreakpointReturn {
	/** The current breakpoint identifier. */
	breakpointId: string;
	/** The breakpoint type (e.g., 'desktop', 'tablet', 'mobile', or custom). */
	breakpointType: string;
	/** The max-width value for the breakpoint, or '100%' for base/desktop. */
	maxWidth: string;
	/** Whether this is the base (desktop) breakpoint. */
	isBase: boolean;
}

/**
 * Blockera extensions store selector type.
 */
interface BlockeraExtensionsSelect {
	getExtensionCurrentBlockStateBreakpoint: () => string;
}

/**
 * Blockera editor store selector type.
 */
interface BlockeraEditorSelect {
	getBreakpoints: () => Record<string, BreakpointInfo>;
}

/**
 * Hook to subscribe to the current breakpoint from Blockera's data stores.
 * Automatically re-renders the component when the breakpoint changes in the editor.
 *
 * @returns The current breakpoint data.
 */
export function useBreakpoint(): UseBreakpointReturn {
	return useSelect((select) => {
		const extensionsSelect = select('blockera/extensions') as BlockeraExtensionsSelect | undefined;
		const editorSelect = select('blockera/editor') as BlockeraEditorSelect | undefined;

		const breakpointId = extensionsSelect?.getExtensionCurrentBlockStateBreakpoint?.() ?? 'desktop';
		const breakpoints = editorSelect?.getBreakpoints?.() ?? {};
		const breakpointInfo: BreakpointInfo = breakpoints[breakpointId] ?? {};

		// Determine if this is the base breakpoint (desktop)
		const isBase = breakpointInfo.base === true;

		// Get the max-width from settings, fallback to '100%' for base/desktop or if not defined
		const maxWidth =
			!isBase && breakpointInfo.settings?.max
				? breakpointInfo.settings.max
				: '100%';

		return {
			breakpointId,
			breakpointType: breakpointInfo.type ?? 'desktop',
			maxWidth,
			isBase,
		};
	}, []);
}

