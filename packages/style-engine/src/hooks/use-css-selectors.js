// @flow
/**
 * Publisher dependencies
 */
import { prepare } from '@publisher/data-extractor';
import { useBlocksStore } from '@publisher/extensions/src/hooks';
import { isFunction, isString, isUndefined } from '@publisher/utils';
import type {
	InnerBlockModel,
	InnerBlockType,
} from '@publisher/extensions/src/libs/inner-blocks/types';
import { default as blockStates } from '@publisher/extensions/src/libs/block-states/states';

/**
 * Internal dependencies
 */
import type { TUseCssSelectorProps } from '../types';

export function useCssSelectors({
	query,
	blockName,
	supportId,
	innerBlocks,
	currentState,
	fallbackSupportId,
}: TUseCssSelectorProps): Object {
	const root = '.{{BLOCK_ID}}';
	const states: Array<string> = Object.keys(blockStates);

	const getAllSelectors = (rootSelector: string) => {
		const selectors: Object = {};

		states.forEach((state: string): Object => {
			selectors[state] = {
				master: '',
			};

			const registerSelectors = (
				blockType: 'master' | InnerBlockType,
				childSelectors: string = ''
			): void => {
				let concatenatedSelector = rootSelector;

				if (childSelectors) {
					concatenatedSelector = `${rootSelector} ${childSelectors}`;
				}

				if ('normal' === state) {
					selectors[state][blockType] = concatenatedSelector;
					return;
				}

				const cssCustomStates = [
					'parent-class',
					'custom-class',
					'parent-hover',
				];

				// FIXME: please implements css custom states support!
				// this are needs to use infrastructure api to handle.
				if (cssCustomStates.includes(state)) {
					return;
				}

				if ('normal' === currentState || state !== currentState) {
					selectors[state][
						blockType
					] = `${concatenatedSelector}:${state}`;
				} else {
					selectors[state][
						blockType
					] = `${concatenatedSelector},${concatenatedSelector}:${state}`;
				}
			};

			Object.values(innerBlocks)?.forEach(
				(innerBlock: InnerBlockModel): void => {
					if (
						!innerBlock?.selectors ||
						!Object.values(innerBlock?.selectors).length
					) {
						return;
					}

					const recursiveRegistration = (
						_selectors: Object
					): void => {
						Object.keys(_selectors).forEach(
							(selectorKey: string): void => {
								if ('undefined' === typeof _selectors) {
									return;
								}

								type SelectorType = string | Object | void;

								const rootOrFeatureSelector: SelectorType =
									_selectors[selectorKey];

								if ('object' === typeof rootOrFeatureSelector) {
									recursiveRegistration(
										rootOrFeatureSelector
									);
									return;
								}

								registerSelectors(
									innerBlock.type,
									rootOrFeatureSelector
								);
							}
						);
					};

					recursiveRegistration(innerBlock?.selectors);
				}
			);

			registerSelectors('master');
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
