// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';
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
import { Button, Grid } from '../';
import { LabelControl } from '../label-control';
import { useControlContext } from '../../context';
import { setValueAddon, useValueAddon } from '../../';
import { RepeaterContextProvider } from './context';
import MappedItems from './components/mapped-items';
import RepeaterPopoverTitleDelete from './components/popover-title-delete';
import { BLOCKERA_REPEATER_PROMO_DATA_CY } from './data-cy';
import { repeaterOnChange } from './store/reducers/utils';
import { cleanupRepeater, isEnabledPromote } from './utils';

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
		popoverOffset = 35,
		addNewButtonLabel,
		addNewButtonDataTest,
		popoverClassName,
		maxItems = -1,
		minItems = 0,
		selectable = false,
		onSelectableItemActivate,
		shouldRenderRepeaterItem,
		showItemEditButton = false,
		isNativeSupport = false,
		actionButtonAdd = true,
		actionButtonVisibility = true,
		actionButtonDelete = true,
		actionButtonClone = true,
		actionButtonReset = false,
		injectHeaderButtonsStart = '',
		injectHeaderButtonsEnd = '',
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

	const [disableAddNewItem, setDisableAddNewItem] = useState(false);

	const {
		valueAddonClassNames,
		isSetValueAddon,
		ValueAddonControl,
		ValueAddonPointer,
	} = useValueAddon({
		types: controlAddonTypes,
		value: repeaterItems,
		setValue: (newValue: any): void =>
			setValueAddon(newValue, setValue, defaultValue),
		variableTypes,
		dynamicValueTypes,
		onChange: setValue,
		size: 'extra-small',
	});

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
									resetToDefault={resetToDefault}
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
		popoverOffset,
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
		//
		defaultRepeaterItemValue,
		enableCreatingStep,
		repeaterItems, // value
		//
		customProps: {
			...additionalPropsForRepeaterContext,
			...customProps,
		},
		isNativeSupport,
		enablePromoCountOnRepeaterItemHeader,
	};

	const addNewButtonOnClick = () => {
		if (isEnabledPromote(PromoComponent, repeaterItems)) {
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

			const newItemId: string =
				value?.type ||
				defaultRepeaterItemValue?.type ||
				itemsCount + '';

			const newValue = {
				...clonedRepeaterItems,
				[newItemId]: value || defaultRepeaterItemValue,
			};

			modifyControlValue({
				controlId,
				value: newValue,
			});

			repeaterOnChange(newValue, {
				onChange,
				valueCleanup,
			});
		};

		if (maxItems !== -1 && itemsCount >= maxItems) {
			return;
		}

		if ('function' === typeof getDynamicDefaultRepeaterItem) {
			const value = getDynamicDefaultRepeaterItem(
				itemsCount,
				defaultRepeaterItemValue
			);

			if (value?.selectable) {
				return callback(
					newItemWithCreatingStep({
						...value,
						isSelected: true,
					})
				);
			}

			addRepeaterItem({
				onChange,
				controlId,
				repeaterId,
				valueCleanup,
				value: newItemWithCreatingStep(value),
			});

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
			itemIdGenerator,
			value: defaultRepeaterItemValue,
		});
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
										resetToDefault={resetToDefault}
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
						{actionButtonAdd && (
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
												resetToDefault={resetToDefault}
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
										actionButtonAdd && (
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
										actionButtonAdd && (
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
			{!disableProHints &&
				count >= 1 &&
				isEnabledPromote(PromoComponent, repeaterItems) && (
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
