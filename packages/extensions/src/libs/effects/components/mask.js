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
	MaskControl,
	ControlContextProvider,
} from '@publisher/controls';

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
				attribute: 'publisherMask',
				blockName: block.blockName,
			}}
			storeName={'publisher-core/controls/repeater'}
		>
			<BaseControl controlName="Mask" columns="columns-1">
				<MaskControl
					onChange={(newValue, ref) =>
						handleOnChangeAttributes('publisherMask', newValue, {
							ref,
						})
					}
					addNewButtonLabel={__('Add New Mask', 'publisher-core')}
					defaultValue={defaultValue}
					{...props}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
