// @flow

/**
 * Internal dependencies
 */
import { runInsideBlockInspector } from '../../utils';

export function textAlignFromWPCompatibility({
	attributes,
	blockId,
	editorSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	attributes: Object,
	blockId: string,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	insideBlockInspector?: boolean,
}): Object {
	let wpAlignAttrId = 'textAlign';
	if (blockId === 'core/paragraph') {
		wpAlignAttrId = 'align';
	}

	// Check block-level style (insideBlockInspector) or global style context
	const textAlign = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? attributes[wpAlignAttrId]
		: attributes?.typography?.textAlign;

	// For detecting the text align changer from block editor controls
	// we have to validate and make sure the value is correct and should be updated
	if (
		textAlign !== undefined &&
		attributes?.blockeraTextAlign?.value !== textAlign
	) {
		if (textAlign !== undefined) {
			attributes.blockeraTextAlign = {
				value: textAlign,
			};
		}
	}

	return attributes;
}

export function textAlignToWPCompatibility({
	newValue,
	ref,
	blockId,
	editorSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	newValue: Object,
	ref?: Object,
	blockId: string,
	insideBlockInspector?: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
}): Object {
	// use correct id for WP data attribute
	let wpAlignAttrId = 'textAlign';
	if (blockId === 'core/paragraph') {
		wpAlignAttrId = 'align';
	}

	if (
		newValue === '' ||
		'reset' === ref?.current?.action ||
		['left', 'center', 'right'].indexOf(newValue) === -1
	) {
		return runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? {
					[wpAlignAttrId]: undefined,
				}
			: {
					typography: {
						textAlign: undefined,
					},
				};
	}

	return runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? {
				[wpAlignAttrId]: newValue,
			}
		: {
				typography: {
					textAlign: newValue,
				},
			};
}
