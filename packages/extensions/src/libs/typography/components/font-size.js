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

export const FontSize = ({
	block,
	value,
	onChange,
	defaultValue,
	...props
}: {
	block: TBlockProps,
	value: string | void,
	defaultValue?: string,
	onChange: THandleOnChangeAttributes,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'font-size'),
				value,
				attribute: 'publisherFontSize',
				blockName: block.blockName,
			}}
		>
			<InputControl
				label={__('Font Size', 'publisher-core')}
				labelDescription={
					<>
						<p>
							{__(
								'It sets the size of the font for text content, allowing customization of text appearance for readability and aesthetic appeal in various contexts.',
								'publisher-core'
							)}
						</p>
						<p>
							{__(
								'Relative units like "em" and "rem" are recommended for responsive designs as they adjust based on parent font size or root font size, respectively.',
								'publisher-core'
							)}
						</p>
					</>
				}
				columns="columns-2"
				unitType="essential"
				min={0}
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('publisherFontSize', newValue, { ref })
				}
				controlAddonTypes={['variable']}
				variableTypes={['font-size']}
				{...props}
			/>
		</ControlContextProvider>
	);
};
