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
				attribute: 'publisherDivider',
				blockName: block.blockName,
			}}
			storeName={'publisher-core/controls/repeater'}
		>
			<BaseControl columns="columns-1" controlName="divider">
				<DividerControl
					onChange={(newValue, ref) =>
						handleOnChangeAttributes('publisherDivider', newValue, {
							ref,
						})
					}
					value={divider}
					maxItems={2}
					addNewButtonLabel={__('Add New Divider', 'publisher-core')}
					defaultValue={defaultValue}
					{...props}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
