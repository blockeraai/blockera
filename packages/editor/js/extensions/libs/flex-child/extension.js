// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import {
	PanelBodyControl,
	ControlContextProvider,
	InputControl,
	ToggleSelectControl,
	Grid,
} from '@blockera/controls';
import { hasSameProps } from '@blockera/utils';
import { extensionClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { generateExtensionId } from '../utils';
import { ExtensionSettings } from '../settings';
import { EditorFeatureWrapper } from '../../../';
import { useBlockSection } from '../../components';
import type { TFlexChildProps } from './types/flex-child-props';

export const FlexChildExtension: ComponentType<TFlexChildProps> = memo(
	({
		block,
		extensionConfig,
		values,
		handleOnChangeAttributes,
		extensionProps,
		setSettings,
		attributes,
	}: TFlexChildProps): MixedElement => {
		const { initialOpen, onToggle } = useBlockSection('flexChildConfig');
		const isShowFlexChildSizing = isShowField(
			extensionConfig.blockeraFlexChildSizing,
			values?.blockeraFlexChildSizing,
			attributes.blockeraFlexChildSizing.default
		);
		const isShowFlexChildAlign = isShowField(
			extensionConfig.blockeraFlexChildAlign,
			values?.blockeraFlexChildAlign,
			attributes.blockeraFlexChildAlign.default
		);
		const isShowFlexChildOrder = isShowField(
			extensionConfig.blockeraFlexChildOrder,
			values?.blockeraFlexChildOrder,
			attributes.blockeraFlexChildOrder.default
		);

		if (
			!isShowFlexChildSizing &&
			!isShowFlexChildAlign &&
			!isShowFlexChildOrder
		) {
			return <></>;
		}

		const iconRotate = {
			transform: ['column', 'column-reverse'].includes(
				values.blockeraFlexDirection
			)
				? 'rotate(-90deg)'
				: 'rotate(0deg)',
		};

		const iconRotate2 = {
			transform: !['column', 'column-reverse'].includes(
				values.blockeraFlexDirection
			)
				? 'rotate(-90deg)'
				: 'rotate(0deg)',
		};

		const iconRotate3 = {
			transform: ['column', 'column-reverse'].includes(
				values.blockeraFlexDirection
			)
				? 'rotate(90deg)'
				: 'rotate(0deg)',
		};

		return (
			<PanelBodyControl
				onToggle={onToggle}
				title={__('Flex Child', 'blockera')}
				initialOpen={initialOpen}
				icon={<Icon icon="extension-flex-child" />}
				className={extensionClassNames('flex-child')}
			>
				<ExtensionSettings
					features={extensionConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'flexChildConfig');
					}}
				/>

				<EditorFeatureWrapper
					isActive={isShowFlexChildSizing}
					config={extensionConfig.blockeraFlexChildSizing}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'sizing'),
							value: values.blockeraFlexChildSizing,
							attribute: 'blockeraFlexChildSizing',
							blockName: block.blockName,
						}}
					>
						<ToggleSelectControl
							columns="1fr 2.65fr"
							label={__('Self Size', 'blockera')}
							options={[
								{
									label: __('Grow', 'blockera'),
									value: 'grow',
									icon: (
										<Icon
											icon="flex-child-size-grow"
											iconSize="18"
											style={iconRotate2}
										/>
									),
								},
								{
									label: __('Shrink', 'blockera'),
									value: 'shrink',
									icon: (
										<Icon
											icon="flex-child-size-shrink"
											iconSize="18"
											style={iconRotate2}
										/>
									),
								},
								{
									label: __('No Grow or Shrink', 'blockera'),
									value: 'no',
									icon: (
										<Icon
											icon="flex-child-size-no-grow"
											iconSize="18"
											style={iconRotate2}
										/>
									),
								},
								{
									label: __('Custom', 'blockera'),
									value: 'custom',
									icon: (
										<Icon
											icon="more-horizontal"
											iconSize="24"
											className="more-horizontal"
										/>
									),
								},
							]}
							labelPopoverTitle={__(
								'Flex Child → Self Size',
								'blockera'
							)}
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
											style={iconRotate2}
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
											style={iconRotate2}
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
											style={iconRotate2}
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
							defaultValue={
								attributes.blockeraFlexChildSizing.default
							}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'blockeraFlexChildSizing',
									newValue,
									{ ref }
								)
							}
							{...extensionProps.blockeraFlexChildSizing}
						>
							{values.blockeraFlexChildSizing === 'custom' && (
								<>
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'grow'
											),
											value: values.blockeraFlexChildGrow,
											attribute: 'blockeraFlexChildGrow',
											blockName: block.blockName,
										}}
									>
										<InputControl
											label={__('Grow', 'blockera')}
											aria-label={__(
												'Custom Grow',
												'blockera'
											)}
											labelPopoverTitle={__(
												'Flex Grow',
												'blockera'
											)}
											labelDescription={
												<>
													<p>
														{__(
															'Decides how much leftover space this block will absorb compared with its flex siblings.',
															'blockera'
														)}
													</p>
													<h3>
														{__(
															'Accepted value:',
															'blockera'
														)}
													</h3>
													<Grid
														gridTemplateColumns="50px 1fr"
														alignItems="center"
													>
														<code
															style={{
																borderRadius:
																	'3px',
																background:
																	'rgb(255 255 255 / 11%)',
																width: '50px',
																height: '30px',
																display: 'flex',
																'align-items':
																	'center',
																'justify-content':
																	'center',
															}}
														>
															0
														</code>
														{__(
															'Never stretch.',
															'blockera'
														)}
													</Grid>
													<Grid
														gridTemplateColumns="50px 1fr"
														alignItems="center"
													>
														<code
															style={{
																borderRadius:
																	'3px',
																background:
																	'rgb(255 255 255 / 11%)',
																width: '50px',
																height: '30px',
																display: 'flex',
																'align-items':
																	'center',
																'justify-content':
																	'center',
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
																borderRadius:
																	'3px',
																background:
																	'rgb(255 255 255 / 11%)',
																width: '50px',
																height: '30px',
																display: 'flex',
																'align-items':
																	'center',
																'justify-content':
																	'center',
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
												handleOnChangeAttributes(
													'blockeraFlexChildGrow',
													newValue,
													{ ref }
												)
											}
											size="small"
											defaultValue={
												attributes.blockeraFlexChildGrow
											}
											{...extensionProps.blockeraFlexChildGrow}
										/>
									</ControlContextProvider>

									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'shrink'
											),
											value: values.blockeraFlexChildShrink,
											attribute:
												'blockeraFlexChildShrink',
											blockName: block.blockName,
										}}
									>
										<InputControl
											label={__('Shrink', 'blockera')}
											aria-label={__(
												'Custom Shrink',
												'blockera'
											)}
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
														{__(
															'Accepted value:',
															'blockera'
														)}
													</h3>
													<Grid
														gridTemplateColumns="50px 1fr"
														alignItems="center"
													>
														<code
															style={{
																borderRadius:
																	'3px',
																background:
																	'rgb(255 255 255 / 11%)',
																width: '50px',
																height: '30px',
																display: 'flex',
																'align-items':
																	'center',
																'justify-content':
																	'center',
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
																borderRadius:
																	'3px',
																background:
																	'rgb(255 255 255 / 11%)',
																width: '50px',
																height: '30px',
																display: 'flex',
																'align-items':
																	'center',
																'justify-content':
																	'center',
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
																borderRadius:
																	'3px',
																background:
																	'rgb(255 255 255 / 11%)',
																width: '50px',
																height: '30px',
																display: 'flex',
																'align-items':
																	'center',
																'justify-content':
																	'center',
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
												handleOnChangeAttributes(
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
											name: generateExtensionId(
												block,
												'basis'
											),
											value: values.blockeraFlexChildBasis,
											attribute: 'blockeraFlexChildBasis',
											blockName: block.blockName,
										}}
									>
										<InputControl
											label={__('Basis', 'blockera')}
											aria-label={__(
												'Flex Basis',
												'blockera'
											)}
											labelPopoverTitle={__(
												'Flex Basis',
												'blockera'
											)}
											labelDescription={
												<>
													<p>
														{__(
															'Sets the starting size used in the flex calculations before Grow or Shrink kick in.',
															'blockera'
														)}
													</p>
													<h3>
														{__(
															'Accepted value:',
															'blockera'
														)}
													</h3>
													<Grid
														gridTemplateColumns="50px 1fr"
														alignItems="center"
													>
														<code
															style={{
																borderRadius:
																	'3px',
																background:
																	'rgb(255 255 255 / 11%)',
																display: 'flex',
																'align-items':
																	'center',
																'justify-content':
																	'center',
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
																borderRadius:
																	'3px',
																background:
																	'rgb(255 255 255 / 11%)',
																display: 'flex',
																'align-items':
																	'center',
																'justify-content':
																	'center',
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
																borderRadius:
																	'3px',
																background:
																	'rgb(255 255 255 / 11%)',
																display: 'flex',
																'align-items':
																	'center',
																'justify-content':
																	'center',
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
											defaultValue={
												attributes.blockeraFlexChildBasis
											}
											onChange={(newValue, ref) =>
												handleOnChangeAttributes(
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
				</EditorFeatureWrapper>

				<EditorFeatureWrapper
					isActive={isShowFlexChildAlign}
					config={extensionConfig.blockeraFlexChildAlign}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'align'),
							value: values.blockeraFlexChildAlign,
							attribute: 'blockeraFlexChildAlign',
							blockName: block.blockName,
						}}
					>
						<ToggleSelectControl
							columns="1fr 2.65fr"
							label={__('Self Align', 'blockera')}
							options={[
								{
									label: __('Flex Start', 'blockera'),
									value: 'flex-start',
									icon: (
										<Icon
											icon="flex-align-start"
											iconSize="18"
											style={iconRotate}
										/>
									),
								},
								{
									label: __('Center', 'blockera'),
									value: 'center',
									icon: (
										<Icon
											icon="flex-align-center"
											iconSize="18"
											style={iconRotate}
										/>
									),
								},
								{
									label: __('Flex End', 'blockera'),
									value: 'flex-end',
									icon: (
										<Icon
											icon="flex-align-end"
											iconSize="18"
											style={iconRotate}
										/>
									),
								},
								{
									label: __('Stretch', 'blockera'),
									value: 'stretch',
									icon: (
										<Icon
											icon="flex-align-stretch"
											iconSize="18"
											style={iconRotate}
										/>
									),
								},
								{
									label: __('Baseline', 'blockera'),
									value: 'baseline',
									icon: (
										<Icon
											icon="flex-align-baseline"
											iconSize="18"
										/>
									),
								},
							]}
							labelPopoverTitle={__(
								'Flex Child → Self Align',
								'blockera'
							)}
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
											style={iconRotate}
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
											style={iconRotate}
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
											style={iconRotate}
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
											style={iconRotate}
										/>
										{__('Stretch', 'blockera')}
									</h3>
									<p>
										{__(
											'Stretch to fill the container.',
											'blockera'
										)}
									</p>
									<h3>
										<Icon
											icon="flex-align-baseline"
											iconSize="18"
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
							//
							defaultValue={
								attributes.blockeraFlexChildAlign.default
							}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'blockeraFlexChildAlign',
									newValue,
									{ ref }
								)
							}
							{...extensionProps.blockeraFlexChildAlign}
						/>
					</ControlContextProvider>
				</EditorFeatureWrapper>

				<EditorFeatureWrapper
					isActive={isShowFlexChildOrder}
					config={extensionConfig.blockeraFlexChildOrder}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'order'),
							value: values.blockeraFlexChildOrder,
							attribute: 'blockeraFlexChildOrder',
							blockName: block.blockName,
						}}
					>
						<ToggleSelectControl
							columns="1fr 2.65fr"
							label={__('Self Order', 'blockera')}
							options={[
								{
									label: __('First', 'blockera'),
									value: 'first',
									icon: (
										<Icon
											icon="order-horizontal-first"
											iconSize="18"
											style={iconRotate3}
										/>
									),
								},
								{
									label: __('Last', 'blockera'),
									value: 'last',
									icon: (
										<Icon
											icon="order-horizontal-last"
											iconSize="18"
											style={iconRotate3}
										/>
									),
								},
								{
									label: __('Custom Order', 'blockera'),
									value: 'custom',
									icon: (
										<Icon
											icon="more-horizontal"
											iconSize="24"
											className="more-horizontal"
										/>
									),
								},
							]}
							labelPopoverTitle={__(
								'Flex Child → Self Order',
								'blockera'
							)}
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
											style={iconRotate3}
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
											style={iconRotate3}
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
							//
							defaultValue={
								attributes.blockeraFlexChildOrder.default
							}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'blockeraFlexChildOrder',
									newValue,
									{ ref }
								)
							}
							{...extensionProps.blockeraFlexChildOrder}
						>
							{values.blockeraFlexChildOrder === 'custom' && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'order-custom'
										),
										value: values.blockeraFlexChildOrderCustom,
										attribute:
											'blockeraFlexChildOrderCustom',
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
											handleOnChangeAttributes(
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
				</EditorFeatureWrapper>
			</PanelBodyControl>
		);
	},
	hasSameProps
);
