// @flow

/**
 * Internal dependencies
 */
import { runInsideBlockInspector } from '../../utils';

export function lineHeightFromWPCompatibility({
	attributes,
	insideBlockInspector = true,
	editorSelectedBlockEvent,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
}): Object | false {
	// Check block-level style (insideBlockInspector) or global style context
	const lineHeight = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? attributes?.style?.typography?.lineHeight
		: attributes?.typography?.lineHeight;

	if (
		attributes?.blockeraLineHeight?.value === '' &&
		lineHeight !== undefined
	) {
		attributes.blockeraLineHeight = {
			value: lineHeight,
		};
	}

	return attributes;
}

export function lineHeightToWPCompatibility({
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
					style: {
						typography: {
							lineHeight: undefined,
						},
					},
				}
			: {
					typography: {
						lineHeight: undefined,
					},
				};
	}

	// Advanced css functions and units not supported by core.
	if (newValue.endsWith('func')) {
		newValue = undefined;
	}

	return runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? {
				style: {
					typography: {
						lineHeight: newValue,
					},
				},
			}
		: {
				typography: {
					lineHeight: newValue,
				},
			};
}
