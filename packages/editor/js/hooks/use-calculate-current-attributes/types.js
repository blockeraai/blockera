// @flow

/**
 * Internal dependencies
 */
import type {
	InnerBlocks,
	InnerBlockModel,
} from '../../extensions/libs/inner-blocks/types';

export type CalculateCurrentAttributesProps = {
	attributes: Object,
	blockAttributes: Object,
	blockeraInnerBlocks: InnerBlocks,
	currentInnerBlock: InnerBlockModel,
};
