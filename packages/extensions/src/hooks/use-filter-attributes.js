// @flow

/**
 * External dependencies
 */
import type { ControlContextRef } from '@publisher/controls/src/context/types';

/**
 * Internal dependencies
 */
import availableFeatures from '../libs/wp-compat';

export const useFilterAttributes = (): Object => {
	return {
		/**
		 * Retrieve block attributes with WordPress compatibilities.
		 *
		 * @param {Object} nextState The block attributes changed with publisher feature newValue and latest version of block state.
		 * @param {string} featureId The publisher feature identifier.
		 * @param {*} newValue The newValue sets to feature.
		 * @param {ControlContextRef} ref The reference of control context action occurred.
		 * @return {Object|{}} The retrieve updated block attributes with all of wp compatibilities.
		 */
		toWPCompat: (
			nextState: Object,
			featureId: string,
			newValue: any,
			ref: ControlContextRef
		): Object => {
			if (!Object.keys(availableFeatures).includes(featureId)) {
				return nextState;
			}

			const {
				[featureId]: { wpAttribute, callback },
			} = availableFeatures;

			if ('function' !== typeof callback) {
				return nextState;
			}

			return {
				...nextState,
				...callback({
					ref,
					newValue,
					wpAttribute,
					getAttributes: () => nextState,
				}),
			};
		},
	};
};
