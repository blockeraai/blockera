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
import { getFlexChildAlignIconStyle } from './icon-styles';

function getFlexChildAlignSelectOptions(
	flexDirection: string | void,
	iconSize: number
): any {
	const iconStyle = getFlexChildAlignIconStyle(flexDirection);
	return [
		{
			label: __('Flex Start', 'blockera'),
			value: 'flex-start',
			icon: (
				<Icon
					icon="flex-align-start"
					iconSize={iconSize}
					style={iconStyle}
				/>
			),
		},
		{
			label: __('Center', 'blockera'),
			value: 'center',
			icon: (
				<Icon
					icon="flex-align-center"
					iconSize={iconSize}
					style={iconStyle}
				/>
			),
		},
		{
			label: __('Flex End', 'blockera'),
			value: 'flex-end',
			icon: (
				<Icon
					icon="flex-align-end"
					iconSize={iconSize}
					style={iconStyle}
				/>
			),
		},
		{
			label: __('Stretch', 'blockera'),
			value: 'stretch',
			icon: (
				<Icon
					icon="flex-align-stretch"
					iconSize={iconSize}
					style={iconStyle}
				/>
			),
		},
		{
			label: __('Baseline', 'blockera'),
			value: 'baseline',
			icon: (
				<Icon
					icon="flex-align-baseline"
					iconSize={iconSize}
					style={iconStyle}
				/>
			),
		},
	];
}

export const FlexChildSelfAlign = ({
	block,
	flexDirection,
	value,
	onChange,
	defaultValue,
	labelProps: labelPropsFromExtension,
	...props
}: {
	block: TBlockProps,
	flexDirection: string | void,
	value: string | void,
	onChange: THandleOnChangeAttributes,
	defaultValue?: string,
	labelProps?: Object,
}): MixedElement => {
	const iconStyle = getFlexChildAlignIconStyle(flexDirection);

	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'align'),
				value,
				attribute: 'blockeraFlexChildAlign',
				blockName: block.blockName,
			}}
		>
			<ToggleSelectControl
				columns="1fr 2.5fr"
				label={__('Self Align', 'blockera')}
				options={getFlexChildAlignSelectOptions(flexDirection, 18)}
				labelPopoverTitle={__('Flex Child → Self Align', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'Override the parent’s "align-items" rule and tell this block alone where to sit on the flex (or grid) cross-axis— top-to-bottom in a row, left-to-right in a column.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon
								icon="flex-align-start"
								iconSize="18"
								style={iconStyle}
							/>
							{__('Flex Start', 'blockera')}
						</h3>
						<p>
							{__(
								'Pin to the cross-axis start (top for rows, left for columns).',
								'blockera'
							)}
						</p>
						<h3>
							<Icon
								icon="flex-align-center"
								iconSize="18"
								style={iconStyle}
							/>
							{__('Center', 'blockera')}
						</h3>
						<p>
							{__(
								'Float dead-center along the cross-axis.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon
								icon="flex-align-end"
								iconSize="18"
								style={iconStyle}
							/>
							{__('Flex End', 'blockera')}
						</h3>
						<p>
							{__(
								'Anchor to the cross-axis end (bottom for rows, right for columns)',
								'blockera'
							)}
						</p>
						<h3>
							<Icon
								icon="flex-align-stretch"
								iconSize="18"
								style={iconStyle}
							/>
							{__('Stretch', 'blockera')}
						</h3>
						<p>
							{__('Stretch to fill the container.', 'blockera')}
						</p>
						<h3>
							<Icon
								icon="flex-align-baseline"
								iconSize="18"
								style={iconStyle}
							/>
							{__('Baseline', 'blockera')}
						</h3>
						<p>
							{__(
								'Align text baselines across items, keeping headlines and labels on the same visual line.',
								'blockera'
							)}
						</p>
					</>
				}
				isDeselectable={true}
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('blockeraFlexChildAlign', newValue, { ref })
				}
				{...props}
				labelProps={{
					...labelPropsFromExtension,
					changesetGraphPreviewRender: (resolved: mixed) =>
						renderSelectOptionChangesetPreview({
							value: resolved,
							getOptions: (iconSize) =>
								getFlexChildAlignSelectOptions(
									flexDirection,
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
