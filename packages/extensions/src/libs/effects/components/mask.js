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
	MaskControl,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { generateExtensionId } from '../../utils';

export const Mask = ({
	mask,
	handleOnChangeAttributes,
	block,
	defaultValue,
	...props
}: {
	mask: Array<Object> | void,
	block: TBlockProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	defaultValue: Array<Object>,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'mask'),
				value: mask,
				attribute: 'blockeraMask',
				blockName: block.blockName,
			}}
			storeName={'blockera-core/controls/repeater'}
		>
			<BaseControl controlName="Mask" columns="columns-1">
				<MaskControl
					onChange={(newValue, ref) =>
						handleOnChangeAttributes('blockeraMask', newValue, {
							ref,
						})
					}
					addNewButtonLabel={__('Add New Mask', 'blockera-core')}
					defaultValue={defaultValue}
					{...props}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
