/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { Field, InputField, ToggleSelectField } from '@publisher/fields';
import { Flex } from '@publisher/components';

/**
 * Internal dependencies
 */
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';
import { default as DisplayBlockIcon } from './icons/display-block';
import { default as DisplayFlexIcon } from './icons/display-flex';
import { default as DisplayInlineBlockIcon } from './icons/display-inline-block';
import { default as DisplayInlineIcon } from './icons/display-inline';
import { default as DisplayNoneIcon } from './icons/display-none';
import { default as FlexDirectionRowBlockIcon } from './icons/flex-direction-row';
import { default as FlexDirectionColumnBlockIcon } from './icons/flex-direction-column';
import { default as FlexDirectionRowReverseBlockIcon } from './icons/flex-direction-row-reverse';
import { default as FlexDirectionColumnReverseBlockIcon } from './icons/flex-direction-column-reverse';
import { default as AlignItemsCenterBlockIcon } from './icons/align-items-center';
import { default as AlignItemsFlexStartBlockIcon } from './icons/align-items-flex-start';
import { default as AlignItemsFlexEndBlockIcon } from './icons/align-items-flex-end';
import { default as AlignItemsStretchBlockIcon } from './icons/align-items-stretch';
import { default as AlignItemsBaselineBlockIcon } from './icons/align-items-baseline';
import { default as JustifyCenterIcon } from './icons/justify-center';
import { default as JustifyFlexStartIcon } from './icons/justify-flex-start';
import { default as JustifyFlexEndIcon } from './icons/justify-flex-end';
import { default as JustifySpaceBetweenIcon } from './icons/justify-space-between';
import { default as JustifySpaceAroundIcon } from './icons/justify-space-around';
import { default as JustifySpaceEvenlyIcon } from './icons/justify-space-evenly';
import { default as WrapNoWrapIcon } from './icons/wrap-nowrap';
import { default as WrapWrapIcon } from './icons/wrap-wrap';
import { default as AlignContentCenterIcon } from './icons/align-content-center';
import { default as AlignContentFlexStartIcon } from './icons/align-content-flex-start';
import { default as AlignContentFlexEndIcon } from './icons/align-content-flex-end';
import { default as AlignContentSpaceAroundIcon } from './icons/align-content-space-around';
import { default as AlignContentSpaceBetweenIcon } from './icons/align-content-space-between';
import { default as AlignContentStretchIcon } from './icons/align-content-stretch';

