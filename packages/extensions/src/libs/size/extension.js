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
	convertAlignmentMatrixCoordinates,
	PositionButtonControl,
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
				publisherFit,
			},
		} = config;

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
											{ ...ratio, value: newValue }
										),
								}}
							/>
							{ratio.value === 'custom' && (
								<Flex alignItems="flex-start">
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'custom-ratio-width'
											),
											value: ratio.width,
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
												style={{ margin: '0px' }}
												{...{
													...props,
													type: 'number',
													min: 0,
													defaultValue:
														ratio.width || '',

													onChange: (newValue) =>
														handleOnChangeAttributes(
															'publisherRatio',
															{
																...ratio,
																width: newValue,
															}
														),
												}}
											/>
										</BaseControl>
									</ControlContextProvider>

									<p className="publisher-colon">:</p>

									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'custom-ratio-height'
											),
											value: ratio.height,
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
												style={{ margin: '0px' }}
												{...{
													...props,
													min: 0,
													type: 'number',
													defaultValue:
														ratio.height || '',
													onChange: (newValue) =>
														handleOnChangeAttributes(
															'publisherRatio',
															{
																...ratio,
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

				{isActiveField(publisherFit) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'fit'),
							value: fit,
						}}
					>
						<BaseControl
							label={__('Fit', 'publisher-core')}
							columns="columns-2"
							className={'publisher-object-fit'}
						>
							<SelectControl
								controlName="select"
								columns="columns-1"
								{...{
									...props,
									options: [
										{
											label: __('Auto', 'publisher-core'),
											value: '',
										},
										{
											label: __('Fill', 'publisher-core'),
											value: 'fill',
										},
										{
											label: __(
												'Contain',
												'publisher-core'
											),
											value: 'contain',
										},
										{
											label: __(
												'Cover',
												'publisher-core'
											),
											value: 'cover',
										},
										{
											label: __('None', 'publisher-core'),
											value: 'none',
										},
										{
											label: __(
												'Scale Down',
												'publisher-core'
											),
											value: 'scale-down',
										},
									], //
									type: 'native',
									defaultValue: '',
									onChange: (newValue) =>
										handleOnChangeAttributes(
											'publisherFit',
											newValue
										),
								}}
							/>
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										block,
										'fit-position'
									),
									value: {
										...fitPosition,
										coordinates:
											convertAlignmentMatrixCoordinates(
												fitPosition
											)?.compact,
									},
								}}
							>
								<PositionButtonControl
									label={__('Fit Position', 'publisher-core')}
									popoverLabel={__(
										'Setting',
										'publisher-core'
									)}
									alignmentMatrixLabel={__(
										'Position',
										'publisher-core'
									)}
									size="small"
									defaultValue={{ top: '', left: '' }}
									onChange={({ top, left }) => {
										handleOnChangeAttributes(
											'publisherFitPosition',
											{
												...fitPosition,
												top,
												left,
											}
										);
									}}
								/>
							</ControlContextProvider>
						</BaseControl>
					</ControlContextProvider>
				)}
			</>
		);
	},
	hasSameProps
);
