// @flow
/**
 * Blockera dependencies
 */
import { computedCssRules } from '@blockera/style-engine';
import type { GeneratorReturnType } from '@blockera/style-engine/js/types';

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
