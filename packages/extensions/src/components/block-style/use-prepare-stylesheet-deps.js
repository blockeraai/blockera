// @flow

/**
 * Internal dependencies
 */
import type { BreakpointTypes, TStates } from '../../libs/block-states/types';
import type { TBlockProps } from '../../libs/types';
import type {
	InnerBlockModel,
	InnerBlockType,
} from '../../libs/inner-blocks/types';
import { getCssRules, getSelector, convertToStringStyleRule } from './helpers';

export const usePrepareStylesheetDeps = (
	state: TStates | string,
	selectors: {
		[key: 'root' | TStates | string]: {
			[key: 'master' | InnerBlockType]: string,
		},
	},
	blockProps: TBlockProps
): Array<string> => {
	const { attributes, clientId } = blockProps;
	const currentState = attributes?.publisherBlockStates[state];

	if (!currentState) {
		return [];
	}

	const stack = [];

	const selector = getSelector({
		state,
		clientId,
		selectors,
		currentBlock: 'master',
		className: attributes?.className,
	});

	Object.values(currentState.breakpoints).forEach(
		(breakpoint: BreakpointTypes): void => {
			if (!breakpoint?.attributes) {
				return;
			}

			stack.push(
				convertToStringStyleRule({
					cssRules: getCssRules(
						breakpoint?.attributes,
						blockProps
					).join('\n'),
					selector,
				})
			);

			if (!breakpoint?.attributes?.publisherInnerBlocks) {
				// $FlowFixMe
				return stack.filter((item: string): boolean => !!item);
			}

			Object.values(
				breakpoint?.attributes?.publisherInnerBlocks
			)?.forEach((innerBlock: InnerBlockModel): void => {
				if (!innerBlock?.attributes) {
					return;
				}

				stack.push(
					convertToStringStyleRule({
						cssRules: getCssRules(
							innerBlock?.attributes,
							blockProps
						).join('\n'),
						selector: selector + ' cite',
					})
				);
			});
		}
	);

	// $FlowFixMe
	return stack.filter((item: string): boolean => item);
};
