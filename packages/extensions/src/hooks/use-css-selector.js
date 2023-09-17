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
import type { TUseCssSelectorProps } from './types/css-selector-props';

export function useCssSelector({
	query,
	blockName,
	supportId,
	fallbackSupportId,
}: TUseCssSelectorProps): string {
	const root = '.{{BLOCK_ID}}';

	const { getBlockType } = useBlocksStore();

	if (isUndefined(blockName) || !isFunction(getBlockType)) {
		return root;
	}

	const { selectors } = getBlockType(blockName);

	if (isUndefined(selectors) || !Array.from(selectors).length) {
		return root;
	}

	if (!isUndefined(supportId)) {
		return prepareCssSelector({
			support: supportId,
			fallbackSupportId,
			selectors,
			query,
		});
	}

	return prepareCssSelector({
		support: fallbackSupportId,
		selectors,
		query,
	});
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
