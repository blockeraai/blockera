// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	RepeaterControl,
	PromotionPopover,
	ControlContextProvider,
	getRepeaterActiveItemsCount,
} from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import ItemBody from './item-body';
import ItemHeader from './item-header';
import ItemOpener from './item-opener';
import type { UIProps } from '../types';
import { PopoverTitleButtons } from './popover-title-buttons';

export default function UI({
	states,
	onDelete,
	children,
	overrideItem,
	contextValue,
	defaultStates,
	handleOnChange,
	preparedStates,
	InserterComponent,
	defaultRepeaterItemValue,
	getDynamicDefaultRepeaterItem,
}: UIProps): MixedElement {
	return (
		<ControlContextProvider
			value={contextValue}
			storeName={'blockera/controls/repeater'}
		>
			<RepeaterControl
				{...{
					onDelete,
					overrideItem,
					selectable: true,
					id: 'block-states',
					isSupportInserter: true,
					defaultRepeaterItemValue,
					onChange: handleOnChange,
					getDynamicDefaultRepeaterItem,
					valueCleanup: (value) => value,
					repeaterItemHeader: ItemHeader,
					repeaterItemOpener: ItemOpener,
					maxItems: Object.keys(preparedStates).length,
					repeaterItemChildren: (props: Object): MixedElement => {
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
				popoverOffset={164}
				className={controlInnerClassNames('block-states-repeater')}
				itemColumns={2}
				actionButtonClone={false}
				actionButtonVisibility={false}
				popoverTitleButtonsRight={PopoverTitleButtons}
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
							heading={__('Advanced Block States', 'blockera')}
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
		</ControlContextProvider>
	);
}
