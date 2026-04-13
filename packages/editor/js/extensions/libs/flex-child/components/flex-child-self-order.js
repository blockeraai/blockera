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
	InputControl,
	ToggleSelectControl,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { renderSelectOptionChangesetPreview } from '../../../../components';
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { getFlexChildOrderIconStyle } from './icon-styles';

function getFlexChildOrderSelectOptions(
	flexDirection: string | void,
	iconSize: number
): any {
	const iconStyle = getFlexChildOrderIconStyle(flexDirection);
	return [
		{
			label: __('First', 'blockera'),
			value: 'first',
			icon: (
				<Icon
					icon="order-horizontal-first"
					iconSize={iconSize}
					style={iconStyle}
				/>
			),
		},
		{
			label: __('Last', 'blockera'),
			value: 'last',
			icon: (
				<Icon
					icon="order-horizontal-last"
					iconSize={iconSize}
					style={iconStyle}
				/>
			),
		},
		{
			label: __('Custom Order', 'blockera'),
			value: 'custom',
			icon: (
				<Icon
					icon="more-horizontal"
					iconSize={iconSize === 18 ? 24 : iconSize}
					className="more-horizontal"
				/>
			),
		},
	];
}

export const FlexChildSelfOrder = ({
	block,
	flexDirection,
	value,
	orderCustomValue,
	onChange,
	defaultValue,
	attributes,
	extensionProps,
	labelProps: labelPropsFromExtension,
	...props
}: {
	block: TBlockProps,
	flexDirection: string | void,
	value: string | void,
	orderCustomValue: mixed,
	onChange: THandleOnChangeAttributes,
	defaultValue?: string,
	attributes: Object,
	extensionProps: Object,
	labelProps?: Object,
}): MixedElement => {
	const iconStyle = getFlexChildOrderIconStyle(flexDirection);

	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'order'),
				value,
				attribute: 'blockeraFlexChildOrder',
				blockName: block.blockName,
			}}
		>
			<ToggleSelectControl
				columns="1fr 2.5fr"
				label={__('Self Order', 'blockera')}
				options={getFlexChildOrderSelectOptions(flexDirection, 18)}
				labelPopoverTitle={__('Flex Child → Self Order', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'Tell this block where to appear inside its flex line—without touching the actual HTML.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon
								icon="order-horizontal-first"
								iconSize="18"
								style={iconStyle}
							/>
							{__('First', 'blockera')}
						</h3>
						<p>
							{__(
								'Puts the block at the very beginning. (order: -1)',
								'blockera'
							)}
						</p>
						<h3>
							<Icon
								icon="order-horizontal-last"
								iconSize="18"
								style={iconStyle}
							/>
							{__('Last', 'blockera')}
						</h3>
						<p>
							{__(
								'Puts the block at the very end. (order: 100)',
								'blockera'
							)}
						</p>
						<h3>{__('Custom', 'blockera')}</h3>
						<p>
							{__(
								'Enter any integer to fit the block between others.',
								'blockera'
							)}
						</p>
					</>
				}
				isDeselectable={true}
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('blockeraFlexChildOrder', newValue, { ref })
				}
				{...props}
				labelProps={{
					...labelPropsFromExtension,
					changesetGraphPreviewRender: (resolved: mixed) =>
						renderSelectOptionChangesetPreview({
							value: resolved,
							getOptions: (iconSize) =>
								getFlexChildOrderSelectOptions(
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
			>
				{value === 'custom' && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'order-custom'),
							value: orderCustomValue,
							attribute: 'blockeraFlexChildOrderCustom',
							blockName: block.blockName,
						}}
					>
						<InputControl
							label={__('Custom', 'blockera')}
							labelPopoverTitle={__(
								'Flex Child → Self Order',
								'blockera'
							)}
							labelDescription={
								<p>
									{__(
										'Specify the exact stacking position for this block among its siblings.',
										'blockera'
									)}
								</p>
							}
							columns="2fr 3fr"
							unitType="order"
							arrows={true}
							min={-1}
							onChange={(newValue, ref) =>
								onChange(
									'blockeraFlexChildOrderCustom',
									newValue,
									{ ref }
								)
							}
							size="small"
							defaultValue={
								attributes.blockeraFlexChildOrderCustom
							}
							{...extensionProps.blockeraFlexChildOrderCustom}
						/>
					</ControlContextProvider>
				)}
			</ToggleSelectControl>
		</ControlContextProvider>
	);
};
