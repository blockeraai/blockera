// @flow

/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';

export function alignItemsFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		attributes?.blockeraFlexLayout?.alignItems !== '' ||
		attributes?.layout?.verticalAlignment === undefined
	) {
		return attributes;
	}

	// left WP value - right Blockera value
	const values = {
		top: 'flex-start',
		center: 'center',
		bottom: 'flex-end',
		stretch: 'stretch',
	};

	attributes.blockeraFlexLayout.alignItems =
		values[attributes?.layout?.verticalAlignment] ?? '';

	return attributes;
}

export function justifyContentFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		attributes?.blockeraFlexLayout?.justifyContent !== '' ||
		attributes?.layout?.justifyContent === undefined
	) {
		return attributes;
	}

	// left WP value - right Blockera value
	const values = {
		left: 'flex-start',
		center: 'center',
		right: 'flex-end',
		'space-between': 'space-between',
	};

	attributes.blockeraFlexLayout.justifyContent =
		values[attributes?.layout?.justifyContent] ?? '';

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
					attributes.blockeraFlexLayout.direction = 'column';
					return attributes;

				case 'group-row':
					attributes.blockeraFlexLayout.direction = 'row';
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

	attributes.blockeraFlexLayout.direction =
		values[attributes?.layout?.orientation];

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
				orientation: undefined,
				verticalAlignment: undefined,
				justifyContent: undefined,
			},
		};
	}

	// Align items
	// left Blockera value - right WP value
	const alignItemsValues = {
		'flex-start': 'top',
		center: 'center',
		'flex-end': 'bottom',
		stretch: 'stretch',
	};

	// justify content items
	// left Blockera value - right WP value
	const justifyContentValues = {
		'flex-start': 'left',
		center: 'center',
		'flex-end': 'right',
		'space-between': 'space-between',
		'space-around': 'space-around',
	};

	// Direction items
	// left Blockera value - right WP value
	const directionValues = {
		row: 'horizontal',
		column: 'vertical',
	};

	return {
		layout: {
			orientation: directionValues[newValue?.direction] ?? '',
			verticalAlignment: alignItemsValues[newValue?.alignItems] ?? '',
			justifyContent:
				justifyContentValues[newValue?.justifyContent] ?? '',
		},
	};
}
