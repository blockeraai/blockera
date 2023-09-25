// @flow
/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';

/**
 * Internal dependencies
 */
import type { TBlockProps } from '../types';

interface IConfigs {
	advancedConfig: {
		cssGenerators: Object,
	};
	blockProps: TBlockProps;
}

export function AdvancedStyles({
	advancedConfig: { cssGenerators },
	blockProps,
}: IConfigs): string {
	const generators = [];

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
