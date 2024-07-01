// @flow

/**
 * Blockera dependencies
 */
import { isEmpty, isUndefined } from '@blockera/utils';

export function positionFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		// Blockera don't have position
		attributes?.blockeraPosition?.type === 'static' &&
		// WP  do have position
		attributes?.style?.position?.type !== undefined
	) {
		attributes.blockeraPosition = {
			type: attributes?.style?.position?.type || '',
			position: {
				top: attributes?.style?.position?.top || '',
				right: attributes?.style?.position?.right || '',
				bottom: attributes?.style?.position?.bottom || '',
				left: attributes?.style?.position?.left || '',
			},
		};
	}

	return attributes;
}

export function positionToWPCompatibility({
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
				position: undefined,
			},
		};
	}

	return {
		style: {
			position: {
				type: newValue.type,
				top: newValue?.position?.top,
				right: newValue?.position?.right,
				bottom: newValue?.position?.bottom,
				left: newValue?.position?.left,
			},
		},
	};
}
