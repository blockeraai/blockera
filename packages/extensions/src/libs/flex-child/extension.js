// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Publisher dependencies
 */
import {
	PanelBodyControl,
	ControlContextProvider,
	InputControl,
	ToggleSelectControl,
} from '@publisher/controls';
import { hasSameProps } from '@publisher/utils';
import { extensionClassNames } from '@publisher/classnames';
import { FeatureWrapper } from '@publisher/components';

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
			extensionConfig.publisherFlexChildSizing,
			values?.publisherFlexChildSizing,
			attributes.publisherFlexChildSizing.default
		);
		const isShowFlexChildAlign = isShowField(
			extensionConfig.publisherFlexChildAlign,
			values?.publisherFlexChildAlign,
			attributes.publisherFlexChildAlign.default
		);
		const isShowFlexChildOrder = isShowField(
			extensionConfig.publisherFlexChildOrder,
			values?.publisherFlexChildOrder,
			attributes.publisherFlexChildOrder.default
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
				title={__('Flex Child', 'publisher-core')}
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
					config={extensionConfig.publisherFlexChildSizing}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'sizing'),
							value: values.publisherFlexChildSizing,
							attribute: 'publisherFlexChildSizing',
							blockName: block.blockName,
						}}
					>
						<ToggleSelectControl
							columns="1fr 2.65fr"
							controlName="toggle-select"
							label={__('Self Size', 'publisher-core')}
							className={
								'items-flex-direction-' +
								values.publisherFlexDirection
							}
							options={[
								{
									label: __('Shrink', 'publisher-core'),
									value: 'shrink',
									icon: <SizingShrinkIcon />,
								},
								{
									label: __('Grow', 'publisher-core'),
									value: 'grow',
									icon: <SizingGrowIcon />,
								},
								{
									label: __(
										'No Grow or Shrink',
										'publisher-core'
									),
									value: 'no',
									icon: <SizingNotIcon />,
								},
								{
									label: __('Custom', 'publisher-core'),
									value: 'custom',
									icon: <GearIcon />,
								},
							]}
							isDeselectable={true}
							defaultValue={
								attributes.publisherFlexChildSizing.default
							}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'publisherFlexChildSizing',
									newValue,
									{ ref }
								)
							}
							{...extensionProps.publisherFlexChildSizing}
						>
							{values.publisherFlexChildSizing === 'custom' && (
								<>
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'grow'
											),
											value: values.publisherFlexChildGrow,
											attribute: 'publisherFlexChildGrow',
											blockName: block.blockName,
										}}
									>
										<InputControl
											controlName="input"
											label={__('Grow', 'publisher-core')}
											aria-label={__(
												'Custom Grow',
												'publisher-core'
											)}
											columns="columns-2"
											unitType="flex-grow"
											type="number"
											float={true}
											arrows={true}
											min={0}
											onChange={(newValue, ref) =>
												handleOnChangeAttributes(
													'publisherFlexChildGrow',
													newValue,
													{ ref }
												)
											}
											size="small"
											defaultValue={
												attributes.publisherFlexChildGrow
											}
											{...extensionProps.publisherFlexChildGrow}
										/>
									</ControlContextProvider>

									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'shrink'
											),
											value: values.publisherFlexChildShrink,
											attribute:
												'publisherFlexChildShrink',
											blockName: block.blockName,
										}}
									>
										<InputControl
											controlName="input"
											label={__(
												'Shrink',
												'publisher-core'
											)}
											aria-label={__(
												'Custom Shrink',
												'publisher-core'
											)}
											columns="columns-2"
											unitType="flex-shrink"
											type="number"
											float={true}
											arrows={true}
											min={0}
											onChange={(newValue, ref) =>
												handleOnChangeAttributes(
													'publisherFlexChildShrink',
													newValue,
													{ ref }
												)
											}
											size="small"
											defaultValue={
												attributes.publisherFlexChildShrink
											}
											{...extensionProps.publisherFlexChildShrink}
										/>
									</ControlContextProvider>

									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'basis'
											),
											value: values.publisherFlexChildBasis,
											attribute:
												'publisherFlexChildBasis',
											blockName: block.blockName,
										}}
									>
										<InputControl
											controlName="input"
											label={__(
												'Basis',
												'publisher-core'
											)}
											aria-label={__(
												'Custom Basis',
												'publisher-core'
											)}
											columns="columns-2"
											arrows={true}
											unitType="flex-basis"
											min={0}
											defaultValue={
												attributes.publisherFlexChildBasis
											}
											onChange={(newValue, ref) =>
												handleOnChangeAttributes(
													'publisherFlexChildBasis',
													newValue,
													{ ref }
												)
											}
											size="small"
											{...extensionProps.publisherFlexChildBasis}
										/>
									</ControlContextProvider>
								</>
							)}
						</ToggleSelectControl>
					</ControlContextProvider>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowFlexChildAlign}
					config={extensionConfig.publisherFlexChildAlign}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'align'),
							value: values.publisherFlexChildAlign,
							attribute: 'publisherFlexChildAlign',
							blockName: block.blockName,
						}}
					>
						<ToggleSelectControl
							columns="1fr 2.65fr"
							controlName="toggle-select"
							label={__('Self Align', 'publisher-core')}
							className={
								'items-flex-direction-' +
								values.publisherFlexDirection
							}
							options={[
								{
									label: __('Flex Start', 'publisher-core'),
									value: 'flex-start',
									icon: <AlignFlexStartIcon />,
								},
								{
									label: __('Center', 'publisher-core'),
									value: 'center',
									icon: <AlignFlexCenterIcon />,
								},
								{
									label: __('Flex End', 'publisher-core'),
									value: 'flex-end',
									icon: <AlignFlexEndIcon />,
								},
								{
									label: __('Stretch', 'publisher-core'),
									value: 'stretch',
									icon: <AlignStretchIcon />,
								},
								{
									label: __('Baseline', 'publisher-core'),
									value: 'baseline',
									icon: <AlignBaselineIcon />,
								},
							]}
							isDeselectable={true}
							//
							defaultValue={
								attributes.publisherFlexChildAlign.default
							}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'publisherFlexChildAlign',
									newValue,
									{ ref }
								)
							}
							{...extensionProps.publisherFlexChildAlign}
						/>
					</ControlContextProvider>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowFlexChildOrder}
					config={extensionConfig.publisherFlexChildOrder}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'order'),
							value: values.publisherFlexChildOrder,
							attribute: 'publisherFlexChildOrder',
							blockName: block.blockName,
						}}
					>
						<ToggleSelectControl
							columns="1fr 2.65fr"
							label={__('Self Order', 'publisher-core')}
							className={
								'items-flex-direction-' +
								values.publisherFlexDirection
							}
							options={[
								{
									label: __('First', 'publisher-core'),
									value: 'first',
									icon: <OrderFirst />,
								},
								{
									label: __('Last', 'publisher-core'),
									value: 'last',
									icon: <OrderLast />,
								},
								{
									label: __('Custom Order', 'publisher-core'),
									value: 'custom',
									icon: <GearIcon />,
								},
							]}
							isDeselectable={true}
							//
							defaultValue={
								attributes.publisherFlexChildOrder.default
							}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'publisherFlexChildOrder',
									newValue,
									{ ref }
								)
							}
							{...extensionProps.publisherFlexChildOrder}
						>
							{values.publisherFlexChildOrder === 'custom' && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'order-custom'
										),
										value: values.publisherFlexChildOrderCustom,
										attribute:
											'publisherFlexChildOrderCustom',
										blockName: block.blockName,
									}}
								>
									<InputControl
										controlName="input"
										label={__('Custom', 'publisher-core')}
										columns="2fr 3fr"
										unitType="order"
										arrows={true}
										min={-1}
										onChange={(newValue, ref) =>
											handleOnChangeAttributes(
												'publisherFlexChildOrderCustom',
												newValue,
												{ ref }
											)
										}
										size="small"
										defaultValue={
											attributes.publisherFlexChildOrderCustom
										}
										{...extensionProps.publisherFlexChildOrderCustom}
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
