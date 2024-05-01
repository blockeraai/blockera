// @flow

/**
 * External dependencies
 */
import type { TBlockProps } from '@blockera/editor-extensions/js/libs/types';

/**
 * Internal dependencies
 */
import type { DynamicStyleFunction } from './styles';

export type CssGeneratorModel = {
	name: string,
	media: string,
	type: 'static' | 'function',
	options: Object,
	selector: string,
	function: DynamicStyleFunction,
	properties: Object,
	blockProps: TBlockProps,
	getPropValue: (attributeName: string) => any,
	rules: () => string,
	convertToCssSelector: (cssClasses: string) => string,
	setUniqueClassName: () => void,
	addStaticRule: () => void,
	addFunctionRule: () => string,
};
