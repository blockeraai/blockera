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
import { Button } from '@publisher/components';

/**
 * Internal dependencies.
 */
import PlusIcon from './icons/plus';
import LabelControl from '../label-control';
import { useControlContext } from '../../context';
import { RepeaterContextProvider } from './context';
import MappedItems from './components/mapped-items';

/**
 * Types
 */
import type { RepeaterControlProps, TRepeaterDefaultStateProps } from './types';

export const defaultItemValue = {
	isOpen: true,
	display: true,
	cloneable: true,
	isVisible: true,
	deletable: true,
	selectable: false,
	visibilitySupport: true,
};

export default function RepeaterControl({
	design = 'minimal',
	mode = 'popover',
	popoverTitle,
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
	//
	defaultValue = [],
	defaultRepeaterItemValue = { isVisible: true },
	onChange,
	onSelect,
	overrideItem,
	valueCleanup,
	//
	className,
	...props
}: RepeaterControlProps): MixedElement {
	defaultRepeaterItemValue = {
		...defaultItemValue,
		...defaultRepeaterItemValue,
	};

	const {
		value,
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

	const repeaterItems = value;

	const defaultRepeaterState: TRepeaterDefaultStateProps = {
		design,
		mode,
		popoverTitle: popoverTitle || label || '',
		labelPopoverTitle,
		labelDescription,
		popoverClassName,
		maxItems,
		minItems,
		actionButtonAdd,
		actionButtonVisibility,
		actionButtonDelete,
		actionButtonClone,
		//
		onSelect,
		controlId,
		repeaterId,
		overrideItem,
		getControlPath,
		repeaterItemOpener,
		repeaterItemHeader,
		repeaterItemChildren,
		//
		defaultRepeaterItemValue,
		repeaterItems, // value
		//
		customProps: { ...props },
	};

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
				<div className={controlInnerClassNames('header')}>
					{!withoutAdvancedLabel ? (
						<LabelControl
							label={label}
							labelPopoverTitle={labelPopoverTitle}
							labelDescription={labelDescription}
							value={value}
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

					<div
						className={controlInnerClassNames(
							'repeater-header-action-buttons'
						)}
					>
						{injectHeaderButtonsStart}

						{actionButtonAdd && (
							<Button
								size="extra-small"
								className={controlInnerClassNames('btn-add')}
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
								onClick={() => {
									const callback = (value?: Object): void => {
										if (
											!defaultRepeaterItemValue?.selectable
										) {
											return;
										}

										modifyControlValue({
											controlId,
											value: [
												...repeaterItems.map(
													(item) => ({
														...item,
														isSelected: false,
													})
												),
												value
													? value
													: {
															...defaultRepeaterItemValue,
															isSelected: true,
													  },
											],
										});
									};

									if (
										maxItems === -1 ||
										repeaterItems?.length < maxItems
									) {
										if (
											'function' ===
											typeof getDynamicDefaultRepeaterItem
										) {
											const value =
												getDynamicDefaultRepeaterItem(
													repeaterItems?.length,
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

										if (
											defaultRepeaterItemValue?.selectable
										) {
											return callback();
										}

										addRepeaterItem({
											controlId,
											repeaterId,
											value: defaultRepeaterItemValue,
										});
									}
								}}
							>
								<PlusIcon />
							</Button>
						)}

						{injectHeaderButtonsEnd}
					</div>
				</div>
				<MappedItems />
			</div>
		</RepeaterContextProvider>
	);
}
