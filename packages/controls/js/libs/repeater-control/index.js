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
import { RepeaterContextProvider } from './context';
import MappedItems from './components/mapped-items';
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
		popoverOffset = 35,
		addNewButtonLabel,
		popoverClassName,
		maxItems = -1,
		minItems = 0,
		selectable = false,
		actionButtonAdd = true,
		actionButtonVisibility = true,
		actionButtonDelete = true,
		actionButtonClone = true,
		injectHeaderButtonsStart = '',
		injectHeaderButtonsEnd = '',
		withoutAdvancedLabel = false,
		isSupportInserter = false,
		//
		label,
		children,
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
		overrideItem,
		valueCleanup = cleanupRepeater,
		itemIdGenerator,
		PromoComponent,
		//
		className,
		...customProps
	} = applyFilters(`blockera.controls.${props.id}.props`, props);

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
		popoverTitleButtonsRight,
		//
		labelPopoverTitle,
		labelDescription,
		//
		popoverClassName,
		maxItems,
		minItems,
		selectable,
		actionButtonAdd,
		actionButtonVisibility,
		actionButtonDelete,
		actionButtonClone,
		//
		onChange,
		onDelete,
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
		repeaterItems, // value
		//
		customProps,
	};

	const addNewButtonOnClick = () => {
		if (isEnabledPromote(PromoComponent, repeaterItems)) {
			setCount(count + 1);
			setDisableAddNewItem(true);

			return;
		}

		const itemsCount = Object.keys(repeaterItems || {}).length;

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
				return callback({
					...value,
					isSelected: true,
				});
			}

			addRepeaterItem({
				onChange,
				controlId,
				repeaterId,
				valueCleanup,
				value: getDynamicDefaultRepeaterItem(
					repeaterItems?.length,
					defaultRepeaterItemValue
				),
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

	const items = Object.keys(repeaterItems).length > 0 && (
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
				</Grid>
			) : (
				<MappedItems />
			)}
		</>
	);

	const disabledAddNewItem =
		!maxItems ||
		(maxItems !== -1 && Object.keys(repeaterItems)?.length >= maxItems);

	const LargeNativeInserter = ({
		onClick,
	}: {
		onClick?: (callback: () => void) => void,
	}) => (
		<Button
			data-test={addNewButtonLabel || __('Add New', 'blockera')}
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
		>
			<Icon icon="plus" iconSize="20" />
			{addNewButtonLabel || __('Add New', 'blockera')}
		</Button>
	);

	const SmallNativeInserter = ({
		onClick,
	}: {
		onClick?: (callback: () => void) => void,
	}) => (
		<Button
			data-test={addNewButtonLabel || __('Add New', 'blockera')}
			size="extra-small"
			className={controlInnerClassNames('btn-add', {
				'is-deactivate': disableProHints && disableAddNewItem,
			})}
			disabled={disabledAddNewItem}
			showTooltip={true}
			tooltipPosition="top"
			label={addNewButtonLabel || __('Add New', 'blockera')}
			onClick={() =>
				'function' === typeof onClick
					? onClick(addNewButtonOnClick)
					: addNewButtonOnClick()
			}
		>
			<Icon icon="plus" iconSize="20" />
		</Button>
	);

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
							<LabelControlContainer height="26px">
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

						{items}

						{description && (
							<div
								className={controlInnerClassNames(
									'repeater__desc'
								)}
							>
								{description}
							</div>
						)}

						<div className={controlInnerClassNames('header')}>
							<div
								className={controlInnerClassNames(
									'repeater-header-action-buttons'
								)}
							>
								{injectHeaderButtonsStart}

								{children}

								{isSupportInserter && actionButtonAdd && (
									<InserterComponent
										PlusButton={LargeNativeInserter}
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

								{!isSupportInserter && actionButtonAdd && (
									<LargeNativeInserter />
								)}

								{injectHeaderButtonsEnd}
							</div>
						</div>
					</>
				)}

				{design === 'minimal' && (
					<>
						<div className={controlInnerClassNames('header')}>
							{label && (
								<>
									{!withoutAdvancedLabel ? (
										<LabelControl
											label={label}
											labelPopoverTitle={
												labelPopoverTitle
											}
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
								</>
							)}

							<div
								className={controlInnerClassNames(
									'repeater-header-action-buttons'
								)}
							>
								{injectHeaderButtonsStart}

								{children}

								{isSupportInserter && actionButtonAdd && (
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

								{!isSupportInserter && actionButtonAdd && (
									<SmallNativeInserter />
								)}

								{injectHeaderButtonsEnd}
							</div>
						</div>

						{items}
					</>
				)}
			</div>
			{!disableProHints &&
				count >= 1 &&
				isEnabledPromote(PromoComponent, repeaterItems) &&
				PromoComponent({
					isOpen: count >= 1,
					items: repeaterItems,
					onClose: () => setCount(0),
				})}
		</RepeaterContextProvider>
	);
}
