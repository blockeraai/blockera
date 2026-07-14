// @flow

/**
 * Blockera dependencies
 */
import { isValid } from '@blockera/controls';
import { normalizeCssLengthValue } from '@blockera/utils';
import {
	getLineHeightVAFromVarString,
	getLineHeightVAStringFromId,
} from '@blockera/data';

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
}): Object {
	if (attributes?.blockeraLineHeight?.value === '') {
		const lineHeight = runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? attributes?.style?.typography?.lineHeight
			: attributes?.typography?.lineHeight;

		if (lineHeight) {
			const lineHeightVar = getLineHeightVAFromVarString(lineHeight);

			if (
				lineHeightVar &&
				typeof lineHeightVar === 'object' &&
				lineHeightVar.isValueAddon
			) {
				attributes.blockeraLineHeight = {
					value: lineHeightVar,
				};

				return attributes;
			}

			attributes.blockeraLineHeight = {
				value: normalizeCssLengthValue(lineHeight, ''),
			};

			return attributes;
		}
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

	if (isValid(newValue)) {
		const lineHeightPreset = getLineHeightVAStringFromId(
			newValue?.settings?.id
		);

		return runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? {
					style: {
						typography: {
							lineHeight: lineHeightPreset,
						},
					},
				}
			: {
					typography: {
						lineHeight: lineHeightPreset,
					},
				};
	}

	// Advanced css functions and units not supported by core.
	if ('string' === typeof newValue && newValue.endsWith('func')) {
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
