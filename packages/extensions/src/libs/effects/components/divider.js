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
	DividerControl,
	ControlContextProvider,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { generateExtensionId } from '../../utils';

export const Divider = ({
	divider,
	block,
	props,
	handleOnChangeAttributes,
}: {
	divider: Array<Object> | void,
	props: Object,
	block: TBlockProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'divider'),
				value: divider,
				attribute: 'publisherDivider',
				blockName: block.blockName,
			}}
			storeName={'publisher-core/controls/repeater'}
		>
			<BaseControl columns="columns-1" controlName="divider">
				<DividerControl
					onChange={(newValue) =>
						handleOnChangeAttributes('publisherDivider', newValue)
					}
					value={divider}
					maxItems={2}
					addNewButtonLabel={__('Add New Divider', 'publisher-core')}
					{...props}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
