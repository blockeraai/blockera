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
	getRepeaterActiveItemsCount,
} from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import ItemBody from './item-body';
import ItemHeader from './item-header';
import ItemOpener from './item-opener';
import { isMasterBlockStates } from '../helpers';
import type { CombineRepeaterProps } from '../types';
import { LabelDescription } from './label-description';
import { PopoverTitleButtons } from './popover-title-buttons';

export default function CombineRepeater(
	props: CombineRepeaterProps
): MixedElement {
	const {
		id,
		states,
		onDelete,
		children,
		currentBlock,
		overrideItem,
		defaultStates,
		handleOnChange,
		preparedStates,
		defaultRepeaterItemValue,
		getDynamicDefaultRepeaterItem,
	} = props;

	return (
		<RepeaterControl
			{...{
				onDelete,
				id: 'block-states',
				maxItems: Object.keys(preparedStates).length,
				valueCleanup: (value) => value,
				selectable: true,
				getDynamicDefaultRepeaterItem,
				defaultRepeaterItemValue,
				onChange: handleOnChange,
				overrideItem,
				repeaterItemHeader: ItemHeader,
				repeaterItemOpener: ItemOpener,
				repeaterItemChildren: (props: Object): MixedElement => {
					return (
						<ItemBody {...{ ...props, states: defaultStates }} />
					);
				},
			}}
			defaultValue={states}
			addNewButtonLabel={__('Add New State', 'blockera')}
			label={
				'undefined' !== typeof currentBlock && !isMasterBlockStates(id)
					? __('Inner Block States', 'blockera')
					: __('Block States', 'blockera')
			}
			labelDescription={<LabelDescription />}
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
	);
}
