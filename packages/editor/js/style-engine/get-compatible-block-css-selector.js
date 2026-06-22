// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import {
	isEmpty,
	isUndefined,
	union,
	getEditorDocumentElement,
} from '@blockera/utils';

/**
 
 * Internal dependencies
 */
import { replaceVariablesValue } from './utils';
import {
	getSelectorWithRootBody,
	getExtractedSelectorFromRootBody,
} from './root-body-selector-helpers';
import type { NormalizedSelectorProps } from './types';
import { getBlockCSSSelector } from './get-block-css-selector';
import { isInnerBlock, isNormalState } from '../extensions/components/utils';
import type { TStates } from '../extensions/libs/block-card/block-states/types';
import type { InnerBlockType } from '../extensions/libs/block-card/inner-blocks/types';

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
 * Creates a standard selector based on the provided selector and state.
 * If selector ends with a pseudo-class (:before or :after), combine it with
 * the current state pseudo-class to create a valid CSS selector.
 * For example, an icon selector like "any:before" becomes "any:hover:before"
 *
 * @param {Object} params - The parameters to create a standard selector.
 * @param {TStates} params.state - The state to create a standard selector for.
 * @param {string} params.selector - The selector to create a standard selector for.
 * @param {string} params.mergedSelector - The merged selector to create a standard selector for.
 * @param {string} params.originSelector - The origin selector to create a standard selector for.
 *
 * @return {string} The standard selector for the provided selector and state.
 */
