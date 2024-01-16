// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';
import type { ControlContextRef } from '@publisher/controls/src/context/types';
import {
	toSimpleStyleWPCompatible,
	toSimpleStyleTypographyWPCompatible,
} from '../../utils';

export const bootstrap = (): void => {
	addFilter(
		'publisherCore.blockEdit.attributes',
		'publisherCore.blockEdit.typographyExtension.bootstrap',
		(attributes) => {
			// TODO: implements filters for initialized features of typography extension values.

			return attributes;
		}
	);

	addFilter(
		'publisherCore.blockEdit.setAttributes',
		'publisherCore.blockEdit.typographyExtension.bootstrap.setAttributes',
		/**
		 * Retrieve block attributes with WordPress compatibilities.
		 *
		 * @callback getAttributes
		 *
		 * @param {Object} nextState The block attributes changed with publisher feature newValue and latest version of block state.
		 * @param {string} featureId The publisher feature identifier.
		 * @param {*} newValue The newValue sets to feature.
		 * @param {ControlContextRef} ref The reference of control context action occurred.
		 * @param {getAttributes} getAttributes The getter block attributes.
		 *
		 * @return {Object|{}} The retrieve updated block attributes with all of wp compatibilities.
		 */
		(
			nextState: Object,
			featureId: string,
			newValue: any,
			ref: ControlContextRef,
			getAttributes: () => Object
		): Object => {
			switch (featureId) {
				case 'publisherFontSize':
					return {
						...nextState,
						...toSimpleStyleWPCompatible({
							ref,
							newValue,
							getAttributes,
							wpAttribute: 'fontSize',
						}),
					};
				case 'publisherFontStyle':
					return {
						...nextState,
						...toSimpleStyleWPCompatible({
							ref,
							newValue,
							getAttributes,
							wpAttribute: 'fontStyle',
						}),
					};
				case 'publisherLetterSpacing':
					return {
						...nextState,
						...toSimpleStyleTypographyWPCompatible({
							ref,
							newValue,
							getAttributes,
							wpAttribute: 'letterSpacing',
						}),
					};
				case 'publisherLineHeight':
					return {
						...nextState,
						...toSimpleStyleTypographyWPCompatible({
							ref,
							newValue,
							getAttributes,
							wpAttribute: 'lineHeight',
						}),
					};
				case 'publisherTextDecoration':
					return {
						...nextState,
						...toSimpleStyleTypographyWPCompatible({
							ref,
							newValue,
							getAttributes,
							wpAttribute: 'textDecoration',
						}),
					};
				case 'publisherTextTransform':
					return {
						...nextState,
						...toSimpleStyleTypographyWPCompatible({
							ref,
							newValue,
							getAttributes,
							wpAttribute: 'textTransform',
						}),
					};
			}

			return nextState;
		}
	);
};
