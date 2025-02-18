// @flow
/**
 * Blockera dependencies
 */
import { getValueAddonRealValue, getSortedRepeater } from '@blockera/controls';
import { experimental } from '@blockera/env';

/**
 * Internal dependencies
 */
import { arrayEquals } from '../utils';
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import type { CssRule } from '../../../style-engine/types';
import type { TTransformCssProps } from './types/effects-props';
import {
	FilterGenerator,
	TransitionGenerator,
	MaskGenerator,
} from './css-generators';
import {
	getCompatibleBlockCssSelector,
	computedCssDeclarations,
} from '../../../style-engine';
import {
	AfterDividerGenerator,
	BeforeDividerGenerator,
} from './css-generators/divider-generator';
import { getBlockSupportCategory, getBlockSupportFallback } from '../../utils';

const supports = getBlockSupportCategory('effects');

export const EffectsStyles = ({
	state,
	config,
	clientId,
	blockName,
	masterState,
	currentBlock,
	activeDeviceType,
	selectors: blockSelectors,
	defaultAttributes: attributes,
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
		state,
		clientId,
		blockName,
		attributes: currentBlockAttributes,
	};

	const sharedParams = {
		...props,
		state,
		clientId,
		blockName,
		masterState,
		currentBlock,
		blockSelectors,
		activeDeviceType,
		className: currentBlockAttributes?.className,
	};

	const styleGroup: Array<CssRule> = [];

	if (
		isActiveField(blockeraOpacity) &&
		blockProps.attributes.blockeraOpacity !==
			attributes.blockeraOpacity.default
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraOpacity',
			support: 'blockeraOpacity',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraOpacity'
			),
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
				blockProps,
				pickedSelector
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

		if (
			blockProps.attributes.blockeraBackfaceVisibility !==
			attributes.blockeraBackfaceVisibility.default
		) {
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
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraTransform',
				support: 'blockeraTransform',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraTransform'
				),
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
					blockProps,
					pickedSelector
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
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraTransition',
			support: 'blockeraTransition',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraTransition'
			),
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
				blockProps,
				pickedSelector
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
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraFilter',
			support: 'blockeraFilter',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraFilter'
			),
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
				blockProps,
				pickedSelector
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
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraBackdropFilter',
			support: 'blockeraBackdropFilter',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraBackdropFilter'
			),
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
				blockProps,
				pickedSelector
			),
		});
	}

	if (
		isActiveField(blockeraBlendMode) &&
		blockProps.attributes.blockeraBlendMode !==
			attributes.blockeraBlendMode.default
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraBlendMode',
			support: 'blockeraBlendMode',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraBlendMode'
			),
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
				blockProps,
				pickedSelector
			),
		});
	}

	if (
		experimental().get('editor.extensions.effectsExtension.divider') &&
		isActiveField(blockeraDivider) &&
		!arrayEquals(
			attributes.blockeraDivider.default,
			blockProps.attributes.blockeraDivider
		)
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraDivider',
			support: 'blockeraDivider',
			fallbackSupportId: getBlockSupportFallback(
				getBlockSupportCategory('divider'),
				'blockeraDivider'
			),
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
				blockProps,
				pickedSelector
			),
		});

		styleGroup.push({
			selector: getCompatibleBlockCssSelector({
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
				blockProps,
				pickedSelector
			),
		});

		if (
			Object.entries(blockProps.attributes?.blockeraDivider)?.length === 2
		) {
			styleGroup.push({
				selector: getCompatibleBlockCssSelector({
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
					blockProps,
					pickedSelector
				),
			});
		}
	}

	if (
		experimental().get('editor.extensions.effectsExtension.mask') &&
		isActiveField(blockeraMask) &&
		!arrayEquals(
			attributes.blockeraMask.default,
			blockProps.attributes.blockeraMask
		)
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraMask',
			support: 'blockeraMask',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraMask'
			),
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
				blockProps,
				pickedSelector
			),
		});
	}

	return styleGroup;
};
