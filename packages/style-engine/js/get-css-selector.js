// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { prepare } from '@blockera/data-editor';
import { isString, isUndefined } from '@blockera/utils';
import { isInnerBlock } from '@blockera/editor-extensions/js/components/utils';
import type { TStates } from '@blockera/editor-extensions/js/libs/block-states/types';
import type { InnerBlockType } from '@blockera/editor-extensions/js/libs/inner-blocks/types';

/**
 * Internal dependencies
 */
import { getSelector } from './utils';
import type { NormalizedSelectorProps } from './types';
import { isNormalState } from '@blockera/editor-extensions/js/components';

export const getCssSelector = ({
	state,
	query,
	support,
	clientId,
	currentBlock,
	blockSelectors,
	className = '',
	suffixClass = '',
	device = 'laptop',
	fallbackSupportId,
}: NormalizedSelectorProps): string => {
	const rootSelector =
		'laptop' === device
			? '{{BLOCK_ID}}'
			: `.is-${device}-preview {{BLOCK_ID}}`;

	const selectors: {
		[key: TStates]: {
			[key: 'master' | InnerBlockType | string]: string,
		},
	} = {};
	const customizedPseudoClasses = [
		'normal',
		'parent-class',
		'custom-class',
		'parent-hover',
	];
	const { getSelectedBlock } = select('core/block-editor');
	const {
		getExtensionCurrentBlock,
		getExtensionInnerBlockState,
		getExtensionCurrentBlockState,
	} = select('blockera-core/extensions');

	// primitive block value.
	let block: Object = {};

	if ('function' === typeof getSelectedBlock) {
		block = getSelectedBlock();
	}

	const register = (_selector: string): void => {
		const registerSelector = (generatedSelector: string) => {
			switch (state) {
				case 'parent-class':
					if (block?.attributes?.blockeraBlockStates[state]) {
						generatedSelector = `${block?.attributes?.blockeraBlockStates[state]['css-class']} ${generatedSelector}`;
					}
					break;
				case 'custom-class':
					if (block?.attributes?.blockeraBlockStates[state]) {
						generatedSelector =
							block?.attributes?.blockeraBlockStates[state][
								'css-class'
							] +
							suffixClass +
							',' +
							generatedSelector;
					}
					break;

				case 'parent-hover':
					// FIXME: implements parent-hover pseudo-class for parent selector.
					break;
			}

			selectors[state] = {
				// $FlowFixMe
				[currentBlock]: generatedSelector,
			};
		};

		const normalizedSelector = (
			fromInnerBlock: boolean = false
		): string => {
			const parsedSelectors = _selector.split(',');
			const generateSelector = (selector: string): string => {
				// Current Block is inner block.
				if (fromInnerBlock) {
					// Recieved state is not normal and recieved state is not one of customizedPseudoClasses.
					// because customizedPseudoClasses by default not supported in css.
					if (
						!isNormalState(state) &&
						!customizedPseudoClasses.includes(state)
					) {
						// Master block is not normal.
						if (!isNormalState(getExtensionCurrentBlockState())) {
							// Assume recieved state equals with master block real state.
							if (
								state === getExtensionCurrentBlockState() &&
								isInnerBlock(getExtensionCurrentBlock())
							) {
								return `${rootSelector}:${state} ${selector}${suffixClass}:${state}, ${rootSelector} ${selector}${suffixClass}`;
							}

							// Assume real current block is master.
							if (!isInnerBlock(getExtensionCurrentBlock())) {
								return `${rootSelector} ${selector}${suffixClass}:${state}`;
							}

							return `${rootSelector}:${state} ${selector}${suffixClass}:${state}`;
						}

						// Assume recieved state equals with inner block real state.
						if (
							state === getExtensionInnerBlockState() &&
							isInnerBlock(getExtensionCurrentBlock())
						) {
							return `${rootSelector} ${selector}${suffixClass}:${state}, ${rootSelector} ${selector}${suffixClass}`;
						}

						return `${rootSelector} ${selector}${suffixClass}:${state}`;
					}

					// Assume active master block state is not normal and recieved state is not one of customizedPseudoClasses.
					// because customizedPseudoClasses by default not supported in css.
					if (
						!isNormalState(getExtensionCurrentBlockState()) &&
						!customizedPseudoClasses.includes(state)
					) {
						return `${rootSelector}:${state} ${selector}${suffixClass}, ${rootSelector} ${selector}${suffixClass}`;
					}

					return `${rootSelector} ${selector}${suffixClass}`;
				}

				// Recieved state is not normal and recieved state is not one of customizedPseudoClasses.
				// because customizedPseudoClasses by default not supported in css.
				if (
					!isNormalState(state) &&
					!customizedPseudoClasses.includes(state)
				) {
					// Assume active master block state is not normal.
					if (
						!isNormalState(getExtensionCurrentBlockState()) &&
						state === getExtensionCurrentBlockState()
					) {
						return `${selector}${suffixClass}:${state}, ${selector}${suffixClass}`;
					}

					return `${selector}${suffixClass}:${state}`;
				}

				return `${selector}${suffixClass}`;
			};

			if (1 === parsedSelectors.length) {
				return generateSelector(_selector);
			}

			return parsedSelectors
				.map((selector: string): string => generateSelector(selector))
				.join(', ');
		};

		// Assume selector is invalid.
		if (!_selector) {
			// we try to use parent or custom css class if exists!
			if (
				['parent-class', 'custom-class'].includes(state) &&
				block?.attributes?.blockeraBlockStates[state]
			) {
				_selector =
					block?.attributes?.blockeraBlockStates[state]['css-class'];

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

		// Assume current block is one of inners type.
		if (isInnerBlock(currentBlock)) {
			switch (state) {
				case 'custom-class':
				case 'parent-class':
					// TODO:
					break;
				case 'parent-hover':
					// TODO:
					break;
				default:
					registerSelector(normalizedSelector(true));
					break;
			}
		}
		// Current block is master.
		else {
			switch (state) {
				case 'custom-class':
				case 'parent-class':
					// TODO:
					break;
				case 'parent-hover':
					// TODO:
					break;
				default:
					registerSelector(normalizedSelector());
					break;
			}
		}
	};

	// preparing css selector from support path as key in block selectors map as object.
	// eslint-disable-next-line @wordpress/no-unused-vars-before-return
	const selector = prepareCssSelector({
		query,
		support,
		fallbackSupportId,
		selectors: blockSelectors,
	});

	// FIXME: after implements parent-hover infrastructure please remove exclude this pseudo-class!
	if (['parent-hover'].includes(state)) {
		// TODO: implements ...
		return '';
	}

	if (selector && selector.trim()) {
		register(selector);
	} else {
		register(rootSelector);
	}

	return getSelector({
		state,
		clientId,
		selectors,
		className,
		currentBlock,
	});
};

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
