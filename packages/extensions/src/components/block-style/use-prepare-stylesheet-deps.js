// @flow

/**
 * Internal dependencies
 */
import type {
	BreakpointTypes,
	TBreakpoint,
	TStates,
} from '../../libs/block-states/types';
import type { TBlockProps } from '../../libs/types';
import type { InnerBlockModel } from '../../libs/inner-blocks/types';
import { getCssRules, getSelector, convertToStringStyleRule } from './helpers';

export const usePrepareStylesheetDeps = (
	state: TStates | string,
	selectors: Array<Object>,
	blockProps: {
		...TBlockProps,
		activeDeviceType: TBreakpoint,
	}
): Array<string> => {
	const { attributes, clientId } = blockProps;
	const currentState = attributes?.publisherBlockStates?.find(
		({ type }: { type: TStates }): boolean => type === state
	);

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

	currentState.breakpoints.forEach((breakpoint: BreakpointTypes): void => {
		if (!breakpoint?.attributes) {
			return;
		}

		stack.push(
			convertToStringStyleRule({
				cssRules: getCssRules(breakpoint?.attributes, blockProps).join(
					'\n'
				),
				selector,
			})
		);

		breakpoint?.attributes?.publisherInnerBlocks?.forEach(
			(innerBlock: InnerBlockModel): void => {
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
			}
		);
	});

	return stack.filter((item: string): boolean => item);
};
