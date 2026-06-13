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
	Flex,
	BaseControl,
	FilterControl,
	UpgradePrompt,
	ControlContextProvider,
	FilterLabelDescription,
	getRepeaterActiveItemsCount,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { generateExtensionId } from '../../utils';

export const BACKDROP_FILTER_PRESET_ATTRIBUTE = 'blockeraBackdropFilter';
export const BACKDROP_FILTER_PRESET_PREVIEW_USAGE = 'backdrop-filter';

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
				attribute: BACKDROP_FILTER_PRESET_ATTRIBUTE,
				blockName: block.blockName,
			}}
			storeName={'blockera/controls/repeater'}
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
							<UpgradePrompt
								lockedFeature={{
									icon: <Icon icon="layers" iconSize={26} />,
									title: __(
										'Multiple Backdrop Filters Layers',
										'blockera'
									),
									description: (
										<Flex direction="column" gap="6px">
											{__(
												'Stack unlimited backdrop filter layers',
												'blockera'
											)}
											<Flex direction="row" gap="6px">
												<span className="blockera-free-plan-hint">
													{__(
														'Free: 1 layer',
														'blockera'
													)}
												</span>
												<span className="blockera-pro-plan-hint">
													{__(
														'Pro: Unlimited layers',
														'blockera'
													)}
												</span>
											</Flex>
										</Flex>
									),
								}}
								isOpen={isOpen}
								onClose={onClose}
								type="modal"
							/>
						);
					}}
					{...props}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
