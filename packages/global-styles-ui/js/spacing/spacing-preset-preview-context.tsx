/**
 * External dependencies
 */
import type { ReactNode } from 'react';
import { createContext, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { SpacingSizePresetUsage } from './spacing-preset-preview-usage';

const SpacingPresetPreviewUsageContext = createContext<
	SpacingSizePresetUsage | undefined
>(undefined);

export function SpacingPresetPreviewUsageProvider({
	value,
	children,
}: {
	value: SpacingSizePresetUsage | undefined;
	children: ReactNode;
}) {
	return (
		<SpacingPresetPreviewUsageContext.Provider value={value}>
			{children}
		</SpacingPresetPreviewUsageContext.Provider>
	);
}

/**
 * Optional consumer-driven preview mode when spacing preset UI is embedded outside the variable picker.
 */
export function useSpacingPresetPreviewUsageFromProvider():
	| SpacingSizePresetUsage
	| undefined {
	return useContext(SpacingPresetPreviewUsageContext);
}
