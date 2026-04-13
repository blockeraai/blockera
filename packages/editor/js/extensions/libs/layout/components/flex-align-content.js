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

function getBlockeraFlexAlignContentSelectOptions(iconSize: number = 18): any {
	return [
		{
			label: __('Flex Start', 'blockera'),
			value: 'flex-start',
			icon: <Icon icon="align-content-flex-start" iconSize={iconSize} />,
		},
		{
			label: __('Center', 'blockera'),
			value: 'center',
			icon: <Icon icon="align-content-center" iconSize={iconSize} />,
		},
		{
			label: __('Flex End', 'blockera'),
			value: 'flex-end',
			icon: <Icon icon="align-content-flex-end" iconSize={iconSize} />,
		},
		{
			label: __('Space Around', 'blockera'),
			value: 'space-around',
			icon: (
				<Icon icon="align-content-space-around" iconSize={iconSize} />
			),
		},
		{
			label: __('Space Between', 'blockera'),
			value: 'space-between',
			icon: (
				<Icon icon="align-content-space-between" iconSize={iconSize} />
			),
		},
		{
			label: __('Stretch', 'blockera'),
			value: 'stretch',
			icon: <Icon icon="align-content-stretch" iconSize={iconSize} />,
		},
	];
}

export const FlexAlignContent = ({
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
				name: generateExtensionId(block, 'align-content'),
				value,
				attribute: 'blockeraAlignContent',
				blockName: block.blockName,
			}}
		>
			<ToggleSelectControl
				label={__('Align Content', 'blockera')}
				className="blockera-flex-align-content"
				labelDescription={
					<>
						<p>
							{__(
								'Align-Content controls the alignment and distribution of lines within a flex container when there is extra space along the cross-axis, offering various alignment options.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'This property is vital in multi-line flex containers, especially when the height of the container is greater than that of the flex items, ensuring a balanced, visually appealing layout.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon
								icon="align-content-flex-start"
								iconSize="18"
							/>
							{__('Flex Start', 'blockera')}
						</h3>
						<p>
							{__(
								'Packs lines toward the start of the container.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="align-content-center" iconSize="18" />
							{__('Center', 'blockera')}
						</h3>
						<p>
							{__(
								'Centers lines within the container.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="align-content-flex-end" iconSize="18" />
							{__('Flex End', 'blockera')}
						</h3>
						<p>
							{__(
								'Packs lines toward the end of the container.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon
								icon="align-content-space-around"
								iconSize="18"
							/>
							{__('Space Around', 'blockera')}
						</h3>
						<p>
							{__(
								'Distributes lines evenly, with equal space around each line.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon
								icon="align-content-space-between"
								iconSize="18"
							/>
							{__('Space Between', 'blockera')}
						</h3>
						<p>
							{__(
								'Distributes lines evenly, with the first line at the start and the last at the end.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="align-content-stretch" iconSize="18" />
							{__('Stretch', 'blockera')}
						</h3>
						<p>
							{__(
								'Stretches lines to fill the container (default behavior).',
								'blockera'
							)}
						</p>
					</>
				}
				columns="1fr 2.5fr"
				options={getBlockeraFlexAlignContentSelectOptions()}
				isDeselectable={true}
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('blockeraAlignContent', newValue, { ref })
				}
				{...props}
				labelProps={{
					...labelPropsFromExtension,
					changesetGraphPreviewRender: (resolved: mixed) =>
						renderSelectOptionChangesetPreview({
							value: resolved,
							getOptions: (iconSize) =>
								getBlockeraFlexAlignContentSelectOptions(
									iconSize
								),
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
