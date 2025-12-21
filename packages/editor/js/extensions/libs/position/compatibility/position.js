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
		attributes?.blockeraPosition?.value?.type === 'static' &&
		// WP  do have position
		attributes?.style?.position?.type
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
			value: {
				type: attributes?.style?.position?.type || '',
				position: {
					top,
					right,
					bottom,
					left,
				},
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

	let top = '';
	if (newValue?.position?.top) {
		top = generateAttributeVarStringFromVA(newValue?.position?.top);

		if (top.endsWith('func')) {
			top = '';
		}
	}

	let right = '';
	if (newValue?.position?.right) {
		right = generateAttributeVarStringFromVA(newValue?.position?.right);

		if (right.endsWith('func')) {
			right = '';
		}
	}

	let bottom = '';
	if (newValue?.position?.bottom) {
		bottom = generateAttributeVarStringFromVA(newValue?.position?.bottom);

		if (bottom.endsWith('func')) {
			bottom = '';
		}
	}

	let left = '';
	if (newValue?.position?.left) {
		left = generateAttributeVarStringFromVA(newValue?.position?.left);

		if (left.endsWith('func')) {
			left = '';
		}
	}

	return {
		style: {
			position: {
				type: newValue.type,
				top,
				right,
				bottom,
				left,
			},
		},
	};
}
