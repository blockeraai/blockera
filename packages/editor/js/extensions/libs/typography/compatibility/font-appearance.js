// @flow
/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { runInsideBlockInspector } from '../../utils';

export function fontAppearanceFromWPCompatibility({
	attributes,
	editorSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
}): Object {
	// Check block-level style (insideBlockInspector) or global style context
	const fontWeight = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? attributes?.style?.typography?.fontWeight
		: attributes?.typography?.fontWeight;
	const fontStyle = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
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
	editorSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	newValue: Object,
	ref?: Object,
	insideBlockInspector?: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
}): Object {
	if (
		isEquals(newValue, {
			weight: '',
			style: '',
		}) ||
		'reset' === ref?.current?.action
	) {
		return runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
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

	return runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
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
