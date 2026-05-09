/**
 * External dependencies
 */
import { createContext, useContext } from '@wordpress/element';

export type PresetVariationsContextValue<TItem = unknown> = {
	origin: string;
	/** Full preset list for the active origin (e.g. main presets plus shade rows). */
	fullItems: TItem[];
	setFullItems: (next: TItem[]) => void;
};

export const PresetVariationsContext =
	createContext<PresetVariationsContextValue<unknown> | null>(null);

export function usePresetVariationsStorage<
	TItem = unknown,
>(): PresetVariationsContextValue<TItem> {
	const ctx = useContext(PresetVariationsContext);
	if (!ctx) {
		throw new Error(
			'usePresetVariationsStorage must be used within PresetVariationsContext.Provider'
		);
	}
	return ctx as PresetVariationsContextValue<TItem>;
}
