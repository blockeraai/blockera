// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { memo, useEffect } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	ControlContextProvider,
	ToggleSelectControl,
	NoticeControl,
} from '@publisher/controls';
import { Flex, Button } from '@publisher/components';

/**
 * Internal dependencies
 */
import { Gap } from './components';
import { useBlockContext } from '../../hooks';
import { isActiveField } from '../../api/utils';
import DisplayGridIcon from './icons/display-grid';
import { default as ReverseIcon } from './icons/reverse';
import type { TLayoutProps } from './types/layout-props';
import { GridBuilder } from '../../components/grid-builder';
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

export const LayoutExtension: TLayoutProps = memo<TLayoutProps>(
	({
		block,
		values: {
			gap,
			display,
			flexWrap,
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
		extensionProps,
		config,
	}: TLayoutProps): MixedElement => {
		const {
			layoutConfig: {
				publisherDisplay,
				publisherFlexDirection,
				publisherAlignItems,
				publisherJustifyContent,
				publisherGap,
				publisherFlexWrap,
				publisherAlignContent,
			},
		} = config;

		const { setOpenGridBuilder, BlockComponent } = useBlockContext();

		useEffect(() => {
			//FIXME: please implements handler for "setOpenGridBuilder"!
			// that handler must be order by display grid value and should have flag for open or not open grid builder!
			if ('grid' === display) {
				// FIXME: replace "true" with implemented internal flag to open Grid Builder.
				setOpenGridBuilder(true);
			} else {
				// FIXME: replace "false" with implemented internal flag to close Grid Builder.
				setOpenGridBuilder(false);
			}
			// eslint-disable-next-line
		}, [display]);

		const flexDirectionClassName =
			'publisher-direction-' +
			flexDirection.value +
			(flexDirection.reverse ? '-reverse' : '');

		return (
			<>
				{isActiveField(publisherDisplay) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'display'),
							value: display,
							attribute: 'publisherDisplay',
							blockName: block.blockName,
						}}
					>
						<ToggleSelectControl
							label={__('Display', 'publisher-core')}
							labelDescription={
								<>
									<p>
										{__(
											'The Display is essential to defining how blocks are formatted and arranged on the page.',
											'publisher-core'
										)}
									</p>
									<h3>
										<DisplayBlockIcon />
										{__('Block', 'publisher-core')}
									</h3>
									<p>
										{__(
											'Block take up the full width available, starting on a new line.',
											'publisher-core'
										)}
									</p>
									<h3>
										<DisplayFlexIcon />
										{__('Flex', 'publisher-core')}
									</h3>
									<p>
										{__(
											'Implements a flexible box layout, making it easier to design responsive layouts.',
											'publisher-core'
										)}
									</p>
									<h3>
										<DisplayGridIcon />
										{__('Grid', 'publisher-core')}
										<span>
											{__(
												'Coming soon…',
												'publisher-core'
											)}
										</span>
									</h3>
									<p>
										{__(
											'Creates a grid-based layout, providing precise control over rows and columns.',
											'publisher-core'
										)}
									</p>
									<h3>
										<DisplayInlineBlockIcon />
										{__('Inline Block', 'publisher-core')}
									</h3>
									<p>
										{__(
											'Behaves like "inline" but respects width and height values.',
											'publisher-core'
										)}
									</p>
									<h3>
										<DisplayInlineIcon />
										{__('Inline', 'publisher-core')}
									</h3>
									<p>
										{__(
											'Elements do not start on a new line and only occupy as much width as necessary.',
											'publisher-core'
										)}
									</p>
									<h3>
										<DisplayNoneIcon />
										{__('None', 'publisher-core')}
									</h3>
									<p>
										{__(
											'Completely hides the block from the layout, but note that the block remains in the HTML document.',
											'publisher-core'
										)}
									</p>
								</>
							}
							columns="1fr 160px"
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
								// {
								// 	label: __('Grid', 'publisher-core'),
								// 	value: 'grid',
								// 	icon: <DisplayGridIcon />,
								// },
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
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'publisherDisplay',
									newValue,
									{ ref }
								)
							}
							{...extensionProps.publisherDisplay}
						/>
						{display === 'none' && (
							<NoticeControl
								type="information"
								style={{ marginTop: '20px' }}
							>
								{__(
									'Your block is set to "display: none", which hides it from view on page. Double-check and ensure this is intentional.',
									'publisher-core'
								)}
							</NoticeControl>
						)}
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
											attribute: 'publisherFlexDirection',
											blockName: block.blockName,
											type: 'nested',
										}}
									>
										<ToggleSelectControl
											className={
												flexDirectionClassName +
												' publisher-flex-direction'
											}
											label={__(
												'Direction',
												'publisher-core'
											)}
											labelPopoverTitle={__(
												'Flex Direction',
												'publisher-core'
											)}
											labelDescription={
												<>
													<p>
														{__(
															'Flex Direction controls the direction in which flex items are placed in the flex container.',
															'publisher-core'
														)}
													</p>
													<h3>
														<FlexDirectionRowBlockIcon />
														{__(
															'Row Direction',
															'publisher-core'
														)}
													</h3>
													<p>
														{__(
															'Positions items in a horizontal row, following the text direction.',
															'publisher-core'
														)}
													</p>
													<h3>
														<FlexDirectionColumnBlockIcon />
														{__(
															'Column Direction',
															'publisher-core'
														)}
													</h3>
													<p>
														{__(
															'Aligns items vertically, stacking them from top to bottom.',
															'publisher-core'
														)}
													</p>
													<p>
														<span
															style={{
																fontWeight:
																	'600',
																color: '#ffffff',
															}}
														>
															{__(
																'Note:',
																'publisher-core'
															)}
														</span>{' '}
														{__(
															'Using the reverse function will reorder items in a row or column in the opposite direction!',
															'publisher-core'
														)}
													</p>
												</>
											}
											columns="80px 120px"
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
											defaultValue="row"
											onChange={(newValue, ref) => {
												handleOnChangeAttributes(
													'publisherFlexDirection',
													{
														...flexDirection,
														value: newValue,
													},
													{ ref }
												);
											}}
											{...extensionProps.publisherFlexDirection}
										/>
									</ControlContextProvider>

									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'direction'
											),
											value: flexDirection.reverse,
											attribute: 'publisherFlexDirection',
											blockName: block.blockName,
										}}
									>
										<Button
											showTooltip={true}
											tooltipPosition="top"
											label={__(
												'Reverse Flex Direction',
												'publisher-core'
											)}
											size="small"
											style={{
												color: flexDirection?.reverse
													? 'var(--publisher-controls-primary-color)'
													: 'var(--publisher-controls-color)',
												padding: '6px',
											}}
											onClick={() => {
												handleOnChangeAttributes(
													'publisherFlexDirection',
													{
														...flexDirection,
														reverse:
															!flexDirection.reverse,
													}
												);
											}}
											disabled={
												flexDirection.value === ''
											}
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
									attribute: 'publisherAlignItems',
									blockName: block.blockName,
								}}
							>
								<ToggleSelectControl
									columns="80px 160px"
									className={
										flexDirectionClassName +
										' publisher-flex-align-items'
									}
									label={__('Align Items', 'publisher-core')}
									labelDescription={
										<>
											<p>
												{__(
													'Align-Items controls the alignment of items on the cross axis in a flex container',
													'publisher-core'
												)}
											</p>
											<h3>
												<AlignItemsFlexStartBlockIcon />
												{__(
													'Flex Start',
													'publisher-core'
												)}
											</h3>
											<p>
												{__(
													"Aligns items to the start of the container's cross axis.",
													'publisher-core'
												)}
											</p>
											<h3>
												<AlignItemsCenterBlockIcon />
												{__('Center', 'publisher-core')}
											</h3>
											<p>
												{__(
													'Centers items along the cross axis.',
													'publisher-core'
												)}
											</p>
											<h3>
												<AlignItemsFlexEndBlockIcon />
												{__(
													'Flex End',
													'publisher-core'
												)}
											</h3>
											<p>
												{__(
													'Aligns items to the end of the cross axis.',
													'publisher-core'
												)}
											</p>
											<h3>
												<AlignItemsFlexEndBlockIcon />
												{__(
													'Stretch',
													'publisher-core'
												)}
											</h3>
											<p>
												{__(
													'Stretches items to fill the container (default behavior).',
													'publisher-core'
												)}
											</p>
											<h3>
												<AlignItemsBaselineBlockIcon />
												{__(
													'Baseline',
													'publisher-core'
												)}
											</h3>
											<p>
												{__(
													'Aligns items based on their baseline.',
													'publisher-core'
												)}
											</p>
										</>
									}
									isDeselectable={true}
									//
									defaultValue=""
									onChange={(newValue, ref) =>
										handleOnChangeAttributes(
											'publisherAlignItems',
											newValue,
											{ ref }
										)
									}
									options={[
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
												'Center',
												'publisher-core'
											),
											value: 'center',
											icon: <AlignItemsCenterBlockIcon />,
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
									{...extensionProps.publisherAlignItems}
								/>
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
									attribute: 'publisherJustifyContent',
									blockName: block.blockName,
								}}
							>
								<ToggleSelectControl
									columns="80px 160px"
									className={
										flexDirectionClassName +
										' publisher-flex-justify-content'
									}
									controlName="toggle-select"
									label={__('Justify', 'publisher-core')}
									labelPopoverTitle={__(
										'Justify Content',
										'publisher-core'
									)}
									labelDescription={
										<>
											<p>
												{__(
													'Justify-Content determines the distribution of flex items along the main axis in a flex container.',
													'publisher-core'
												)}
											</p>
											<h3>
												<JustifyFlexStartIcon />
												{__(
													'Flex Start',
													'publisher-core'
												)}
											</h3>
											<p>
												{__(
													'Aligns items to the start of the main axis.',
													'publisher-core'
												)}
											</p>
											<h3>
												<JustifyCenterIcon />
												{__('Center', 'publisher-core')}
											</h3>
											<p>
												{__(
													'Centers items along the main axis.',
													'publisher-core'
												)}
											</p>
											<h3>
												<JustifyFlexEndIcon />
												{__(
													'Flex End',
													'publisher-core'
												)}
											</h3>
											<p>
												{__(
													'Aligns items at the end of the main axis.',
													'publisher-core'
												)}
											</p>
											<h3>
												<JustifySpaceBetweenIcon />
												{__(
													'Space Between',
													'publisher-core'
												)}
											</h3>
											<p>
												{__(
													'Distributes items evenly, with the first item at the start and the last at the end.',
													'publisher-core'
												)}
											</p>
											<h3>
												<JustifySpaceAroundIcon />
												{__(
													'Space Around',
													'publisher-core'
												)}
											</h3>
											<p>
												{__(
													'Distributes items evenly with equal space around each item.',
													'publisher-core'
												)}
											</p>
											<h3>
												<JustifySpaceEvenlyIcon />
												{__(
													'Space Evenly',
													'publisher-core'
												)}
											</h3>
											<p>
												{__(
													'Distributes items with equal spacing between each item.',
													'publisher-core'
												)}
											</p>
										</>
									}
									options={[
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
												'Center',
												'publisher-core'
											),
											value: 'center',
											icon: <JustifyCenterIcon />,
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
											icon: <JustifySpaceBetweenIcon />,
										},
										{
											label: __(
												'Space Around',
												'publisher-core'
											),
											value: 'space-around',
											icon: <JustifySpaceAroundIcon />,
										},
										{
											label: __(
												'Space Evenly',
												'publisher-core'
											),
											value: 'space-evenly',
											icon: <JustifySpaceEvenlyIcon />,
										},
									]}
									isDeselectable={true}
									//
									defaultValue=""
									onChange={(newValue, ref) =>
										handleOnChangeAttributes(
											'publisherJustifyContent',
											newValue,
											{ ref }
										)
									}
									{...extensionProps.publisherJustifyContent}
								/>
							</ControlContextProvider>
						)}

						{isActiveField(publisherGap) && (
							<ControlContextProvider
								value={{
									name: generateExtensionId(block, 'gap'),
									value: gap,
									attribute: 'publisherGap',
									blockName: block.blockName,
									type: 'nested',
								}}
							>
								<Gap
									block={block}
									gap={gap}
									field={publisherGap}
									attributeId="publisherGap"
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
									{...extensionProps.publisherGap}
								/>
							</ControlContextProvider>
						)}

						{isActiveField(publisherFlexWrap) && (
							<>
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'flexWrap'
										),
										value: flexWrap.value,
										attribute: 'publisherFlexWrap',
										blockName: block.blockName,
										type: 'nested',
									}}
								>
									<BaseControl columns="columns-1">
										<Flex>
											<ToggleSelectControl
												columns="80px 120px"
												className={
													flexDirectionClassName +
													' publisher-flex-wrap'
												}
												label={__(
													'Children',
													'publisher-core'
												)}
												labelPopoverTitle={__(
													'Children Wrap',
													'publisher-core'
												)}
												labelDescription={
													<>
														<p>
															{__(
																'It controls whether flex items are forced into a single line or can be wrapped onto multiple lines, adjusting layout flexibility and responsiveness.',
																'publisher-core'
															)}
														</p>
														<p>
															{__(
																'It is crucial for managing the layout of flex items, especially when the container cannot accommodate all items in one row, ensuring content adaptability and orderliness.',
																'publisher-core'
															)}
														</p>

														<h3>
															<WrapNoWrapIcon />
															{__(
																'No Wrap',
																'publisher-core'
															)}
														</h3>
														<p>
															{__(
																'All flex items will be on one line regardless of their size.',
																'publisher-core'
															)}
														</p>
														<h3>
															<WrapWrapIcon />
															{__(
																'Wrap',
																'publisher-core'
															)}
														</h3>
														<p>
															{__(
																'Flex items will wrap onto multiple lines, from top to bottom.',
																'publisher-core'
															)}
														</p>
														<p>
															<span
																style={{
																	fontWeight:
																		'600',
																	color: '#ffffff',
																}}
															>
																{__(
																	'Note:',
																	'publisher-core'
																)}
															</span>{' '}
															{__(
																'Using the reverse function flex items will wrap onto multiple lines in reverse order.',
																'publisher-core'
															)}
														</p>
													</>
												}
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
														icon: <WrapWrapIcon />,
													},
												]}
												//
												defaultValue={'nowrap'}
												onChange={(newValue, ref) => {
													if (newValue === 'nowrap') {
														handleOnChangeAttributes(
															'publisherFlexWrap',
															{
																value: newValue,
																reverse: false,
															},
															{ ref }
														);
													} else {
														handleOnChangeAttributes(
															'publisherFlexWrap',
															{
																...flexWrap,
																value: 'wrap',
															},
															{ ref }
														);
													}
												}}
												{...extensionProps.publisherFlexWrap}
											/>
											<Button
												showTooltip={true}
												tooltipPosition="top"
												label={__(
													'Reverse Children Wrapping',
													'publisher-core'
												)}
												size="small"
												style={{
													color: flexWrap?.reverse
														? 'var(--publisher-controls-primary-color)'
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
															...flexWrap,
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
									flexWrap?.value !== '' &&
									flexWrap?.value !== undefined &&
									flexWrap?.value !== 'nowrap' && (
										<ControlContextProvider
											value={{
												name: generateExtensionId(
													block,
													'align-content'
												),
												value: alignContent,
												attribute:
													'publisherAlignContent',
												blockName: block.blockName,
											}}
										>
											<ToggleSelectControl
												label={__(
													'Align Content',
													'publisher-core'
												)}
												labelDescription={
													<>
														<p>
															{__(
																'Align-Content controls the alignment and distribution of lines within a flex container when there is extra space along the cross-axis, offering various alignment options.',
																'publisher-core'
															)}
														</p>
														<p>
															{__(
																'This property is vital in multi-line flex containers, especially when the height of the container is greater than that of the flex items, ensuring a balanced, visually appealing layout.',
																'publisher-core'
															)}
														</p>
														<h3>
															<AlignContentFlexStartIcon />
															{__(
																'Flex Start',
																'publisher-core'
															)}
														</h3>
														<p>
															{__(
																'Packs lines toward the start of the container.',
																'publisher-core'
															)}
														</p>
														<h3>
															<AlignContentCenterIcon />
															{__(
																'Center',
																'publisher-core'
															)}
														</h3>
														<p>
															{__(
																'Centers lines within the container.',
																'publisher-core'
															)}
														</p>
														<h3>
															<AlignContentFlexEndIcon />
															{__(
																'Flex End',
																'publisher-core'
															)}
														</h3>
														<p>
															{__(
																'Packs lines toward the end of the container.',
																'publisher-core'
															)}
														</p>
														<h3>
															<AlignContentSpaceAroundIcon />
															{__(
																'Space Around',
																'publisher-core'
															)}
														</h3>
														<p>
															{__(
																'Distributes lines evenly, with equal space around each line.',
																'publisher-core'
															)}
														</p>
														<h3>
															<AlignContentSpaceBetweenIcon />
															{__(
																'Space Between',
																'publisher-core'
															)}
														</h3>
														<p>
															{__(
																'Distributes lines evenly, with the first line at the start and the last at the end.',
																'publisher-core'
															)}
														</p>
														<h3>
															<AlignContentStretchIcon />
															{__(
																'Stretch',
																'publisher-core'
															)}
														</h3>
														<p>
															{__(
																'Stretches lines to fill the container (default behavior).',
																'publisher-core'
															)}
														</p>
													</>
												}
												columns="80px 160px"
												className={
													flexDirectionClassName +
													' publisher-flex-align-content' +
													`${
														flexWrap.reverse
															? ' reverse'
															: ''
													}`
												}
												options={[
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
															'Center',
															'publisher-core'
														),
														value: 'center',
														icon: (
															<AlignContentCenterIcon />
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
												onChange={(newValue, ref) =>
													handleOnChangeAttributes(
														'publisherAlignContent',
														newValue,
														{ ref }
													)
												}
												{...extensionProps.publisherAlignContent}
											/>
										</ControlContextProvider>
									)}
							</>
						)}
					</>
				)}

				{'grid' === display && (
					<GridBuilder
						type={block.blockName}
						id={block.clientId}
						position={{ top: 0, left: 0 }}
						dimension={{ width: 320, height: 200 }}
					>
						<BlockComponent />
					</GridBuilder>
				)}
			</>
		);
	},
	hasSameProps
);
