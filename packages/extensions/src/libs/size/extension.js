// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	ControlContextProvider,
	InputControl,
	ToggleSelectControl,
	SelectControl,
	BaseControl,
} from '@publisher/controls';
import { Flex } from '@publisher/components';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { generateExtensionId, hasSameProps } from '../utils';
import type { TSizeProps } from './types/size-props';
import { default as OverflowHiddenIcon } from './icons/overflow-hidden';
import { default as OverflowVisibleIcon } from './icons/overflow-visible';
import { default as OverflowScrollIcon } from './icons/overflow-scroll';
import { convertToPercent } from './utils';

export const SizeExtension: MixedElement = memo<TSizeProps>(
	({
		block,
		width,
		height,
		config,
		overflow,
		children,
		ratio,
		customRatio,
		fit,
		fitPosition,
		defaultValue: { width: _width, height: _height, overflow: _overflow },
		handleOnChangeAttributes,
		...props
	}: TSizeProps): MixedElement => {
		const {
			sizeConfig: {
				publisherWidth,
				publisherHeight,
				publisherOverflow,
				publisherRatio,
			},
		} = config;
		console.log(publisherRatio, 'ratios');
		return (
			<>
				{isActiveField(publisherWidth) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'width'),
							value: width,
						}}
					>
						<InputControl
							controlName="input"
							label={__('Width', 'publisher-core')}
							columns="columns-2"
							{...{
								...props,
								unitType: 'essential',
								min: 0,
								defaultValue: _width,
								onChange: (newValue) =>
									handleOnChangeAttributes(
										'publisherWidth',
										newValue,
										'',
										(
											attributes: Object,
											setAttributes: (
												attributes: Object
											) => void
										): void =>
											setAttributes({
												...attributes,
												width: convertToPercent(
													newValue
												),
											})
									),
							}}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(publisherHeight) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'height'),
							value: height,
						}}
					>
						<InputControl
							controlName="input"
							label={__('Height', 'publisher-core')}
							columns="columns-2"
							{...{
								...props,
								unitType: 'essential',
								min: 0,
								defaultValue: _height,
								onChange: (newValue) =>
									handleOnChangeAttributes(
										'publisherHeight',
										newValue,
										'',
										(
											attributes: Object,
											setAttributes: (
												attributes: Object
											) => void
										): void =>
											setAttributes({
												...attributes,
												height: convertToPercent(
													newValue
												),
											})
									),
							}}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(publisherOverflow) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'overflow'),
							value: overflow,
						}}
					>
						<ToggleSelectControl
							controlName="toggle-select"
							label={__('Overflow', 'publisher-core')}
							columns="columns-2"
							isDeselectable={true}
							options={[
								{
									label: __(
										'Visible Overflow',
										'publisher-core'
									),
									value: 'visible',
									icon: <OverflowVisibleIcon />,
								},
								{
									label: __(
										'Hidden Overflow',
										'publisher-core'
									),
									value: 'hidden',
									icon: <OverflowHiddenIcon />,
								},
								{
									label: __(
										'Scroll Overflow',
										'publisher-core'
									),
									value: 'scroll',
									icon: <OverflowScrollIcon />,
								},
							]}
							//
							defaultValue={_overflow || ''}
							onChange={(newValue) =>
								handleOnChangeAttributes(
									'publisherOverflow',
									newValue
								)
							}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(publisherRatio) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'ratio'),
							value: ratio,
						}}
					>
						<BaseControl
							columns="columns-2"
							controlName="toggle-select"
							label={__('Ratio', 'publisher-core')}
						>
							<SelectControl
								controlName="select"
								aria-label={__('Ratio', 'publisher-core')}
								{...{
									...props,
									options: [
										{
											label: __('Auto', 'publisher-core'),
											value: 'none',
										},
										{
											label: __(
												'Square 1:1',
												'publisher-core'
											),
											value: '1 / 1',
										},
										{
											label: __(
												'Standard 4:3',
												'publisher-core'
											),
											value: '4 / 3',
										},
										{
											label: __(
												'Portrait 3:4',
												'publisher-core'
											),
											value: '3 / 4',
										},
										{
											label: __(
												'Landscape 3:2',
												'publisher-core'
											),
											value: '3 / 2',
										},
										{
											label: __(
												'Classic Portrait 2:3',
												'publisher-core'
											),
											value: '2 / 3',
										},
										{
											label: __(
												'Widescreen 16:9',
												'publisher-core'
											),
											value: '16 / 9',
										},
										{
											label: __(
												'Tall 9:16',
												'publisher-core'
											),
											value: '9 / 16',
										},
										{
											label: __(
												'Custom',
												'publisher-core'
											),
											value: 'custom',
										},
									], //
									type: 'native',
									defaultValue: 'none',
									onChange: (newValue) =>
										handleOnChangeAttributes(
											'publisherRatio',
											newValue
										),
								}}
							/>
							{ratio === 'custom' && (
								<Flex alignItems="flex-start">
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'custom-ratio-width'
											),
											value: customRatio.width,
										}}
									>
										<BaseControl
											controlName="input"
											columns="columns-1"
											className="control-first label-center small-gap"
											label={__(
												'Width',
												'publisher-core'
											)}
										>
											<InputControl
												{...{
													...props,
													//	min: 0,
													//	max: 200,
													defaultValue:
														customRatio.width || '',
													onChange: (newValue) =>
														handleOnChangeAttributes(
															'publisherCustomRatio',
															{
																...customRatio,
																width: newValue,
															}
														),
												}}
											/>
										</BaseControl>
									</ControlContextProvider>
									<p
										style={{
											fontSize: '14px',
											fontWeight: '500',
											lineHeight: '30px',
										}}
									>
										:
									</p>
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'custom-ratio-height'
											),
											value: customRatio.height,
										}}
									>
										<BaseControl
											controlName="input"
											columns="columns-1"
											className="control-first label-center small-gap"
											label={__(
												'Height',
												'publisher-core'
											)}
										>
											<InputControl
												{...{
													...props,
													//		min: 0,
													//	max: 200,
													defaultValue:
														customRatio.height ||
														'',
													onChange: (newValue) =>
														handleOnChangeAttributes(
															'publisherCustomRatio',
															{
																...customRatio,
																height: newValue,
															}
														),
												}}
											/>
										</BaseControl>
									</ControlContextProvider>
								</Flex>
							)}
						</BaseControl>
					</ControlContextProvider>
				)}
			</>
		);
	},
	hasSameProps
);
