// @flow

/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';

/**
 * Publisher dependencies
 */
import { deletePropertyByPath, isEquals } from '@publisher/utils';

/**
 * Internal dependencies
 */
import type { THandleOnChangeAttributes } from '../libs/types';

export const useAttributes = (
	attributes: Object,
	setAttributes: (attributes: Object) => void,
	{
		breakpointId,
		blockStateId,
		isNormalState,
	}: {
		blockStateId: number,
		breakpointId: number,
		isNormalState: () => boolean,
	}
): {
	handleOnChangeAttributes: THandleOnChangeAttributes,
} => {
	const handleOnChangeAttributes: THandleOnChangeAttributes = (
		attributeId,
		newValue,
		options = {}
	): void => {
		const {
			ref,
			updateItems = {},
			deleteItems = [],
			addOrModifyRootItems = {},
			deleteItemsOnResetAction = [],
		} = options;
		let _attributes = { ...attributes, ...addOrModifyRootItems };

		const deleteExtraItems = (items: Array<string>, from: Object): void => {
			if (items?.length) {
				// Assume existed deleteItems.
				for (let i = 0; i < items?.length; i++) {
					deletePropertyByPath(from, items[i]);
				}
			}
		};

		// if handler has any delete items!
		deleteExtraItems(deleteItems, _attributes);

		// Assume activated state is normal and existed "updateItems" has items!
		if (
			'object' === typeof updateItems &&
			Object.values(updateItems)?.length &&
			isNormalState()
		) {
			_attributes = {
				..._attributes,
				...updateItems,
			};
		}

		// to optimize performance 🎯
		const isChanged = (
			stateAttributes: Object,
			key: string,
			newValue: any,
			fallbackAttributes: Object = _attributes
		): boolean => {
			if (!stateAttributes[key]) {
				return !isEquals(fallbackAttributes[key], newValue);
			}

			return !isEquals(stateAttributes[key], newValue);
		};

		// Assume attribute id is string, and activated state is normal, or attribute ["publisherCurrentState" or "publisherBlockStates"] will change!
		if (
			isNormalState() ||
			['publisherCurrentState', 'publisherBlockStates'].includes(
				attributeId
			)
		) {
			if (ref?.current?.reset) {
				const newAttributes = {
					..._attributes,
				};

				deletePropertyByPath(
					newAttributes,
					ref.current.path.replace(/\[/g, '.').replace(/]/g, '')
				);

				// if handler has deleteItemsOnResetAction.
				deleteExtraItems(deleteItemsOnResetAction, _attributes);
			}

			if (!isChanged(_attributes, attributeId, newValue)) {
				return;
			}

			setAttributes({
				..._attributes,
				// $FlowFixMe
				[attributeId]: newValue,
			});

			return;
		}

		// Memoized "publisherBlockStates" data remapping process to fastest.
		const memoizedBlockStates = memoize(() =>
			_attributes.publisherBlockStates.map((state, id) => {
				if (blockStateId !== id) {
					return state;
				}

				return {
					...state,
					breakpoints: state.breakpoints.map((breakpoint, id) => {
						if (breakpointId !== id) {
							return breakpoint;
						}

						if (ref?.current?.reset) {
							const newAttributes = {
								...breakpoint.attributes,
							};

							deletePropertyByPath(
								newAttributes,
								ref.current.path
									.replace(/\[/g, '.')
									.replace(/]/g, '')
							);

							// if handler has deleteItemsOnResetAction.
							deleteExtraItems(
								deleteItemsOnResetAction,
								newAttributes
							);

							return {
								...breakpoint,
								attributes: newAttributes,
							};
						}

						if ('string' !== typeof attributeId) {
							return breakpoint;
						}

						if (
							'object' === typeof updateItems &&
							Object.values(updateItems)?.length
						) {
							breakpoint = {
								...breakpoint,
								attributes: {
									...breakpoint.attributes,
									...updateItems,
								},
							};
						}

						if (
							!isChanged(
								breakpoint.attributes,
								attributeId,
								newValue,
								_attributes
							)
						) {
							return breakpoint;
						}

						return {
							...breakpoint,
							attributes: {
								...breakpoint.attributes,
								[attributeId]: newValue,
							},
						};
					}),
				};
			})
		);

		// This paradigm to handle update attributes in activated state and breakpoint!
		setAttributes({
			..._attributes,
			publisherBlockStates: memoizedBlockStates(),
		});
	};

	return {
		handleOnChangeAttributes,
	};
};
