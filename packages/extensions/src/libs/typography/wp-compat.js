/**
 * Internal dependencies
 */
import {
	toSimpleStyleWPCompatible,
	toSimpleStyleTypographyWPCompatible,
} from '../../utils';

export const typoFeatures = {
	publisherFontSize: {
		wpAttribute: 'fontSize',
		callback: toSimpleStyleWPCompatible,
	},
	publisherFontStyle: {
		wpAttribute: 'fontStyle',
		callback: toSimpleStyleWPCompatible,
	},
	publisherLetterSpacing: {
		wpAttribute: 'letterSpacing',
		callback: toSimpleStyleTypographyWPCompatible,
	},
	publisherLineHeight: {
		wpAttribute: 'lineHeight',
		callback: toSimpleStyleTypographyWPCompatible,
	},
	// FIXME: please check wp attribute name,
	// TODO: in old version of compatibility is "lineHeight" It seems to be incorrect!
	publisherTextDecoration: {
		wpAttribute: 'lineHeight',
		callback: toSimpleStyleTypographyWPCompatible,
	},
	publisherTextTransform: {
		wpAttribute: 'textTransform',
		callback: toSimpleStyleTypographyWPCompatible,
	},
};
