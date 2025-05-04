// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { Element, ComponentType, MixedElement } from 'react';

/**
 * Blockera dependencies
 */
// import { omit, isEquals } from '@blockera/utils';
import { controlInnerClassNames } from '@blockera/classnames';
import {
	RepeaterControl,
	PromotionPopover,
	ControlContextProvider,
	getRepeaterActiveItemsCount,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import ItemBody from './item-body';
import ItemHeader from './item-header';
import ItemOpener from './item-opener';
import type { StatesManagerProps } from '../types';
import { PopoverTitleButtons } from './popover-title-buttons';

const StatesManager: ComponentType<StatesManagerProps> = memo(
	({
		states,
		children,
		onDelete,
		contextValue,
		overrideItem,
		defaultStates,
		preparedStates,
		handleOnChange,
		InserterComponent,
		defaultRepeaterItemValue,
		getDynamicDefaultRepeaterItem,
	}: StatesManagerProps): Element<any> => {
		return (
			<ControlContextProvider
				value={contextValue}
				storeName={'blockera/controls/repeater'}
			>
				<div
					className={'blockera-block-state-container'}
					data-test={'blockera-block-state-container'}
					aria-label={__(
						'Blockera Block State Container',
						'blockera'
					)}
				>
					<RepeaterControl
						{...{
							onDelete,
							id: 'block-states',
							isSupportInserter: true,
							maxItems: Object.keys(preparedStates).length,
							valueCleanup: (value) => value,
							selectable: true,
							getDynamicDefaultRepeaterItem,
							defaultRepeaterItemValue,
							onChange: handleOnChange,
							overrideItem,
							repeaterItemHeader: ItemHeader,
							repeaterItemOpener: ItemOpener,
							repeaterItemChildren: (
								props: Object
							): MixedElement => {
								return (
									<ItemBody
										{...{ ...props, states: defaultStates }}
									/>
								);
							},
							InserterComponent,
						}}
						defaultValue={states}
						popoverTitle={__('Block State', 'blockera')}
						offset={8}
						popoverProps={{
							placement: 'bottom-end',
						}}
						className={controlInnerClassNames(
							'block-states-repeater'
						)}
						actionButtonClone={false}
						actionButtonVisibility={false}
						popoverTitleButtonsRight={PopoverTitleButtons}
						addNewButtonDataTest={'add-new-block-state'}
						PromoComponent={({
							items,
							onClose = () => {},
							isOpen = false,
						}): MixedElement | null => {
							if (getRepeaterActiveItemsCount(items) < 2) {
								return null;
							}

							return (
								<PromotionPopover
									heading={__(
										'Advanced Block States',
										'blockera'
									)}
									featuresList={[
										__('Multiple states', 'blockera'),
										__('All block states', 'blockera'),
										__('Advanced features', 'blockera'),
										__('Premium blocks', 'blockera'),
									]}
									isOpen={isOpen}
									onClose={onClose}
								/>
							);
						}}
					>
						{children}
					</RepeaterControl>
				</div>
			</ControlContextProvider>
		);
	}
	// (prev, next) => {
	// 	return isEquals(omit(prev, ['onChange']), omit(next, ['onChange']));
	// }
);

export default StatesManager;
