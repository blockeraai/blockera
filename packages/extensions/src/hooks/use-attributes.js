// @flow

/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { default as memoize } from 'fast-memoize';

/**
 * Publisher dependencies
 */
import { deletePropertyByPath, isEquals } from '@publisher/utils';

/**
 * Internal dependencies
 */
import type { THandleOnChangeAttributes } from '../libs/types';
import type { InnerBlockType } from '../libs/inner-blocks/types';
import { isInnerBlock } from '../components';

export const useAttributes = (
	attributes: Object,
	setAttributes: (attributes: Object) => void,
	{
		currentBlock,
		breakpointId,
		blockStateId,
		isNormalState,
		innerBlockId,
		getAttributes,
		blockId,
	}: {
		blockStateId: number,
		breakpointId: number,
		innerBlockId: number,
		isNormalState: () => boolean,
		currentBlock: 'master' | InnerBlockType,
		getAttributes: (key: string) => any,
		blockId: string,
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
			if (!stateAttributes || !stateAttributes[key]) {
				return !isEquals(fallbackAttributes[key], newValue);
			}

			return !isEquals(stateAttributes[key], newValue);
		};

		const publisherInnerBlocks = _attributes.publisherInnerBlocks;

		const currentBlockAttributes = isInnerBlock(currentBlock)
			? _attributes.publisherInnerBlocks[innerBlockId].attributes
			: _attributes;

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

			if (!isChanged(currentBlockAttributes, attributeId, newValue)) {
				return;
			}

			// Handle inner block changes.
			if (isInnerBlock(currentBlock)) {
				publisherInnerBlocks[innerBlockId].attributes = {
					...currentBlockAttributes,
					[attributeId]: newValue,
				};

				if ('publisherCurrentState' === attributeId) {
					_attributes = {
						..._attributes,
						[attributeId]: newValue,
					};
				}

				return setAttributes({
					..._attributes,
					publisherInnerBlocks,
				});
			}

			setAttributes(
				/**
				 * Filterable attributes before set next state.
				 * usefully in add WordPress compatibility and any other filters.
				 *
				 * hook: 'publisher-core/block/extensions/set-attributes'
				 *
				 * @since 1.0.0
				 */
				applyFilters(
					'publisherCore.blockEdit.setAttributes',
					{
						..._attributes,
						[attributeId]: newValue,
					},
					attributeId,
					newValue,
					ref,
					getAttributes,
					isNormalState,
					blockId
				)
			);

			return;
		}

		// Memoized "publisherBlockStates" data remapping process to fastest.
		const memoizedBlockStates = memoize((currentBlockAttributes: Object) =>
			currentBlockAttributes.publisherBlockStates.map((state, id) => {
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
								currentBlockAttributes
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

		// handle update attributes in activated state and breakpoint!
		if (isInnerBlock(currentBlock)) {
			publisherInnerBlocks[innerBlockId].attributes.publisherBlockStates =
				memoizedBlockStates(currentBlockAttributes);

			return setAttributes({
				..._attributes,
				publisherInnerBlocks,
			});
		}

		// handle update attributes in activated state and breakpoint!
		setAttributes({
			..._attributes,
			publisherBlockStates: memoizedBlockStates(_attributes),
		});
	};

	return {
		handleOnChangeAttributes,
	};
};
