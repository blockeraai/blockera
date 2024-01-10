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
	iconConfig: {
		cssGenerators: Object,
	};
	blockProps: TBlockProps;
}

export function IconStyles({
	iconConfig: { cssGenerators },
	blockProps,
}: IConfigs): string {
	const generators = [];

	generators.push(
		computedCssRules(
			{
				...(cssGenerators || {}),
			},
			blockProps
		)
	);

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
