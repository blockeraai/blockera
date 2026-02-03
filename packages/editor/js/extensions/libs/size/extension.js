// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import {
	Flex,
	isValid,
	BaseControl,
	InputControl,
	SelectControl,
	PanelBodyControl,
	ToggleSelectControl,
	ControlContextProvider,
} from '@blockera/controls';
import {
	extensionClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { isShowField, isActiveExtension } from '../../api/utils';
import { generateExtensionId } from '../utils';
import { EditorFeatureWrapper } from '../../../';
import type { TSizeProps } from './types/size-props';
import { ObjectFit, AspectRatio } from './components';
import { ExtensionSettings } from '../settings';
import { useBlockSection } from '../../components';
import { useFeatureSearch } from '../../components/feature-search-context';
import { WidthFill } from './components/width-fill';

export const SizeExtension: ComponentType<TSizeProps> = ({
	block,
	extensionConfig,
	handleOnChangeAttributes,
	values,
	attributes,
	extensionProps,
	setSettings,
}: TSizeProps): MixedElement => {
	const { initialOpen, onToggle } = useBlockSection('sizeConfig');
	const { activeSearchMode } = useFeatureSearch();

	if (!isActiveExtension(extensionConfig)) {
		return <></>;
	}

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
	const isShowBoxSizing = isShowField(
		extensionConfig.blockeraBoxSizing,
		values?.blockeraBoxSizing,
		attributes?.blockeraBoxSizing?.default
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
		!isShowFit &&
		!isShowBoxSizing
	) {
		return <></>;
	}

	const isShowFitPosition = isShowField(
		{
			show: false,
			force: false,
			status: true,
		},
		values?.blockeraFitPosition,
		attributes?.blockeraFitPosition?.default
	);

	return (
		<PanelBodyControl
			onToggle={onToggle}
			title={__('Size', 'blockera')}
			initialOpen={initialOpen}
			noWrapper={activeSearchMode}
			icon={<Icon icon="extension-size" />}
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
								columns="1fr 2.5fr"
								placeholder="Auto"
								unitType="width"
								min={0}
								defaultValue={attributes.blockeraWidth.default}
								onChange={(newValue, ref) => {
									handleOnChangeAttributes(
										'blockeraWidth',
										newValue,
										{ ref }
									);
								}}
								controlAddonTypes={['variable']}
								variableTypes={['width-size', 'spacing']}
								className={controlInnerClassNames(
									'width-input'
								)}
								{...extensionProps.blockeraWidth}
							>
								{!isValid(values?.blockeraWidth) && (
									<WidthFill
										blockeraWidth={values?.blockeraWidth}
										handleOnChangeAttributes={
											handleOnChangeAttributes
										}
									/>
								)}

								{(isShowMinWidth || isShowMaxWidth) && (
									<Flex
										style={{
											width: '100%',
											alignSelf: 'flex-end',
										}}
									>
										<EditorFeatureWrapper
											isActive={isShowMinWidth}
											config={
												extensionConfig.blockeraMinWidth
											}
										>
											<ControlContextProvider
												value={{
													name: generateExtensionId(
														block,
														'minWidth'
													),
													value: values.blockeraMinWidth,
													attribute:
														'blockeraMinWidth',
													blockName: block.blockName,
												}}
											>
												<InputControl
													label={__(
														'Min Width',
														'blockera'
													)}
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
															: '1.75fr 2fr'
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
														attributes
															.blockeraMinWidth
															.default
													}
													onChange={(newValue, ref) =>
														handleOnChangeAttributes(
															'blockeraMinWidth',
															newValue,
															{ ref }
														)
													}
													controlAddonTypes={[
														'variable',
													]}
													variableTypes={[
														'width-size',
														'spacing',
													]}
													{...extensionProps.blockeraMinWidth}
												/>
											</ControlContextProvider>
										</EditorFeatureWrapper>

										<EditorFeatureWrapper
											isActive={isShowMaxWidth}
											config={
												extensionConfig.blockeraMaxWidth
											}
										>
											<ControlContextProvider
												value={{
													name: generateExtensionId(
														block,
														'maxWidth'
													),
													value: values.blockeraMaxWidth,
													attribute:
														'blockeraMaxWidth',
													blockName: block.blockName,
												}}
											>
												<InputControl
													label={__(
														'Max Width',
														'blockera'
													)}
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
															: '1.75fr 2fr'
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
														attributes
															.blockeraMaxWidth
															.default
													}
													onChange={(newValue, ref) =>
														handleOnChangeAttributes(
															'blockeraMaxWidth',
															newValue,
															{ ref }
														)
													}
													controlAddonTypes={[
														'variable',
													]}
													variableTypes={[
														'width-size',
														'spacing',
													]}
													{...extensionProps.blockeraMaxWidth}
												/>
											</ControlContextProvider>
										</EditorFeatureWrapper>
									</Flex>
								)}
							</InputControl>
						</ControlContextProvider>
					</EditorFeatureWrapper>
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
								columns="1fr 2.5fr"
								placeholder="Auto"
								unitType="height"
								min={0}
								defaultValue={attributes.blockeraHeight.default}
								onChange={(newValue, ref) => {
									handleOnChangeAttributes(
										'blockeraHeight',
										newValue,
										{ ref }
									);
								}}
								controlAddonTypes={['variable']}
								variableTypes={['width-size', 'spacing']}
								{...extensionProps.blockeraHeight}
							>
								{(isShowMinHeight || isShowMaxHeight) && (
									<Flex
										style={{
											width: '100%',
											alignSelf: 'flex-end',
										}}
									>
										<EditorFeatureWrapper
											isActive={isShowMinHeight}
											config={
												extensionConfig.blockeraMinHeight
											}
										>
											<ControlContextProvider
												value={{
													name: generateExtensionId(
														block,
														'minHeight'
													),
													value: values.blockeraMinHeight,
													attribute:
														'blockeraMinHeight',
													blockName: block.blockName,
												}}
											>
												<InputControl
													defaultValue={
														attributes
															.blockeraMinHeight
															.default
													}
													label={__(
														'Min Height',
														'blockera'
													)}
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
															: '1.75fr 2fr'
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
													controlAddonTypes={[
														'variable',
													]}
													variableTypes={[
														'width-size',
														'spacing',
													]}
													{...extensionProps.blockeraMinHeight}
												/>
											</ControlContextProvider>
										</EditorFeatureWrapper>

										<EditorFeatureWrapper
											isActive={isShowMaxHeight}
											config={
												extensionConfig.blockeraMaxHeight
											}
										>
											<ControlContextProvider
												value={{
													name: generateExtensionId(
														block,
														'maxHeight'
													),
													value: values.blockeraMaxHeight,
													attribute:
														'blockeraMaxHeight',
													blockName: block.blockName,
												}}
											>
												<InputControl
													label={__(
														'Max Height',
														'blockera'
													)}
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
															: '1.75fr 2fr'
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
														attributes
															.blockeraMaxHeight
															.default
													}
													onChange={(newValue, ref) =>
														handleOnChangeAttributes(
															'blockeraMaxHeight',
															newValue,
															{ ref }
														)
													}
													controlAddonTypes={[
														'variable',
													]}
													variableTypes={[
														'width-size',
														'spacing',
													]}
													{...extensionProps.blockeraMaxHeight}
												/>
											</ControlContextProvider>
										</EditorFeatureWrapper>
									</Flex>
								)}
							</InputControl>
						</ControlContextProvider>
					</EditorFeatureWrapper>
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
									<Icon
										icon="overflow-visible"
										iconSize="18"
									/>
									{__('Visible', 'blockera')}
								</h3>
								<p>
									{__(
										'Visible ensures that any content exceeding the boundaries of its container is still visible, extending beyond the set dimensions.',
										'blockera'
									)}
								</p>
								<h3>
									<Icon
										icon="overflow-hidden"
										iconSize="18"
									/>
									{__('Hidden', 'blockera')}
								</h3>
								<p>
									{__(
										'Hidden effectively clips any content that exceeds the boundaries of its container, ensuring a clean, uncluttered appearance for your layout.',
										'blockera'
									)}
								</p>
								<h3>
									<Icon
										icon="overflow-scroll"
										iconSize="18"
									/>
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
						columns="1fr 2.5fr"
						isDeselectable={true}
						options={[
							{
								label: __('Visible Overflow', 'blockera'),
								value: 'visible',
								icon: (
									<Icon
										icon="overflow-visible"
										iconSize="18"
									/>
								),
							},
							{
								label: __('Hidden Overflow', 'blockera'),
								value: 'hidden',
								icon: (
									<Icon
										icon="overflow-hidden"
										iconSize="18"
									/>
								),
							},
							{
								label: __('Scroll Overflow', 'blockera'),
								value: 'scroll',
								icon: (
									<Icon
										icon="overflow-scroll"
										iconSize="18"
									/>
								),
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
				isActive={isShowFit || isShowFitPosition}
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
						fitPositionProps={extensionProps.blockeraFitPosition}
						handleOnChangeAttributes={handleOnChangeAttributes}
						{...extensionProps.blockeraFit}
					/>
				</ControlContextProvider>
			</EditorFeatureWrapper>

			<EditorFeatureWrapper
				isActive={isShowBoxSizing}
				config={extensionConfig.blockeraBoxSizing}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'box-sizing'),
						value: values.blockeraBoxSizing,
						attribute: 'blockeraBoxSizing',
						blockName: block.blockName,
					}}
				>
					<SelectControl
						label={__('Box Sizing', 'blockera')}
						labelDescription={
							<p>
								{__(
									'The box-sizing CSS property sets how the total width and height of an element is calculated.',
									'blockera'
								)}
							</p>
						}
						columns="1fr 2.5fr"
						options={[
							{
								label: __('Default', 'blockera'),
								value: '',
							},
							{
								label: __('Border Box', 'blockera'),
								value: 'border-box',
							},
							{
								label: __('Content Box', 'blockera'),
								value: 'content-box',
							},
						]}
						defaultValue={attributes.blockeraBoxSizing.default}
						onChange={(newValue, ref) =>
							handleOnChangeAttributes(
								'blockeraBoxSizing',
								newValue,
								{ ref }
							)
						}
						{...extensionProps.blockeraBoxSizing}
					/>
				</ControlContextProvider>
			</EditorFeatureWrapper>
		</PanelBodyControl>
	);
};
