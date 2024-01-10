// @flow

/**
 * Publisher dependencies
 */
import { isString } from '@publisher/utils';
import { prepare } from '@publisher/data-extractor';
import type { TBlockProps } from '@publisher/extensions/src/libs/types';

/**
 * Internal dependencies
 */
import CssGenerators from './css-generator';
import type { StaticStyle, DynamicStyle, CssGeneratorModel } from './types';

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
export const computedCssRules = (
	styleDefinitions: Object,
	blockProps: TBlockProps
): string => {
	let css = '';

	for (const styleKey in styleDefinitions) {
		const generatorDetails: Array<StaticStyle | DynamicStyle> =
			styleDefinitions[styleKey];

		generatorDetails?.forEach(
			(definition: StaticStyle | DynamicStyle): void => {
				if (!isValidGenerator(definition)) {
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

				css += cssGenerator.rules() + '\n';
			}
		);
	}

	return css;
};

/**
 * Check is valid css generator?
 *
 * @param {Object} generator the css generator
 * @return {boolean} true on success, false when otherwise!
 */
export const isValidGenerator = (generator: Object): boolean =>
	['function', 'static'].includes(generator?.type);

/**
 * Creating CSS Rule!
 *
 * @param {Object} style The style object
 * @return {string} The created CSS Rule!
 */
export const createCssRule = (style: CssGeneratorModel): string => {
	if (!hasAllProperties(style, ['selector', 'properties'])) {
		console.warn(
			`Style rule: ${JSON.stringify(style)} avoid css rule validation!`
		);
		return '';
	}

	const {
		media,
		properties,
		options = { important: false },
		selector = '',
		blockProps = {},
	} = style;

	let styleBody = getProperties({
		options,
		properties,
	}).join('\n');

	let cssRule = `${selector}{{BODY}}`;

	if (!blockProps?.attributes) {
		cssRule = cssRule.replace('{BODY}', styleBody);

		return media ? `${media}{${cssRule}}` : cssRule;
	}

	getVars(styleBody).forEach((query) => {
		const replacement = prepare(query, blockProps?.attributes);

		if (!replacement) {
			return;
		}

		styleBody = styleBody.replace(query, replacement).replace(/[{}]/g, '');
	});

	cssRule = cssRule.replace('{BODY}', styleBody.trim());

	return media ? `${media}{${cssRule}}` : cssRule;
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
