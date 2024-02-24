// @flow
/**
 * Publisher dependencies
 */
import { prepare } from '@publisher/data-extractor';
import { isInnerBlock } from '@publisher/extensions';
import { isString, isUndefined } from '@publisher/utils';
import type { TStates } from '@publisher/extensions/src/libs/block-states/types';
import type { InnerBlockType } from '@publisher/extensions/src/libs/inner-blocks/types';

/**
 * Internal dependencies
 */
import { getSelector } from '../utils';
import type { NormalizedSelectorProps } from '../types';

export function getCssSelector({
	state,
	query,
	support,
	clientId,
	currentBlock,
	blockSelectors,
	className = '',
	fallbackSupportId,
}: NormalizedSelectorProps): string {
	const rootSelector = '{{BLOCK_ID}}';
	const selectors: {
		[key: TStates]: {
			[key: 'master' | InnerBlockType | string]: string,
		},
	} = {};

	// FIXME: implements below infrastructure!
	if (['parent-class', 'parent-hover', 'custom-class'].includes(state)) {
		return getSelector({
			state,
			clientId,
			selectors,
			className,
			currentBlock,
		});
	}

	const register = (_selector: string): void => {
		_selector = _selector.trim();

		// Assume selector is invalid.
		if (!_selector) {
			selectors[state] = {
				// $FlowFixMe
				[currentBlock]: rootSelector,
			};

			return;
		}

		_selector = rootSelector === _selector ? rootSelector : _selector;

		if (isInnerBlock(currentBlock)) {
			_selector = `${rootSelector} ${_selector}`;
		}

		const prevSelector = selectors[state]
			? selectors[state][currentBlock] || ''
			: '';

		if ('normal' !== state) {
			_selector = `${_selector}:${state}`;
		}

		selectors[state] = {
			// $FlowFixMe
			[currentBlock]: prevSelector
				? `${prevSelector}, ${_selector}`
				: _selector,
		};
	};

	const selector = prepareCssSelector({
		query,
		support,
		fallbackSupportId,
		selectors: blockSelectors,
	});

	if (!selector) {
		return getSelector({
			state,
			clientId,
			selectors,
			className,
			currentBlock,
		});
	}

	const explodedSelectors = selector.split(',');

	if (!explodedSelectors.length) {
		return getSelector({
			state,
			clientId,
			selectors,
			className,
			currentBlock,
		});
	}

	explodedSelectors.forEach(register);

	return getSelector({
		state,
		clientId,
		selectors,
		className,
		currentBlock,
	});
}

/**
 * Retrieve css selector with selectors dataset , support id and query string.
 *
 * @param {{support:string,selectors:Object,query:string,fallbackSupportId:string}} props
 *
 * @return {string} the css selector for support
 */
export function prepareCssSelector(props: {
	support?: string,
	selectors: Object,
	query?: string,
	fallbackSupportId?: string,
}): string | void {
	const { support, selectors, query, fallbackSupportId } = props;

	//Preparing selector with query of support.
	const selector = prepare(query, selectors);

	//Fallback for sub feature of support to return selector
	if (!selector) {
		if (isUndefined(support) || isUndefined(selectors[support])) {
			return !isUndefined(fallbackSupportId)
				? prepareCssSelector({
						...props,
						support: fallbackSupportId,
						fallbackSupportId: undefined,
				  })
				: selectors.root;
		}

		return isString(selectors[support])
			? selectors[support]
			: selectors[support].root || selectors.root;
	}

	//Selector for sub feature of support
	return selector;
}
