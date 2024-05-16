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
} from '@blockera/controls';
import { hasSameProps } from '@blockera/utils';
import { extensionClassNames } from '@blockera/classnames';
import { FeatureWrapper } from '@blockera/editor';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { default as GearIcon } from './icons/gear';
import { default as SizingNotIcon } from './icons/sizing-not';
import { generateExtensionId } from '../utils';
import { default as SizingGrowIcon } from './icons/sizing-grow';
import { default as AlignStretchIcon } from './icons/align-stretch';
import { default as SizingShrinkIcon } from './icons/sizing-shrink';
import { default as AlignFlexEndIcon } from './icons/align-flex-end';
import { default as AlignBaselineIcon } from './icons/align-baseline';
import { default as AlignFlexStartIcon } from './icons/align-flex-start';
import { default as AlignFlexCenterIcon } from './icons/align-flex-center';
import { default as OrderFirst } from './icons/order-first';
import { default as OrderLast } from './icons/order-last';
import type { TFlexChildProps } from './types/flex-child-props';
import { FlexChildExtensionIcon } from './index';
import { ExtensionSettings } from '../settings';

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

		return (
			<PanelBodyControl
				title={__('Flex Child', 'blockera')}
				initialOpen={true}
				icon={<FlexChildExtensionIcon />}
				className={extensionClassNames('flex-child')}
			>
				<ExtensionSettings
					features={extensionConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'flexChildConfig');
					}}
				/>

				<FeatureWrapper
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
							controlName="toggle-select"
							label={__('Self Size', 'blockera')}
							className={
								'items-flex-direction-' +
								values.blockeraFlexDirection
							}
							options={[
								{
									label: __('Shrink', 'blockera'),
									value: 'shrink',
									icon: <SizingShrinkIcon />,
								},
								{
									label: __('Grow', 'blockera'),
									value: 'grow',
									icon: <SizingGrowIcon />,
								},
								{
									label: __('No Grow or Shrink', 'blockera'),
									value: 'no',
									icon: <SizingNotIcon />,
								},
								{
									label: __('Custom', 'blockera'),
									value: 'custom',
									icon: <GearIcon />,
								},
							]}
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
											controlName="input"
											label={__('Grow', 'blockera')}
											aria-label={__(
												'Custom Grow',
												'blockera'
											)}
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
											controlName="input"
											label={__('Shrink', 'blockera')}
											aria-label={__(
												'Custom Shrink',
												'blockera'
											)}
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
											controlName="input"
											label={__('Basis', 'blockera')}
											aria-label={__(
												'Custom Basis',
												'blockera'
											)}
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
				</FeatureWrapper>

				<FeatureWrapper
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
							controlName="toggle-select"
							label={__('Self Align', 'blockera')}
							className={
								'items-flex-direction-' +
								values.blockeraFlexDirection
							}
							options={[
								{
									label: __('Flex Start', 'blockera'),
									value: 'flex-start',
									icon: <AlignFlexStartIcon />,
								},
								{
									label: __('Center', 'blockera'),
									value: 'center',
									icon: <AlignFlexCenterIcon />,
								},
								{
									label: __('Flex End', 'blockera'),
									value: 'flex-end',
									icon: <AlignFlexEndIcon />,
								},
								{
									label: __('Stretch', 'blockera'),
									value: 'stretch',
									icon: <AlignStretchIcon />,
								},
								{
									label: __('Baseline', 'blockera'),
									value: 'baseline',
									icon: <AlignBaselineIcon />,
								},
							]}
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
				</FeatureWrapper>

				<FeatureWrapper
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
							className={
								'items-flex-direction-' +
								values.blockeraFlexDirection
							}
							options={[
								{
									label: __('First', 'blockera'),
									value: 'first',
									icon: <OrderFirst />,
								},
								{
									label: __('Last', 'blockera'),
									value: 'last',
									icon: <OrderLast />,
								},
								{
									label: __('Custom Order', 'blockera'),
									value: 'custom',
									icon: <GearIcon />,
								},
							]}
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
										controlName="input"
										label={__('Custom', 'blockera')}
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
				</FeatureWrapper>
			</PanelBodyControl>
		);
	},
	hasSameProps
);
