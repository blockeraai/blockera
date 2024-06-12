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
	ConditionalWrapper,
	Flex,
	PanelBodyControl,
	ControlContextProvider,
	InputControl,
	ToggleSelectControl,
	BaseControl,
} from '@blockera/controls';
import { hasSameProps } from '@blockera/utils';
import { extensionClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { generateExtensionId } from '../utils';
import { EditorFeatureWrapper } from '../../../';
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
		extensionConfig,
		handleOnChangeAttributes,
		values,
		attributes,
		extensionProps,
		setSettings,
	}: TSizeProps): MixedElement => {
		const isShowWidth = isShowField(
			extensionConfig.blockeraWidth,
			values?.blockeraWidth,
			attributes.blockeraWidth.default
		);
		const isShowMinWidth = isShowField(
			extensionConfig.blockeraMinWidth,
			values?.blockeraMinWidth,
			attributes?.blockeraMinWidth?.default
		);
		const isShowMaxWidth = isShowField(
			extensionConfig.blockeraMaxWidth,
			values?.blockeraMaxWidth,
			attributes?.blockeraMaxWidth?.default
		);
		const isShowHeight = isShowField(
			extensionConfig.blockeraHeight,
			values?.blockeraHeight,
			attributes?.blockeraHeight?.default
		);
		const isShowMinHeight = isShowField(
			extensionConfig.blockeraMinHeight,
			values?.blockeraMinHeight,
			attributes?.blockeraMinHeight?.default
		);
		const isShowMaxHeight = isShowField(
			extensionConfig.blockeraMaxHeight,
			values?.blockeraMaxHeight,
			attributes?.blockeraMaxHeight?.default
		);
		const isShowOverflow = isShowField(
			extensionConfig.blockeraOverflow,
			values?.blockeraOverflow,
			attributes?.blockeraOverflow?.default
		);
		const isShowRatio = isShowField(
			extensionConfig.blockeraRatio,
			values?.blockeraRatio,
			attributes?.blockeraRatio?.default
		);
		const isShowFit = isShowField(
			extensionConfig.blockeraFit,
			values?.blockeraFit,
			attributes?.blockeraFit?.default
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
				title={__('Size', 'blockera')}
				initialOpen={true}
				icon={<SizeExtensionIcon />}
				className={extensionClassNames('size')}
			>
				<ExtensionSettings
					buttonLabel={__('More Size Settings', 'blockera')}
					features={extensionConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'sizeConfig');
					}}
				/>

				{(isShowWidth || isShowMinWidth || isShowMaxWidth) && (
					<BaseControl columns="columns-1">
						<EditorFeatureWrapper
							isActive={isShowWidth}
							config={extensionConfig.blockeraWidth}
						>
							<ControlContextProvider
								value={{
									name: generateExtensionId(block, 'width'),
									value: values?.blockeraWidth,
									attribute: 'blockeraWidth',
									blockName: block.blockName,
								}}
							>
								<InputControl
									label={__('Width', 'blockera')}
									labelDescription={
										<>
											<p>
												{__(
													'Provides the ability to define the horizontal space of the block, crucial for layout precision and design consistency.',
													'blockera'
												)}
											</p>
											<p>
												{__(
													'Ideal for responsive design, it ensures block adapt smoothly to different screen sizes, enhancing user experience and interface scalability.',
													'blockera'
												)}
											</p>
										</>
									}
									aria-label={__('Input Width', 'blockera')}
									columns="columns-2"
									placeholder="Auto"
									unitType="width"
									min={0}
									defaultValue={
										attributes.blockeraWidth.default
									}
									onChange={(newValue, ref) => {
										handleOnChangeAttributes(
											'blockeraWidth',
											newValue,
											{ ref }
										);
									}}
									controlAddonTypes={['variable']}
									variableTypes={['width-size']}
									{...extensionProps.blockeraWidth}
								/>
							</ControlContextProvider>
						</EditorFeatureWrapper>

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
										label={__('Width', 'blockera')}
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
								<EditorFeatureWrapper
									isActive={isShowMinWidth}
									config={extensionConfig.blockeraMinWidth}
								>
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'minWidth'
											),
											value: values.blockeraMinWidth,
											attribute: 'blockeraMinWidth',
											blockName: block.blockName,
										}}
									>
										<InputControl
											label={__('Min', 'blockera')}
											labelPopoverTitle={__(
												'Min Width',
												'blockera'
											)}
											labelDescription={
												<>
													<p>
														{__(
															"Min-Width ensures block don't shrink below a set value, crucial for maintaining content integrity and layout consistency on smaller screens.",
															'blockera'
														)}
													</p>
													<p>
														{__(
															'Ideal for preventing layout breakage on mobile devices, this feature helps in creating responsive designs that adapt while retaining legibility and structure.',
															'blockera'
														)}
													</p>
												</>
											}
											aria-label={__(
												'Min Width',
												'blockera'
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
											placeholder="Auto"
											unitType="min-width"
											min={0}
											size="small"
											defaultValue={
												attributes.blockeraMinWidth
													.default
											}
											onChange={(newValue, ref) =>
												handleOnChangeAttributes(
													'blockeraMinWidth',
													newValue,
													{ ref }
												)
											}
											controlAddonTypes={['variable']}
											variableTypes={['width-size']}
											{...extensionProps.blockeraMinWidth}
										/>
									</ControlContextProvider>
								</EditorFeatureWrapper>

								<EditorFeatureWrapper
									isActive={isShowMaxWidth}
									config={extensionConfig.blockeraMaxWidth}
								>
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'maxWidth'
											),
											value: values.blockeraMaxWidth,
											attribute: 'blockeraMaxWidth',
											blockName: block.blockName,
										}}
									>
										<InputControl
											label={__('Max', 'blockera')}
											labelPopoverTitle={__(
												'Max Width',
												'blockera'
											)}
											labelDescription={
												<>
													<p>
														{__(
															'Max-Width restricts the maximum width of block, ensuring it doesn’t exceed a specified width, crucial for maintaining design coherence.',
															'blockera'
														)}
													</p>
													<p>
														{__(
															'This feature is essential in responsive design, preventing block from stretching too wide on larger screens, thus preserving readability and layout aesthetics.',
															'blockera'
														)}
													</p>
												</>
											}
											aria-label={__(
												'Max Width',
												'blockera'
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
											placeholder="Auto"
											unitType="max-width"
											min={0}
											size="small"
											defaultValue={
												attributes.blockeraMaxWidth
													.default
											}
											onChange={(newValue, ref) =>
												handleOnChangeAttributes(
													'blockeraMaxWidth',
													newValue,
													{ ref }
												)
											}
											controlAddonTypes={['variable']}
											variableTypes={['width-size']}
											{...extensionProps.blockeraMaxWidth}
										/>
									</ControlContextProvider>
								</EditorFeatureWrapper>
							</ConditionalWrapper>
						)}
					</BaseControl>
				)}

				{(isShowHeight || isShowMinHeight || isShowMaxHeight) && (
					<BaseControl columns="columns-1">
						<EditorFeatureWrapper
							isActive={isShowHeight}
							config={extensionConfig.blockeraHeight}
						>
							<ControlContextProvider
								value={{
									name: generateExtensionId(block, 'height'),
									value: values.blockeraHeight,
									attribute: 'blockeraHeight',
									blockName: block.blockName,
								}}
							>
								<InputControl
									label={__('Height', 'blockera')}
									labelDescription={
										<>
											<p>
												{__(
													'Provides the ability to define the vertical space of the block, crucial for layout precision and design consistency.',
													'blockera'
												)}
											</p>
											<p>
												{__(
													'This feature is key for achieving uniformity and balance in your layout, especially useful for aligning blocks vertically and creating cohesive visual structures.',
													'blockera'
												)}
											</p>
										</>
									}
									columns="columns-2"
									placeholder="Auto"
									unitType="height"
									min={0}
									defaultValue={
										attributes.blockeraHeight.default
									}
									onChange={(newValue, ref) => {
										handleOnChangeAttributes(
											'blockeraHeight',
											newValue,
											{ ref }
										);
									}}
									controlAddonTypes={['variable']}
									variableTypes={['width-size']}
									{...extensionProps.blockeraHeight}
								/>
							</ControlContextProvider>
						</EditorFeatureWrapper>

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
										label={__('Height', 'blockera')}
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
								<EditorFeatureWrapper
									isActive={isShowMinHeight}
									config={extensionConfig.blockeraMinHeight}
								>
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'minHeight'
											),
											value: values.blockeraMinHeight,
											attribute: 'blockeraMinHeight',
											blockName: block.blockName,
										}}
									>
										<InputControl
											defaultValue={
												attributes.blockeraMinHeight
													.default
											}
											label={__('Min', 'blockera')}
											labelPopoverTitle={__(
												'Min Height',
												'blockera'
											)}
											labelDescription={
												<>
													<p>
														{__(
															"Min-Height ensures block don't shrink below a set value, crucial for maintaining content integrity and layout consistency on smaller screens.",
															'blockera'
														)}
													</p>
													<p>
														{__(
															'Ideal for preventing layout breakage on mobile devices, this feature helps in creating responsive designs that adapt while retaining legibility and structure.',
															'blockera'
														)}
													</p>
												</>
											}
											aria-label={__(
												'Min Height',
												'blockera'
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
											placeholder="Auto"
											unitType="min-height"
											min={0}
											size="small"
											onChange={(newValue, ref) =>
												handleOnChangeAttributes(
													'blockeraMinHeight',
													newValue,
													{ ref }
												)
											}
											controlAddonTypes={['variable']}
											variableTypes={['width-size']}
											{...extensionProps.blockeraMinHeight}
										/>
									</ControlContextProvider>
								</EditorFeatureWrapper>

								<EditorFeatureWrapper
									isActive={isShowMaxHeight}
									config={extensionConfig.blockeraMaxHeight}
								>
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'maxHeight'
											),
											value: values.blockeraMaxHeight,
											attribute: 'blockeraMaxHeight',
											blockName: block.blockName,
										}}
									>
										<InputControl
											label={__('Max', 'blockera')}
											labelPopoverTitle={__(
												'Max Height',
												'blockera'
											)}
											labelDescription={
												<>
													<p>
														{__(
															'Max-height restricts the maximum height of block, ensuring it doesn’t exceed a specified height, crucial for maintaining design coherence.',
															'blockera'
														)}
													</p>
													<p>
														{__(
															'This feature is essential in responsive design, preventing block from stretching too taller on larger screens, thus preserving readability and layout aesthetics.',
															'blockera'
														)}
													</p>
												</>
											}
											aria-label={__(
												'Max Height',
												'blockera'
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
											placeholder="Auto"
											unitType="max-height"
											min={0}
											size="small"
											defaultValue={
												attributes.blockeraMaxHeight
													.default
											}
											onChange={(newValue, ref) =>
												handleOnChangeAttributes(
													'blockeraMaxHeight',
													newValue,
													{ ref }
												)
											}
											controlAddonTypes={['variable']}
											variableTypes={['width-size']}
											{...extensionProps.blockeraMaxHeight}
										/>
									</ControlContextProvider>
								</EditorFeatureWrapper>
							</ConditionalWrapper>
						)}
					</BaseControl>
				)}

				<EditorFeatureWrapper
					isActive={isShowOverflow}
					config={extensionConfig.blockeraOverflow}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'overflow'),
							value: values.blockeraOverflow,
							attribute: 'blockeraOverflow',
							blockName: block.blockName,
						}}
					>
						<ToggleSelectControl
							label={__('Overflow', 'blockera')}
							labelDescription={
								<>
									<p>
										{__(
											"Overflow manages how content is displayed when it exceeds its block's boundaries, offering options like scroll or hidden to maintain layout integrity.",
											'blockera'
										)}
									</p>
									<h3>
										<OverflowVisibleIcon />
										{__('Visible', 'blockera')}
									</h3>
									<p>
										{__(
											'Visible ensures that any content exceeding the boundaries of its container is still visible, extending beyond the set dimensions.',
											'blockera'
										)}
									</p>
									<h3>
										<OverflowHiddenIcon />
										{__('Hidden', 'blockera')}
									</h3>
									<p>
										{__(
											'Hidden effectively clips any content that exceeds the boundaries of its container, ensuring a clean, uncluttered appearance for your layout.',
											'blockera'
										)}
									</p>
									<h3>
										<OverflowScrollIcon />
										{__('Scroll', 'blockera')}
									</h3>
									<p>
										{__(
											'Scroll ensures that any excess content within the block is accessible via scrollbars, ideal for maintaining a fixed size for content areas.',
											'blockera'
										)}
									</p>
								</>
							}
							columns="columns-2"
							isDeselectable={true}
							options={[
								{
									label: __('Visible Overflow', 'blockera'),
									value: 'visible',
									icon: <OverflowVisibleIcon />,
								},
								{
									label: __('Hidden Overflow', 'blockera'),
									value: 'hidden',
									icon: <OverflowHiddenIcon />,
								},
								{
									label: __('Scroll Overflow', 'blockera'),
									value: 'scroll',
									icon: <OverflowScrollIcon />,
								},
							]}
							defaultValue={attributes.blockeraOverflow.default}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'blockeraOverflow',
									newValue,
									{ ref }
								)
							}
							{...extensionProps.blockeraOverflow}
						/>
					</ControlContextProvider>
				</EditorFeatureWrapper>

				<EditorFeatureWrapper
					isActive={isShowRatio}
					config={extensionConfig.blockeraRatio}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'ratio'),
							value: values.blockeraRatio,
							type: 'nested',
							attribute: 'blockeraRatio',
							blockName: block.blockName,
						}}
					>
						<AspectRatio
							block={block}
							ratio={values.blockeraRatio}
							defaultValue={attributes.blockeraRatio.default}
							handleOnChangeAttributes={handleOnChangeAttributes}
							{...extensionProps.blockeraRatio}
						/>
					</ControlContextProvider>
				</EditorFeatureWrapper>

				<EditorFeatureWrapper
					isActive={isShowFit}
					config={extensionConfig.blockeraFit}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'fit'),
							value: values.blockeraFit,
							attribute: 'blockeraFit',
							blockName: block.blockName,
						}}
					>
						<ObjectFit
							block={block}
							defaultValue={attributes.blockeraFit.default}
							fitPosition={values.blockeraFitPosition}
							fitPositionDefaultValue={
								attributes.blockeraFitPosition.default
							}
							fitPositionProps={
								extensionProps.blockeraFitPosition
							}
							handleOnChangeAttributes={handleOnChangeAttributes}
							{...extensionProps.blockeraFit}
						/>
					</ControlContextProvider>
				</EditorFeatureWrapper>
			</PanelBodyControl>
		);
	},
	hasSameProps
);
