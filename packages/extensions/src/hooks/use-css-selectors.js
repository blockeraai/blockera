// @flow
/**
 * Publisher dependencies
 */
import { isFunction, isString, isUndefined } from '@publisher/utils';
import { prepare } from '@publisher/data-extractor';

/**
 * Internal dependencies
 */
import { useBlocksStore } from './use-blocks-store';
import { default as blockStates } from '../libs/block-states/states';
import type { TUseCssSelectorProps } from './types/css-selector-props';

export function useCssSelectors({
	query,
	blockName,
	supportId,
	fallbackSupportId,
}: TUseCssSelectorProps): Object {
	const root = '.{{BLOCK_ID}}';
	const states: Array<string> = Object.keys(blockStates);

	const getAllSelectors = (rootSelector: string) => {
		const selectors: Object = {};

		states.forEach((state: string): Object => {
			if ('normal' === state) {
				selectors[state] = rootSelector;
				return;
			}

			const cssCustomStates = [
				'parent-class',
				'custom-class',
				'parent-hover',
			];

			if (cssCustomStates.includes(state)) {
				return;
			}

			selectors[state] = `${rootSelector}:${state}`;
		});

		return selectors;
	};

	const { getBlockType } = useBlocksStore();

	if (isUndefined(blockName) || !isFunction(getBlockType)) {
		return getAllSelectors(root);
	}

	const { selectors } = getBlockType(blockName);

	if (isUndefined(selectors) || !Array.from(selectors).length) {
		return getAllSelectors(root);
	}

	if (!isUndefined(supportId)) {
		return getAllSelectors(
			prepareCssSelector({
				support: supportId,
				fallbackSupportId,
				selectors,
				query,
			})
		);
	}

	return getAllSelectors(
		prepareCssSelector({
			support: fallbackSupportId,
			selectors,
			query,
		})
	);
}

/**
 * Retrieve css selector with selectors dataset , support id and query string.
 *
 * @param {{support:string,selectors:Object,query:string,fallbackSupportId:string}} props
 *
 * @return {string} the css selector for support
 */
function prepareCssSelector(props: {
	support?: string,
	selectors: Object,
	query?: string,
	fallbackSupportId?: string,
}): string {
	const { support, selectors, query, fallbackSupportId } = props;

	//Fallback for feature support to return selector
	if (isUndefined(support) || isUndefined(selectors[support])) {
		return !isUndefined(fallbackSupportId)
			? prepareCssSelector({
					...props,
					support: fallbackSupportId,
					fallbackSupportId: undefined,
			  })
			: selectors.root;
	}

	//when query is not defined!
	if (isUndefined(query)) {
		return isString(selectors[support])
			? selectors[support]
			: selectors[support].root || selectors.root;
	}

	//Preparing selector with query of support.
	const selector = prepare(query, selectors);

	//Fallback for sub feature of support to return selector
	if (!selector) {
		return isString(selectors[support])
			? selectors[support]
			: selectors[support].root || selectors.root;
	}

	//Selector for sub feature of support
	return selector;
}
