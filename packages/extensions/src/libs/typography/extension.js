/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	BorderField,
	ColorField,
	Field,
	InputField,
	SelectField,
	TextShadowField,
	ToggleSelectField,
} from '@publisher/fields';
import { isEmpty, isUndefined } from '@publisher/utils';
import { ControlContextProvider } from '@publisher/controls';
import { Popover, Button, Flex } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../utils';
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';
// icons
import NoneIcon from './icons/none';
import TypographyButtonIcon from './icons/typography-button';
import TextAlignLeftIcon from './icons/text-align-left';
import TextAlignCenterIcon from './icons/text-align-center';
import TextAlignRightIcon from './icons/text-align-right';
import TextAlignJustifyIcon from './icons/text-align-justify';
import TextDecorationLineThroughIcon from './icons/text-dectoration-line-through';
import TextDecorationOverlineIcon from './icons/text-decoration-overline';
import TextDecorationUnderlineIcon from './icons/text-decoration-underline';
import FontStyleNormalIcon from './icons/font-style-normal';
import FontStyleItalicIcon from './icons/font-style-italic';
import TextTransformCapitalizeIcon from './icons/text-transform-capitalize';
import TextTransformUppercaseIcon from './icons/text-transform-uppercase';
import TextTransformLowercaseIcon from './icons/text-transform-lowercase';
import DirectionRtlIcon from './icons/direction-rtl';
import DirectionLtrIcon from './icons/direction-ltr';
import TextOrientationStyle1Icon from './icons/text-orientation-style-1';
import TextOrientationStyle2Icon from './icons/text-orientation-style-2';
import TextOrientationStyle3Icon from './icons/text-orientation-style-3';
import TextOrientationStyle4Icon from './icons/text-orientation-style-4';
import Columns2Icon from './icons/columns-2';
import Columns3Icon from './icons/columns-3';
import Columns4Icon from './icons/columns-4';
import Columns5Icon from './icons/columns-5';
import BreakingNormalIcon from './icons/breaking-normal';
import BreakingBreakAllIcon from './icons/breaking-break-all';
import InheritIcon from '../../icons/inherit';

