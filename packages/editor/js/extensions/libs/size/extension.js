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
	BaseControl,
	SelectControl,
	PanelBodyControl,
	ToggleSelectControl,
	ControlContextProvider,
} from '@blockera/controls';
import { extensionClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { isShowField, isActiveExtension } from '../../api/utils';
import { generateExtensionId } from '../utils';
import { EditorFeatureWrapper } from '../../../';
import type { TSizeProps } from './types/size-props';
import {
	ObjectFit,
	AspectRatio,
	Width,
	MinWidth,
	MaxWidth,
	Height,
	MinHeight,
	MaxHeight,
} from './components';
import { ExtensionSettings } from '../settings';
import { useBlockSection } from '../../components';
import { useFeatureSearch } from '../../components/feature-search-context';

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
			icon={<Icon icon="extension-size" />}
			className={extensionClassNames('size')}
		>
			{!activeSearchMode && (
				<ExtensionSettings
					buttonLabel={__('More Size Settings', 'blockera')}
					features={extensionConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'sizeConfig');
					}}
				/>
			)}

			{!activeSearchMode &&
				(isShowWidth || isShowMinWidth || isShowMaxWidth) && (
					<BaseControl columns="columns-1">
						<Width
							block={block}
							extensionConfig={extensionConfig}
							values={values}
							attributes={attributes}
							extensionProps={extensionProps}
							handleOnChangeAttributes={handleOnChangeAttributes}
							isActive={isShowWidth}
							showMinMax={isShowMinWidth || isShowMaxWidth}
						>
							{isShowMinWidth || isShowMaxWidth ? (
								<Flex
									style={{
										width: '100%',
										alignSelf: 'flex-end',
									}}
								>
									<MinWidth
										block={block}
										extensionConfig={extensionConfig}
										values={values}
										attributes={attributes}
										extensionProps={extensionProps}
										handleOnChangeAttributes={
											handleOnChangeAttributes
										}
										isActive={isShowMinWidth}
										isNested={true}
										showMaxWidth={isShowMaxWidth}
									/>
									<MaxWidth
										block={block}
										extensionConfig={extensionConfig}
										values={values}
										attributes={attributes}
										extensionProps={extensionProps}
										handleOnChangeAttributes={
											handleOnChangeAttributes
										}
										isActive={isShowMaxWidth}
										isNested={true}
										showMinWidth={isShowMinWidth}
									/>
								</Flex>
							) : null}
						</Width>
					</BaseControl>
				)}

			{activeSearchMode && (
				<>
					<Width
						block={block}
						extensionConfig={extensionConfig}
						values={values}
						attributes={attributes}
						extensionProps={extensionProps}
						handleOnChangeAttributes={handleOnChangeAttributes}
						isActive={isShowWidth}
					/>

					<MinWidth
						block={block}
						extensionConfig={extensionConfig}
						values={values}
						attributes={attributes}
						extensionProps={extensionProps}
						handleOnChangeAttributes={handleOnChangeAttributes}
						isActive={isShowMinWidth}
					/>

					<MaxWidth
						block={block}
						extensionConfig={extensionConfig}
						values={values}
						attributes={attributes}
						extensionProps={extensionProps}
						handleOnChangeAttributes={handleOnChangeAttributes}
						isActive={isShowMaxWidth}
					/>

					<Height
						block={block}
						extensionConfig={extensionConfig}
						values={values}
						attributes={attributes}
						extensionProps={extensionProps}
						handleOnChangeAttributes={handleOnChangeAttributes}
						isActive={isShowHeight}
					/>

					<MinHeight
						block={block}
						extensionConfig={extensionConfig}
						values={values}
						attributes={attributes}
						extensionProps={extensionProps}
						handleOnChangeAttributes={handleOnChangeAttributes}
						isActive={isShowMinHeight}
					/>

					<MaxHeight
						block={block}
						extensionConfig={extensionConfig}
						values={values}
						attributes={attributes}
						extensionProps={extensionProps}
						handleOnChangeAttributes={handleOnChangeAttributes}
						isActive={isShowMaxHeight}
					/>
				</>
			)}

			{!activeSearchMode &&
				(isShowHeight || isShowMinHeight || isShowMaxHeight) && (
					<BaseControl columns="columns-1">
						<Height
							block={block}
							extensionConfig={extensionConfig}
							values={values}
							attributes={attributes}
							extensionProps={extensionProps}
							handleOnChangeAttributes={handleOnChangeAttributes}
							isActive={isShowHeight}
							showMinMax={isShowMinHeight || isShowMaxHeight}
						>
							{isShowMinHeight || isShowMaxHeight ? (
								<Flex
									style={{
										width: '100%',
										alignSelf: 'flex-end',
									}}
								>
									<MinHeight
										block={block}
										extensionConfig={extensionConfig}
										values={values}
										attributes={attributes}
										extensionProps={extensionProps}
										handleOnChangeAttributes={
											handleOnChangeAttributes
										}
										isActive={isShowMinHeight}
										isNested={true}
										showMaxHeight={isShowMaxHeight}
									/>

									<MaxHeight
										block={block}
										extensionConfig={extensionConfig}
										values={values}
										attributes={attributes}
										extensionProps={extensionProps}
										handleOnChangeAttributes={
											handleOnChangeAttributes
										}
										isActive={isShowMaxHeight}
										isNested={true}
										showMinHeight={isShowMinHeight}
									/>
								</Flex>
							) : null}
						</Height>
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
