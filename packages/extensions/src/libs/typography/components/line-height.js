// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { ControlContextProvider, InputControl } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export const LineHeight = ({
	block,
	value,
	onChange,
	defaultValue,
	...props
}: {
	block: TBlockProps,
	value: string | void,
	defaultValue: string | void,
	onChange: THandleOnChangeAttributes,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'line-height'),
				value,
				attribute: 'blockeraLineHeight',
				blockName: block.blockName,
			}}
		>
			<InputControl
				label={__('Line Height', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'It sets the height of a line box, crucial for determining the vertical spacing within text content, enhancing readability and text flow.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'Line height can be specified without a unit, as a multiplier of the font size (1.5), or with length units like pixels (px), ems (em).',
								'blockera'
							)}
						</p>
					</>
				}
				columns="columns-2"
				unitType="line-height"
				min={0}
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('blockeraLineHeight', newValue, { ref })
				}
				{...props}
			/>
		</ControlContextProvider>
	);
};
