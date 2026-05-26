// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';
import { select, dispatch } from '@wordpress/data';
import { useMemo, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { defaultItemValue } from '@blockera/controls';
import { isEmpty, getSortedObject, mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../../utils';
import { getBaseBreakpoint } from '../../../../../canvas-editor';
import { isNormalState, isInnerBlock } from '../../../../components';
import type {
	TStates,
	StateTypes,
	BreakpointTypes,
	StatesManagerHookProps,
} from '../types';
import {
	getStateInfo,
	onChangeBlockStates,
	isMasterBlockStates,
	blockStatesValueCleanup,
} from '../helpers';

export const useBlockStates = ({
	id = 'master-block-states',
	block,
	onChange,
	attributes,
	currentBlock,
	currentState,
	deleteCacheData,
	availableStates,
	currentBreakpoint,
	currentInnerBlockState,
}: StatesManagerHookProps): Object => {
	let states = { ...(attributes?.blockeraBlockStates || {}) };
	const {
		changeExtensionCurrentBlockState: setCurrentState,
		changeExtensionInnerBlockState: setInnerBlockState,
	} = dispatch('blockera/extensions') || {};
	const { getBlockStates, getActiveMasterState, getActiveInnerState } =
		select('blockera/extensions');
	const { getStates, getBreakpoints, getInnerStates } =
		select('blockera/editor');
	const savedBlockStates = getBlockStates(
		block?.clientId,
		!isMasterBlockStates(id) ? currentBlock : block?.blockName
	);
	const defaultStates = isInnerBlock(currentBlock)
		? getInnerStates()
		: getStates();
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
		const forcedStates: {
			[key: TStates | string]: {
				...StateTypes,
				isSelected: boolean,
			},
		} = {};

		for (const key in preparedStates) {
			if (!preparedStates.hasOwnProperty(key)) {
				continue;
			}

			const state = preparedStates[key];

			if (!state?.force) {
				continue;
			}

			forcedStates[key] = {
				...state,
				...defaultItemValue,
				isOpen: false,
				display: true,
				deletable: false,
				selectable: true,
				visibilitySupport: false,
				breakpoints: state.breakpoints,
				isSelected: 'normal' === state?.type,
			};
		}

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

					// Exclude forced states from initial value.
					if (Object.keys(forcedStates).includes(itemId)) {
						forcedStates[itemId] = {
							...forcedStates[itemId],
							isSelected,
						};
						return;
					}

					initialValue[itemId] = {
						...state,
						...preparedStates[itemId],
						...defaultItemValue,
						isOpen: false,
						display: true,
						selectable: true,
						visibilitySupport: false,
						isSelected,
						deletable: !state?.force,
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

			// $FlowFixMe
			return {
				// $FlowFixMe
				...forcedStates,
				...initialValue,
			};
		}

		if (isMasterBlockStates(id) && !isNormalState(currentState)) {
			setCurrentState('normal');
		} else if (
			!isMasterBlockStates(id) &&
			!isNormalState(currentInnerBlockState)
		) {
			setInnerBlockState('normal');
		}

		return forcedStates;
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
		needUpdate: (next: Object): boolean => {
			const deletedItems = deleteCacheData.get('deleted-items');

			if (!deletedItems) {
				return true;
			}

			for (const key in next) {
				if (deletedItems.includes(key)) {
					deleteCacheData.set('deleted-items', []);
					return false;
				}
			}

			return true;
		},
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
					// Skip the deleted item.
					if (_itemId === itemId) {
						return;
					}

					// Skip the normal and hover states.
					if (itemsCount < 3) {
						return;
					}

					if ('normal' !== _item.type) {
						filteredStates[_itemId] = {
							..._item,
							isSelected: false,
						};

						return;
					}

					// Set the selected normal state.
					filteredStates[_itemId] = {
						..._item,
						isSelected: true,
					};
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
					{
						ref: {
							path: isInnerBlock(currentBlock)
								? `blockeraInnerBlocks.value[${currentBlock}].attributes.blockeraBlockStates`
								: `blockeraBlockStates`,
							reset: false,
							action: 'normal',
							defaultValue: {},
						},
					}
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
				preparedStates
			),
		// eslint-disable-next-line
		[currentBlock, currentInnerBlockState, currentState, id, states]
	);
	//Override item when occurred clone action!
	const overrideItem = useCallback((item) => {
		if (item?.force) {
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
		id,
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
