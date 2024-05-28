// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import { isChanged } from './helpers';
import { isInnerBlock } from '../../extensions/components/utils';
import actions, { type UseAttributesActions } from './actions';
import type { THandleOnChangeAttributes } from '../../extensions/libs/types';

export const useAttributes = (
	setAttributes: (attributes: Object) => void,
	{
		blockId,
		isNormalState,
		getAttributes,
		innerBlocks,
		masterIsNormalState,
		blockeraInnerBlocks,
	}: {
		blockId: string,
		innerBlocks: Object,
		isNormalState: () => boolean,
		blockeraInnerBlocks: Object,
		masterIsNormalState: () => boolean,
		getAttributes: (key?: string) => any,
	}
): ({
	getAttributesWithIds: (state: Object, identifier: string) => Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
}) => {
	const getAttributesWithIds = (
		state: Object,
		identifier: string
	): Object => {
		const d = new Date();

		if (state[identifier]) {
			return state;
		}

		return {
			...state,
			[identifier]:
				'' +
				d.getMonth() +
				d.getDate() +
				d.getHours() +
				d.getMinutes() +
				d.getSeconds() +
				d.getMilliseconds(),
		};
	};
	const handleOnChangeAttributes: THandleOnChangeAttributes = (
		attributeId,
		newValue,
		options = {}
	): void => {
		const { ref, effectiveItems = {} } = options;
		const { getSelectedBlock } = select('core/block-editor');
		const { attributes = getAttributes() } = getSelectedBlock() || {};
		const {
			getExtensionCurrentBlock,
			getExtensionInnerBlockState,
			getExtensionCurrentBlockState,
			getExtensionCurrentBlockStateBreakpoint,
		} = select('blockera-core/extensions');

		// attributes => immutable - mean just read-only!
		// _attributes => mutable - mean readable and writable constant!
		let _attributes = { ...attributes };

		if (!_attributes?.blockeraPropsId) {
			_attributes = getAttributesWithIds(_attributes, 'blockeraPropsId');
		}

		const currentBlock = getExtensionCurrentBlock();

		const attributeIsBlockStates = 'blockeraBlockStates' === attributeId;
		let hasRootAttributes =
			_attributes.blockeraInnerBlocks &&
			_attributes.blockeraInnerBlocks[currentBlock];

		// check - is really changed attribute of any block type (master or one of inner blocks)?
		if (isNormalState()) {
			// Assume block is inner block and has attributes in normal state.
			if (
				isInnerBlock(currentBlock) &&
				hasRootAttributes &&
				!isChanged(
					{
						..._attributes,
						..._attributes.blockeraInnerBlocks[currentBlock]
							.attributes,
					},
					attributeId,
					newValue
				)
			) {
				return;
			}

			// Assume block is master.
			if (
				!isInnerBlock(currentBlock) &&
				!isChanged(attributes, attributeId, newValue)
			) {
				return;
			}
		}

		const currentState = getExtensionCurrentBlockState();
		const currentInnerBlockState = getExtensionInnerBlockState();
		const currentBreakpoint = getExtensionCurrentBlockStateBreakpoint();

		const {
			reset,
			updateNormalState,
			updateBlockStates,
			updateInnerBlockStates,
			updateInnerBlockInsideParentState,
		}: UseAttributesActions = actions({
			ref,
			blockId,
			newValue,
			attributeId,
			innerBlocks,
			currentState,
			currentBlock,
			effectiveItems,
			getAttributes,
			isNormalState,
			currentBreakpoint,
			blockeraInnerBlocks,
			currentInnerBlockState,
			attributeIsBlockStates,
		});

		// Assume reference current action is 'reset_all_states'
		if ('reset_all_states' === ref?.current?.action) {
			return setAttributes(reducer(_attributes, reset(true)));
		}

		// Assume reference current action is 'reset'
		if ('reset' === ref?.current?.action) {
			return setAttributes(reducer(_attributes, reset()));
		}

		// Current block (maybe 'master' or any inner blocks) in normal state!
		// or
		// attribute is "blockeraBlockStates"
		// action = UPDATE_NORMAL_STATE
		if (masterIsNormalState() && isNormalState()) {
			return setAttributes(reducer(_attributes, updateNormalState()));
		}

		// Assume current block is one of inner blocks.
		if (isInnerBlock(currentBlock)) {
			// Assume master block isn't in normal state!
			// action = UPDATE_INNER_BLOCK_INSIDE_PARENT_STATE
			if (!masterIsNormalState()) {
				let currentBlockAttributes: Object = {};

				if (
					_attributes.blockeraBlockStates[currentState].breakpoints[
						currentBreakpoint
					]
				) {
					currentBlockAttributes =
						_attributes.blockeraBlockStates[currentState]
							.breakpoints[currentBreakpoint].attributes;
				}

				if (
					!currentBlockAttributes?.blockeraInnerBlocks ||
					!currentBlockAttributes?.blockeraInnerBlocks[currentBlock]
				) {
					hasRootAttributes = false;
				}

				if (
					hasRootAttributes &&
					!isChanged(
						{
							..._attributes,
							..._attributes.blockeraBlockStates[currentState]
								.breakpoints[currentBreakpoint]?.attributes,
							...(hasRootAttributes
								? currentBlockAttributes?.blockeraInnerBlocks[
										currentBlock
								  ]?.attributes
								: {}),
						},
						attributeId,
						newValue
					)
				) {
					return;
				}

				return setAttributes(
					reducer(attributes, updateInnerBlockInsideParentState())
				);
			}
			// Assume current block isn't in normal state and attributeId isn't "blockeraBlockStates" for prevent cyclic object error!
			// action = UPDATE_INNER_BLOCK_STATES
			if (!isNormalState() && !attributeIsBlockStates) {
				let currentBlockAttributes: Object = {};

				if (
					_attributes.blockeraInnerBlocks[currentBlock].attributes
						.blockeraBlockStates[currentInnerBlockState]
						.breakpoints[currentBreakpoint]
				) {
					currentBlockAttributes =
						_attributes.blockeraInnerBlocks[currentBlock].attributes
							.blockeraBlockStates[currentInnerBlockState]
							.breakpoints[currentBreakpoint].attributes;
				}

				if (
					!currentBlockAttributes?.blockeraInnerBlocks ||
					!currentBlockAttributes?.blockeraInnerBlocks[currentBlock]
				) {
					hasRootAttributes = false;
				}
				if (
					!isChanged(
						{
							..._attributes,
							...(hasRootAttributes
								? _attributes.blockeraInnerBlocks[currentBlock]
										.attributes
								: {}),
							...(hasRootAttributes
								? _attributes.blockeraInnerBlocks[currentBlock]
										.attributes.blockeraBlockStates[
										currentInnerBlockState
								  ].breakpoints[currentBreakpoint].attributes
								: {}),
						},
						attributeId,
						newValue
					)
				) {
					return;
				}

				return setAttributes(
					reducer(_attributes, updateInnerBlockStates())
				);
			}
		}

		// Assume block state is normal and attributeId is equals with "blockeraBlockStates".
		// action = UPDATE_NORMAL_STATE
		if (attributeIsBlockStates || isNormalState()) {
			return setAttributes(reducer(_attributes, updateNormalState()));
		}

		if (
			_attributes.blockeraBlockStates[currentState].breakpoints[
				currentBreakpoint
			] &&
			!isChanged(
				{
					..._attributes,
					..._attributes.blockeraBlockStates[currentState]
						.breakpoints[currentBreakpoint].attributes,
				},
				attributeId,
				newValue,
				{
					[attributeId]: null,
				}
			)
		) {
			return;
		}

		// handle update attributes in activated state and breakpoint for master block.
		// action = UPDATE_BLOCK_STATES
		setAttributes(reducer(_attributes, updateBlockStates()));
	};

	return {
		getAttributesWithIds,
		handleOnChangeAttributes,
	};
};
