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
	ToggleSelectControl,
	ControlContextProvider,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
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
				attribute: 'blockeraFontStyle',
				blockName: block.blockName,
			}}
		>
			<ToggleSelectControl
				label={__('Font Style', 'blockera')}
				labelPopoverTitle={__('Font Style', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'It sets the style of font for adding an artistic or emphatic touch to text content in web design.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="font-style-normal" iconSize="22" />
							{__('Normal', 'blockera')}
						</h3>
						<p>
							{__(
								'Displays the text in a standard, upright font style.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="font-style-italic" iconSize="22" />
							{__('Italic', 'blockera')}
						</h3>
						<p>
							{__(
								'Displays the text in italic, with a slight right tilt, commonly used for emphasis.',
								'blockera'
							)}
						</p>
					</>
				}
				columns="columns-1"
				className="control-first label-center small-gap"
				options={[
					{
						label: __('Normal style', 'blockera'),
						value: 'normal',
						icon: <Icon icon="font-style-normal" iconSize="18" />,
					},
					{
						label: __('Italic style', 'blockera'),
						value: 'italic',
						icon: <Icon icon="font-style-italic" iconSize="18" />,
					},
				]}
				isDeselectable={true}
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('blockeraFontStyle', newValue, { ref })
				}
				{...props}
			/>
		</ControlContextProvider>
	);
};
