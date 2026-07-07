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
	BaseControl,
	FilterControl,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { generateExtensionId } from '../../utils';

export const FILTER_PRESET_ATTRIBUTE = 'blockeraFilter';
export const FILTER_PRESET_PREVIEW_USAGE = 'filter';

export const Filter = ({
	filter,
	handleOnChangeAttributes,
	block,
	defaultValue,
	...props
}: {
	filter: Array<Object> | void,
	block: TBlockProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	defaultValue: Array<Object>,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'filters'),
				value: filter,
				attribute: FILTER_PRESET_ATTRIBUTE,
				blockName: block.blockName,
			}}
			storeName={'blockera/controls/repeater'}
		>
			<BaseControl controlName="filter" columns="columns-1">
				<FilterControl
					label={__('Filters', 'blockera')}
					onChange={(newValue, ref) =>
						handleOnChangeAttributes('blockeraFilter', newValue, {
							ref,
						})
					}
					addNewButtonLabel={__('Add New Filter Effect', 'blockera')}
					defaultValue={defaultValue}
					{...props}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
