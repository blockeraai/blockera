// @flow

/**
 * Internal dependencies
 */
import { runInsideBlockInspector } from '../../utils';

function getBlockLevelTextAlign(
	attributes: Object,
	isParagraph: boolean
): ?string {
	if (isParagraph) {
		return attributes.align;
	}

	return attributes?.style?.typography?.textAlign ?? attributes.textAlign;
}

function getBlockLevelTextAlignPatch(
	isParagraph: boolean,
	textAlign: ?string
): Object {
	if (isParagraph) {
		return { align: textAlign };
	}

	return {
		style: {
			typography: {
				textAlign,
			},
		},
	};
}

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
	const isParagraph = blockId === 'core/paragraph';

	// Paragraph keeps legacy `align`; other blocks use style.typography.textAlign (WP 7+).
	const textAlign = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? getBlockLevelTextAlign(attributes, isParagraph)
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
	const isParagraph = blockId === 'core/paragraph';
	const insideInspector = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	);

	if (
		newValue === '' ||
		'reset' === ref?.current?.action ||
		['left', 'center', 'right'].indexOf(newValue) === -1
	) {
		return insideInspector
			? getBlockLevelTextAlignPatch(isParagraph, undefined)
			: {
					typography: {
						textAlign: undefined,
					},
				};
	}

	return insideInspector
		? getBlockLevelTextAlignPatch(isParagraph, newValue)
		: {
				typography: {
					textAlign: newValue,
				},
			};
}
