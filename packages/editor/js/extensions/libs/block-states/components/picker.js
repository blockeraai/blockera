// @flow

/**
 * External dependencies
 */
import { dispatch, useSelect } from '@wordpress/data';
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
import type { PickerProps } from '../types';
import { PopoverTitleButtons } from './popover-title-buttons';
import { isInnerBlock } from '../../../components';
import {
	useAvailableItems,
	useMemoizedInnerBlocks,
} from '../../inner-blocks/hooks';
import { Inserter } from './inserter';
import { AvailableItems } from './available-items';

export default function Picker(props: PickerProps): MixedElement {
	const {
		states,
		onDelete,
		children,
		currentBlock,
		overrideItem,
		contextValue,
		defaultStates,
		handleOnChange,
		preparedStates,
		defaultRepeaterItemValue,
		getDynamicDefaultRepeaterItem,

		// inner blocks props.
		block,
		values,
		// onChange,
		innerBlocks,
	} = props;

	// Internal selectors. to access current selected block and inner blocks stack of Blockera editor/extensions store api.
	const { getBlockInners } = useSelect((select) => {
		const { getBlockInners } = select('blockera/extensions');

		return {
			getBlockInners,
		};
	});

	// Internal dispatchers. to use of "setCurrentBlock" and "setBlockClientInners" dispatchers of Blockera editor/extensions store api.
	const {
		changeExtensionCurrentBlock: setCurrentBlock,
		setBlockClientInners,
	} = dispatch('blockera/extensions') || {};

	// Calculation: to prepare standard values for "blockeraInnerBlocks" block attribute with set initial value for repeater by "setBlockClientInners" dispatcher.
	const memoizedInnerBlocks = useMemoizedInnerBlocks({
		getBlockInners,
		setBlockClientInners,
		controlValue: values || {},
		clientId: block?.clientId || '',
		reservedInnerBlocks: innerBlocks || {},
	});

	// Calculation: to categorized in two category (elements and blocks) from available inner blocks on current WordPress selected block.
	const { elements, blocks } = useAvailableItems({
		getBlockInners,
		memoizedInnerBlocks,
		setBlockClientInners,
		clientId: block?.clientId || '',
		reservedInnerBlocks: innerBlocks || {},
	});

	// Merging all categories, as available blocks.
	const availableBlocks = [...elements, ...blocks];

	// Get repeater value from internal Blockera store api.
	const value = getBlockInners(block?.clientId || '');

	// cache length to not calculate it multiple times
	const innerBlocksLength = Object.keys(innerBlocks || {}).length;

	if (
		!innerBlocksLength ||
		(!availableBlocks.length && !Object.keys(value).length) ||
		isInnerBlock(currentBlock)
	) {
		return <></>;
	}

	// Calculation: repeater maxItems property.
	const maxItems = innerBlocksLength + Object.keys(preparedStates).length;

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
					InserterComponent: (props: Object) => (
						<Inserter
							{...{
								...props,
								maxItems,
								Items: () => (
									<AvailableItems
										blocks={blocks}
										elements={elements}
										states={preparedStates}
										setBlockState={handleOnChange}
										setCurrentBlock={setCurrentBlock}
										setBlockClientInners={
											setBlockClientInners
										}
										clientId={block?.clientId || ''}
										getBlockInners={getBlockInners}
									/>
								),
							}}
						/>
					),
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
