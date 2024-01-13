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
	publisherTextDecoration: {
		wpAttribute: 'textDecoration',
		callback: toSimpleStyleTypographyWPCompatible,
	},
	publisherTextTransform: {
		wpAttribute: 'textTransform',
		callback: toSimpleStyleTypographyWPCompatible,
	},
};