export function TypographyExtension({ children, config, ...props }) {
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
			publisherTextStrokeColor,
			publisherWordBreak,
		},
	} = config;

	const { attributes, setAttributes } = useContext(BlockEditContext);

	const [isVisible, setIsVisible] = useState(false);

	const toggleVisible = () => {
		setIsVisible((state) => !state);
	};

	return (
		<>
			<Field
				field="typography"
				label={__('Typography', 'publisher-core')}
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
						className={controlInnerClassNames('typography-popover')}
						onClose={() => {
							setIsVisible(false);
						}}
					>
						{isActiveField(publisherFontSize) && (
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										props,
										'font-size'
									),
									value: attributes.publisherFontSize,
								}}
							>
								<InputField
									label={__('Font Size', 'publisher-core')}
									settings={{
										type: 'css',
										unitType: 'essential',
										range: true,
										min: 0,
										max: 200,
										defaultValue: '14px',
									}}
									//
									defaultValue=""
									onChange={(newValue) =>
										setAttributes({
											...attributes,
											publisherFontSize: newValue,
										})
									}
								/>
							</ControlContextProvider>
						)}

						{isActiveField(publisherLineHeight) && (
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										props,
										'line-height'
									),
									value: attributes.publisherLineHeight,
								}}
							>
								<InputField
									label={__('Line Height', 'publisher-core')}
									settings={{
										type: 'css',
										unitType: 'essential',
										range: true,
										min: 0,
										max: 100,
										defaultValue: '14px',
									}}
									//
									defaultValue=""
									onChange={(newValue) =>
										setAttributes({
											...attributes,
											publisherLineHeight: newValue,
										})
									}
								/>
							</ControlContextProvider>
						)}

						<Field field="style" label="" columns="columns-1">
							{isActiveField(publisherTextAlign) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											props,
											'text-align'
										),
										value: attributes.publisherTextAlign,
									}}
								>
									<ToggleSelectField
										label={__('Align', 'publisher-core')}
										columns="columns-1"
										className="control-first label-center small-gap"
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
												icon: <TextAlignCenterIcon />,
											},
											{
												label: __(
													'Right',
													'publisher-core'
												),
												value: 'right',
												icon: <TextAlignRightIcon />,
											},
											{
												label: __(
													'Justify',
													'publisher-core'
												),
												value: 'justify',
												icon: <TextAlignJustifyIcon />,
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
										value={attributes.publisherTextAlign}
										onChange={(newValue) =>
											setAttributes({
												...attributes,
												publisherTextAlign: newValue,
											})
										}
									/>
								</ControlContextProvider>
							)}

							<Flex direction="row" gap="10px">
								<div style={{ width: '70%' }}>
									{isActiveField(publisherTextDecoration) && (
										<ControlContextProvider
											value={{
												name: generateExtensionId(
													props,
													'text-decoration'
												),
												value: attributes.publisherTextDecoration,
											}}
										>
											<ToggleSelectField
												label={__(
													'Decoration',
													'publisher-core'
												)}
												columns="columns-1"
												className="control-first label-center small-gap"
												options={[
													{
														label: __(
															'Underline',
															'publisher-core'
														),
														value: 'underline',
														icon: (
															<TextDecorationUnderlineIcon />
														),
													},
													{
														label: __(
															'Line Through',
															'publisher-core'
														),
														value: 'line-through',
														icon: (
															<TextDecorationLineThroughIcon />
														),
													},
													{
														label: __(
															'Overline',
															'publisher-core'
														),
														value: 'overline',
														icon: (
															<TextDecorationOverlineIcon />
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
													setAttributes({
														...attributes,
														publisherTextDecoration:
															newValue,
													})
												}
											/>
										</ControlContextProvider>
									)}
								</div>
								<div style={{ width: '40%' }}>
									{isActiveField(publisherFontStyle) && (
										<ControlContextProvider
											value={{
												name: generateExtensionId(
													props,
													'font-style'
												),
												value: attributes.publisherFontStyle,
											}}
										>
											<ToggleSelectField
												label={__(
													'Italicize',
													'publisher-core'
												)}
												columns="columns-1"
												className="control-first label-center small-gap"
												options={[
													{
														label: __(
															'Normal',
															'publisher-core'
														),
														value: 'normal',
														icon: (
															<FontStyleNormalIcon />
														),
													},
													{
														label: __(
															'Line Through',
															'publisher-core'
														),
														value: 'italic',
														icon: (
															<FontStyleItalicIcon />
														),
													},
												]}
												isDeselectable={true}
												//
												defaultValue=""
												onChange={(newValue) =>
													setAttributes({
														...attributes,
														publisherFontStyle:
															newValue,
													})
												}
											/>
										</ControlContextProvider>
									)}
								</div>
							</Flex>

							<Flex direction="row" gap="10px">
								<div style={{ width: '70%' }}>
									{isActiveField(publisherTextTransform) && (
										<ControlContextProvider
											value={{
												name: generateExtensionId(
													props,
													'text-transform'
												),
												value: attributes.publisherTextTransform,
											}}
										>
											<ToggleSelectField
												label={__(
													'Capitalize',
													'publisher-core'
												)}
												columns="columns-1"
												className="control-first label-center small-gap"
												options={[
													{
														label: __(
															'Capitalize',
															'publisher-core'
														),
														value: 'capitalize',
														icon: (
															<TextTransformCapitalizeIcon />
														),
													},
													{
														label: __(
															'Lowercase',
															'publisher-core'
														),
														value: 'overline',
														icon: (
															<TextTransformLowercaseIcon />
														),
													},
													{
														label: __(
															'Uppercase',
															'publisher-core'
														),
														value: 'uppercase',
														icon: (
															<TextTransformUppercaseIcon />
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
													setAttributes({
														...attributes,
														publisherTextTransform:
															newValue,
													})
												}
											/>
										</ControlContextProvider>
									)}
								</div>
								<div style={{ width: '40%' }}>
									{isActiveField(publisherDirection) && (
										<ControlContextProvider
											value={{
												name: generateExtensionId(
													props,
													'direction'
												),
												value: attributes.publisherDirection,
											}}
										>
											<ToggleSelectField
												label={__(
													'Direction',
													'publisher-core'
												)}
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
													setAttributes({
														...attributes,
														publisherDirection:
															newValue,
													})
												}
											/>
										</ControlContextProvider>
									)}
								</div>
							</Flex>
						</Field>

						<Field
							field="spacing"
							label={__('Spacing', 'publisher-core')}
						>
							{isActiveField(publisherLetterSpacing) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											props,
											'letter-spacing'
										),
										value: attributes.publisherLetterSpacing,
									}}
								>
									<InputField
										label={__('Letters', 'publisher-core')}
										settings={{
											type: 'css',
											unitType: 'letter-spacing',
											onValidate: (newValue) => {
												return newValue;
											},
										}}
										columns="2fr 2.4fr"
										//
										defaultValue=""
										onChange={(newValue) =>
											setAttributes({
												...attributes,
												publisherLetterSpacing:
													newValue,
											})
										}
									/>
								</ControlContextProvider>
							)}

							{isActiveField(publisherWordSpacing) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											props,
											'word-spacing'
										),
										value: attributes.publisherWordSpacing,
									}}
								>
									<InputField
										label={__('Words', 'publisher-core')}
										settings={{
											type: 'css',
											unitType: 'letter-spacing',
											step: 'any',
										}}
										columns="2fr 2.4fr"
										//
										defaultValue=""
										onChange={(newValue) =>
											setAttributes({
												...attributes,
												publisherWordSpacing: newValue,
											})
										}
									/>
								</ControlContextProvider>
							)}

							{isActiveField(publisherTextIndent) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											props,
											'text-indent'
										),
										value: attributes.publisherTextIndent,
									}}
								>
									<InputField
										label={__(
											'Text Indent',
											'publisher-core'
										)}
										settings={{
											type: 'css',
											unitType: 'text-indent',
										}}
										columns="2fr 2.4fr"
										//
										defaultValue=""
										onChange={(newValue) =>
											setAttributes({
												...attributes,
												publisherTextIndent: newValue,
											})
										}
									/>
								</ControlContextProvider>
							)}
						</Field>

						{isActiveField(publisherTextOrientation) && (
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										props,
										'text-orientation'
									),
									value: attributes.publisherTextOrientation,
								}}
							>
								<ToggleSelectField
									label={__('Orientation', 'publisher-core')}
									options={[
										{
											label: __(
												'vertically from top to bottom, and the next vertical line is positioned to the right of the previous line',
												'publisher-core'
											),
											value: 'style-1',
											icon: <TextOrientationStyle1Icon />,
										},
										{
											label: __(
												'vertically from top to bottom, and the next vertical line is positioned to the left of the previous line',
												'publisher-core'
											),
											value: 'style-2',
											icon: <TextOrientationStyle2Icon />,
										},
										{
											label: __(
												'Right',
												'publisher-core'
											),
											value: 'style-3',
											icon: <TextOrientationStyle3Icon />,
										},
										{
											label: __(
												'Right',
												'publisher-core'
											),
											value: 'style-4',
											icon: <TextOrientationStyle4Icon />,
										},
										{
											label: __('None', 'publisher-core'),
											value: 'initial',
											icon: <NoneIcon />,
										},
									]}
									isDeselectable={true}
									//
									defaultValue=""
									onChange={(newValue) =>
										setAttributes({
											...attributes,
											publisherTextOrientation: newValue,
										})
									}
								/>
							</ControlContextProvider>
						)}

						{isActiveField(publisherTextColumns) && (
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										props,
										'text-columns'
									),
									value: attributes.publisherTextColumns,
								}}
							>
								<ToggleSelectField
									label={__('Columns', 'publisher-core')}
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
											label: __('None', 'publisher-core'),
											value: 'none',
											icon: <NoneIcon />,
										},
									]}
									isDeselectable={true}
									//
									defaultValue=""
									onChange={(newValue) =>
										setAttributes({
											...attributes,
											publisherTextColumns: newValue,
										})
									}
								>
									{!isEmpty(
										attributes.publisherTextColumns
									) &&
										attributes.publisherTextColumns !==
											'none' &&
										!isUndefined(
											attributes.publisherTextColumns
										) && (
											<>
												<ControlContextProvider
													value={{
														name: generateExtensionId(
															props,
															'text-columns-gap'
														),
														value: attributes.publisherTextColumnsGap,
													}}
												>
													<InputField
														label={__(
															'Gap',
															'publisher-core'
														)}
														settings={{
															type: 'css',
															unitType:
																'essential',
															range: true,
															min: 0,
															max: 200,
															defaultValue:
																'20px',
														}}
														//
														defaultValue=""
														onChange={(newValue) =>
															setAttributes({
																...attributes,
																publisherTextColumnsGap:
																	newValue,
															})
														}
													/>
												</ControlContextProvider>

												<ControlContextProvider
													value={{
														name: generateExtensionId(
															props,
															'divider'
														),
														value: {
															width: attributes.publisherTextColumnsDividerWidth,
															style: attributes.publisherTextColumnsDividerStyle,
															color: attributes.publisherTextColumnsDividerColor,
														},
													}}
												>
													<BorderField
														label={__(
															'Divider',
															'publisher-core'
														)}
														columns="columns-1"
														className="control-first label-center small-gap"
														lines="vertical"
														customMenuPosition="top"
														onValueChange={(
															newValue
														) => {
															setAttributes({
																...attributes,
																publisherTextColumnsDividerWidth:
																	newValue.width,
																publisherTextColumnsDividerStyle:
																	newValue.style,
																publisherTextColumnsDividerColor:
																	newValue.color,
															});
														}}
													/>
												</ControlContextProvider>
											</>
										)}
								</ToggleSelectField>
							</ControlContextProvider>
						)}

						{isActiveField(publisherTextStrokeColor) && (
							<Field label={__('Stroke', 'publisher-core')}>
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											props,
											'text-stroke-color'
										),
										value: attributes.publisherTextStrokeColor,
									}}
								>
									<ColorField
										label={__('Color', 'publisher-core')}
										//
										defaultValue=""
										onChange={(newValue) =>
											setAttributes({
												...attributes,
												publisherTextStrokeColor:
													newValue,
											})
										}
									/>
								</ControlContextProvider>

								{attributes.publisherTextStrokeColor && (
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												props,
												'text-stroke-width'
											),
											value: attributes.publisherTextStrokeWidth,
										}}
									>
										<InputField
											label={__(
												'Width',
												'publisher-core'
											)}
											settings={{
												type: 'css',
												unitType: 'essential',
											}}
											//
											defaultValue=""
											onChange={(newValue) =>
												setAttributes({
													...attributes,
													publisherTextStrokeWidth:
														newValue,
												})
											}
										/>
									</ControlContextProvider>
								)}
							</Field>
						)}

						{isActiveField(publisherWordBreak) && (
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										props,
										'word-break'
									),
									value: attributes.publisherWordBreak,
								}}
							>
								<SelectField
									label={__('Breaking', 'publisher-core')}
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
										setAttributes({
											...attributes,
											publisherWordBreak: newValue,
										})
									}
								/>
							</ControlContextProvider>
						)}
					</Popover>
				)}
			</Field>

			{isActiveField(publisherFontColor) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props, 'font-color'),
						value: attributes.publisherFontColor,
					}}
				>
					<ColorField
						{...{
							...props,
							label: __('Color', 'publisher-core'),
							//
							defaultValue: '',
							onChange: (newValue) =>
								setAttributes({
									...attributes,
									publisherFontColor: newValue,
								}),
						}}
					/>
				</ControlContextProvider>
			)}

			{isActiveField(publisherTextShadow) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props, 'text-shadow'),
						value: attributes.publisherTextShadow,
					}}
					storeName={'publisher-core/controls/repeater'}
				>
					<TextShadowField
						label={__('Text Shadows', 'publisher-core')}
						onChange={(newValue) =>
							setAttributes({
								...attributes,
								publisherTextShadow: newValue,
							})
						}
						{...props}
					/>
				</ControlContextProvider>
			)}
		</>
	);
}
