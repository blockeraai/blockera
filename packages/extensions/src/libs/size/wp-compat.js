/**
 * Internal dependencies
 */
import { toSimpleStyleWPCompatible } from '../../utils';
import {
	aspectRatioToWPCompatible,
	fitToWPCompatible,
	minHeightToWPCompatible,
} from './utils';

export const sizeFeatures = {
	publisherWidth: {
		callback: toSimpleStyleWPCompatible,
		wpAttribute: 'width',
	},
	publisherHeight: {
		callback: toSimpleStyleWPCompatible,
		wpAttribute: 'height',
	},
	publisherMinHeight: {
		callback: minHeightToWPCompatible,
	},
	publisherRatio: {
		callback: aspectRatioToWPCompatible,
	},
	publisherFit: {
		callback: fitToWPCompatible,
	},
};
