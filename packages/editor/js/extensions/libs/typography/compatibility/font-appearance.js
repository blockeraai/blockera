// @flow
/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';

export function fontAppearanceFromWPCompatibility({
	attributes,
	runSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
	runSelectedBlockEvent: boolean,
}): Object {
	// Check block-level style (insideBlockInspector) or global style context
	const fontWeight =
		insideBlockInspector && runSelectedBlockEvent
			? attributes?.style?.typography?.fontWeight
			: attributes?.typography?.fontWeight;
	const fontStyle =
		insideBlockInspector && runSelectedBlockEvent
			? attributes?.style?.typography?.fontStyle
			: attributes?.typography?.fontStyle;

	if (
		isEquals(attributes?.blockeraFontAppearance?.value, {
			weight: '',
			style: '',
		}) &&
		(fontWeight !== undefined || fontStyle !== undefined)
	) {
		attributes.blockeraFontAppearance = {
			value: {
				weight: fontWeight ?? '100',
				style: fontStyle ?? 'normal',
			},
		};
	}

	return attributes;
}

export function fontAppearanceToWPCompatibility({
	newValue,
	ref,
	runSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	newValue: Object,
	ref?: Object,
	insideBlockInspector?: boolean,
	runSelectedBlockEvent: boolean,
}): Object {
	if (
		isEquals(newValue, {
			weight: '',
			style: '',
		}) ||
		'reset' === ref?.current?.action
	) {
		return insideBlockInspector && runSelectedBlockEvent
			? {
					style: {
						typography: {
							fontWeight: undefined,
							fontStyle: undefined,
						},
					},
				}
			: {
					typography: {
						fontWeight: undefined,
						fontStyle: undefined,
					},
				};
	}

	return insideBlockInspector && runSelectedBlockEvent
		? {
				style: {
					typography: {
						fontWeight: newValue?.weight ?? '100',
						fontStyle: newValue?.style ?? 'normal',
					},
				},
			}
		: {
				typography: {
					fontWeight: newValue?.weight ?? '100',
					fontStyle: newValue?.style ?? 'normal',
				},
			};
}
