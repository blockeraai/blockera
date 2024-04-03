// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

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
import { getSelector } from './utils';
import type { NormalizedSelectorProps } from './types';
import { isNormalState } from '@publisher/extensions/src/components';

export function getCssSelector({
	state,
	query,
	support,
	clientId,
	currentBlock,
	blockSelectors,
	className = '',
	suffixClass = '',
	fallbackSupportId,
}: NormalizedSelectorProps): string {
	const { getDeviceType } = select('publisher-core/editor');
	const deviceType = getDeviceType();
	const rootSelector =
		'laptop' === deviceType
			? '{{BLOCK_ID}}'
			: `.is-${deviceType}-preview {{BLOCK_ID}}`;

	const selectors: {
		[key: TStates]: {
			[key: 'master' | InnerBlockType | string]: string,
		},
	} = {};
	const excludedPseudoClasses = [
		'normal',
		'parent-class',
		'custom-class',
		'parent-hover',
	];
	const { getSelectedBlock } = select('core/block-editor');
	const { getExtensionInnerBlockState, getExtensionCurrentBlockState } =
		select('publisher-core/extensions');

	// primitive block value.
	let block: Object = {};

	if ('function' === typeof getSelectedBlock) {
		block = getSelectedBlock();
	}

	const register = (_selector: string): void => {
		_selector = _selector.trim();

		// Assume selector is invalid.
		if (!_selector) {
			// we try to use parent or custom css class if exists!
			if (
				['parent-class', 'custom-class'].includes(state) &&
				block?.attributes?.publisherBlockStates[state]
			) {
				_selector =
					block?.attributes?.publisherBlockStates[state]['css-class'];

				if (_selector.trim()) {
					if ('parent-class' === state) {
						_selector = `${_selector} ${rootSelector}${suffixClass}`;
					}

					selectors[state] = {
						// $FlowFixMe
						[currentBlock]: _selector,
					};

					return;
				}
			}

			selectors[state] = {
				// $FlowFixMe
				[currentBlock]: rootSelector + suffixClass,
			};

			return;
		}

		_selector = rootSelector === _selector ? rootSelector : _selector;

		if (isInnerBlock(currentBlock)) {
			_selector = `${rootSelector} ${_selector}`;
		}

		// if state not equals with any one of excluded pseudo-class
		if (!excludedPseudoClasses.includes(state)) {
			if (
				(isInnerBlock(currentBlock) &&
					!isNormalState(getExtensionInnerBlockState())) ||
				!isNormalState(getExtensionCurrentBlockState())
			) {
				_selector = `${_selector}:${state}${suffixClass}, ${_selector}${suffixClass}`;
			} else {
				_selector = `${_selector}:${state}${suffixClass}`;
			}
		}

		switch (state) {
			case 'parent-class':
				if (block?.attributes?.publisherBlockStates[state]) {
					_selector = `${block?.attributes?.publisherBlockStates[state]['css-class']} ${_selector}`;
				}
				break;
			case 'custom-class':
				if (block?.attributes?.publisherBlockStates[state]) {
					_selector =
						block?.attributes?.publisherBlockStates[state][
							'css-class'
						] +
						suffixClass +
						',' +
						_selector;
				}
				break;

			case 'parent-hover':
				// FIXME: implements parent-hover pseudo-class for parent selector.
				break;
		}

		selectors[state] = {
			// $FlowFixMe
			[currentBlock]: _selector,
		};
	};

	const selector = prepareCssSelector({
		query,
		support,
		fallbackSupportId,
		selectors: blockSelectors,
	});

	// FIXME: after implements parent-hover infrastructure please remove exclude this pseudo-class!
	if (!selector || ['parent-hover'].includes(state)) {
		register(rootSelector);

		return (
			getSelector({
				state,
				clientId,
				selectors,
				className,
				currentBlock,
			}) + suffixClass
		);
	}

	const explodedSelectors = selector.split(',');

	if (!explodedSelectors.length) {
		return (
			getSelector({
				state,
				clientId,
				selectors,
				className,
				currentBlock,
			}) + suffixClass
		);
	}

	explodedSelectors.forEach(register);

	return (
		getSelector({
			state,
			clientId,
			selectors,
			className,
			currentBlock,
		}) + suffixClass
	);
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