export function LayoutExtension({ config }) {
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

	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<>
			{isActiveField(publisherDisplay) && (
				<ToggleSelectField
					label={__('Display', 'publisher-core')}
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
					columns="1fr 2.65fr"
					//
					defaultValue=""
					value={attributes.publisherDisplay}
					onValueChange={(newValue) =>
						setAttributes({
							...attributes,
							publisherDisplay: newValue,
						})
					}
				/>
			)}

			{attributes.publisherDisplay === 'flex' && (
				<>
					{isActiveField(publisherFlexDirection) && (
						<ToggleSelectField
							label={__('Direction', 'publisher-core')}
							options={[
								{
									label: __('Row', 'publisher-core'),
									value: 'row',
									icon: <FlexDirectionRowBlockIcon />,
								},
								{
									label: __('column', 'publisher-core'),
									value: 'column',
									icon: <FlexDirectionColumnBlockIcon />,
								},
								{
									label: __('Row Reverse', 'publisher-core'),
									value: 'row-reverse',
									icon: <FlexDirectionRowReverseBlockIcon />,
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
							columns="1fr 2.65fr"
							//
							defaultValue="row"
							value={attributes.publisherFlexDirection}
							onValueChange={(newValue) =>
								setAttributes({
									...attributes,
									publisherFlexDirection: newValue,
								})
							}
						/>
					)}

					{isActiveField(publisherAlignItems) && (
						<ToggleSelectField
							label={__('Align Items', 'publisher-core')}
							options={[
								{
									label: __('Center', 'publisher-core'),
									value: 'center',
									icon: <AlignItemsCenterBlockIcon />,
								},
								{
									label: __('Flex Start', 'publisher-core'),
									value: 'flex-start',
									icon: <AlignItemsFlexStartBlockIcon />,
								},
								{
									label: __('Flex End', 'publisher-core'),
									value: 'flex-end',
									icon: <AlignItemsFlexEndBlockIcon />,
								},
								{
									label: __('Stretch', 'publisher-core'),
									value: 'stretch',
									icon: <AlignItemsStretchBlockIcon />,
								},
								{
									label: __('Baseline', 'publisher-core'),
									value: 'baseline',
									icon: <AlignItemsBaselineBlockIcon />,
								},
							]}
							columns="1fr 2.65fr"
							isDeselectable={true}
							className={
								'publisher-direction-' +
								attributes.publisherFlexDirection +
								' publisher-flex-align-items'
							}
							//
							defaultValue=""
							value={attributes.publisherAlignItems}
							onValueChange={(newValue) =>
								setAttributes({
									...attributes,
									publisherAlignItems: newValue,
								})
							}
						/>
					)}

					{isActiveField(publisherJustifyContent) && (
						<ToggleSelectField
							label={__('Justify', 'publisher-core')}
							options={[
								{
									label: __('Center', 'publisher-core'),
									value: 'center',
									icon: <JustifyCenterIcon />,
								},
								{
									label: __('Flex Start', 'publisher-core'),
									value: 'flex-start',
									icon: <JustifyFlexStartIcon />,
								},
								{
									label: __('Flex End', 'publisher-core'),
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
									label: __('Space Around', 'publisher-core'),
									value: 'space-around',
									icon: <JustifySpaceAroundIcon />,
								},
								{
									label: __('Space Evenly', 'publisher-core'),
									value: 'space-evenly',
									icon: <JustifySpaceEvenlyIcon />,
								},
							]}
							columns="1fr 2.65fr"
							isDeselectable={true}
							className={
								'publisher-direction-' +
								attributes.publisherFlexDirection +
								' publisher-flex-justify-content'
							}
							//
							defaultValue=""
							value={attributes.publisherJustifyContent}
							onValueChange={(newValue) =>
								setAttributes({
									...attributes,
									publisherJustifyContent: newValue,
								})
							}
						/>
					)}

					{isActiveField(publisherGap) && (
						<Field
							label={__('Gap', 'publisher-core')}
							columns="1fr 2.65fr"
						>
							<Flex direction="row" gap="10px">
								{isActiveField(publisherGapRows) && (
									<InputField
										columns="columns-1"
										settings={{
											type: 'css',
											unitType: 'essential',
											min: 0,
											max: 200,
											defaultValue: '',
										}}
										label={__('Rows', 'publisher-core')}
										className="control-first label-center small-gap"
										//
										defaultValue=""
										value={attributes.publisherGapRows}
										onChange={(newValue) =>
											setAttributes({
												...attributes,
												publisherGapRows: newValue,
											})
										}
									/>
								)}

								{isActiveField(publisherGapColumns) && (
									<InputField
										columns="columns-1"
										settings={{
											type: 'css',
											unitType: 'essential',
											min: 0,
											max: 200,
											defaultValue: '',
										}}
										label={__('Columns', 'publisher-core')}
										className="control-first label-center small-gap"
										//
										defaultValue=""
										value={attributes.publisherGapColumns}
										onChange={(newValue) =>
											setAttributes({
												...attributes,
												publisherGapColumns: newValue,
											})
										}
									/>
								)}
							</Flex>
						</Field>
					)}

					{isActiveField(publisherFlexWrap) && (
						<>
							<ToggleSelectField
								label={__('Children', 'publisher-core')}
								options={[
									{
										label: __('No Wrap', 'publisher-core'),
										value: 'nowrap',
										icon: <WrapNoWrapIcon />,
									},
									{
										label: __('Wrap', 'publisher-core'),
										value: 'wrap',
										icon: <WrapWrapIcon />,
									},
								]}
								columns="1fr 2.65fr"
								className={
									'publisher-direction-' +
									attributes.publisherFlexDirection +
									' publisher-flex-wrap'
								}
								//
								defaultValue="nowrap"
								value={attributes.publisherFlexWrap}
								onValueChange={(newValue) =>
									setAttributes({
										...attributes,
										publisherFlexWrap: newValue,
									})
								}
							/>

							{isActiveField(publisherAlignContent) &&
								attributes.publisherFlexWrap === 'wrap' && (
									<ToggleSelectField
										label={__(
											'Align Content',
											'publisher-core'
										)}
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
										columns="1fr 2.65fr"
										isDeselectable={true}
										className={
											'publisher-direction-' +
											attributes.publisherFlexDirection +
											' publisher-flex-align-content'
										}
										//
										defaultValue=""
										value={attributes.publisherAlignContent}
										onValueChange={(newValue) =>
											setAttributes({
												...attributes,
												publisherAlignContent: newValue,
											})
										}
									/>
								)}
						</>
					)}
				</>
			)}
		</>
	);
}
