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
	BaseControl,
} from '@publisher/controls';
import { Flex } from '@publisher/components';
import { componentClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { generateExtensionId, hasSameProps } from '../utils';
import type { TSizeProps } from './types/size-props';
import { default as OverflowHiddenIcon } from './icons/overflow-hidden';
import { default as OverflowVisibleIcon } from './icons/overflow-visible';
import { default as OverflowScrollIcon } from './icons/overflow-scroll';
import { useBlockContext } from '../../hooks';
import { ObjectFit } from './components';
import AspectRatio from './components/aspect-ratio';
import { coreWPAspectRatioValues, coreWPFitValues } from './utils';
import { SizeExtensionIcon } from './index';

export const SizeExtension: ComponentType<TSizeProps> = memo(
	({
		block,
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
		handleOnChangeAttributes,
		values,
		inheritValue,
		extensionProps,
	}: TSizeProps): MixedElement => {
		const { isNormalState } = useBlockContext();

		return (
			<PanelBodyControl
				title={__('Size', 'publisher-core')}
				initialOpen={true}
				icon={<SizeExtensionIcon />}
				className={componentClassNames('extension', 'extension-size')}
			>
				{isActiveField(publisherWidth) && (
					<BaseControl columns="columns-1">
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'width'),
								value: isNormalState()
									? values.width || inheritValue.width
									: values.width,
								attribute: 'publisherWidth',
								blockName: block.blockName,
							}}
						>
							<InputControl
								controlName="input"
								label={__('Width', 'publisher-core')}
								labelDescription={
									<>
										<p>
											{__(
												'Provides the ability to define the horizontal space of the block, crucial for layout precision and design consistency.',
												'publisher-core'
											)}
										</p>
										<p>
											{__(
												'Ideal for responsive design, it ensures block adapt smoothly to different screen sizes, enhancing user experience and interface scalability.',
												'publisher-core'
											)}
										</p>
									</>
								}
								columns="columns-2"
								placeholder="0"
								unitType="width"
								min={0}
								defaultValue=""
								onChange={(newValue, ref) => {
									handleOnChangeAttributes(
										'publisherWidth',
										newValue,
										{ ref }
									);
								}}
								controlAddonTypes={['variable']}
								variableTypes={['width-size']}
								{...extensionProps.publisherWidth}
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
											value: values.minWidth,
											attribute: 'publisherMinWidth',
											blockName: block.blockName,
										}}
									>
										<InputControl
											controlName="input"
											label={__('Min', 'publisher-core')}
											labelPopoverTitle={__(
												'Min Width',
												'publisher-core'
											)}
											labelDescription={
												<>
													<p>
														{__(
															"Min-Width ensures block don't shrink below a set value, crucial for maintaining content integrity and layout consistency on smaller screens.",
															'publisher-core'
														)}
													</p>
													<p>
														{__(
															'Ideal for preventing layout breakage on mobile devices, this feature helps in creating responsive designs that adapt while retaining legibility and structure.',
															'publisher-core'
														)}
													</p>
												</>
											}
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
											onChange={(newValue, ref) =>
												handleOnChangeAttributes(
													'publisherMinWidth',
													newValue,
													{
														ref,
													}
												)
											}
											controlAddonTypes={['variable']}
											variableTypes={['width-size']}
											{...extensionProps.publisherMinWidth}
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
											value: values.maxWidth,
											attribute: 'publisherMaxWidth',
											blockName: block.blockName,
										}}
									>
										<InputControl
											controlName="input"
											label={__('Max', 'publisher-core')}
											labelPopoverTitle={__(
												'Max Width',
												'publisher-core'
											)}
											labelDescription={
												<>
													<p>
														{__(
															'Max-Width restricts the maximum width of block, ensuring it doesn’t exceed a specified width, crucial for maintaining design coherence.',
															'publisher-core'
														)}
													</p>
													<p>
														{__(
															'This feature is essential in responsive design, preventing block from stretching too wide on larger screens, thus preserving readability and layout aesthetics.',
															'publisher-core'
														)}
													</p>
												</>
											}
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
											onChange={(newValue, ref) =>
												handleOnChangeAttributes(
													'publisherMaxWidth',
													newValue,
													{ ref }
												)
											}
											controlAddonTypes={['variable']}
											variableTypes={['width-size']}
											{...extensionProps.publisherMaxWidth}
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
								value: isNormalState()
									? values.height || inheritValue.height
									: values.height,
								attribute: 'publisherHeight',
								blockName: block.blockName,
							}}
						>
							<InputControl
								controlName="input"
								label={__('Height', 'publisher-core')}
								labelDescription={
									<>
										<p>
											{__(
												'Provides the ability to define the vertical space of the block, crucial for layout precision and design consistency.',
												'publisher-core'
											)}
										</p>
										<p>
											{__(
												'This feature is key for achieving uniformity and balance in your layout, especially useful for aligning blocks vertically and creating cohesive visual structures.',
												'publisher-core'
											)}
										</p>
									</>
								}
								columns="columns-2"
								placeholder="0"
								unitType="height"
								min={0}
								defaultValue=""
								onChange={(newValue, ref) => {
									handleOnChangeAttributes(
										'publisherHeight',
										newValue,
										{ ref }
									);
								}}
								controlAddonTypes={['variable']}
								variableTypes={['width-size']}
								{...extensionProps.publisherHeight}
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
											value: (() => {
												if (isNormalState()) {
													if (values.minHeight)
														return values.minHeight;
													else if (
														inheritValue.minHeight
													) {
														return inheritValue.minHeightUnit
															? inheritValue.minHeight +
																	inheritValue.minHeightUnit
															: inheritValue.minHeight;
													}
												}

												return values.minHeight;
											})(),
											attribute: 'publisherMinHeight',
											blockName: block.blockName,
										}}
									>
										<InputControl
											defaultValue=""
											label={__('Min', 'publisher-core')}
											labelPopoverTitle={__(
												'Min Height',
												'publisher-core'
											)}
											labelDescription={
												<>
													<p>
														{__(
															"Min-Height ensures block don't shrink below a set value, crucial for maintaining content integrity and layout consistency on smaller screens.",
															'publisher-core'
														)}
													</p>
													<p>
														{__(
															'Ideal for preventing layout breakage on mobile devices, this feature helps in creating responsive designs that adapt while retaining legibility and structure.',
															'publisher-core'
														)}
													</p>
												</>
											}
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
											onChange={(newValue, ref) =>
												handleOnChangeAttributes(
													'publisherMinHeight',
													newValue,
													{ ref }
												)
											}
											controlAddonTypes={['variable']}
											variableTypes={['width-size']}
											{...extensionProps.publisherMinHeight}
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
											value: values.maxHeight,
											attribute: 'publisherMaxHeight',
											blockName: block.blockName,
										}}
									>
										<InputControl
											controlName="input"
											label={__('Max', 'publisher-core')}
											labelPopoverTitle={__(
												'Max Height',
												'publisher-core'
											)}
											labelDescription={
												<>
													<p>
														{__(
															'Max-height restricts the maximum height of block, ensuring it doesn’t exceed a specified height, crucial for maintaining design coherence.',
															'publisher-core'
														)}
													</p>
													<p>
														{__(
															'This feature is essential in responsive design, preventing block from stretching too taller on larger screens, thus preserving readability and layout aesthetics.',
															'publisher-core'
														)}
													</p>
												</>
											}
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
											onChange={(newValue, ref) =>
												handleOnChangeAttributes(
													'publisherMaxHeight',
													newValue,
													{ ref }
												)
											}
											controlAddonTypes={['variable']}
											variableTypes={['width-size']}
											{...extensionProps.publisherMaxHeight}
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
							value: values.overflow,
							attribute: 'publisherOverflow',
							blockName: block.blockName,
						}}
					>
						<ToggleSelectControl
							controlName="toggle-select"
							label={__('Overflow', 'publisher-core')}
							labelDescription={
								<>
									<p>
										{__(
											"Overflow manages how content is displayed when it exceeds its block's boundaries, offering options like scroll or hidden to maintain layout integrity.",
											'publisher-core'
										)}
									</p>
									<h3>
										<OverflowVisibleIcon />
										{__('Visible', 'publisher-core')}
									</h3>
									<p>
										{__(
											'Visible ensures that any content exceeding the boundaries of its container is still visible, extending beyond the set dimensions.',
											'publisher-core'
										)}
									</p>
									<h3>
										<OverflowHiddenIcon />
										{__('Hidden', 'publisher-core')}
									</h3>
									<p>
										{__(
											'Hidden effectively clips any content that exceeds the boundaries of its container, ensuring a clean, uncluttered appearance for your layout.',
											'publisher-core'
										)}
									</p>
									<h3>
										<OverflowScrollIcon />
										{__('Scroll', 'publisher-core')}
									</h3>
									<p>
										{__(
											'Scroll ensures that any excess content within the block is accessible via scrollbars, ideal for maintaining a fixed size for content areas.',
											'publisher-core'
										)}
									</p>
								</>
							}
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
							defaultValue=""
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'publisherOverflow',
									newValue,
									{ ref }
								)
							}
							{...extensionProps.publisherOverflow}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(publisherRatio) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'ratio'),
							value: (() => {
								if (isNormalState()) {
									if (values.ratio?.value) {
										return values.ratio;
									} else if (
										inheritValue.aspectRatio &&
										coreWPAspectRatioValues.indexOf(
											inheritValue.aspectRatio
										) !== -1
									) {
										return {
											value: inheritValue.aspectRatio,
											width: '',
											height: '',
										};
									}
								}

								return values.ratio;
							})(),
							type: 'nested',
							attribute: 'publisherRatio',
							blockName: block.blockName,
						}}
					>
						<AspectRatio
							block={block}
							ratio={values.ratio}
							handleOnChangeAttributes={handleOnChangeAttributes}
							{...extensionProps.publisherRatio}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(publisherFit) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'fit'),
							value: (() => {
								if (isNormalState()) {
									if (values.fit) {
										return values.fit;
									} else if (
										inheritValue.scale &&
										coreWPFitValues.indexOf(
											inheritValue.scale
										) !== -1
									) {
										return inheritValue.scale;
									}
								}

								return values.fit;
							})(),
							attribute: 'publisherFit',
							blockName: block.blockName,
						}}
					>
						<ObjectFit
							block={block}
							fitPosition={values.fitPosition}
							handleOnChangeAttributes={handleOnChangeAttributes}
							{...extensionProps.publisherFit}
						/>
					</ControlContextProvider>
				)}
			</PanelBodyControl>
		);
	},
	hasSameProps
);
