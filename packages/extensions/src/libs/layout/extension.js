// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useEffect } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';
import { dispatch } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import {
	BaseControl,
	PanelBodyControl,
	ControlContextProvider,
	ToggleSelectControl,
	NoticeControl,
	LayoutMatrixControl,
} from '@blockera/controls';
import { hasSameProps } from '@blockera/utils';
import { Flex, Button, FeatureWrapper } from '@blockera/components';
import { extensionClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { Gap } from './components';
import { useBlockContext } from '../../hooks';
import { isShowField } from '../../api/utils';
import DisplayGridIcon from './icons/display-grid';
import { default as ReverseIcon } from './icons/reverse';
import type { TLayoutProps } from './types/layout-props';
import { GridBuilder } from '../../components/grid-builder';
import { default as WrapWrapIcon } from './icons/wrap-wrap';
import { generateExtensionId } from '../utils';
import { default as WrapNoWrapIcon } from './icons/wrap-nowrap';
import { default as DisplayNoneIcon } from './icons/display-none';
import { default as DisplayFlexIcon } from './icons/display-flex';
import { default as DisplayBlockIcon } from './icons/display-block';
import { default as DisplayInlineIcon } from './icons/display-inline';
import { default as DisplayInlineBlockIcon } from './icons/display-inline-block';
import { default as AlignContentCenterIcon } from './icons/align-content-center';
import { default as AlignContentStretchIcon } from './icons/align-content-stretch';
import { default as AlignContentFlexEndIcon } from './icons/align-content-flex-end';
import { default as AlignContentFlexStartIcon } from './icons/align-content-flex-start';
import { default as AlignContentSpaceAroundIcon } from './icons/align-content-space-around';
import { default as AlignContentSpaceBetweenIcon } from './icons/align-content-space-between';
import { LayoutExtensionIcon } from './index';
import { ExtensionSettings } from '../settings';

export const LayoutExtension: ComponentType<TLayoutProps> = memo(
	({
		block,
		values,
		handleOnChangeAttributes,
		extensionProps,
		extensionConfig,
		attributes,
		setSettings,
	}: TLayoutProps): MixedElement => {
		const isShowDisplay = isShowField(
			extensionConfig.blockeraDisplay,
			values?.blockeraDisplay,
			attributes.blockeraDisplay.default
		);
		const isShowFlexLayout = isShowField(
			extensionConfig.blockeraFlexLayout,
			values?.blockeraFlexLayout,
			attributes.blockeraFlexLayout.default
		);
		const isShowGap = isShowField(
			extensionConfig.blockeraGap,
			values?.blockeraGap,
			attributes.blockeraGap.default
		);
		const isShowFlexWrap = isShowField(
			extensionConfig.blockeraFlexWrap,
			values?.blockeraFlexWrap,
			attributes.blockeraFlexWrap.default
		);
		const isShowAlignContent = isShowField(
			extensionConfig.blockeraAlignContent,
			values?.blockeraAlignContent,
			attributes.blockeraAlignContent.default
		);

		const { setOpenGridBuilder } =
			dispatch('blockera-core/extensions') || {};

		const { BlockComponent } = useBlockContext();

		useEffect(() => {
			//FIXME: please implements handler for "setOpenGridBuilder"!
			// that handler must be order by display grid value and should have flag for open or not open grid builder!
			if ('grid' === values.blockeraDisplay) {
				// FIXME: replace "true" with implemented internal flag to open Grid Builder.
				setOpenGridBuilder(true);
			} else {
				// FIXME: replace "false" with implemented internal flag to close Grid Builder.
				setOpenGridBuilder(false);
			}
			// eslint-disable-next-line
		}, [values.blockeraDisplay]);

		if (
			!isShowDisplay ||
			(!isShowFlexLayout &&
				!isShowGap &&
				!isShowFlexWrap &&
				!isShowAlignContent)
		) {
			return <></>;
		}

		return (
			<PanelBodyControl
				title={__('Layout', 'blockera-core')}
				initialOpen={true}
				icon={<LayoutExtensionIcon />}
				className={extensionClassNames('layout')}
			>
				<ExtensionSettings
					buttonLabel={__('More Layout Settings', 'blockera-core')}
					features={extensionConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'layoutConfig');
					}}
				/>

				<FeatureWrapper
					isActive={isShowDisplay}
					config={extensionConfig.blockeraDisplay}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'display'),
							value: values.blockeraDisplay,
							attribute: 'blockeraDisplay',
							blockName: block.blockName,
						}}
					>
						<ToggleSelectControl
							label={__('Display', 'blockera-core')}
							labelDescription={
								<>
									<p>
										{__(
											'The Display is essential to defining how blocks are formatted and arranged on the page.',
											'blockera-core'
										)}
									</p>
									<h3>
										<DisplayBlockIcon />
										{__('Block', 'blockera-core')}
									</h3>
									<p>
										{__(
											'Block take up the full width available, starting on a new line.',
											'blockera-core'
										)}
									</p>
									<h3>
										<DisplayFlexIcon />
										{__('Flex', 'blockera-core')}
									</h3>
									<p>
										{__(
											'Implements a flexible box layout, making it easier to design responsive layouts.',
											'blockera-core'
										)}
									</p>
									<h3>
										<DisplayGridIcon />
										{__('Grid', 'blockera-core')}
										<span>
											{__(
												'Coming soon…',
												'blockera-core'
											)}
										</span>
									</h3>
									<p>
										{__(
											'Creates a grid-based layout, providing precise control over rows and columns.',
											'blockera-core'
										)}
									</p>
									<h3>
										<DisplayInlineBlockIcon />
										{__('Inline Block', 'blockera-core')}
									</h3>
									<p>
										{__(
											'Behaves like "inline" but respects width and height values.',
											'blockera-core'
										)}
									</p>
									<h3>
										<DisplayInlineIcon />
										{__('Inline', 'blockera-core')}
									</h3>
									<p>
										{__(
											'Elements do not start on a new line and only occupy as much width as necessary.',
											'blockera-core'
										)}
									</p>
									<h3>
										<DisplayNoneIcon />
										{__('None', 'blockera-core')}
									</h3>
									<p>
										{__(
											'Completely hides the block from the layout, but note that the block remains in the HTML document.',
											'blockera-core'
										)}
									</p>
								</>
							}
							columns="1fr 160px"
							options={[
								{
									label: __('Block', 'blockera-core'),
									value: 'block',
									icon: <DisplayBlockIcon />,
								},
								{
									label: __('Flex', 'blockera-core'),
									value: 'flex',
									icon: <DisplayFlexIcon />,
								},
								// {
								// 	label: __('Grid', 'blockera-core'),
								// 	value: 'grid',
								// 	icon: <DisplayGridIcon />,
								// },
								{
									label: __('Inline Block', 'blockera-core'),
									value: 'inline-block',
									icon: <DisplayInlineBlockIcon />,
								},
								{
									label: __('Inline', 'blockera-core'),
									value: 'inline',
									icon: <DisplayInlineIcon />,
								},
								{
									label: __('None', 'blockera-core'),
									value: 'none',
									icon: <DisplayNoneIcon />,
								},
							]}
							isDeselectable={true}
							//
							defaultValue={attributes.blockeraDisplay.default}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'blockeraDisplay',
									newValue,
									{ ref }
								)
							}
							{...extensionProps.blockeraDisplay}
						/>

						{values.blockeraDisplay === 'none' && (
							<NoticeControl
								type="information"
								style={{ marginTop: '20px' }}
							>
								{__(
									'Your block is set to "display: none", which hides it from view on page. Double-check and ensure this is intentional.',
									'blockera-core'
								)}
							</NoticeControl>
						)}
					</ControlContextProvider>
				</FeatureWrapper>

				{values.blockeraDisplay === 'flex' && (
					<>
						<FeatureWrapper
							isActive={isShowFlexLayout}
							config={extensionConfig.blockeraFlexLayout}
						>
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										block,
										'flex-layout'
									),
									value: values.blockeraFlexLayout,
									attribute: 'blockeraFlexLayout',
									blockName: block.blockName,
								}}
							>
								<LayoutMatrixControl
									columns="80px 160px"
									label={__('Flex Layout', 'blockera-core')}
									labelDescription={
										<>
											<p>
												{__(
													'This is an intuitive interface for you to effortlessly configure Flexbox properties easily.',
													'blockera-core'
												)}
											</p>
											<p>
												{__(
													'You have the ability to configure the flex direction as either horizontal or vertical, and you can also select how items are aligned along these axes.',
													'blockera-core'
												)}
											</p>
										</>
									}
									defaultValue={
										attributes.blockeraFlexLayout.default
									}
									onChange={(newValue, ref) =>
										handleOnChangeAttributes(
											'blockeraFlexLayout',
											newValue,
											{ ref }
										)
									}
									{...extensionProps.blockeraFlexLayout}
								/>
							</ControlContextProvider>
						</FeatureWrapper>

						<FeatureWrapper
							isActive={isShowGap}
							config={extensionConfig.blockeraGap}
						>
							<ControlContextProvider
								value={{
									name: generateExtensionId(block, 'gap'),
									value: values.blockeraGap,
									attribute: 'blockeraGap',
									blockName: block.blockName,
									type: 'nested',
								}}
							>
								<Gap
									block={block}
									gap={values.blockeraGap}
									field={extensionConfig.blockeraGap}
									attributeId="blockeraGap"
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
									defaultValue={
										attributes.blockeraGap.default
									}
									{...extensionProps.blockeraGap}
								/>
							</ControlContextProvider>
						</FeatureWrapper>

						<FeatureWrapper
							isActive={isShowFlexWrap}
							config={extensionConfig.blockeraFlexWrap}
						>
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										block,
										'flexWrap'
									),
									value: values.blockeraFlexWrap,
									attribute: 'blockeraFlexWrap',
									blockName: block.blockName,
									type: 'nested',
								}}
							>
								<BaseControl columns="columns-1">
									<Flex>
										<ToggleSelectControl
											id={'value'}
											columns="80px 120px"
											label={__(
												'Children Wrap',
												'blockera-core'
											)}
											labelDescription={
												<>
													<p>
														{__(
															'It controls whether flex items are forced into a single line or can be wrapped onto multiple lines, adjusting layout flexibility and responsiveness.',
															'blockera-core'
														)}
													</p>
													<p>
														{__(
															'It is crucial for managing the layout of flex items, especially when the container cannot accommodate all items in one row, ensuring content adaptability and orderliness.',
															'blockera-core'
														)}
													</p>

													<h3>
														<WrapNoWrapIcon />
														{__(
															'No Wrap',
															'blockera-core'
														)}
													</h3>
													<p>
														{__(
															'All flex items will be on one line regardless of their size.',
															'blockera-core'
														)}
													</p>
													<h3>
														<WrapWrapIcon />
														{__(
															'Wrap',
															'blockera-core'
														)}
													</h3>
													<p>
														{__(
															'Flex items will wrap onto multiple lines, from top to bottom.',
															'blockera-core'
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
																'blockera-core'
															)}
														</span>{' '}
														{__(
															'Using the reverse function flex items will wrap onto multiple lines in reverse order.',
															'blockera-core'
														)}
													</p>
												</>
											}
											options={[
												{
													label: __(
														'No Wrap',
														'blockera-core'
													),
													value: 'nowrap',
													icon: <WrapNoWrapIcon />,
												},
												{
													label: __(
														'Wrap',
														'blockera-core'
													),
													value: 'wrap',
													icon: <WrapWrapIcon />,
												},
											]}
											//
											defaultValue={
												attributes.blockeraFlexWrap
													.default.value
											}
											onChange={(newValue, ref) => {
												if (newValue === '') {
													handleOnChangeAttributes(
														'blockeraFlexWrap',
														attributes
															.blockeraFlexWrap
															.default,
														{ ref }
													);
												} else if (
													newValue === 'nowrap'
												) {
													handleOnChangeAttributes(
														'blockeraFlexWrap',
														{
															value: newValue,
															reverse: false,
														},
														{ ref }
													);
												} else {
													handleOnChangeAttributes(
														'blockeraFlexWrap',
														{
															...values.blockeraFlexWrap,
															value: 'wrap',
														},
														{ ref }
													);
												}
											}}
											isDeselectable={true}
											{...extensionProps.blockeraFlexWrap}
										/>

										<Button
											showTooltip={true}
											tooltipPosition="top"
											label={__(
												'Reverse Children Wrapping',
												'blockera-core'
											)}
											size="small"
											style={{
												color: values.blockeraFlexWrap
													?.reverse
													? 'var(--blockera-controls-primary-color)'
													: 'var(--blockera-controls-color)',
												padding: '6px',
											}}
											disabled={
												values.blockeraFlexWrap
													.value === 'nowrap' || ''
											}
											onClick={() => {
												handleOnChangeAttributes(
													'blockeraFlexWrap',
													{
														...values.blockeraFlexWrap,
														reverse:
															!values
																.blockeraFlexWrap
																.reverse,
													}
												);
											}}
										>
											<ReverseIcon />
										</Button>
									</Flex>
								</BaseControl>
							</ControlContextProvider>

							{values.blockeraFlexWrap?.value === 'wrap' && (
								<FeatureWrapper
									isActive={isShowAlignContent}
									config={
										extensionConfig.blockeraAlignContent
									}
								>
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'align-content'
											),
											value: values.blockeraAlignContent,
											attribute: 'blockeraAlignContent',
											blockName: block.blockName,
										}}
									>
										<ToggleSelectControl
											label={__(
												'Align Content',
												'blockera-core'
											)}
											labelDescription={
												<>
													<p>
														{__(
															'Align-Content controls the alignment and distribution of lines within a flex container when there is extra space along the cross-axis, offering various alignment options.',
															'blockera-core'
														)}
													</p>
													<p>
														{__(
															'This property is vital in multi-line flex containers, especially when the height of the container is greater than that of the flex items, ensuring a balanced, visually appealing layout.',
															'blockera-core'
														)}
													</p>
													<h3>
														<AlignContentFlexStartIcon />
														{__(
															'Flex Start',
															'blockera-core'
														)}
													</h3>
													<p>
														{__(
															'Packs lines toward the start of the container.',
															'blockera-core'
														)}
													</p>
													<h3>
														<AlignContentCenterIcon />
														{__(
															'Center',
															'blockera-core'
														)}
													</h3>
													<p>
														{__(
															'Centers lines within the container.',
															'blockera-core'
														)}
													</p>
													<h3>
														<AlignContentFlexEndIcon />
														{__(
															'Flex End',
															'blockera-core'
														)}
													</h3>
													<p>
														{__(
															'Packs lines toward the end of the container.',
															'blockera-core'
														)}
													</p>
													<h3>
														<AlignContentSpaceAroundIcon />
														{__(
															'Space Around',
															'blockera-core'
														)}
													</h3>
													<p>
														{__(
															'Distributes lines evenly, with equal space around each line.',
															'blockera-core'
														)}
													</p>
													<h3>
														<AlignContentSpaceBetweenIcon />
														{__(
															'Space Between',
															'blockera-core'
														)}
													</h3>
													<p>
														{__(
															'Distributes lines evenly, with the first line at the start and the last at the end.',
															'blockera-core'
														)}
													</p>
													<h3>
														<AlignContentStretchIcon />
														{__(
															'Stretch',
															'blockera-core'
														)}
													</h3>
													<p>
														{__(
															'Stretches lines to fill the container (default behavior).',
															'blockera-core'
														)}
													</p>
												</>
											}
											columns="80px 160px"
											options={[
												{
													label: __(
														'Flex Start',
														'blockera-core'
													),
													value: 'flex-start',
													icon: (
														<AlignContentFlexStartIcon />
													),
												},
												{
													label: __(
														'Center',
														'blockera-core'
													),
													value: 'center',
													icon: (
														<AlignContentCenterIcon />
													),
												},
												{
													label: __(
														'Flex End',
														'blockera-core'
													),
													value: 'flex-end',
													icon: (
														<AlignContentFlexEndIcon />
													),
												},
												{
													label: __(
														'Space Around',
														'blockera-core'
													),
													value: 'space-around',
													icon: (
														<AlignContentSpaceAroundIcon />
													),
												},
												{
													label: __(
														'Space Between',
														'blockera-core'
													),
													value: 'space-between',
													icon: (
														<AlignContentSpaceBetweenIcon />
													),
												},
												{
													label: __(
														'Stretch',
														'blockera-core'
													),
													value: 'stretch',
													icon: (
														<AlignContentStretchIcon />
													),
												},
											]}
											isDeselectable={true}
											//
											defaultValue={
												attributes.blockeraAlignContent
													.default
											}
											onChange={(newValue, ref) =>
												handleOnChangeAttributes(
													'blockeraAlignContent',
													newValue,
													{ ref }
												)
											}
											{...extensionProps.blockeraAlignContent}
										/>
									</ControlContextProvider>
								</FeatureWrapper>
							)}
						</FeatureWrapper>
					</>
				)}

				{'grid' === values.blockeraDisplay && (
					<GridBuilder
						type={block.blockName}
						id={block.clientId}
						position={{ top: 0, left: 0 }}
						dimension={{ width: 320, height: 200 }}
					>
						<BlockComponent />
					</GridBuilder>
				)}
			</PanelBodyControl>
		);
	},
	hasSameProps
);
