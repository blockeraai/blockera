// @flow

/**
 * Blockera dependencies
 */
import { isEmpty, isUndefined, normalizeCssLengthValue } from '@blockera/utils';
import {
	getSpacingVAFromVarString,
	generateAttributeVarStringFromVA,
} from '@blockera/data';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';

/**
 * Internal dependencies
 */
import { runInsideBlockInspector } from '../../utils';

function mapPositionInsetFromWP(raw: mixed): ValueAddon | string {
	let asString: string;
	if (typeof raw === 'number') {
		asString = `${raw}px`;
	} else if (typeof raw === 'string') {
		asString = raw;
	} else {
		asString = String(raw);
	}
	const converted = getSpacingVAFromVarString(asString);
	if (converted && typeof converted === 'object' && converted.isValueAddon) {
		return converted;
	}
	return normalizeCssLengthValue(converted);
}

export function positionFromWPCompatibility({
	attributes,
	editorSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	attributes: Object,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	insideBlockInspector?: boolean,
}): Object {
	// Check block-level style (insideBlockInspector) or global style context
	// Block inspector: attributes.style.position.*
	// Global styles: attributes.position.*
	const positionData = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
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
			top = mapPositionInsetFromWP(positionData.top);
		}

		let right: ValueAddon | string = '';
		if (positionData?.right) {
			right = mapPositionInsetFromWP(positionData.right);
		}

		let bottom: ValueAddon | string = '';
		if (positionData?.bottom) {
			bottom = mapPositionInsetFromWP(positionData.bottom);
		}

		let left: ValueAddon | string = '';
		if (positionData?.left) {
			left = mapPositionInsetFromWP(positionData.left);
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
	editorSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	newValue: Object,
	ref?: Object,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	insideBlockInspector?: boolean,
}): Object {
	if (
		'reset' === ref?.current?.action ||
		isEmpty(newValue) ||
		isUndefined(newValue) ||
		newValue.type === 'static'
	) {
		return runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
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

	return runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? {
				style: {
					position: positionData,
				},
			}
		: {
				position: positionData,
			};
}
