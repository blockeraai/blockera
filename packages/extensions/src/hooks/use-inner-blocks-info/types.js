// @flow

/**
 * Internal dependencies
 */
import type { InnerBlockModel } from '../../libs/inner-blocks/types';

export type InnerBlocksInfoProps = {
	name: string,
	attributes: Object,
	additional: Object,
};

export type InnerBlocksInfo = {
	currentInnerBlock: InnerBlockModel | null,
	publisherInnerBlocks: Array<InnerBlockModel>,
};
