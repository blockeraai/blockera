// @flow

/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';
import { getIconAttributes } from '@blockera/feature-icon';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import { isChanged } from './helpers';
import actions, { type UseAttributesActions } from './actions';
import type { THandleOnChangeAttributes } from '../../extensions/libs/types';
import {
	isInnerBlock,
	prepareBlockeraDefaultAttributesValues,
} from '../../extensions/components/utils';
import type {
	TBreakpoint,
	TStates,
} from '../../extensions/libs/block-card/block-states/types';
import type { InnerBlockType } from '../../extensions/libs/block-card/inner-blocks/types';

export const getAttributesWithIds = (
	state: Object,
	identifier: string,
	force: boolean = false
): Object => {
	const d = new Date();

	if (state[identifier] && !force) {
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

export const useAttributes = (
	setAttributes: (
		attributes: Object,
		{
			ref: Object,
			shouldUpdateClassName?: boolean,
		}
	) => void,
	{
		blockId,
		clientId,
		innerBlocks,
		currentBlock,
		currentState,
		isNormalState,
		getAttributes,
		setChangesets,
		blockVariations,
		currentBreakpoint,
		defaultAttributes,
		availableAttributes,
		masterIsNormalState,
		blockeraInnerBlocks,
		insideBlockInspector,
		activeBlockVariation,
		currentInnerBlockState,
		getActiveBlockVariation,
	}: {
		blockId: string,
		clientId: string,
		innerBlocks: Object,
		currentState: TStates,
		blockVariations: Object,
		defaultAttributes: Object,
		availableAttributes: Object,
		blockeraInnerBlocks: Object,
		isNormalState: () => boolean,
		activeBlockVariation: Object,
		insideBlockInspector: boolean,
		currentBreakpoint: TBreakpoint,
		currentInnerBlockState: TStates,
		masterIsNormalState: () => boolean,
		getAttributes: (key?: string) => any,
		setChangesets: (changes: boolean) => void,
		currentBlock: string | 'master' | InnerBlockType,
		getActiveBlockVariation: (name: string, attributes: Object) => boolean,
	}
): ({
	getAttributesWithIds: (state: Object, identifier: string) => Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
}) => {
	const handleOnChangeAttributes: THandleOnChangeAttributes = useCallback(
		(attributeId, newValue, options = {}): void => {
			const {
				ref,
				effectiveItems = {},
				resetStateAllValues = false,
				stateReadyToReset = 'normal',
				shouldUpdateClassName = true,
				resetInnerBlockAllValues = false,
				innerBlockReadyToReset = 'master',
			} = options;
			const attributes = getAttributes();
			// attributes => immutable - mean just read-only!
			// _attributes => mutable - mean readable and writable constant!
			let _attributes = { ...attributes };

			// Handle name attribute separately to avoid issues with block title.
			if ('name' === attributeId) {
				if (newValue === '' || newValue === null) {
					newValue = undefined;
				}

				return setAttributes(
					{
						..._attributes,
						metadata: { name: newValue },
					},
					{ ref }
				);
			}

			// Migrate to blockera attributes for some blocks where includes attributes migrations in original core Block Edit component, if we supported them.
			if (
				'undefined' === typeof _attributes?.blockeraPropsId &&
				availableAttributes?.blockeraPropsId
			) {
				_attributes = mergeObject(
					attributes,
					prepareBlockeraDefaultAttributesValues(defaultAttributes)
				);
			}

			// Sets "blockeraPropsId" if it is empty.
			if (!_attributes?.blockeraPropsId) {
				_attributes = getAttributesWithIds(
					_attributes,
					'blockeraPropsId',
					true
				);
			}
			// Sets "blockeraCompatId" if it is empty.
			if (!_attributes?.blockeraCompatId) {
				_attributes = getAttributesWithIds(
					_attributes,
					'blockeraCompatId'
				);
			}

			if (getIconAttributes().includes(attributeId)) {
				_attributes = applyFilters(
					'blockera.editor.useAttributes.beforeChangeAttributes',
					_attributes,
					attributeId,
					newValue,
					options,
					blockId
				);
			}

			const attributeIsBlockStates =
				'blockeraBlockStates' === attributeId;
			const hasRootAttributes =
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

			const {
				reset,
				updateNormalState,
				updateBlockStates,
				updateInnerBlockStates,
				updateInnerBlockInsideParentState,
			}: UseAttributesActions = actions({
				blockId,
				clientId,
				newValue,
				attributeId,
				innerBlocks,
				currentState,
				currentBlock,
				effectiveItems,
				getAttributes,
				isNormalState,
				blockVariations,
				currentBreakpoint,
				defaultAttributes,
				stateReadyToReset,
				blockeraInnerBlocks,
				resetStateAllValues,
				activeBlockVariation,
				insideBlockInspector,
				currentInnerBlockState,
				attributeIsBlockStates,
				innerBlockReadyToReset,
				getActiveBlockVariation,
				resetInnerBlockAllValues,
				ref: { ...ref?.current },
			});

			// Assume reference current action is 'reset_all_states'
			if (ref?.current?.reset) {
				setChangesets(true);
				return setAttributes(
					reducer(
						_attributes,
						reset('reset_all_states' === ref.current.action)
					),
					{ ref }
				);
			}

			// Current block (maybe 'master' or any inner blocks) in normal state!
			// or
			// attribute is "blockeraBlockStates"
			// action = UPDATE_NORMAL_STATE
			if (masterIsNormalState() && isNormalState()) {
				setChangesets(true);
				return setAttributes(
					reducer(_attributes, updateNormalState()),
					{ shouldUpdateClassName, ref }
				);
			}

			// Assume current block is one of inner blocks.
			if (isInnerBlock(currentBlock)) {
				// Assume master block isn't in normal state!
				// action = UPDATE_INNER_BLOCK_INSIDE_PARENT_STATE
				if (!masterIsNormalState()) {
					return setAttributes(
						reducer(
							_attributes,
							updateInnerBlockInsideParentState()
						),
						{ ref }
					);
				}
				// Assume current block isn't in normal state and attributeId isn't "blockeraBlockStates" for prevent cyclic object error!
				// action = UPDATE_INNER_BLOCK_STATES
				if (!isNormalState() && !attributeIsBlockStates) {
					return setAttributes(
						reducer(_attributes, updateInnerBlockStates()),
						{ ref }
					);
				}
			}

			// Assume block state is normal and attributeId is equals with "blockeraBlockStates".
			// action = UPDATE_NORMAL_STATE
			if (attributeIsBlockStates || isNormalState()) {
				return setAttributes(
					reducer(_attributes, updateNormalState()),
					{ ref }
				);
			}

			// handle update attributes in activated state and breakpoint for master block.
			// action = UPDATE_BLOCK_STATES
			setAttributes(reducer(_attributes, updateBlockStates()), { ref });
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			blockId,
			clientId,
			// className,
			innerBlocks,
			currentBlock,
			currentState,
			setAttributes,
			isNormalState,
			blockVariations,
			currentBreakpoint,
			defaultAttributes,
			masterIsNormalState,
			// blockeraInnerBlocks,
			activeBlockVariation,
			currentInnerBlockState,
			getActiveBlockVariation,
			availableAttributes?.blockeraPropsId,
		]
	);

	return {
		getAttributesWithIds,
		handleOnChangeAttributes,
	};
};
