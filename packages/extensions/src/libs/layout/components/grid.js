// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { Button, Flex, FeatureWrapper } from '@publisher/components';
import {
	BaseControl,
	ControlContextProvider,
	InputControl,
} from '@publisher/controls';
import { useBlockContext } from '../../../hooks';
import { generateAreas, uId } from '../../../components/grid-builder/utils';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
// import { default as JustifyCenterIcon } from '../icons/justify-center';
// import { default as JustifyFlexEndIcon } from '../icons/justify-flex-end';
// import { default as JustifyFlexStartIcon } from '../icons/justify-flex-start';
// import { default as AlignContentCenterIcon } from '../icons/align-content-center';
// import { default as JustifySpaceBetweenIcon } from '../icons/justify-space-between';
// import { default as AlignItemsCenterBlockIcon } from '../icons/align-items-center';
// import { default as AlignContentStretchIcon } from '../icons/align-content-stretch';
// import { default as AlignContentFlexEndIcon } from '../icons/align-content-flex-end';
// import { default as AlignItemsStretchBlockIcon } from '../icons/align-items-stretch';
// import { default as AlignItemsFlexEndBlockIcon } from '../icons/align-items-flex-end';
// import { default as AlignItemsBaselineBlockIcon } from '../icons/align-items-baseline';
// import { default as AlignContentFlexStartIcon } from '../icons/align-content-flex-start';
// import { default as AlignItemsFlexStartBlockIcon } from '../icons/align-items-flex-start';
// import { default as AlignContentSpaceAroundIcon } from '../icons/align-content-space-around';
// import { default as AlignContentSpaceBetweenIcon } from '../icons/align-content-space-between';
import { isShowField } from '../../../api/utils';
import { default as EditIcon } from '../icons/edit';

import { Gap } from '.';

