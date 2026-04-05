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

export function letterSpacingFromWPCompatibility({
	attributes,
	insideBlockInspector = true,
	editorSelectedBlockEvent,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
}): Object {
	// Check block-level style (insideBlockInspector) or global style context
	const letterSpacing = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? attributes?.style?.typography?.letterSpacing
		: attributes?.typography?.letterSpacing;

	if (
		attributes?.blockeraLetterSpacing?.value === '' &&
		letterSpacing !== undefined
	) {
		attributes.blockeraLetterSpacing = {
			value: normalizeCssLengthValue(letterSpacing),
		};
	}

	return attributes;
}

export function letterSpacingToWPCompatibility({
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

	return runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
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