export const createStandardSelector = ({
	state,
	selector,
	mergedSelector,
	originSelector,
}: {
	state: TStates,
	selector: string,
	mergedSelector: string,
	originSelector: string,
}): string => {
	const matches = selector.match(/:(before|after)$/);

	if (matches && !isNormalState(state)) {
		const detectedPseudoElement = matches[1];

		const newSelectorSection = selector.replace(
			`:${detectedPseudoElement}`,
			`:${state}:${detectedPseudoElement}`
		);

		return originSelector.replace(mergedSelector, newSelectorSection);
	}

	return originSelector;
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
		getInnerState,
		getMasterState,
		fromInnerBlock = false,
		customizedPseudoClasses = [],
		currentStateHasSelectors,
	} = options;
	let { rootSelector } = options;
	const originalRootSelector = rootSelector;

	// Helper function to split selectors by comma, respecting parentheses, brackets, and quotes
	const splitSelectors = (selectorString: string): Array<string> => {
		const selectors: Array<string> = [];
		let current = '';
		let depth = 0;
		let inSingleQuote = false;
		let inDoubleQuote = false;

		for (let i = 0; i < selectorString.length; i++) {
			const char = selectorString[i];
			const prevChar = i > 0 ? selectorString[i - 1] : '';

			// Handle quotes (but not escaped quotes)
			if (char === "'" && prevChar !== '\\') {
				inSingleQuote = !inSingleQuote;
				current += char;
			} else if (char === '"' && prevChar !== '\\') {
				inDoubleQuote = !inDoubleQuote;
				current += char;
			} else if (
				!inSingleQuote &&
				!inDoubleQuote &&
				(char === '(' || char === '[')
			) {
				depth++;
				current += char;
			} else if (
				!inSingleQuote &&
				!inDoubleQuote &&
				(char === ')' || char === ']')
			) {
				depth--;
				current += char;
			} else if (
				char === ',' &&
				depth === 0 &&
				!inSingleQuote &&
				!inDoubleQuote
			) {
				// Only split on comma if we're at the top level
				selectors.push(current.trim());
				current = '';
			} else {
				current += char;
			}
		}

		// Add the last selector
		if (current.trim()) {
			selectors.push(current.trim());
		}

		return selectors.length > 0 ? selectors : [selectorString];
	};

	let parsedSelectors = splitSelectors(selector);
	// Check if selector starts with a pseudo-class (e.g., :hover, :focus, ::before)
	const startsWithPseudoClass = /^::?[a-z-]+/.test(selector.trim());

	if (startsWithPseudoClass) {
		parsedSelectors = [selector];
	}

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
		// Handle selectors starting with {{UNIQUE_CLASSNAME}}&
		if (/^{{UNIQUE_CLASSNAME}}&/.test(selector)) {
			return selector.replace(
				/^{{UNIQUE_CLASSNAME}}&/,
				'{{UNIQUE_CLASSNAME}}'
			);
		}

		// Handle selectors starting with &&
		if (selector.trim().startsWith('&&')) {
			isProcessedSelector = true;
			// Extract the first part of the root selector (everything before the first space)
			const extractedFirstPart =
				getExtractedSelectorFromRootBody(rootSelector).split(' ')[0];
			// Only wrap with html:root body :where() when rootSelector uses that format
			const rootFirstPart = /^html:root body :where\(/.test(rootSelector)
				? getSelectorWithRootBody(extractedFirstPart)
				: extractedFirstPart;

			return `${rootFirstPart}${selector.trim().substring(2)}`;
		}

		// Handle selectors starting with &
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

		// If selector contains root selector, set root selector to empty string to avoid duplicate selectors.
		if (-1 !== selector.indexOf(rootSelector) && !fromInnerBlock) {
			rootSelector = '';
		}

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

						return createStandardSelector({
							state,
							selector,
							mergedSelector: `${selector}${suffixClass}${getStateSymbol(
								state
							)}${state}`,
							originSelector: `${rootSelector}${getStateSymbol(
								masterState
							)}${masterState}${spacer}${selector}${suffixClass}${getStateSymbol(
								state
							)}${state}, ${rootSelector}${spacer}${selector}${suffixClass}`,
						});
					}

					// If current state has selectors, we should return the selector as is with master state.
					if (currentStateHasSelectors) {
						return `${rootSelector}${getStateSymbol(
							masterState
						)}${masterState}${spacer}${selector}${suffixClass}`;
					}

					return createStandardSelector({
						state,
						selector,
						mergedSelector: `${selector}${suffixClass}${getStateSymbol(
							state
						)}${state}`,
						originSelector: `${rootSelector}${getStateSymbol(
							masterState
						)}${masterState}${spacer}${selector}${suffixClass}${getStateSymbol(
							state
						)}${state}`,
					});
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

					return createStandardSelector({
						state,
						selector,
						mergedSelector: `${selector}${suffixClass}${getStateSymbol(
							state
						)}${state}`,
						originSelector: `${rootSelector}${spacer}${selector}${suffixClass}${getStateSymbol(
							state
						)}${state}, ${rootSelector}${spacer}${selector}${suffixClass}`,
					});
				}

				// If current state has selectors, return selector as is.
				if (currentStateHasSelectors) {
					return `${rootSelector}${spacer}${selector}${suffixClass}`;
				}

				return createStandardSelector({
					state,
					selector,
					mergedSelector: `${selector}${suffixClass}${getStateSymbol(
						state
					)}${state}`,
					originSelector: `${rootSelector}${spacer}${selector}${suffixClass}${getStateSymbol(
						state
					)}${state}`,
				});
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

				return createStandardSelector({
					state,
					selector,
					mergedSelector: `${selector}${suffixClass}${getStateSymbol(
						state
					)}${state}`,
					originSelector: `${selector}${suffixClass}${getStateSymbol(
						state
					)}${state}, ${selector}${suffixClass}`,
				});
			}

			const mergedSelector = `${selector}${suffixClass}${getStateSymbol(
				state
			)}${state}`;

			return createStandardSelector({
				state,
				selector,
				mergedSelector,
				originSelector: mergedSelector,
			});
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
			// Reset isProcessedSelector and rootSelector for each selector
			isProcessedSelector = false;
			rootSelector = originalRootSelector;
			const processedSelector = processAmpersand(selector.trim());
			return customizedPseudoClasses.includes(state)
				? processedSelector
				: generateSelector(processedSelector);
		})
		.join(', ');
};

