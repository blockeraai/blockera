/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { attributes } from './attributes';
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';
import { computedCssRules } from '@publisher/style-engine';

export function EffectsStyles({
	effectsConfig: {
		cssGenerators,
		publisherCursor,
		publisherOpacity,
		// publisherTransition,
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
									opacity: '{{publisherOpacity}}%',
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
