// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	ColorControl,
	InputControl,
	SelectControl,
	TextShadowControl,
	ToggleSelectControl,
	ControlContextProvider,
	NoticeControl,
} from '@publisher/controls';
import { Popover, Button, Flex, Grid } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
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
// icons
import NoneIcon from './icons/none';
import InheritIcon from '../../icons/inherit';
import DirectionRtlIcon from './icons/direction-rtl';
import DirectionLtrIcon from './icons/direction-ltr';
import TextAlignLeftIcon from './icons/text-align-left';
import BreakingNormalIcon from './icons/breaking-normal';
import TextAlignRightIcon from './icons/text-align-right';
import TextAlignCenterIcon from './icons/text-align-center';
import TypographyButtonIcon from './icons/typography-button';
import BreakingBreakAllIcon from './icons/breaking-break-all';
import TextAlignJustifyIcon from './icons/text-align-justify';
import TextOrientationStyle1Icon from './icons/text-orientation-style-1';
import TextOrientationStyle2Icon from './icons/text-orientation-style-2';
import TextOrientationStyle3Icon from './icons/text-orientation-style-3';
import TextOrientationStyle4Icon from './icons/text-orientation-style-4';
import PenIcon from './icons/pen';

export const TypographyExtension: ComponentType<TTypographyProps> = memo(
	({
		block,
		typographyConfig: {
			publisherFontColor,
			publisherTextShadow,
			publisherFontSize,
			publisherLineHeight,
			publisherTextAlign,
			publisherTextDecoration,
			publisherFontStyle,
			publisherTextTransform,
			publisherDirection,
			publisherLetterSpacing,
			publisherWordSpacing,
			publisherTextIndent,
			publisherTextOrientation,
			publisherTextColumns,
			publisherTextStroke,
			publisherWordBreak,
		},
		values: {
			display,
			fontSize,
			textAlign,
			fontStyle,
			direction,
			fontColor,
			wordBreak,
			textIndent,
			textShadow,
			lineHeight,
			wordSpacing,
			textColumns,
			textTransform,
			letterSpacing,
			textDecoration,
			textOrientation,
			textStroke,
		},
		backgroundClip,
		defaultValue: {
			fontSize: defaultFontSize,
			fontStyle: defaultFontStyle,
			typography: {
				//FIXME: Add fontWeight option into extension!
				// fontWeight: _fontWeight,
				textTransform: _textTransform,
				lineHeight: _lineHeight,
				letterSpacing: _letterSpacing,
				textDecoration: _textDecoration,
			},
		},
		extensionProps,
		handleOnChangeAttributes,
	}: TTypographyProps): MixedElement => {
		const [isVisible, setIsVisible] = useState(false);

		const toggleVisible = () => {
			setIsVisible((state) => !state);
		};

		return (
			<>
				<BaseControl
					controlName="typography"
					label={__('Typography', 'publisher-core')}
					columns="columns-2"
				>
					<Button
						size="input"
						isFocus={isVisible}
						contentAlign="left"
						onClick={() => {
							toggleVisible();
						}}
					>
						<TypographyButtonIcon />
						{__('Customize', 'publisher-core')}
						<PenIcon style={{ marginLeft: 'auto' }} />
					</Button>

					{isVisible && (
						<Popover
							title={__('Typography', 'publisher-core')}
							offset={125}
							placement="left-start"
							className={controlInnerClassNames(
								'typography-popover'
							)}
							onClose={() => {
								setIsVisible(false);
							}}
						>
							{isActiveField(publisherFontSize) && (
								<FontSize
									block={block}
									onChange={handleOnChangeAttributes}
									value={fontSize || defaultFontSize}
									defaultValue={''}
									{...extensionProps.publisherFontSize}
								/>
							)}

							{isActiveField(publisherLineHeight) && (
								<LineHeight
									block={block}
									value={lineHeight || _lineHeight}
									onChange={handleOnChangeAttributes}
									defaultValue={_lineHeight || ''}
									{...extensionProps.publisherLineHeight}
								/>
							)}

							<BaseControl
								controlName="style"
								columns="columns-1"
							>
								{isActiveField(publisherTextAlign) && (
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'text-align'
											),
											value: textAlign,
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
											//
											defaultValue=""
											onChange={(newValue) =>
												handleOnChangeAttributes(
													'publisherTextAlign',
													newValue
												)
											}
											{...extensionProps.publisherTextAlign}
										/>
									</ControlContextProvider>
								)}

								<Flex direction="row" gap="10px">
									<div style={{ width: '70%' }}>
										{isActiveField(
											publisherTextDecoration
										) && (
											<TextDecoration
												block={block}
												value={textDecoration}
												defaultValue={_textDecoration}
												onChange={
													handleOnChangeAttributes
												}
												{...extensionProps.publisherTextDecoration}
											/>
										)}
									</div>
									<div style={{ width: '40%' }}>
										{isActiveField(publisherFontStyle) && (
											<FontStyle
												block={block}
												value={
													fontStyle ||
													defaultFontStyle
												}
												onChange={
													handleOnChangeAttributes
												}
												defaultValue={defaultFontStyle}
												{...extensionProps.publisherFontStyle}
											/>
										)}
									</div>
								</Flex>

								<Flex direction="row" gap="10px">
									<div style={{ width: '70%' }}>
										{isActiveField(
											publisherTextTransform
										) && (
											<TextTransform
												block={block}
												value={
													textTransform ||
													_textTransform
												}
												onChange={
													handleOnChangeAttributes
												}
												{...extensionProps.publisherTextTransform}
											/>
										)}
									</div>
									<div style={{ width: '40%' }}>
										{isActiveField(publisherDirection) && (
											<ControlContextProvider
												value={{
													name: generateExtensionId(
														block,
														'direction'
													),
													value: direction,
													attribute:
														'publisherDirection',
													blockName: block.blockName,
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
													defaultValue=""
													onChange={(newValue) =>
														handleOnChangeAttributes(
															'publisherDirection',
															newValue
														)
													}
													{...extensionProps.publisherDirection}
												/>
											</ControlContextProvider>
										)}
									</div>
								</Flex>
							</BaseControl>

							<BaseControl
								controlName="spacing"
								label={__('Spacing', 'publisher-core')}
								columns="columns-2"
							>
								{isActiveField(publisherLetterSpacing) && (
									<LetterSpacing
										block={block}
										value={letterSpacing || _letterSpacing}
										onChange={handleOnChangeAttributes}
										{...extensionProps.publisherLetterSpacing}
									/>
								)}

								{isActiveField(publisherWordSpacing) && (
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'word-spacing'
											),
											value: wordSpacing,
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
											onChange={(newValue) =>
												handleOnChangeAttributes(
													'publisherWordSpacing',
													newValue
												)
											}
											{...extensionProps.publisherWordSpacing}
										/>
									</ControlContextProvider>
								)}

								{isActiveField(publisherTextIndent) && (
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'text-indent'
											),
											value: textIndent,
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
											onChange={(newValue) =>
												handleOnChangeAttributes(
													'publisherTextIndent',
													newValue
												)
											}
											{...extensionProps.publisherTextIndent}
										/>
									</ControlContextProvider>
								)}
							</BaseControl>

							{isActiveField(publisherTextOrientation) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'text-orientation'
										),
										value: textOrientation,
										attribute: 'publisherTextOrientation',
										blockName: block.blockName,
									}}
								>
									<ToggleSelectControl
										controlName="toggle-select"
										label={__(
											'Orientation',
											'publisher-core'
										)}
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
												icon: (
													<TextOrientationStyle1Icon />
												),
											},
											{
												label: __(
													'Text will display vertically from right to left with a mixed orientation',
													'publisher-core'
												),
												value: 'style-2',
												icon: (
													<TextOrientationStyle2Icon />
												),
											},
											{
												label: __(
													'Text will appear vertically from left to right with an upright orientation',
													'publisher-core'
												),
												value: 'style-3',
												icon: (
													<TextOrientationStyle3Icon />
												),
											},
											{
												label: __(
													'Text will appear vertically from right to left with an upright orientation',
													'publisher-core'
												),
												value: 'style-4',
												icon: (
													<TextOrientationStyle4Icon />
												),
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
										defaultValue=""
										onChange={(newValue) => {
											if (!newValue) return;

											let textOriented;
											switch (newValue) {
												case 'style-1':
													textOriented = {
														'writing-mode':
															'vertical-lr',
														'text-orientation':
															'mixed',
													};
													break;
												case 'style-2':
													textOriented = {
														'writing-mode':
															'vertical-rl',
														'text-orientation':
															'mixed',
													};
													break;
												case 'style-3':
													textOriented = {
														'writing-mode':
															'vertical-lr',
														'text-orientation':
															'upright',
													};
													break;
												case 'style-4':
													textOriented = {
														'writing-mode':
															'vertical-rl',
														'text-orientation':
															'upright',
													};
													break;
												case 'initial':
													textOriented = {
														'writing-mode':
															'horizontal-tb',
														'text-orientation':
															'mixed',
													};
											}

											handleOnChangeAttributes(
												'publisherTextOrientation',
												textOriented
											);
										}}
										{...extensionProps.publisherTextOrientation}
									/>
								</ControlContextProvider>
							)}

							{isActiveField(publisherTextColumns) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'text-columns'
										),
										value: textColumns,
										type: 'nested',
										attribute: 'publisherTextColumns',
										blockName: block.blockName,
									}}
								>
									<TextColumns
										value={textColumns}
										display={display}
										handleOnChangeAttributes={
											handleOnChangeAttributes
										}
										{...extensionProps.publisherTextColumns}
									/>
								</ControlContextProvider>
							)}

							{isActiveField(publisherTextStroke) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'text-stroke'
										),
										value: textStroke,
										type: 'nested',
										attribute: 'publisherTextStroke',
										blockName: block.blockName,
									}}
								>
									<TextStroke
										value={textStroke}
										handleOnChangeAttributes={
											handleOnChangeAttributes
										}
										{...extensionProps.publisherTextStroke}
									/>
								</ControlContextProvider>
							)}

							{isActiveField(publisherWordBreak) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'word-break'
										),
										value: wordBreak,
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
													{__(
														'Normal',
														'publisher-core'
													)}
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
										defaultValue="normal"
										onChange={(newValue) =>
											handleOnChangeAttributes(
												'publisherWordBreak',
												newValue
											)
										}
										{...extensionProps.publisherWordBreak}
									/>
								</ControlContextProvider>
							)}
						</Popover>
					)}
				</BaseControl>

				{isActiveField(publisherFontColor) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'font-color'),
							value: fontColor,
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
								defaultValue=""
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherFontColor',
										newValue
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
				)}

				{isActiveField(publisherTextShadow) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'text-shadow'),
							value: textShadow,
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
								{...extensionProps.publisherTextShadow}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}
			</>
		);
	},
	hasSameProps
);
