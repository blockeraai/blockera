// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isInnerBlock } from '../extensions/components/utils';
import type { TStates } from '../extensions/libs/block-card/block-states/types';
import { isEmpty, isUndefined, union, isObject } from '@blockera/utils';
import type { InnerBlockType } from '../extensions/libs/block-card/inner-blocks/types';

/**
 * Internal dependencies
 */
import { replaceVariablesValue } from './utils';
import type { NormalizedSelectorProps } from './types';
import { isNormalState } from '../extensions/components';
import { getBlockCSSSelector } from './get-block-css-selector';

/**
 * Returns the appropriate state symbol for the given state.
 *
 * @param {TStates} state - The state to get the symbol for.
 * @return {string} The appropriate state symbol for the given state.
 */
export const getStateSymbol = (state: TStates): string => {
	return ['marker', 'placeholder', 'before', 'after'].includes(state)
		? '::'
		: ':';
};

/**
 * Generates a CSS selector based on the provided state, suffix, and whether the block is an inner block or outer block.
 * It also accounts for customized pseudo-classes and normal/non-normal states.
 * Additionally, supports selectors starting with '&', which are replaced with the root selector.
 *
 * @param {string} selector - The base CSS selector string, can be a comma-separated list of selectors.
 * @param {Object} options - Configuration object for generating the selector.
 * @param {TStates} options.state - The current state of the block (e.g., 'normal', 'hover', 'active').
 * @param {string} options.suffixClass - A suffix to append to the selector (e.g., '--modified').
 * @param {TStates} [options.masterState] - The state of the parent/master block if applicable.
 * @param {string} options.rootSelector - The root block selector used when dealing with inner blocks.
 * @param {function(): TStates} options.getInnerState - Function that returns the current state of the inner block.
 * @param {function(): TStates} options.getMasterState - Function that returns the current state of the master block.
 * @param {boolean} [options.fromInnerBlock=false] - A flag indicating if the current block is an inner block.
 * @param {Array<string>} options.customizedPseudoClasses - Array of customized pseudo-classes that should not be altered (e.g., 'parent-class', 'custom-class').
 *
 * @return {string} - The final normalized CSS selector string, adjusted based on the state, suffix, and inner/outer block context.
 *
 * @example
 * // Normal state with suffix class
 * normalizedSelector('.my-element', {
 *   state: 'normal',
 *   suffixClass: '--modified',
 *   rootSelector: '.root',
 *   getInnerState: () => 'normal',
 *   getMasterState: () => 'normal',
 *   customizedPseudoClasses: ['parent-class', 'custom-class', 'parent-hover'],
 * });
 * // Returns: '.my-element--modified'
 *
 * @example
 * // Non-normal state with inner block and master state
 * normalizedSelector('.my-element', {
 *   state: 'hover',
 *   masterState: 'active',
 *   suffixClass: '--modified',
 *   rootSelector: '.root',
 *   getInnerState: () => 'hover',
 *   getMasterState: () => 'active',
 *   fromInnerBlock: true,
 *   customizedPseudoClasses: ['parent-class', 'custom-class', 'parent-hover'],
 * });
 * // Returns: '.root:active .my-element--modified:hover'
 */
