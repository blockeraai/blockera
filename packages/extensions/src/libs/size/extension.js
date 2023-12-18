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
import { isString } from '@publisher/utils';
import { extensionInnerClassNames } from '@publisher/classnames';

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

		const isHeightColumnActive = () => {
			return publisherHeight || publisherMinHeight || publisherMaxHeight;
		};

		const isWidthColumnActive = () => {
			return publisherWidth || publisherMinWidth || publisherMaxWidth;
		};

		const activeFieldLength = () => {
			const sizeFields = [];
			for (const key in config.sizeConfig) {
				if (
					(key.includes('Width') || key.includes('Height')) &&
					config.sizeConfig[key]
				) {
					sizeFields.push(key);
				}
			}
			return sizeFields.length;
		};

		const isHeightActive = isHeightColumnActive();
		const isWidthActive = isWidthColumnActive();
		const lengthOfActiveFields = activeFieldLength();

		return (
			<>
				<BaseControl
					columns="columns-1"
					className={`${extensionInnerClassNames('size-input')} ${
						isHeightActive &&
						isWidthActive &&
						lengthOfActiveFields > 2
							? ''
							: 'one-column'
					}`}
				>
					<Flex
						direction={lengthOfActiveFields <= 2 ? 'column' : 'row'}
						gap={isHeightActive && isWidthActive ? '10px' : '0px'}
					>
						<Flex
							gap="10px"
							direction="column"
							style={{
								width:
									isHeightActive &&
									isWidthActive &&
									lengthOfActiveFields > 2 &&
									'119px',
							}}
						>
							{isActiveField(publisherWidth) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'width'
										),
										value: width,
										attribute: 'publisherWidth',
										blockName: block.blockName,
									}}
								>
									<InputControl
										controlName="input"
										label={__('Width', 'publisher-core')}
										columns={
											isHeightActive &&
											lengthOfActiveFields > 2
												? '1.1fr 1.9fr'
												: 'columns-2'
										}
										placeholder="0"
										unitType="width"
										min={0}
										defaultValue={_width}
										size={
											isHeightActive &&
											lengthOfActiveFields > 2
												? 'small'
												: 'normal'
										}
										onChange={(newValue) => {
											const toWPCompatible =
												isString(newValue) &&
												!newValue.endsWith('func')
													? {
															width: convertToPercent(
																newValue
															),
													  }
													: {};

											handleOnChangeAttributes(
												'publisherWidth',
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
							)}

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
										label={__('Min W', 'publisher-core')}
										columns={
											isHeightActive &&
											lengthOfActiveFields > 2
												? '1.1fr 1.9fr'
												: 'columns-2'
										}
										placeholder="0"
										unitType="min-width"
										min={0}
										size={
											isHeightActive &&
											lengthOfActiveFields > 2
												? 'small'
												: 'normal'
										}
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
										label={__('Max W', 'publisher-core')}
										columns={
											isHeightActive &&
											lengthOfActiveFields > 2
												? '1.1fr 1.9fr'
												: 'columns-2'
										}
										placeholder="0"
										unitType="max-width"
										min={0}
										size={
											isHeightActive &&
											lengthOfActiveFields > 2
												? 'small'
												: 'normal'
										}
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

						<Flex
							gap="10px"
							direction="column"
							style={{
								width:
									isHeightActive &&
									isWidthActive &&
									lengthOfActiveFields > 2 &&
									'119px',
							}}
						>
							{isActiveField(publisherHeight) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'height'
										),
										value: height,
										attribute: 'publisherHeight',
										blockName: block.blockName,
									}}
								>
									<InputControl
										controlName="input"
										label={__('Height', 'publisher-core')}
										columns={
											isWidthActive &&
											lengthOfActiveFields > 2
												? '1.1fr 1.9fr'
												: 'columns-2'
										}
										placeholder="0"
										unitType="height"
										min={0}
										defaultValue={_height}
										size={
											isWidthActive &&
											lengthOfActiveFields > 2
												? 'small'
												: 'normal'
										}
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
							)}

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
										label={__('Min H', 'publisher-core')}
										columns={
											isWidthActive &&
											lengthOfActiveFields > 2
												? '1.1fr 1.9fr'
												: 'columns-2'
										}
										placeholder="0"
										unitType="min-height"
										min={0}
										size={
											isWidthActive &&
											lengthOfActiveFields > 2
												? 'small'
												: 'normal'
										}
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
										label={__('Max H', 'publisher-core')}
										columns={
											isWidthActive &&
											lengthOfActiveFields > 2
												? '1.1fr 1.9fr'
												: 'columns-2'
										}
										placeholder="0"
										unitType="max-height"
										min={0}
										size={
											isWidthActive &&
											lengthOfActiveFields > 2
												? 'small'
												: 'normal'
										}
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
					</Flex>
				</BaseControl>

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
						>
							<SelectControl
								id="value"
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
