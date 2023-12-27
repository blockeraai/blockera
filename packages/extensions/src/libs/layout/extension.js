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
	ToggleSelectControl,
	NoticeControl,
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
import DisplayGridIcon from './icons/display-grid';
import { FlexGap } from './components';

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
											'The Display is essential to defining how elements are formatted and arranged on the page.',
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
									</h3>
									<p style={{ marginBottom: '0' }}>
										{__(
											'Creates a grid-based layout, providing precise control over rows and columns.',
											'publisher-core'
										)}
									</p>
									<p
										style={{
											color: 'var(--publisher-controls-primary-color)',
											fontStyle: 'italic',
											display: 'inline-block',
											marginBottom: '0',
										}}
									>
										{__('Coming soon…', 'publisher-core')}
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
											'Completely hides the element from the layout, but note that the element remains in the HTML document.',
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
											isDeselectable={true}
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
											defaultValue={
												flexDirection.value || ''
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
											attribute: 'publisherFlexDirection',
											blockName: block.blockName,
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
													? 'var(--publisher-controls-primary-color)'
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
									attribute: 'publisherAlignItems',
									blockName: block.blockName,
								}}
							>
								<ToggleSelectControl
									columns="80px 160px"
									className={
										'publisher-direction-' +
										flexDirection.value +
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
									onChange={(newValue) =>
										handleOnChangeAttributes(
											'publisherAlignItems',
											newValue
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
										'publisher-direction-' +
										flexDirection.value +
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
									onChange={(newValue) =>
										handleOnChangeAttributes(
											'publisherJustifyContent',
											newValue
										)
									}
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
								}}
							>
								<FlexGap
									block={block}
									gap={gap}
									publisherGap={publisherGap}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
								/>
							</ControlContextProvider>
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
										attribute: 'publisherFlexWrap',
										blockName: block.blockName,
									}}
								>
									<BaseControl columns="columns-1">
										<Flex>
											<ToggleSelectControl
												columns="80px 120px"
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
												onChange={(newValue) => {
													if (newValue === 'nowrap') {
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
													'publisher-direction-' +
													flexDirection.value +
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
												onChange={(newValue) =>
													handleOnChangeAttributes(
														'publisherAlignContent',
														newValue
													)
												}
											/>
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
