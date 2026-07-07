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
import { renderSelectOptionChangesetPreview } from '../../../../components';
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

function getBlockeraTextDecorationSelectOptions(iconSize: number = 18): any {
	return [
		{
			label: __('Underline', 'blockera'),
			value: 'underline',
			icon: <Icon icon="text-decoration-underline" iconSize={iconSize} />,
		},
		{
			label: __('Line Through', 'blockera'),
			value: 'line-through',
			icon: (
				<Icon icon="text-decoration-line-through" iconSize={iconSize} />
			),
		},
		{
			label: __('Overline', 'blockera'),
			value: 'overline',
			icon: <Icon icon="text-decoration-overline" iconSize={iconSize} />,
		},
		{
			label: __('None', 'blockera'),
			value: 'initial',
			icon: <Icon library="wp" icon="close-small" iconSize={iconSize} />,
		},
	];
}

export const TextDecoration = ({
	block,
	value,
	defaultValue,
	onChange,
	labelProps: labelPropsFromExtension,
	...props
}: {
	block: TBlockProps,
	value: string | void,
	defaultValue: string | void,
	onChange: THandleOnChangeAttributes,
	labelProps?: Object,
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
				columns="1fr 2.5fr"
				label={__('Decoration', 'blockera')}
				labelPopoverTitle={__('Text Decoration', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'It applies various decorative changes to text for enhancing the visual emphasis and style of text content.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon
								icon="text-decoration-underline"
								iconSize="18"
							/>
							{__('Underline', 'blockera')}
						</h3>
						<p>
							{__(
								'Adds a line below the text, commonly used for hyperlinks.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon
								icon="text-decoration-line-through"
								iconSize="18"
							/>
							{__('Line Through', 'blockera')}
						</h3>
						<p>
							{__(
								'Strikes through the text, useful for showing deletion or changes.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon
								icon="text-decoration-overline"
								iconSize="18"
							/>
							{__('Overline', 'blockera')}
						</h3>
						<p>{__('Places a line above the text.', 'blockera')}</p>
						<h3>
							<Icon
								library="wp"
								icon="close-small"
								iconSize="18"
							/>
							{__('None', 'blockera')}
						</h3>
						<p>
							{__(
								'Removes any decorations, often used to remove underlines from links. Its useful to remove underlines from links.',
								'blockera'
							)}
						</p>
					</>
				}
				options={getBlockeraTextDecorationSelectOptions()}
				isDeselectable={true}
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('blockeraTextDecoration', newValue, { ref })
				}
				{...props}
				labelProps={{
					...labelPropsFromExtension,
					changesetGraphPreviewRender: (resolved: mixed) =>
						renderSelectOptionChangesetPreview({
							value: resolved,
							getOptions: (iconSize) =>
								getBlockeraTextDecorationSelectOptions(
									iconSize
								),
							showIcon: true,
							showLabel: false,
							iconSize: 16,
							emptyValueMeansNoPreview: true,
						}),
				}}
			/>
		</ControlContextProvider>
	);
};
