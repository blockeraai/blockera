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

export const BackdropFilter = ({
	backdropFilter,
	block,
	props,
	handleOnChangeAttributes,
}: {
	backdropFilter: Array<Object> | void,
	props: Object,
	block: TBlockProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'backdrop-filters'),
				value: backdropFilter,
			}}
			storeName={'publisher-core/controls/repeater'}
		>
			<BaseControl columns="columns-1" controlName="filter">
				<FilterControl
					label={__('Backdrop Filters', 'publisher-core')}
					popoverTitle={__('Backdrop Filter', 'publisher-core')}
					onChange={(newValue) =>
						handleOnChangeAttributes(
							'publisherBackdropFilter',
							newValue
						)
					}
					addNewButtonLabel={__(
						'Add New Backdrop Filter',
						'publisher-core'
					)}
					{...props}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
