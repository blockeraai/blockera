// @flow

/**
 * External dependencies
 */
import { useMemo, useCallback } from '@wordpress/element';
import memoize from 'fast-memoize';
import { select, dispatch } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isEmpty, mergeObject, getSortedObject } from '@blockera/utils';
import { defaultItemValue } from '@blockera/controls';

/**
 * Internal dependencies
 */
import {
	getStateInfo,
	onChangeBlockStates,
	isMasterBlockStates,
	blockStatesValueCleanup,
} from '../helpers';
import { isNormalState } from '../../../components';
import type {
	BreakpointTypes,
	StatesManagerProps,
	StateTypes,
	TStates,
	StatesManagerUtils,
} from '../types';
import { generateExtensionId } from '../../utils';
import { getBaseBreakpoint } from '../../../../canvas-editor';

// the instance of in-memory cache.
const deleteCacheData: Object = new Map();

export const useStatesManagerUtils = ({
	block,
	onChange,
	attributes,
	currentBlock,
	currentState,
	availableStates,
	currentBreakpoint,
	currentInnerBlockState,
	id = 'master-block-states',
}: StatesManagerProps): StatesManagerUtils => {
	const {
		changeExtensionCurrentBlockState: setCurrentState,
		changeExtensionInnerBlockState: setInnerBlockState,
	} = dispatch('blockera/extensions') || {};
	let states = { ...(attributes?.blockeraBlockStates || {}) };
	const { getBlockStates, getActiveMasterState, getActiveInnerState } =
		select('blockera/extensions');
	const { getStates, getBreakpoints } = select('blockera/editor');
	const savedBlockStates = getBlockStates(
		block?.clientId,
		!isMasterBlockStates(id) ? currentBlock : block?.blockName
	);
	const defaultStates = getStates();
	const clonedSavedStates = { ...states };

	if (isEmpty(states)) {
		// Sets initialize states ...
		states = savedBlockStates;
	} else {
		states = mergeObject(savedBlockStates, states);
	}

	// Try to preparing available states!
	const preparedStates = useMemo(() => {
		if (
			Object.keys(attributes?.blockeraUnsavedData?.states || {}).length >
			0
		) {
			return getSortedObject(attributes?.blockeraUnsavedData?.states);
		} else if (availableStates) {
			return getSortedObject(availableStates);
		}

		return getSortedObject(defaultStates);
	}, [
		defaultStates,
		availableStates,
		attributes?.blockeraUnsavedData?.states,
	]);

	const calculatedValue = useMemo(() => {
		const itemsCount = Object.values(states).length;
		if (itemsCount >= 2) {
			const initialValue: { [key: TStates | string]: StateTypes } = {};

			const memoizedInitialValue = memoize(
				([itemId, state]: [
					TStates,
					{ ...StateTypes, isSelected: boolean }
				]): void => {
					const activeInnerBlockState = getActiveInnerState(
						block.clientId,
						currentBlock
					);
					const activeMasterBlockState = getActiveMasterState(
						block.clientId,
						block.blockName
					);
					const isSelected = !isMasterBlockStates(id)
						? itemId === activeInnerBlockState
						: itemId === activeMasterBlockState;

					initialValue[itemId] = {
						...state,
						...preparedStates[itemId],
						...defaultItemValue,
						isOpen: false,
						selectable: true,
						display: itemsCount > 1,
						visibilitySupport: false,
						isSelected,
						deletable: 'normal' !== itemId,
						breakpoints: state?.breakpoints ?? {
							// $FlowFixMe
							[getBaseBreakpoint()]: {
								attributes: {},
							},
						},
					};
				}
			);

			Object.entries(states).forEach(memoizedInitialValue);

			return initialValue;
		}

		if (isMasterBlockStates(id) && !isNormalState(currentState)) {
			setCurrentState('normal');
		} else if (
			!isMasterBlockStates(id) &&
			!isNormalState(currentInnerBlockState)
		) {
			setInnerBlockState('normal');
		}

		return {
			normal: {
				...preparedStates.normal,
				...defaultItemValue,
				isOpen: false,
				display: false,
				deletable: false,
				selectable: true,
				isSelected: true,
				visibilitySupport: false,
				breakpoints: states.normal.breakpoints,
			},
		};
		// eslint-disable-next-line
	}, [currentBlock, states, currentBreakpoint]);

	const defaultRepeaterItemValue = {
		deletable: true,
		selectable: true,
		visibilitySupport: true,
	};

	const contextValue = {
		block,
		value: calculatedValue,
		blockName: block.blockName,
		attribute: 'blockeraBlockStates',
		name: generateExtensionId(block, id, false),
	};

	const valueCleanup = useCallback(
		blockStatesValueCleanup,
		// eslint-disable-next-line
		[]
	);
	const onDelete = useCallback(
		(
			itemId: TStates,
			items: {
				[key: TStates]: Object,
			}
		): Object => {
			// add the latest-deleted item in cache.
			deleteCacheData.set('deleted-items', [
				...(deleteCacheData.get('deleted-items') || []),
				itemId,
			]);

			const filteredStates: {
				[key: TStates]: Object,
			} = {};
			const itemsCount = Object.keys(items).length;

			Object.entries(items).forEach(
				([_itemId, _item]: [
					TStates,
					{ ...StateTypes, isSelected: boolean }
				]): void => {
					if (_itemId === itemId) {
						return;
					}

					if (itemsCount < 3) {
						filteredStates[_itemId] = {
							..._item,
							display: false,
						};

						return;
					}

					if ('normal' === _itemId) {
						if (items[itemId].isSelected) {
							// Assume deleted item was selected item
							filteredStates[_itemId] = {
								..._item,
								isSelected: true,
							};

							return;
						}

						filteredStates[_itemId] = {
							..._item,
						};

						return;
					}

					filteredStates[_itemId] = _item;
				}
			);

			let isDeletedItem: boolean = false;

			// $FlowFixMe
			for (const stateType: TStates in clonedSavedStates) {
				if (!filteredStates[stateType]) {
					isDeletedItem = true;
					delete clonedSavedStates[stateType];
				}
			}

			if (isDeletedItem) {
				// Remove base breakpoint of normal state.
				delete clonedSavedStates?.normal?.breakpoints[
					getBaseBreakpoint()
				];

				// Remove normal state while not exists any breakpoints.
				if (
					!Object.keys(clonedSavedStates?.normal?.breakpoints || {})
						.length
				) {
					delete clonedSavedStates?.normal;
				}

				onChange(
					'blockeraBlockStates',
					!Object.keys(clonedSavedStates).length
						? {}
						: clonedSavedStates,
					{}
				);
			}

			return filteredStates;
		},
		// eslint-disable-next-line
		[clonedSavedStates]
	);
	/**
	 * Retrieve dynamic default value for repeater items.
	 *
	 * @param {number} statesCount the states counter.
	 * @param {Object} defaultRepeaterItemValue the state item default value.
	 * @return {{settings: {max: number, min: number, color: string, cssSelector?: string}, force: boolean, label: string, breakpoints: Array<Object>, type: TStates}} the
	 * state item with dynamic default value.
	 */
	const getDynamicDefaultRepeaterItem = useCallback(
		(statesCount: number, defaultRepeaterItemValue: Object): Object => {
			const deletedItems = deleteCacheData.get('deleted-items');
			const defaultItem = {
				...defaultRepeaterItemValue,
				...getStateInfo(
					// If deletedItems has items try to add first index of that else add suitable items for statesCount value.
					deletedItems?.length ? deletedItems[0] : statesCount,
					defaultStates
				),
				display: true,
			};

			// If deletedItems has items try to update in-memory cache.
			if (deletedItems?.length) {
				deletedItems.splice(0, 1);

				deleteCacheData.set('deleted-items', deletedItems);
			}

			if (['custom-class', 'parent-class'].includes(defaultItem.type)) {
				defaultItem['css-class'] = '';
			}

			defaultItem.breakpoints = getBreakpoints(defaultItem.type);

			return defaultItem;
		},
		// eslint-disable-next-line
		[]
	);
	const handleOnChange = useCallback(
		(newValue: Object) =>
			onChangeBlockStates(
				newValue,
				{
					states,
					onChange,
					currentState,
					currentBlock,
					valueCleanup,
					getStateInfo,
					getBlockStates,
					currentInnerBlockState,
					isMasterBlockStates: isMasterBlockStates(id),
				},
				defaultStates
			),
		// eslint-disable-next-line
		[currentBlock, currentInnerBlockState, currentState, id, states]
	);
	//Override item when occurred clone action!
	const overrideItem = useCallback((item) => {
		if ('normal' === item.type) {
			return {
				deletable: true,
				visibilitySupport: true,
				breakpoints: item?.breakpoints?.map(
					(b: BreakpointTypes): BreakpointTypes => {
						if (getBaseBreakpoint() === b.type) {
							return {
								...b,
								attributes: {},
							};
						}

						return b;
					}
				),
			};
		}

		return {};
	}, []);

	return {
		states,
		onDelete,
		contextValue,
		valueCleanup,
		overrideItem,
		defaultStates,
		preparedStates,
		handleOnChange,
		calculatedValue,
		defaultRepeaterItemValue,
		getDynamicDefaultRepeaterItem,
	};
};
