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
	ControlContextProvider,
	ToggleSelectControl,
} from '@blockera/controls';

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
				name: generateExtensionId(block, 'text-transform'),
				value,
				attribute: 'blockeraTextTransform',
				blockName: block.blockName,
			}}
		>
			<ToggleSelectControl
				label={__('Capitalize', 'blockera-core')}
				labelDescription={
					<>
						<p>
							{__(
								'It sets the capitalization of text for adding stylistic and readability enhancements in text presentation.',
								'blockera-core'
							)}
						</p>
						<h3>
							<TextTransformCapitalizeIcon />
							{__('Capitalize', 'blockera-core')}
						</h3>
						<p>
							{__(
								'Capitalizes the first letter of each word.',
								'blockera-core'
							)}
						</p>
						<h3>
							<TextTransformLowercaseIcon />
							{__('Lowercase', 'blockera-core')}
						</h3>
						<p>
							{__(
								'Converts all characters to lowercase.',
								'blockera-core'
							)}
						</p>
						<h3>
							<TextTransformUppercaseIcon />
							{__('Uppercase', 'blockera-core')}
						</h3>
						<p>
							{__(
								'Converts all characters of the text to uppercase.',
								'blockera-core'
							)}
						</p>
						<h3>
							<NoneIcon />
							{__('None', 'blockera-core')}
						</h3>
						<p>
							{__(
								'Maintains the original text as it is, without transformation.',
								'blockera-core'
							)}
						</p>
					</>
				}
				columns="columns-1"
				className="control-first label-center small-gap"
				options={[
					{
						label: __('Capitalize', 'blockera-core'),
						value: 'capitalize',
						icon: <TextTransformCapitalizeIcon />,
					},
					{
						label: __('Lowercase', 'blockera-core'),
						value: 'lowercase',
						icon: <TextTransformLowercaseIcon />,
					},
					{
						label: __('Uppercase', 'blockera-core'),
						value: 'uppercase',
						icon: <TextTransformUppercaseIcon />,
					},
					{
						label: __('None', 'blockera-core'),
						value: 'initial',
						icon: <NoneIcon />,
					},
				]}
				isDeselectable={true}
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('blockeraTextTransform', newValue, {
						ref,
					})
				}
				{...props}
			/>
		</ControlContextProvider>
	);
};
