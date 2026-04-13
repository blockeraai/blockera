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
	Grid,
	MoreFeatures,
	BaseControl,
	ColorControl,
	InputControl,
	PanelBodyControl,
	TextShadowControl,
	ControlContextProvider,
	NoticeControl,
	ConditionalWrapper,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { isEquals } from '@blockera/utils';
import { extensionClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { isShowField, isActiveExtension } from '../../api/utils';
import { generateExtensionId } from '../utils';
import { EditorFeatureWrapper } from '../../../';
import type { TTypographyProps } from './type/typography-props';
import {
	FontFamily,
	FontAppearance,
	FontSize,
	LineHeight,
	TextTransform,
	TextDecoration,
	LetterSpacing,
	TextColumns,
	TextStroke,
	TextAlign,
	TextDirection,
	TextOrientation,
	WordBreak,
	TextWrap,
} from './components';
import { ExtensionSettings } from '../settings';
import { useBlockSection } from '../../components';
import { useFeatureSearch } from '../../components/feature-search-context';

export const TypographyExtension: ComponentType<TTypographyProps> = ({
	block,
	extensionConfig,
	values,
	display,
	backgroundClip,
	extensionProps,
	handleOnChangeAttributes,
	setSettings,
	attributes,
}: TTypographyProps): MixedElement => {
	const { initialOpen, onToggle } = useBlockSection('typographyConfig');
	const { activeSearchMode } = useFeatureSearch();

	if (!isActiveExtension(extensionConfig)) {
		return <></>;
	}

	const isShowFontFamily = isShowField(
		extensionConfig.blockeraFontFamily,
		values?.blockeraFontFamily,
		attributes.blockeraFontFamily.default
	);
	const isShowFontAppearance = isShowField(
		extensionConfig.blockeraFontAppearance,
		values?.blockeraFontAppearance,
		attributes.blockeraFontAppearance.default
	);
	const isShowFontSize = isShowField(
		extensionConfig.blockeraFontSize,
		values?.blockeraFontSize,
		attributes.blockeraFontSize.default
	);
	const isShowLineHeight = isShowField(
		extensionConfig.blockeraLineHeight,
		values?.blockeraLineHeight,
		attributes.blockeraLineHeight.default
	);
	const isShowTextAlign = isShowField(
		extensionConfig.blockeraTextAlign,
		values?.blockeraTextAlign,
		attributes.blockeraTextAlign.default
	);
	const isShowTextDecoration = isShowField(
		extensionConfig.blockeraTextDecoration,
		values?.blockeraTextDecoration,
		attributes.blockeraTextDecoration.default
	);
	const isShowTextTransform = isShowField(
		extensionConfig.blockeraTextTransform,
		values?.blockeraTextTransform,
		attributes.blockeraTextTransform.default
	);
	const isShowDirection = isShowField(
		extensionConfig.blockeraDirection,
		values?.blockeraDirection,
		attributes.blockeraDirection.default
	);
	const isShowLetterSpacing = isShowField(
		extensionConfig.blockeraLetterSpacing,
		values?.blockeraLetterSpacing,
		attributes.blockeraLetterSpacing.default
	);
	const isShowWordSpacing = isShowField(
		extensionConfig.blockeraWordSpacing,
		values?.blockeraWordSpacing,
		attributes.blockeraWordSpacing.default
	);
	const isShowTextIndent = isShowField(
		extensionConfig.blockeraTextIndent,
		values?.blockeraTextIndent,
		attributes.blockeraTextIndent.default
	);
	const isShowTextOrientation = isShowField(
		extensionConfig.blockeraTextOrientation,
		values?.blockeraTextOrientation,
		attributes.blockeraTextOrientation.default
	);
	const isShowTextStroke = isShowField(
		extensionConfig.blockeraTextStroke,
		values?.blockeraTextStroke,
		attributes.blockeraTextStroke.default
	);
	const isShowTextColumns = isShowField(
		extensionConfig.blockeraTextColumns,
		values?.blockeraTextColumns,
		attributes.blockeraTextColumns.default
	);
	const isShowWordBreak = isShowField(
		extensionConfig.blockeraWordBreak,
		values?.blockeraWordBreak,
		attributes.blockeraWordBreak.default
	);
	const isShowFontColor = isShowField(
		extensionConfig.blockeraFontColor,
		values?.blockeraFontColor,
		attributes.blockeraFontColor.default
	);
	const isShowTextShadow = isShowField(
		extensionConfig.blockeraTextShadow,
		values?.blockeraTextShadow,
		attributes.blockeraTextShadow.default
	);
	const isShowTextWrap = isShowField(
		extensionConfig.blockeraTextWrap,
		values?.blockeraTextWrap,
		attributes.blockeraTextWrap.default
	);

	if (
		!isShowFontFamily &&
		!isShowFontAppearance &&
		!isShowFontSize &&
		!isShowLineHeight &&
		!isShowTextAlign &&
		!isShowTextDecoration &&
		!isShowTextTransform &&
		!isShowDirection &&
		!isShowLetterSpacing &&
		!isShowWordSpacing &&
		!isShowTextIndent &&
		!isShowTextOrientation &&
		!isShowTextStroke &&
		!isShowTextColumns &&
		!isShowWordBreak &&
		!isShowFontColor &&
		!isShowTextShadow &&
		!isShowTextWrap
	) {
		return <></>;
	}

	const isShowAdvanced =
		isShowTextShadow ||
		isShowTextDecoration ||
		isShowTextTransform ||
		isShowDirection ||
		isShowLetterSpacing ||
		isShowWordSpacing ||
		isShowTextIndent ||
		isShowTextOrientation ||
		isShowTextStroke ||
		isShowTextColumns ||
		isShowWordBreak ||
		isShowTextWrap;

	let isAdvancedEdited = false;
	if (isShowAdvanced) {
		isAdvancedEdited =
			!isEquals(
				values?.blockeraTextShadow,
				attributes.blockeraTextShadow.default
			) ||
			values?.blockeraTextDecoration !==
				attributes.blockeraTextDecoration.default ||
			values?.blockeraTextTransform !==
				attributes.blockeraTextTransform.default ||
			values?.blockeraDirection !==
				attributes.blockeraDirection.default ||
			values?.blockeraLetterSpacing !==
				attributes.blockeraLetterSpacing.default ||
			values?.blockeraWordSpacing !==
				attributes.blockeraWordSpacing.default ||
			values?.blockeraTextIndent !==
				attributes.blockeraTextIndent.default ||
			!isEquals(
				values?.blockeraTextColumns,
				attributes.blockeraTextColumns.default
			) ||
			!isEquals(
				values?.blockeraTextStroke,
				attributes.blockeraTextStroke.default
			) ||
			values?.blockeraWordBreak !==
				attributes.blockeraWordBreak.default ||
			values?.blockeraTextWrap !== attributes.blockeraTextWrap.default;
	}

	return (
		<PanelBodyControl
			onToggle={onToggle}
			title={__('Typography', 'blockera')}
			initialOpen={initialOpen}
			icon={<Icon icon="extension-typography" />}
			className={extensionClassNames('typography')}
		>
			{!activeSearchMode && (
				<ExtensionSettings
					buttonLabel={__('More Typography Settings', 'blockera')}
					features={extensionConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'typographyConfig');
					}}
				/>
			)}

			<ConditionalWrapper
				condition={!activeSearchMode}
				wrapper={(children) => (
					<BaseControl
						columns="1fr 2.5fr"
						label={__('Font', 'blockera')}
					>
						<Grid
							alignItems="center"
							gridTemplateColumns="1fr 1fr"
							rowGap="10px"
							columnGap="8px"
						>
							{children}
						</Grid>
					</BaseControl>
				)}
				elseWrapper={(children) => <>{children}</>}
			>
				<EditorFeatureWrapper
					isActive={isShowFontAppearance}
					config={extensionConfig.blockeraFontAppearance}
				>
					<EditorFeatureWrapper
						isActive={isShowFontFamily}
						config={extensionConfig.blockeraFontFamily}
					>
						<FontFamily
							block={block}
							onChange={handleOnChangeAttributes}
							value={values.blockeraFontFamily}
							defaultValue={attributes.blockeraFontFamily.default}
							columns={
								activeSearchMode ? '1fr 2.5fr' : 'columns-1'
							}
							className={
								activeSearchMode
									? ''
									: 'control-first label-center small-gap'
							}
							style={
								activeSearchMode ? undefined : { margin: '0px' }
							}
							{...extensionProps.blockeraFontFamily}
						/>
					</EditorFeatureWrapper>

					<FontAppearance
						block={block}
						onChange={handleOnChangeAttributes}
						value={values.blockeraFontAppearance}
						defaultValue={attributes.blockeraFontAppearance.default}
						columns={activeSearchMode ? '1fr 2.5fr' : 'columns-1'}
						className={
							activeSearchMode
								? ''
								: 'control-first label-center small-gap'
						}
						style={activeSearchMode ? undefined : { margin: '0px' }}
						activeSearchMode={activeSearchMode}
						{...extensionProps.blockeraFontAppearance}
					/>
				</EditorFeatureWrapper>

				<EditorFeatureWrapper
					isActive={isShowFontSize}
					config={extensionConfig.blockeraFontSize}
				>
					<FontSize
						block={block}
						onChange={handleOnChangeAttributes}
						value={values.blockeraFontSize}
						defaultValue={attributes.blockeraFontSize.default}
						columns={activeSearchMode ? '1fr 2.5fr' : 'columns-1'}
						className={
							activeSearchMode
								? ''
								: 'control-first label-center small-gap'
						}
						style={activeSearchMode ? undefined : { margin: '0px' }}
						size={activeSearchMode ? 'normal' : 'small'}
						{...extensionProps.blockeraFontSize}
					/>
				</EditorFeatureWrapper>

				<EditorFeatureWrapper
					isActive={isShowLineHeight}
					config={extensionConfig.blockeraLineHeight}
				>
					<LineHeight
						block={block}
						value={values.blockeraLineHeight}
						onChange={handleOnChangeAttributes}
						defaultValue={attributes.blockeraLineHeight.default}
						columns={activeSearchMode ? '1fr 2.5fr' : 'columns-1'}
						className={
							activeSearchMode
								? ''
								: 'control-first label-center small-gap'
						}
						style={activeSearchMode ? undefined : { margin: '0px' }}
						size={activeSearchMode ? 'normal' : 'small'}
						activeSearchMode={activeSearchMode}
						{...extensionProps.blockeraLineHeight}
					/>
				</EditorFeatureWrapper>
			</ConditionalWrapper>

			<EditorFeatureWrapper
				isActive={isShowFontColor}
				config={extensionConfig.blockeraFontColor}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'font-color'),
						value: values.blockeraFontColor,
						attribute: 'blockeraFontColor',
						blockName: block.blockName,
					}}
				>
					<BaseControl columns="columns-1">
						<ColorControl
							label={__('Text Color', 'blockera')}
							labelDescription={
								<>
									<p>
										{__(
											'It sets the color of the text within the block, playing a crucial role in enhancing readability, attracting attention, and maintaining consistent branding.',
											'blockera'
										)}
									</p>
								</>
							}
							columns="1fr 2.5fr"
							defaultValue={attributes.blockeraFontColor.default}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'blockeraFontColor',
									newValue,
									{ ref }
								)
							}
							controlAddonTypes={['variable']}
							variableTypes={['color']}
							className={
								backgroundClip === 'text' &&
								'blockera-control-is-not-active'
							}
							{...extensionProps.blockeraFontColor}
						/>

						{backgroundClip === 'text' && (
							<NoticeControl type="information">
								{__(
									`Text clipping was applied; the current text color won't display. You have to disable clipping settings to use Text Color.`,
									'blockera'
								)}
							</NoticeControl>
						)}
					</BaseControl>
				</ControlContextProvider>
			</EditorFeatureWrapper>

			<EditorFeatureWrapper
				isActive={isShowTextAlign}
				config={extensionConfig.blockeraTextAlign}
			>
				<TextAlign
					block={block}
					value={values.blockeraTextAlign}
					defaultValue={attributes.blockeraTextAlign.default}
					onChange={handleOnChangeAttributes}
					{...extensionProps.blockeraTextAlign}
				/>
			</EditorFeatureWrapper>

			{(isShowAdvanced || activeSearchMode) && (
				<ConditionalWrapper
					condition={!activeSearchMode}
					wrapper={(children) => (
						<MoreFeatures
							ariaLabel={__(
								'More typography settings',
								'blockera'
							)}
							isOpen={false}
							isChanged={isAdvancedEdited}
							isAnimated={true}
						>
							{children}
						</MoreFeatures>
					)}
					elseWrapper={(children) => <>{children}</>}
				>
					<EditorFeatureWrapper
						isActive={isShowTextShadow}
						config={extensionConfig.blockeraTextShadow}
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'text-shadow'),
								value: values.blockeraTextShadow,
								attribute: 'blockeraTextShadow',
								blockName: block.blockName,
							}}
							storeName={'blockera/controls/repeater'}
						>
							<BaseControl
								controlName="text-shadow"
								columns="columns-1"
							>
								<TextShadowControl
									label={__('Text Shadows', 'blockera')}
									onChange={(newValue, ref) =>
										handleOnChangeAttributes(
											'blockeraTextShadow',
											newValue,
											{ ref }
										)
									}
									defaultValue={
										attributes.blockeraTextShadow.default
									}
									{...extensionProps.blockeraTextShadow}
								/>
							</BaseControl>
						</ControlContextProvider>
					</EditorFeatureWrapper>

					<EditorFeatureWrapper
						isActive={isShowTextTransform}
						config={extensionConfig.blockeraTextTransform}
					>
						<TextTransform
							block={block}
							value={values.blockeraTextTransform}
							defaultValue={
								attributes.blockeraTextTransform.default
							}
							onChange={handleOnChangeAttributes}
							{...extensionProps.blockeraTextTransform}
						/>
					</EditorFeatureWrapper>

					<EditorFeatureWrapper
						isActive={isShowTextDecoration}
						config={extensionConfig.blockeraTextDecoration}
					>
						<TextDecoration
							block={block}
							value={values.blockeraTextDecoration}
							defaultValue={
								attributes.blockeraTextDecoration.default
							}
							onChange={handleOnChangeAttributes}
							{...extensionProps.blockeraTextDecoration}
						/>
					</EditorFeatureWrapper>

					<EditorFeatureWrapper
						isActive={isShowDirection}
						config={extensionConfig.blockeraDirection}
					>
						<TextDirection
							block={block}
							value={values.blockeraDirection}
							defaultValue={attributes.blockeraDirection.default}
							onChange={handleOnChangeAttributes}
							{...extensionProps.blockeraDirection}
						/>
					</EditorFeatureWrapper>

					<EditorFeatureWrapper
						isActive={isShowTextOrientation}
						config={extensionConfig.blockeraTextOrientation}
					>
						<TextOrientation
							block={block}
							value={values.blockeraTextOrientation}
							defaultValue={
								attributes.blockeraTextOrientation.default
							}
							onChange={handleOnChangeAttributes}
							{...extensionProps.blockeraTextOrientation}
						/>
					</EditorFeatureWrapper>

					{(isShowLetterSpacing ||
						isShowWordSpacing ||
						isShowTextIndent) && (
						<ConditionalWrapper
							condition={!activeSearchMode}
							wrapper={(children) => (
								<BaseControl
									controlName="spacing"
									label={__('Spacing', 'blockera')}
									columns="1fr 2.5fr"
								>
									{children}
								</BaseControl>
							)}
							elseWrapper={(children) => <>{children}</>}
						>
							<EditorFeatureWrapper
								isActive={isShowLetterSpacing}
								config={extensionConfig.blockeraLetterSpacing}
							>
								<LetterSpacing
									block={block}
									value={values.blockeraLetterSpacing}
									onChange={handleOnChangeAttributes}
									defaultValue={
										attributes.blockeraLetterSpacing.default
									}
									activeSearchMode={activeSearchMode}
									{...extensionProps.blockeraLetterSpacing}
								/>
							</EditorFeatureWrapper>

							<EditorFeatureWrapper
								isActive={isShowWordSpacing}
								config={extensionConfig.blockeraWordSpacing}
							>
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'word-spacing'
										),
										value: values.blockeraWordSpacing,
										attribute: 'blockeraWordSpacing',
										blockName: block.blockName,
									}}
								>
									<InputControl
										columns={
											activeSearchMode
												? '1fr 2.5fr'
												: '2fr 2fr'
										}
										label={
											activeSearchMode
												? __(
														'Words Spacing',
														'blockera'
													)
												: __('Words', 'blockera')
										}
										labelPopoverTitle={__(
											'Words Spacing',
											'blockera'
										)}
										labelDescription={
											<>
												<p>
													{__(
														'It sets the space between words in text content, an essential tool for enhancing readability and typographic aesthetics, particularly in text-heavy layouts.',
														'blockera'
													)}
												</p>
											</>
										}
										arrows={true}
										unitType="letter-spacing"
										defaultValue={
											attributes.blockeraWordSpacing
												.default
										}
										onChange={(newValue, ref) =>
											handleOnChangeAttributes(
												'blockeraWordSpacing',
												newValue,
												{ ref }
											)
										}
										{...extensionProps.blockeraWordSpacing}
									/>
								</ControlContextProvider>
							</EditorFeatureWrapper>

							<EditorFeatureWrapper
								isActive={isShowTextIndent}
								config={extensionConfig.blockeraTextIndent}
							>
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'text-indent'
										),
										value: values.blockeraTextIndent,
										attribute: 'blockeraTextIndent',
										blockName: block.blockName,
									}}
								>
									<InputControl
										columns={
											activeSearchMode
												? '1fr 2.5fr'
												: '2fr 2fr'
										}
										label={__('Text Indent', 'blockera')}
										labelDescription={
											<>
												<p>
													{__(
														'It sets the indentation of the first line in a text block, offering a stylistic tool for enhancing text layout and readability, especially in paragraphs and articles.',
														'blockera'
													)}
												</p>
											</>
										}
										arrows={true}
										unitType="text-indent"
										defaultValue={
											attributes.blockeraTextIndent
												.default
										}
										onChange={(newValue, ref) =>
											handleOnChangeAttributes(
												'blockeraTextIndent',
												newValue,
												{ ref }
											)
										}
										{...extensionProps.blockeraTextIndent}
									/>
								</ControlContextProvider>
							</EditorFeatureWrapper>
						</ConditionalWrapper>
					)}

					<EditorFeatureWrapper
						isActive={isShowTextColumns}
						config={extensionConfig.blockeraTextColumns}
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(
									block,
									'text-columns'
								),
								value: values.blockeraTextColumns,
								type: 'nested',
								attribute: 'blockeraTextColumns',
								blockName: block.blockName,
							}}
						>
							<TextColumns
								value={values.blockeraTextColumns}
								display={display}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								defaultValue={
									attributes.blockeraTextColumns.default
								}
								{...extensionProps.blockeraTextColumns}
							/>
						</ControlContextProvider>
					</EditorFeatureWrapper>

					<EditorFeatureWrapper
						isActive={isShowTextStroke}
						config={extensionConfig.blockeraTextStroke}
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'text-stroke'),
								value: values.blockeraTextStroke,
								type: 'nested',
								attribute: 'blockeraTextStroke',
								blockName: block.blockName,
							}}
						>
							<TextStroke
								value={values.blockeraTextStroke}
								handleOnChangeAttributes={
									handleOnChangeAttributes
								}
								defaultValue={
									attributes.blockeraTextStroke.default
								}
								{...extensionProps.blockeraTextStroke}
							/>
						</ControlContextProvider>
					</EditorFeatureWrapper>

					<EditorFeatureWrapper
						isActive={isShowTextWrap}
						config={extensionConfig.blockeraTextWrap}
					>
						<TextWrap
							block={block}
							value={values.blockeraTextWrap}
							defaultValue={attributes.blockeraTextWrap.default}
							onChange={handleOnChangeAttributes}
							{...extensionProps.blockeraTextWrap}
						/>
					</EditorFeatureWrapper>

					<EditorFeatureWrapper
						isActive={isShowWordBreak}
						config={extensionConfig.blockeraWordBreak}
					>
						<WordBreak
							block={block}
							value={values.blockeraWordBreak}
							defaultValue={attributes.blockeraWordBreak.default}
							onChange={handleOnChangeAttributes}
							{...extensionProps.blockeraWordBreak}
						/>
					</EditorFeatureWrapper>
				</ConditionalWrapper>
			)}
		</PanelBodyControl>
	);
};
