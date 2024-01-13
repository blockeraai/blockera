// @flow
/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';
import type { GeneratorReturnType } from '@publisher/style-engine/src/types';

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
}: IConfigs): Array<GeneratorReturnType> {
	const generators = [];

	generators.push(
		computedCssRules(
			{
				...(cssGenerators || {}),
			},
			blockProps
		)
	);

	return generators.flat();
}
