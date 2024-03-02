// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { isFunction } from '@publisher/utils';
import { Button, Grid } from '@publisher/components';

/**
 * Internal dependencies.
 */
import PlusIcon from './icons/plus';
import { LabelControl } from '../label-control';
import { useControlContext } from '../../context';
import { RepeaterContextProvider } from './context';
import MappedItems from './components/mapped-items';

/**
 * Types
 */
import type { RepeaterControlProps, TRepeaterDefaultStateProps } from './types';
import LabelControlContainer from '../label-control/label-control-container';

export const defaultItemValue = {
	isOpen: true,
	display: true,
	cloneable: true,
	sortable: true,
	isVisible: true,
	deletable: true,
	isSelected: false,
	selectable: false,
	visibilitySupport: true,
	isLastItemSupport: false,
};

export default function RepeaterControl({
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
	actionButtonAdd = true,
	actionButtonVisibility = true,
	actionButtonDelete = true,
	actionButtonClone = true,
	injectHeaderButtonsStart = '',
	injectHeaderButtonsEnd = '',
	withoutAdvancedLabel = false,
	//
	label,
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
	onSelect,
	onDelete,
	overrideItem,
	valueCleanup,
	isItemDeletable,
	itemIdGenerator,
	//
	className,
	emptyItemPlaceholder,
	...props
}: RepeaterControlProps): MixedElement {
	defaultRepeaterItemValue = {
		...defaultItemValue,
		...defaultRepeaterItemValue,
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
			repeaterId,
			defaultRepeaterItemValue,
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
		actionButtonAdd,
		actionButtonVisibility,
		actionButtonDelete,
		actionButtonClone,
		//
		onSelect,
		onDelete,
		controlId,
		repeaterId,
		overrideItem,
		getControlPath,
		itemIdGenerator,
		isItemDeletable,
		repeaterItemOpener,
		repeaterItemHeader,
		repeaterItemChildren,
		//
		defaultRepeaterItemValue,
		repeaterItems, // value
		emptyItemPlaceholder,
		//
		customProps: { ...props },
	};

	const addNewButtonOnClick = () => {
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

			modifyControlValue({
				controlId,
				value: {
					...clonedRepeaterItems,
					[newItemId]: value || {
						...defaultRepeaterItemValue,
						isSelected: true,
					},
				},
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
				controlId,
				repeaterId,
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
			controlId,
			repeaterId,
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
				data-cy="publisher-repeater-control"
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
											'btn-add'
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
											__('Add New', 'publisher-core')}
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
											'btn-add'
										)}
										{...(maxItems !== -1 &&
										repeaterItems?.length >= maxItems
											? { disabled: true }
											: {})}
										showTooltip={true}
										tooltipPosition="top"
										label={
											addNewButtonLabel ||
											__('Add New', 'publisher-core')
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
		</RepeaterContextProvider>
	);
}
