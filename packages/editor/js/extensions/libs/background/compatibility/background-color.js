// @flow

/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';
import { isValid } from '@blockera/controls';
import { getColorVAFromVarString } from '@blockera/data';

export function backgroundColorFromWPCompatibility({
	attributes,
	blockAttributes,
	insideBlockInspector,
}: {
	attributes: Object,
	blockAttributes: Object,
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
	else if (insideBlockInspector && attributes?.style?.color?.background) {
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
	insideBlockInspector,
}: {
	newValue: Object,
	ref?: Object,
	insideBlockInspector: boolean,
}): Object {
	if ('reset' === ref?.current?.action || newValue === '') {
		return insideBlockInspector
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
		return insideBlockInspector
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

	return insideBlockInspector
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
