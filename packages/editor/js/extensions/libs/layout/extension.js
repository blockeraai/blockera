// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import {
	Flex,
	Button,
	BaseControl,
	PanelBodyControl,
	ControlContextProvider,
	ToggleSelectControl,
	NoticeControl,
	LayoutMatrixControl,
} from '@blockera/controls';
import { hasSameProps } from '@blockera/utils';
import { extensionClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Gap } from './components';
import { isShowField } from '../../api/utils';
import { EditorFeatureWrapper } from '../../../';
import type { TLayoutProps } from './types/layout-props';
import { generateExtensionId } from '../utils';
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
				title={__('Layout', 'blockera')}
				initialOpen={true}
				icon={<Icon icon="extension-layout" />}
				className={extensionClassNames('layout')}
			>
				<ExtensionSettings
					buttonLabel={__('More Layout Settings', 'blockera')}
					features={extensionConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'layoutConfig');
					}}
				/>

				<EditorFeatureWrapper
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
							label={__('Display', 'blockera')}
							labelDescription={
								<>
									<p>
										{__(
											'The Display is essential to defining how blocks are formatted and arranged on the page.',
											'blockera'
										)}
									</p>
									<h3>
										<Icon
											icon="display-block"
											iconSize={22}
										/>
										{__('Block', 'blockera')}
									</h3>
									<p>
										{__(
											'Block take up the full width available, starting on a new line.',
											'blockera'
										)}
									</p>
									<h3>
										<Icon
											icon="display-flex"
											iconSize={22}
										/>
										{__('Flex', 'blockera')}
									</h3>
									<p>
										{__(
											'Implements a flexible box layout, making it easier to design responsive layouts.',
											'blockera'
										)}
									</p>
									<h3>
										<Icon
											icon="display-grid"
											iconSize={22}
										/>
										{__('Grid', 'blockera')}
									</h3>
									<p>
										{__(
											'Creates a grid-based layout, providing precise control over rows and columns.',
											'blockera'
										)}
									</p>
									<h3>
										<Icon
											icon="display-inline-block"
											iconSize={22}
										/>
										{__('Inline Block', 'blockera')}
									</h3>
									<p>
										{__(
											'Behaves like "inline" but respects width and height values.',
											'blockera'
										)}
									</p>
									<h3>
										<Icon
											icon="display-inline"
											iconSize={22}
										/>
										{__('Inline', 'blockera')}
									</h3>
									<p>
										{__(
											'Elements do not start on a new line and only occupy as much width as necessary.',
											'blockera'
										)}
									</p>
									<h3>
										<Icon
											icon="display-none"
											iconSize={22}
										/>
										{__('None', 'blockera')}
									</h3>
									<p>
										{__(
											'Completely hides the block from the layout, but note that the block remains in the HTML document.',
											'blockera'
										)}
									</p>
								</>
							}
							columns="1fr 160px"
							options={[
								{
									label: __('Block', 'blockera'),
									value: 'block',
									icon: (
										<Icon
											icon="display-block"
											iconSize={18}
										/>
									),
								},
								{
									label: __('Flex', 'blockera'),
									value: 'flex',
									icon: (
										<Icon
											icon="display-flex"
											iconSize={18}
										/>
									),
								},
								{
									label: __('Grid', 'blockera'),
									value: 'grid',
									icon: (
										<Icon
											icon="display-grid"
											iconSize={18}
										/>
									),
								},
								{
									label: __('Inline Block', 'blockera'),
									value: 'inline-block',
									icon: (
										<Icon
											icon="display-inline-block"
											iconSize={18}
										/>
									),
								},
								{
									label: __('Inline', 'blockera'),
									value: 'inline',
									icon: (
										<Icon
											icon="display-inline"
											iconSize={18}
										/>
									),
								},
								{
									label: __('None', 'blockera'),
									value: 'none',
									icon: (
										<Icon
											icon="display-none"
											iconSize={18}
										/>
									),
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
									'blockera'
								)}
							</NoticeControl>
						)}
					</ControlContextProvider>
				</EditorFeatureWrapper>

				{values.blockeraDisplay === 'flex' && (
					<EditorFeatureWrapper
						isActive={isShowFlexLayout}
						config={extensionConfig.blockeraFlexLayout}
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'flex-layout'),
								value: values.blockeraFlexLayout,
								attribute: 'blockeraFlexLayout',
								blockName: block.blockName,
							}}
						>
							<LayoutMatrixControl
								columns="80px 160px"
								label={__('Flex Layout', 'blockera')}
								labelDescription={
									<>
										<p>
											{__(
												'This is an intuitive interface for you to effortlessly configure Flexbox properties easily.',
												'blockera'
											)}
										</p>
										<p>
											{__(
												'You have the ability to configure the flex direction as either horizontal or vertical, and you can also select how items are aligned along these axes.',
												'blockera'
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
					</EditorFeatureWrapper>
				)}

				{['flex', 'grid'].includes(values.blockeraDisplay) && (
					<EditorFeatureWrapper
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
								defaultValue={attributes.blockeraGap.default}
								{...extensionProps.blockeraGap}
							/>
						</ControlContextProvider>
					</EditorFeatureWrapper>
				)}

				{values.blockeraDisplay === 'flex' && (
					<EditorFeatureWrapper
						isActive={isShowFlexWrap}
						config={extensionConfig.blockeraFlexWrap}
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'flexWrap'),
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
										label={__('Children Wrap', 'blockera')}
										labelDescription={
											<>
												<p>
													{__(
														'It controls whether flex items are forced into a single line or can be wrapped onto multiple lines, adjusting layout flexibility and responsiveness.',
														'blockera'
													)}
												</p>
												<p>
													{__(
														'It is crucial for managing the layout of flex items, especially when the container cannot accommodate all items in one row, ensuring content adaptability and orderliness.',
														'blockera'
													)}
												</p>

												<h3>
													<Icon
														icon="wrap-no"
														iconSize={22}
													/>
													{__('No Wrap', 'blockera')}
												</h3>
												<p>
													{__(
														'All flex items will be on one line regardless of their size.',
														'blockera'
													)}
												</p>
												<h3>
													<Icon
														icon="wrap"
														iconSize={22}
													/>
													{__('Wrap', 'blockera')}
												</h3>
												<p>
													{__(
														'Flex items will wrap onto multiple lines, from top to bottom.',
														'blockera'
													)}
												</p>
												<p>
													<span
														style={{
															fontWeight: '600',
															color: '#ffffff',
														}}
													>
														{__(
															'Note:',
															'blockera'
														)}
													</span>{' '}
													{__(
														'Using the reverse function flex items will wrap onto multiple lines in reverse order.',
														'blockera'
													)}
												</p>
											</>
										}
										options={[
											{
												label: __(
													'No Wrap',
													'blockera'
												),
												value: 'nowrap',
												icon: (
													<Icon
														icon="wrap-no"
														iconSize={18}
													/>
												),
											},
											{
												label: __('Wrap', 'blockera'),
												value: 'wrap',
												icon: (
													<Icon
														icon="wrap"
														iconSize={18}
													/>
												),
											},
										]}
										//
										defaultValue={
											attributes.blockeraFlexWrap.default
												.value
										}
										onChange={(newValue, ref) => {
											if (newValue === '') {
												handleOnChangeAttributes(
													'blockeraFlexWrap',
													attributes.blockeraFlexWrap
														.default,
													{ ref }
												);
											} else if (newValue === 'nowrap') {
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
											'blockera'
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
											values.blockeraFlexWrap.value ===
												'nowrap' || ''
										}
										onClick={() => {
											handleOnChangeAttributes(
												'blockeraFlexWrap',
												{
													...values.blockeraFlexWrap,
													reverse:
														!values.blockeraFlexWrap
															.reverse,
												},
												{
													ref: undefined,
												}
											);
										}}
									>
										<Icon icon="reverse-horizontal" />
									</Button>
								</Flex>
							</BaseControl>
						</ControlContextProvider>

						{values.blockeraFlexWrap?.value === 'wrap' && (
							<EditorFeatureWrapper
								isActive={isShowAlignContent}
								config={extensionConfig.blockeraAlignContent}
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
										label={__('Align Content', 'blockera')}
										labelDescription={
											<>
												<p>
													{__(
														'Align-Content controls the alignment and distribution of lines within a flex container when there is extra space along the cross-axis, offering various alignment options.',
														'blockera'
													)}
												</p>
												<p>
													{__(
														'This property is vital in multi-line flex containers, especially when the height of the container is greater than that of the flex items, ensuring a balanced, visually appealing layout.',
														'blockera'
													)}
												</p>
												<h3>
													<Icon
														icon="align-content-flex-start"
														iconSize={22}
													/>
													{__(
														'Flex Start',
														'blockera'
													)}
												</h3>
												<p>
													{__(
														'Packs lines toward the start of the container.',
														'blockera'
													)}
												</p>
												<h3>
													<Icon
														icon="align-content-center"
														iconSize="22"
													/>
													{__('Center', 'blockera')}
												</h3>
												<p>
													{__(
														'Centers lines within the container.',
														'blockera'
													)}
												</p>
												<h3>
													<Icon
														icon="align-content-flex-end"
														iconSize={22}
													/>
													{__('Flex End', 'blockera')}
												</h3>
												<p>
													{__(
														'Packs lines toward the end of the container.',
														'blockera'
													)}
												</p>
												<h3>
													<Icon
														icon="align-content-space-around"
														iconSize={22}
													/>
													{__(
														'Space Around',
														'blockera'
													)}
												</h3>
												<p>
													{__(
														'Distributes lines evenly, with equal space around each line.',
														'blockera'
													)}
												</p>
												<h3>
													<Icon
														icon="align-content-space-between"
														iconSize={22}
													/>
													{__(
														'Space Between',
														'blockera'
													)}
												</h3>
												<p>
													{__(
														'Distributes lines evenly, with the first line at the start and the last at the end.',
														'blockera'
													)}
												</p>
												<h3>
													<Icon
														icon="align-content-stretch"
														iconSize={22}
													/>
													{__('Stretch', 'blockera')}
												</h3>
												<p>
													{__(
														'Stretches lines to fill the container (default behavior).',
														'blockera'
													)}
												</p>
											</>
										}
										columns="80px 160px"
										options={[
											{
												label: __(
													'Flex Start',
													'blockera'
												),
												value: 'flex-start',
												icon: (
													<Icon
														icon="align-content-flex-start"
														iconSize={18}
													/>
												),
											},
											{
												label: __('Center', 'blockera'),
												value: 'center',
												icon: (
													<Icon
														icon="align-content-center"
														iconSize="18"
													/>
												),
											},
											{
												label: __(
													'Flex End',
													'blockera'
												),
												value: 'flex-end',
												icon: (
													<Icon
														icon="align-content-flex-end"
														iconSize={18}
													/>
												),
											},
											{
												label: __(
													'Space Around',
													'blockera'
												),
												value: 'space-around',
												icon: (
													<Icon
														icon="align-content-space-around"
														iconSize={18}
													/>
												),
											},
											{
												label: __(
													'Space Between',
													'blockera'
												),
												value: 'space-between',
												icon: (
													<Icon
														icon="align-content-space-between"
														iconSize={18}
													/>
												),
											},
											{
												label: __(
													'Stretch',
													'blockera'
												),
												value: 'stretch',
												icon: (
													<Icon
														icon="align-content-stretch"
														iconSize={18}
													/>
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
							</EditorFeatureWrapper>
						)}
					</EditorFeatureWrapper>
				)}
			</PanelBodyControl>
		);
	},
	hasSameProps
);
