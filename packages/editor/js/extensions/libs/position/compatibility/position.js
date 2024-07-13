// @flow

/**
 * Blockera dependencies
 */
import { isEmpty, isUndefined } from '@blockera/utils';
import {
	getSpacingVAFromVarString,
	generateAttributeVarStringFromVA,
} from '@blockera/data';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';

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
		let top: ValueAddon | string = '';
		if (attributes?.style?.position?.top) {
			top = getSpacingVAFromVarString(attributes?.style?.position?.top);
		}

		let right: ValueAddon | string = '';
		if (attributes?.style?.position?.right) {
			right = getSpacingVAFromVarString(
				attributes?.style?.position?.right
			);
		}

		let bottom: ValueAddon | string = '';
		if (attributes?.style?.position?.bottom) {
			bottom = getSpacingVAFromVarString(
				attributes?.style?.position?.bottom
			);
		}

		let left: ValueAddon | string = '';
		if (attributes?.style?.position?.left) {
			left = getSpacingVAFromVarString(attributes?.style?.position?.left);
		}

		attributes.blockeraPosition = {
			type: attributes?.style?.position?.type || '',
			position: {
				top,
				right,
				bottom,
				left,
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
				top: newValue?.position?.top
					? generateAttributeVarStringFromVA(newValue?.position?.top)
					: '',
				right: newValue?.position?.right
					? generateAttributeVarStringFromVA(
							newValue?.position?.right
					  )
					: '',
				bottom: newValue?.position?.bottom
					? generateAttributeVarStringFromVA(
							newValue?.position?.bottom
					  )
					: '',
				left: newValue?.position?.left
					? generateAttributeVarStringFromVA(newValue?.position?.left)
					: '',
			},
		},
	};
}
