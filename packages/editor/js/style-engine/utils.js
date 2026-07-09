// @flow

/**
 * Blockera dependencies
 */
import { isString } from '@blockera/utils';
import type { TStates } from '../extensions/libs/block-card/block-states/types';
import type { InnerBlockType } from '../extensions/libs/block-card/inner-blocks/types';

/**
 * Internal dependencies
 */
import CssGenerators from './css-generator';
import type {
	CssRule,
	StaticStyle,
	DynamicStyle,
	CssDeclarationProps,
} from './types';

/**
 * Injection helpers into generators.
 *
 * @param {Object} helpers The helper function to injected current css generator.
 * @param {Object} generators The css generators list as Object
 * @return {Object} generators with includes helper functions!
 */
export const injectHelpersToCssGenerators = (
	helpers: Object,
	generators: Object
): Object => {
	Object.values(generators).forEach((generator, index) => {
		generator.forEach((item) => {
			if ('function' === item?.type) {
				generators[Object.keys(generators)[index]] = {
					...item,
					function: helpers[item.function],
				};
			}
		});
	});

	return generators;
};

/**
 * Retrieve computed css rules with usage of registered CSS Generators runner.
 *
 * @param {Object} styleDefinitions The style definition.
 * @param {Object} blockProps The current block properties.
 * @return {string} The generated stylesheet with style definition and block properties.
 */
export const computedCssDeclarations = (
	styleDefinitions: Object,
	blockProps: {
		state: string,
		clientId: string,
		currentBlock: string,
		attributes: Object,
		blockName: string,
		supports?: Object,
		blockeraStyleEngineConfig?: Object,
	},
	pickedSelector: string
): Array<string> => {
	const output = [];

	for (const styleKey in styleDefinitions) {
		const generatorDetails: Array<StaticStyle | DynamicStyle> =
			styleDefinitions[styleKey];

		generatorDetails?.forEach(
			(definition: StaticStyle | DynamicStyle): void => {
				if (!isValidStyleDefinition(definition)) {
					/* @debug-ignore */
					console.warn(
						`${JSON.stringify(
							definition
						)} was not a valid style definition!`
					);
					return;
				}

				const cssGenerator = new CssGenerators(
					styleKey,
					definition,
					blockProps,
					pickedSelector
				);

				const rules = cssGenerator.rules();

				if (!rules) {
					return;
				}

				output.push(rules);
			}
		);
	}

	return output;
};

/**
 * Check is valid css generator?
 *
 * @param {Object} styleDefinition the css style definition.
 * @return {boolean} true on success, false when otherwise!
 */
export const isValidStyleDefinition = (styleDefinition: Object): boolean =>
	['function', 'static'].includes(styleDefinition?.type);

/**
 * Creating CSS Declarations.
 *
 * @param {Object} declaration The declaration object.
 * @return {string} The normalized css declarations.
 */
export const createCssDeclarations = (
	declaration: CssDeclarationProps
): string => {
	if (!declaration.hasOwnProperty('properties')) {
		/* @debug-ignore */
		console.warn(
			`Create Css Declarations API: ${JSON.stringify(
				declaration
			)} avoid CssDeclarationProps Type!`
		);
		return '';
	}

	const { properties: _props, options } = declaration;

	return getProperties({
		options,
		properties: _props,
	}).join('\n');
};

/**
 * Retrieve properties as array with all active options.
 *
 * @param {Object} props includes css properties with value and css generator options.
 * @return {Array<string>} the array of strings includes css props
 */
export const getProperties = (props: {
	properties: Object,
	options: Object,
}): Array<string> => {
	const { properties, options } = props;
	const _properties: Object = {};
	const keys = Object.keys(properties);
	const lastKeyIndex = keys.length - 1;

	for (const property: string in properties) {
		if (!Object.hasOwnProperty.call(properties, property)) {
			continue;
		}

		const value = properties[property];

		if (!isString(value)) {
			/* @debug-ignore */
			console.warn(
				`CSS ${property} property value must be string given ${typeof value}, please double check properties.`
			);
			continue;
		}

		let tempValue: string = '';

		if (-1 === value.indexOf(';')) {
			const hasImportantFlag = -1 !== value.indexOf('!important');

			tempValue = `${property}: ${value}${
				options.important && !hasImportantFlag ? ' !important' : ''
			};\n`;
		} else if (options.important) {
			tempValue = value.replace(';', ' !important;\n');
		} else {
			tempValue = `${property}: ${value}`;
		}

		tempValue += lastKeyIndex === keys.indexOf(property) ? '\n' : '';
		_properties[property] = tempValue;
	}

	return Object.values(_properties);
};

/**
 * Retrieve dynamic variables from queries!
 *
 * @param {string} queries The queries as string. Example: "{{x.y[2].z}} {{x.a}}"
 * @return {Array<string>} The dynamic variables list
 */
export function getVars(queries: string): Array<string> {
	const regex = /{{[^{}]+}}/gi;
	const matches = queries.matchAll(regex);
	const replacements = [];

	for (const match of matches) {
		replacements.push(match[0].replace(/\{|\}/g, ''));
	}

	return replacements;
}

