// @flow
/**
 * External dependencies
 */
import { createContext, useContext } from '@wordpress/element';

/**
 * DOM mount target for the preset variables summary row when embedded in the
 * variable picker. Keeps the summary row directly under search regardless of
 * how many variable-type sections render below.
 */
const VarPickerSummarySlotContext: React$Context<?HTMLElement> =
	createContext(null);

export function VarPickerSummarySlotProvider({
	slot,
	children,
}: {
	slot: ?HTMLElement,
	children: React$Node,
}): React$Node {
	return (
		<VarPickerSummarySlotContext.Provider value={slot}>
			{children}
		</VarPickerSummarySlotContext.Provider>
	);
}

export function useVarPickerSummarySlot(): ?HTMLElement {
	return useContext(VarPickerSummarySlotContext);
}
