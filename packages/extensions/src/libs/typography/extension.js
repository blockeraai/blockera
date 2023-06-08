/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	ColorField,
	Field,
	InputField,
	SelectField,
	TextShadowField,
	ToggleSelectField,
} from '@publisher/fields';
import { Popover, Button, HStack } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';
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
					style="primary"
					className={
						isVisible ? 'is-focus toggle-focus' : 'toggle-focus'
					}
					onClick={() => {
						toggleVisible();
					}}
				>
					<TypographyButtonIcon />
					{__('Customize', 'publisher-core')}
				</Button>

				{isVisible && (
					<Popover
						label={__('Typography', 'publisher-core')}
						offset={125}
						placement="left-start"
						className={controlInnerClassNames(
							'group-popover',
							'typography-popover'
						)}
						onClose={() => {
							setIsVisible(false);
						}}
					>
						{isActiveField(publisherFontSize) && (
							<InputField
								label={__('Font Size', 'publisher-core')}
								settings={{
									type: 'css',
									unitType: 'essential',
									range: true,
									min: 0,
									max: 200,
									initValue: '14px',
								}}
								//
								initValue=""
								value={attributes.publisherFontSize}
								onValueChange={(newValue) =>
									setAttributes({
										...attributes,
										publisherFontSize: newValue,
									})
								}
							/>
						)}

						{isActiveField(publisherLineHeight) && (
							<InputField
								label={__('Line Height', 'publisher-core')}
								settings={{
									type: 'css',
									unitType: 'essential',
									range: true,
									min: 0,
									max: 100,
									initValue: '14px',
								}}
								//
								initValue=""
								value={attributes.publisherLineHeight}
								onValueChange={(newValue) =>
									setAttributes({
										...attributes,
										publisherLineHeight: newValue,
									})
								}
							/>
						)}

						<Field field="style" label="" columns="columns-1">
							{isActiveField(publisherTextAlign) && (
								<ToggleSelectField
									label={__('Align', 'publisher-core')}
									columns="columns-1"
									className="control-first label-center small-gap"
									options={[
										{
											label: __('Left', 'publisher-core'),
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
											label: __('None', 'publisher-core'),
											value: 'initial',
											icon: <NoneIcon />,
										},
									]}
									isDeselectable={true}
									//
									initValue=""
									value={attributes.publisherTextAlign}
									onValueChange={(newValue) =>
										setAttributes({
											...attributes,
											publisherTextAlign: newValue,
										})
									}
								/>
							)}

							<HStack>
								<div style={{ width: '70%' }}>
									{isActiveField(publisherTextDecoration) && (
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
											initValue=""
											value={
												attributes.publisherTextDecoration
											}
											onValueChange={(newValue) =>
												setAttributes({
													...attributes,
													publisherTextDecoration:
														newValue,
												})
											}
										/>
									)}
								</div>
								<div style={{ width: '40%' }}>
									{isActiveField(publisherFontStyle) && (
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
											initValue=""
											value={
												attributes.publisherFontStyle
											}
											onValueChange={(newValue) =>
												setAttributes({
													...attributes,
													publisherFontStyle:
														newValue,
												})
											}
										/>
									)}
								</div>
							</HStack>

							<HStack>
								<div style={{ width: '70%' }}>
									{isActiveField(publisherTextTransform) && (
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
														'None',
														'publisher-core'
													),
													value: 'initial',
													icon: <NoneIcon />,
												},
											]}
											isDeselectable={true}
											//
											initValue=""
											value={
												attributes.publisherTextTransform
											}
											onValueChange={(newValue) =>
												setAttributes({
													...attributes,
													publisherTextTransform:
														newValue,
												})
											}
										/>
									)}
								</div>
								<div style={{ width: '40%' }}>
									{isActiveField(publisherDirection) && (
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
													icon: <DirectionLtrIcon />,
												},
												{
													label: __(
														'Right to Left',
														'publisher-core'
													),
													value: 'rtl',
													icon: <DirectionRtlIcon />,
												},
											]}
											isDeselectable={true}
											//
											initValue=""
											value={
												attributes.publisherDirection
											}
											onValueChange={(newValue) =>
												setAttributes({
													...attributes,
													publisherDirection:
														newValue,
												})
											}
										/>
									)}
								</div>
							</HStack>
						</Field>

						<Field
							field="spacing"
							label={__('Spacing', 'publisher-core')}
						>
							{isActiveField(publisherLetterSpacing) && (
								<InputField
									label={__('Letters', 'publisher-core')}
									settings={{
										type: 'css',
										unitType: 'letter-spacing',
										onValidate: (newValue) => {
											console.log(newValue);
											return newValue;
										},
									}}
									columns="2fr 2.4fr"
									//
									initValue=""
									value={attributes.publisherLetterSpacing}
									onValueChange={(newValue) =>
										setAttributes({
											...attributes,
											publisherLetterSpacing: newValue,
										})
									}
								/>
							)}

							{isActiveField(publisherWordSpacing) && (
								<InputField
									label={__('Words', 'publisher-core')}
									settings={{
										type: 'css',
										unitType: 'letter-spacing',
										step: 'any',
									}}
									columns="2fr 2.4fr"
									//
									initValue=""
									value={attributes.publisherWordSpacing}
									onValueChange={(newValue) =>
										setAttributes({
											...attributes,
											publisherWordSpacing: newValue,
										})
									}
								/>
							)}

							{isActiveField(publisherTextIndent) && (
								<InputField
									label={__('Text Indent', 'publisher-core')}
									settings={{
										type: 'css',
										unitType: 'text-indent',
									}}
									columns="2fr 2.4fr"
									//
									initValue=""
									value={attributes.publisherTextIndent}
									onValueChange={(newValue) =>
										setAttributes({
											...attributes,
											publisherTextIndent: newValue,
										})
									}
								/>
							)}
						</Field>

						{isActiveField(publisherTextOrientation) && (
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
										label: __('Right', 'publisher-core'),
										value: 'style-3',
										icon: <TextOrientationStyle3Icon />,
									},
									{
										label: __('Right', 'publisher-core'),
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
								initValue=""
								value={attributes.publisherTextOrientation}
								onValueChange={(newValue) =>
									setAttributes({
										...attributes,
										publisherTextOrientation: newValue,
									})
								}
							/>
						)}

						{isActiveField(publisherTextColumns) && (
							<ToggleSelectField
								label={__('Text Columns', 'publisher-core')}
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
								initValue=""
								value={attributes.publisherTextColumns}
								onValueChange={(newValue) =>
									setAttributes({
										...attributes,
										publisherTextColumns: newValue,
									})
								}
							>
								{attributes.publisherTextColumns !== '' &&
									attributes.publisherTextColumns !==
										'none' &&
									typeof attributes.publisherTextColumns !==
										'undefined' && (
										<>
											<InputField
												label={__(
													'Gap',
													'publisher-core'
												)}
												columns="2fr 8fr"
												settings={{
													type: 'css',
													unitType: 'essential',
													range: true,
													min: 0,
													max: 200,
													initValue: '20px',
												}}
												//
												initValue=""
												value={
													attributes.publisherTextColumnsGap
												}
												onValueChange={(newValue) =>
													setAttributes({
														...attributes,
														publisherTextColumnsGap:
															newValue,
													})
												}
											/>

											<InputField
												label={__(
													'Divider Width',
													'publisher-core'
												)}
												columns="2fr 8fr"
												settings={{
													type: 'css',
													unitType: 'essential',
													range: true,
													min: 0,
													max: 10,
													initValue: '0px',
												}}
												//
												initValue=""
												value={
													attributes.publisherTextColumnsDividerWidth
												}
												onValueChange={(newValue) =>
													setAttributes({
														...attributes,
														publisherTextColumnsDividerWidth:
															newValue,
													})
												}
											/>

											<ColorField
												label={__(
													'Divider Color',
													'publisher-core'
												)}
												//
												initValue=""
												value={
													attributes.publisherTextColumnsDividerColor
												}
												onValueChange={(newValue) =>
													setAttributes({
														...attributes,
														publisherTextColumnsDividerColor:
															newValue,
													})
												}
											/>

											<SelectField
												label={__(
													'Divider Color',
													'publisher-core'
												)}
												options={[
													{
														label: __(
															'None',
															'publisher-core'
														),
														value: 'none',
													},
													{
														label: __(
															'Solid',
															'publisher-core'
														),
														value: 'solid',
													},
													{
														label: __(
															'Dashed',
															'publisher-core'
														),
														value: 'dashed',
													},
													{
														label: __(
															'Dotted',
															'publisher-core'
														),
														value: 'dotted',
													},
												]}
												//
												initValue="none"
												value={
													attributes.publisherTextColumnsDividerStyle
												}
												onValueChange={(newValue) =>
													setAttributes({
														...attributes,
														publisherTextColumnsDividerStyle:
															newValue,
													})
												}
											/>
										</>
									)}
							</ToggleSelectField>
						)}

						{isActiveField(publisherTextStrokeColor) && (
							<Field label={__('Stroke', 'publisher-core')}>
								<ColorField
									label={__('Color', 'publisher-core')}
									//
									initValue=""
									value={attributes.publisherTextStrokeColor}
									onValueChange={(newValue) =>
										setAttributes({
											...attributes,
											publisherTextStrokeColor: newValue,
										})
									}
								/>

								{attributes.publisherTextStrokeColor && (
									<InputField
										label={__('Width', 'publisher-core')}
										settings={{
											type: 'css',
											unitType: 'essential',
										}}
										//
										initValue=""
										value={
											attributes.publisherTextStrokeWidth
										}
										onValueChange={(newValue) =>
											setAttributes({
												...attributes,
												publisherTextStrokeWidth:
													newValue,
											})
										}
									/>
								)}
							</Field>
						)}

						{isActiveField(publisherWordBreak) && (
							<SelectField
								label={__('Breaking', 'publisher-core')}
								options={[
									{
										label: __('Inherit', 'publisher-core'),
										value: 'inherit',
									},
									{
										label: __(
											'Break All Words',
											'publisher-core'
										),
										value: 'break-all',
									},
									{
										label: __(
											'Keep All Words',
											'publisher-core'
										),
										value: 'keep-all',
									},
									{
										label: __(
											'Break Word',
											'publisher-core'
										),
										value: 'break-word',
									},
									{
										label: __('Normal', 'publisher-core'),
										value: 'normal',
									},
								]}
								//
								initValue="inherit"
								value={attributes.publisherWordBreak}
								onValueChange={(newValue) =>
									setAttributes({
										...attributes,
										publisherWordBreak: newValue,
									})
								}
							></SelectField>
						)}
					</Popover>
				)}
			</Field>

			{isActiveField(publisherFontColor) && (
				<ColorField
					{...{
						...props,
						label: __('Color', 'publisher-core'),
						//
						initValue: '',
						value: attributes.publisherFontColor,
						onValueChange: (newValue) =>
							setAttributes({
								...attributes,
								publisherFontColor: newValue,
							}),
					}}
				/>
			)}

			{isActiveField(publisherTextShadow) && (
				<TextShadowField
					{...{
						...props,
						config: publisherTextShadow,
						attribute: 'publisherTextShadow',
						label: __('Text Shadow', 'publisher-core'),
					}}
				/>
			)}
		</>
	);
}
