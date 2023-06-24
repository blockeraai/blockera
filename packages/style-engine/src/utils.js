/**
 * Internal dependencies
 */
import CssGenerators from '@publisher/style-engine';
import { prepare } from '@publisher/data-extractor';
import { isString } from '@publisher/utils';

/**
 * Has object all passed properties?
 *
 * @param {Object} obj the any object
 * @param {Array.<string>} props the props of any object
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
) => {
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
 * @param {Object} blockType The current block type
 * @param {*} blockProps The current block properties
 * @return {string} The current block css output of css generators!
 */
export const computedCssRules = (
	blockType: Object,
	blockProps: Object
): string => {
	let css = '';
	const { cssGenerators = [] } = blockType;

	for (const controlId in cssGenerators) {
		if (!Object.hasOwnProperty.call(cssGenerators, controlId)) {
			continue;
		}

		const generatorDetails = cssGenerators[controlId];

		generatorDetails.forEach((generator) => {
			if (!isValidGenerator(generator)) {
				console.warn(
					`${JSON.stringify(
						generator
					)} was not a valid css generator!`
				);
				return;
			}

			const cssGenerator = new CssGenerators(
				controlId,
				generator,
				blockProps
			);

			css += cssGenerator.rules() + '\n';
		});
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
export const createCssRule = (style: Object): string => {
	if (!hasAllProperties(style, ['selector', 'properties'])) {
		console.warn(
			`Style rule: ${JSON.stringify(style)} avoid css rule validation!`
		);
		return '';
	}

	const { properties = [], selector = '', blockProps = {} } = style;

	let styleBody = [];
	const keys = Object.keys(properties);
	const lastKeyIndex = keys.length - 1;

	for (const property in properties) {
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

		styleBody.push(
			`${property}: ${value}${-1 === value.indexOf(';') ? ';\n' : '\n'}${
				lastKeyIndex === keys.indexOf(property) ? '\n' : ''
			}`
		);
	}

	styleBody = styleBody.join('\n');

	if (!blockProps?.attributes) {
		return `${selector}{${styleBody}}`;
	}

	getVars(styleBody).forEach((query) => {
		const replacement = prepare(query, blockProps?.attributes);

		if (!replacement) {
			return;
		}

		styleBody = styleBody.replace(query, replacement).replace(/\{|\}/g, '');
	});

	return `${selector}{${styleBody}}`;
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
