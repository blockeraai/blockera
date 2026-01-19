// @flow
/**
 * Blockera dependencies
 */
import { isValid, type ValueAddon } from '@blockera/controls';
import { isEmpty, isString, mergeObject } from '@blockera/utils';
import { getGradientVAFromVarString, getGradientType } from '@blockera/data';

export function elementNormalBackgroundFromWPCompatibility({
	innerBlock,
	attributes,
	dataCompatibilityElement,
	insideBlockInspector,
}: {
	innerBlock: string,
	attributes: Object,
	dataCompatibilityElement: string,
	insideBlockInspector: boolean,
}): Object {
	if (
		!attributes?.style?.elements?.[dataCompatibilityElement]?.color
			?.gradient &&
		!attributes?.elements?.[dataCompatibilityElement]?.color?.gradient
	) {
		return false;
	}

	//
	// Gradient Background
	//
	let gradient: ValueAddon | boolean | string = false;
	let gradientType: string = '';

	if (
		attributes?.style?.elements[
			dataCompatibilityElement
		]?.color?.gradient.startsWith('var:') ||
		attributes?.elements?.[
			dataCompatibilityElement
		]?.color?.gradient.startsWith('var(')
	) {
		gradient = getGradientVAFromVarString(
			insideBlockInspector
				? attributes.style.elements[dataCompatibilityElement]?.color
						?.gradient
				: attributes.elements[dataCompatibilityElement]?.color?.gradient
		);

		if (isValid(gradient)) {
			gradientType = getGradientType(gradient);
		}
	} else {
		gradient = insideBlockInspector
			? attributes.style.elements[dataCompatibilityElement]?.color
					?.gradient
			: attributes.elements[dataCompatibilityElement]?.color?.gradient
					?.gradient;
		gradientType = getGradientType(
			insideBlockInspector
				? attributes.style.elements[dataCompatibilityElement]?.color
						?.gradient
				: attributes.elements[dataCompatibilityElement]?.color?.gradient
		);
	}

	if (gradient !== false && gradientType !== '') {
		if (gradientType === 'linear-gradient') {
			let angle = '';

			if (isString(gradient)) {
				//$FlowFixMe
				const _angle = gradient.match(
					/linear-gradient\(\s*(.*?)deg,/im
				);

				if (_angle && _angle[1] !== undefined) {
					angle = _angle[1];
				}
			}

			return {
				blockeraInnerBlocks: {
					value: {
						[innerBlock]: {
							attributes: {
								blockeraBackground: {
									'linear-gradient-0': {
										isVisible: true,
										type: gradientType,
										'linear-gradient': gradient,
										'linear-gradient-angel': angle,
										'linear-gradient-repeat': 'no-repeat',
										'linear-gradient-attachment': 'scroll',
										order: 1,
									},
								},
							},
						},
					},
				},
			};
		}

		return {
			blockeraInnerBlocks: {
				value: {
					[innerBlock]: {
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
			},
		};
	}

	return false;
}

export function elementNormalBackgroundToWPCompatibility({
	element,
	newValue,
	ref,
	insideBlockInspector,
}: {
	element: string,
	newValue: Object,
	ref?: Object,
	insideBlockInspector: boolean,
}): Object {
	if ('reset' === ref?.current?.action || isEmpty(newValue)) {
		const elements = {
			elements: {
				[element]: {
					color: {
						gradient: undefined,
					},
				},
			},
		};
		return {
			...(insideBlockInspector
				? {
						style: {
							elements,
						},
				  }
				: elements),
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
						const elements = {
							elements: {
								[element]: {
									color: {
										gradient:
											'var:preset|gradient|' + gradient,
									},
								},
							},
						};

						result = mergeObject(result, {
							...(insideBlockInspector
								? {
										style: {
											elements,
										},
								  }
								: elements),
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

					const elements = {
						elements: {
							[element]: {
								color: {
									gradient,
								},
							},
						},
					};

					result = mergeObject(result, {
						...(insideBlockInspector
							? {
									style: {
										elements,
									},
							  }
							: elements),
					});
				}

				processedItems.push('linear-gradient');
				processedItems.push('radial-gradient');
				break;
		}
	});

	return result;
}
