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
import { generateExtensionId } from '../../utils';
import TextDecorationUnderlineIcon from '../icons/text-decoration-underline';
import TextDecorationLineThroughIcon from '../icons/text-dectoration-line-through';
import TextDecorationOverlineIcon from '../icons/text-decoration-overline';
import NoneIcon from '../icons/none';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export const TextDecoration = ({
	block,
	value,
	defaultValue,
	onChange,
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
				name: generateExtensionId(block, 'text-decoration'),
				value,
				attribute: 'blockeraTextDecoration',
				blockName: block.blockName,
			}}
		>
			<ToggleSelectControl
				columns="columns-1"
				className="control-first label-center small-gap"
				label={__('Decoration', 'blockera-core')}
				labelPopoverTitle={__('Text Decoration', 'blockera-core')}
				labelDescription={
					<>
						<p>
							{__(
								'It applies various decorative changes to text for enhancing the visual emphasis and style of text content.',
								'blockera-core'
							)}
						</p>
						<h3>
							<TextDecorationUnderlineIcon />
							{__('Underline', 'blockera-core')}
						</h3>
						<p>
							{__(
								'Adds a line below the text, commonly used for hyperlinks.',
								'blockera-core'
							)}
						</p>
						<h3>
							<TextDecorationLineThroughIcon />
							{__('Line Through', 'blockera-core')}
						</h3>
						<p>
							{__(
								'Strikes through the text, useful for showing deletion or changes.',
								'blockera-core'
							)}
						</p>
						<h3>
							<TextDecorationOverlineIcon />
							{__('Overline', 'blockera-core')}
						</h3>
						<p>
							{__(
								'Places a line above the text.',
								'blockera-core'
							)}
						</p>
						<h3>
							<NoneIcon />
							{__('None', 'blockera-core')}
						</h3>
						<p>
							{__(
								'Removes any decorations, often used to remove underlines from links. Its useful to remove underlines from links.',
								'blockera-core'
							)}
						</p>
					</>
				}
				options={[
					{
						label: __('Underline', 'blockera-core'),
						value: 'underline',
						icon: <TextDecorationUnderlineIcon />,
					},
					{
						label: __('Line Through', 'blockera-core'),
						value: 'line-through',
						icon: <TextDecorationLineThroughIcon />,
					},
					{
						label: __('Overline', 'blockera-core'),
						value: 'overline',
						icon: <TextDecorationOverlineIcon />,
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
					onChange('blockeraTextDecoration', newValue, { ref })
				}
				{...props}
			/>
		</ControlContextProvider>
	);
};
