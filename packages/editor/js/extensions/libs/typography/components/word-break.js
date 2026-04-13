// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { ControlContextProvider, SelectControl } from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { renderSelectOptionChangesetPreview } from '../../../../components';
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

function getBlockeraWordBreakSelectOptions(iconSize: number = 18): any {
	return [
		{
			label: __('Normal', 'blockera'),
			value: 'normal',
			icon: <Icon icon="break-normal" iconSize={iconSize} />,
		},
		{
			label: __('Break All Words', 'blockera'),
			value: 'break-all',
			icon: <Icon icon="break-all" iconSize={iconSize} />,
		},
		{
			label: __('Keep All Words', 'blockera'),
			value: 'keep-all',
			icon: <Icon icon="break-normal" iconSize={iconSize} />,
		},
		{
			label: __('Break Word', 'blockera'),
			value: 'break-word',
			icon: <Icon icon="break-all" iconSize={iconSize} />,
		},
		{
			label: __('Inherit', 'blockera'),
			value: 'inherit',
			icon: <Icon icon="inherit-circle" iconSize={iconSize} />,
		},
	];
}

export const WordBreak = ({
	block,
	value,
	onChange,
	defaultValue,
	labelProps: labelPropsFromExtension,
	...props
}: {
	block: TBlockProps,
	value: string | void,
	defaultValue?: string,
	onChange: THandleOnChangeAttributes,
	labelProps?: Object,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'word-break'),
				value,
				attribute: 'blockeraWordBreak',
				blockName: block.blockName,
			}}
		>
			<SelectControl
				label={__('Breaking', 'blockera')}
				labelPopoverTitle={__('Word Breaking', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'Word-Break controls how words are broken at the end of a line for influencing text wrapping and layout within containers.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'It is essential for managing text flow, especially in narrow containers or with long words/URLs, ensuring readability and a clean layout in multilingual contexts.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="break-normal" iconSize="18" />
							{__('Normal', 'blockera')}
						</h3>
						<p>
							{__(
								'Follows default line-breaking rules.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="break-all" iconSize="18" />
							{__('Break All Words', 'blockera')}
						</h3>
						<p>
							{__(
								'Allows words to be broken at any character, useful in narrow containers.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="break-normal" iconSize="18" />
							{__('Keep All Words', 'blockera')}
						</h3>
						<p>
							{__(
								'Avoids breaking words, particularly for East Asian scripts.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="break-all" iconSize="18" />
							{__('Break Word', 'blockera')}
						</h3>
						<p>
							{__(
								'Breaks words at appropriate break points, maintaining layout integrity by preventing overflow.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="inherit-circle" iconSize="18" />
							{__('Inherit', 'blockera')}
						</h3>
						<p>
							{__(
								'Follows containers line-breaking rules.',
								'blockera'
							)}
						</p>
					</>
				}
				columns="1fr 2.5fr"
				options={getBlockeraWordBreakSelectOptions()}
				type="custom"
				customMenuPosition="top"
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('blockeraWordBreak', newValue, { ref })
				}
				{...props}
				labelProps={{
					...labelPropsFromExtension,
					changesetGraphPreviewRender: (resolved: mixed) =>
						renderSelectOptionChangesetPreview({
							value: resolved,
							getOptions: (iconSize) =>
								getBlockeraWordBreakSelectOptions(iconSize),
							showIcon: true,
							showLabel: true,
							iconSize: 16,
							gap: '4px',
							emptyValueMeansNoPreview: false,
							showUnmatchedValue: true,
						}),
				}}
			/>
		</ControlContextProvider>
	);
};
