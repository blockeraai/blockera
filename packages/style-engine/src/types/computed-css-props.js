// @flow

/**
 * Publisher dependencies
 */
import type { TBlockProps } from '@publisher/extensions/src/libs/types';

/**
 * Internal dependencies
 */
import type { DynamicStyle, StaticStyle } from './styles';

export type ComputedCssProps = (
	styleDefinitions: {
		[key: string]: Array<StaticStyle | DynamicStyle>,
	},
	blockProps: TBlockProps
) => string;
