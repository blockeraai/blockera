// @flow
/**
 * Publisher dependencies
 */
import {
	isEmpty,
	isString,
	isEmptyObject,
	mergeObject,
} from '@publisher/utils';
import { getGradientType } from '@publisher/core-data';
import { isValid } from '@publisher/hooks/src/use-value-addon/helpers';
import type { ValueAddon } from '@publisher/hooks/src/use-value-addon/types';
import { getGradientVAFromIdString } from '@publisher/core-data/src/variables/gradient';

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
			...attributes.publisherBackground,
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
		gradient = getGradientVAFromIdString(attributes?.gradient);

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
			let angel = '';

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
				...attributes.publisherBackground,
				'linear-gradient-0': {
					type: gradientType,
					'linear-gradient': gradient,
					'linear-gradient-angel': angel,
					'linear-gradient-repeat': 'no-repeat',
					'linear-gradient-attachment': 'scroll',
					isOpen: false,
					order: 1,
				},
			};
		} else {
			attributes.publisherBackground = {
				...attributes.publisherBackground,
				'radial-gradient-0': {
					type: gradientType,
					'radial-gradient': gradient,
					'radial-gradient-position': { top: '50%', left: '50%' },
					'radial-gradient-size': 'farthest-corner',
					'linear-gradient-attachment': 'scroll',
					isOpen: false,
					order: 1,
				},
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
			gradient: undefined,
		};
	}

	const processedItems = [];
	let result = {};

	Object.entries(newValue).forEach(([, item]: [string, Object]): void => {
		// already processed
		if (processedItems.includes(item?.type)) {
			return;
		}

		//
		// Gradient Background
		//
		let gradient: ValueAddon | boolean | string = false;

		switch (item?.type) {
			case 'image':
				if (item?.image === '') {
					break;
				}

				result = mergeObject(result, {
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
				});

				processedItems.push(item?.type);

				break;

			case 'radial-gradient':
			case 'linear-gradient':
				if (item[item?.type] === '') {
					break;
				}

				// gradient value is a variable
				if (isValid(item[item?.type])) {
					gradient = item[item?.type]?.settings?.id;

					if (gradient !== undefined) {
						result = mergeObject(result, {
							gradient,
						});
					} else {
						break;
					}
				}
				// simple value gradient
				else if (isString(item[item?.type])) {
					gradient = item[item?.type];

					if (item['linear-gradient-angel'] !== undefined) {
						//$FlowFixMe
						gradient = gradient.replace(
							/gradient\(\s*(.*?)deg,/im,
							'gradient(' + item['linear-gradient-angel'] + 'deg,'
						);
					}

					result = mergeObject(result, {
						style: {
							color: {
								gradient,
							},
						},
					});
				}

				processedItems.push('linear-gradient');
				processedItems.push('radial-gradient');
				break;
		}
	});

	return result;
}
