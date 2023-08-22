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
import { arrayEquals } from '../utils';
import { attributes } from './attributes';
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';
import { backgroundGenerator, backgroundClipGenerator } from './css-generators';

export function BackgroundStyles({
	backgroundConfig: {
		cssGenerators,
		publisherBackground,
		publisherBackgroundColor,
		publisherBackgroundClip,
	},
}) {
	const blockProps = useContext(BlockEditContext);

	const generators = [];

	if (
		isActiveField(publisherBackground) &&
		!arrayEquals(
			attributes.publisherBackground.default,
			blockProps.attributes.publisherBackground
		)
	) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherBackground: [
							{
								type: 'function',
								function: backgroundGenerator,
							},
						],
						...(publisherBackground?.cssGenerators || {}),
					},
				},
				blockProps
			)
		);
	}

	if (
		isActiveField(publisherBackgroundColor) &&
		blockProps.attributes.publisherBackgroundColor !==
			attributes.publisherBackgroundColor.default
	) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherBackgroundColor: [
							{
								type: 'static',
								selector: '.{{BLOCK_ID}}',
								properties: {
									'background-color':
										'{{publisherBackgroundColor}}',
								},
							},
						],
					},
				},
				blockProps
			)
		);
	}

	if (
		isActiveField(publisherBackgroundClip) &&
		blockProps.attributes.publisherBackgroundClip !==
			attributes.publisherBackgroundClip.default
	) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherBackgroundClip: [
							{
								type: 'function',
								function: backgroundClipGenerator,
							},
						],
						...(publisherBackgroundClip?.cssGenerators || {}),
					},
				},
				blockProps
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
			blockProps
		)
	);

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
