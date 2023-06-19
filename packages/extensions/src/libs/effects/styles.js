/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';
import {
	TransitionFieldStyle,
	FilterFieldStyle,
	BackdropFilterFieldStyle,
} from '@publisher/fields';

/**
 * Internal dependencies
 */
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
	const { attributes: _attributes, ...blockProps } =
		useContext(BlockEditContext);

	const generators = [];

	if (
		isActiveField(publisherOpacity) &&
		_attributes.publisherOpacity !== attributes.publisherOpacity.default
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
				{ attributes: _attributes, ...blockProps }
			)
		);
	}

	if (
		isActiveField(publisherTransform) &&
		!arrayEquals(
			attributes.publisherTransform.default,
			_attributes.publisherTransform
		)
	) {
		const transformProperties = {};

		let transformProperty = _attributes.publisherTransform
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

		if (_attributes.publisherTransformSelfPerspective) {
			transformProperty = `perspective(${_attributes.publisherTransformSelfPerspective}) ${transformProperty}`;
		}

		if (transformProperty) {
			transformProperties.transform = transformProperty;
		}

		if (
			!arrayEquals(
				attributes.publisherTransformSelfOrigin.default,
				_attributes.publisherTransformSelfOrigin
			)
		) {
			transformProperties[
				'transform-origin'
			] = `${_attributes.publisherTransformSelfOrigin?.top} ${_attributes.publisherTransformSelfOrigin?.left}`;
		}

		if (_attributes.publisherBackfaceVisibility) {
			transformProperties['backface-visibility'] =
				_attributes.publisherBackfaceVisibility;
		}

		if (_attributes.publisherTransformChildPerspective) {
			transformProperties.perspective =
				_attributes.publisherTransformChildPerspective !== '0px'
					? _attributes.publisherTransformChildPerspective
					: 'none';
		}

		if (
			!arrayEquals(
				attributes.publisherTransformChildOrigin.default,
				_attributes.publisherTransformChildOrigin
			)
		) {
			transformProperties[
				'perspective-origin'
			] = `${_attributes.publisherTransformChildOrigin?.top} ${_attributes.publisherTransformChildOrigin?.left}`;
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
					{ attributes: _attributes, ...blockProps }
				)
			);
		}
	}

	if (
		isActiveField(publisherTransition) &&
		!arrayEquals(
			attributes.publisherTransition.default,
			_attributes.publisherTransition
		)
	) {
		generators.push(TransitionFieldStyle(publisherTransition));
	}

	if (
		isActiveField(publisherFilter) &&
		!arrayEquals(
			attributes.publisherFilter.default,
			_attributes.publisherFilter
		)
	) {
		generators.push(FilterFieldStyle(publisherFilter));
	}

	if (
		isActiveField(publisherBackdropFilter) &&
		!arrayEquals(
			attributes.publisherBackdropFilter.default,
			_attributes.publisherBackdropFilter
		)
	) {
		generators.push(BackdropFilterFieldStyle(publisherBackdropFilter));
	}

	if (
		isActiveField(publisherCursor) &&
		_attributes.publisherCursor !== attributes.publisherCursor.default
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
				{ attributes: _attributes, ...blockProps }
			)
		);
	}

	if (
		isActiveField(publisherBlendMode) &&
		_attributes.publisherBlendMode !== attributes.publisherBlendMode.default
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
				{ attributes: _attributes, ...blockProps }
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
			{ attributes: _attributes, ...blockProps }
		)
	);

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
