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
	backgroundFromWPCompatibility,
	backgroundToWPCompatibility,
} from './compatibility/background';
import { mergeObject } from '@publisher/utils';
import {
	backgroundColorFromWPCompatibility,
	backgroundColorToWPCompatibility,
} from './compatibility/background-color';

export const bootstrap = (): void => {
	addFilter(
		'publisherCore.blockEdit.attributes',
		'publisherCore.blockEdit.backgroundExtension.bootstrap',
		(attributes, blockDetail) => {
			const { blockId, isNormalState } = blockDetail;

			if (!isNormalState()) {
				return attributes;
			}

			attributes = backgroundFromWPCompatibility({
				attributes,
				blockId,
			});

			attributes = backgroundColorFromWPCompatibility({
				attributes,
				blockId,
			});

			return attributes;
		}
	);

	addFilter(
		'publisherCore.blockEdit.setAttributes',
		'publisherCore.blockEdit.backgroundExtension.bootstrap.setAttributes',
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
			isNormalState: () => boolean
		): Object => {
			if (!isNormalState()) {
				return nextState;
			}

			switch (featureId) {
				case 'publisherBackground':
					return mergeObject(
						nextState,
						backgroundToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'publisherBackgroundColor':
					return mergeObject(
						nextState,
						backgroundColorToWPCompatibility({
							newValue,
							ref,
						})
					);
			}

			return nextState;
		}
	);
};
