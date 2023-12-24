// @flow
/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

/**
 * Internal dependencies
 */
import {
	FilterGenerator,
	TransitionGenerator,
	MaskGenerator,
} from './css-generators';
import { arrayEquals } from '../utils';
import { attributes } from './attributes';
import { isActiveField } from '../../api/utils';
import type { TBlockProps } from '../types';
import type { TTransformCssProps } from './types/effects-props';

interface IConfigs {
	effectsConfig: {
		cssGenerators: Object,
		publisherCursor?: string,
		publisherOpacity?: string,
		publisherBlendMode?: string,
		publisherFilter?: Array<Object>,
		publisherTransform?: Array<Object>,
		publisherTransition?: Array<Object>,
		publisherBackdropFilter?: Array<Object>,
		publisherMask?: Array<Object>,
	};
	blockProps: TBlockProps;
}

export function EffectsStyles({
	effectsConfig: {
		cssGenerators,
		publisherFilter,
		publisherCursor,
		publisherOpacity,
		publisherTransform,
		publisherBlendMode,
		publisherTransition,
		publisherBackdropFilter,
		publisherMask,
	},
	blockProps,
}: IConfigs): string {
	const generators = [];

	if (
		isActiveField(publisherOpacity) &&
		blockProps.attributes.publisherOpacity !==
			attributes.publisherOpacity.default
	) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherOpacity: [
							{
								type: 'static',
								selector: '.{{BLOCK_ID}}',
								properties: {
									opacity: getValueAddonRealValue(
										blockProps.attributes.publisherOpacity
									),
								},
							},
						],
					},
				},
				{ attributes: blockProps.attributes, ...blockProps }
			)
		);
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
			generators.push(
				computedCssRules(
					{
						cssGenerators: {
							publisherTransform: [
								{
									type: 'static',
									selector: '.{{BLOCK_ID}}',
									properties: { ...transformProperties },
								},
							],
						},
					},
					{ attributes: blockProps.attributes, ...blockProps }
				)
			);
		}
	}

	if (
		isActiveField(publisherTransition) &&
		!arrayEquals(
			attributes.publisherTransition.default,
			blockProps.attributes.publisherTransition
		)
	) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherTransition: [
							{
								type: 'function',
								function: TransitionGenerator,
							},
						],
					},
				},
				blockProps
			)
		);
	}

	if (
		isActiveField(publisherFilter) &&
		!arrayEquals(
			attributes.publisherFilter.default,
			blockProps.attributes.publisherFilter
		)
	) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherFilter: [
							{
								type: 'function',
								function: FilterGenerator,
							},
						],
					},
				},
				{
					...blockProps,
					cssGeneratorEntity: {
						property: 'filter',
						id: 'publisherFilter',
					},
				}
			)
		);
	}

	if (
		isActiveField(publisherBackdropFilter) &&
		!arrayEquals(
			attributes.publisherBackdropFilter.default,
			blockProps.attributes.publisherBackdropFilter
		)
	) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherBackdropFilter: [
							{
								type: 'function',
								function: FilterGenerator,
							},
						],
					},
				},
				{
					...blockProps,
					cssGeneratorEntity: {
						property: 'backdrop-filter',
						id: 'publisherBackdropFilter',
					},
				}
			)
		);
	}

	if (
		isActiveField(publisherMask) &&
		!arrayEquals(
			attributes.publisherMask.default,
			blockProps.attributes.publisherMask
		)
	) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherMask: [
							{
								type: 'function',
								function: MaskGenerator,
							},
						],
					},
				},
				blockProps
			)
		);
	}

	if (
		isActiveField(publisherCursor) &&
		blockProps.attributes.publisherCursor !==
			attributes.publisherCursor.default
	) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherCursor: [
							{
								type: 'static',
								selector: '.{{BLOCK_ID}}',
								properties: {
									cursor: '{{publisherCursor}}',
								},
							},
						],
					},
				},
				{ attributes: blockProps.attributes, ...blockProps }
			)
		);
	}

	if (
		isActiveField(publisherBlendMode) &&
		blockProps.attributes.publisherBlendMode !==
			attributes.publisherBlendMode.default
	) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherBlendMode: [
							{
								type: 'static',
								selector: '.{{BLOCK_ID}}',
								properties: {
									'mix-blend-mode': '{{publisherBlendMode}}',
								},
							},
						],
					},
				},
				{ attributes: blockProps.attributes, ...blockProps }
			)
		);
	}

	generators.push(
		computedCssRules(
			{
				cssGenerators: {
					...(cssGenerators || {}),
				},
			},
			{ attributes: blockProps.attributes, ...blockProps }
		)
	);

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
