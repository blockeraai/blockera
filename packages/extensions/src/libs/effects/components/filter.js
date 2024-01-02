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
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { generateExtensionId } from '../../utils';

export const Filter = ({
	filter,
	handleOnChangeAttributes,
	block,
	...props
}: {
	filter: Array<Object> | void,
	block: TBlockProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'filters'),
				value: filter,
				attribute: 'publisherFilter',
				blockName: block.blockName,
			}}
			storeName={'publisher-core/controls/repeater'}
		>
			<BaseControl controlName="filter" columns="columns-1">
				<FilterControl
					label={__('Filters', 'publisher-core')}
					onChange={(newValue) =>
						handleOnChangeAttributes('publisherFilter', newValue)
					}
					addNewButtonLabel={__(
						'Add New Filter Effect',
						'publisher-core'
					)}
					{...props}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
