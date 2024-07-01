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
	DividerControl,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { generateExtensionId } from '../../utils';

export const Divider = ({
	divider,
	block,
	handleOnChangeAttributes,
	defaultValue,
	...props
}: {
	divider: Array<Object> | void,
	block: TBlockProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	defaultValue: Array<Object>,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'divider'),
				value: divider,
				attribute: 'blockeraDivider',
				blockName: block.blockName,
			}}
			storeName={'blockera/controls/repeater'}
		>
			<BaseControl columns="columns-1" controlName="divider">
				<DividerControl
					onChange={(newValue, ref) =>
						handleOnChangeAttributes('blockeraDivider', newValue, {
							ref,
						})
					}
					value={divider}
					maxItems={2}
					addNewButtonLabel={__('Add New Divider', 'blockera')}
					defaultValue={defaultValue}
					{...props}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