export default function ({
	extensionConfig,
	block,
	handleOnChangeAttributes,
	values,
	attributes,
}: {
	extensionConfig: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	block: TBlockProps,
	values: Object,
	attributes: Object,
}): MixedElement {
	const isShowRows = isShowField(
		extensionConfig.publisherGridRows,
		values?.publisherGridRows,
		attributes.publisherGridRows.default
	);
	const isShowColumns = isShowField(
		extensionConfig.publisherGridColumns,
		values?.publisherGridColumns,
		attributes.publisherGridColumns.default
	);
	const isShowGap = isShowField(
		extensionConfig.publisherGridGap,
		values?.publisherGridGap,
		attributes.publisherGridGap.default
	);

	const defaultGridItemValue = {
		'sizing-mode': 'normal',
		size: '1fr',
		'min-size': '',
		'max-size': '',
		'auto-fit': false,
	};

	const { setOpenGridBuilder, isOpenGridBuilder } = useBlockContext();

	const mergedAreas = values.publisherGridAreas.filter(
		(item) => item.mergedArea
	);
	const mergedAreasColumnEnd = mergedAreas.map((item) => item['column-end']);
	const mergedAreasRowEnd = mergedAreas.map((item) => item['row-end']);

	return (
		<>
			<BaseControl
				columns="columns-2"
				label={__('Grid', 'publisher-core')}
			>
				<Button
					size="input"
					contentAlign="left"
					onClick={() => setOpenGridBuilder(!isOpenGridBuilder)}
				>
					<EditIcon />
					Open Grid Builder
				</Button>

				<Flex>
					<FeatureWrapper
						isActive={isShowRows}
						config={extensionConfig.publisherGridRows}
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(
									block,
									'grid-rows-length'
								),
								value: values.publisherGridRows.length,
								attribute: 'publisherGridRows',
								blockName: block.blockName,
							}}
						>
							<InputControl
								label={__('Rows', 'publisher-core')}
								columns="columns-1"
								size="small"
								type="number"
								className="control-first label-center small-gap"
								onChange={(
									length: number,
									ref?: Object
								): void => {
									if (
										values.publisherGridRows.value.length <
										length
									) {
										const value = [
											...values.publisherGridRows.value,
										];
										const newAreas = [];
										const cellCounts =
											values.publisherGridAreas?.map(
												(area) =>
													Number(
														area.name.replace(
															/[^-\.0-9]/g,
															''
														)
													)
											);

										let i =
											values.publisherGridRows.value
												.length;
										let count = Math.max(...cellCounts);

										while (i < length) {
											value.push({
												...{
													...defaultGridItemValue,
													size: 'auto',
												},
												id: uId(),
											});
											for (
												let index = 1;
												index <=
												values.publisherGridColumns
													.length;
												index++
											) {
												count++;

												newAreas.push({
													id: uId(),
													name: `cell${count}`,
													'column-start': index,
													'column-end': index + 1,
													'row-start': i + 1,
													'row-end': i + 2,
												});
											}

											i++;
										}

										handleOnChangeAttributes(
											'publisherGridRows',
											{ length, value },
											{
												effectiveItems: {
													publisherGridAreas:
														generateAreas({
															gridRows: value,
															gridColumns:
																values
																	.publisherGridColumns
																	.value,
															prevGridAreas: [
																...values.publisherGridAreas,
																...newAreas,
															],
														}),
												},
												ref,
											}
										);
									}

									if (
										values.publisherGridRows.value.length >
										length
									) {
										const value = [
											...values.publisherGridRows.value,
										];
										value.splice(
											length,
											values.publisherGridRows.value
												.length - length
										);

										const deletedAreas =
											values.publisherGridAreas
												.filter(
													(item) =>
														item['row-end'] >
														length + 1
												)
												.map(({ id }) => id);

										const filteredAreas =
											values.publisherGridAreas.filter(
												(item) =>
													!deletedAreas.includes(
														item.id
													)
											);

										handleOnChangeAttributes(
											'publisherGridRows',
											{ length, value },
											{
												effectiveItems: {
													publisherGridAreas:
														generateAreas({
															gridRows: value,
															gridColumns:
																values
																	.publisherGridColumns
																	.value,
															prevGridAreas:
																filteredAreas,
														}),
												},
												ref,
											}
										);
									}
								}}
								defaultValue={
									attributes.publisherGridRows.default.length
								}
								min={
									mergedAreas.length
										? Math.max(...mergedAreasRowEnd) - 1
										: 1
								}
							/>
						</ControlContextProvider>
					</FeatureWrapper>

					<FeatureWrapper
						isActive={isShowColumns}
						config={extensionConfig.publisherGridColumns}
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(
									block,
									'grid-columns-length'
								),
								value: values.publisherGridColumns.length,
								attribute: 'publisherGridColumns',
								blockName: block.blockName,
							}}
						>
							<InputControl
								label={__('Columns', 'publisher-core')}
								columns="columns-1"
								size="small"
								type="number"
								className="control-first label-center small-gap"
								onChange={(
									length: number,
									ref?: Object
								): void => {
									if (
										values.publisherGridColumns.value
											.length < length
									) {
										const value = [
											...values.publisherGridColumns
												.value,
										];
										const newAreas = [];
										const cellCounts =
											values.publisherGridAreas?.map(
												(area) =>
													Number(
														area.name.replace(
															/[^-\.0-9]/g,
															''
														)
													)
											);

										let i =
											values.publisherGridColumns.value
												.length;
										let count = Math.max(...cellCounts);

										while (i < length) {
											value.push({
												...defaultGridItemValue,
												id: uId(),
											});
											for (
												let index = 1;
												index <=
												values.publisherGridRows.length;
												index++
											) {
												count++;

												newAreas.push({
													id: uId(),
													name: `cell${count}`,
													'column-start': i + 1,
													'column-end': i + 2,
													'row-start': index,
													'row-end': index + 1,
												});
											}
											i++;
										}

										handleOnChangeAttributes(
											'publisherGridColumns',
											{ length, value },
											{
												effectiveItems: {
													publisherGridAreas:
														generateAreas({
															gridRows:
																values
																	.publisherGridRows
																	.value,
															gridColumns: value,
															prevGridAreas: [
																...values.publisherGridAreas,
																...newAreas,
															],
														}),
												},
												ref,
											}
										);
									}

									if (
										values.publisherGridColumns.value
											.length > length
									) {
										const value = [
											...values.publisherGridColumns
												.value,
										];
										value.splice(
											length,
											values.publisherGridColumns.value
												.length - length
										);

										const deletedAreas =
											values.publisherGridAreas
												.filter(
													(item) =>
														item['column-end'] >
														length + 1
												)
												.map(({ id }) => id);

										const filteredAreas =
											values.publisherGridAreas.filter(
												(item) =>
													!deletedAreas.includes(
														item.id
													)
											);

										handleOnChangeAttributes(
											'publisherGridColumns',
											{ length, value },
											{
												effectiveItems: {
													publisherGridAreas:
														generateAreas({
															gridRows:
																values
																	.publisherGridRows
																	.value,
															gridColumns: value,
															prevGridAreas:
																filteredAreas,
														}),
												},
												ref,
											}
										);
									}
								}}
								defaultValue={
									attributes.publisherGridColumns.default
										.length
								}
								min={
									mergedAreas.length
										? Math.max(...mergedAreasColumnEnd) - 1
										: 1
								}
							/>
						</ControlContextProvider>
					</FeatureWrapper>
				</Flex>
			</BaseControl>

			{/* {/* {isActiveField(publisherGridAlignItems) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'grid-align-items'),
						value: gridAlignItems,
						attribute: 'publisherGridAlignItems',
						blockName: block.blockName,
					}}
				>
					<ToggleSelectControl
						columns="80px 160px"
						label={__('Align Items', 'publisher-core')}
						isDeselectable={true}
						controlName="toggle-select"
						defaultValue={gridAlignItems || ''}
						onChange={(newValue: string, ref?: Object): void =>
							handleOnChangeAttributes(
								'publisherGridAlignItems',
								newValue,
								{ ref }
							)
						}
						options={[
							{
								label: __('Center', 'publisher-core'),
								value: 'center',
								icon: <AlignItemsCenterBlockIcon />,
							},
							{
								label: __('Start', 'publisher-core'),
								value: 'start',
								icon: <AlignItemsFlexStartBlockIcon />,
							},

							{
								label: __('End', 'publisher-core'),
								value: 'end',
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
					/>
				</ControlContextProvider>
			)} 

			{isActiveField(publisherGridJustifyItems) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'grid-justify-items'),
						value: gridJustifyItems,
						attribute: 'publisherGridJustifyItems',
						blockName: block.blockName,
					}}
				>
					<ToggleSelectControl
						columns="80px 160px"
						controlName="toggle-select"
						label={__('Justify', 'publisher-core')}
						options={[
							{
								label: __('Center', 'publisher-core'),
								value: 'center',
								icon: <JustifyCenterIcon />,
							},
							{
								label: __('Start', 'publisher-core'),
								value: 'start',
								icon: <JustifyFlexStartIcon />,
							},
							{
								label: __('End', 'publisher-core'),
								value: 'end',
								icon: <JustifyFlexEndIcon />,
							},
							{
								label: __('Stretch', 'publisher-core'),
								value: 'stretch',
								icon: <JustifySpaceBetweenIcon />,
							},
						]}
						isDeselectable={true}
						defaultValue={gridJustifyItems || ''}
						onChange={(newValue: string, ref?: Object): void =>
							handleOnChangeAttributes(
								'publisherGridJustifyItems',
								newValue,
								{ ref }
							)
						}
					/>
				</ControlContextProvider>
			)}

			{isActiveField(publisherGridAlignContent) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'grid-align-content'),
						value: gridAlignContent,
						attribute: 'publisherGridAlignContent',
						blockName: block.blockName,
					}}
				>
					<ToggleSelectControl
						label={__('Align Content', 'publisher-core')}
						columns="80px 160px"
						controlName="toggle-select"
						options={[
							{
								label: __('Start', 'publisher-core'),
								value: 'start',
								icon: <AlignContentFlexStartIcon />,
							},
							{
								label: __('Center', 'publisher-core'),
								value: 'center',
								icon: <AlignContentCenterIcon />,
							},
							{
								label: __('End', 'publisher-core'),
								value: 'end',
								icon: <AlignContentFlexEndIcon />,
							},
							{
								label: __('Space Around', 'publisher-core'),
								value: 'space-around',
								icon: <AlignContentSpaceAroundIcon />,
							},
							{
								label: __('Space Between', 'publisher-core'),
								value: 'space-between',
								icon: <AlignContentSpaceBetweenIcon />,
							},
							{
								label: __('Stretch', 'publisher-core'),
								value: 'stretch',
								icon: <AlignContentStretchIcon />,
							},
						]}
						isDeselectable={true}
						//
						defaultValue={gridAlignContent || ''}
						onChange={(newValue: string, ref?: Object): void =>
							handleOnChangeAttributes(
								'publisherGridAlignContent',
								newValue,
								{ ref }
							)
						}
					/>
				</ControlContextProvider>
			)}

			{isActiveField(publisherGridJustifyContent) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(
							block,
							'grid-justify-content'
						),
						value: gridJustifyContent,
						attribute: 'publisherGridJustifyContent',
						blockName: block.blockName,
					}}
				>
					<ToggleSelectControl
						label={__('Justify Content', 'publisher-core')}
						columns="80px 160px"
						controlName="toggle-select"
						options={[
							{
								label: __('Start', 'publisher-core'),
								value: 'start',
								icon: <AlignContentFlexStartIcon />,
							},
							{
								label: __('Center', 'publisher-core'),
								value: 'center',
								icon: <AlignContentCenterIcon />,
							},
							{
								label: __('End', 'publisher-core'),
								value: 'end',
								icon: <AlignContentFlexEndIcon />,
							},
							{
								label: __('Space Around', 'publisher-core'),
								value: 'space-around',
								icon: <AlignContentSpaceAroundIcon />,
							},
							{
								label: __('Space Between', 'publisher-core'),
								value: 'space-between',
								icon: <AlignContentSpaceBetweenIcon />,
							},
							{
								label: __('Stretch', 'publisher-core'),
								value: 'stretch',
								icon: <AlignContentStretchIcon />,
							},
						]}
						isDeselectable={true}
						//
						defaultValue={gridJustifyContent || ''}
						onChange={(newValue: string, ref?: Object): void =>
							handleOnChangeAttributes(
								'publisherGridJustifyContent',
								newValue,
								{ ref }
							)
						}
					/>
				</ControlContextProvider>
			)} */}
			<FeatureWrapper
				isActive={isShowGap}
				config={extensionConfig.publisherGridGap}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'grid-gap'),
						value: values.publisherGridGap,
						attribute: 'publisherGridGap',
						blockName: block.blockName,
					}}
				>
					<Gap
						block={block}
						gap={values.publisherGridGap}
						field={extensionConfig.publisherGridGap}
						attributeId="publisherGridGap"
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.publisherGridGap.default}
					/>
				</ControlContextProvider>
			</FeatureWrapper>
		</>
	);
}
