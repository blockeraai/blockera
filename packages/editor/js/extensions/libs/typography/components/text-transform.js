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
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

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
				label={__('Capitalize', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'It sets the capitalization of text for adding stylistic and readability enhancements in text presentation.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon
								icon="text-transform-capitalize"
								iconSize="22"
							/>
							{__('Capitalize', 'blockera')}
						</h3>
						<p>
							{__(
								'Capitalizes the first letter of each word.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon
								icon="text-transform-lowercase"
								iconSize="22"
							/>
							{__('Lowercase', 'blockera')}
						</h3>
						<p>
							{__(
								'Converts all characters to lowercase.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon
								icon="text-transform-uppercase"
								iconSize="22"
							/>
							{__('Uppercase', 'blockera')}
						</h3>
						<p>
							{__(
								'Converts all characters of the text to uppercase.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon
								library="wp"
								icon="close-small"
								iconSize="22"
							/>
							{__('None', 'blockera')}
						</h3>
						<p>
							{__(
								'Maintains the original text as it is, without transformation.',
								'blockera'
							)}
						</p>
					</>
				}
				columns="columns-1"
				className="control-first label-center small-gap"
				options={[
					{
						label: __('Capitalize', 'blockera'),
						value: 'capitalize',
						icon: (
							<Icon
								icon="text-transform-capitalize"
								iconSize="18"
							/>
						),
					},
					{
						label: __('Lowercase', 'blockera'),
						value: 'lowercase',
						icon: (
							<Icon
								icon="text-transform-lowercase"
								iconSize="18"
							/>
						),
					},
					{
						label: __('Uppercase', 'blockera'),
						value: 'uppercase',
						icon: (
							<Icon
								icon="text-transform-uppercase"
								iconSize="18"
							/>
						),
					},
					{
						label: __('None', 'blockera'),
						value: 'initial',
						icon: (
							<Icon
								library="wp"
								icon="close-small"
								iconSize="18"
							/>
						),
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
