/**
 * External dependencies
 */
import type { ReactNode } from 'react';

/**
 * Blockera dependencies
 */
import { BaseControl, ControlContextProvider } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { PresetStateContainer } from '../preset-state-container';
import { TaxonomyRepeaterBridgeInner } from '../preset-taxonomy-ui';
import '../preset-taxonomy-ui/style.scss';

export type PresetTaxonomySectionRepeaterContextValue = {
	name: string;
	value: unknown;
};

export type PresetTaxonomySectionProps = {
	bridgeControlId: string;
	repeaterContextValue: PresetTaxonomySectionRepeaterContextValue;
	defaultRepeaterItemShape: Record<string, unknown>;
	cleanRepeaterForPersist: (raw: unknown) => Record<string, unknown>;
	handleRepeaterRootChange: (newValue: unknown) => void;
	children: ReactNode;
};

/**
 * Shared taxonomy tree shell: repeater context, bridge inner, and preset fields subtree.
 * Persist/conversion logic stays with each preset type (e.g. color bridge).
 */
export function PresetTaxonomySection({
	bridgeControlId,
	repeaterContextValue,
	defaultRepeaterItemShape,
	cleanRepeaterForPersist,
	handleRepeaterRootChange,
	children,
}: PresetTaxonomySectionProps) {
	return (
		<PresetStateContainer activeColor="#1ca120">
			<div className="blockera-preset-taxonomy-tree">
				<ControlContextProvider
					value={repeaterContextValue}
					storeName={'blockera/controls/repeater'}
				>
					<BaseControl
						controlName={bridgeControlId}
						columns="columns-1"
					>
						<TaxonomyRepeaterBridgeInner
							controlId={bridgeControlId}
							defaultRepeaterItemValue={defaultRepeaterItemShape}
							valueCleanup={cleanRepeaterForPersist}
							handleRepeaterRootChange={handleRepeaterRootChange}
						>
							{children}
						</TaxonomyRepeaterBridgeInner>
					</BaseControl>
				</ControlContextProvider>
			</div>
		</PresetStateContainer>
	);
}
