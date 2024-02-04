// @flow
/**
 * Publisher dependencies
 */
import type { GeneratorReturnType } from '@publisher/style-engine/src/types';

/**
 * Internal dependencies
 */
import type { TBlockProps } from '../types';

interface IConfigs {
	extensionConfig: {
		publisherCSSProperties: boolean,
	};
	blockProps: TBlockProps;
	selector: string;
	media: string;
}

export function CustomStyleStyles({}: IConfigs): Array<GeneratorReturnType> {
	// const { attributes } = blockProps;
	//
	const generators: Array<Object> = [];
	//
	// const properties: Object = {};

	// if (Object.keys(properties).length > 0) {
	// 	generators.push(
	// 		computedCssRules(
	// 			{
	// 				publisherPosition: [
	// 					{
	// 						type: 'static',
	// 						media,
	// 						selector,
	// 						properties,
	// 					},
	// 				],
	// 			},
	// 			blockProps
	// 		)
	// 	);
	// }
	//
	// generators.push(
	// 	computedCssRules(
	// 		{
	// 			...(cssGenerators || {}),
	// 		},
	// 		blockProps
	// 	)
	// );

	return generators.flat();
}
