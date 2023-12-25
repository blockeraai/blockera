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
	BaseControl,
	SelectControl,
	convertAlignmentMatrixCoordinates,
	PositionButtonControl,
} from '@publisher/controls';
import { Flex } from '@publisher/components';
import { isString, isUndefined } from '@publisher/utils';
import { isValid } from '@publisher/hooks';

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
import { useBlockContext } from '../../hooks';

export const SizeExtension: MixedElement = memo<TSizeProps>(
	({
		block,
		width,
		height,
		minWidth,
		minHeight,
		maxWidth,
		maxHeight,
		config,
		overflow,
		children,
		ratio,
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
				publisherMinWidth,
				publisherMinHeight,
				publisherMaxWidth,
				publisherMaxHeight,
			},
		} = config;

		const { isNormalState } = useBlockContext();

		return (
			<>
				{isActiveField(publisherWidth) && (
					<BaseControl columns="columns-1">
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'width'),
								value: width,
								attribute: 'publisherWidth',
								blockName: block.blockName,
							}}
						>
							<InputControl
								controlName="input"
								label={__('Width', 'publisher-core')}
								columns="columns-2"
								placeholder="0"
								unitType="width"
								min={0}
								defaultValue={_width}
								onChange={(newValue, ref) => {
									const toWPCompatible = (
										newValue: string
									): string | Object => {
										if (
											!isNormalState() ||
											newValue === '' ||
											isUndefined(newValue) ||
											isValid(newValue)
										) {
											return {};
										}

										return isString(newValue) &&
											!newValue.endsWith('func')
											? {
													width: newValue,
											  }
											: {};
									};
									onChange('publisherWidth', newValue, {
										ref,
										addOrModifyRootItems:
											toWPCompatible(newValue),
										deleteItemsOnResetAction: ['width'],
									});
								}}
								{...props}
								controlAddonTypes={['variable']}
								variableTypes={['width-size']}
							/>
						</ControlContextProvider>

						{(isActiveField(publisherMinWidth) ||
							isActiveField(publisherMaxWidth)) && (
							<Flex
								style={{
									width: '160px',
									alignSelf: 'flex-end',
								}}
							>
								{isActiveField(publisherMinWidth) && (
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'minWidth'
											),
											value: minWidth,
											attribute: 'publisherMinWidth',
											blockName: block.blockName,
										}}
									>
										<InputControl
											controlName="input"
											label={__('Min', 'publisher-core')}
											aria-label={__(
												'Min Width',
												'publisher-core'
											)}
											columns={
												isActiveField(publisherMaxWidth)
													? 'columns-1'
													: 'columns-2'
											}
											className={
												isActiveField(
													publisherMaxWidth
												) &&
												'control-first label-center small-gap'
											}
											placeholder="0"
											unitType="min-width"
											min={0}
											size="small"
											onChange={(newValue) =>
												handleOnChangeAttributes(
													'publisherMinWidth',
													newValue
												)
											}
											{...props}
											controlAddonTypes={['variable']}
											variableTypes={['width-size']}
										/>
									</ControlContextProvider>
								)}

								{isActiveField(publisherMaxWidth) && (
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'maxWidth'
											),
											value: maxWidth,
											attribute: 'publisherMaxWidth',
											blockName: block.blockName,
										}}
									>
										<InputControl
											controlName="input"
											label={__('Max', 'publisher-core')}
											aria-label={__(
												'Max Width',
												'publisher-core'
											)}
											columns={
												isActiveField(publisherMinWidth)
													? 'columns-1'
													: 'columns-2'
											}
											className={
												isActiveField(
													publisherMinWidth
												) &&
												'control-first label-center small-gap'
											}
											placeholder="0"
											unitType="max-width"
											min={0}
											size="small"
											onChange={(newValue) =>
												handleOnChangeAttributes(
													'publisherMaxWidth',
													newValue
												)
											}
											{...props}
											controlAddonTypes={['variable']}
											variableTypes={['width-size']}
										/>
									</ControlContextProvider>
								)}
							</Flex>
						)}
					</BaseControl>
				)}

				{isActiveField(publisherHeight) && (
					<BaseControl columns="columns-1">
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'height'),
								value: height,
								attribute: 'publisherHeight',
								blockName: block.blockName,
							}}
						>
							<InputControl
								controlName="input"
								label={__('Height', 'publisher-core')}
								columns="columns-2"
								placeholder="0"
								unitType="height"
								min={0}
								defaultValue={_height}
								onChange={(newValue) => {
									const toWPCompatible =
										isString(newValue) &&
										!newValue.endsWith('func')
											? {
													height: convertToPercent(
														newValue
													),
											  }
											: {};

									handleOnChangeAttributes(
										'publisherHeight',
										newValue,
										{
											addOrModifyRootItems:
												toWPCompatible,
										}
									);
								}}
								{...props}
								controlAddonTypes={['variable']}
								variableTypes={['width-size']}
							/>
						</ControlContextProvider>
						{(isActiveField(publisherMinHeight) ||
							isActiveField(publisherMaxHeight)) && (
							<Flex
								style={{
									width: '160px',
									alignSelf: 'flex-end',
								}}
							>
								{isActiveField(publisherMinHeight) && (
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'minHeight'
											),
											value: minHeight,
											attribute: 'publisherMinHeight',
											blockName: block.blockName,
										}}
									>
										<InputControl
											controlName="input"
											label={__('Min', 'publisher-core')}
											aria-label={__(
												'Min Height',
												'publisher-core'
											)}
											columns={
												isActiveField(
													publisherMaxHeight
												)
													? 'columns-1'
													: 'columns-2'
											}
											className={
												isActiveField(
													publisherMaxHeight
												) &&
												'control-first label-center small-gap'
											}
											placeholder="0"
											unitType="min-height"
											min={0}
											size="small"
											onChange={(newValue) =>
												handleOnChangeAttributes(
													'publisherMinHeight',
													newValue
												)
											}
											{...props}
											controlAddonTypes={['variable']}
											variableTypes={['width-size']}
										/>
									</ControlContextProvider>
								)}

								{isActiveField(publisherMaxHeight) && (
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'maxHeight'
											),
											value: maxHeight,
											attribute: 'publisherMaxHeight',
											blockName: block.blockName,
										}}
									>
										<InputControl
											controlName="input"
											label={__('Max', 'publisher-core')}
											aria-label={__(
												'Max Height',
												'publisher-core'
											)}
											columns={
												isActiveField(
													publisherMinHeight
												)
													? 'columns-1'
													: 'columns-2'
											}
											className={
												isActiveField(
													publisherMinHeight
												) &&
												'control-first label-center small-gap'
											}
											placeholder="0"
											unitType="max-height"
											min={0}
											size="small"
											onChange={(newValue) =>
												handleOnChangeAttributes(
													'publisherMaxHeight',
													newValue
												)
											}
											{...props}
											controlAddonTypes={['variable']}
											variableTypes={['width-size']}
										/>
									</ControlContextProvider>
								)}
							</Flex>
						)}
					</BaseControl>
				)}

				{isActiveField(publisherOverflow) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'overflow'),
							value: overflow,
							attribute: 'publisherOverflow',
							blockName: block.blockName,
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
							type: 'nested',
							attribute: 'publisherRatio',
							blockName: block.blockName,
						}}
					>
						<BaseControl
							columns="columns-2"
							controlName="toggle-select"
							label={__('Ratio', 'publisher-core')}
							id={'value'}
							attribute="publisherRatio"
							blockName={block.blockName}
							mode={'advanced'}
							path={'value'}
						>
							<SelectControl
								id="value"
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
									<InputControl
										id="width"
										columns="columns-1"
										className="control-first label-center small-gap"
										label={__('Width', 'publisher-core')}
										style={{ margin: '0px' }}
										type="number"
										min={0}
										defaultValue=""
										onChange={(newValue) =>
											handleOnChangeAttributes(
												'publisherRatio',
												{
													...ratio,
													width: newValue,
												}
											)
										}
										{...props}
									/>

									<p className="publisher-colon">:</p>

									<InputControl
										id="height"
										columns="columns-1"
										className="control-first label-center small-gap"
										label={__('Height', 'publisher-core')}
										style={{ margin: '0px' }}
										min={0}
										type="number"
										defaultValue=""
										onChange={(newValue) =>
											handleOnChangeAttributes(
												'publisherRatio',
												{
													...ratio,
													height: newValue,
												}
											)
										}
										{...props}
									/>
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
							attribute: 'publisherFit',
							blockName: block.blockName,
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
								{...props}
								options={[
									{
										label: __('Auto', 'publisher-core'),
										value: '',
									},
									{
										label: __('Fill', 'publisher-core'),
										value: 'fill',
									},
									{
										label: __('Contain', 'publisher-core'),
										value: 'contain',
									},
									{
										label: __('Cover', 'publisher-core'),
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
								]}
								type="native"
								defaultValue=""
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherFit',
										newValue
									)
								}
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
									attribute: 'publisherFitPosition',
									blockName: block.blockName,
								}}
							>
								<PositionButtonControl
									buttonLabel={__(
										'Fit Position',
										'publisher-core'
									)}
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
