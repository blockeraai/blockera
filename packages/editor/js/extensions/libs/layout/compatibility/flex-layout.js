// @flow

/**
 * Blockera dependencies
 */
import { isEquals, mergeObject } from '@blockera/utils';

/** WP `verticalAlignment` toolbar keys → Blockera CSS values. */
export const WP_VERTICAL_TO_CSS: { [string]: string } = {
	top: 'flex-start',
	center: 'center',
	bottom: 'flex-end',
	stretch: 'stretch',
	'space-between': 'space-between',
	'space-around': 'space-around',
};

/** WP `justifyContent` toolbar keys → Blockera CSS values. */
export const WP_JUSTIFY_TO_CSS: { [string]: string } = {
	left: 'flex-start',
	center: 'center',
	right: 'flex-end',
	'space-between': 'space-between',
	stretch: 'stretch',
};

/** Blockera CSS → WP `verticalAlignment` toolbar keys. */
export const CSS_VERTICAL_TO_WP: { [string]: string } = {
	'flex-start': 'top',
	center: 'center',
	'flex-end': 'bottom',
	stretch: 'stretch',
	'space-between': 'space-between',
	'space-around': 'space-around',
};

/** Blockera CSS → WP `justifyContent` toolbar keys. */
export const CSS_JUSTIFY_TO_WP: { [string]: string } = {
	'flex-start': 'left',
	center: 'center',
	'flex-end': 'right',
	'space-between': 'space-between',
	'space-around': 'space-around',
	stretch: 'stretch',
};

export type BlockeraFlexLayoutAxis = 'justifyContent' | 'alignItems';

/** Main-axis property on screen for the horizontal toolbar control. */
export const getHorizontalScreenFlexProperty = (
	direction: string
): BlockeraFlexLayoutAxis =>
	'column' === direction ? 'alignItems' : 'justifyContent';

/** Cross/main-axis property on screen for the vertical toolbar control. */
export const getVerticalScreenFlexProperty = (
	direction: string
): BlockeraFlexLayoutAxis =>
	'column' === direction ? 'justifyContent' : 'alignItems';

const normalizeToolbarCssValue = (value: ?string): ?string => {
	if (!value) {
		return undefined;
	}

	return value;
};

/**
 * Blockera flex layout → toolbar values (Blockera CSS, not core WP keys).
 */
export const blockeraFlexLayoutToToolbarValues = (
	flexLayout: ?Object
): {
	horizontalValue: ?string,
	verticalValue: ?string,
	direction: string,
} => {
	const direction = flexLayout?.direction || 'row';
	const horizontalProp = getHorizontalScreenFlexProperty(direction);
	const verticalProp = getVerticalScreenFlexProperty(direction);

	return {
		direction,
		horizontalValue: normalizeToolbarCssValue(flexLayout?.[horizontalProp]),
		verticalValue: normalizeToolbarCssValue(flexLayout?.[verticalProp]),
	};
};

export const applyHorizontalToolbarToBlockeraFlexLayout = (
	flexLayout: Object,
	cssValue: ?string
): Object => {
	const direction = flexLayout?.direction || 'row';
	const isColumn = 'column' === direction;

	if (isColumn) {
		return {
			...flexLayout,
			alignItems: cssValue ?? '',
		};
	}

	return {
		...flexLayout,
		justifyContent: cssValue ?? '',
	};
};

export const applyVerticalToolbarToBlockeraFlexLayout = (
	flexLayout: Object,
	cssValue: ?string
): Object => {
	const direction = flexLayout?.direction || 'row';
	const isColumn = 'column' === direction;

	if (isColumn) {
		return {
			...flexLayout,
			justifyContent: cssValue ?? '',
		};
	}

	return {
		...flexLayout,
		alignItems: cssValue ?? '',
	};
};

export function alignItemsFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (attributes?.layout?.verticalAlignment === undefined) {
		return attributes;
	}

	// WP `verticalAlignment` is the vertical screen intent. Blockera stores raw
	// CSS props, so in row it lands on `align-items` (cross axis) but in column
	// the vertical axis is the main axis → it must land on `justifyContent`.
	// (Mirrors wp-includes/block-supports/layout.php flex orientation handling.)
	const direction = attributes?.blockeraFlexLayout?.value?.direction || 'row';
	const isColumn = 'column' === direction;

	const mappedValue =
		WP_VERTICAL_TO_CSS[attributes?.layout?.verticalAlignment] ?? '';
	const nextValue = isColumn
		? { justifyContent: mappedValue }
		: { alignItems: mappedValue };

	if (
		'' !==
		attributes?.blockeraFlexLayout?.value?.[
			isColumn ? 'justifyContent' : 'alignItems'
		]
	) {
		return attributes;
	}

	attributes.blockeraFlexLayout = mergeObject(attributes.blockeraFlexLayout, {
		value: nextValue,
	});

	return attributes;
}