/**
 * Replacing variable values on block selector.
 *
 * @param {Object} params the parameters to replace variables (Like: {{BLOCK_ID}}, {{className}}) of block selector.
 * @return {string|string} the block selector with variable values.
 */
export const replaceVariablesValue = (params: {
	state: TStates,
	clientId: string,
	className: string,
	selectors: {
		[key: TStates]: {
			[key: 'master' | InnerBlockType | string]: string,
		},
	},
	currentBlock: 'master' | InnerBlockType | string,
}): string => {
	const { state, clientId, className, selectors, currentBlock } = params;

	if (!state) {
		return '';
	}

	let selector = selectors[state] ? selectors[state][currentBlock] : '';

	if (!selector) {
		return '';
	}

	if (className) {
		selector = selector.replace(/{{className}}/g, `.${className}`);
	}
	if (clientId) {
		selector = selector.replace(/{{BLOCK_ID}}/g, `#block-${clientId}`);
	}

	return selector;
};

/**
 * Combine css declaration for same selectors.
 *
 * @param {Array<CssRule>} cssRules the css rules.
 * @param {Array<CssRule>} inlineCssRules the prepared inline css rules.
 *
 * @return {Array<CssRule>} the combined css declarations linked with same css selector.
 */
export const combineDeclarations = (
	cssRules: Array<CssRule>,
	inlineCssRules: Array<CssRule>
): Array<CssRule> => {
	const combinedObjects: { [key: string]: CssRule } = {};

	if (!Array.isArray(cssRules)) {
		return Object.values(combinedObjects);
	}

	inlineCssRules.forEach((item) => {
		const { selector, declarations } = item;

		// Skip cssRule with empty selector or declarations stack.
		if (!declarations.length || !selector) {
			return;
		}

		if (combinedObjects[selector]) {
			combinedObjects[selector].declarations = [
				...(combinedObjects[selector].declarations || []),
				...declarations,
			];
		} else {
			combinedObjects[selector] = { selector, declarations };
		}
	});

	cssRules.forEach((item) => {
		const { selector, declarations } = item;

		// Skip cssRule with empty selector or declarations stack.
		if (!declarations.length || !selector) {
			return;
		}

		if (combinedObjects[selector]) {
			combinedObjects[selector].declarations = [
				...(combinedObjects[selector].declarations || []),
				...declarations,
			];
		} else {
			combinedObjects[selector] = { selector, declarations };
		}
	});

	return Object.values(combinedObjects).sort(
		(a: CssRule, b: CssRule): number => {
			if (
				-1 !== a.selector.indexOf(',') &&
				-1 === b.selector.indexOf(',')
			) {
				return 1;
			}

			return -1;
		}
	);
};

/**
 * Cloned from WordPress/gutenberg repository.
 *
 * @see @wordpress/block-editor/src/components/global-styles/utils.js on line 366
 *
 * Function that scopes a selector with another one. This works a bit like
 * SCSS nesting except the `&` operator isn't supported.
 *
 * @example
 * ```js
 * const scope = '.a, .b .c';
 * const selector = '> .x, .y';
 * const merged = scopeSelector( scope, selector );
 * // merged is '.a > .x, .a .y, .b .c > .x, .b .c .y'
 * ```
 *
 * @param {string} scope    Selector to scope to.
 * @param {string} selector Original selector.
 *
 * @return {string} Scoped selector.
 */
export function scopeSelector(scope: string, selector: string): string {
	if (!scope || !selector) {
		return selector;
	}

	const scopes = scope.split(',');
	const selectors = selector.split(',');

	const selectorsScoped = [];
	scopes.forEach((outer) => {
		selectors.forEach((inner) => {
			selectorsScoped.push(`${outer.trim()} ${inner.trim()}`);
		});
	});

	return selectorsScoped.join(', ');
}

/**
 * Cloned from WordPress/gutenberg repository.
 *
 * @see @wordpress/block-editor/src/utils/object.js on line 44
 *
 * Helper util to return a value from a certain path of the object.
 * Path is specified as either:
 * - a string of properties, separated by dots, for example: "x.y".
 * - an array of properties, for example `[ 'x', 'y' ]`.
 * You can also specify a default value in case the result is nullish.
 *
 * @param {Object}       object       Input object.
 * @param {string|Array} path         Path to the object property.
 * @param {*}            defaultValue Default value if the value at the specified path is nullish.
 * @return {*} Value of the object property at the specified path.
 */
export const getValueFromObjectPath = (
	object: Object,
	path: string,
	defaultValue: any
): any => {
	const arrayPath = Array.isArray(path) ? path : path.split('.');
	let value = object;
	arrayPath.forEach((fieldName) => {
		value = value?.[fieldName];
	});
	return value ?? defaultValue;
};

/**
 * Appending "blockera/" word as prefix.
 *
 * @param {string} blockType The block type name.
 * @return {string} The string start with "blockera/" prefix.
 */
export const appendBlockeraPrefix = (blockType: string): string => {
	return `blockera/${blockType}`;
};
