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

function getBlockeraOverflowSelectOptions(iconSize: number = 18): any {
	return [
		{
			label: __('Visible Overflow', 'blockera'),
			value: 'visible',
			icon: <Icon icon="overflow-visible" iconSize={iconSize} />,
		},
		{
			label: __('Hidden Overflow', 'blockera'),
			value: 'hidden',
			icon: <Icon icon="overflow-hidden" iconSize={iconSize} />,
		},
		{
			label: __('Scroll Overflow', 'blockera'),
			value: 'scroll',
			icon: <Icon icon="overflow-scroll" iconSize={iconSize} />,
		},
	];
}

export const Overflow = ({
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
				name: generateExtensionId(block, 'overflow'),
				value,
				attribute: 'blockeraOverflow',
				blockName: block.blockName,
			}}
		>
			<ToggleSelectControl
				label={__('Overflow', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								"Overflow manages how content is displayed when it exceeds its block's boundaries, offering options like scroll or hidden to maintain layout integrity.",
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="overflow-visible" iconSize="18" />
							{__('Visible', 'blockera')}
						</h3>
						<p>
							{__(
								'Visible ensures that any content exceeding the boundaries of its container is still visible, extending beyond the set dimensions.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="overflow-hidden" iconSize="18" />
							{__('Hidden', 'blockera')}
						</h3>
						<p>
							{__(
								'Hidden effectively clips any content that exceeds the boundaries of its container, ensuring a clean, uncluttered appearance for your layout.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="overflow-scroll" iconSize="18" />
							{__('Scroll', 'blockera')}
						</h3>
						<p>
							{__(
								'Scroll ensures that any excess content within the block is accessible via scrollbars, ideal for maintaining a fixed size for content areas.',
								'blockera'
							)}
						</p>
					</>
				}
				columns="1fr 2.5fr"
				isDeselectable={true}
				options={getBlockeraOverflowSelectOptions()}
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('blockeraOverflow', newValue, { ref })
				}
				{...props}
				labelProps={{
					...labelPropsFromExtension,
					changesetGraphPreviewRender: (resolved: mixed) =>
						renderSelectOptionChangesetPreview({
							value: resolved,
							getOptions: (iconSize) =>
								getBlockeraOverflowSelectOptions(iconSize),
							showIcon: true,
							showLabel: true,
							iconSize: 16,
							gap: '4px',
							emptyValueMeansNoPreview: true,
							showUnmatchedValue: true,
						}),
				}}
			/>
		</ControlContextProvider>
	);
};
