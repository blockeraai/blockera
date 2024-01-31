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
import {
	ConditionalWrapper,
	FeatureWrapper,
	Flex,
} from '@publisher/components';
import { componentClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { generateExtensionId, hasSameProps } from '../utils';
import type { TSizeProps } from './types/size-props';
import { default as OverflowHiddenIcon } from './icons/overflow-hidden';
import { default as OverflowVisibleIcon } from './icons/overflow-visible';
import { default as OverflowScrollIcon } from './icons/overflow-scroll';
import { ObjectFit } from './components';
import AspectRatio from './components/aspect-ratio';
import { SizeExtensionIcon } from './index';
import { ExtensionSettings } from '../settings';

export const SizeExtension: ComponentType<TSizeProps> = memo(
	({
		block,
		sizeConfig,
		handleOnChangeAttributes,
		values,
		attributes,
		extensionProps,
		setSettings,
	}: TSizeProps): MixedElement => {
		const isShowWidth = isShowField(
			sizeConfig.publisherWidth,
			values?.width,
			attributes.width.default
		);
		const isShowMinWidth = isShowField(
			sizeConfig.publisherMinWidth,
			values?.minWidth,
			attributes?.minWidth?.default
		);
		const isShowMaxWidth = isShowField(
			sizeConfig.publisherMaxWidth,
			values?.maxWidth,
			attributes?.maxWidth?.default
		);
		const isShowHeight = isShowField(
			sizeConfig.publisherHeight,
			values?.height,
			attributes?.height?.default
		);
		const isShowMinHeight = isShowField(
			sizeConfig.publisherMinHeight,
			values?.minHeight,
			attributes?.minHeight?.default
		);
		const isShowMaxHeight = isShowField(
			sizeConfig.publisherMaxHeight,
			values?.maxHeight,
			attributes?.maxHeight?.default
		);
		const isShowOverflow = isShowField(
			sizeConfig.publisherOverflow,
			values?.overflow,
			attributes?.overflow?.default
		);
		const isShowRatio = isShowField(
			sizeConfig.publisherRatio,
			values?.ratio,
			attributes?.ratio?.default
		);
		const isShowFit = isShowField(
			sizeConfig.publisherFit,
			values?.fit,
			attributes?.fit?.default
		);

		// Extension is not active
		if (
			!isShowWidth &&
			!isShowMinWidth &&
			!isShowMaxWidth &&
			!isShowHeight &&
			!isShowMinHeight &&
			!isShowMaxHeight &&
			!isShowOverflow &&
			!isShowRatio &&
			!isShowFit
		) {
			return <></>;
		}

		return (
			<PanelBodyControl
				title={__('Size', 'publisher-core')}
				initialOpen={true}
				icon={<SizeExtensionIcon />}
				className={componentClassNames('extension', 'extension-size')}
			>
				<ExtensionSettings
					features={sizeConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'sizeConfig');
					}}
				/>

				{(isShowWidth || isShowMinWidth || isShowMaxWidth) && (
					<BaseControl columns="columns-1">
						<FeatureWrapper
							isActive={isShowWidth}
							isActiveOnStates={
								sizeConfig.publisherWidth.isActiveOnStates
							}
							isActiveOnBreakpoints={
								sizeConfig.publisherWidth.isActiveOnBreakpoints
							}
						>
							<ControlContextProvider
								value={{
									name: generateExtensionId(block, 'width'),
									value: values?.width,
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
									placeholder="Auto"
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
						</FeatureWrapper>

						{(isShowMinWidth || isShowMaxWidth) && (
							<ConditionalWrapper
								wrapper={(children) => (
									<Flex
										style={{
											width: '160px',
											alignSelf: 'flex-end',
										}}
									>
										{children}
									</Flex>
								)}
								elseWrapper={(children) => (
									<BaseControl
										columns="columns-2"
										label={__('Width', 'publisher-core')}
									>
										<Flex
											style={{
												width: '160px',
												alignSelf: 'flex-end',
											}}
										>
											{children}
										</Flex>
									</BaseControl>
								)}
								condition={isShowWidth}
							>
								<FeatureWrapper
									isActive={isShowMinWidth}
									isActiveOnStates={
										sizeConfig.publisherMinWidth
											.isActiveOnStates
									}
									isActiveOnBreakpoints={
										sizeConfig.publisherMinWidth
											.isActiveOnBreakpoints
									}
								>
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
												isShowMaxWidth
													? 'columns-1'
													: 'columns-2'
											}
											className={
												isShowMaxWidth &&
												'control-first label-center small-gap'
											}
											placeholder="-"
											unitType="min-width"
											min={0}
											size="small"
											onChange={(newValue, ref) =>
												handleOnChangeAttributes(
													'publisherMinWidth',
													newValue,
													{ ref }
												)
											}
											controlAddonTypes={['variable']}
											variableTypes={['width-size']}
											{...extensionProps.publisherMinWidth}
										/>
									</ControlContextProvider>
								</FeatureWrapper>

								<FeatureWrapper
									isActive={isShowMaxWidth}
									isActiveOnStates={
										sizeConfig.publisherMaxWidth
											.isActiveOnStates
									}
									isActiveOnBreakpoints={
										sizeConfig.publisherMaxWidth
											.isActiveOnBreakpoints
									}
								>
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
												isShowMinWidth
													? 'columns-1'
													: 'columns-2'
											}
											className={
												isShowMinWidth &&
												'control-first label-center small-gap'
											}
											placeholder="-"
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
								</FeatureWrapper>
							</ConditionalWrapper>
						)}
					</BaseControl>
				)}

				{(isShowHeight || isShowMinHeight || isShowMaxHeight) && (
					<BaseControl columns="columns-1">
						<FeatureWrapper
							isActive={isShowHeight}
							isActiveOnStates={
								sizeConfig.publisherHeight.isActiveOnStates
							}
							isActiveOnBreakpoints={
								sizeConfig.publisherHeight.isActiveOnBreakpoints
							}
						>
							<ControlContextProvider
								value={{
									name: generateExtensionId(block, 'height'),
									value: values.height,
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
									placeholder="Auto"
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
						</FeatureWrapper>

						{(isShowMinHeight || isShowMaxHeight) && (
							<ConditionalWrapper
								wrapper={(children) => (
									<Flex
										style={{
											width: '160px',
											alignSelf: 'flex-end',
										}}
									>
										{children}
									</Flex>
								)}
								elseWrapper={(children) => (
									<BaseControl
										columns="columns-2"
										label={__('Height', 'publisher-core')}
									>
										<Flex
											style={{
												width: '160px',
												alignSelf: 'flex-end',
											}}
										>
											{children}
										</Flex>
									</BaseControl>
								)}
								condition={isShowHeight}
							>
								<FeatureWrapper
									isActive={isShowMinHeight}
									isActiveOnStates={
										sizeConfig.publisherMinHeight
											.isActiveOnStates
									}
									isActiveOnBreakpoints={
										sizeConfig.publisherMinHeight
											.isActiveOnBreakpoints
									}
								>
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'minHeight'
											),
											value: values.minHeight,
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
												isShowMaxHeight
													? 'columns-1'
													: 'columns-2'
											}
											className={
												isShowMaxHeight &&
												'control-first label-center small-gap'
											}
											placeholder="-"
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
								</FeatureWrapper>

								<FeatureWrapper
									isActive={isShowMaxHeight}
									isActiveOnStates={
										sizeConfig.publisherMaxHeight
											.isActiveOnStates
									}
									isActiveOnBreakpoints={
										sizeConfig.publisherMaxHeight
											.isActiveOnBreakpoints
									}
								>
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
												isShowMinHeight
													? 'columns-1'
													: 'columns-2'
											}
											className={
												isShowMinHeight &&
												'control-first label-center small-gap'
											}
											placeholder="-"
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
								</FeatureWrapper>
							</ConditionalWrapper>
						)}
					</BaseControl>
				)}

				<FeatureWrapper
					isActive={isShowOverflow}
					isActiveOnStates={
						sizeConfig.publisherOverflow.isActiveOnStates
					}
					isActiveOnBreakpoints={
						sizeConfig.publisherOverflow.isActiveOnBreakpoints
					}
				>
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
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowRatio}
					isActiveOnStates={
						sizeConfig.publisherRatio.isActiveOnStates
					}
					isActiveOnBreakpoints={
						sizeConfig.publisherRatio.isActiveOnBreakpoints
					}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'ratio'),
							value: values.ratio,
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
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowFit}
					isActiveOnStates={sizeConfig.publisherFit.isActiveOnStates}
					isActiveOnBreakpoints={
						sizeConfig.publisherFit.isActiveOnBreakpoints
					}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'fit'),
							value: values.fit,
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
				</FeatureWrapper>
			</PanelBodyControl>
		);
	},
	hasSameProps
);
