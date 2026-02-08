// @flow

/**
 * Blockera dependencies
 */
import { isSpecialUnit } from '@blockera/controls';

export function letterSpacingFromWPCompatibility({
	attributes,
	insideBlockInspector = true,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
}): Object {
	// Check block-level style (insideBlockInspector) or global style context
	const letterSpacing = insideBlockInspector
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
}: {
	newValue: Object,
	ref?: Object,
	insideBlockInspector?: boolean,
}): Object {
	if ('reset' === ref?.current?.action || newValue === '') {
		return insideBlockInspector
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

	return insideBlockInspector
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
