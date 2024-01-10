// @flow

import type { TBlockProps } from '@publisher/extensions/src/libs/types';
import type { CssGeneratorModel } from './css-generator-model';

export type StaticStyle = {
	type: 'static',
	selector: string,
	properties: Object,
};

export type DynamicStyleFunction = (
	id: string,
	props: TBlockProps,
	styleEngine: CssGeneratorModel
) => string | void;

export type DynamicStyle = {
	type: 'function',
	selector: string,
	function: DynamicStyleFunction,
};
