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
	Grid,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { renderSelectOptionChangesetPreview } from '../../../../components';
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { getFlexChildSizingIconStyle } from './icon-styles';

function getFlexChildSizingSelectOptions(
	flexDirection: string | void,
	iconSize: number
): any {
	const iconStyle = getFlexChildSizingIconStyle(flexDirection);
	const customIconSize = iconSize === 16 ? 22 : iconSize;
	return [
		{
			label: __('Grow', 'blockera'),
			value: 'grow',
			icon: (
				<Icon
					icon="flex-child-size-grow"
					iconSize={iconSize}
					style={iconStyle}
				/>
			),
		},
		{
			label: __('Shrink', 'blockera'),
			value: 'shrink',
			icon: (
				<Icon
					icon="flex-child-size-shrink"
					iconSize={iconSize}
					style={iconStyle}
				/>
			),
		},
		{
			label: __('No Grow or Shrink', 'blockera'),
			value: 'no',
			icon: (
				<Icon
					icon="flex-child-size-no-grow"
					iconSize={iconSize}
					style={iconStyle}
				/>
			),
		},
		{
			label: __('Custom', 'blockera'),
			value: 'custom',
			icon: (
				<Icon
					icon="more-horizontal"
					iconSize={customIconSize}
					className="more-horizontal"
				/>
			),
		},
	];
}

