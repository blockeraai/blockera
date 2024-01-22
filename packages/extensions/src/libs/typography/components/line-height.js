// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { ControlContextProvider, InputControl } from '@publisher/controls';

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
				attribute: 'publisherLineHeight',
				blockName: block.blockName,
			}}
		>
			<InputControl
				label={__('Line Height', 'publisher-core')}
				labelDescription={
					<>
						<p>
							{__(
								'It sets the height of a line box, crucial for determining the vertical spacing within text content, enhancing readability and text flow.',
								'publisher-core'
							)}
						</p>
						<p>
							{__(
								'Line height can be specified without a unit, as a multiplier of the font size (1.5), or with length units like pixels (px), ems (em).',
								'publisher-core'
							)}
						</p>
					</>
				}
				columns="columns-2"
				unitType="line-height"
				range={true}
				min={0}
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('publisherLineHeight', newValue, { ref })
				}
				controlAddonTypes={['variable']}
				variableTypes={['font-size']}
				{...props}
			/>
		</ControlContextProvider>
	);
};
