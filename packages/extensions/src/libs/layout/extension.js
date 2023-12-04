// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	ControlContextProvider,
	InputControl,
	ToggleSelectControl,
} from '@publisher/controls';
import { Flex, Button } from '@publisher/components';
/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import type { TLayoutProps } from './types/layout-props';
import { default as WrapWrapIcon } from './icons/wrap-wrap';
import { generateExtensionId, hasSameProps } from '../utils';
import { default as WrapNoWrapIcon } from './icons/wrap-nowrap';
import { default as DisplayNoneIcon } from './icons/display-none';
import { default as DisplayFlexIcon } from './icons/display-flex';
import { default as DisplayBlockIcon } from './icons/display-block';
import { default as DisplayInlineIcon } from './icons/display-inline';
import { default as JustifyCenterIcon } from './icons/justify-center';
import { default as JustifyFlexEndIcon } from './icons/justify-flex-end';
import { default as JustifyFlexStartIcon } from './icons/justify-flex-start';
import { default as JustifySpaceAroundIcon } from './icons/justify-space-around';
import { default as JustifySpaceEvenlyIcon } from './icons/justify-space-evenly';
import { default as DisplayInlineBlockIcon } from './icons/display-inline-block';
import { default as AlignContentCenterIcon } from './icons/align-content-center';
import { default as FlexDirectionRowBlockIcon } from './icons/flex-direction-row';
import { default as JustifySpaceBetweenIcon } from './icons/justify-space-between';
import { default as AlignItemsCenterBlockIcon } from './icons/align-items-center';
import { default as AlignContentStretchIcon } from './icons/align-content-stretch';
import { default as AlignContentFlexEndIcon } from './icons/align-content-flex-end';
import { default as AlignItemsStretchBlockIcon } from './icons/align-items-stretch';
import { default as AlignItemsFlexEndBlockIcon } from './icons/align-items-flex-end';
import { default as AlignItemsBaselineBlockIcon } from './icons/align-items-baseline';
import { default as FlexDirectionColumnBlockIcon } from './icons/flex-direction-column';
import { default as AlignContentFlexStartIcon } from './icons/align-content-flex-start';
import { default as AlignItemsFlexStartBlockIcon } from './icons/align-items-flex-start';
import { default as AlignContentSpaceAroundIcon } from './icons/align-content-space-around';
import { default as AlignContentSpaceBetweenIcon } from './icons/align-content-space-between';
import { default as ReverseIcon } from './icons/reverse';
import { default as LockIcon } from './icons/lock';
import { default as UnlockIcon } from './icons/unlock';

