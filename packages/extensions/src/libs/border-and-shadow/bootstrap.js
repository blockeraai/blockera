// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Publisher dependencies
 */
import type { ControlContextRef } from '@publisher/controls/src/context/types';
import { mergeObject } from '@publisher/utils';

/**
 * Internal dependencies
 */
import {
	borderFromWPCompatibility,
	borderToWPCompatibility,
} from './compatibilities/border';
import {
	borderRadiusFromWPCompatibility,
	borderRadiusToWPCompatibility,
} from './compatibilities/border-radius';

export const bootstrap = (): void => {
	addFilter(
		'publisherCore.blockEdit.attributes',
		'publisherCore.blockEdit.typographyExtension.bootstrap',
		(attributes, blockDetail) => {
			const { isNormalState } = blockDetail;

			if (!isNormalState()) {
				return attributes;
			}

			attributes = borderFromWPCompatibility({
				attributes,
			});

			attributes = borderRadiusFromWPCompatibility({
				attributes,
			});

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
		 * @param {isNormalState} isNormalState To check current state is normal or not
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
				case 'publisherBorder':
					return mergeObject(
						nextState,
						borderToWPCompatibility({
							newValue,
							ref,
						})
					);

				case 'publisherBorderRadius':
					return mergeObject(
						nextState,
						borderRadiusToWPCompatibility({
							newValue,
							ref,
						})
					);
			}

			return nextState;
		}
	);
};
