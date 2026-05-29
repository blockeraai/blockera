// @flow

/**
 * Blockera dependencies
 */
import { isEquals, mergeObject } from '@blockera/utils';

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

	// left WP value - right Blockera value
	const values = {
		top: 'flex-start',
		center: 'center',
		bottom: 'flex-end',
		stretch: 'stretch',
		'space-between': 'space-between',
	};

	const mappedValue = values[attributes?.layout?.verticalAlignment] ?? '';
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

	// left WP value - right Blockera value
	const values = {
		left: 'flex-start',
		center: 'center',
		right: 'flex-end',
		'space-between': 'space-between',
		stretch: 'stretch',
	};

	const mappedValue = values[attributes?.layout?.justifyContent] ?? '';
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

	// Vertical screen axis → WP `verticalAlignment` keys.
	// left Blockera CSS value - right WP value
	const verticalAlignmentValues = {
		'flex-start': 'top',
		center: 'center',
		'flex-end': 'bottom',
		stretch: 'stretch',
		'space-between': 'space-between',
		'space-around': 'space-around',
	};

	// Horizontal screen axis → WP `justifyContent` keys.
	// left Blockera CSS value - right WP value
	const justifyContentValues = {
		'flex-start': 'left',
		center: 'center',
		'flex-end': 'right',
		'space-between': 'space-between',
		'space-around': 'space-around',
		stretch: 'stretch',
	};

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
		verticalAlignment: verticalAlignmentValues[verticalValue] ?? undefined,
		justifyContent: justifyContentValues[horizontalValue] ?? undefined,
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
