// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { isFunction } from '@blockera/utils';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies.
 */
import Grid from '../grid';
import { Button } from '../button';
import { LabelControl } from '../label-control';
import { useControlContext } from '../../context';
import { setValueAddon, useValueAddon } from '../../value-addons';
import { RepeaterContextProvider } from './context';
import MappedItems from './components/mapped-items';
import RepeaterPopoverTitleDelete from './components/popover-title-delete';
import { BLOCKERA_REPEATER_PROMO_DATA_CY } from './data-cy';
import {
	repeaterOnChange,
	resolveAddedRepeaterItemId,
} from './store/reducers/utils';
import { cleanupRepeater, isRepeaterPromoActive } from './utils';

/**
 * Types
 */
import { defaultItemValue } from './default-item-value';
import LabelControlContainer from '../label-control/label-control-container';
import type { RepeaterControlProps, TRepeaterDefaultStateProps } from './types';

export default function RepeaterControl(
	props: RepeaterControlProps
): MixedElement {
	let {
		icon,
		description = '',
		design = 'minimal',
		mode = 'popover',
		popoverProps,
		popoverTitle,
		popoverTitleButtonsRight,
		showPopoverTitleDelete = false,
		addNewButtonLabel,
		addNewButtonDataTest,
		popoverClassName,
		maxItems = -1,
		minItems = 0,
		selectable = false,
		onSelectableItemActivate,
		shouldRenderRepeaterItem,
		resolveRepeaterItemSize,
		showItemEditButton = false,
		actionButtonAdd = true,
		actionButtonVisibility = true,
		actionButtonDelete = true,
		actionButtonClone = true,
		actionButtonReset = false,
		injectHeaderButtonsStart = '',
		injectHeaderButtonsEnd = '',
		suppressNativeSectionAddButton = false,
		actionButtonsType = 'inline',
		actionMenuButtonLabel,
		withoutAdvancedLabel = false,
		isSupportInserter = false,
		disableRegenerateId = true,
		shouldConfirmDeleteModal = false,
		confirmDeleteModalProps,
		//
		label,
		children,
		singularId,
		repeaterItem,
		controlAddonTypes,
		variableTypes,
		dynamicValueTypes,
		onRoot = true,
		labelPopoverTitle,
		labelDescription,
		id: repeaterId,
		repeaterItemOpener,
		repeaterItemHeader,
		InserterComponent,
		repeaterItemChildren,
		repeaterItemVariations,
		getDynamicDefaultRepeaterItem,
		itemColumns = 1,
		//
		defaultValue = {},
		defaultRepeaterItemValue = { isVisible: true },
		onChange,
		onDelete,
		onReset,
		overrideItem,
		valueCleanup = cleanupRepeater,
		itemIdGenerator,
		PromoComponent,
		//
		className,
		canAddNewItem = true,
		enableCreatingStep = false,
		showNoItemsMessage = false,
		noItemsMessage,
		customProps = {},
		enablePromoCountOnRepeaterItemHeader = true,
		onRegisterAddNewAction,
		...additionalPropsForRepeaterContext
	} = applyFilters(`blockera.controls.${props.id}.props`, props);

	let resolvedPopoverTitleButtonsRight = popoverTitleButtonsRight;
	if (resolvedPopoverTitleButtonsRight === undefined) {
		resolvedPopoverTitleButtonsRight = showPopoverTitleDelete
			? RepeaterPopoverTitleDelete
			: undefined;
	}

	const { getEntity } = select('blockera/data');
	const {
		settings: {
			general: { disableProHints },
		},
	} = getEntity('blockera') || {
		settings: {
			general: { disableProHints: false },
		},
	};

	if (onRoot) {
		repeaterId = undefined;
	}

	defaultRepeaterItemValue = {
		...defaultItemValue,
		...defaultRepeaterItemValue,
		selectable,
	};

	const {
		value: repeaterItems,
		setValue,
		dispatch: { addRepeaterItem, modifyControlValue },
		controlInfo: { name: controlId, attribute, blockName },
		getControlPath,
		resetToDefault,
	} = useControlContext({
		defaultValue,
		sideEffect: true,
		repeater: {
			defaultRepeaterItemValue,
			repeaterId: onRoot ? undefined : repeaterId,
		},
		onChange,
		valueCleanup,
		mergeInitialAndDefault: true,
	});
	const [count, setCount] = useState(0);
	const [pendingOpenItemId, setPendingOpenItemId] = useState(null);

	const clearPendingOpenItemId = useCallback((itemId?: string) => {
		setPendingOpenItemId((current) =>
			itemId === undefined || current === itemId ? null : current
		);
	}, []);

	const reparentPendingOpenItemId = useCallback(
		(fromItemId: string, toItemId: string) => {
			setPendingOpenItemId((current) =>
				current === fromItemId ? toItemId : current
			);
		},
		[]
	);

	const [disableAddNewItem, setDisableAddNewItem] = useState(false);

	let normalizedVariableTypes: string[] = [];
	if (Array.isArray(variableTypes)) {
		normalizedVariableTypes = variableTypes;
	} else if (typeof variableTypes === 'string') {
		normalizedVariableTypes = [variableTypes];
	}

	const repeaterPresetInterfaceVariableTypes = [
		'filter',
		'transform',
		'transition',
		'shadow',
		'text-shadow',
	];
	const needsRepeaterPresetInterface = normalizedVariableTypes.some((type) =>
		repeaterPresetInterfaceVariableTypes.includes(type)
	);

	const {
		valueAddonClassNames,
		isSetValueAddon,
		ValueAddonControl,
		ValueAddonPointer,
		valueAddonControlProps,
	} = useValueAddon({
		types: controlAddonTypes,
		value: repeaterItems,
		setValue: (newValue: any): void =>
			setValueAddon(newValue, setValue, defaultValue),
		variableTypes,
		dynamicValueTypes,
		onChange: setValue,
		size: 'extra-small',
		presetInterface: needsRepeaterPresetInterface
			? {
					variableTypes: normalizedVariableTypes,
					attribute,
				}
			: undefined,
	});

	/**
	 * Label reset must match value-addon remove (clear attribute + addon state), not only
	 * reset the repeater store — otherwise block attributes keep the preset and hover preview
	 * re-applies it on the next picker open.
	 */
	const alignedResetToDefault = useCallback(
		(args) => {
			if (
				controlAddonTypes?.length &&
				isSetValueAddon() &&
				valueAddonControlProps?.handleOnClickRemove
			) {
				valueAddonControlProps.handleOnClickRemove(
					({
						stopPropagation: () => {},
						preventDefault: () => {},
					}: any)
				);
				return;
			}

			if (typeof resetToDefault !== 'function') {
				return;
			}

			return resetToDefault({
				...(args || {}),
				onChange: args?.onChange ?? onChange,
				valueCleanup: args?.valueCleanup ?? valueCleanup,
			});
		},
		[
			controlAddonTypes,
			isSetValueAddon,
			valueAddonControlProps,
			resetToDefault,
			onChange,
			valueCleanup,
		]
	);

	const disabledAddNewItemForRegister =
		!maxItems ||
		(maxItems !== -1 &&
			Object.keys(repeaterItems || {})?.length >= maxItems);

	const addNewButtonOnClickRef = useRef<() => void>(() => {});
	const registerAddNewOnClickRef = useRef<() => void>(() => {
		addNewButtonOnClickRef.current();
	});
	const addNewActionRef = useRef({
		onClick: registerAddNewOnClickRef.current,
		label: '',
		dataTest: undefined,
		canAdd: true,
		disabled: false,
	});

	addNewActionRef.current.onClick = registerAddNewOnClickRef.current;
	addNewActionRef.current.label =
		addNewButtonLabel || __('Add New', 'blockera');
	addNewActionRef.current.dataTest = addNewButtonDataTest;
	addNewActionRef.current.disabled = disabledAddNewItemForRegister;

	const canRegisterCustomAddNewAction =
		Boolean(onRegisterAddNewAction) &&
		canAddNewItem &&
		(actionButtonAdd || injectHeaderButtonsEnd) &&
		!isSetValueAddon();

	useEffect(() => {
		if (!onRegisterAddNewAction) {
			return undefined;
		}

		if (!canRegisterCustomAddNewAction) {
			onRegisterAddNewAction(null);
			return () => {
				onRegisterAddNewAction(null);
			};
		}

		const cleanup = onRegisterAddNewAction(addNewActionRef.current);

		return () => {
			if (typeof cleanup === 'function') {
				cleanup();
			} else {
				onRegisterAddNewAction(null);
			}
		};
	}, [onRegisterAddNewAction, canRegisterCustomAddNewAction]);

	useEffect(() => {
		if (!canRegisterCustomAddNewAction) {
			return;
		}

		onRegisterAddNewAction?.(addNewActionRef.current);
	}, [
		onRegisterAddNewAction,
		canRegisterCustomAddNewAction,
		addNewButtonLabel,
		addNewButtonDataTest,
		disabledAddNewItemForRegister,
	]);

	if (isSetValueAddon()) {
		return (
			<div
				className={controlClassNames(
					'repeater',
					'design-' + design,
					className
				)}
				data-cy="blockera-repeater-control"
			>
				<div className={controlInnerClassNames('header')}>
					{label && (
						<LabelControlContainer height="30px">
							{!withoutAdvancedLabel ? (
								<LabelControl
									label={label}
									labelPopoverTitle={labelPopoverTitle}
									labelDescription={labelDescription}
									value={repeaterItems}
									mode={'advanced'}
									isRepeater={true}
									blockName={blockName}
									attribute={attribute}
									resetToDefault={alignedResetToDefault}
									defaultValue={
										isFunction(valueCleanup)
											? valueCleanup(defaultValue)
											: defaultValue
									}
								/>
							) : (
								<LabelControl label={label} mode={'simple'} />
							)}
						</LabelControlContainer>
					)}

					<div
						className={controlInnerClassNames(
							'repeater-header-action-buttons'
						)}
					>
						{injectHeaderButtonsStart}

						<div
							className={controlClassNames(
								'repeater',
								'repeater-value-addon',
								className,
								valueAddonClassNames
							)}
							data-cy="blockera-repeater-control-value-addon"
						>
							<ValueAddonControl />
						</div>

						{injectHeaderButtonsEnd}
					</div>
				</div>
			</div>
		);
	}

	const defaultRepeaterState: TRepeaterDefaultStateProps = {
		design,
		mode,
		count,
		setCount,
		disableAddNewItem,
		setDisableAddNewItem,
		popoverProps,
		popoverTitle: popoverTitle || label || '',
		popoverTitleButtonsRight: resolvedPopoverTitleButtonsRight,
		actionButtonsType,
		actionMenuButtonLabel,
		//
		labelPopoverTitle,
		labelDescription,
		//
		popoverClassName,
		maxItems,
		minItems,
		selectable,
		onSelectableItemActivate,
		shouldRenderRepeaterItem,
		resolveRepeaterItemSize,
		showItemEditButton,
		actionButtonAdd,
		actionButtonVisibility,
		actionButtonDelete,
		actionButtonClone,
		actionButtonReset,
		disableRegenerateId,
		shouldConfirmDeleteModal,
		confirmDeleteModalProps,
		//
		onChange,
		onDelete,
		onReset,
		controlId,
		repeaterId,
		overrideItem,
		valueCleanup,
		getControlPath,
		PromoComponent,
		itemIdGenerator,
		repeaterItemOpener,
		repeaterItemHeader,
		repeaterItemChildren,
		repeaterItemVariations,
		//
		defaultRepeaterItemValue,
		enableCreatingStep,
		repeaterItems, // value
		//
		customProps: {
			...additionalPropsForRepeaterContext,
			...customProps,
		},
		enablePromoCountOnRepeaterItemHeader,
		disableProHints,
		pendingOpenItemId,
		clearPendingOpenItemId,
		reparentPendingOpenItemId,
	};

	const addNewButtonOnClick = () => {
		if (
			isRepeaterPromoActive(
				PromoComponent,
				repeaterItems,
				disableProHints
			)
		) {
			setCount(count + 1);
			setDisableAddNewItem(true);

			return;
		}

		defaultRepeaterItemValue = {
			...defaultItemValue,
			...defaultRepeaterItemValue,
			selectable,
			...(enableCreatingStep ? { creatingStep: true } : {}),
		};

		const itemsCount = Object.keys(repeaterItems || {}).length;

		const newItemWithCreatingStep = (value: any): any =>
			enableCreatingStep ? { ...value, creatingStep: true } : value;

		const resolveAddedItemId = (
			itemValue: ?Object,
			{ selectableId = false }: { selectableId?: boolean } = {}
		): string =>
			resolveAddedRepeaterItemId({
				itemValue: itemValue || defaultRepeaterItemValue,
				itemsCount,
				repeaterItems,
				defaultRepeaterItemValue,
				itemIdGenerator,
				selectableId,
			});

		const queueEditPopoverForAddedItem = (
			itemValue: ?Object,
			{ selectableId = false }: { selectableId?: boolean } = {}
		): void => {
			setPendingOpenItemId(
				resolveAddedItemId(itemValue, { selectableId })
			);
		};

		const callback = (value?: Object): void => {
			if (!defaultRepeaterItemValue?.selectable) {
				return;
			}

			const clonedRepeaterItems: { [key: string]: any } = {};

			Object.entries(repeaterItems).forEach(([itemId, item]): void => {
				clonedRepeaterItems[itemId] = {
					...item,
					display: item?.display || true,
					isSelected: false,
				};
			});

			const newItemId = resolveAddedItemId(value, { selectableId: true });
			const addedRow = value || defaultRepeaterItemValue;

			const newValue = {
				...clonedRepeaterItems,
				[newItemId]: addedRow,
			};

			modifyControlValue({
				controlId,
				value: newValue,
			});

			// Apply to the bound control before persisting so the value addon sticks.
			if (
				typeof onSelectableItemActivate === 'function' &&
				addedRow?.creatingStep === true
			) {
				onSelectableItemActivate(newItemId, addedRow);
			}

			repeaterOnChange(newValue, {
				onChange,
				valueCleanup,
			});

			queueEditPopoverForAddedItem(value, { selectableId: true });
		};

		if (maxItems !== -1 && itemsCount >= maxItems) {
			return;
		}

		if ('function' === typeof getDynamicDefaultRepeaterItem) {
			const value = getDynamicDefaultRepeaterItem(
				itemsCount,
				defaultRepeaterItemValue
			);

			if (value?.selectable || defaultRepeaterItemValue?.selectable) {
				return callback(
					newItemWithCreatingStep({
						...(value && typeof value === 'object' ? value : {}),
						isSelected: true,
					})
				);
			}

			const addedItemValue = newItemWithCreatingStep(value);

			addRepeaterItem({
				onChange,
				controlId,
				repeaterId,
				valueCleanup,
				itemIdGenerator:
					'function' === typeof itemIdGenerator
						? itemIdGenerator
						: () => resolveAddedItemId(addedItemValue),
				value: addedItemValue,
			});

			queueEditPopoverForAddedItem(addedItemValue);

			return;
		}

		if (defaultRepeaterItemValue?.selectable) {
			return callback();
		}

		addRepeaterItem({
			onChange,
			controlId,
			repeaterId,
			valueCleanup,
			itemIdGenerator:
				'function' === typeof itemIdGenerator
					? itemIdGenerator
					: () => resolveAddedItemId(defaultRepeaterItemValue),
			value: defaultRepeaterItemValue,
		});

		queueEditPopoverForAddedItem(defaultRepeaterItemValue);
	};

	const hasRepeaterItems = Object.keys(repeaterItems || {}).length > 0;

	const items = hasRepeaterItems && (
		<>
			{itemColumns > 1 ? (
				<Grid
					className={controlInnerClassNames(
						'repeater-items-container'
					)}
					gridTemplateColumns={`repeat(${itemColumns}, 1fr)`}
					gap="10px"
				>
					<MappedItems />
					{children}
				</Grid>
			) : (
				<>
					<MappedItems />
					{children}
				</>
			)}
		</>
	);

	const repeaterItemsContent = hasRepeaterItems
		? items
		: showNoItemsMessage && (
				<div
					className={controlInnerClassNames('repeater__no-items')}
					data-cy="blockera-repeater-no-items"
				>
					{noItemsMessage !== undefined && noItemsMessage !== null
						? noItemsMessage
						: __('No items.', 'blockera')}
				</div>
			);

	const disabledAddNewItem =
		!maxItems ||
		(maxItems !== -1 && Object.keys(repeaterItems)?.length >= maxItems);

	addNewButtonOnClickRef.current = addNewButtonOnClick;

	const renderAddItemButtonWithValueAddon = (
		button: MixedElement
	): MixedElement => {
		if (!valueAddonClassNames) {
			return button;
		}

		return (
			<span
				className={controlClassNames(
					'repeater-add-item-trigger',
					valueAddonClassNames
				)}
			>
				<ValueAddonPointer />
				{button}
			</span>
		);
	};

	const LargeNativeInserter = ({
		onClick,
		...props
	}: {
		onClick?: (callback: () => void) => void,
		props?: Object,
	}) =>
		renderAddItemButtonWithValueAddon(
			<Button
				data-test={
					addNewButtonDataTest ||
					addNewButtonLabel ||
					__('Add New', 'blockera')
				}
				size="extra-small"
				className={controlInnerClassNames('btn-add', {
					'is-deactivate': disableProHints && disableAddNewItem,
				})}
				disabled={disabledAddNewItem}
				onClick={() =>
					'function' === typeof onClick
						? onClick(addNewButtonOnClick)
						: addNewButtonOnClick()
				}
				{...props}
			>
				<Icon icon="plus" iconSize="20" />
				{addNewButtonLabel || __('Add New', 'blockera')}
			</Button>
		);

	const SmallNativeInserter = ({
		onClick,
		...props
	}: {
		onClick?: (callback: () => void) => void,
		props?: Object,
	}) => {
		return renderAddItemButtonWithValueAddon(
			<Button
				data-test={
					addNewButtonDataTest ||
					addNewButtonLabel ||
					__('Add New', 'blockera')
				}
				size="extra-small"
				className={controlInnerClassNames('btn-add', {
					'is-deactivate': disableProHints && disableAddNewItem,
				})}
				disabled={disabledAddNewItem}
				showTooltip={true}
				tooltipPosition="top"
				label={addNewButtonLabel || __('Add New', 'blockera')}
				onClick={(event: MouseEvent) => {
					if ('function' === typeof onClick) {
						// $FlowFixMe
						onClick(addNewButtonOnClick, event);
					} else {
						addNewButtonOnClick();
					}
				}}
				{...props}
			>
				<Icon icon="plus" iconSize="20" />
			</Button>
		);
	};

	return (
		<RepeaterContextProvider {...defaultRepeaterState}>
			<div
				className={controlClassNames(
					'repeater',
					'design-' + design,
					className
				)}
				data-cy="blockera-repeater-control"
			>
				{design === 'large' && (
					<>
						{icon}

						{label && (
							<LabelControlContainer height="30px">
								{!withoutAdvancedLabel ? (
									<LabelControl
										label={label}
										labelPopoverTitle={labelPopoverTitle}
										labelDescription={labelDescription}
										value={repeaterItems}
										mode={'advanced'}
										isRepeater={true}
										blockName={blockName}
										attribute={attribute}
										resetToDefault={alignedResetToDefault}
										defaultValue={
											isFunction(valueCleanup)
												? valueCleanup(defaultValue)
												: defaultValue
										}
									/>
								) : (
									<LabelControl
										label={label}
										mode={'simple'}
									/>
								)}
							</LabelControlContainer>
						)}

						{repeaterItemsContent}

						{description && (
							<div
								className={controlInnerClassNames(
									'repeater__desc'
								)}
							>
								{description}
							</div>
						)}

						{canAddNewItem &&
							(actionButtonAdd ||
								injectHeaderButtonsStart ||
								injectHeaderButtonsEnd) && (
								<div
									className={controlInnerClassNames('header')}
								>
									<div
										className={controlInnerClassNames(
											'repeater-header-action-buttons'
										)}
									>
										{injectHeaderButtonsStart}

										{isSupportInserter &&
											actionButtonAdd && (
												<InserterComponent
													PlusButton={
														LargeNativeInserter
													}
													callback={
														addNewButtonOnClick
													}
													insertArgs={{
														onChange,
														controlId,
														repeaterId,
														valueCleanup,
														repeaterItems,
														addRepeaterItem,
														itemIdGenerator,
														addNewButtonOnClick,
														defaultRepeaterItemValue,
													}}
												/>
											)}

										{!isSupportInserter &&
											actionButtonAdd && (
												<LargeNativeInserter />
											)}

										{injectHeaderButtonsEnd}
									</div>
								</div>
							)}
					</>
				)}

				{design === 'minimal' && (
					<>
						{(actionButtonAdd ||
							injectHeaderButtonsStart ||
							injectHeaderButtonsEnd) && (
							<div className={controlInnerClassNames('header')}>
								{label && (
									<>
										{!withoutAdvancedLabel ? (
											<LabelControl
												label={label}
												labelPopoverTitle={
													labelPopoverTitle
												}
												labelDescription={
													labelDescription
												}
												value={repeaterItems}
												mode={'advanced'}
												isRepeater={true}
												blockName={blockName}
												attribute={attribute}
												resetToDefault={
													alignedResetToDefault
												}
												defaultValue={
													isFunction(valueCleanup)
														? valueCleanup(
																defaultValue
															)
														: defaultValue
												}
											/>
										) : (
											<LabelControl
												label={label}
												mode={'simple'}
											/>
										)}
									</>
								)}
								<div
									className={controlInnerClassNames(
										'repeater-header-action-buttons'
									)}
								>
									{injectHeaderButtonsStart}

									{isSupportInserter &&
										canAddNewItem &&
										actionButtonAdd &&
										!suppressNativeSectionAddButton && (
											<InserterComponent
												PlusButton={SmallNativeInserter}
												callback={addNewButtonOnClick}
												insertArgs={{
													onChange,
													controlId,
													repeaterId,
													valueCleanup,
													repeaterItems,
													addRepeaterItem,
													itemIdGenerator,
													addNewButtonOnClick,
													defaultRepeaterItemValue,
												}}
											/>
										)}

									{!isSupportInserter &&
										canAddNewItem &&
										actionButtonAdd &&
										!suppressNativeSectionAddButton && (
											<SmallNativeInserter />
										)}

									{injectHeaderButtonsEnd}
								</div>
							</div>
						)}

						{repeaterItemsContent}
					</>
				)}
			</div>
			{count >= 1 &&
				isRepeaterPromoActive(
					PromoComponent,
					repeaterItems,
					disableProHints
				) && (
					<div data-cy={BLOCKERA_REPEATER_PROMO_DATA_CY}>
						{PromoComponent({
							isOpen: count >= 1,
							items: repeaterItems,
							onClose: () => setCount(0),
						})}
					</div>
				)}
		</RepeaterContextProvider>
	);
}

export { BLOCKERA_REPEATER_PROMO_DATA_CY } from './data-cy';
export {
	default as RepeaterItem,
	RepeaterItemVariationsPane,
} from './components/repeater-item';
