// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Publisher dependencies
 */
import type { ControlContextRef } from '@publisher/controls/src/context/types';

/**
 * Internal dependencies
 */
import {
	aspectRatioToWPCompatible,
	fitToWPCompatible,
	minHeightToWPCompatible,
} from './utils';
import {
	widthFromWPCompatibility,
	widthToWPCompatibility,
} from './compatibility/width';
import {
	heightFromWPCompatibility,
	heightToWPCompatibility,
} from './compatibility/height';

export const bootstrap = (): void => {
	addFilter(
		'publisherCore.blockEdit.attributes',
		'publisherCore.blockEdit.sizeExtension.bootstrap',
		(attributes, blockDetail) => {
			const { blockId, isNormalState } = blockDetail;

			if (!isNormalState()) {
				return attributes;
			}

			attributes = widthFromWPCompatibility({
				attributes,
				blockId,
			});

			attributes = heightFromWPCompatibility({
				attributes,
				blockId,
			});

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
		 * @param {isNormalState} isNormalState To check current state is normal or not
		 * @param {string} blockId Target block ID
		 *
		 * @return {Object|{}} The retrieve updated block attributes with all of wp compatibilities.
		 */
		(
			nextState: Object,
			featureId: string,
			newValue: any,
			ref: ControlContextRef,
			getAttributes: () => Object,
			isNormalState: () => boolean,
			blockId: string
		): Object => {
			if (!isNormalState()) {
				return nextState;
			}

			switch (featureId) {
				case 'publisherWidth':
					return {
						...nextState,
						...widthToWPCompatibility({
							newValue,
							ref,
							blockId,
						}),
					};

				case 'publisherHeight':
					return {
						...nextState,
						...heightToWPCompatibility({
							newValue,
							ref,
							blockId,
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
