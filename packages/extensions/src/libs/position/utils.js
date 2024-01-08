// @flow
/**
 * Publisher dependencies
 */
import { isUndefined, isEmpty } from '@publisher/utils';
import type { PositionControlValue } from '@publisher/controls/src/libs/box-position-control/types';

export function positionToWPCompatible({
	newValue,
	ref,
	isNormalState,
	getAttributes,
}: {
	newValue: PositionControlValue,
	ref: Object,
	isNormalState: () => boolean,
	getAttributes: () => Object,
}): {
	style: {
		position?: {
			type?: string,
			top?: string,
			right?: string,
			bottom?: string,
			left?: string,
		},
	},
} {
	const blockAttributes = getAttributes();

	if ('reset' === ref?.current?.action) {
		return {
			style: {
				...(blockAttributes.attributes?.style ?? {}),
				position: undefined,
			},
		};
	}

	if (!isNormalState() || isEmpty(newValue) || isUndefined(newValue)) {
		return {
			style: {
				...(blockAttributes.attributes?.style ?? {}),
				position: undefined,
			},
		};
	}

	return {
		style: {
			...(blockAttributes.attributes?.style ?? {}),
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
