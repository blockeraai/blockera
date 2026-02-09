// @flow

/**
 * Blockera dependencies
 */
import { isSpecialUnit } from '@blockera/controls';

export function letterSpacingFromWPCompatibility({
	attributes,
	insideBlockInspector = true,
	runSelectedBlockEvent,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
	runSelectedBlockEvent: boolean,
}): Object {
	// Check block-level style (insideBlockInspector) or global style context
	const letterSpacing =
		insideBlockInspector && runSelectedBlockEvent
			? attributes?.style?.typography?.letterSpacing
			: attributes?.typography?.letterSpacing;

	if (
		attributes?.blockeraLetterSpacing?.value === '' &&
		letterSpacing !== undefined
	) {
		attributes.blockeraLetterSpacing = {
			value: letterSpacing,
		};
	}

	return attributes;
}

export function letterSpacingToWPCompatibility({
	newValue,
	ref,
	insideBlockInspector = true,
	runSelectedBlockEvent,
}: {
	newValue: Object,
	ref?: Object,
	insideBlockInspector?: boolean,
	runSelectedBlockEvent: boolean,
}): Object {
	if ('reset' === ref?.current?.action || newValue === '') {
		return insideBlockInspector && runSelectedBlockEvent
			? {
					style: {
						typography: {
							letterSpacing: undefined,
						},
					},
				}
			: {
					typography: {
						letterSpacing: undefined,
					},
				};
	}

	// Advanced css functions and units not supported by core.
	if (isSpecialUnit(newValue)) {
		newValue = undefined;
	}

	return insideBlockInspector && runSelectedBlockEvent
		? {
				style: {
					typography: {
						letterSpacing: newValue,
					},
				},
			}
		: {
				typography: {
					letterSpacing: newValue,
				},
			};
}
