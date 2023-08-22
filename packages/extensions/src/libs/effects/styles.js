/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';

/**
 * Internal dependencies
 */
import { FilterGenerator, TransitionGenerator } from './css-generators';
import { arrayEquals } from '../utils';
import { attributes } from './attributes';
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';

export function EffectsStyles({
	effectsConfig: {
		cssGenerators,
		publisherOpacity,
		publisherTransform,
		publisherTransition,
		publisherFilter,
		publisherBackdropFilter,
		publisherCursor,
		publisherBlendMode,
	},
}) {
	const blockProps = useContext(BlockEditContext);

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
									opacity: '{{publisherOpacity}}',
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
		isActiveField(publisherTransform) &&
		!arrayEquals(
			attributes.publisherTransform.default,
			blockProps.attributes.publisherTransform
		)
	) {
		const transformProperties = {};

		let transformProperty = blockProps.attributes.publisherTransform
			?.map((item) => {
				if (!item.isVisible) {
					return null;
				}

				switch (item.type) {
					case 'move':
						return `translate3d(${item['move-x']}, ${item['move-y']}, ${item['move-z']})`;

					case 'scale':
						return `scale3d(${item.scale}, ${item.scale}, 50%)`;

					case 'rotate':
						return `rotateX(${item['rotate-x']}) rotateY(${item['rotate-y']}) rotateZ(${item['rotate-z']})`;

					case 'skew':
						return `skew(${item['skew-x']}, ${item['skew-y']})`;
				}

				return null;
			})
			?.filter((item) => null !== item)
			.join(' ');

		if (blockProps.attributes.publisherTransformSelfPerspective) {
			transformProperty = `perspective(${blockProps.attributes.publisherTransformSelfPerspective}) ${transformProperty}`;
		}

		if (transformProperty) {
			transformProperties.transform = transformProperty;
		}

		if (
			!arrayEquals(
				attributes.publisherTransformSelfOrigin.default,
				blockProps.attributes.publisherTransformSelfOrigin
			)
		) {
			transformProperties[
				'transform-origin'
			] = `${blockProps.attributes.publisherTransformSelfOrigin?.top} ${blockProps.attributes.publisherTransformSelfOrigin?.left}`;
		}

		if (blockProps.attributes.publisherBackfaceVisibility) {
			transformProperties['backface-visibility'] =
				blockProps.attributes.publisherBackfaceVisibility;
		}

		if (blockProps.attributes.publisherTransformChildPerspective) {
			transformProperties.perspective =
				blockProps.attributes.publisherTransformChildPerspective !==
				'0px'
					? blockProps.attributes.publisherTransformChildPerspective
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
			] = `${blockProps.attributes.publisherTransformChildOrigin?.top} ${blockProps.attributes.publisherTransformChildOrigin?.left}`;
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
						...(publisherTransition?.cssGenerators || {}),
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
						...(publisherFilter?.cssGenerators || {}),
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
						...(publisherBackdropFilter?.cssGenerators || {}),
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