export const getNormalizedSelector = (
	selector: string,
	options: {
		state: TStates,
		suffixClass: string,
		masterState?: TStates,
		rootSelector: string,
		fromInnerBlock?: boolean,
		getInnerState: () => TStates,
		getMasterState: () => TStates,
		currentStateHasSelectors: boolean,
		customizedPseudoClasses: Array<string>,
	}
): string => {
	if (isEmpty(selector)) {
		return selector;
	}

	const {
		state,
		suffixClass,
		masterState,
		rootSelector,
		getInnerState,
		getMasterState,
		fromInnerBlock = false,
		customizedPseudoClasses,
		currentStateHasSelectors,
	} = options;
	const parsedSelectors = selector.split(',');
	const { getState, getInnerState: _getInnerState } =
		select('blockera/editor') || {};
	const {
		settings: { hasContent },
	} = getState(state) ||
		_getInnerState(state) || {
			settings: { hasContent: false },
		};
	let isProcessedSelector = false;

	// Replace '&' with the rootSelector and trim unnecessary spaces
	const processAmpersand = (selector: string): string => {
		if (/^{{BLOCK_ID}}&/.test(selector)) {
			return selector.replace(/^{{BLOCK_ID}}&/, '{{BLOCK_ID}}');
		}

		// Handle selectors starting with &&
		if (selector.trim().startsWith('&&')) {
			isProcessedSelector = true;
			// Extract the first part of the root selector (everything before the first space)
			const rootFirstPart = rootSelector.split(' ')[0];
			return `${rootFirstPart}${selector.trim().substring(2)}`;
		}

		if (selector.trim().startsWith('&')) {
			isProcessedSelector = true;

			return `${rootSelector}${selector.trim().substring(1)}`;
		}

		return selector.trim();
	};

	// Helper to generate the appropriate selector string based on various states.
	const generateSelector = (selector: string): string => {
		const innerStateType = getInnerState();
		const masterStateType = getMasterState();

		// Current Block is inner block.
		if (fromInnerBlock) {
			const spacer = isProcessedSelector ? '' : ' ';

			// Assume inner block inside pseudo-state of master.
			if (masterState && !isNormalState(masterState)) {
				if (!isNormalState(state)) {
					if (
						!isNormalState(masterStateType) &&
						masterState === masterStateType &&
						!isNormalState(innerStateType) &&
						state === innerStateType
					) {
						// If current state has selectors, we should return the selector as is with master state.
						if (currentStateHasSelectors) {
							// If current state has content, we should return the selector as is with master state.
							if (hasContent) {
								return `${rootSelector}${getStateSymbol(
									masterState
								)}${masterState}${spacer}${selector}${suffixClass}`;
							}

							return `${rootSelector}${getStateSymbol(
								masterState
							)}${masterState}${spacer}${selector}${suffixClass}, ${rootSelector}${spacer}${selector}${suffixClass}`;
						}

						// If current state has content, we should return the selector as is with master state and state.
						if (hasContent) {
							return `${rootSelector}${getStateSymbol(
								masterState
							)}${masterState}${spacer}${selector}${suffixClass}${getStateSymbol(
								state
							)}${state}`;
						}

						return `${rootSelector}${getStateSymbol(
							masterState
						)}${masterState}${spacer}${selector}${suffixClass}${getStateSymbol(
							state
						)}${state}, ${rootSelector}${spacer}${selector}${suffixClass}`;
					}

					// If current state has selectors, we should return the selector as is with master state.
					if (currentStateHasSelectors) {
						return `${rootSelector}${getStateSymbol(
							masterState
						)}${masterState}${spacer}${selector}${suffixClass}`;
					}

					return `${rootSelector}${getStateSymbol(
						masterState
					)}${masterState}${spacer}${selector}${suffixClass}${getStateSymbol(
						state
					)}${state}`;
				}

				return `${rootSelector}${getStateSymbol(
					masterState
				)}${masterState}${spacer}${selector}${suffixClass}`;
			}

			if (!isNormalState(state) && masterState) {
				if (
					!isNormalState(innerStateType) &&
					state === innerStateType
				) {
					// If current state has selectors, return selector as is,
					// Otherwise append state to selector and also include base selector.
					if (currentStateHasSelectors) {
						return `${rootSelector}${spacer}${selector}${suffixClass}`;
					}

					if (hasContent) {
						return `${rootSelector}${spacer}${selector}${suffixClass}${getStateSymbol(
							state
						)}${state}`;
					}

					return `${rootSelector}${spacer}${selector}${suffixClass}${getStateSymbol(
						state
					)}${state}, ${rootSelector}${spacer}${selector}${suffixClass}`;
				}

				// If current state has selectors, return selector as is.
				if (currentStateHasSelectors) {
					return `${rootSelector}${spacer}${selector}${suffixClass}`;
				}

				return `${rootSelector}${spacer}${selector}${suffixClass}${getStateSymbol(
					state
				)}${state}`;
			}

			return `${rootSelector}${spacer}${selector}${suffixClass}`;
		}

		// If current state has selectors, we should return the selector as is.
		if (currentStateHasSelectors) {
			return `${selector}${suffixClass}`;
		}

		// Received state is not normal.
		if (!isNormalState(state)) {
			// Assume active master block state is not normal.
			if (!isNormalState(masterStateType) && state === masterStateType) {
				if (hasContent) {
					return `${selector}${suffixClass}${getStateSymbol(
						state
					)}${state}`;
				}

				return `${selector}${suffixClass}${getStateSymbol(
					state
				)}${state}, ${selector}${suffixClass}`;
			}

			return `${selector}${suffixClass}${getStateSymbol(state)}${state}`;
		}

		return `${selector}${suffixClass}`;
	};

	// Handle single selector case.
	if (parsedSelectors.length === 1) {
		const processedSelector = processAmpersand(selector);

		return customizedPseudoClasses.includes(state)
			? processedSelector
			: generateSelector(processedSelector);
	}

	// Handle multiple selectors.
	return parsedSelectors
		.map((selector) => {
			const processedSelector = processAmpersand(selector);
			return customizedPseudoClasses.includes(state)
				? processedSelector
				: generateSelector(processedSelector);
		})
		.join(', ');
};

