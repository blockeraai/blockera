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
	BaseControl,
	ColorControl,
	PanelBodyControl,
	ControlContextProvider,
	NoticeControl,
	ConditionalWrapper,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { extensionClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { isShowField, isActiveField, isActiveExtension } from '../../api/utils';
import { generateExtensionId } from '../utils';
import { EditorFeatureWrapper } from '../../../';
import type { TTypographyProps } from './type/typography-props';
import {
	FontFamily,
	FontAppearance,
	FontSize,
	LineHeight,
	TextAlign,
} from './components';
import { AdvancedTypographyFeatures } from './advanced-features';
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

	// Compact 2×2 grid only when all font-group features are enabled; otherwise
	// use the same expanded row layout as feature search.
	const useFontGroupGridLayout =
		!activeSearchMode &&
		isActiveField(extensionConfig.blockeraFontFamily) &&
		isActiveField(extensionConfig.blockeraFontAppearance) &&
		isActiveField(extensionConfig.blockeraFontSize) &&
		isActiveField(extensionConfig.blockeraLineHeight);
	const useFontGroupExpandedLayout =
		activeSearchMode || !useFontGroupGridLayout;

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
				condition={useFontGroupGridLayout}
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
					isActive={isShowFontFamily}
					config={extensionConfig.blockeraFontFamily}
				>
					<FontFamily
						block={block}
						onChange={handleOnChangeAttributes}
						value={values.blockeraFontFamily}
						defaultValue={attributes.blockeraFontFamily.default}
						columns={
							useFontGroupExpandedLayout
								? '1fr 2.5fr'
								: 'columns-1'
						}
						className={
							useFontGroupExpandedLayout
								? ''
								: 'control-first label-center small-gap'
						}
						style={
							useFontGroupExpandedLayout
								? undefined
								: { margin: '0px' }
						}
						{...extensionProps.blockeraFontFamily}
					/>
				</EditorFeatureWrapper>

				<EditorFeatureWrapper
					isActive={isShowFontAppearance}
					config={extensionConfig.blockeraFontAppearance}
				>
					<FontAppearance
						block={block}
						onChange={handleOnChangeAttributes}
						value={values.blockeraFontAppearance}
						defaultValue={attributes.blockeraFontAppearance.default}
						columns={
							useFontGroupExpandedLayout
								? '1fr 2.5fr'
								: 'columns-1'
						}
						className={
							useFontGroupExpandedLayout
								? ''
								: 'control-first label-center small-gap'
						}
						style={
							useFontGroupExpandedLayout
								? undefined
								: { margin: '0px' }
						}
						activeSearchMode={useFontGroupExpandedLayout}
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
						columns={
							useFontGroupExpandedLayout
								? '1fr 2.5fr'
								: 'columns-1'
						}
						className={
							useFontGroupExpandedLayout
								? ''
								: 'control-first label-center small-gap'
						}
						style={
							useFontGroupExpandedLayout
								? undefined
								: { margin: '0px' }
						}
						size={useFontGroupExpandedLayout ? 'normal' : 'small'}
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
						columns={
							useFontGroupExpandedLayout
								? '1fr 2.5fr'
								: 'columns-1'
						}
						className={
							useFontGroupExpandedLayout
								? ''
								: 'control-first label-center small-gap'
						}
						style={
							useFontGroupExpandedLayout
								? undefined
								: { margin: '0px' }
						}
						size={useFontGroupExpandedLayout ? 'normal' : 'small'}
						activeSearchMode={useFontGroupExpandedLayout}
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
					<BaseControl
						columns="columns-1"
						data-test="editor-control-blockera-font-color"
					>
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
				<AdvancedTypographyFeatures
					block={block}
					values={values}
					attributes={attributes}
					extensionConfig={extensionConfig}
					extensionProps={extensionProps}
					display={display}
					activeSearchMode={activeSearchMode}
					handleOnChangeAttributes={handleOnChangeAttributes}
					isShowTextShadow={isShowTextShadow}
					isShowTextTransform={isShowTextTransform}
					isShowTextDecoration={isShowTextDecoration}
					isShowDirection={isShowDirection}
					isShowTextOrientation={isShowTextOrientation}
					isShowLetterSpacing={isShowLetterSpacing}
					isShowWordSpacing={isShowWordSpacing}
					isShowTextIndent={isShowTextIndent}
					isShowTextColumns={isShowTextColumns}
					isShowTextStroke={isShowTextStroke}
					isShowTextWrap={isShowTextWrap}
					isShowWordBreak={isShowWordBreak}
				/>
			)}
		</PanelBodyControl>
	);
};
