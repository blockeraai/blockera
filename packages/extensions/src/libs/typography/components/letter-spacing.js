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

export const LetterSpacing = ({
	block,
	value,
	onChange,
	defaultValue = '',
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
				name: generateExtensionId(block, 'letter-spacing'),
				value,
				attribute: 'publisherLetterSpacing',
				blockName: block.blockName,
			}}
		>
			<InputControl
				controlName="input"
				columns="2fr 2.6fr"
				label={__('Letters', 'publisher-core')}
				labelPopoverTitle={__('Letters Spacing', 'publisher-core')}
				labelDescription={
					<>
						<p>
							{__(
								'It adjusts the space between characters in text, enhancing readability and visual appeal, especially useful in headings, logos, and graphic text.',
								'publisher-core'
							)}
						</p>
						<p>
							{__(
								'It is vital for typographic refinement, allowing control over text density and improving legibility, particularly in creative and web design contexts.',
								'publisher-core'
							)}
						</p>
					</>
				}
				defaultValue={defaultValue}
				arrows={true}
				unitType="letter-spacing"
				onChange={(newValue: Object, ref?: Object): void =>
					onChange('publisherLetterSpacing', newValue, { ref })
				}
				{...props}
			/>
		</ControlContextProvider>
	);
};
