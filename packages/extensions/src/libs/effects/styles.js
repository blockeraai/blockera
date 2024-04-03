// @flow
/**
 * Publisher dependencies
 */
import {
	getCssSelector,
	computedCssDeclarations,
} from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';
import type { CssRule } from '@publisher/style-engine/src/types';

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
}: StylesProps): Array<CssRule> => {
	const {
		publisherFilter,
		publisherOpacity,
		publisherTransform,
		publisherBlendMode,
		publisherTransition,
		publisherBackdropFilter,
		publisherDivider,
		publisherMask,
	} = config.effectsConfig;
	const blockProps = {
		clientId,
		blockName,
		attributes: currentBlockAttributes,
	};
	const sharedParams = {
		state,
		clientId,
		currentBlock,
		blockSelectors,
		className: currentBlockAttributes?.className,
	};
	const styleGroup: Array<CssRule> = [];

	if (
		isActiveField(publisherOpacity) &&
		blockProps.attributes.publisherOpacity !==
			attributes.publisherOpacity.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherOpacity',
			support: 'publisherOpacity',
			fallbackSupportId: 'opacity',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherOpacity: [
						{
							type: 'static',
							properties: {
								opacity: getValueAddonRealValue(
									blockProps.attributes.publisherOpacity
								),
							},
						},
					],
				},
				blockProps
			),
		});
	}

	if (isActiveField(publisherTransform)) {
		const transformProperties: TTransformCssProps = {};

		if (
			!arrayEquals(
				attributes.publisherTransform.default,
				blockProps.attributes.publisherTransform
			)
		) {
			let transformProperty = blockProps.attributes.publisherTransform
				?.map((item) => {
					if (!item.isVisible) {
						return null;
					}

					switch (item.type) {
						case 'move':
							return `translate3d(${getValueAddonRealValue(
								item['move-x']
							)}, ${getValueAddonRealValue(
								item['move-y']
							)}, ${getValueAddonRealValue(item['move-z'])})`;

						case 'scale':
							return `scale3d(${getValueAddonRealValue(
								item.scale
							)}, ${getValueAddonRealValue(item.scale)}, 50%)`;

						case 'rotate':
							return `rotateX(${getValueAddonRealValue(
								item['rotate-x']
							)}) rotateY(${getValueAddonRealValue(
								item['rotate-y']
							)}) rotateZ(${getValueAddonRealValue(
								item['rotate-z']
							)})`;

						case 'skew':
							return `skew(${getValueAddonRealValue(
								item['skew-x']
							)}, ${getValueAddonRealValue(item['skew-y'])})`;
					}

					return null;
				})
				?.filter((item) => null !== item)
				.join(' ');

			if (blockProps.attributes.publisherTransformSelfPerspective) {
				transformProperty = `perspective(${getValueAddonRealValue(
					blockProps.attributes.publisherTransformSelfPerspective
				)}) ${transformProperty}`;
			}

			if (transformProperty) {
				transformProperties.transform = transformProperty;
			}
		}

		if (
			!arrayEquals(
				attributes.publisherTransformSelfOrigin.default,
				blockProps.attributes.publisherTransformSelfOrigin
			)
		) {
			transformProperties['transform-origin'] = `${getValueAddonRealValue(
				blockProps.attributes.publisherTransformSelfOrigin?.top
			)} ${getValueAddonRealValue(
				blockProps.attributes.publisherTransformSelfOrigin?.left
			)}`;
		}

		if (blockProps.attributes.publisherBackfaceVisibility) {
			transformProperties['backface-visibility'] =
				blockProps.attributes.publisherBackfaceVisibility;
		}

		if (blockProps.attributes.publisherTransformChildPerspective) {
			const childTransformChildPers = getValueAddonRealValue(
				blockProps.attributes.publisherTransformChildPerspective
			);

			transformProperties.perspective =
				childTransformChildPers !== '0px'
					? childTransformChildPers
					: 'none';
		}

		if (
			!arrayEquals(
				attributes.publisherTransformChildOrigin.default,
				blockProps.attributes.publisherTransformChildOrigin
			)
		) {
			transformProperties[
				'perspective-origin'
			] = `${getValueAddonRealValue(
				blockProps.attributes.publisherTransformChildOrigin?.top
			)} ${getValueAddonRealValue(
				blockProps.attributes.publisherTransformChildOrigin?.left
			)}`;
		}

		if (transformProperties) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherTransform',
				support: 'publisherTransform',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherTransform: [
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
		isActiveField(publisherTransition) &&
		!arrayEquals(
			attributes.publisherTransition.default,
			blockProps.attributes.publisherTransition
		)
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherTransition',
			support: 'publisherTransition',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherTransition: [
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
		isActiveField(publisherFilter) &&
		!arrayEquals(
			attributes.publisherFilter.default,
			blockProps.attributes.publisherFilter
		)
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherFilter',
			support: 'publisherFilter',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherFilter: [
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
		isActiveField(publisherBackdropFilter) &&
		!arrayEquals(
			attributes.publisherBackdropFilter.default,
			blockProps.attributes.publisherBackdropFilter
		)
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherBackdropFilter',
			support: 'publisherBackdropFilter',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherBackdropFilter: [
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
		isActiveField(publisherDivider) &&
		!arrayEquals(
			attributes.publisherDivider.default,
			blockProps.attributes.publisherDivider
		)
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherDivider',
			support: 'publisherDivider',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherDivider: [
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
				query: 'publisherDivider',
				support: 'publisherDivider',
				suffixClass: ':before',
			}),
			declarations: computedCssDeclarations(
				{
					publisherDivider: [
						{
							type: 'function',
							function: BeforeDividerGenerator,
						},
					],
				},
				blockProps
			),
		});

		if (blockProps.attributes?.publisherDivider?.length === 2) {
			styleGroup.push({
				selector: getCssSelector({
					...sharedParams,
					query: 'publisherDivider',
					support: 'publisherDivider',
					suffixClass: ':after',
				}),
				declarations: computedCssDeclarations(
					{
						publisherDivider: [
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
		isActiveField(publisherMask) &&
		!arrayEquals(
			attributes.publisherMask.default,
			blockProps.attributes.publisherMask
		)
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherMask',
			support: 'publisherMask',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherMask: [
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
		isActiveField(publisherBlendMode) &&
		blockProps.attributes.publisherBlendMode !==
			attributes.publisherBlendMode.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherBlendMode',
			support: 'publisherBlendMode',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherBlendMode: [
						{
							type: 'static',
							properties: {
								'mix-blend-mode': '{{publisherBlendMode}}',
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