export { getSelectorWithRootBody, getExtractedSelectorFromRootBody };

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
	styleVariationName,
	variationClassPrefix = 'is-style-',
	isStyleVariation = false,
	isGlobalStylesWrapper = false,
	currentStateHasSelectors = false,
}: NormalizedSelectorProps): string => {
	let rootSelector = '{{UNIQUE_CLASSNAME}}';

	// If current block is inner block, we should append the root selector to the root body for specificity reasons.
	if (isInnerBlock(currentBlock)) {
		rootSelector = getSelectorWithRootBody(rootSelector);
	}

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

	const register = (
		_selector: string,
		{
			from,
			getSelectorBasedOnContext,
		}: {
			from?: 'edit-post/block' | 'edit-site/global-styles',
			getSelectorBasedOnContext?: (generatedSelector: string) => string,
		} = {
			from: 'edit-post/block',
			getSelectorBasedOnContext: undefined,
		}
	): void => {
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
				[currentBlock]:
					'function' === typeof getSelectorBasedOnContext
						? getSelectorBasedOnContext(generatedSelector)
						: generatedSelector,
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
						[currentBlock]:
							'function' === typeof getSelectorBasedOnContext
								? getSelectorBasedOnContext(_selector)
								: _selector,
					};

					return;
				}
			}

			selectors[state] = {
				// $FlowFixMe
				[currentBlock]:
					'function' === typeof getSelectorBasedOnContext
						? getSelectorBasedOnContext(rootSelector + suffixClass)
						: rootSelector + suffixClass,
			};

			return;
		}

		const blockType = select('core/blocks')?.getBlockType(blockName);

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
							getInnerState,
							getMasterState,
							fromInnerBlock: true,
							customizedPseudoClasses,
							currentStateHasSelectors,
							rootSelector:
								'edit-site/global-styles' === from
									? getBlockCSSSelector(blockType) || ''
									: rootSelector,
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
							getInnerState,
							getMasterState,
							customizedPseudoClasses,
							currentStateHasSelectors,
							rootSelector:
								'edit-site/global-styles' === from
									? getBlockCSSSelector(blockType) || ''
									: rootSelector,
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

	const blockTypeRoot = getBlockCSSSelector(
		{
			name: blockName,
			supports,
			selectors: blockSelectors,
		},
		'root',
		{
			fallback: true,
		}
	);
	const blockSlug = blockName.replace('core/', '').replace('/', '-');
	const blockPartPattern = new RegExp(
		`\\.\\bwp-block-${blockSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`
	);
	const blockPartMatch = selector?.match(blockPartPattern);
	const trimmedSelector = selector?.trim();
	let preferredRoot =
		blockPartMatch && trimmedSelector && blockTypeRoot
			? preferBlockTypeRootSelector(
					trimmedSelector,
					blockTypeRoot,
					blockPartMatch[0]
				)
			: null;

	// If the preferredRoot is null and the root contains selector, we should prefer the root.
	if (!preferredRoot) {
		preferredRoot = selector
			?.split(',')
			.reduce((unique: Array<string>, s: string) => {
				const item = blockTypeRoot?.includes(s.trim())
					? blockTypeRoot
					: '';
				if (item && !unique.includes(item)) {
					unique.push(item);
				}
				return unique;
			}, [])
			?.join(',');
	}

	const registrationSelector = preferredRoot ?? selector;

	if (registrationSelector && registrationSelector.trim()) {
		if (isStyleVariation && styleVariationName) {
			register(registrationSelector, {
				from: 'edit-site/global-styles',
				getSelectorBasedOnContext: (generatedSelector: string) => {
					if ('default' === styleVariationName) {
						return getSelectorWithRootBody(
							generatedSelector,
							false
						);
					}
					const blockType =
						select('core/blocks')?.getBlockType(blockName);
					const blockClassSelector = `.wp-block-${blockName
						.replace('core/', '')
						.replace('/', '-')}`;
					const variationRootSelector = getBlockCSSSelector(
						{
							...(blockType || {}),
							selectors: blockSelectors,
						},
						'root',
						{ fallback: true }
					);
					const selectorConstant =
						blockClassSelector || variationRootSelector || '';

					const variationClass = `${variationClassPrefix}${styleVariationName}`;
					let selectorWithStyle = generatedSelector;
					if (
						variationRootSelector &&
						blockClassSelector &&
						stripTrailingPseudos(generatedSelector).trim() ===
							blockClassSelector &&
						variationRootSelector !== blockClassSelector &&
						variationRootSelector.includes(blockClassSelector)
					) {
						selectorWithStyle =
							variationRootSelector +
							extractTrailingPseudos(generatedSelector);
					}

					selectorWithStyle = appendStyleVariationClassToSelector(
						selectorWithStyle,
						variationClass,
						selectorConstant
					);

					return getSelectorWithRootBody(selectorWithStyle, false);
				},
			});
		} else if (isGlobalStylesWrapper) {
			// Normalizing selector before registration for global styles purposes.
			register(registrationSelector, {
				from: 'edit-site/global-styles',
				getSelectorBasedOnContext: (generatedSelector: string) => {
					return getSelectorWithRootBody(generatedSelector, false);
				},
			});
		} else if (isInnerBlock(currentBlock)) {
			register(registrationSelector);
		} else {
			register(
				appendRootBlockCssSelector(registrationSelector, rootSelector, {
					clientId,
					blockName,
					className,
				})
			);
		}
	} else {
		register(rootSelector);
	}

	// Replace: {{UNIQUE_CLASSNAME}} and {{className}} with values on prepared block selector.
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
	query?: Array<string> | string,
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

		// Create fallback selector from fallback support id as an array.
		if (Array.isArray(fallbackSupportId)) {
			const fallbacks = union(
				fallbackSupportId.map((supportId) => {
					const picked = getBlockCSSSelector(
						blockType,
						supportId || 'root',
						{
							fallback: false,
						}
					);

					if ('object' === typeof picked) {
						return union(Object.values(picked || {})).join(', ');
					}

					return picked;
				})
			);

			fallbackSelector = fallbacks
				.filter((selector: any): boolean => !isEmpty(selector))
				.join(', ');
		}

		// Create fallback selector from fallback support ID as a string (used as the last resort fallback).
		if (!fallbackSelector) {
			fallbackSelector = getBlockCSSSelector(
				blockType,
				fallbackSupportId || 'root',
				{
					fallback: true,
				}
			);
		}

		if (isUndefined(support)) {
			if (fallbackSelector) {
				return fallbackSelector;
			}

			if (selectors?.[support]?.root) {
				return selectors[support].root;
			}

			if (selectors?.root) {
				return selectors.root;
			}
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

const PSEUDO_CLASS_FUNCTIONS_END_PATTERN = /:(\w+(?:-\w+)*)\s*\([^)]+\)$/;

