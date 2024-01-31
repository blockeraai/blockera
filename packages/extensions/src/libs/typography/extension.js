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
	BaseControl,
	ColorControl,
	InputControl,
	SelectControl,
	PanelBodyControl,
	TextShadowControl,
	ToggleSelectControl,
	ControlContextProvider,
	NoticeControl,
} from '@publisher/controls';
import {
	FeatureWrapper,
	Flex,
	Grid,
	MoreFeatures,
} from '@publisher/components';
import { componentClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { generateExtensionId, hasSameProps } from '../utils';
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
		typographyConfig,
		values,
		display,
		backgroundClip,
		extensionProps,
		handleOnChangeAttributes,
		setSettings,
		attributes,
	}: TTypographyProps): MixedElement => {
		const isShowFontSize = isShowField(
			typographyConfig.publisherFontSize,
			values?.fontSize,
			attributes.fontSize.default
		);
		const isShowLineHeight = isShowField(
			typographyConfig.publisherLineHeight,
			values?.lineHeight,
			attributes.lineHeight.default
		);
		const isShowTextAlign = isShowField(
			typographyConfig.publisherTextAlign,
			values?.textAlign,
			attributes.textAlign.default
		);
		const isShowTextDecoration = isShowField(
			typographyConfig.publisherTextDecoration,
			values?.textDecoration,
			attributes.textDecoration.default
		);
		const isShowFontStyle = isShowField(
			typographyConfig.publisherFontStyle,
			values?.fontStyle,
			attributes.fontStyle.default
		);
		const isShowTextTransform = isShowField(
			typographyConfig.publisherTextTransform,
			values?.textTransform,
			attributes.textTransform.default
		);
		const isShowDirection = isShowField(
			typographyConfig.publisherDirection,
			values?.direction,
			attributes.direction.default
		);
		const isShowLetterSpacing = isShowField(
			typographyConfig.publisherLetterSpacing,
			values?.letterSpacing,
			attributes.letterSpacing.default
		);
		const isShowWordSpacing = isShowField(
			typographyConfig.publisherWordSpacing,
			values?.wordSpacing,
			attributes.wordSpacing.default
		);
		const isShowTextIndent = isShowField(
			typographyConfig.publisherTextIndent,
			values?.textIndent,
			attributes.textIndent.default
		);
		const isShowTextOrientation = isShowField(
			typographyConfig.publisherTextOrientation,
			values?.textOrientation,
			attributes.textOrientation.default
		);
		const isShowTextStroke = isShowField(
			typographyConfig.publisherTextStroke,
			values?.textStroke,
			attributes.textStroke.default
		);
		const isShowTextColumns = isShowField(
			typographyConfig.publisherTextColumns,
			values?.textColumns,
			attributes.textColumns.default
		);
		const isShowWordBreak = isShowField(
			typographyConfig.publisherWordBreak,
			values?.wordBreak,
			attributes.wordBreak.default
		);
		const isShowFontColor = isShowField(
			typographyConfig.publisherFontColor,
			values?.fontColor,
			attributes.fontColor.default
		);
		const isShowTextShadow = isShowField(
			typographyConfig.publisherTextShadow,
			values?.textShadow,
			attributes.textShadow.default
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
				values?.textAlign !== attributes.textAlign.default ||
				values?.textDecoration !== attributes.textDecoration.default ||
				values?.fontStyle !== attributes.fontStyle.default ||
				values?.textTransform !== attributes.textTransform.default ||
				values?.direction !== attributes.direction.default ||
				values?.letterSpacing !== attributes.letterSpacing.default ||
				values?.wordSpacing !== attributes.wordSpacing.default ||
				values?.textIndent !== attributes.textIndent.default ||
				values?.textColumns !== attributes.textColumns.default ||
				values?.textStroke !== attributes.textStroke.default ||
				values?.wordBreak !== attributes.wordBreak.default;
		}

		return (
			<PanelBodyControl
				title={__('Typography', 'publisher-core')}
				initialOpen={true}
				icon={<TypographyExtensionIcon />}
				className={componentClassNames(
					'extension',
					'extension-typography'
				)}
			>
				<ExtensionSettings
					features={typographyConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'typographyConfig');
					}}
				/>

				{isShowFontSize && isShowLineHeight ? (
					<BaseControl
						columns="columns-2"
						label={__('Size', 'publisher-core')}
					>
						<Flex alignItems="flex-start">
							<FeatureWrapper
								isActive={isShowFontSize}
								isActiveOnStates={
									typographyConfig.publisherFontSize
										.isActiveOnStates
								}
								isActiveOnBreakpoints={
									typographyConfig.publisherFontSize
										.isActiveOnBreakpoints
								}
							>
								<FontSize
									block={block}
									onChange={handleOnChangeAttributes}
									value={values.fontSize}
									defaultValue={attributes.fontSize.default}
									columns="columns-1"
									className="control-first label-center small-gap"
									style={{ margin: '0px' }}
									{...extensionProps.publisherFontSize}
								/>
							</FeatureWrapper>

							<FeatureWrapper
								isActive={isShowLineHeight}
								isActiveOnStates={
									typographyConfig.publisherLineHeight
										.isActiveOnStates
								}
								isActiveOnBreakpoints={
									typographyConfig.publisherLineHeight
										.isActiveOnBreakpoints
								}
							>
								<LineHeight
									block={block}
									value={values.lineHeight}
									onChange={handleOnChangeAttributes}
									defaultValue={attributes.lineHeight.default}
									columns="columns-1"
									className="control-first label-center small-gap"
									style={{ margin: '0px' }}
									{...extensionProps.publisherLineHeight}
								/>
							</FeatureWrapper>
						</Flex>
					</BaseControl>
				) : (
					<>
						<FeatureWrapper
							isActive={isShowFontSize}
							isActiveOnStates={
								typographyConfig.publisherFontSize
									.isActiveOnStates
							}
							isActiveOnBreakpoints={
								typographyConfig.publisherFontSize
									.isActiveOnBreakpoints
							}
						>
							<FontSize
								block={block}
								onChange={handleOnChangeAttributes}
								value={values.fontSize}
								defaultValue={attributes.fontSize.default}
								{...extensionProps.publisherFontSize}
							/>
						</FeatureWrapper>

						<FeatureWrapper
							isActive={isShowLineHeight}
							isActiveOnStates={
								typographyConfig.publisherLineHeight
									.isActiveOnStates
							}
							isActiveOnBreakpoints={
								typographyConfig.publisherLineHeight
									.isActiveOnBreakpoints
							}
						>
							<LineHeight
								block={block}
								value={values.lineHeight}
								onChange={handleOnChangeAttributes}
								defaultValue={attributes.lineHeight.default}
								{...extensionProps.publisherLineHeight}
							/>
						</FeatureWrapper>
					</>
				)}

				<FeatureWrapper
					isActive={isShowFontColor}
					isActiveOnStates={
						typographyConfig.publisherFontColor.isActiveOnStates
					}
					isActiveOnBreakpoints={
						typographyConfig.publisherFontColor
							.isActiveOnBreakpoints
					}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'font-color'),
							value: values.fontColor,
							attribute: 'publisherFontColor',
							blockName: block.blockName,
						}}
					>
						<BaseControl columns="columns-1">
							<ColorControl
								controlName="color"
								label={__('Text Color', 'publisher-core')}
								labelDescription={
									<>
										<p>
											{__(
												'It sets the color of the text within the block, playing a crucial role in enhancing readability, attracting attention, and maintaining consistent branding.',
												'publisher-core'
											)}
										</p>
									</>
								}
								columns="columns-2"
								defaultValue={attributes.fontColor.default}
								onChange={(newValue, ref) =>
									handleOnChangeAttributes(
										'publisherFontColor',
										newValue,
										{ ref }
									)
								}
								controlAddonTypes={['variable']}
								variableTypes={['color']}
								className={
									backgroundClip === 'text' &&
									'publisher-control-is-not-active'
								}
								{...extensionProps.publisherFontColor}
							/>

							{backgroundClip === 'text' && (
								<NoticeControl type="information">
									{__(
										`Text clipping was applied; the current text color won't display. You have to disable clipping settings to use Text Color.`,
										'publisher-core'
									)}
								</NoticeControl>
							)}
						</BaseControl>
					</ControlContextProvider>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowTextShadow}
					isActiveOnStates={
						typographyConfig.publisherTextShadow.isActiveOnStates
					}
					isActiveOnBreakpoints={
						typographyConfig.publisherTextShadow
							.isActiveOnBreakpoints
					}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'text-shadow'),
							value: values.textShadow,
							attribute: 'publisherTextShadow',
							blockName: block.blockName,
						}}
						storeName={'publisher-core/controls/repeater'}
					>
						<BaseControl
							controlName="text-shadow"
							columns="columns-1"
						>
							<TextShadowControl
								label={__('Text Shadows', 'publisher-core')}
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherTextShadow',
										newValue
									)
								}
								defaultValue={attributes.textShadow.default}
								{...extensionProps.publisherTextShadow}
							/>
						</BaseControl>
					</ControlContextProvider>
				</FeatureWrapper>

				{isShowAdvanced && (
					<MoreFeatures isOpen={false} isChanged={isAdvancedEdited}>
						{(isShowTextAlign ||
							isShowTextDecoration ||
							isShowFontStyle ||
							isShowTextTransform ||
							isShowDirection) && (
							<BaseControl
								controlName="style"
								columns="columns-1"
							>
								<FeatureWrapper
									isActive={isShowTextAlign}
									isActiveOnStates={
										typographyConfig.publisherTextAlign
											.isActiveOnStates
									}
									isActiveOnBreakpoints={
										typographyConfig.publisherTextAlign
											.isActiveOnBreakpoints
									}
								>
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'text-align'
											),
											value: values.textAlign,
											attribute: 'publisherTextAlign',
											blockName: block.blockName,
										}}
									>
										<ToggleSelectControl
											columns="columns-1"
											className="control-first label-center small-gap"
											label={__(
												'Text Align',
												'publisher-core'
											)}
											labelDescription={
												<>
													<p>
														{__(
															'It sets the horizontal alignment of text within the block, offering alignment options like left, right, center, and justify.',
															'publisher-core'
														)}
													</p>
												</>
											}
											options={[
												{
													label: __(
														'Left',
														'publisher-core'
													),
													value: 'left',
													icon: <TextAlignLeftIcon />,
												},
												{
													label: __(
														'Center',
														'publisher-core'
													),
													value: 'center',
													icon: (
														<TextAlignCenterIcon />
													),
												},
												{
													label: __(
														'Right',
														'publisher-core'
													),
													value: 'right',
													icon: (
														<TextAlignRightIcon />
													),
												},
												{
													label: __(
														'Justify',
														'publisher-core'
													),
													value: 'justify',
													icon: (
														<TextAlignJustifyIcon />
													),
												},
												{
													label: __(
														'None',
														'publisher-core'
													),
													value: 'initial',
													icon: <NoneIcon />,
												},
											]}
											isDeselectable={true}
											defaultValue={
												attributes.textAlign.default
											}
											onChange={(newValue, ref) =>
												handleOnChangeAttributes(
													'publisherTextAlign',
													newValue,
													{ ref }
												)
											}
											{...extensionProps.publisherTextAlign}
										/>
									</ControlContextProvider>
								</FeatureWrapper>

								{(isShowTextDecoration || isShowDirection) && (
									<Flex direction="row" gap="10px">
										<div style={{ width: '70%' }}>
											<FeatureWrapper
												isActive={isShowTextDecoration}
												isActiveOnStates={
													typographyConfig
														.publisherTextDecoration
														.isActiveOnStates
												}
												isActiveOnBreakpoints={
													typographyConfig
														.publisherTextDecoration
														.isActiveOnBreakpoints
												}
											>
												<TextDecoration
													block={block}
													value={
														values.textDecoration
													}
													defaultValue={
														attributes
															.textDecoration
															.default
													}
													onChange={
														handleOnChangeAttributes
													}
													{...extensionProps.publisherTextDecoration}
												/>
											</FeatureWrapper>
										</div>

										<div style={{ width: '40%' }}>
											<FeatureWrapper
												isActive={isShowFontStyle}
												isActiveOnStates={
													typographyConfig
														.publisherFontStyle
														.isActiveOnStates
												}
												isActiveOnBreakpoints={
													typographyConfig
														.publisherFontStyle
														.isActiveOnBreakpoints
												}
											>
												<FontStyle
													block={block}
													value={values.fontStyle}
													onChange={
														handleOnChangeAttributes
													}
													defaultValue={
														attributes.fontStyle
															.default
													}
													{...extensionProps.publisherFontStyle}
												/>
											</FeatureWrapper>
										</div>
									</Flex>
								)}

								{(isShowTextTransform || isShowDirection) && (
									<Flex direction="row" gap="10px">
										<div style={{ width: '70%' }}>
											<FeatureWrapper
												isActive={isShowTextTransform}
												isActiveOnStates={
													typographyConfig
														.publisherTextTransform
														.isActiveOnStates
												}
												isActiveOnBreakpoints={
													typographyConfig
														.publisherTextTransform
														.isActiveOnBreakpoints
												}
											>
												<TextTransform
													block={block}
													value={values.textTransform}
													defaultValue={
														attributes.textTransform
															.default
													}
													onChange={
														handleOnChangeAttributes
													}
													{...extensionProps.publisherTextTransform}
												/>
											</FeatureWrapper>
										</div>

										<div style={{ width: '40%' }}>
											<FeatureWrapper
												isActive={isShowDirection}
												isActiveOnStates={
													typographyConfig
														.publisherDirection
														.isActiveOnStates
												}
												isActiveOnBreakpoints={
													typographyConfig
														.publisherDirection
														.isActiveOnBreakpoints
												}
											>
												<ControlContextProvider
													value={{
														name: generateExtensionId(
															block,
															'direction'
														),
														value: values.direction,
														attribute:
															'publisherDirection',
														blockName:
															block.blockName,
													}}
												>
													<ToggleSelectControl
														label={__(
															'Direction',
															'publisher-core'
														)}
														labelPopoverTitle={__(
															'Text Direction',
															'publisher-core'
														)}
														labelDescription={
															<>
																<p>
																	{__(
																		'It sets the text direction and layout directionality of block.',
																		'publisher-core'
																	)}
																</p>
																<h3>
																	<DirectionLtrIcon />
																	{__(
																		'LTR',
																		'publisher-core'
																	)}
																</h3>
																<p>
																	{__(
																		'Sets the direction of text from left to right, used for languages written in this manner.',
																		'publisher-core'
																	)}
																</p>
																<h3>
																	<DirectionRtlIcon />
																	{__(
																		'RTL',
																		'publisher-core'
																	)}
																</h3>
																<p>
																	{__(
																		' Sets the direction from right to left, essential for languages such as Arabic, Farsi and Hebrew.',
																		'publisher-core'
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
																	'publisher-core'
																),
																value: 'ltr',
																icon: (
																	<DirectionLtrIcon />
																),
															},
															{
																label: __(
																	'Right to Left',
																	'publisher-core'
																),
																value: 'rtl',
																icon: (
																	<DirectionRtlIcon />
																),
															},
														]}
														isDeselectable={true}
														//
														defaultValue={
															attributes.direction
																.default
														}
														onChange={(
															newValue,
															ref
														) =>
															handleOnChangeAttributes(
																'publisherDirection',
																newValue,
																{ ref }
															)
														}
														{...extensionProps.publisherDirection}
													/>
												</ControlContextProvider>
											</FeatureWrapper>
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
								label={__('Spacing', 'publisher-core')}
								columns="columns-2"
							>
								<FeatureWrapper
									isActive={isShowLetterSpacing}
									isActiveOnStates={
										typographyConfig.publisherLetterSpacing
											.isActiveOnStates
									}
									isActiveOnBreakpoints={
										typographyConfig.publisherLetterSpacing
											.isActiveOnBreakpoints
									}
								>
									<LetterSpacing
										block={block}
										value={values.letterSpacing}
										onChange={handleOnChangeAttributes}
										defaultValue=""
										{...extensionProps.publisherLetterSpacing}
									/>
								</FeatureWrapper>

								<FeatureWrapper
									isActive={isShowWordSpacing}
									isActiveOnStates={
										typographyConfig.publisherWordSpacing
											.isActiveOnStates
									}
									isActiveOnBreakpoints={
										typographyConfig.publisherWordSpacing
											.isActiveOnBreakpoints
									}
								>
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'word-spacing'
											),
											value: values.wordSpacing,
											attribute: 'publisherWordSpacing',
											blockName: block.blockName,
										}}
									>
										<InputControl
											columns="2fr 2.6fr"
											label={__(
												'Words',
												'publisher-core'
											)}
											labelPopoverTitle={__(
												'Words Spacing',
												'publisher-core'
											)}
											labelDescription={
												<>
													<p>
														{__(
															'It sets the space between words in text content, an essential tool for enhancing readability and typographic aesthetics, particularly in text-heavy layouts.',
															'publisher-core'
														)}
													</p>
												</>
											}
											arrows={true}
											unitType="letter-spacing"
											defaultValue=""
											onChange={(newValue, ref) =>
												handleOnChangeAttributes(
													'publisherWordSpacing',
													newValue,
													{ ref }
												)
											}
											{...extensionProps.publisherWordSpacing}
										/>
									</ControlContextProvider>
								</FeatureWrapper>

								<FeatureWrapper
									isActive={isShowTextIndent}
									isActiveOnStates={
										typographyConfig.publisherTextIndent
											.isActiveOnStates
									}
									isActiveOnBreakpoints={
										typographyConfig.publisherTextIndent
											.isActiveOnBreakpoints
									}
								>
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'text-indent'
											),
											value: values.textIndent,
											attribute: 'publisherTextIndent',
											blockName: block.blockName,
										}}
									>
										<InputControl
											columns="2fr 2.6fr"
											label={__(
												'Text Indent',
												'publisher-core'
											)}
											labelDescription={
												<>
													<p>
														{__(
															'It sets the indentation of the first line in a text block, offering a stylistic tool for enhancing text layout and readability, especially in paragraphs and articles.',
															'publisher-core'
														)}
													</p>
												</>
											}
											arrows={true}
											unitType="text-indent"
											defaultValue=""
											onChange={(newValue, ref) =>
												handleOnChangeAttributes(
													'publisherTextIndent',
													newValue,
													{ ref }
												)
											}
											{...extensionProps.publisherTextIndent}
										/>
									</ControlContextProvider>
								</FeatureWrapper>
							</BaseControl>
						)}

						<FeatureWrapper
							isActive={isShowTextOrientation}
							isActiveOnStates={
								typographyConfig.publisherTextOrientation
									.isActiveOnStates
							}
							isActiveOnBreakpoints={
								typographyConfig.publisherTextOrientation
									.isActiveOnBreakpoints
							}
						>
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										block,
										'text-orientation'
									),
									value: values.textOrientation,
									attribute: 'publisherTextOrientation',
									blockName: block.blockName,
								}}
							>
								<ToggleSelectControl
									controlName="toggle-select"
									label={__('Orientation', 'publisher-core')}
									labelDescription={
										<>
											<p>
												{__(
													'It sets the orientation of characters in vertical text layouts, pivotal for typesetting in languages that use vertical writing modes.',
													'publisher-core'
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
														'publisher-core'
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
														'publisher-core'
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
														'publisher-core'
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
														'publisher-core'
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
														'publisher-core'
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
												'publisher-core'
											),
											value: 'style-1',
											icon: <TextOrientationStyle1Icon />,
										},
										{
											label: __(
												'Text will display vertically from right to left with a mixed orientation',
												'publisher-core'
											),
											value: 'style-2',
											icon: <TextOrientationStyle2Icon />,
										},
										{
											label: __(
												'Text will appear vertically from left to right with an upright orientation',
												'publisher-core'
											),
											value: 'style-3',
											icon: <TextOrientationStyle3Icon />,
										},
										{
											label: __(
												'Text will appear vertically from right to left with an upright orientation',
												'publisher-core'
											),
											value: 'style-4',
											icon: <TextOrientationStyle4Icon />,
										},
										{
											label: __(
												'No text orientation',
												'publisher-core'
											),
											value: 'initial',
											icon: <NoneIcon />,
										},
									]}
									isDeselectable={true}
									//
									defaultValue={
										attributes.textOrientation.default
									}
									onChange={(newValue, ref) => {
										handleOnChangeAttributes(
											'publisherTextOrientation',
											newValue,
											{ ref }
										);
									}}
									{...extensionProps.publisherTextOrientation}
								/>
							</ControlContextProvider>
						</FeatureWrapper>

						<FeatureWrapper
							isActive={isShowTextColumns}
							isActiveOnStates={
								typographyConfig.publisherTextColumns
									.isActiveOnStates
							}
							isActiveOnBreakpoints={
								typographyConfig.publisherTextColumns
									.isActiveOnBreakpoints
							}
						>
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										block,
										'text-columns'
									),
									value: values.textColumns,
									type: 'nested',
									attribute: 'publisherTextColumns',
									blockName: block.blockName,
								}}
							>
								<TextColumns
									value={values.textColumns}
									display={display}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
									defaultValue={
										attributes.textColumns.default
									}
									{...extensionProps.publisherTextColumns}
								/>
							</ControlContextProvider>
						</FeatureWrapper>

						<FeatureWrapper
							isActive={isShowTextStroke}
							isActiveOnStates={
								typographyConfig.publisherTextStroke
									.isActiveOnStates
							}
							isActiveOnBreakpoints={
								typographyConfig.publisherTextStroke
									.isActiveOnBreakpoints
							}
						>
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										block,
										'text-stroke'
									),
									value: values.textStroke,
									type: 'nested',
									attribute: 'publisherTextStroke',
									blockName: block.blockName,
								}}
							>
								<TextStroke
									value={values.textStroke}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
									defaultValue={attributes.textStroke.default}
									{...extensionProps.publisherTextStroke}
								/>
							</ControlContextProvider>
						</FeatureWrapper>

						<FeatureWrapper
							isActive={isShowWordBreak}
							isActiveOnStates={
								typographyConfig.publisherWordBreak
									.isActiveOnStates
							}
							isActiveOnBreakpoints={
								typographyConfig.publisherWordBreak
									.isActiveOnBreakpoints
							}
						>
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										block,
										'word-break'
									),
									value: values.wordBreak,
									attribute: 'publisherWordBreak',
									blockName: block.blockName,
								}}
							>
								<SelectControl
									controlName="select"
									label={__('Breaking', 'publisher-core')}
									labelPopoverTitle={__(
										'Word Breaking',
										'publisher-core'
									)}
									labelDescription={
										<>
											<p>
												{__(
													'Word-Break controls how words are broken at the end of a line for influencing text wrapping and layout within containers.',
													'publisher-core'
												)}
											</p>
											<p>
												{__(
													'It is essential for managing text flow, especially in narrow containers or with long words/URLs, ensuring readability and a clean layout in multilingual contexts.',
													'publisher-core'
												)}
											</p>
											<h3>
												<BreakingNormalIcon />
												{__('Normal', 'publisher-core')}
											</h3>
											<p>
												{__(
													'Follows default line-breaking rules.',
													'publisher-core'
												)}
											</p>
											<h3>
												<BreakingBreakAllIcon />
												{__(
													'Break All Words',
													'publisher-core'
												)}
											</h3>
											<p>
												{__(
													'Allows words to be broken at any character, useful in narrow containers.',
													'publisher-core'
												)}
											</p>
											<h3>
												<BreakingNormalIcon />
												{__(
													'Keep All Words',
													'publisher-core'
												)}
											</h3>
											<p>
												{__(
													'Avoids breaking words, particularly for East Asian scripts.',
													'publisher-core'
												)}
											</p>
											<h3>
												<BreakingBreakAllIcon />
												{__(
													'Break Word',
													'publisher-core'
												)}
											</h3>
											<p>
												{__(
													'Breaks words at appropriate break points, maintaining layout integrity by preventing overflow.',
													'publisher-core'
												)}
											</p>
											<h3>
												<InheritIcon />
												{__(
													'Inherit',
													'publisher-core'
												)}
											</h3>
											<p>
												{__(
													'Follows containers line-breaking rules.',
													'publisher-core'
												)}
											</p>
										</>
									}
									columns="columns-2"
									options={[
										{
											label: __(
												'Normal',
												'publisher-core'
											),
											value: 'normal',
											icon: <BreakingNormalIcon />,
										},
										{
											label: __(
												'Break All Words',
												'publisher-core'
											),
											value: 'break-all',
											icon: <BreakingBreakAllIcon />,
										},
										{
											label: __(
												'Keep All Words',
												'publisher-core'
											),
											value: 'keep-all',
											icon: <BreakingNormalIcon />,
										},
										{
											label: __(
												'Break Word',
												'publisher-core'
											),
											value: 'break-word',
											icon: <BreakingBreakAllIcon />,
										},
										{
											label: __(
												'Inherit',
												'publisher-core'
											),
											value: 'inherit',
											icon: <InheritIcon />,
										},
									]}
									type="custom"
									customMenuPosition="top"
									//
									defaultValue={attributes.wordBreak.default}
									onChange={(newValue, ref) =>
										handleOnChangeAttributes(
											'publisherWordBreak',
											newValue,
											{ ref }
										)
									}
									{...extensionProps.publisherWordBreak}
								/>
							</ControlContextProvider>
						</FeatureWrapper>
					</MoreFeatures>
				)}
			</PanelBodyControl>
		);
	},
	hasSameProps
);
