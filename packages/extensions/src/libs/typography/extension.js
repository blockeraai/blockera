// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, memo } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { isEmpty, isUndefined } from '@publisher/utils';
import {
	BaseControl,
	ColorControl,
	InputControl,
	SelectControl,
	BorderControl,
	TextShadowControl,
	ToggleSelectControl,
	ControlContextProvider,
	NoticeControl,
} from '@publisher/controls';
import { Popover, Button, Flex } from '@publisher/components';
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
} from './components';
// icons
import NoneIcon from './icons/none';
import Columns2Icon from './icons/columns-2';
import Columns3Icon from './icons/columns-3';
import Columns4Icon from './icons/columns-4';
import Columns5Icon from './icons/columns-5';
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

function getFontSizeAccurate(value: string) {
	const sizes = {
		small: '1rem',
		medium: '1.125rem',
		large: '1.75rem',
		'x-large': '2.25rem',
		'xx-large': '10rem',
	};

	if (isUndefined(sizes[value])) {
		return value;
	}

	return sizes[value];
}

export const TypographyExtension: TTypographyProps = memo<TTypographyProps>(
	({
		block,
		config,
		children,
		values: {
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
			typography: {
				fontSize: _fontSize,
				fontStyle: _fontStyle,
				//FIXME: Add fontWeight option into extension!
				// fontWeight: _fontWeight,
				textTransform: _textTransform,
				lineHeight: _lineHeight,
				letterSpacing: _letterSpacing,
				textDecoration: _textDecoration,
			},
		},
		handleOnChangeAttributes,
		...props
	}: TTypographyProps): MixedElement => {
		const {
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
		} = config;

		const [isVisible, setIsVisible] = useState(false);

		const toggleVisible = () => {
			setIsVisible((state) => !state);
		};

		const fontSizeCalculated = defaultFontSize
			? getFontSizeAccurate(defaultFontSize)
			: _fontSize;

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
									parentProps={props}
									onChange={handleOnChangeAttributes}
									value={fontSize || fontSizeCalculated}
									defaultValue={fontSizeCalculated || ''}
								/>
							)}

							{isActiveField(publisherLineHeight) && (
								<LineHeight
									block={block}
									parentProps={props}
									value={lineHeight || _lineHeight}
									onChange={handleOnChangeAttributes}
									defaultValue={_lineHeight || ''}
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
										}}
									>
										<BaseControl
											columns="columns-1"
											controlName="toggle-select"
											className="control-first label-center small-gap"
											label={__(
												'Align',
												'publisher-core'
											)}
										>
											<ToggleSelectControl
												options={[
													{
														label: __(
															'Left',
															'publisher-core'
														),
														value: 'left',
														icon: (
															<TextAlignLeftIcon />
														),
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
												value={textAlign}
												onChange={(newValue) =>
													handleOnChangeAttributes(
														'publisherTextAlign',
														newValue
													)
												}
											/>
										</BaseControl>
									</ControlContextProvider>
								)}

								<Flex direction="row" gap="10px">
									<div style={{ width: '70%' }}>
										{isActiveField(
											publisherTextDecoration
										) && (
											<TextDecoration
												block={block}
												value={
													_textDecoration ||
													textDecoration
												}
												onChange={
													handleOnChangeAttributes
												}
											/>
										)}
									</div>
									<div style={{ width: '40%' }}>
										{isActiveField(publisherFontStyle) && (
											<FontStyle
												block={block}
												value={fontStyle || _fontStyle}
												onChange={
													handleOnChangeAttributes
												}
												defaultValue={_fontStyle}
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
												}}
											>
												<BaseControl
													label={__(
														'Direction',
														'publisher-core'
													)}
													columns="columns-1"
													className="control-first label-center small-gap"
												>
													<ToggleSelectControl
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
													/>
												</BaseControl>
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
										parentProps={props}
										value={letterSpacing || _letterSpacing}
										onChange={handleOnChangeAttributes}
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
										}}
									>
										<BaseControl
											controlName="input"
											columns="2fr 2.6fr"
											label={__(
												'Words',
												'publisher-core'
											)}
										>
											<InputControl
												{...{
													...props,
													arrows: true,
													unitType: 'letter-spacing',
													step: 'any',
													defaultValue: '',
													onChange: (newValue) =>
														handleOnChangeAttributes(
															'publisherWordSpacing',
															newValue
														),
												}}
											/>
										</BaseControl>
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
										}}
									>
										<BaseControl
											controlName="input"
											columns="2fr 2.6fr"
											label={__(
												'Text Indent',
												'publisher-core'
											)}
										>
											<InputControl
												{...{
													...props,
													arrows: true,
													unitType: 'text-indent',
													defaultValue: '',
													onChange: (newValue) =>
														handleOnChangeAttributes(
															'publisherTextIndent',
															newValue
														),
												}}
											/>
										</BaseControl>
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
									}}
								>
									<ToggleSelectControl
										controlName="toggle-select"
										label={__(
											'Orientation',
											'publisher-core'
										)}
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
									}}
								>
									<BaseControl
										controlName="toggle-select"
										label={__('Columns', 'publisher-core')}
										columns="columns-2"
									>
										<ToggleSelectControl
											id={'columns'}
											options={[
												{
													label: __(
														'2 Columns Text',
														'publisher-core'
													),
													value: '2-columns',
													icon: <Columns2Icon />,
												},
												{
													label: __(
														'3 Columns Text',
														'publisher-core'
													),
													value: '3-columns',
													icon: <Columns3Icon />,
												},
												{
													label: __(
														'4 Columns Text',
														'publisher-core'
													),
													value: '4-columns',
													icon: <Columns4Icon />,
												},
												{
													label: __(
														'5 Columns Text',
														'publisher-core'
													),
													value: '5-columns',
													icon: <Columns5Icon />,
												},
												{
													label: __(
														'None',
														'publisher-core'
													),
													value: 'none',
													icon: <NoneIcon />,
												},
											]}
											isDeselectable={true}
											//
											defaultValue=""
											onChange={(newValue) => {
												if (newValue === '') {
													handleOnChangeAttributes(
														'publisherTextColumns',
														{
															columns: '',
															gap: '',
															divider: {
																width: '',
																color: '',
																style: 'solid',
															},
														}
													);
												} else {
													handleOnChangeAttributes(
														'publisherTextColumns',
														{
															...textColumns,
															columns: newValue,
														}
													);
												}
											}}
										/>
										{!isEmpty(textColumns?.columns) &&
											textColumns?.columns !== 'none' &&
											!isUndefined(
												textColumns?.columns
											) && (
												<>
													<InputControl
														id={'gap'}
														controlName="input"
														label={__(
															'Gap',
															'publisher-core'
														)}
														columns="columns-2"
														{...props}
														unitType="essential"
														range={false}
														arrows={true}
														min={0}
														max={200}
														defaultValue=""
														onChange={(newValue) =>
															handleOnChangeAttributes(
																'publisherTextColumns',
																{
																	...textColumns,
																	gap: newValue,
																}
															)
														}
													/>

													<BorderControl
														id={'divider'}
														controlName="border"
														label={__(
															'Divider',
															'publisher-core'
														)}
														columns="columns-1"
														className="control-first label-center small-gap"
														lines="vertical"
														customMenuPosition="top"
														defaultValue={{
															width: '',
															color: '',
															style: 'solid',
														}}
														onChange={(
															newValue
														) => {
															handleOnChangeAttributes(
																'publisherTextColumns',
																{
																	...textColumns,
																	divider:
																		newValue,
																}
															);
														}}
													/>
												</>
											)}
									</BaseControl>
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
									}}
								>
									<BaseControl
										label={__('Stroke', 'publisher-core')}
										columns="columns-2"
									>
										<ColorControl
											id={'color'}
											label={__(
												'Color',
												'publisher-core'
											)}
											columns="columns-2"
											defaultValue=""
											onChange={(newValue) => {
												if (newValue === '') {
													handleOnChangeAttributes(
														'publisherTextStroke',
														{
															color: '',
															width: '',
														}
													);
												} else {
													handleOnChangeAttributes(
														'publisherTextStroke',
														{
															...textStroke,
															color: newValue,
														}
													);
												}
											}}
										/>

										{textStroke.color && (
											<InputControl
												id={'width'}
												label={__(
													'Width',
													'publisher-core'
												)}
												columns="columns-2"
												{...props}
												unitType="essential"
												defaultValue="1px"
												onChange={(newValue) =>
													handleOnChangeAttributes(
														'publisherTextStroke',
														{
															...textStroke,
															width: newValue,
														}
													)
												}
											/>
										)}
									</BaseControl>
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
									}}
								>
									<SelectControl
										controlName="select"
										label={__('Breaking', 'publisher-core')}
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
						}}
					>
						<BaseControl columns="columns-1">
							<ColorControl
								controlName="color"
								label={__('Text Color', 'publisher-core')}
								columns="columns-2"
								{...props}
								defaultValue=""
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherFontColor',
										newValue
									)
								}
								controlAddonTypes={['variable']}
								variableTypes={['theme-color']}
								className={
									backgroundClip === 'text' &&
									'publisher-control-is-not-active'
								}
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
								{...props}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}
			</>
		);
	},
	hasSameProps
);
