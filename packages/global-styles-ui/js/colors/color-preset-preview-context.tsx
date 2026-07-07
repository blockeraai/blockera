/**
 * External dependencies
 */
import type { ReactNode } from 'react';
import { createContext, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { ColorPresetPreviewUsage } from './color-preset-preview-usage';

const ColorPresetPreviewUsageContext = createContext<
	ColorPresetPreviewUsage | undefined
>(undefined);

export function ColorPresetPreviewUsageProvider({
	value,
	children,
}: {
	value: ColorPresetPreviewUsage | undefined;
	children: ReactNode;
}) {
	return (
		<ColorPresetPreviewUsageContext.Provider value={value}>
			{children}
		</ColorPresetPreviewUsageContext.Provider>
	);
}

export function useColorPresetPreviewUsageFromProvider():
	ColorPresetPreviewUsage | undefined {
	return useContext(ColorPresetPreviewUsageContext);
}
