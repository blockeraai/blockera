// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { memo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	ControlContextProvider,
	InputControl,
	ToggleSelectControl,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { default as GearIcon } from './icons/gear';
import { default as SizingNotIcon } from './icons/sizing-not';
import { generateExtensionId, hasSameProps } from '../utils';
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

export const FlexChildExtension: TFlexChildProps = memo<TFlexChildProps>(
	({
		block,
		config,
		values: {
			flexChildGrow,
			flexDirection,
			flexChildAlign,
			flexChildBasis,
			flexChildOrder,
			flexChildSizing,
			flexChildShrink,
			flexChildOrderCustom,
		},
		handleOnChangeAttributes,
		...props
	}: TFlexChildProps): MixedElement => {
		const {
			flexChildConfig: {
				publisherFlexChildSizing,
				publisherFlexChildAlign,
				publisherFlexChildOrder,
			},
		} = config;

		return (
			<>
				{isActiveField(publisherFlexChildSizing) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'sizing'),
							value: flexChildSizing,
						}}
					>
						<BaseControl
							columns="1fr 2.65fr"
							controlName="toggle-select"
							label={__('Sizing', 'publisher-core')}
							className={
								'items-flex-direction-' + flexDirection.value
							}
						>
							<ToggleSelectControl
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
								//
								defaultValue=""
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherFlexChildSizing',
										newValue
									)
								}
							/>
							{flexChildSizing === 'custom' && (
								<>
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'grow'
											),
											value: flexChildGrow,
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
											{...{
												...props,
												min: 0,
												onChange: (newValue) =>
													handleOnChangeAttributes(
														'publisherFlexChildGrow',
														newValue
													),
											}}
											size="small"
										/>
									</ControlContextProvider>
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'shrink'
											),
											value: flexChildShrink,
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
											{...{
												...props,
												min: 0,
												onChange: (newValue) =>
													handleOnChangeAttributes(
														'publisherFlexChildShrink',
														newValue
													),
											}}
											size="small"
										/>
									</ControlContextProvider>
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'basis'
											),
											value: flexChildBasis,
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
											{...{
												...props,
												unitType: 'flex-basis',
												min: 0,
												defaultValue: 'auto',
												onChange: (newValue) =>
													handleOnChangeAttributes(
														'publisherFlexChildBasis',
														newValue
													),
											}}
											size="small"
										/>
									</ControlContextProvider>
								</>
							)}
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherFlexChildAlign) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'align'),
							value: flexChildAlign,
						}}
					>
						<BaseControl
							columns="1fr 2.65fr"
							controlName="toggle-select"
							label={__('Align', 'publisher-core')}
							className={
								'items-flex-direction-' + flexDirection.value
							}
						>
							<ToggleSelectControl
								options={[
									{
										label: __(
											'Flex Start',
											'publisher-core'
										),
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
								defaultValue=""
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherFlexChildAlign',
										newValue
									)
								}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherFlexChildOrder) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'order'),
							value: flexChildOrder,
						}}
					>
						<BaseControl
							columns="1fr 2.65fr"
							controlName="toggle-select"
							label={__('Order', 'publisher-core')}
							className={
								'items-flex-direction-' + flexDirection.value
							}
						>
							<ToggleSelectControl
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
										label: __(
											'Custom Order',
											'publisher-core'
										),
										value: 'custom',
										icon: <GearIcon />,
									},
								]}
								isDeselectable={true}
								//
								defaultValue=""
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherFlexChildOrder',
										newValue
									)
								}
							/>
							<>
								{flexChildOrder === 'custom' && (
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'order-custom'
											),
											value: flexChildOrderCustom,
										}}
									>
										<InputControl
											controlName="input"
											label={__(
												'Custom',
												'publisher-core'
											)}
											columns="2fr 3fr"
											unitType="order"
											arrows={true}
											{...{
												...props,
												min: -1,
												onChange: (newValue) =>
													handleOnChangeAttributes(
														'publisherFlexChildOrderCustom',
														newValue
													),
											}}
											size="small"
										/>
									</ControlContextProvider>
								)}
							</>
						</BaseControl>
					</ControlContextProvider>
				)}
			</>
		);
	},
	hasSameProps
);
