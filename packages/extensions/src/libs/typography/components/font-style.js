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
	ToggleSelectControl,
	ControlContextProvider,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import FontStyleNormalIcon from '../icons/font-style-normal';
import FontStyleItalicIcon from '../icons/font-style-italic';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export const FontStyle = ({
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
				name: generateExtensionId(block, 'font-style'),
				value,
				attribute: 'publisherFontStyle',
				blockName: block.blockName,
			}}
		>
			<ToggleSelectControl
				label={__('Style', 'publisher-core')}
				labelPopoverTitle={__('Font Style', 'publisher-core')}
				labelDescription={
					<>
						<p>
							{__(
								'It sets the style of font for adding an artistic or emphatic touch to text content in web design.',
								'publisher-core'
							)}
						</p>
						<h3>
							<FontStyleNormalIcon />
							{__('Normal', 'publisher-core')}
						</h3>
						<p>
							{__(
								'Displays the text in a standard, upright font style.',
								'publisher-core'
							)}
						</p>
						<h3>
							<FontStyleItalicIcon />
							{__('Italic', 'publisher-core')}
						</h3>
						<p>
							{__(
								'Displays the text in italic, with a slight right tilt, commonly used for emphasis.',
								'publisher-core'
							)}
						</p>
					</>
				}
				columns="columns-1"
				className="control-first label-center small-gap"
				options={[
					{
						label: __('Normal', 'publisher-core'),
						value: 'normal',
						icon: <FontStyleNormalIcon />,
					},
					{
						label: __('Italic', 'publisher-core'),
						value: 'italic',
						icon: <FontStyleItalicIcon />,
					},
				]}
				isDeselectable={true}
				//
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('publisherFontStyle', newValue, { ref })
				}
				{...props}
			/>
		</ControlContextProvider>
	);
};
