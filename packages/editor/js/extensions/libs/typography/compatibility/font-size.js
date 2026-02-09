// @flow

/**
 * Blockera dependencies
 */
import { isValid } from '@blockera/controls';
import { getFontSizeVAFromVarString } from '@blockera/data';

export function fontSizeFromWPCompatibility({
	attributes,
	runSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
	runSelectedBlockEvent: boolean,
}): Object {
	if (attributes?.blockeraFontSize?.value === '') {
		// fontSize attribute in root always is variable
		// medium → var(--wp--preset--font-size--medium)
		// it should be changed to a Value Addon (variable)
		if (attributes?.fontSize || attributes?.typography?.fontSize) {
			const fontSizeVar = getFontSizeVAFromVarString(
				insideBlockInspector && runSelectedBlockEvent
					? `var:preset|font-size|${attributes?.fontSize}`
					: attributes?.typography?.fontSize
			);

			if (fontSizeVar) {
				attributes.blockeraFontSize = {
					value: fontSizeVar,
				};

				return attributes;
			}
		}

		// Check block-level style (insideBlockInspector) or global style context
		const fontSize =
			insideBlockInspector && runSelectedBlockEvent
				? attributes?.style?.typography?.fontSize
				: attributes?.typography?.fontSize;

		if (fontSize) {
			attributes.blockeraFontSize = {
				value: fontSize,
			};

			return attributes;
		}
	}

	return attributes;
}

export function fontSizeToWPCompatibility({
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
					fontSize: undefined,
					style: {
						typography: {
							fontSize: undefined,
						},
					},
				}
			: {
					typography: {
						fontSize: undefined,
					},
				};
	}

	// is valid font-size variable
	if (isValid(newValue)) {
		return insideBlockInspector && runSelectedBlockEvent
			? {
					fontSize: newValue?.settings?.id,
					style: {
						typography: {
							fontSize: undefined,
						},
					},
				}
			: {
					typography: {
						fontSize: undefined,
					},
				};
	}

	// Advanced css functions not supported by core.
	if (newValue.endsWith('func')) {
		newValue = undefined;
	}

	return insideBlockInspector && runSelectedBlockEvent
		? {
				fontSize: undefined,
				style: {
					typography: {
						fontSize: newValue,
					},
				},
			}
		: {
				typography: {
					fontSize: newValue,
				},
			};
}