export const LayoutExtension: TLayoutProps = memo<TLayoutProps>(
	({
		block,
		values: {
			gap,
			gapLock,
			gapRows,
			display,
			flexWrap,
			gapColumns,
			alignItems,
			alignContent,
			flexDirection,
			justifyContent,
		},
		// defaultValue: {
		// 	type,
		// 	wideSize,
		// 	contentSize,
		// 	justifyContent: defaultJustifyContent,
		// },
		handleOnChangeAttributes,
		config,
		...props
	}: TLayoutProps): MixedElement => {
		const {
			layoutConfig: {
				publisherDisplay,
				publisherFlexDirection,
				publisherAlignItems,
				publisherJustifyContent,
				publisherGap,
				publisherGapRows,
				publisherGapColumns,
				publisherFlexWrap,
				publisherAlignContent,
			},
		} = config;

		return (
			<>
				{isActiveField(publisherDisplay) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'display'),
							value: display,
						}}
					>
						<ToggleSelectControl
							label={__('Display', 'publisher-core')}
							columns="1fr 2.65fr"
							options={[
								{
									label: __('Block', 'publisher-core'),
									value: 'block',
									icon: <DisplayBlockIcon />,
								},
								{
									label: __('Flex', 'publisher-core'),
									value: 'flex',
									icon: <DisplayFlexIcon />,
								},
								{
									label: __('Inline Block', 'publisher-core'),
									value: 'inline-block',
									icon: <DisplayInlineBlockIcon />,
								},
								{
									label: __('Inline', 'publisher-core'),
									value: 'inline',
									icon: <DisplayInlineIcon />,
								},
								{
									label: __('None', 'publisher-core'),
									value: 'none',
									icon: <DisplayNoneIcon />,
								},
							]}
							isDeselectable={true}
							//
							defaultValue=""
							onChange={(newValue) =>
								handleOnChangeAttributes(
									'publisherDisplay',
									newValue
								)
							}
						/>
					</ControlContextProvider>
				)}

				{display === 'flex' && (
					<>
						{isActiveField(publisherFlexDirection) && (
							<BaseControl columns="columns-1">
								<Flex>
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'direction'
											),
											value: flexDirection.value,
										}}
									>
										<ToggleSelectControl
											className={
												'publisher-direction-' +
												flexDirection.value
											}
											label={__(
												'Direction',
												'publisher-core'
											)}
											columns="1fr 2fr"
											options={[
												{
													label: __(
														'Row',
														'publisher-core'
													),
													value: 'row',
													icon: (
														<FlexDirectionRowBlockIcon />
													),
												},
												{
													label: __(
														'Column',
														'publisher-core'
													),
													value: 'column',
													icon: (
														<FlexDirectionColumnBlockIcon />
													),
												},
											]}
											defaultValue={
												flexDirection.value || 'row'
											}
											onChange={(newValue) => {
												handleOnChangeAttributes(
													'publisherFlexDirection',
													{
														...flexDirection,
														value: flexDirection.reverse
															? `${newValue}-reverse`
															: newValue.split(
																	'-'
															  )[0],
													}
												);
											}}
										/>
									</ControlContextProvider>

									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'direction'
											),
											value: flexDirection.reverse,
										}}
									>
										<Button
											showTooltip={true}
											tooltipPosition="top"
											label={__(
												'Reverse Direction',
												'publisher-core'
											)}
											size="small"
											style={{
												color: flexDirection?.reverse
													? 'var(--publisher-controls-border-color-focus)'
													: 'var(--publisher-controls-color)',
												padding: '6px',
											}}
											onClick={() => {
												handleOnChangeAttributes(
													'publisherFlexDirection',
													{
														value: flexDirection.reverse
															? flexDirection.value.split(
																	'-'
															  )[0]
															: `${flexDirection.value}-reverse`,
														reverse:
															!flexDirection.reverse,
													}
												);
											}}
										>
											<ReverseIcon />
										</Button>
									</ControlContextProvider>
								</Flex>
							</BaseControl>
						)}

						{isActiveField(publisherAlignItems) && (
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										block,
										'align-items'
									),
									value: alignItems,
								}}
							>
								<BaseControl
									columns="1fr 2.65fr"
									controlName="toggle-select"
									className={
										'publisher-direction-' +
										flexDirection.value +
										' publisher-flex-align-items'
									}
									label={__('Align Items', 'publisher-core')}
								>
									<ToggleSelectControl
										options={[
											{
												label: __(
													'Center',
													'publisher-core'
												),
												value: 'center',
												icon: (
													<AlignItemsCenterBlockIcon />
												),
											},
											{
												label: __(
													'Flex Start',
													'publisher-core'
												),
												value: 'flex-start',
												icon: (
													<AlignItemsFlexStartBlockIcon />
												),
											},
											{
												label: __(
													'Flex End',
													'publisher-core'
												),
												value: 'flex-end',
												icon: (
													<AlignItemsFlexEndBlockIcon />
												),
											},
											{
												label: __(
													'Stretch',
													'publisher-core'
												),
												value: 'stretch',
												icon: (
													<AlignItemsStretchBlockIcon />
												),
											},
											{
												label: __(
													'Baseline',
													'publisher-core'
												),
												value: 'baseline',
												icon: (
													<AlignItemsBaselineBlockIcon />
												),
											},
										]}
										isDeselectable={true}
										//
										defaultValue=""
										onChange={(newValue) =>
											handleOnChangeAttributes(
												'publisherAlignItems',
												newValue
											)
										}
									/>
								</BaseControl>
							</ControlContextProvider>
						)}
						{isActiveField(publisherJustifyContent) && (
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										block,
										'justify-content'
									),
									value: justifyContent,
								}}
							>
								<BaseControl
									columns="1fr 2.65fr"
									className={
										'publisher-direction-' +
										flexDirection.value +
										' publisher-flex-justify-content'
									}
									controlName="toggle-select"
									label={__('Justify', 'publisher-core')}
								>
									<ToggleSelectControl
										options={[
											{
												label: __(
													'Center',
													'publisher-core'
												),
												value: 'center',
												icon: <JustifyCenterIcon />,
											},
											{
												label: __(
													'Flex Start',
													'publisher-core'
												),
												value: 'flex-start',
												icon: <JustifyFlexStartIcon />,
											},
											{
												label: __(
													'Flex End',
													'publisher-core'
												),
												value: 'flex-end',
												icon: <JustifyFlexEndIcon />,
											},
											{
												label: __(
													'Space Between',
													'publisher-core'
												),
												value: 'space-between',
												icon: (
													<JustifySpaceBetweenIcon />
												),
											},
											{
												label: __(
													'Space Around',
													'publisher-core'
												),
												value: 'space-around',
												icon: (
													<JustifySpaceAroundIcon />
												),
											},
											{
												label: __(
													'Space Evenly',
													'publisher-core'
												),
												value: 'space-evenly',
												icon: (
													<JustifySpaceEvenlyIcon />
												),
											},
										]}
										isDeselectable={true}
										//
										defaultValue=""
										onChange={(newValue) =>
											handleOnChangeAttributes(
												'publisherJustifyContent',
												newValue
											)
										}
									/>
								</BaseControl>
							</ControlContextProvider>
						)}

						{isActiveField(publisherGap) && (
							<BaseControl
								label={__('Gap', 'publisher-core')}
								columns="1fr 2.65fr"
							>
								<Flex gap="10px">
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'gap'
											),
											value: {
												gap,
												gapRows,
												gapColumns,
											},
										}}
									>
										{gapLock ? (
											isActiveField(publisherGap) && (
												<BaseControl
													controlName="input"
													columns="columns-1"
													className="control-first label-center small-gap"
													aria-label={__(
														'Gap',
														'publisher-core'
													)}
												>
													<InputControl
														style={{
															width: '133px',
														}}
														{...{
															...props,
															unitType:
																'essential',
															min: 0,
															max: 200,
															defaultValue: gap,
															id: 'gap',
															onChange: (
																newValue
															) =>
																handleOnChangeAttributes(
																	'publisherGap',
																	newValue,
																	'',
																	(
																		attributes,
																		setAttributes
																	): void =>
																		setAttributes(
																			{
																				...attributes,
																				publisherGapRows:
																					newValue,
																				publisherGapColumns:
																					newValue,
																			}
																		)
																),
														}}
													/>
												</BaseControl>
											)
										) : (
											<Flex
												direction="row"
												gap="10px"
												style={{
													width: '133px',
												}}
											>
												{isActiveField(
													publisherGapColumns
												) && (
													<BaseControl
														controlName="input"
														columns="columns-1"
														className="control-first label-center small-gap"
														label={__(
															'Columns',
															'publisher-core'
														)}
													>
														<InputControl
															{...{
																...props,
																unitType:
																	'essential',
																min: 0,
																max: 200,
																defaultValue:
																	gapColumns,
																id: 'gapColumns',
																onChange: (
																	newValue
																) =>
																	handleOnChangeAttributes(
																		'publisherGapColumns',
																		newValue
																	),
															}}
														/>
													</BaseControl>
												)}

												{isActiveField(
													publisherGapRows
												) && (
													<BaseControl
														controlName="input"
														columns="columns-1"
														className="control-first label-center small-gap"
														label={__(
															'Rows',
															'publisher-core'
														)}
													>
														<InputControl
															{...{
																...props,
																unitType:
																	'essential',
																min: 0,
																max: 200,
																defaultValue:
																	gapRows,
																id: 'gapRows',
																onChange: (
																	newValue
																) =>
																	handleOnChangeAttributes(
																		'publisherGapRows',
																		newValue
																	),
															}}
														/>
													</BaseControl>
												)}
											</Flex>
										)}
										<Button
											showTooltip={true}
											tooltipPosition="top"
											label={__(
												'Custom Row Column Gap',
												'publisher-core'
											)}
											size="small"
											onClick={() => {
												handleOnChangeAttributes(
													'publisherGapLock',
													!gapLock
												);
											}}
											style={{
												color: gapLock
													? 'var(--publisher-controls-color)'
													: 'var(--publisher-controls-border-color-focus)',
												padding: '6px 3px',
											}}
										>
											{gapLock ? (
												<LockIcon />
											) : (
												<UnlockIcon />
											)}
										</Button>
									</ControlContextProvider>
								</Flex>
							</BaseControl>
						)}

						{isActiveField(publisherFlexWrap) && (
							<>
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'flex-wrap'
										),
										value: flexWrap.value,
									}}
								>
									<BaseControl columns="columns-1">
										<Flex>
											<BaseControl
												columns="1fr 2fr"
												className={
													'publisher-direction-' +
													flexDirection.value +
													' publisher-flex-wrap'
												}
												controlName="toggle-select"
												label={__(
													'Children',
													'publisher-core'
												)}
											>
												<ToggleSelectControl
													options={[
														{
															label: __(
																'No Wrap',
																'publisher-core'
															),
															value: 'nowrap',
															icon: (
																<WrapNoWrapIcon />
															),
														},
														{
															label: __(
																'Wrap',
																'publisher-core'
															),
															value: 'wrap',
															icon: (
																<WrapWrapIcon />
															),
														},
													]}
													//
													defaultValue={'nowrap'}
													onChange={(newValue) => {
														if (
															newValue ===
															'nowrap'
														) {
															handleOnChangeAttributes(
																'publisherFlexWrap',
																{
																	...flexWrap,
																	value: 'nowrap',
																	reverse: false,
																}
															);
														} else {
															handleOnChangeAttributes(
																'publisherFlexWrap',
																{
																	...flexWrap,
																	value: flexWrap.reverse
																		? 'wrap-reverse'
																		: 'wrap',
																}
															);
														}
													}}
												/>
											</BaseControl>
											<Button
												showTooltip={true}
												tooltipPosition="top"
												label={__(
													'Reverse Children Wrapping',
													'publisher-core'
												)}
												size="small"
												style={{
													color:
														flexWrap?.value ===
														'wrap-reverse'
															? 'var(--publisher-controls-border-color-focus)'
															: 'var(--publisher-controls-color)',
													padding: '6px',
												}}
												disabled={
													flexWrap.value ===
														'nowrap' || ''
												}
												onClick={() => {
													handleOnChangeAttributes(
														'publisherFlexWrap',
														{
															value: flexWrap.reverse
																? flexWrap.value.split(
																		'-'
																  )[0]
																: flexWrap.value ===
																		'wrap' &&
																  `${flexWrap.value}-reverse`,
															reverse:
																!flexWrap.reverse,
														}
													);
												}}
											>
												<ReverseIcon />
											</Button>
										</Flex>
									</BaseControl>
								</ControlContextProvider>

								{isActiveField(publisherAlignContent) &&
									(flexWrap.value === 'wrap' ||
										flexWrap.value === 'wrap-reverse') && (
										<ControlContextProvider
											value={{
												name: generateExtensionId(
													block,
													'align-content'
												),
												value: alignContent,
											}}
										>
											<BaseControl
												controlName="toggle-select"
												label={__(
													'Align Content',
													'publisher-core'
												)}
												columns="1fr 2.65fr"
												className={
													'publisher-direction-' +
													flexDirection.value +
													' publisher-flex-align-content' +
													`${
														flexWrap.reverse
															? ' reverse'
															: ''
													}`
												}
											>
												<ToggleSelectControl
													options={[
														{
															label: __(
																'center',
																'publisher-core'
															),
															value: 'center',
															icon: (
																<AlignContentCenterIcon />
															),
														},
														{
															label: __(
																'Flex Start',
																'publisher-core'
															),
															value: 'flex-start',
															icon: (
																<AlignContentFlexStartIcon />
															),
														},
														{
															label: __(
																'Flex End',
																'publisher-core'
															),
															value: 'flex-end',
															icon: (
																<AlignContentFlexEndIcon />
															),
														},
														{
															label: __(
																'Space Around',
																'publisher-core'
															),
															value: 'space-around',
															icon: (
																<AlignContentSpaceAroundIcon />
															),
														},
														{
															label: __(
																'Space Between',
																'publisher-core'
															),
															value: 'space-between',
															icon: (
																<AlignContentSpaceBetweenIcon />
															),
														},
														{
															label: __(
																'Stretch',
																'publisher-core'
															),
															value: 'stretch',
															icon: (
																<AlignContentStretchIcon />
															),
														},
													]}
													isDeselectable={true}
													//
													defaultValue=""
													onChange={(newValue) =>
														handleOnChangeAttributes(
															'publisherAlignContent',
															newValue
														)
													}
												/>
											</BaseControl>
										</ControlContextProvider>
									)}
							</>
						)}
					</>
				)}
			</>
		);
	},
	hasSameProps
);