export function justifyContentFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (attributes?.layout?.justifyContent === undefined) {
		return attributes;
	}

	// WP `justifyContent` is the horizontal screen intent. Blockera stores raw
	// CSS props, so in row it lands on `justify-content` (main axis) but in
	// column the horizontal axis is the cross axis → it must land on `alignItems`.
	// (Mirrors wp-includes/block-supports/layout.php flex orientation handling.)
	const direction = attributes?.blockeraFlexLayout?.value?.direction || 'row';
	const isColumn = 'column' === direction;

	const mappedValue =
		WP_JUSTIFY_TO_CSS[attributes?.layout?.justifyContent] ?? '';
	const nextValue = isColumn
		? { alignItems: mappedValue }
		: { justifyContent: mappedValue };

	if (
		'' !==
		attributes?.blockeraFlexLayout?.value?.[
			isColumn ? 'alignItems' : 'justifyContent'
		]
	) {
		return attributes;
	}

	attributes.blockeraFlexLayout = mergeObject(attributes.blockeraFlexLayout, {
		value: nextValue,
	});

	return attributes;
}

export function directionFromWPCompatibility({
	attributes,
	blockId,
	activeVariation,
}: {
	attributes: Object,
	blockId: string,
	activeVariation?: string,
}): Object {
	//
	// custom direction compatibility for blocks
	//
	switch (blockId) {
		case 'core/group':
			switch (activeVariation) {
				case 'group-stack':
					attributes.blockeraFlexLayout = mergeObject(
						attributes.blockeraFlexLayout,
						{
							value: {
								direction: 'column',
							},
						}
					);

					return attributes;

				case 'group-row':
					attributes.blockeraFlexLayout = mergeObject(
						attributes.blockeraFlexLayout,
						{
							value: {
								direction: 'row',
							},
						}
					);

					return attributes;
			}
			break;
	}

	if (attributes?.layout?.orientation === undefined) {
		return attributes;
	}

	// left WP value - right Blockera value
	const values = {
		horizontal: 'row',
		vertical: 'column',
	};

	attributes.blockeraFlexLayout = mergeObject(attributes.blockeraFlexLayout, {
		value: {
			direction: values[attributes?.layout?.orientation],
		},
	});

	return attributes;
}

export function flexLayoutToWPCompatibility({
	newValue,
	ref,
	defaultValue,
}: {
	newValue: Object,
	ref?: Object,
	defaultValue: Object,
}): Object {
	if ('reset' === ref?.current?.action || isEquals(newValue, defaultValue)) {
		return {
			layout: {
				type: undefined,
				orientation: undefined,
				verticalAlignment: undefined,
				justifyContent: undefined,
			},
		};
	}

	// Direction items
	// left Blockera value - right WP value
	const directionValues = {
		row: 'horizontal',
		column: 'vertical',
	};

	// Blockera stores raw CSS props (`align-items` / `justify-content`). WP layout
	// fields are screen-oriented (`verticalAlignment` / `justifyContent`). Resolve
	// each screen axis from the raw props per direction so the right value lands on
	// the right WP attribute in both row and column.
	const isColumn = 'column' === newValue?.direction;
	const verticalValue = isColumn
		? newValue?.justifyContent
		: newValue?.alignItems;
	const horizontalValue = isColumn
		? newValue?.alignItems
		: newValue?.justifyContent;

	const finalLayout: {
		orientation?: string,
		verticalAlignment?: string,
		justifyContent?: string,
		type?: string,
	} = {
		orientation: directionValues[newValue?.direction] ?? undefined,
		verticalAlignment: CSS_VERTICAL_TO_WP[verticalValue] ?? undefined,
		justifyContent: CSS_JUSTIFY_TO_WP[horizontalValue] ?? undefined,
	};

	if (
		finalLayout.orientation ||
		finalLayout.verticalAlignment ||
		finalLayout.justifyContent
	) {
		finalLayout.type = 'flex';
	}

	return {
		layout: finalLayout,
	};
}
