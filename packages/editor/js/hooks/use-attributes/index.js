// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { classNames } from '@blockera/classnames';
import { getSmallHash, mergeObject } from '@blockera/utils';
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

export const useAttributes = (
	setAttributes: (attributes: Object) => void,
	{
		blockId,
		clientId,
		className,
		innerBlocks,
		currentBlock,
		currentState,
		isNormalState,
		getAttributes,
		blockVariations,
		currentBreakpoint,
		defaultAttributes,
		availableAttributes,
		masterIsNormalState,
		blockeraInnerBlocks,
		activeBlockVariation,
		currentInnerBlockState,
		getActiveBlockVariation,
	}: {
		blockId: string,
		clientId: string,
		className: string,
		innerBlocks: Object,
		currentState: TStates,
		blockVariations: Object,
		defaultAttributes: Object,
		availableAttributes: Object,
		blockeraInnerBlocks: Object,
		isNormalState: () => boolean,
		activeBlockVariation: Object,
		currentBreakpoint: TBreakpoint,
		currentInnerBlockState: TStates,
		masterIsNormalState: () => boolean,
		getAttributes: (key?: string) => any,
		currentBlock: string | 'master' | InnerBlockType,
		getActiveBlockVariation: (name: string, attributes: Object) => boolean,
	}
): ({
	getAttributesWithIds: (state: Object, identifier: string) => Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
}) => {
	const getAttributesWithIds = useCallback(
		(state: Object, identifier: string): Object => {
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
		},
		[]
	);
	const handleOnChangeAttributes: THandleOnChangeAttributes = useCallback(
		(attributeId, newValue, options = {}): void => {
			const { ref, effectiveItems = {} } = options;
			const { getSelectedBlock } = select('core/block-editor');
			const { attributes = getAttributes() } = getSelectedBlock() || {};

			// attributes => immutable - mean just read-only!
			// _attributes => mutable - mean readable and writable constant!
			let _attributes = { ...attributes };

			// Handle name attribute separately to avoid issues with block title.
			if ('name' === attributeId) {
				if (newValue === '' || newValue === null) {
					newValue = undefined;
				}

				return setAttributes({
					..._attributes,
					metadata: { name: newValue },
				});
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
				_attributes = {
					..._attributes,
					blockeraPropsId: clientId,
				};
			}
			// Sets "blockeraCompatId" if it is empty.
			if (!_attributes?.blockeraCompatId) {
				_attributes = getAttributesWithIds(
					_attributes,
					'blockeraCompatId'
				);
			}

			const indexOfBlockeraSelector =
				attributes?.className?.indexOf('blockera-block');

			// Sets "className" attribute value is existing on block attributes to merge with default value.
			if (
				-1 === indexOfBlockeraSelector ||
				'undefined' === typeof indexOfBlockeraSelector
			) {
				_attributes = {
					..._attributes,
					className: classNames(className, attributes.className, {
						'blockera-block': true,
						[`blockera-block-${getSmallHash(clientId)}`]: true,
					}),
				};
			}

			if (getIconAttributes().includes(attributeId)) {
				_attributes = applyFilters(
					'blockera.editor.useAttributes.beforeChangeAttributes',
					_attributes,
					attributeId,
					newValue,
					options
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
				blockeraInnerBlocks,
				activeBlockVariation,
				currentInnerBlockState,
				attributeIsBlockStates,
				getActiveBlockVariation,
				ref: { ...ref?.current },
			});

			// Assume reference current action is 'reset_all_states'
			if (ref?.current?.reset) {
				return setAttributes(
					reducer(
						_attributes,
						reset('reset_all_states' === ref.current.action)
					)
				);
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
					return setAttributes(
						reducer(
							_attributes,
							updateInnerBlockInsideParentState()
						)
					);
				}
				// Assume current block isn't in normal state and attributeId isn't "blockeraBlockStates" for prevent cyclic object error!
				// action = UPDATE_INNER_BLOCK_STATES
				if (!isNormalState() && !attributeIsBlockStates) {
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

			// handle update attributes in activated state and breakpoint for master block.
			// action = UPDATE_BLOCK_STATES
			setAttributes(reducer(_attributes, updateBlockStates()));
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
