// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';
import type { ControlContextRef } from '@publisher/controls/src/context/types';
import { toSimpleStyleWPCompatible } from '../../utils';
import {
	aspectRatioToWPCompatible,
	fitToWPCompatible,
	minHeightToWPCompatible,
} from './utils';

export const bootstrap = (): void => {
	addFilter(
		`publisherCore.blockEdit.core.image.memoization.excludedAttributeKeys`,
		`publisherCore.blockEdit.core.image.memoization.excludedAttributeKeys.sizeExtension`,
		(excludedAttributeKeys: Array<string>): Array<string> => {
			//FIXME: In case a mandatory update of control values is required upon a change in the
			// high-level block state, it is essential not to omit the associated attribute key. When
			// adding an attribute key to the "excludedAttributeKeys" stack, any changes to this attribute
			// key are disregarded in the re-rendering process.
			// For Example: I need re-rendered size width control, should not add "width" attribute key in below array!
			return excludedAttributeKeys;
		},
		10
	);

	addFilter(
		'publisherCore.blockEdit.attributes',
		'publisherCore.blockEdit.sizeExtension.bootstrap',
		(attributes: Object): Object => {
			// TODO: implements filters for initialized features of size extension values.

			return attributes;
		}
	);

	addFilter(
		'publisherCore.blockEdit.setAttributes',
		'publisherCore.blockEdit.sizeExtension.bootstrap.setAttributes',
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
				case 'publisherWidth':
					return {
						...nextState,
						...toSimpleStyleWPCompatible({
							ref,
							newValue,
							getAttributes,
							wpAttribute: 'width',
						}),
					};
				case 'publisherHeight':
					return {
						...nextState,
						...toSimpleStyleWPCompatible({
							ref,
							newValue,
							getAttributes,
							wpAttribute: 'height',
						}),
					};
				case 'publisherMinHeight':
					return {
						...nextState,
						...minHeightToWPCompatible({
							ref,
							newValue,
						}),
					};
				case 'publisherRatio':
					return {
						...nextState,
						...aspectRatioToWPCompatible({
							ref,
							newValue,
						}),
					};
				case 'publisherFit':
					return {
						...nextState,
						...fitToWPCompatible({
							ref,
							newValue,
						}),
					};
			}

			return nextState;
		}
	);
};
