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
import { generateExtensionId } from '../../utils';
import TextDecorationUnderlineIcon from '../icons/text-decoration-underline';
import TextDecorationLineThroughIcon from '../icons/text-dectoration-line-through';
import TextDecorationOverlineIcon from '../icons/text-decoration-overline';
import NoneIcon from '../icons/none';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { useBlockContext } from '../../../hooks';
import { toSimpleStyleTypographyWPCompatible } from '../../../utils';

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
	const { isNormalState, getAttributes } = useBlockContext();

	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'text-decoration'),
				value,
				attribute: 'publisherTextDecoration',
				blockName: block.blockName,
			}}
		>
			<ToggleSelectControl
				columns="columns-1"
				className="control-first label-center small-gap"
				label={__('Decoration', 'publisher-core')}
				labelPopoverTitle={__('Text Decoration', 'publisher-core')}
				labelDescription={
					<>
						<p>
							{__(
								'It applies various decorative changes to text for enhancing the visual emphasis and style of text content.',
								'publisher-core'
							)}
						</p>
						<h3>
							<TextDecorationUnderlineIcon />
							{__('Underline', 'publisher-core')}
						</h3>
						<p>
							{__(
								'Adds a line below the text, commonly used for hyperlinks.',
								'publisher-core'
							)}
						</p>
						<h3>
							<TextDecorationLineThroughIcon />
							{__('Line Through', 'publisher-core')}
						</h3>
						<p>
							{__(
								'Strikes through the text, useful for showing deletion or changes.',
								'publisher-core'
							)}
						</p>
						<h3>
							<TextDecorationOverlineIcon />
							{__('Overline', 'publisher-core')}
						</h3>
						<p>
							{__(
								'Places a line above the text.',
								'publisher-core'
							)}
						</p>
						<h3>
							<NoneIcon />
							{__('None', 'publisher-core')}
						</h3>
						<p>
							{__(
								'Removes any decorations, often used to remove underlines from links. Its useful to remove underlines from links.',
								'publisher-core'
							)}
						</p>
					</>
				}
				options={[
					{
						label: __('Underline', 'publisher-core'),
						value: 'underline',
						icon: <TextDecorationUnderlineIcon />,
					},
					{
						label: __('Line Through', 'publisher-core'),
						value: 'line-through',
						icon: <TextDecorationLineThroughIcon />,
					},
					{
						label: __('Overline', 'publisher-core'),
						value: 'overline',
						icon: <TextDecorationOverlineIcon />,
					},
					{
						label: __('None', 'publisher-core'),
						value: 'initial',
						icon: <NoneIcon />,
					},
				]}
				isDeselectable={true}
				//
				defaultValue={defaultValue}
				onChange={(newValue, ref) => {
					onChange('publisherTextDecoration', newValue, {
						ref,
						addOrModifyRootItems:
							toSimpleStyleTypographyWPCompatible({
								wpAttribute: 'lineHeight',
								newValue,
								isNormalState,
								ref,
								getAttributes,
							}),
					});
				}}
				{...props}
			/>
		</ControlContextProvider>
	);
};
