/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';
import { BlockEditContext } from '@publisher/extensions';

/**
 * Internal dependencies
 */
import { backgroundCSSGenerator } from './css-generator';

export function BackgroundFieldStyle(Filter) {
	const blockProps = useContext(BlockEditContext);

	return computedCssRules(
		{
			cssGenerators: {
				publisherBackground: [
					{
						type: 'function',
						function: backgroundCSSGenerator,
					},
				],
				...(Filter?.cssGenerators || {}),
			},
		},
		blockProps
	);
}