export const FlexChildSelfSize = ({
	block,
	flexDirection,
	sizingValue,
	growValue,
	shrinkValue,
	basisValue,
	onChange,
	attributes,
	extensionProps,
	labelProps: labelPropsFromExtension,
	...props
}: {
	block: TBlockProps,
	flexDirection: string | void,
	sizingValue: string | void,
	growValue: mixed,
	shrinkValue: mixed,
	basisValue: mixed,
	onChange: THandleOnChangeAttributes,
	attributes: Object,
	extensionProps: Object,
	labelProps?: Object,
}): MixedElement => {
	const iconStyleSizing = getFlexChildSizingIconStyle(flexDirection);

	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'sizing'),
				value: sizingValue,
				attribute: 'blockeraFlexChildSizing',
				blockName: block.blockName,
			}}
		>
			<ToggleSelectControl
				columns="1fr 2.5fr"
				label={__('Self Size', 'blockera')}
				options={getFlexChildSizingSelectOptions(flexDirection, 18)}
				labelPopoverTitle={__('Flex Child → Self Size', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'Control how this block claims space inside its flex-parent. Use it to fine-tune layouts where precise proportions matter.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon
								icon="flex-child-size-grow"
								iconSize="18"
								style={iconStyleSizing}
							/>
							{__('Grow', 'blockera')}
						</h3>
						<p>
							{__(
								'Let the block stretch to fill all leftover space.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon
								icon="flex-child-size-shrink"
								iconSize="18"
								style={iconStyleSizing}
							/>
							{__('Shrink', 'blockera')}
						</h3>
						<p>
							{__(
								'Allow the block to shrink but never grow.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon
								icon="flex-child-size-no-grow"
								iconSize="18"
								style={iconStyleSizing}
							/>
							{__('No Grow or Shrink', 'blockera')}
						</h3>
						<p>
							{__(
								'Lock the block at its intrinsic size. Ensures pixel-perfect dimensions regardless of the viewport.',
								'blockera'
							)}
						</p>
						<h3>{__('Custom', 'blockera')}</h3>
						<p>
							{__(
								'Manually set Grow, Shrink, and Basis values for pro-level control—ideal when you need fractional growth, custom minimums, or bespoke breakpoints.',
								'blockera'
							)}
						</p>
					</>
				}
				isDeselectable={true}
				defaultValue={attributes.blockeraFlexChildSizing.default}
				onChange={(newValue, ref) =>
					onChange('blockeraFlexChildSizing', newValue, { ref })
				}
				{...props}
				labelProps={{
					...labelPropsFromExtension,
					changesetGraphPreviewRender: (resolved: mixed) =>
						renderSelectOptionChangesetPreview({
							value: resolved,
							getOptions: (iconSize) =>
								getFlexChildSizingSelectOptions(
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
				{sizingValue === 'custom' && (
					<>
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'grow'),
								value: growValue,
								attribute: 'blockeraFlexChildGrow',
								blockName: block.blockName,
							}}
						>
							<InputControl
								label={__('Grow', 'blockera')}
								aria-label={__('Custom Grow', 'blockera')}
								labelPopoverTitle={__('Flex Grow', 'blockera')}
								labelDescription={
									<>
										<p>
											{__(
												'Decides how much leftover space this block will absorb compared with its flex siblings.',
												'blockera'
											)}
										</p>
										<h3>
											{__('Accepted value:', 'blockera')}
										</h3>
										<Grid
											gridTemplateColumns="50px 1fr"
											alignItems="center"
										>
											<code
												style={{
													borderRadius: '3px',
													background:
														'rgb(255 255 255 / 11%)',
													width: '50px',
													height: '30px',
													display: 'flex',
													'align-items': 'center',
													'justify-content': 'center',
												}}
											>
												0
											</code>
											{__('Never stretch.', 'blockera')}
										</Grid>
										<Grid
											gridTemplateColumns="50px 1fr"
											alignItems="center"
										>
											<code
												style={{
													borderRadius: '3px',
													background:
														'rgb(255 255 255 / 11%)',
													width: '50px',
													height: '30px',
													display: 'flex',
													'align-items': 'center',
													'justify-content': 'center',
												}}
											>
												1
											</code>
											{__(
												'Share space evenly with other items with "1" value.',
												'blockera'
											)}
										</Grid>
										<Grid
											gridTemplateColumns="50px 1fr"
											alignItems="center"
										>
											<code
												style={{
													borderRadius: '3px',
													background:
														'rgb(255 255 255 / 11%)',
													width: '50px',
													height: '30px',
													display: 'flex',
													'align-items': 'center',
													'justify-content': 'center',
												}}
											>
												2+
											</code>
											{__(
												'Grab proportionally more (e.g., "2" grows twice as fast as "1").',
												'blockera'
											)}
										</Grid>
									</>
								}
								columns="columns-2"
								unitType="flex-grow"
								type="number"
								float={true}
								arrows={true}
								min={0}
								onChange={(newValue, ref) =>
									onChange(
										'blockeraFlexChildGrow',
										newValue,
										{ ref }
									)
								}
								size="small"
								defaultValue={attributes.blockeraFlexChildGrow}
								{...extensionProps.blockeraFlexChildGrow}
							/>
						</ControlContextProvider>

						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'shrink'),
								value: shrinkValue,
								attribute: 'blockeraFlexChildShrink',
								blockName: block.blockName,
							}}
						>
							<InputControl
								label={__('Shrink', 'blockera')}
								aria-label={__('Custom Shrink', 'blockera')}
								labelPopoverTitle={__(
									'Flex Shrink',
									'blockera'
								)}
								labelDescription={
									<>
										<p>
											{__(
												'Controls how aggressively this block compresses when the container gets narrower than the items’ natural widths.',
												'blockera'
											)}
										</p>
										<h3>
											{__('Accepted value:', 'blockera')}
										</h3>
										<Grid
											gridTemplateColumns="50px 1fr"
											alignItems="center"
										>
											<code
												style={{
													borderRadius: '3px',
													background:
														'rgb(255 255 255 / 11%)',
													width: '50px',
													height: '30px',
													display: 'flex',
													'align-items': 'center',
													'justify-content': 'center',
												}}
											>
												0
											</code>
											{__(
												'Never shrink (may cause overflow).',
												'blockera'
											)}
										</Grid>
										<Grid
											gridTemplateColumns="50px 1fr"
											alignItems="center"
										>
											<code
												style={{
													borderRadius: '3px',
													background:
														'rgb(255 255 255 / 11%)',
													width: '50px',
													height: '30px',
													display: 'flex',
													'align-items': 'center',
													'justify-content': 'center',
												}}
											>
												1
											</code>
											{__(
												'Shrink proportionally with items with "1" value.',
												'blockera'
											)}
										</Grid>
										<Grid
											gridTemplateColumns="50px 1fr"
											alignItems="center"
										>
											<code
												style={{
													borderRadius: '3px',
													background:
														'rgb(255 255 255 / 11%)',
													width: '50px',
													height: '30px',
													display: 'flex',
													'align-items': 'center',
													'justify-content': 'center',
												}}
											>
												2+
											</code>
											{__(
												'Shrink faster (higher ratio).',
												'blockera'
											)}
										</Grid>
									</>
								}
								columns="columns-2"
								unitType="flex-shrink"
								type="number"
								float={true}
								arrows={true}
								min={0}
								onChange={(newValue, ref) =>
									onChange(
										'blockeraFlexChildShrink',
										newValue,
										{ ref }
									)
								}
								size="small"
								defaultValue={
									attributes.blockeraFlexChildShrink
								}
								{...extensionProps.blockeraFlexChildShrink}
							/>
						</ControlContextProvider>

						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'basis'),
								value: basisValue,
								attribute: 'blockeraFlexChildBasis',
								blockName: block.blockName,
							}}
						>
							<InputControl
								label={__('Basis', 'blockera')}
								aria-label={__('Flex Basis', 'blockera')}
								labelPopoverTitle={__('Flex Basis', 'blockera')}
								labelDescription={
									<>
										<p>
											{__(
												'Sets the starting size used in the flex calculations before Grow or Shrink kick in.',
												'blockera'
											)}
										</p>
										<h3>
											{__('Accepted value:', 'blockera')}
										</h3>
										<Grid
											gridTemplateColumns="50px 1fr"
											alignItems="center"
										>
											<code
												style={{
													borderRadius: '3px',
													background:
														'rgb(255 255 255 / 11%)',
													display: 'flex',
													'align-items': 'center',
													'justify-content': 'center',
													width: '50px',
													height: '30px',
												}}
											></code>
											{__(
												'Length (px, em, rem, %, ch, clamp(), etc.)',
												'blockera'
											)}
										</Grid>
										<Grid
											gridTemplateColumns="50px 1fr"
											alignItems="center"
										>
											<code
												style={{
													borderRadius: '3px',
													background:
														'rgb(255 255 255 / 11%)',
													display: 'flex',
													'align-items': 'center',
													'justify-content': 'center',
													width: '50px',
													height: '30px',
												}}
											>
												auto
											</code>
											{__(
												'Use intrinsic size (default).',
												'blockera'
											)}
										</Grid>
										<Grid
											gridTemplateColumns="50px 1fr"
											alignItems="center"
										>
											<code
												style={{
													borderRadius: '3px',
													background:
														'rgb(255 255 255 / 11%)',
													display: 'flex',
													'align-items': 'center',
													'justify-content': 'center',
													width: '50px',
													height: '30px',
												}}
											>
												0
											</code>
											{__(
												'Ignore intrinsic size, letting Grow rules split space evenly.',
												'blockera'
											)}
										</Grid>
									</>
								}
								columns="columns-2"
								arrows={true}
								unitType="flex-basis"
								min={0}
								defaultValue={attributes.blockeraFlexChildBasis}
								onChange={(newValue, ref) =>
									onChange(
										'blockeraFlexChildBasis',
										newValue,
										{ ref }
									)
								}
								size="small"
								{...extensionProps.blockeraFlexChildBasis}
							/>
						</ControlContextProvider>
					</>
				)}
			</ToggleSelectControl>
		</ControlContextProvider>
	);
};
