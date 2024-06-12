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
	PromotionPopover,
	BaseControl,
	FilterControl,
	ControlContextProvider,
	FilterLabelDescription,
	getRepeaterActiveItemsCount,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { generateExtensionId } from '../../utils';

export const BackdropFilter = ({
	backdropFilter,
	block,
	handleOnChangeAttributes,
	defaultValue,
	...props
}: {
	backdropFilter: Array<Object> | void,
	block: TBlockProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	defaultValue: Array<Object>,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'backdrop-filters'),
				value: backdropFilter,
				attribute: 'blockeraBackdropFilter',
				blockName: block.blockName,
			}}
			storeName={'blockera-core/controls/repeater'}
		>
			<BaseControl columns="columns-1" controlName="filter">
				<FilterControl
					id="backdrop-filter"
					label={__('Backdrop Filters', 'blockera')}
					popoverTitle={__('Backdrop Filter', 'blockera')}
					labelPopoverTitle={__('Backdrop Filter', 'blockera')}
					labelDescription={
						<FilterLabelDescription
							labelDescription={
								<>
									<p>
										{__(
											'The Backdrop filter applies a filter effect to the area behind an element.',
											'blockera'
										)}
									</p>
									<p>
										{__(
											'Unlike the "Filter", which affects the block itself, "Backdrop Filter" impacts the space beneath the block.',
											'blockera'
										)}
									</p>
									<p>
										{__(
											'It is essential for creating frosted glass effects, blurring background content behind modal windows, tooltips, or navigation bars.',
											'blockera'
										)}
									</p>
								</>
							}
						/>
					}
					onChange={(newValue, ref) =>
						handleOnChangeAttributes(
							'blockeraBackdropFilter',
							newValue,
							{ ref }
						)
					}
					addNewButtonLabel={__(
						'Add New Backdrop Filter',
						'blockera'
					)}
					defaultValue={defaultValue}
					PromoComponent={({
						items,
						onClose = () => {},
						isOpen = false,
					}): MixedElement | null => {
						if (getRepeaterActiveItemsCount(items) < 1) {
							return null;
						}

						return (
							<PromotionPopover
								heading={__(
									'Multiple Backdrop Filters',
									'blockera'
								)}
								featuresList={[
									__('Multiple backdrop filters', 'blockera'),
									__(
										'Advanced backdrop filter effects',
										'blockera'
									),
									__('Advanced features', 'blockera'),
									__('Premium blocks', 'blockera'),
								]}
								isOpen={isOpen}
								onClose={onClose}
							/>
						);
					}}
					{...props}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
