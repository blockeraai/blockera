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
	runSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	attributes: Object,
	runSelectedBlockEvent: boolean,
	insideBlockInspector?: boolean,
}): Object {
	// Check block-level style (insideBlockInspector) or global style context
	// Block inspector: attributes.style.position.*
	// Global styles: attributes.position.*
	const positionData =
		insideBlockInspector && runSelectedBlockEvent
			? attributes?.style?.position
			: attributes?.position;

	if (
		// Blockera don't have position
		attributes?.blockeraPosition?.value?.type === 'static' &&
		// WP  do have position
		positionData?.type
	) {
		let top: ValueAddon | string = '';
		if (positionData?.top) {
			top = getSpacingVAFromVarString(positionData?.top);
		}

		let right: ValueAddon | string = '';
		if (positionData?.right) {
			right = getSpacingVAFromVarString(positionData?.right);
		}

		let bottom: ValueAddon | string = '';
		if (positionData?.bottom) {
			bottom = getSpacingVAFromVarString(positionData?.bottom);
		}

		let left: ValueAddon | string = '';
		if (positionData?.left) {
			left = getSpacingVAFromVarString(positionData?.left);
		}

		attributes.blockeraPosition = {
			value: {
				type: positionData?.type || '',
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
	runSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	newValue: Object,
	ref?: Object,
	runSelectedBlockEvent: boolean,
	insideBlockInspector?: boolean,
}): Object {
	if (
		'reset' === ref?.current?.action ||
		isEmpty(newValue) ||
		isUndefined(newValue) ||
		newValue.type === 'static'
	) {
		return insideBlockInspector && runSelectedBlockEvent
			? {
					style: {
						position: undefined,
					},
				}
			: {
					position: undefined,
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

	const positionData = {
		type: newValue.type,
		top,
		right,
		bottom,
		left,
	};

	return insideBlockInspector && runSelectedBlockEvent
		? {
				style: {
					position: positionData,
				},
			}
		: {
				position: positionData,
			};
}
