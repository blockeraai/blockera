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
import { Button, Grid } from '@blockera/components';

/**
 * Internal dependencies.
 */
import PlusIcon from './icons/plus';
import { LabelControl } from '../label-control';
import { useControlContext } from '../../context';
import { RepeaterContextProvider } from './context';
import MappedItems from './components/mapped-items';
import { repeaterOnChange } from './store/reducers/utils';
import { cleanupRepeater, isEnabledPromote } from './utils';

/**
 * Types
 */
import type { RepeaterControlProps, TRepeaterDefaultStateProps } from './types';
import LabelControlContainer from '../label-control/label-control-container';

export const defaultItemValue = {
	isOpen: true,
	display: true,
	cloneable: true,
	isVisible: true,
	deletable: true,
	isSelected: false,
	selectable: false,
	visibilitySupport: true,
};

export default function RepeaterControl(
	props: RepeaterControlProps
): MixedElement {
	let {
		icon,
		description = '',
		design = 'minimal',
		mode = 'popover',
		popoverTitle,
		popoverTitleButtonsRight,
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
		//
		label,
		onRoot = true,
		labelPopoverTitle,
		labelDescription,
		id: repeaterId,
		repeaterItemOpener,
		repeaterItemHeader,
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

	const { getEntity } = select('blockera-core/data');
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

	const defaultRepeaterState: TRepeaterDefaultStateProps = {
		design,
		mode,
		popoverTitle: popoverTitle || label || '',
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
	const [count, setCount] = useState(0);

	const [disableAddNewItem, setDisableAddNewItem] = useState(false);

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
				if (item.display) {
					clonedRepeaterItems[itemId] = {
						...item,
						isSelected: false,
					};

					return;
				}

				clonedRepeaterItems[itemId] = {
					...item,
					display: true,
					isSelected: false,
				};
			});

			const newItemId: string =
				value?.type ||
				defaultRepeaterItemValue?.type ||
				itemsCount + '';

			const newValue = {
				...clonedRepeaterItems,
				[newItemId]: value,
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

								{actionButtonAdd && (
									<Button
										size="extra-small"
										className={controlInnerClassNames(
											'btn-add',
											{
												'is-deactivate':
													disableProHints &&
													disableAddNewItem,
											}
										)}
										{...(maxItems !== -1 &&
										Object.values(repeaterItems)?.length >=
											maxItems
											? { disabled: true }
											: {})}
										onClick={addNewButtonOnClick}
									>
										<PlusIcon />
										{addNewButtonLabel ||
											__('Add New', 'blockera')}
									</Button>
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

								{actionButtonAdd && (
									<Button
										size="extra-small"
										className={controlInnerClassNames(
											'btn-add',
											{
												'is-deactivate':
													disableProHints &&
													disableAddNewItem,
											}
										)}
										{...(maxItems !== -1 &&
										repeaterItems?.length >= maxItems
											? { disabled: true }
											: {})}
										showTooltip={true}
										tooltipPosition="top"
										label={
											addNewButtonLabel ||
											__('Add New', 'blockera')
										}
										onClick={addNewButtonOnClick}
									>
										<PlusIcon />
									</Button>
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
