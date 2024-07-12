// @flow

/**
 * Blockera dependencies
 */
import { isEmpty, isUndefined, isEquals } from '@blockera/utils';
import { boxPositionControlDefaultValue } from '@blockera/controls/js/libs/box-spacing-control/utils';

export function spacingFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		// WP have spacing value
		(attributes?.style?.spacing?.padding !== undefined ||
			attributes?.style?.spacing?.margin !== undefined) &&
		// Blockera have not custom spacing
		isEquals(attributes?.blockeraSpacing, boxPositionControlDefaultValue)
	) {
		attributes.blockeraSpacing = {
			padding: {
				top: attributes?.style?.spacing?.padding?.top || '',
				right: attributes?.style?.spacing?.padding?.right || '',
				bottom: attributes?.style?.spacing?.padding?.bottom || '',
				left: attributes?.style?.spacing?.padding?.left || '',
			},
			margin: {
				top: attributes?.style?.spacing?.margin?.top || '',
				right: attributes?.style?.spacing?.margin?.right || '',
				bottom: attributes?.style?.spacing?.margin?.bottom || '',
				left: attributes?.style?.spacing?.margin?.left || '',
			},
		};
	}

	return attributes;
}

export function spacingToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if (
		'reset' === ref?.current?.action ||
		isEmpty(newValue) ||
		isUndefined(newValue) ||
		newValue.type === 'static'
	) {
		return {
			style: {
				spacing: {
					padding: undefined,
					margin: undefined,
				},
			},
		};
	}

	const newSpacing: {
		margin?: {
			top?: string | void,
			right?: string | void,
			bottom?: string | void,
			left?: string | void,
		},
		padding?: {
			top?: string | void,
			right?: string | void,
			bottom?: string | void,
			left?: string | void,
		},
	} = {
		margin: {},
		padding: {},
	};

	//
	// margin
	//
	newSpacing.margin = {
		top: newValue?.margin?.top ?? '',
		right: newValue?.margin?.right ?? '',
		bottom: newValue?.margin?.bottom ?? '',
		left: newValue?.margin?.left ?? '',
	};

	if (
		isEquals(newSpacing.margin, {
			top: '',
			right: '',
			bottom: '',
			left: '',
		})
	) {
		delete newSpacing.margin;
	}

	//
	// padding
	//
	newSpacing.padding = {
		top: newValue?.padding?.top ?? '',
		right: newValue?.padding?.right ?? '',
		bottom: newValue?.padding?.bottom ?? '',
		left: newValue?.padding?.left ?? '',
	};

	if (
		isEquals(newSpacing.padding, {
			top: '',
			right: '',
			bottom: '',
			left: '',
		})
	) {
		delete newSpacing.padding;
	}

	return {
		style: {
			spacing: newSpacing,
		},
	};
}
