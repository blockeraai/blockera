// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';
import { select, dispatch } from '@wordpress/data';
import {
	useMemo,
	useCallback,
	useRef,
	useState,
	useEffect,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { defaultItemValue } from '@blockera/controls';
import { isEmpty, getSortedObject, mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../../utils';
import { getBaseBreakpoint } from '../../../../../editor/header-ui';
import {
	isInnerBlock,
	isNormalState,
	useBlockContext,
} from '../../../../components';
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
	setCurrentBlock,
	availableStates,
	// currentBreakpoint,
	currentInnerBlockState,
}: StatesManagerHookProps): Object => {
	const { getAttributes } = useBlockContext();
	const blockAttributes = getAttributes();
	let states = useMemo(() => {
		return { ...(attributes?.blockeraBlockStates || {}) };
	}, [attributes?.blockeraBlockStates]);

	if (isInnerBlock(currentBlock)) {
		states = {
			...(blockAttributes?.blockeraInnerBlocks?.[currentBlock]?.attributes
				?.blockeraBlockStates || {}),
			...states,
		};
	}
	const {
		changeExtensionCurrentBlockState: setCurrentState,
		changeExtensionInnerBlockState: setInnerBlockState,
	} = dispatch('blockera/extensions') || {};
	const { getBlockStates, getActiveMasterState, getActiveInnerState } =
		select('blockera/extensions');
	const {
		getStates,
		getBreakpoints,
		getInnerStates,
		getSelectedBlockStyleVariation,
	} = select('blockera/editor');
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
		if (Object.keys(availableStates)?.length) {
			states = savedBlockStates;
		}
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
					{ ...StateTypes, isSelected: boolean },
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
	}, [
		id,
		block,
		states,
		currentBlock,
		currentState,
		preparedStates,
		setCurrentState,
		setInnerBlockState,
		getActiveInnerState,
		getActiveMasterState,
		currentInnerBlockState,
	]);

	const defaultRepeaterItemValue = {
		deletable: true,
		selectable: true,
		visibilitySupport: true,
	};

	const deletedItemIdsRef = useRef<Array<TStates | string>>([]);
	const [deletedItemRevision, setDeletedItemRevision] = useState(0);
	const deleteExtensionSyncRef = useRef({
		pending: false,
		completed: false,
	});

	useEffect(() => {
		const pendingDeletes = deletedItemIdsRef.current.filter(
			(deletedId) => deletedId in states
		);

		if (pendingDeletes.length !== deletedItemIdsRef.current.length) {
			deletedItemIdsRef.current = pendingDeletes;
			setDeletedItemRevision((revision) => revision + 1);
		}
	}, [states]);

	const contextValue = useMemo(() => {
		let value = calculatedValue;

		if (deletedItemIdsRef.current.length) {
			value = { ...calculatedValue };

			for (const deletedId of deletedItemIdsRef.current) {
				delete value[deletedId];
			}
		}

		return {
			block,
			value,
			blockName: block.blockName,
			attribute: 'blockeraBlockStates',
			name: generateExtensionId(block, id, false),
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps -- deletedItemRevision drives ref-based value filtering
	}, [block, calculatedValue, deletedItemRevision, id]);

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
			deletedItemIdsRef.current = [...deletedItemIdsRef.current, itemId];
			setDeletedItemRevision((revision) => revision + 1);
			deleteExtensionSyncRef.current = {
				pending: true,
				completed: false,
			};

			const filteredStates: {
				[key: TStates]: Object,
			} = {};

			Object.entries(items).forEach(
				([_itemId, _item]: [
					TStates,
					{ ...StateTypes, isSelected: boolean },
				]): void => {
					if (_itemId === itemId) {
						return;
					}

					filteredStates[_itemId] = {
						..._item,
						isSelected: isNormalState(_itemId),
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
							current: {
								path: isInnerBlock(currentBlock)
									? `blockeraInnerBlocks.value[${currentBlock}].attributes.blockeraBlockStates`
									: `blockeraBlockStates`,
								reset: false,
								action: 'normal',
								defaultValue: {},
							},
						},
					}
				);
			}

			return filteredStates;
		},
		[clonedSavedStates, currentBlock, onChange]
	);

	const onReset = useCallback(
		(
			itemId: TStates,
			repeaterItems: { [key: TStates]: Object }
		): Object => {
			let mergedStates: { [key: TStates]: Object } = {
				...(attributes?.blockeraBlockStates || {}),
			};

			if (isInnerBlock(currentBlock)) {
				mergedStates = {
					...(blockAttributes?.blockeraInnerBlocks?.[currentBlock]
						?.attributes?.blockeraBlockStates || {}),
					...mergedStates,
				};
			}

			const filteredStates: {
				[key: TStates]: Object,
			} = {};
			const stateKeys = new Set([...Object.keys(mergedStates), itemId]);

			for (const key of stateKeys) {
				const stateItem = mergedStates[key];

				if (key !== itemId) {
					filteredStates[key] =
						stateItem && 'object' === typeof stateItem
							? { ...stateItem }
							: stateItem;

					continue;
				}

				const prevBreakpoints = stateItem?.breakpoints || {};
				const nextBreakpoints: {
					[string]: { attributes: Object },
				} = {};

				for (const breakpoint of Object.keys(prevBreakpoints)) {
					nextBreakpoints[breakpoint] = {
						attributes: {},
					};
				}

				if (!Object.keys(nextBreakpoints).length) {
					nextBreakpoints[getBaseBreakpoint()] = {
						attributes: {},
					};
				}

				filteredStates[key] = {
					...stateItem,
					breakpoints: nextBreakpoints,
					...(undefined !== stateItem &&
					null !== stateItem &&
					'content' in stateItem
						? { content: '' }
						: {}),
				};
			}

			onChange('blockeraBlockStates', filteredStates, {
				ref: {
					current: {
						path: isInnerBlock(currentBlock)
							? `blockeraInnerBlocks.value[${currentBlock}].attributes.blockeraBlockStates`
							: `blockeraBlockStates`,
						reset: false,
						defaultValue: {},
						action: 'normal',
					},
				},
				stateReadyToReset: itemId,
				resetStateAllValues: true,
			});

			const nextRepeaterItems: { [key: string]: Object } = {};

			for (const key of Object.keys(repeaterItems)) {
				const persisted = filteredStates[key];
				const isSelected = Boolean(repeaterItems[key]?.isSelected);

				if (persisted) {
					nextRepeaterItems[key] = {
						...repeaterItems[key],
						...persisted,
						breakpoints: persisted.breakpoints,
						isSelected,
					};
				} else {
					nextRepeaterItems[key] = {
						...repeaterItems[key],
						isSelected,
					};
				}
			}

			return nextRepeaterItems;
		},
		// eslint-disable-next-line
		[
			attributes?.blockeraBlockStates,
			blockAttributes?.blockeraInnerBlocks,
			currentBlock,
			onChange,
		]
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
			const deletedItems = deletedItemIdsRef.current;
			const defaultItem = {
				...defaultRepeaterItemValue,
				...getStateInfo(
					deletedItems.length ? deletedItems[0] : statesCount,
					defaultStates
				),
				display: true,
			};

			if (deletedItems.length) {
				deletedItemIdsRef.current = deletedItems.slice(1);
				setDeletedItemRevision((revision) => revision + 1);
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
		(newValue: Object) => {
			let sanitizedValue = newValue;

			if (deletedItemIdsRef.current.length) {
				sanitizedValue = { ...newValue };

				for (const deletedId of deletedItemIdsRef.current) {
					delete sanitizedValue[deletedId];
				}
			}

			const deleteSyncState = deleteExtensionSyncRef.current;
			let skipExtensionSync = deleteSyncState.completed;

			if (deleteSyncState.pending) {
				deleteExtensionSyncRef.current = {
					pending: false,
					completed: true,
				};
				skipExtensionSync = false;

				void Promise.resolve().then(() => {
					deleteExtensionSyncRef.current.completed = false;
				});
			}

			onChangeBlockStates(
				sanitizedValue,
				{
					block,
					states,
					onChange,
					currentState,
					currentBlock,
					valueCleanup,
					getStateInfo,
					getBlockStates,
					setCurrentBlock,
					currentInnerBlockState,
					currentBlockStyleVariation:
						getSelectedBlockStyleVariation(),
					isMasterBlockStates: isMasterBlockStates(id),
					skipExtensionSync,
				},
				preparedStates
			);
		},
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
		onReset,
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

export { useResetBlockStateToNormal } from './use-reset-block-state-to-normal';
