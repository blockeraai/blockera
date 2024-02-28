// @flow

/**
 * Publisher dependencies
 */
import { isString } from '@publisher/utils';
import type { TStates } from '@publisher/extensions/src/libs/block-states/types';
import type { InnerBlockType } from '@publisher/extensions/src/libs/inner-blocks/types';

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
 * Has objected all passed properties?
 *
 * @param {Object} obj the any object
 * @param {Array<string>} props the props of any object
 * @return {boolean} true on success, false when otherwise!
 */
export function hasAllProperties(obj: Object, props: Array<string>): boolean {
	for (let i = 0; i < props.length; i++) {
		if (!obj.hasOwnProperty(props[i])) {
			return false;
		}
	}

	return true;
}

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
		clientId: string,
		attributes: Object,
		blockName: string,
	}
): Array<string> => {
	const output = [];

	for (const styleKey in styleDefinitions) {
		const generatorDetails: Array<StaticStyle | DynamicStyle> =
			styleDefinitions[styleKey];

		generatorDetails?.forEach(
			(definition: StaticStyle | DynamicStyle): void => {
				if (!isValidStyleDefinition(definition)) {
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
					blockProps
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
		console.warn(
			`Create Css Declarations API: ${JSON.stringify(
				declaration
			)} avoid CssDeclarationProps Type!`
		);
		return '';
	}

	const { properties: _props, options = { important: false } } = declaration;

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
			console.warn(
				`CSS property value must be string given ${typeof value}, please double check properties.`
			);
			continue;
		}

		let tempValue: string = '';

		if (-1 === value.indexOf(';')) {
			tempValue = `${property}: ${value}${
				options.important ? ' !important' : ''
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

export const getSelector = ({
	state,
	clientId,
	className,
	selectors,
	currentBlock,
}: {
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
 * @return {Array<CssRule>} the combined css declarations linked with same css selector.
 */
export const combineDeclarations = (
	cssRules: Array<CssRule>
): Array<CssRule> => {
	const combinedObjects: { [key: string]: CssRule } = {};

	if (!Array.isArray(cssRules)) {
		return Object.values(combinedObjects);
	}

	cssRules.forEach((item) => {
		const { selector, declarations } = item;

		if (combinedObjects[selector]) {
			combinedObjects[selector].declarations = [
				...(combinedObjects[selector].declarations || []),
				...declarations,
			];
		} else {
			combinedObjects[selector] = { selector, declarations };
		}
	});

	return Object.values(combinedObjects);
};
