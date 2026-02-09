// @flow

/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';
import { isValid } from '@blockera/controls';
import { getColorVAFromVarString } from '@blockera/data';

/**
 * Internal dependencies
 */
import { runInsideBlockInspector } from '../../utils';

export function backgroundColorFromWPCompatibility({
	attributes,
	blockAttributes,
	editorSelectedBlockEvent,
	insideBlockInspector,
}: {
	attributes: Object,
	blockAttributes: Object,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	insideBlockInspector: boolean,
}): Object {
	if (
		!isEquals(
			attributes?.blockeraBackgroundColor,
			blockAttributes.blockeraBackgroundColor.default
		)
	) {
		return attributes;
	}

	// backgroundColor attribute in root always is variable
	// it should be changed to a Value Addon (variable)
	if (attributes?.backgroundColor) {
		attributes.blockeraBackgroundColor = {
			value: getColorVAFromVarString(
				`var:preset|color|${attributes?.backgroundColor}`
			),
		};
	}

	// style.color.background is not variable
	else if (
		runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		) &&
		attributes?.style?.color?.background
	) {
		attributes.blockeraBackgroundColor = {
			value: attributes?.style?.color?.background,
		};
	}
	// color.background is not variable
	else if (!insideBlockInspector && attributes?.color?.background) {
		const bg = attributes?.color?.background;
		attributes.blockeraBackgroundColor = {
			value: bg.startsWith('var') ? getColorVAFromVarString(bg) : bg,
		};
	}

	return attributes;
}

export function backgroundColorToWPCompatibility({
	newValue,
	ref,
	editorSelectedBlockEvent,
	insideBlockInspector,
}: {
	newValue: Object,
	ref?: Object,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	insideBlockInspector: boolean,
}): Object {
	if ('reset' === ref?.current?.action || newValue === '') {
		return runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? {
					backgroundColor: undefined,
					style: {
						color: {
							background: undefined,
						},
					},
				}
			: {
					color: {
						background: undefined,
					},
				};
	}

	// is valid background color variable
	if (isValid(newValue)) {
		return runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? {
					backgroundColor: newValue?.settings?.id,
					style: {
						color: {
							background: undefined,
						},
					},
				}
			: {
					color: {
						background: `var:preset|color|${newValue?.settings?.id}`,
					},
				};
	}

	return runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? {
				backgroundColor: undefined,
				style: {
					color: {
						background: newValue,
					},
				},
			}
		: {
				color: {
					background: newValue,
				},
			};
}
