/**
 * External dependencies
 */
import type { ComponentType, ElementType, ReactNode } from 'react';

/**
 * Blockera dependencies
 */
import { BaseControl, ControlContextProvider } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { PresetStateContainer } from '../preset-state-container';
import type { VariableType } from '../types';
import { TaxonomyRepeaterBridgeInner } from './taxonomy-repeater-bridge-inner';
import './style.scss';

export type PresetTaxonomySectionRepeaterContextValue = {
	name: string;
	value: unknown;
};

export type PresetTaxonomySectionProps = {
	children: ReactNode;
	bridgeControlId: string;
	origin: string;
	repeaterItemHeader: ElementType;
	repeaterContextValue: PresetTaxonomySectionRepeaterContextValue;
	defaultRepeaterItemShape: Record<string, unknown>;
	cleanRepeaterForPersist: (raw: unknown) => Record<string, unknown>;
	handleRepeaterRootChange: (newValue: unknown) => void;
	repeaterItemVariations?: ComponentType<{
		item: VariableType | Record<string, unknown>;
		itemId: string;
	}> | null;
	repeaterItemChildren?: ComponentType<{
		item: VariableType | Record<string, unknown>;
		itemId: string | number;
	}>;
};

/**
 * Shared taxonomy tree shell: repeater context, bridge inner, and preset fields subtree.
 * Persist/conversion logic stays with each preset type (e.g. color bridge).
 */
export function PresetTaxonomySection({
	children,
	bridgeControlId,
	origin,
	repeaterItemHeader,
	repeaterContextValue,
	defaultRepeaterItemShape,
	cleanRepeaterForPersist,
	handleRepeaterRootChange,
	repeaterItemVariations,
	repeaterItemChildren,
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
							origin={origin}
							repeaterItemHeader={repeaterItemHeader}
							defaultRepeaterItemValue={defaultRepeaterItemShape}
							valueCleanup={cleanRepeaterForPersist}
							handleRepeaterRootChange={handleRepeaterRootChange}
							repeaterItemVariations={repeaterItemVariations}
							repeaterItemChildren={repeaterItemChildren}
						>
							{children}
						</TaxonomyRepeaterBridgeInner>
					</BaseControl>
				</ControlContextProvider>
			</div>
		</PresetStateContainer>
	);
}
