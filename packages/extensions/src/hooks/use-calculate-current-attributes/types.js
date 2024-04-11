// @flow

/**
 * Internal dependencies
 */
import type {
	InnerBlocks,
	InnerBlockModel,
} from '../../libs/inner-blocks/types';

export type CalculateCurrentAttributesProps = {
	attributes: Object,
	blockAttributes: Object,
	publisherInnerBlocks: InnerBlocks,
	currentInnerBlock: InnerBlockModel,
};
