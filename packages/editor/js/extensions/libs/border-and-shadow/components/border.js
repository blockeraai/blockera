// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { BoxBorderControl, ControlContextProvider } from '@blockera/controls';
import type { TValueTypes } from '@blockera/controls/js/libs/box-border-control/types';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { THandleOnChangeAttributes } from '../../types';

export const Border = ({
	block,
	border,
	onChange,
	defaultValue,
	...props
}: {
	block: Object,
	border?: Object,
	onChange: THandleOnChangeAttributes,
	defaultValue: TValueTypes,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'border'),
				value: border,
				attribute: 'blockeraBorder',
				blockName: block.blockName,
			}}
		>
			<BoxBorderControl
				columns="columns-1"
				label={__('Border Line', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'Define clear boundaries for blocks with customizable lines, enhancing structure and design.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'Solid borders offer a classic, defined look, while dotted or dashed styles can create a more playful visual effect.',
								'blockera'
							)}
						</p>
					</>
				}
				onChange={(newValue: Object, ref?: Object): void => {
					onChange('blockeraBorder', newValue, { ref });
				}}
				defaultValue={defaultValue}
				{...props}
			/>
		</ControlContextProvider>
	);
};