/**
 * Remove trailing pseudo-classes and pseudo-elements from a selector.
 *
 * @param {string} selector The css selector.
 * @return {string} The selector base without trailing pseudo tokens.
 */
const stripTrailingPseudos = (selector: string): string => {
	let result = selector;
	let previous;

	do {
		previous = result;

		if (PSEUDO_CLASS_FUNCTIONS_END_PATTERN.test(result)) {
			result = result.replace(PSEUDO_CLASS_FUNCTIONS_END_PATTERN, '');
			continue;
		}

		result = result.replace(/(?:::?[a-zA-Z-]+)$/, '');
	} while (previous !== result && result !== '');

	return result;
};

/**
 * Extract trailing pseudo-classes and pseudo-elements from a selector.
 *
 * @param {string} selector The css selector.
 * @return {string} Trailing pseudo tokens (e.g. ":hover:focus" or "::before").
 */
const extractTrailingPseudos = (selector: string): string => {
	const base = stripTrailingPseudos(selector);

	if (base.length >= selector.length) {
		return '';
	}

	return selector.slice(base.length);
};

/**
 * Append a style variation class before trailing pseudo selectors.
 *
 * @param {string} selector The css selector.
 * @param {string} variationClass The variation class token (e.g. "is-style-outline").
 * @param {string} selectorConstant Optional block class to target in compound selectors.
 * @return {string} The selector with variation class appended.
 */
