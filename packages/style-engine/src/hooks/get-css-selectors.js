// @flow
/**
 * Publisher dependencies
 */
import { prepare } from '@publisher/data-extractor';
import { isString, isUndefined } from '@publisher/utils';
import type { TStates } from '@publisher/extensions/src/libs/block-states/types';
import type { InnerBlockType } from '@publisher/extensions/src/libs/inner-blocks/types';

/**
 * Internal dependencies
 */
import type { TUseCssSelectorsProps, TUseCssSelectors } from '../types';

export function getCssSelectors({
	query,
	supportId,
	currentBlock,
	currentState,
	blockSelectors,
	fallbackSupportId,
}: TUseCssSelectorsProps): TUseCssSelectors {
	const root = '.{{BLOCK_ID}}';
	const selectors: {
		[key: TStates]: {
			[key: 'master' | InnerBlockType | string]: string,
		},
	} = {};

	// FIXME: implements below infrastructure!
	if (
		['parent-class', 'parent-hover', 'custom-class'].includes(currentState)
	) {
		return selectors;
	}

	const registerSelector = (rootSelector: string) => {
		const register = (selector: string): void => {
			selector = selector.trim();

			if (!selector) {
				return;
			}

			let concatenatedSelector =
				root === selector ? root : `${root} ${selector}`;

			const prevSelector = selectors[currentState]
				? selectors[currentState][currentBlock] || ''
				: '';

			if ('normal' !== currentState) {
				concatenatedSelector = `${concatenatedSelector}:${currentState}`;
			}

			selectors[currentState] = {
				// $FlowFixMe
				[currentBlock]: prevSelector
					? `${prevSelector}, ${concatenatedSelector}`
					: concatenatedSelector,
			};
		};

		const explodedSelectors = rootSelector.split(',');

		if (explodedSelectors.length) {
			explodedSelectors.forEach(register);
			return;
		}

		if (!rootSelector.trim()) {
			return;
		}

		register(rootSelector);
	};

	if (
		isUndefined(blockSelectors) ||
		!Object.values(blockSelectors).length ||
		(!query && !supportId && !fallbackSupportId)
	) {
		registerSelector(root);

		return selectors;
	}

	if (!isUndefined(supportId)) {
		registerSelector(
			prepareCssSelector({
				support: supportId,
				fallbackSupportId,
				selectors: blockSelectors,
				query,
			})
		);

		return selectors;
	}

	registerSelector(
		prepareCssSelector({
			support: fallbackSupportId,
			selectors: blockSelectors,
			query,
		})
	);

	return selectors;
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
