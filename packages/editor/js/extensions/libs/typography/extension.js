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
	BaseControl,
	ColorControl,
	InputControl,
	SelectControl,
	PanelBodyControl,
	TextShadowControl,
	ToggleSelectControl,
	ControlContextProvider,
	NoticeControl,
} from '@blockera/controls';
import { Flex, Grid, MoreFeatures } from '@blockera/components';
import { EditorFeatureWrapper } from '@blockera/editor';
import { hasSameProps } from '@blockera/utils';
import { extensionClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { generateExtensionId } from '../utils';
import type { TTypographyProps } from './type/typography-props';
import {
	FontSize,
	FontStyle,
	LineHeight,
	TextTransform,
	TextDecoration,
	LetterSpacing,
	TextColumns,
	TextStroke,
} from './components';
import { TypographyExtensionIcon } from './index';

// icons
import NoneIcon from './icons/none';
import InheritIcon from '../../icons/inherit';
import DirectionRtlIcon from './icons/direction-rtl';
import DirectionLtrIcon from './icons/direction-ltr';
import TextAlignLeftIcon from './icons/text-align-left';
import BreakingNormalIcon from './icons/breaking-normal';
import TextAlignRightIcon from './icons/text-align-right';
import TextAlignCenterIcon from './icons/text-align-center';
import BreakingBreakAllIcon from './icons/breaking-break-all';
import TextAlignJustifyIcon from './icons/text-align-justify';
import TextOrientationStyle1Icon from './icons/text-orientation-style-1';
import TextOrientationStyle2Icon from './icons/text-orientation-style-2';
import TextOrientationStyle3Icon from './icons/text-orientation-style-3';
import TextOrientationStyle4Icon from './icons/text-orientation-style-4';
import { ExtensionSettings } from '../settings';

export const TypographyExtension: ComponentType<TTypographyProps> = memo(
	({
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
		const isShowFontStyle = isShowField(
			extensionConfig.blockeraFontStyle,
			values?.blockeraFontStyle,
			attributes.blockeraFontStyle.default
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

		if (
			!isShowFontSize &&
			!isShowLineHeight &&
			!isShowTextAlign &&
			!isShowTextDecoration &&
			!isShowFontStyle &&
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
			!isShowTextShadow
		) {
			return <></>;
		}

		const isShowAdvanced =
			isShowTextAlign ||
			isShowTextDecoration ||
			isShowFontStyle ||
			isShowTextTransform ||
			isShowDirection ||
			isShowLetterSpacing ||
			isShowWordSpacing ||
			isShowTextIndent ||
			isShowTextOrientation ||
			isShowTextStroke ||
			isShowTextColumns ||
			isShowWordBreak;

		let isAdvancedEdited = false;
		if (isShowAdvanced) {
			isAdvancedEdited =
				values?.blockeraTextAlign !==
					attributes.blockeraTextAlign.default ||
				values?.blockeraTextDecoration !==
					attributes.blockeraTextDecoration.default ||
				values?.blockeraFontStyle !==
					attributes.blockeraFontStyle.default ||
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
				values?.blockeraTextColumns !==
					attributes.blockeraTextColumns.default ||
				values?.blockeraTextStroke !==
					attributes.blockeraTextStroke.default ||
				values?.blockeraWordBreak !==
					attributes.blockeraWordBreak.default;
		}

		return (
			<PanelBodyControl
				title={__('Typography', 'blockera')}
				initialOpen={true}
				icon={<TypographyExtensionIcon />}
				className={extensionClassNames('typography')}
			>
				<ExtensionSettings
					buttonLabel={__('More Typography Settings', 'blockera')}
					features={extensionConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'typographyConfig');
					}}
				/>

				{isShowFontSize && isShowLineHeight ? (
					<BaseControl
						columns="columns-2"
						label={__('Size', 'blockera')}
					>
						<Flex alignItems="flex-start">
							<EditorFeatureWrapper
								isActive={isShowFontSize}
								config={extensionConfig.blockeraFontSize}
							>
								<FontSize
									block={block}
									onChange={handleOnChangeAttributes}
									value={values.blockeraFontSize}
									defaultValue={
										attributes.blockeraFontSize.default
									}
									columns="columns-1"
									className="control-first label-center small-gap"
									style={{ margin: '0px' }}
									size="small"
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
									defaultValue={
										attributes.blockeraLineHeight.default
									}
									columns="columns-1"
									className="control-first label-center small-gap"
									style={{ margin: '0px' }}
									size="small"
									{...extensionProps.blockeraLineHeight}
								/>
							</EditorFeatureWrapper>
						</Flex>
					</BaseControl>
				) : (
					<>
						<EditorFeatureWrapper
							isActive={isShowFontSize}
							config={extensionConfig.blockeraFontSize}
						>
							<FontSize
								block={block}
								onChange={handleOnChangeAttributes}
								value={values.blockeraFontSize}
								defaultValue={
									attributes.blockeraFontSize.default
								}
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
								defaultValue={
									attributes.blockeraLineHeight.default
								}
								{...extensionProps.blockeraLineHeight}
							/>
						</EditorFeatureWrapper>
					</>
				)}

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
								columns="columns-2"
								defaultValue={
									attributes.blockeraFontColor.default
								}
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
						storeName={'blockera-core/controls/repeater'}
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

				{isShowAdvanced && (
					<MoreFeatures
						ariaLabel={__('More typography settings', 'blockera')}
						isOpen={false}
						isChanged={isAdvancedEdited}
					>
						{(isShowTextAlign ||
							isShowTextDecoration ||
							isShowFontStyle ||
							isShowTextTransform ||
							isShowDirection) && (
							<BaseControl
								controlName="style"
								columns="columns-1"
							>
								<EditorFeatureWrapper
									isActive={isShowTextAlign}
									config={extensionConfig.blockeraTextAlign}
								>
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'text-align'
											),
											value: values.blockeraTextAlign,
											attribute: 'blockeraTextAlign',
											blockName: block.blockName,
										}}
									>
										<ToggleSelectControl
											columns="columns-1"
											className="control-first label-center small-gap"
											label={__('Text Align', 'blockera')}
											labelDescription={
												<>
													<p>
														{__(
															'It sets the horizontal alignment of text within the block, offering alignment options like left, right, center, and justify.',
															'blockera'
														)}
													</p>
												</>
											}
											options={[
												{
													label: __(
														'Left',
														'blockera'
													),
													value: 'left',
													icon: <TextAlignLeftIcon />,
												},
												{
													label: __(
														'Center',
														'blockera'
													),
													value: 'center',
													icon: (
														<TextAlignCenterIcon />
													),
												},
												{
													label: __(
														'Right',
														'blockera'
													),
													value: 'right',
													icon: (
														<TextAlignRightIcon />
													),
												},
												{
													label: __(
														'Justify',
														'blockera'
													),
													value: 'justify',
													icon: (
														<TextAlignJustifyIcon />
													),
												},
												{
													label: __(
														'None',
														'blockera'
													),
													value: 'initial',
													icon: <NoneIcon />,
												},
											]}
											isDeselectable={true}
											defaultValue={
												attributes.blockeraTextAlign
													.default
											}
											onChange={(newValue, ref) =>
												handleOnChangeAttributes(
													'blockeraTextAlign',
													newValue,
													{ ref }
												)
											}
											{...extensionProps.blockeraTextAlign}
										/>
									</ControlContextProvider>
								</EditorFeatureWrapper>

								{(isShowTextDecoration || isShowDirection) && (
									<Flex direction="row" gap="10px">
										<div style={{ width: '70%' }}>
											<EditorFeatureWrapper
												isActive={isShowTextDecoration}
												config={
													extensionConfig.blockeraTextDecoration
												}
											>
												<TextDecoration
													block={block}
													value={
														values.blockeraTextDecoration
													}
													defaultValue={
														attributes
															.blockeraTextDecoration
															.default
													}
													onChange={
														handleOnChangeAttributes
													}
													{...extensionProps.blockeraTextDecoration}
												/>
											</EditorFeatureWrapper>
										</div>

										<div style={{ width: '40%' }}>
											<EditorFeatureWrapper
												isActive={isShowFontStyle}
												config={
													extensionConfig.blockeraFontStyle
												}
											>
												<FontStyle
													block={block}
													value={
														values.blockeraFontStyle
													}
													onChange={
														handleOnChangeAttributes
													}
													defaultValue={
														attributes
															.blockeraFontStyle
															.default
													}
													{...extensionProps.blockeraFontStyle}
												/>
											</EditorFeatureWrapper>
										</div>
									</Flex>
								)}

								{(isShowTextTransform || isShowDirection) && (
									<Flex direction="row" gap="10px">
										<div style={{ width: '70%' }}>
											<EditorFeatureWrapper
												isActive={isShowTextTransform}
												config={
													extensionConfig.blockeraTextTransform
												}
											>
												<TextTransform
													block={block}
													value={
														values.blockeraTextTransform
													}
													defaultValue={
														attributes
															.blockeraTextTransform
															.default
													}
													onChange={
														handleOnChangeAttributes
													}
													{...extensionProps.blockeraTextTransform}
												/>
											</EditorFeatureWrapper>
										</div>

										<div style={{ width: '40%' }}>
											<EditorFeatureWrapper
												isActive={isShowDirection}
												config={
													extensionConfig.blockeraDirection
												}
											>
												<ControlContextProvider
													value={{
														name: generateExtensionId(
															block,
															'direction'
														),
														value: values.blockeraDirection,
														attribute:
															'blockeraDirection',
														blockName:
															block.blockName,
													}}
												>
													<ToggleSelectControl
														label={__(
															'Direction',
															'blockera'
														)}
														labelPopoverTitle={__(
															'Text Direction',
															'blockera'
														)}
														labelDescription={
															<>
																<p>
																	{__(
																		'It sets the text direction and layout directionality of block.',
																		'blockera'
																	)}
																</p>
																<h3>
																	<DirectionLtrIcon />
																	{__(
																		'LTR',
																		'blockera'
																	)}
																</h3>
																<p>
																	{__(
																		'Sets the direction of text from left to right, used for languages written in this manner.',
																		'blockera'
																	)}
																</p>
																<h3>
																	<DirectionRtlIcon />
																	{__(
																		'RTL',
																		'blockera'
																	)}
																</h3>
																<p>
																	{__(
																		' Sets the direction from right to left, essential for languages such as Arabic, Farsi and Hebrew.',
																		'blockera'
																	)}
																</p>
															</>
														}
														columns="columns-1"
														className="control-first label-center small-gap"
														options={[
															{
																label: __(
																	'Left to Right',
																	'blockera'
																),
																value: 'ltr',
																icon: (
																	<DirectionLtrIcon />
																),
															},
															{
																label: __(
																	'Right to Left',
																	'blockera'
																),
																value: 'rtl',
																icon: (
																	<DirectionRtlIcon />
																),
															},
														]}
														isDeselectable={true}
														defaultValue={
															attributes
																.blockeraDirection
																.default
														}
														onChange={(
															newValue,
															ref
														) =>
															handleOnChangeAttributes(
																'blockeraDirection',
																newValue,
																{ ref }
															)
														}
														{...extensionProps.blockeraDirection}
													/>
												</ControlContextProvider>
											</EditorFeatureWrapper>
										</div>
									</Flex>
								)}
							</BaseControl>
						)}

						{(isShowLetterSpacing ||
							isShowWordSpacing ||
							isShowTextIndent) && (
							<BaseControl
								controlName="spacing"
								label={__('Spacing', 'blockera')}
								columns="columns-2"
							>
								<EditorFeatureWrapper
									isActive={isShowLetterSpacing}
									config={
										extensionConfig.blockeraLetterSpacing
									}
								>
									<LetterSpacing
										block={block}
										value={values.blockeraLetterSpacing}
										onChange={handleOnChangeAttributes}
										defaultValue={
											attributes.blockeraLetterSpacing
												.default
										}
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
											columns="2fr 2.6fr"
											label={__('Words', 'blockera')}
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
											columns="2fr 2.6fr"
											label={__(
												'Text Indent',
												'blockera'
											)}
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
							</BaseControl>
						)}

						<EditorFeatureWrapper
							isActive={isShowTextOrientation}
							config={extensionConfig.blockeraTextOrientation}
						>
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										block,
										'text-orientation'
									),
									value: values.blockeraTextOrientation,
									attribute: 'blockeraTextOrientation',
									blockName: block.blockName,
								}}
							>
								<ToggleSelectControl
									label={__('Orientation', 'blockera')}
									labelDescription={
										<>
											<p>
												{__(
													'It sets the orientation of characters in vertical text layouts, pivotal for typesetting in languages that use vertical writing modes.',
													'blockera'
												)}
											</p>
											<Grid
												gap="10px"
												gridTemplateColumns="20px 1fr"
											>
												<h3
													style={{
														paddingTop: '5px',
													}}
												>
													<TextOrientationStyle1Icon />
												</h3>
												<p>
													{__(
														'Text will display vertically from left to right with a mixed orientation.',
														'blockera'
													)}
												</p>
											</Grid>

											<Grid
												gap="10px"
												gridTemplateColumns="20px 1fr"
											>
												<h3
													style={{
														paddingTop: '5px',
													}}
												>
													<TextOrientationStyle2Icon />
												</h3>
												<p>
													{__(
														'Text will display vertically from right to left with a mixed orientation.',
														'blockera'
													)}
												</p>
											</Grid>

											<Grid
												gap="10px"
												gridTemplateColumns="20px 1fr"
											>
												<h3
													style={{
														paddingTop: '5px',
													}}
												>
													<TextOrientationStyle3Icon />
												</h3>
												<p>
													{__(
														'Text will appear vertically from left to right with an upright orientation.',
														'blockera'
													)}
												</p>
											</Grid>

											<Grid
												gap="10px"
												gridTemplateColumns="20px 1fr"
											>
												<h3
													style={{
														paddingTop: '5px',
													}}
												>
													<TextOrientationStyle4Icon />
												</h3>
												<p>
													{__(
														'Text will appear vertically from right to left with an upright orientation.',
														'blockera'
													)}
												</p>
											</Grid>

											<Grid
												gap="10px"
												gridTemplateColumns="20px 1fr"
											>
												<h3
													style={{
														paddingTop: '2px',
													}}
												>
													<NoneIcon />
												</h3>
												<p>
													{__(
														'No text orientation',
														'blockera'
													)}
												</p>
											</Grid>
										</>
									}
									columns="columns-2"
									options={[
										{
											label: __(
												'Text will display vertically from left to right with a mixed orientation',
												'blockera'
											),
											value: 'style-1',
											icon: <TextOrientationStyle1Icon />,
										},
										{
											label: __(
												'Text will display vertically from right to left with a mixed orientation',
												'blockera'
											),
											value: 'style-2',
											icon: <TextOrientationStyle2Icon />,
										},
										{
											label: __(
												'Text will appear vertically from left to right with an upright orientation',
												'blockera'
											),
											value: 'style-3',
											icon: <TextOrientationStyle3Icon />,
										},
										{
											label: __(
												'Text will appear vertically from right to left with an upright orientation',
												'blockera'
											),
											value: 'style-4',
											icon: <TextOrientationStyle4Icon />,
										},
										{
											label: __(
												'No text orientation',
												'blockera'
											),
											value: 'initial',
											icon: <NoneIcon />,
										},
									]}
									isDeselectable={true}
									defaultValue={
										attributes.blockeraTextOrientation
											.default
									}
									onChange={(newValue, ref) => {
										handleOnChangeAttributes(
											'blockeraTextOrientation',
											newValue,
											{ ref }
										);
									}}
									{...extensionProps.blockeraTextOrientation}
								/>
							</ControlContextProvider>
						</EditorFeatureWrapper>

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
									name: generateExtensionId(
										block,
										'text-stroke'
									),
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
							isActive={isShowWordBreak}
							config={extensionConfig.blockeraWordBreak}
						>
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										block,
										'word-break'
									),
									value: values.blockeraWordBreak,
									attribute: 'blockeraWordBreak',
									blockName: block.blockName,
								}}
							>
								<SelectControl
									label={__('Breaking', 'blockera')}
									labelPopoverTitle={__(
										'Word Breaking',
										'blockera'
									)}
									labelDescription={
										<>
											<p>
												{__(
													'Word-Break controls how words are broken at the end of a line for influencing text wrapping and layout within containers.',
													'blockera'
												)}
											</p>
											<p>
												{__(
													'It is essential for managing text flow, especially in narrow containers or with long words/URLs, ensuring readability and a clean layout in multilingual contexts.',
													'blockera'
												)}
											</p>
											<h3>
												<BreakingNormalIcon />
												{__('Normal', 'blockera')}
											</h3>
											<p>
												{__(
													'Follows default line-breaking rules.',
													'blockera'
												)}
											</p>
											<h3>
												<BreakingBreakAllIcon />
												{__(
													'Break All Words',
													'blockera'
												)}
											</h3>
											<p>
												{__(
													'Allows words to be broken at any character, useful in narrow containers.',
													'blockera'
												)}
											</p>
											<h3>
												<BreakingNormalIcon />
												{__(
													'Keep All Words',
													'blockera'
												)}
											</h3>
											<p>
												{__(
													'Avoids breaking words, particularly for East Asian scripts.',
													'blockera'
												)}
											</p>
											<h3>
												<BreakingBreakAllIcon />
												{__('Break Word', 'blockera')}
											</h3>
											<p>
												{__(
													'Breaks words at appropriate break points, maintaining layout integrity by preventing overflow.',
													'blockera'
												)}
											</p>
											<h3>
												<InheritIcon />
												{__('Inherit', 'blockera')}
											</h3>
											<p>
												{__(
													'Follows containers line-breaking rules.',
													'blockera'
												)}
											</p>
										</>
									}
									columns="columns-2"
									options={[
										{
											label: __('Normal', 'blockera'),
											value: 'normal',
											icon: <BreakingNormalIcon />,
										},
										{
											label: __(
												'Break All Words',
												'blockera'
											),
											value: 'break-all',
											icon: <BreakingBreakAllIcon />,
										},
										{
											label: __(
												'Keep All Words',
												'blockera'
											),
											value: 'keep-all',
											icon: <BreakingNormalIcon />,
										},
										{
											label: __('Break Word', 'blockera'),
											value: 'break-word',
											icon: <BreakingBreakAllIcon />,
										},
										{
											label: __('Inherit', 'blockera'),
											value: 'inherit',
											icon: <InheritIcon />,
										},
									]}
									type="custom"
									customMenuPosition="top"
									//
									defaultValue={
										attributes.blockeraWordBreak.default
									}
									onChange={(newValue, ref) =>
										handleOnChangeAttributes(
											'blockeraWordBreak',
											newValue,
											{ ref }
										)
									}
									{...extensionProps.blockeraWordBreak}
								/>
							</ControlContextProvider>
						</EditorFeatureWrapper>
					</MoreFeatures>
				)}
			</PanelBodyControl>
		);
	},
	hasSameProps
);