const appendStyleVariationClassToSelector = (
	selector: string,
	variationClass: string,
	selectorConstant: string = ''
): string => {
	if (!selector?.trim() || !variationClass?.trim()) {
		return selector;
	}

	const variationToken = variationClass.startsWith('.')
		? variationClass
		: `.${variationClass}`;

	if (selector.includes(',')) {
		return selector
			.split(',')
			.map((branch) =>
				appendStyleVariationClassToSelector(
					branch.trim(),
					variationClass,
					selectorConstant
				)
			)
			.join(', ');
	}

	const selectorPseudos = extractTrailingPseudos(selector);
	let base = stripTrailingPseudos(selector);

	if (base.includes(variationToken)) {
		return base + selectorPseudos;
	}

	if (
		selectorConstant &&
		base.includes(' ') &&
		base.includes(selectorConstant)
	) {
		base = base.replace(
			selectorConstant,
			`${selectorConstant}${variationToken}`
		);
	} else {
		base = `${base}${variationToken}`;
	}

	return base + selectorPseudos;
};

/**
 * Extract style and size variation classes from a selector.
 *
 * @param {string} selector The css selector.
 * @return {string[]} Ordered variation class tokens.
 */
const extractBlockVariationClasses = (selector: string): Array<string> => {
	const variations: Array<string> = [];
	const styleMatches = selector.match(/\.is-style-[^\s,.#\[:]+/g);

	if (styleMatches) {
		variations.push(...styleMatches);
	}

	const sizeMatches = selector.match(/\.is-size-[^\s,.#\[:]+/g);

	if (sizeMatches) {
		variations.push(...sizeMatches);
	}

	return [...new Set(variations)];
};

/**
 * Remove style and size variation classes from a selector.
 *
 * @param {string} selector The css selector.
 * @return {string} The selector without variation classes.
 */
const stripBlockVariationClasses = (selector: string): string => {
	return selector
		.replace(/\.is-style-[^\s,.#\[:]+/g, '')
		.replace(/\.is-size-[^\s,.#\[:]+/g, '');
};

/**
 * Append missing variation classes after a block part.
 *
 * @param {string} selector The css selector.
 * @param {string} part The block class part to append after.
 * @param {string[]} variations Variation class tokens to append.
 * @return {string} The selector with missing variations appended.
 */
const appendVariationsAfterPart = (
	selector: string,
	part: string,
	variations: Array<string>
): string => {
	if (!variations.length) {
		return selector;
	}

	const missing = variations.filter(
		(variation) => !selector.includes(variation)
	);

	if (!missing.length) {
		return selector;
	}

	return selector.replace(part, `${part}${missing.join('')}`);
};

/**
 * Prefer block type root when it already contains the prepared support selector.
 *
 * Mirrors {@see \Blockera\Utils\Utils::preferContainedRootSelector()}.
 *
 * @param {string} preparedSelector The prepared support selector.
 * @param {string} blockTypeRoot The block type root selector.
 * @param {string} blockPart The matched block class part (e.g. ".wp-block-button").
 * @param {{wrap?: (selector: string) => string}} args Optional arguments.
 * @return {string | null} The preferred selector, or null when root does not already contain the target.
 */
const preferBlockTypeRootSelector = (
	preparedSelector: string,
	blockTypeRoot: string,
	blockPart: string,
	args: {
		wrap?: (selector: string) => string,
	} = {}
): ?string => {
	if (!blockTypeRoot?.trim() || !blockPart?.trim()) {
		return null;
	}

	const selectorBase = stripTrailingPseudos(preparedSelector);
	const rootBase = stripBlockVariationClasses(
		stripTrailingPseudos(blockTypeRoot)
	);
	const rootContainsSelector =
		blockTypeRoot.endsWith(preparedSelector) ||
		('' !== selectorBase && rootBase.endsWith(selectorBase));

	if (!rootContainsSelector) {
		return null;
	}

	const selectorPseudos = extractTrailingPseudos(preparedSelector);
	const variations = extractBlockVariationClasses(blockTypeRoot);

	let merged = '' !== rootBase ? rootBase : blockTypeRoot;
	merged = appendVariationsAfterPart(merged, blockPart, variations);

	if (args.wrap && 'function' === typeof args.wrap) {
		merged = args.wrap(merged);
	}

	return merged + selectorPseudos;
};

/**
 * Resolve template tokens in a root selector for DOM class comparison.
 *
 * @param {string} root      The root selector (may include template tokens).
 * @param {string} className The blockera unique class name.
 * @param {string} clientId  The block client id.
 * @return {string} The resolved root selector.
 */
const resolveRootSelectorForDomCheck = (
	root: string,
	className: string,
	clientId: string
): string => {
	const normalizedClassName = className?.replace(/\s/g, '.') || '';
	const uniqueSelector = normalizedClassName
		? `.${normalizedClassName}`
		: `#block-${clientId}`;

	return root
		.replace(/{{UNIQUE_CLASSNAME}}/g, uniqueSelector)
		.replace(/{{className}}/g, uniqueSelector);
};

/**
 * Extract class names from a css selector string.
 *
 * @param {string} selector The css selector.
 * @return {string[]} Class names without the leading dot.
 */
const extractClassNamesFromCssSelector = (selector: string): Array<string> => {
	const matches = selector.match(/\.[a-zA-Z0-9_-]+/g);

	if (!matches) {
		return [];
	}

	return matches.map((classToken) => classToken.slice(1));
};

/**
 * Check whether class names referenced by the selector exist on the block wrapper.
 *
 * Selectors without class tokens (e.g. ` li::before`) pass automatically.
 * Leading-space selectors that target inner nodes (e.g. archives list root
 * ` .wp-block-archives-list`) fail when those classes are not on the wrapper.
 *
 * @param {string}      selector     The prepared support selector.
 * @param {HTMLElement} blockElement The `#block-{clientId}` wrapper element.
 * @return {boolean} True when selector classes are present on the wrapper.
 */
const selectorClassesExistOnBlockElement = (
	selector: string,
	blockElement: HTMLElement
): boolean => {
	const selectorClasses = extractClassNamesFromCssSelector(selector.trim());

	if (!selectorClasses.length) {
		return true;
	}

	return selectorClasses.some((selectorClass) =>
		blockElement.classList.contains(selectorClass)
	);
};

/**
 * Check whether the editor block wrapper element carries every class from root.
 *
 * @param {HTMLElement} blockElement The `#block-{clientId}` wrapper element.
 * @param {string}      root         The root selector.
 * @param {string}      className    The blockera unique class name.
 * @param {string}      clientId     The block client id.
 * @param {string}      selector     The prepared support selector.
 * @return {boolean} True when root and selector classes match the wrapper element.
 */
const blockWrapperElementContainsRootClasses = (
	blockElement: HTMLElement,
	root: string,
	className: string,
	clientId: string,
	selector: string
): boolean => {
	const resolvedRoot = resolveRootSelectorForDomCheck(
		root,
		className,
		clientId
	);

	const rootClasses = extractClassNamesFromCssSelector(resolvedRoot);

	if (!rootClasses.length) {
		return false;
	}

	const rootClassesMatch = rootClasses.every((rootClass) =>
		blockElement.classList.contains(rootClass)
	);

	if (!rootClassesMatch) {
		return false;
	}

	return selectorClassesExistOnBlockElement(selector, blockElement);
};

/**
 * Decide whether a leading-space selector targets a descendant of the block wrapper
 * that is itself the styled root (WordPress `data-type` wrapper with matching classes).
 *
 * Mirrors the PHP child-selector trim behavior for blocks like `core/list` where the
 * wrapper is `.wp-block-list` and inner selectors look like ` li::before`.
 *
 * @param {Object} params            Parameters.
 * @param {string} params.selector   The prepared support selector.
 * @param {string} params.root       The blockera root selector.
 * @param {string} params.blockName  The block type name (e.g. `core/list`).
 * @param {string} params.clientId   The block client id.
 * @param {string} params.className  The blockera unique class name.
 * @return {boolean} True when the selector leading space should be trimmed.
 */
const shouldTrimLeadingSpaceForBlockWrapperRoot = ({
	selector,
	root,
	blockName,
	clientId,
	className,
}: {
	selector: string,
	root: string,
	blockName: string,
	clientId: string,
	className: string,
}): boolean => {
	if (!selector.startsWith(' ') && selector.split(' ').length > 1) {
		return false;
	}

	if (!clientId || !blockName || !root?.trim()) {
		return false;
	}

	const blockElement = getEditorDocumentElement()?.querySelector(
		`#block-${clientId}`
	);

	if (!blockElement) {
		return false;
	}

	if (blockElement.getAttribute('data-type') !== blockName) {
		return false;
	}

	return blockWrapperElementContainsRootClasses(
		blockElement,
		root,
		className,
		clientId,
		selector
	);
};

/**
 * Appending received root css selector into base block css selector.
 *
 * @param {string} selector the prepared block css selector order by support identifier or query.
 * @param {string} root the root block css selector.
 * @param {{clientId?: string, blockName?: string, className?: string}} context Optional block context for DOM checks.
 * @return {string} The css selector with include received root selector.
 */
const appendRootBlockCssSelector = (
	selector: string,
	root: string,
	context: {
		clientId?: string,
		blockName?: string,
		className?: string,
	} = {}
): string => {
	// Assume received selector is invalid.
	if (!selector || isEmpty(selector.trim())) {
		return root;
	}

	let normalizedSelector = selector;
	let trimmedLeadingSpaceForBlockWrapper = false;

	if (
		shouldTrimLeadingSpaceForBlockWrapperRoot({
			selector,
			root,
			blockName: context.blockName || '',
			clientId: context.clientId || '',
			className: context.className || '',
		})
	) {
		normalizedSelector = selector.trimStart();
		trimmedLeadingSpaceForBlockWrapper = true;
	}

	// Descendant element selectors inside the block wrapper root (e.g. `li::before`).
	if (
		trimmedLeadingSpaceForBlockWrapper &&
		!/\bwp-block-/.test(normalizedSelector.split(/[\s>+~]/)[0])
	) {
		return `${root} ${normalizedSelector}`;
	}

	// Assume received selector is another reference to root, so we should concat together.
	const matches = /(wp-block[a-z-_A-Z]+)/g.exec(normalizedSelector);
	if (matches) {
		// If selector contains a direct child combinator (>), append root after the selector
		// Example: ".wp-block-foo > .child" becomes ".wp-block-foo > .child.wp-block-bar"
		if (/\s>\s(\w|\.|#)/.test(normalizedSelector)) {
			return `${normalizedSelector}${root}, ${root}${normalizedSelector}`;
		}

		// If selector starts with a space, append root before the selector to handle cases like:
		// " .wp-block-foo" becomes ".wp-block-bar .wp-block-foo"
		if (normalizedSelector.startsWith(' ')) {
			return `${root}${normalizedSelector}`;
		}

		const subject = matches[0];
		const regexp = new RegExp('.\\b' + subject + '\\b', 'gi');

		return normalizedSelector.replace(regexp, `${root}.${subject}`);
	}

	// If selector has combinators (space, >, +, ~) or starts with a-z html tag name,
	// and not starts with space,
	if (
		!normalizedSelector.startsWith(' ') &&
		(/[\s>+~]/.test(normalizedSelector) ||
			/^[a-z]/.test(normalizedSelector))
	) {
		return `${normalizedSelector}${root}`;
	}

	return `${root}${normalizedSelector}`;
};
