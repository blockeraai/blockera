/**
 * External dependencies
 */
import { createContext, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { TaxonomyNameSource } from '../components/preset-taxonomy/parse-preset-name-taxonomy';

export type PresetVariationsContextValue<TItem = unknown> = {
	origin: string;
	/** Full preset list for the active origin (e.g. main presets plus shade rows). */
	fullItems: TItem[];
	setFullItems: (next: TItem[]) => void;
	/** Base theme palette rows — resolves `/` taxonomy names when user styles keep flat labels. */
	taxonomyNameSource?: TaxonomyNameSource;
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

export function usePresetVariationsStorageOptional<
	TItem = unknown,
>(): PresetVariationsContextValue<TItem> | null {
	return useContext(
		PresetVariationsContext
	) as PresetVariationsContextValue<TItem> | null;
}