export const getCompatibleBlockCssSelector = ({
	state,
	query,
	support,
	supports,
	clientId,
	blockName,
	masterState,
	currentBlock,
	blockSelectors,
	className = '',
	suffixClass = '',
	fallbackSupportId,
	currentStateHasSelectors = false,
}: NormalizedSelectorProps): string => {
	const rootSelector = '{{BLOCK_ID}}';

	const selectors: {
		[key: TStates]: {
			[key: 'master' | InnerBlockType | string]: string,
		},
	} = {};
	const customizedPseudoClasses = [
		'parent-class',
		'custom-class',
		'parent-hover',
	];

	const { getSelectedBlock } = select('core/block-editor') || {};

	const { getActiveInnerState, getActiveMasterState } = select(
		'blockera/extensions'
	);

	const getInnerState = () => getActiveInnerState(clientId, currentBlock);
	const getMasterState = () => getActiveMasterState(clientId, blockName);

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
					registerSelector(
						getNormalizedSelector(_selector, {
							state,
							suffixClass,
							masterState,
							rootSelector,
							getInnerState,
							getMasterState,
							fromInnerBlock: true,
							customizedPseudoClasses,
							currentStateHasSelectors,
						})
					);
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
					registerSelector(
						getNormalizedSelector(_selector, {
							state,
							suffixClass,
							masterState,
							rootSelector,
							getInnerState,
							getMasterState,
							customizedPseudoClasses,
							currentStateHasSelectors,
						})
					);
					break;
			}
		}
	};

	// FIXME: after implements parent-hover infrastructure please remove exclude this pseudo-class!
	if (['parent-hover'].includes(state)) {
		// TODO: implements ...
		return '';
	}

	// preparing css selector from support path as key in block selectors map as object.
	const selector = prepareBlockCssSelector({
		query,
		support,
		supports,
		blockName,
		fallbackSupportId,
		selectors: blockSelectors,
	});

	if (selector && selector.trim()) {
		if (isInnerBlock(currentBlock)) {
			register(selector);
		} else {
			register(appendRootBlockCssSelector(selector, rootSelector));
		}
	} else {
		register(rootSelector);
	}

	// Replace: {{BLOCK_ID}} and {{className}} with values on prepared block selector.
	return replaceVariablesValue({
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
 * @param {{support:string,supports:Object,blockName:string,selectors:Object,query:string,fallbackSupportId:string}} params the params to preparing block css selector.
 *
 * @return {string} the css selector for support.
 */
export function prepareBlockCssSelector(params: {
	query?: string,
	support?: string,
	supports: Object,
	blockName: string,
	selectors: Object,
	fallbackSupportId?: string | Array<string>,
}): string | void {
	const {
		query,
		support,
		supports,
		blockName,
		selectors,
		fallbackSupportId,
	} = params;

	const blockType = {
		name: blockName,
		supports,
		selectors,
	};

	// Preparing selector with query of support.
	const selector = getBlockCSSSelector(blockType, query);

	// Fallback for sub feature of support to return selector.
	if (!selector) {
		let fallbackSelector;

		if (Array.isArray(fallbackSupportId)) {
			const fallbacks = union(
				fallbackSupportId.map((supportId) =>
					getBlockCSSSelector(blockType, supportId || 'root', {
						fallback: true,
					})
				)
			);

			fallbackSelector = fallbacks
				.filter((selector: any): boolean => !isObject(selector))
				.join(', ');
		} else {
			fallbackSelector = getBlockCSSSelector(
				blockType,
				fallbackSupportId || 'root',
				{
					fallback: true,
				}
			);
		}

		if (isUndefined(support)) {
			return (
				fallbackSelector || selectors[support].root || selectors.root
			);
		}

		// Preparing selector with support identifier.
		return (
			getBlockCSSSelector(blockType, support) ||
			fallbackSelector ||
			selectors[support]?.root ||
			selectors.root
		);
	}

	// Prepared selector with query of support ids like: 'a.b.c.d'.
	return selector;
}

/**
 * Appending received root css selector into base block css selector.
 *
 * @param {string} selector the prepared block css selector order by support identifier or query.
 * @param {string} root the root block css selector.
 * @return {string} The css selector with include received root selector.
 */
const appendRootBlockCssSelector = (selector: string, root: string): string => {
	// Assume received selector is invalid.
	if (!selector || isEmpty(selector.trim())) {
		return root;
	}

	// Assume received selector is another reference to root, so we should concat together.
	const matches = /(wp-block[a-z-_A-Z]+)/g.exec(selector);
	if (matches) {
		// If selector contains a direct child combinator (>), append root after the selector
		// Example: ".wp-block-foo > .child" becomes ".wp-block-foo > .child.wp-block-bar"
		if (/\s>\s(\w|\.|#)/.test(selector)) {
			return `${selector}${root}, ${root}${selector}`;
		}

		const subject = matches[0];
		const regexp = new RegExp('^.\\b' + subject + '\\b', 'gi');

		return `${selector.replace(regexp, `${root}.${subject}`)}`;
	}

	// If selector has combinators (space, >, +, ~) or starts with a-z html tag name,
	// and not starts with space,
	if (
		!selector.startsWith(' ') &&
		(/[\s>+~]/.test(selector) || /^[a-z]/.test(selector))
	) {
		return `${selector}${root}`;
	}

	return `${root}${selector}`;
};
