// @flow
/**
 * Blockera dependencies
 */
import {
	getCssSelector,
	computedCssDeclarations,
} from '@blockera/style-engine';
import { getValueAddonRealValue } from '@blockera/hooks';
import type { CssRule } from '@blockera/style-engine/src/types';
import { getSortedRepeater } from '@blockera/controls';

/**
 * Internal dependencies
 */
import {
	FilterGenerator,
	TransitionGenerator,
	MaskGenerator,
} from './css-generators';
import { arrayEquals } from '../utils';
import * as config from '../base/config';
import { attributes } from './attributes';
import { isActiveField } from '../../api/utils';
import type { StylesProps } from '../types';
import type { TTransformCssProps } from './types/effects-props';
import {
	AfterDividerGenerator,
	BeforeDividerGenerator,
} from './css-generators/divider-generator';

export const EffectsStyles = ({
	state,
	clientId,
	blockName,
	currentBlock,
	// supports,
	// activeDeviceType,
	selectors: blockSelectors,
	attributes: currentBlockAttributes,
	...props
}: StylesProps): Array<CssRule> => {
	const {
		blockeraFilter,
		blockeraOpacity,
		blockeraTransform,
		blockeraBlendMode,
		blockeraTransition,
		blockeraBackdropFilter,
		blockeraDivider,
		blockeraMask,
	} = config.effectsConfig;

	const blockProps = {
		clientId,
		blockName,
		attributes: currentBlockAttributes,
	};

	const sharedParams = {
		...props,
		state,
		clientId,
		currentBlock,
		blockSelectors,
		className: currentBlockAttributes?.className,
	};

	const styleGroup: Array<CssRule> = [];

	if (
		isActiveField(blockeraOpacity) &&
		blockProps.attributes.blockeraOpacity !==
			attributes.blockeraOpacity.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraOpacity',
			support: 'blockeraOpacity',
			fallbackSupportId: 'opacity',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraOpacity: [
						{
							type: 'static',
							properties: {
								opacity: blockProps.attributes.blockeraOpacity,
							},
						},
					],
				},
				blockProps
			),
		});
	}

	if (isActiveField(blockeraTransform)) {
		const transformProperties: TTransformCssProps = {};

		if (
			!arrayEquals(
				attributes.blockeraTransform.default,
				blockProps.attributes.blockeraTransform
			)
		) {
			const properties: {
				transform: Array<string>,
				transformSelfPerspective: string,
			} = {
				transform: [],
				transformSelfPerspective: '',
			};

			getSortedRepeater(blockProps.attributes.blockeraTransform)?.map(
				([, item]) => {
					if (!item.isVisible) {
						return null;
					}

					switch (item.type) {
						case 'move':
							properties.transform.push(
								`translate3d(${getValueAddonRealValue(
									item['move-x']
								)}, ${getValueAddonRealValue(
									item['move-y']
								)}, ${getValueAddonRealValue(item['move-z'])})`
							);
							break;

						case 'scale':
							properties.transform.push(
								`scale3d(${getValueAddonRealValue(
									item.scale
								)}, ${getValueAddonRealValue(item.scale)}, 50%)`
							);
							break;

						case 'rotate':
							properties.transform.push(
								`rotateX(${getValueAddonRealValue(
									item['rotate-x']
								)}) rotateY(${getValueAddonRealValue(
									item['rotate-y']
								)}) rotateZ(${getValueAddonRealValue(
									item['rotate-z']
								)})`
							);
							break;

						case 'skew':
							properties.transform.push(
								`skew(${getValueAddonRealValue(
									item['skew-x']
								)}, ${getValueAddonRealValue(item['skew-y'])})`
							);
							break;
					}

					return null;
				}
			);

			if (blockProps.attributes.blockeraTransformSelfPerspective) {
				properties.transformSelfPerspective = `perspective(${getValueAddonRealValue(
					blockProps.attributes.blockeraTransformSelfPerspective
				)}) `;
			}

			if (properties.transform.length > 0) {
				transformProperties.transform =
					properties.transformSelfPerspective +
					properties.transform.join(' ');
			}
		}

		if (
			!arrayEquals(
				attributes.blockeraTransformSelfOrigin.default,
				blockProps.attributes.blockeraTransformSelfOrigin
			)
		) {
			transformProperties['transform-origin'] = `${getValueAddonRealValue(
				blockProps.attributes.blockeraTransformSelfOrigin?.top
			)} ${getValueAddonRealValue(
				blockProps.attributes.blockeraTransformSelfOrigin?.left
			)}`;
		}

		if (blockProps.attributes.blockeraBackfaceVisibility) {
			transformProperties['backface-visibility'] =
				blockProps.attributes.blockeraBackfaceVisibility;
		}

		if (blockProps.attributes.blockeraTransformChildPerspective) {
			const childTransformChildPers = getValueAddonRealValue(
				blockProps.attributes.blockeraTransformChildPerspective
			);

			transformProperties.perspective =
				childTransformChildPers !== '0px'
					? childTransformChildPers
					: 'none';
		}

		if (
			!arrayEquals(
				attributes.blockeraTransformChildOrigin.default,
				blockProps.attributes.blockeraTransformChildOrigin
			)
		) {
			transformProperties[
				'perspective-origin'
			] = `${getValueAddonRealValue(
				blockProps.attributes.blockeraTransformChildOrigin?.top
			)} ${getValueAddonRealValue(
				blockProps.attributes.blockeraTransformChildOrigin?.left
			)}`;
		}

		if (transformProperties) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraTransform',
				support: 'blockeraTransform',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraTransform: [
							{
								type: 'static',
								properties: { ...transformProperties },
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (
		isActiveField(blockeraTransition) &&
		!arrayEquals(
			attributes.blockeraTransition.default,
			blockProps.attributes.blockeraTransition
		)
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraTransition',
			support: 'blockeraTransition',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraTransition: [
						{
							type: 'function',
							function: TransitionGenerator,
						},
					],
				},
				blockProps
			),
		});
	}

	if (
		isActiveField(blockeraFilter) &&
		!arrayEquals(
			attributes.blockeraFilter.default,
			blockProps.attributes.blockeraFilter
		)
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraFilter',
			support: 'blockeraFilter',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraFilter: [
						{
							type: 'function',
							function: FilterGenerator,
						},
					],
				},
				blockProps
			),
		});
	}

	if (
		isActiveField(blockeraBackdropFilter) &&
		!arrayEquals(
			attributes.blockeraBackdropFilter.default,
			blockProps.attributes.blockeraBackdropFilter
		)
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraBackdropFilter',
			support: 'blockeraBackdropFilter',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraBackdropFilter: [
						{
							type: 'function',
							function: FilterGenerator,
						},
					],
				},
				blockProps
			),
		});
	}

	if (
		isActiveField(blockeraDivider) &&
		!arrayEquals(
			attributes.blockeraDivider.default,
			blockProps.attributes.blockeraDivider
		)
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraDivider',
			support: 'blockeraDivider',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraDivider: [
						{
							type: 'static',
							properties: {
								position: 'relative',
								overflow: 'hidden',
							},
						},
					],
				},
				blockProps
			),
		});

		styleGroup.push({
			selector: getCssSelector({
				...sharedParams,
				query: 'blockeraDivider',
				support: 'blockeraDivider',
				suffixClass: ':before',
			}),
			declarations: computedCssDeclarations(
				{
					blockeraDivider: [
						{
							type: 'function',
							function: BeforeDividerGenerator,
						},
					],
				},
				blockProps
			),
		});

		if (
			Object.entries(blockProps.attributes?.blockeraDivider)?.length === 2
		) {
			styleGroup.push({
				selector: getCssSelector({
					...sharedParams,
					query: 'blockeraDivider',
					support: 'blockeraDivider',
					suffixClass: ':after',
				}),
				declarations: computedCssDeclarations(
					{
						blockeraDivider: [
							{
								type: 'function',
								function: AfterDividerGenerator,
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (
		isActiveField(blockeraMask) &&
		!arrayEquals(
			attributes.blockeraMask.default,
			blockProps.attributes.blockeraMask
		)
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraMask',
			support: 'blockeraMask',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraMask: [
						{
							type: 'function',
							function: MaskGenerator,
						},
					],
				},
				blockProps
			),
		});
	}

	if (
		isActiveField(blockeraBlendMode) &&
		blockProps.attributes.blockeraBlendMode !==
			attributes.blockeraBlendMode.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraBlendMode',
			support: 'blockeraBlendMode',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraBlendMode: [
						{
							type: 'static',
							properties: {
								'mix-blend-mode':
									blockProps.attributes.blockeraBlendMode,
							},
						},
					],
				},
				blockProps
			),
		});
	}

	return styleGroup;
};
