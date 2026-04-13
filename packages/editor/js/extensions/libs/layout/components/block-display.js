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
	NoticeControl,
	ToggleSelectControl,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { renderSelectOptionChangesetPreview } from '../../../../components';
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import type { DisplayType } from '../types/layout-props';

function getBlockeraDisplaySelectOptions(iconSize: number = 18): any {
	return [
		{
			label: __('Flex', 'blockera'),
			value: 'flex',
			icon: <Icon icon="display-flex" iconSize={iconSize} />,
		},
		{
			label: __('Grid', 'blockera'),
			value: 'grid',
			icon: <Icon icon="display-grid" iconSize={iconSize} />,
		},
		{
			label: __('Block', 'blockera'),
			value: 'block',
			icon: <Icon icon="display-block" iconSize={iconSize} />,
		},
		{
			label: __('Inline Block', 'blockera'),
			value: 'inline-block',
			icon: <Icon icon="display-inline-block" iconSize={iconSize} />,
		},
		{
			label: __('Inline', 'blockera'),
			value: 'inline',
			icon: <Icon icon="display-inline" iconSize={iconSize} />,
		},
		{
			label: __('None', 'blockera'),
			value: 'none',
			icon: <Icon icon="display-none" iconSize={iconSize} />,
		},
	];
}

export const BlockDisplay = ({
	block,
	value,
	onChange,
	defaultValue,
	labelProps: labelPropsFromExtension,
	...props
}: {
	block: TBlockProps,
	value: DisplayType | string | void,
	defaultValue?: DisplayType | string,
	onChange: THandleOnChangeAttributes,
	labelProps?: Object,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'display'),
				value,
				attribute: 'blockeraDisplay',
				blockName: block.blockName,
			}}
		>
			<ToggleSelectControl
				label={__('Display', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'The Display is essential to defining how blocks are formatted and arranged on the page.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="display-flex" iconSize="18" />
							{__('Flex', 'blockera')}
						</h3>
						<p>
							{__(
								'Implements a flexible box layout, making it easier to design responsive layouts.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="display-grid" iconSize="18" />
							{__('Grid', 'blockera')}
						</h3>
						<p>
							{__(
								'Creates a grid-based layout, providing precise control over rows and columns.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="display-block" iconSize="18" />
							{__('Block', 'blockera')}
						</h3>
						<p>
							{__(
								'Block take up the full width available, starting on a new line.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="display-inline-block" iconSize="18" />
							{__('Inline Block', 'blockera')}
						</h3>
						<p>
							{__(
								'Behaves like "inline" but respects width and height values.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="display-inline" iconSize="18" />
							{__('Inline', 'blockera')}
						</h3>
						<p>
							{__(
								'Elements do not start on a new line and only occupy as much width as necessary.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="display-none" iconSize="18" />
							{__('None', 'blockera')}
						</h3>
						<p>
							{__(
								'Completely hides the block from the layout, but note that the block remains in the HTML document.',
								'blockera'
							)}
						</p>
					</>
				}
				columns="1fr 2.5fr"
				options={getBlockeraDisplaySelectOptions()}
				isDeselectable={true}
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('blockeraDisplay', newValue, { ref })
				}
				{...props}
				labelProps={{
					...labelPropsFromExtension,
					changesetGraphPreviewRender: (resolved: mixed) =>
						renderSelectOptionChangesetPreview({
							value: resolved,
							getOptions: (iconSize) =>
								getBlockeraDisplaySelectOptions(iconSize),
							showIcon: true,
							showLabel: true,
							iconSize: 16,
							gap: '4px',
							emptyValueMeansNoPreview: true,
							showUnmatchedValue: true,
						}),
				}}
			/>

			{value === 'none' && (
				<NoticeControl type="information" style={{ marginTop: '20px' }}>
					{__(
						'Your block is set to "display: none", which hides it from view on page. Double-check and ensure this is intentional.',
						'blockera'
					)}
				</NoticeControl>
			)}
		</ControlContextProvider>
	);
};
