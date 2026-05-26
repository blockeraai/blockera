// @flow

/**
 * Internal dependencies
 */
import * as changeCase from './';
import type { SplitPrefixSuffixOptions } from './types';

const {
	noCase: _noCase,
	dotCase: _dotCase,
	pathCase: _pathCase,
	trainCase: _trainCase,
	kebabCase: _kebabCase,
	camelCase: _camelCase,
	snakeCase: _snakeCase,
	pascalCase: _pascalCase,
	capitalCase: _capitalCase,
	constantCase: _constantCase,
	sentenceCase: _sentenceCase,
}: {
	noCase: ChangeCaseFunction,
	dotCase: ChangeCaseFunction,
	pathCase: ChangeCaseFunction,
	trainCase: ChangeCaseFunction,
	kebabCase: ChangeCaseFunction,
	camelCase: ChangeCaseFunction,
	snakeCase: ChangeCaseFunction,
	pascalCase: ChangeCaseFunction,
	capitalCase: ChangeCaseFunction,
	constantCase: ChangeCaseFunction,
	sentenceCase: ChangeCaseFunction,
	pascalSnakeCase: ChangeCaseFunction,
	split: (value: string) => Array<string>,
	splitSeparateNumbers: (value: string) => Array<string>,
} = changeCase;

type Options = {
	locale?: ?string,
	delimiter?: string,
	split?: (string) => Array<string>,
	separateNumbers?: boolean,
	prefixCharacters?: string,
	suffixCharacters?: string,
	mergeAmbiguousCharacters?: boolean,
};

type ChangeCaseFunction = (
	str: string,
	options?: SplitPrefixSuffixOptions
) => string;

const isObject = (object: mixed): boolean =>
	object !== null && typeof object === 'object';

type ChangeKeysFactoryType = (
	object: mixed,
	depth?: number,
	options?: Options
) => mixed;

function changeKeysFactory(
	changeCase: ChangeCaseFunction
): ChangeKeysFactoryType {
	return function changeKeys(
		object: any,
		depth: number = 1,
		options?: Options
	): mixed {
		if (depth === 0 || !isObject(object)) return object;
		if (Array.isArray(object)) {
			return object.map((item) => changeKeys(item, depth - 1, options));
		}
		const result: { [key: string]: any } = Object.create(
			Object.getPrototypeOf(object)
		);
		Object.keys(object).forEach((key) => {
			const value = object[key];
			const changedKey = changeCase(key, options);

			result[changedKey] = changeKeys(value, depth - 1, options);
		});
		return result;
	};
}

export const noCase = (changeKeysFactory(_noCase): ChangeKeysFactoryType);
export const dotCase = (changeKeysFactory(_dotCase): ChangeKeysFactoryType);
export const pathCase = (changeKeysFactory(_pathCase): ChangeKeysFactoryType);
export const trainCase = (changeKeysFactory(_trainCase): ChangeKeysFactoryType);
export const kebabCase = (changeKeysFactory(_kebabCase): ChangeKeysFactoryType);
export const snakeCase = (changeKeysFactory(_snakeCase): ChangeKeysFactoryType);
export const camelCase = (changeKeysFactory(_camelCase): ChangeKeysFactoryType);
export const pascalCase = (changeKeysFactory(
	_pascalCase
): ChangeKeysFactoryType);
export const capitalCase = (changeKeysFactory(
	_capitalCase
): ChangeKeysFactoryType);
export const constantCase = (changeKeysFactory(
	_constantCase
): ChangeKeysFactoryType);
export const sentenceCase = (changeKeysFactory(
	_sentenceCase
): ChangeKeysFactoryType);
