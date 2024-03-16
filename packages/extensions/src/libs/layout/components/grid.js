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
	ToggleControl,
	ToggleSelectControl,
} from '@publisher/controls';
import { useBlockContext } from '../../../hooks';
import { generateAreas, uId } from '../../../components/grid-builder/utils';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { default as JustifyCenterIcon } from '../icons/justify-center';
import { default as JustifyFlexEndIcon } from '../icons/justify-flex-end';
import { default as JustifyFlexStartIcon } from '../icons/justify-flex-start';
import { default as JustifySpaceBetweenIcon } from '../icons/justify-space-between';
import { default as AlignItemsCenterBlockIcon } from '../icons/align-items-center';
import { default as AlignItemsStretchBlockIcon } from '../icons/align-items-stretch';
import { default as AlignItemsFlexEndBlockIcon } from '../icons/align-items-flex-end';
import { default as AlignItemsBaselineBlockIcon } from '../icons/align-items-baseline';
import { default as AlignItemsFlexStartBlockIcon } from '../icons/align-items-flex-start';

import { isShowField } from '../../../api/utils';
import { default as EditIcon } from '../icons/edit';

import { Gap } from '.';

export default function ({
	extensionConfig,
	block,
	handleOnChangeAttributes,
	values,
	attributes,
	extensionProps,
}: {
	extensionConfig: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	block: TBlockProps,
	values: Object,
	attributes: Object,
	extensionProps: Object,
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
	const isShowGridAlignItems = isShowField(
		extensionConfig.publisherGridAlignItems,
		values?.publisherGridAlignItems,
		attributes.publisherGridAlignItems.default
	);
	const isShowGridJustifyItems = isShowField(
		extensionConfig.publisherGridJustifyItems,
		values?.publisherGridJustifyItems,
		attributes.publisherGridJustifyItems.default
	);
	const isShowGridDirection = isShowField(
		extensionConfig.publisherGridDirection,
		values?.publisherGridDirection,
		attributes.publisherGridDirection.default
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
								hasSideEffect: true,
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
									const value = [];
									// + & -
									if (
										values.publisherGridRows.value.length <
										length
									) {
										value.push(
											...values.publisherGridRows.value
										);

										let i =
											values.publisherGridRows.value
												.length;

										while (i < length) {
											value.push({
												...{
													...defaultGridItemValue,
													size: 'auto',
												},
												id: uId(),
											});

											i++;
										}
									} else if (
										values.publisherGridRows.value.length >
										length
									) {
										value.push(
											...values.publisherGridRows.value
										);

										value.splice(
											length,
											values.publisherGridRows.value
												.length - length
										);
									} else if (
										values.publisherGridRows.value
											.length === length
									)
										return;

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
															values.publisherGridAreas,
														publisherGridDirection:
															values.publisherGridDirection,
													}),
											},
											ref,
										}
									);
								}}
								defaultValue={
									attributes.publisherGridRows.default.length
								}
								min={
									mergedAreas.length
										? Math.max(...mergedAreasRowEnd) - 1
										: 1
								}
								{...extensionProps.publisherGridRows}
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
								hasSideEffect: true,
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
									const value = [];
									// + & -
									if (
										values.publisherGridColumns.value
											.length < length
									) {
										value.push(
											...values.publisherGridColumns.value
										);

										let i =
											values.publisherGridColumns.value
												.length;

										while (i < length) {
											value.push({
												...defaultGridItemValue,
												id: uId(),
											});

											i++;
										}
									} else if (
										values.publisherGridColumns.value
											.length > length
									) {
										value.push(
											...values.publisherGridColumns.value
										);

										value.splice(
											length,
											values.publisherGridColumns.value
												.length - length
										);
									} else if (
										values.publisherGridColumns.value
											.length === length
									)
										return;

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
															values.publisherGridAreas,
														publisherGridDirection:
															values.publisherGridDirection,
													}),
											},
											ref,
										}
									);
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
								{...extensionProps.publisherGridColumns}
							/>
						</ControlContextProvider>
					</FeatureWrapper>
				</Flex>
			</BaseControl>

			<FeatureWrapper
				isActive={isShowGridDirection}
				config={extensionConfig.publisherGridDirection}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'grid-direction'),
						value: values.publisherGridDirection,
						attribute: 'publisherGridDirection',
						blockName: block.blockName,
						type: 'nested',
					}}
				>
					<ToggleSelectControl
						id="value"
						columns="80px 160px"
						label={__('Direction', 'publisher-core')}
						isDeselectable={true}
						controlName="toggle-select"
						defaultValue={
							attributes.publisherGridDirection.default.value
						}
						onChange={(value: string, ref?: Object): void =>
							handleOnChangeAttributes(
								'publisherGridDirection',
								{ ...values.publisherGridDirection, value },
								{
									effectiveItems: {
										publisherGridAreas: generateAreas({
											gridRows:
												values.publisherGridRows.value,
											gridColumns:
												values.publisherGridColumns
													.value,
											prevGridAreas:
												values.publisherGridAreas,
											publisherGridDirection: {
												...values.publisherGridDirection,
												value,
											},
										}),
									},
									ref,
								}
							)
						}
						options={[
							{
								label: __('Row', 'publisher-core'),
								value: 'row',
							},
							{
								label: __('Column', 'publisher-core'),
								value: 'column',
							},
						]}
					/>
					<ToggleControl
						id="dense"
						columns="columns-2"
						label={__('Dense', 'publisher-core')}
						onChange={(dense: string, ref?: Object): void =>
							handleOnChangeAttributes(
								'publisherGridDirection',
								{ ...values.publisherGridDirection, dense },
								{ ref }
							)
						}
						defaultValue={
							attributes.publisherGridDirection.default.dense
						}
					/>
				</ControlContextProvider>
			</FeatureWrapper>

			<FeatureWrapper
				isActive={isShowGridAlignItems}
				config={extensionConfig.publisherGridAlignItems}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'grid-align-items'),
						value: values.publisherGidAlignItems,
						attribute: 'publisherGridAlignItems',
						blockName: block.blockName,
					}}
				>
					<ToggleSelectControl
						columns="80px 160px"
						label={__('Align Items', 'publisher-core')}
						isDeselectable={true}
						controlName="toggle-select"
						defaultValue={
							attributes.publisherGridAlignItems.default
						}
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
				</ControlContextProvider>{' '}
			</FeatureWrapper>

			<FeatureWrapper
				isActive={isShowGridJustifyItems}
				config={extensionConfig.publisherGridJustifyItems}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'grid-justify-items'),
						value: values.publisherGridJustifyItems,
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
						defaultValue={
							attributes.publisherGridJustifyItems.default
						}
						onChange={(newValue: string, ref?: Object): void =>
							handleOnChangeAttributes(
								'publisherGridJustifyItems',
								newValue,
								{ ref }
							)
						}
					/>
				</ControlContextProvider>
			</FeatureWrapper>

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
						hasSideEffect: true,
					}}
				>
					<Gap
						block={block}
						gap={values.publisherGridGap}
						field={extensionConfig.publisherGridGap}
						attributeId="publisherGridGap"
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.publisherGridGap.default}
						{...extensionProps.publisherGridGap}
					/>
				</ControlContextProvider>
			</FeatureWrapper>
		</>
	);
}
