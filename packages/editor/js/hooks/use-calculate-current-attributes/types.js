// @flow

/**
 * Internal dependencies
 */
import type {
	InnerBlocks,
	InnerBlockModel,
} from '../../extensions/libs/block-card/inner-blocks/types';

export type CalculateCurrentAttributesProps = {
	name: string,
	clientId: string,
	attributes: Object,
	blockAttributes: Object,
	blockeraInnerBlocks: InnerBlocks,
	currentInnerBlock: InnerBlockModel,
};
