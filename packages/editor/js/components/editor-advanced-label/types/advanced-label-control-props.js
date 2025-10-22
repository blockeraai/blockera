// @flow

/**
 * Blockera dependencies
 */
import type { LabelControlProps } from '@blockera/controls';

export type AdvancedLabelControlProps = {
	...LabelControlProps,
	blockName?: string,
	clientId?: string,
	attribute?: string,
	offset?: number,
	getAttributesRef?: () => Object,
};
