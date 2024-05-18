// @flow

/**
 * Blockera dependencies
 */
import type { TBlockProps } from '@blockera/editor/js/extensions/libs/types';

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
