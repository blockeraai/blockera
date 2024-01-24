// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	SharedBlockExtension,
	sharedBlockExtensionSupports,
	sharedBlockExtensionAttributes,
	IconExtension,
	IconExtensionSupports,
	IconExtensionAttributes,
} from '@publisher/extensions';

const attributes = {
	...IconExtensionAttributes,
	...sharedBlockExtensionAttributes,
};

const publisherInnerBlocks = [
	{
		name: 'core/paragraph',
		type: 'paragraph',
		label: 'Paragraph',
		attributes,
	},
	{
		name: 'citation',
		type: 'citation',
		label: 'Citation',
		selectors: {
			root: 'cite',
			publisherBackground: {},
		},
		attributes,
		settings: {
			backgroundConfig: {
				publisherBackground: {
					force: false,
					show: false,
				},
			},
		},
	},
];

export const Quote = {
	name: 'publisherQuote',
	targetBlock: 'core/quote',
	attributes,
	supports: {
		...IconExtensionSupports,
		...sharedBlockExtensionSupports,
	},
	publisherInnerBlocks,
	publisherStatesConfig: {
		disabledSelectors: ['.a', '.b'],
	},
	publisherBreakpointsConfig: {
		// $FlowFixMe
		disabledSelectors: [],
	},
	getSelectors: (selectors: Object): Object => {
		const { root, backgroundColor } = selectors;

		return {
			...selectors,
			publisherBackgroundColor: backgroundColor || root,
		};
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
