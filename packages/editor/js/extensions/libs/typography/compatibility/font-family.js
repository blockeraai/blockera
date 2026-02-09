// @flow

/**
 * Internal dependencies
 */
import { runInsideBlockInspector } from '../../utils';

export function fontFamilyFromWPCompatibility({
	attributes,
	insideBlockInspector = true,
	editorSelectedBlockEvent,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
}): Object | false {
	// Check block-level style (insideBlockInspector) or global style context
	const fontFamily = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? attributes?.fontFamily
		: attributes?.typography?.fontFamily;

	if (
		attributes?.blockeraFontFamily?.value === '' &&
		fontFamily !== undefined
	) {
		attributes.blockeraFontFamily = {
			value: fontFamily,
		};
	}

	return attributes;
}

export function fontFamilyToWPCompatibility({
	newValue,
	ref,
	insideBlockInspector = true,
	editorSelectedBlockEvent,
}: {
	newValue: Object,
	ref?: Object,
	insideBlockInspector?: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
}): Object {
	if ('reset' === ref?.current?.action || newValue === '') {
		return runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? {
					fontFamily: undefined,
				}
			: {
					typography: {
						fontFamily: undefined,
					},
				};
	}

	return runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? {
				fontFamily: newValue,
			}
		: {
				typography: {
					fontFamily: newValue,
				},
			};
}
