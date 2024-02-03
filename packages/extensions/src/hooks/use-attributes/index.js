// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import { isInnerBlock } from '../../components';
import { deleteExtraItems, isChanged } from './helpers';
import actions, { type UseAttributesActions } from './actions';
import type { THandleOnChangeAttributes } from '../../libs/types';
import type {
	BreakpointTypes,
	StateTypes,
} from '../../libs/block-states/types';

export const useAttributes = (
	setAttributes: (attributes: Object) => void,
	{
		blockId,
		breakpointId,
		blockStateId,
		innerBlockId,
		isNormalState,
		getAttributes,
		masterIsNormalState,
		publisherInnerBlocks,
	}: {
		blockId: string,
		blockStateId: number,
		breakpointId: number,
		innerBlockId: number,
		isNormalState: () => boolean,
		publisherInnerBlocks: Object,
		masterIsNormalState: () => boolean,
		getAttributes: (key: string) => any,
	}
): {
	handleOnChangeAttributes: THandleOnChangeAttributes,
} => {
	const handleOnChangeAttributes: THandleOnChangeAttributes = (
		attributeId,
		newValue,
		options = {}
	): void => {
		const { getExtensionCurrentBlock } = select(
			'publisher-core/extensions'
		);
		const currentBlock = getExtensionCurrentBlock();

		const {
			ref,
			updateItems = {},
			deleteItems = [],
			addOrModifyRootItems = {},
			deleteItemsOnResetAction = [],
		} = options;
		const { getSelectedBlock } = select('core/block-editor');
		const { attributes = {} } = getSelectedBlock() || {};

		// check - is really changed attribute from root?
		if (
			isNormalState() &&
			!isInnerBlock(currentBlock) &&
			!isChanged(attributes, attributeId, newValue)
		) {
			return;
		}

		let _attributes = {
			...attributes,
			// FIXME: important!
			...(isInnerBlock(currentBlock) ? {} : addOrModifyRootItems),
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

		let innerBlockAttributes = {};

		// inner blocks by default array empty!
		// when value is empty or innerBlockId has "-1" value needs to use root attributes to prevent undefined error!
		if (!publisherInnerBlocks.length || -1 === innerBlockId) {
			innerBlockAttributes = attributes;
		} else {
			innerBlockAttributes =
				-1 === innerBlockId
					? {}
					: publisherInnerBlocks[innerBlockId].attributes;
		}

		let currentBlockAttributes = _attributes;

		// when current block is one of inner block types, must be use of inner block attributes!
		if (isInnerBlock(currentBlock)) {
			currentBlockAttributes = innerBlockAttributes;
		}

		const attributeIsRelatedStatesAttributes = [
			'publisherCurrentState',
			'publisherBlockStates',
		].includes(attributeId);

		const {
			updateNormalState,
			updateInnerBlocks,
			updateBlockStates,
			updateInnerBlockInsideParentState,
		}: UseAttributesActions = actions({
			ref,
			blockId,
			newValue,
			attributeId,
			updateItems,
			blockStateId,
			breakpointId,
			currentBlock,
			innerBlockId,
			getAttributes,
			isNormalState,
			publisherInnerBlocks,
			addOrModifyRootItems,
			currentBlockAttributes,
			deleteItemsOnResetAction,
			stateType: _attributes.publisherCurrentState,
			breakpointType: _attributes.publisherCurrentDevice,
		});

		// Assume attribute id is string, and activated state is normal, or attribute ["publisherCurrentState" or "publisherBlockStates"] will change!
		if (
			masterIsNormalState() &&
			isNormalState() &&
			attributeIsRelatedStatesAttributes
		) {
			return setAttributes(reducer(_attributes, updateNormalState()));
		}

		if (isInnerBlock(currentBlock) && !masterIsNormalState()) {
			return setAttributes(
				reducer(_attributes, updateInnerBlockInsideParentState())
			);
		}

		// handle update attributes in activated state and breakpoint!
		if (isInnerBlock(currentBlock) && !isNormalState()) {
			const _blockState =
				currentBlockAttributes?.publisherBlockStates?.find(
					(state: StateTypes): boolean =>
						state.type ===
						currentBlockAttributes.publisherCurrentState
				);
			const _breakpoint = _blockState
				? _blockState.breakpoints.find(
						(breakpoint: BreakpointTypes): boolean =>
							breakpoint.type ===
							currentBlockAttributes.publisherCurrentDevice
				  )
				: {};

			return setAttributes(
				reducer(
					_attributes,
					updateInnerBlocks({
						breakpointId: _blockState
							? _blockState.breakpoints.indexOf(_breakpoint)
							: -1,
						blockStateId: _blockState
							? currentBlockAttributes?.publisherBlockStates?.indexOf(
									_blockState
							  )
							: -1,
						breakpointType:
							currentBlockAttributes.publisherCurrentDevice,
						stateType: currentBlockAttributes.publisherCurrentState,
					})
				)
			);
		} else if (isInnerBlock(currentBlock)) {
			return setAttributes(reducer(_attributes, updateNormalState()));
		}

		// Assume block state is normal and attributeId is once of "publisherBlockStates", "publisherCurrentState".
		if (attributeIsRelatedStatesAttributes || isNormalState()) {
			return setAttributes({
				..._attributes,
				[attributeId]: newValue,
			});
		}

		// handle update attributes in activated state and breakpoint!
		setAttributes(reducer(attributes, updateBlockStates()));
	};

	return {
		handleOnChangeAttributes,
	};
};
