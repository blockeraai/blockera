// @flow
/**
 * Blockera dependencies
 */
import { isValid } from '@blockera/value-addons';
import { isEmpty, isString, mergeObject } from '@blockera/utils';
import type { ValueAddon } from '@blockera/value-addons/js/types';
import { getGradientVAFromVarString, getGradientType } from '@blockera/data';

export function elementNormalBackgroundFromWPCompatibility({
	element,
	attributes,
}: {
	element: string,
	attributes: Object,
}): Object {
	if (!attributes.style.elements[element]?.color?.gradient) {
		return false;
	}

	//
	// Gradient Background
	//
	let gradient: ValueAddon | boolean | string = false;
	let gradientType: string = '';

	if (
		attributes.style.elements[element]?.color?.gradient.startsWith('var:')
	) {
		gradient = getGradientVAFromVarString(
			attributes.style.elements[element]?.color?.gradient
		);

		if (isValid(gradient)) {
			gradientType = getGradientType(gradient);
		}
	} else {
		gradient = attributes.style.elements[element]?.color?.gradient;
		gradientType = getGradientType(
			attributes.style.elements[element]?.color?.gradient
		);
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

			return {
				blockeraInnerBlocks: {
					[element]: {
						attributes: {
							blockeraBackground: {
								'linear-gradient-0': {
									isVisible: true,
									type: gradientType,
									'linear-gradient': gradient,
									'linear-gradient-angel': angel,
									'linear-gradient-repeat': 'no-repeat',
									'linear-gradient-attachment': 'scroll',
									order: 1,
								},
							},
						},
					},
				},
			};
		}

		return {
			blockeraInnerBlocks: {
				[element]: {
					attributes: {
						blockeraBackground: {
							'radial-gradient-0': {
								isVisible: true,
								type: gradientType,
								'radial-gradient': gradient,
								'radial-gradient-position': {
									top: '50%',
									left: '50%',
								},
								'radial-gradient-size': 'farthest-corner',
								'radial-gradient-attachment': 'scroll',
								order: 1,
							},
						},
					},
				},
			},
		};
	}

	return false;
}

export function elementNormalBackgroundToWPCompatibility({
	element,
	newValue,
	ref,
}: {
	element: string,
	newValue: Object,
	ref?: Object,
}): Object {
	if ('reset' === ref?.current?.action || isEmpty(newValue)) {
		return {
			style: {
				elements: {
					[element]: {
						color: {
							gradient: undefined,
						},
					},
				},
			},
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
							style: {
								elements: {
									[element]: {
										color: {
											gradient:
												'var:preset|gradient|' +
												gradient,
										},
									},
								},
							},
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
							elements: {
								[element]: {
									color: {
										gradient,
									},
								},
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
