// @flow
/**
 * Publisher dependencies
 */
import { isEmpty, isString, isEmptyObject } from '@publisher/utils';
import {
	getGradientType,
	getGradientVAFromVarString,
} from '@publisher/core-data';
import { isValid } from '@publisher/hooks/src/use-value-addon/helpers';
import type { ValueAddon } from '@publisher/hooks/src/use-value-addon/types';

export function backgroundFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
	blockId?: string,
}): Object {
	if (!isEmptyObject(attributes?.publisherBackground)) {
		return attributes;
	}

	//
	// Background Image
	//
	if (attributes?.style?.background?.backgroundImage?.url !== undefined) {
		attributes.publisherBackground = {
			'image-0': {
				type: 'image',
				image: attributes?.style?.background?.backgroundImage?.url,
				'image-size': 'custom',
				'image-size-width': 'auto',
				'image-size-height': 'auto',
				'image-position': {
					top: '50%',
					left: '50%',
				},
				'image-repeat': 'repeat',
				'image-attachment': 'scroll',
				isOpen: false,
				order: 0,
			},
			...attributes.publisherBackground,
		};
	}

	//
	// Gradient Background
	//
	let gradient: ValueAddon | boolean | string = false;
	let gradientType: string = '';

	// gradient attribute in root always is variable
	// it should be changed to a Value Addon (variable)
	if (attributes?.gradient !== undefined) {
		gradient = getGradientVAFromVarString(attributes?.gradient);

		if (isValid(gradient)) {
			gradientType = getGradientType(gradient);
		}
	}
	// style.color.background is not variable
	else if (attributes?.style?.color?.gradient !== undefined) {
		gradient = attributes?.style?.color?.gradient;
		gradientType = getGradientType(attributes?.style?.color?.gradient);
	}

	if (gradient !== false && gradientType !== '') {
		if (gradientType === 'linear-gradient') {
			let angel = '0';

			if (isString(gradient)) {
				//$FlowFixMe
				const _angel = gradient.match(
					/linear-gradient\(\s*(.*?)deg,/im
				);

				if (_angel && _angel[1] !== undefined) {
					angel = _angel[1];
				}
			}

			attributes.publisherBackground = {
				'linear-gradient-0': {
					type: gradientType,
					'linear-gradient': gradient,
					'linear-gradient-angel': angel,
					'linear-gradient-repeat': 'no-repeat',
					'linear-gradient-attachment': 'scroll',
					isOpen: false,
					order: 1,
				},
				...attributes.publisherBackground,
			};
		} else {
			attributes.publisherBackground = {
				'radial-gradient-0': {
					type: gradientType,
					'radial-gradient': gradient,
					position: { top: '50%', left: '50%' },
					'radial-gradient-size': 'farthest-corner',
					'linear-gradient-attachment': 'scroll',
					isOpen: false,
					order: 1,
				},
				...attributes.publisherBackground,
			};
		}
	}

	return attributes;
}

export function backgroundToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if ('reset' === ref?.current?.action || isEmpty(newValue)) {
		return {
			style: {
				background: {
					backgroundImage: undefined,
				},
				color: {
					gradient: undefined,
				},
			},
		};
	}

	let result = {};

	Object.entries(newValue).forEach(([, item]: [string, Object]): void => {
		// only 1 image
		if (result) {
			return;
		}

		if (item?.type === 'image' && item?.image !== '') {
			result = {
				style: {
					background: {
						backgroundImage: {
							url: item?.image,
							source: 'file',
							id: 0,
							title: 'background image',
						},
					},
				},
			};
		}
	});

	return result;
}
