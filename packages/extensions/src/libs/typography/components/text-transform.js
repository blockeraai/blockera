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
	ControlContextProvider,
	ToggleSelectControl,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import NoneIcon from '../icons/none';
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import TextTransformLowercaseIcon from '../icons/text-transform-lowercase';
import TextTransformUppercaseIcon from '../icons/text-transform-uppercase';
import TextTransformCapitalizeIcon from '../icons/text-transform-capitalize';

export const TextTransform = ({
	block,
	value,
	onChange,
	...props
}: {
	block: TBlockProps,
	value: string | void,
	onChange: THandleOnChangeAttributes,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'text-transform'),
				value,
				attribute: 'publisherTextTransform',
				blockName: block.blockName,
			}}
		>
			<ToggleSelectControl
				label={__('Capitalize', 'publisher-core')}
				labelDescription={
					<>
						<p>
							{__(
								'It sets the capitalization of text for adding stylistic and readability enhancements in text presentation.',
								'publisher-core'
							)}
						</p>
						<h3>
							<TextTransformCapitalizeIcon />
							{__('Capitalize', 'publisher-core')}
						</h3>
						<p>
							{__(
								'Capitalizes the first letter of each word.',
								'publisher-core'
							)}
						</p>
						<h3>
							<TextTransformLowercaseIcon />
							{__('Lowercase', 'publisher-core')}
						</h3>
						<p>
							{__(
								'Converts all characters to lowercase.',
								'publisher-core'
							)}
						</p>
						<h3>
							<TextTransformUppercaseIcon />
							{__('Uppercase', 'publisher-core')}
						</h3>
						<p>
							{__(
								'Converts all characters of the text to uppercase.',
								'publisher-core'
							)}
						</p>
						<h3>
							<NoneIcon />
							{__('None', 'publisher-core')}
						</h3>
						<p>
							{__(
								'Maintains the original text as it is, without transformation.',
								'publisher-core'
							)}
						</p>
					</>
				}
				columns="columns-1"
				className="control-first label-center small-gap"
				options={[
					{
						label: __('Capitalize', 'publisher-core'),
						value: 'capitalize',
						icon: <TextTransformCapitalizeIcon />,
					},
					{
						label: __('Lowercase', 'publisher-core'),
						value: 'lowercase',
						icon: <TextTransformLowercaseIcon />,
					},
					{
						label: __('Uppercase', 'publisher-core'),
						value: 'uppercase',
						icon: <TextTransformUppercaseIcon />,
					},
					{
						label: __('None', 'publisher-core'),
						value: 'initial',
						icon: <NoneIcon />,
					},
				]}
				isDeselectable={true}
				//
				defaultValue=""
				onChange={(newValue, ref) =>
					onChange('publisherTextTransform', newValue, {
						ref,
					})
				}
				{...props}
			/>
		</ControlContextProvider>
	);
};
