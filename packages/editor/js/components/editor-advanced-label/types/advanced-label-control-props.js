// @flow

/**
 * Blockera dependencies
 */
import type { LabelControlProps } from '@blockera/controls';

export type AdvancedLabelControlProps = {
	...LabelControlProps,
	blockName?: string,
	attribute?: string,
	offset?: number,
};
