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
	BaseControl,
	FilterControl,
	ControlContextProvider,
	FilterLabelDescription,
} from '@publisher/controls';

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
				attribute: 'publisherBackdropFilter',
				blockName: block.blockName,
			}}
			storeName={'publisher-core/controls/repeater'}
		>
			<BaseControl columns="columns-1" controlName="filter">
				<FilterControl
					label={__('Backdrop Filters', 'publisher-core')}
					popoverTitle={__('Backdrop Filter', 'publisher-core')}
					labelPopoverTitle={__('Backdrop Filter', 'publisher-core')}
					labelDescription={
						<FilterLabelDescription
							labelDescription={
								<>
									<p>
										{__(
											'The Backdrop filter applies a filter effect to the area behind an element.',
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											'Unlike the "Filter", which affects the block itself, "Backdrop Filter" impacts the space beneath the block.',
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											'It is essential for creating frosted glass effects, blurring background content behind modal windows, tooltips, or navigation bars.',
											'publisher-core'
										)}
									</p>
								</>
							}
						/>
					}
					onChange={(newValue, ref) =>
						handleOnChangeAttributes(
							'publisherBackdropFilter',
							newValue,
							{ ref }
						)
					}
					addNewButtonLabel={__(
						'Add New Backdrop Filter',
						'publisher-core'
					)}
					defaultValue={defaultValue}
					{...props}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
