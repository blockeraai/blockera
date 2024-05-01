// @flow

import type { TBlockProps } from '@blockera/editor-extensions/js/libs/types';
import type { CssGeneratorModel } from './css-generator-model';

export type StaticStyle = {
	media: string,
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
	media: string,
	type: 'function',
	selector: string,
	function: DynamicStyleFunction,
};
