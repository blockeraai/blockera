// @flow

/**
 * Internal dependencies
 */
import { runInsideBlockInspector } from '../../utils';

export function textDecorationFromWPCompatibility({
	attributes,
	editorSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	attributes: Object,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	insideBlockInspector?: boolean,
}): Object {
	// Check block-level style (insideBlockInspector) or global style context
	const textDecoration = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? attributes?.style?.typography?.textDecoration
		: attributes?.typography?.textDecoration;

	if (
		attributes?.blockeraTextDecoration?.value === '' &&
		textDecoration !== undefined
	) {
		attributes.blockeraTextDecoration = {
			value: textDecoration,
		};
	}

	return attributes;
}

export function textDecorationToWPCompatibility({
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
	if (
		newValue === '' ||
		'reset' === ref?.current?.action ||
		['underline', 'line-through', 'overline'].indexOf(newValue) === -1
	) {
		return runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? {
					style: {
						typography: {
							textDecoration: undefined,
						},
					},
				}
			: {
					typography: {
						textDecoration: undefined,
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
						textDecoration: newValue,
					},
				},
			}
		: {
				typography: {
					textDecoration: newValue,
				},
			};
}
