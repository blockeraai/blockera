/**
 * External dependencies
 */
import { createContext, useContext } from '@wordpress/element';
import type { Color } from '@wordpress/global-styles-engine';

export type ColorPaletteVariationsContextValue = {
	origin: string;
	/** Full `color.palette.{origin}` array (main presets + shade presets). */
	fullPalette: Color[];
	setFullPalette: (next: Color[]) => void;
};

export const ColorPaletteVariationsContext =
	createContext<ColorPaletteVariationsContextValue | null>(null);

export function useColorPaletteVariationsStorage(): ColorPaletteVariationsContextValue {
	const ctx = useContext(ColorPaletteVariationsContext);
	if (!ctx) {
		throw new Error(
			'useColorPaletteVariationsStorage must be used within ColorPaletteVariationsContext'
		);
	}
	return ctx;
}
