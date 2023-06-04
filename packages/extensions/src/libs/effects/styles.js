/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';
import { TransitionFieldStyle } from '@publisher/fields';

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
		publisherCursor,
		publisherOpacity,
		publisherBlendMode,
		publisherTransition,
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

	if (
		isActiveField(publisherTransition) &&
		!arrayEquals(
			attributes.publisherTransition.default,
			_attributes.publisherTransition
		)
	) {
		generators.push(TransitionFieldStyle(publisherTransition));
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

	//TODO: Please, implements publisherTransition and publisherAnglePicker css generators!

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
