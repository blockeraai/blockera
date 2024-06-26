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
import { Flex } from '@publisher/components';

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
import { default as FlexDirectionRowReverseBlockIcon } from './icons/flex-direction-row-reverse';
import { default as FlexDirectionColumnReverseBlockIcon } from './icons/flex-direction-column-reverse';

export const LayoutExtension: TLayoutProps = memo<TLayoutProps>(
	({
		block,
		values: {
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
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										block,
										'direction'
									),
									value: flexDirection,
								}}
							>
								<ToggleSelectControl
									label={__('Direction', 'publisher-core')}
									columns="1fr 2.65fr"
									options={[
										{
											label: __('Row', 'publisher-core'),
											value: 'row',
											icon: <FlexDirectionRowBlockIcon />,
										},
										{
											label: __(
												'column',
												'publisher-core'
											),
											value: 'column',
											icon: (
												<FlexDirectionColumnBlockIcon />
											),
										},
										{
											label: __(
												'Row Reverse',
												'publisher-core'
											),
											value: 'row-reverse',
											icon: (
												<FlexDirectionRowReverseBlockIcon />
											),
										},
										{
											label: __(
												'Column Reverse',
												'publisher-core'
											),
											value: 'column-reverse',
											icon: (
												<FlexDirectionColumnReverseBlockIcon />
											),
										},
									]}
									//
									defaultValue="row"
									onChange={(newValue) =>
										handleOnChangeAttributes(
											'publisherFlexDirection',
											newValue
										)
									}
								/>
							</ControlContextProvider>
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
										flexDirection +
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
										flexDirection +
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
								<Flex direction="row" gap="10px">
									{isActiveField(publisherGapRows) && (
										<ControlContextProvider
											value={{
												name: generateExtensionId(
													block,
													'gap-rows'
												),
												value: gapRows,
											}}
										>
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
														unitType: 'essential',
														min: 0,
														max: 200,
														defaultValue: '',
														onChange: (newValue) =>
															handleOnChangeAttributes(
																'publisherGapRows',
																newValue
															),
													}}
												/>
											</BaseControl>
										</ControlContextProvider>
									)}

									{isActiveField(publisherGapColumns) && (
										<ControlContextProvider
											value={{
												name: generateExtensionId(
													block,
													'gap-columns'
												),
												value: gapColumns,
											}}
										>
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
														unitType: 'essential',
														min: 0,
														max: 200,
														defaultValue: '',
														onChange: (newValue) =>
															handleOnChangeAttributes(
																'publisherGapColumns',
																newValue
															),
													}}
												/>
											</BaseControl>
										</ControlContextProvider>
									)}
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
										value: flexWrap,
									}}
								>
									<BaseControl
										columns="1fr 2.65fr"
										className={
											'publisher-direction-' +
											flexDirection +
											' publisher-flex-wrap'
										}
										controlName="toggle-select"
										label={__('Children', 'publisher-core')}
									>
										<ToggleSelectControl
											options={[
												{
													label: __(
														'No Wrap',
														'publisher-core'
													),
													value: 'nowrap',
													icon: <WrapNoWrapIcon />,
												},
												{
													label: __(
														'Wrap',
														'publisher-core'
													),
													value: 'wrap',
													icon: <WrapWrapIcon />,
												},
											]}
											//
											defaultValue="nowrap"
											onChange={(newValue) =>
												handleOnChangeAttributes(
													'publisherFlexWrap',
													newValue
												)
											}
										/>
									</BaseControl>
								</ControlContextProvider>

								{isActiveField(publisherAlignContent) &&
									flexWrap === 'wrap' && (
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
													flexDirection +
													' publisher-flex-align-content'
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
