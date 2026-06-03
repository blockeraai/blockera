// @flow

/**
 * Blockera dependencies
 */
import { isSpecialUnit } from '@blockera/controls';
import { normalizeCssLengthValue } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { runInsideBlockInspector } from '../../utils';

export function textIndentFromWPCompatibility({
	attributes,
	insideBlockInspector = true,
	editorSelectedBlockEvent,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
}): Object {
	// Check block-level style (insideBlockInspector) or global style context
	const textIndent = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? attributes?.style?.typography?.textIndent
		: attributes?.typography?.textIndent;

	if (
		attributes?.blockeraTextIndent?.value === '' &&
		textIndent !== undefined
	) {
		attributes.blockeraTextIndent = {
			value: normalizeCssLengthValue(textIndent),
		};
	}

	return attributes;
}

export function textIndentToWPCompatibility({
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
							textIndent: undefined,
						},
					},
				}
			: {
					typography: {
						textIndent: undefined,
					},
				};
	}

	// Advanced css functions and units not supported by core.
	if (isSpecialUnit(newValue)) {
		newValue = undefined;
	}

	return runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? {
				style: {
					typography: {
						textIndent: newValue,
					},
				},
			}
		: {
				typography: {
					textIndent: newValue,
				},
			};
}
