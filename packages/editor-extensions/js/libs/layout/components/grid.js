// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';
import { dispatch, select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { Button, Flex, FeatureWrapper } from '@blockera/components';
import {
	BaseControl,
	ControlContextProvider,
	InputControl,
	ToggleControl,
	ToggleSelectControl,
} from '@blockera/controls';
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
		extensionConfig.blockeraGridRows,
		values?.blockeraGridRows,
		attributes.blockeraGridRows.default
	);
	const isShowColumns = isShowField(
		extensionConfig.blockeraGridColumns,
		values?.blockeraGridColumns,
		attributes.blockeraGridColumns.default
	);
	const isShowGap = isShowField(
		extensionConfig.blockeraGridGap,
		values?.blockeraGridGap,
		attributes.blockeraGridGap.default
	);
	const isShowGridAlignItems = isShowField(
		extensionConfig.blockeraGridAlignItems,
		values?.blockeraGridAlignItems,
		attributes.blockeraGridAlignItems.default
	);
	const isShowGridJustifyItems = isShowField(
		extensionConfig.blockeraGridJustifyItems,
		values?.blockeraGridJustifyItems,
		attributes.blockeraGridJustifyItems.default
	);
	const isShowGridDirection = isShowField(
		extensionConfig.blockeraGridDirection,
		values?.blockeraGridDirection,
		attributes.blockeraGridDirection.default
	);

	const defaultGridItemValue = {
		'sizing-mode': 'normal',
		size: '1fr',
		'min-size': '',
		'max-size': '',
		'auto-fit': false,
	};

	// const { setOpenGridBuilder, getIsOpenGridBuilder } =
	// 	dispatch('blockera-core/extensions') || {};
	const { getIsOpenGridBuilder } = select('blockera-core/extensions');
	const { setOpenGridBuilder } = dispatch('blockera-core/extensions');
	const mergedAreas = values.blockeraGridAreas.filter(
		(item) => item.mergedArea
	);
	const mergedAreasColumnEnd = mergedAreas.map((item) => item['column-end']);
	const mergedAreasRowEnd = mergedAreas.map((item) => item['row-end']);

	return (
		<>
			<BaseControl columns="columns-2" label={__('Grid', 'blockera')}>
				<Button
					size="input"
					contentAlign="left"
					onClick={() => setOpenGridBuilder(!getIsOpenGridBuilder())}
					aria-label={__('Open Grid Builder', 'blockera')}
				>
					<EditIcon />
					{__('Open Grid Builder', 'blockera')}
				</Button>

				<Flex>
					<FeatureWrapper
						isActive={isShowRows}
						config={extensionConfig.blockeraGridRows}
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(
									block,
									'grid-rows-length'
								),
								value: values.blockeraGridRows.length,
								attribute: 'blockeraGridRows',
								blockName: block.blockName,
								hasSideEffect: true,
							}}
						>
							<InputControl
								label={__('Rows', 'blockera')}
								columns="columns-1"
								size="small"
								type="number"
								className="control-first label-center small-gap"
								onChange={(
									length: number,
									ref?: Object
								): void => {
									const value = [];

									if (
										values.blockeraGridRows.value.length <
										length
									) {
										// +
										value.push(
											...values.blockeraGridRows.value
										);

										let i =
											values.blockeraGridRows.value
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
										values.blockeraGridRows.value.length >
										length
									) {
										// -
										value.push(
											...values.blockeraGridRows.value
										);

										value.splice(
											length,
											values.blockeraGridRows.value
												.length - length
										);
									} else if (
										values.blockeraGridRows.value.length ===
										length
									)
										return;

									handleOnChangeAttributes(
										'blockeraGridRows',
										{ length, value },
										{
											effectiveItems: {
												blockeraGridAreas:
													generateAreas({
														gridRows: value,
														gridColumns:
															values
																.blockeraGridColumns
																.value,
														prevGridAreas:
															values.blockeraGridAreas,
														blockeraGridDirection:
															values.blockeraGridDirection,
													}),
											},
											ref,
										}
									);
								}}
								defaultValue={
									attributes.blockeraGridRows.default.length
								}
								min={
									mergedAreas.length
										? Math.max(...mergedAreasRowEnd) - 1
										: 1
								}
								{...extensionProps.blockeraGridRows}
							/>
						</ControlContextProvider>
					</FeatureWrapper>

					<FeatureWrapper
						isActive={isShowColumns}
						config={extensionConfig.blockeraGridColumns}
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(
									block,
									'grid-columns-length'
								),
								value: values.blockeraGridColumns.length,
								attribute: 'blockeraGridColumns',
								blockName: block.blockName,
								hasSideEffect: true,
							}}
						>
							<InputControl
								label={__('Columns', 'blockera')}
								columns="columns-1"
								size="small"
								type="number"
								className="control-first label-center small-gap"
								onChange={(
									length: number,
									ref?: Object
								): void => {
									const value = [];

									if (
										values.blockeraGridColumns.value
											.length < length
									) {
										// +
										value.push(
											...values.blockeraGridColumns.value
										);

										let i =
											values.blockeraGridColumns.value
												.length;

										while (i < length) {
											value.push({
												...defaultGridItemValue,
												id: uId(),
											});

											i++;
										}
									} else if (
										values.blockeraGridColumns.value
											.length > length
									) {
										// -
										value.push(
											...values.blockeraGridColumns.value
										);

										value.splice(
											length,
											values.blockeraGridColumns.value
												.length - length
										);
									} else if (
										values.blockeraGridColumns.value
											.length === length
									)
										return;

									handleOnChangeAttributes(
										'blockeraGridColumns',
										{ length, value },
										{
											effectiveItems: {
												blockeraGridAreas:
													generateAreas({
														gridRows:
															values
																.blockeraGridRows
																.value,
														gridColumns: value,
														prevGridAreas:
															values.blockeraGridAreas,
														blockeraGridDirection:
															values.blockeraGridDirection,
													}),
											},
											ref,
										}
									);
								}}
								defaultValue={
									attributes.blockeraGridColumns.default
										.length
								}
								min={
									mergedAreas.length
										? Math.max(...mergedAreasColumnEnd) - 1
										: 1
								}
								{...extensionProps.blockeraGridColumns}
							/>
						</ControlContextProvider>
					</FeatureWrapper>
				</Flex>
			</BaseControl>

			<FeatureWrapper
				isActive={isShowGridDirection}
				config={extensionConfig.blockeraGridDirection}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'grid-direction'),
						value: values.blockeraGridDirection,
						attribute: 'blockeraGridDirection',
						blockName: block.blockName,
						type: 'nested',
					}}
				>
					<ToggleSelectControl
						id="value"
						columns="80px 160px"
						label={__('Direction', 'blockera')}
						isDeselectable={true}
						controlName="toggle-select"
						defaultValue={
							attributes.blockeraGridDirection.default.value
						}
						onChange={(value: string, ref?: Object): void =>
							handleOnChangeAttributes(
								'blockeraGridDirection',
								{ ...values.blockeraGridDirection, value },
								{
									effectiveItems: {
										blockeraGridAreas: generateAreas({
											gridRows:
												values.blockeraGridRows.value,
											gridColumns:
												values.blockeraGridColumns
													.value,
											prevGridAreas:
												values.blockeraGridAreas,
											blockeraGridDirection: {
												...values.blockeraGridDirection,
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
								label: __('Row', 'blockera'),
								value: 'row',
							},
							{
								label: __('Column', 'blockera'),
								value: 'column',
							},
						]}
						{...extensionProps.blockeraGridDirection}
					/>
					<ToggleControl
						id="dense"
						singularId="dense"
						columns="columns-2"
						label={__('Dense', 'blockera')}
						onChange={(dense: string, ref?: Object): void =>
							handleOnChangeAttributes(
								'blockeraGridDirection',
								{ ...values.blockeraGridDirection, dense },
								{ ref }
							)
						}
						defaultValue={
							attributes.blockeraGridDirection.default.dense
						}
						{...extensionProps.blockeraGridDirection}
					/>
				</ControlContextProvider>
			</FeatureWrapper>

			<FeatureWrapper
				isActive={isShowGridAlignItems}
				config={extensionConfig.blockeraGridAlignItems}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'grid-align-items'),
						value: values.blockeraGidAlignItems,
						attribute: 'blockeraGridAlignItems',
						blockName: block.blockName,
					}}
				>
					<ToggleSelectControl
						columns="80px 160px"
						label={__('Align Items', 'blockera')}
						isDeselectable={true}
						controlName="toggle-select"
						defaultValue={attributes.blockeraGridAlignItems.default}
						onChange={(newValue: string, ref?: Object): void =>
							handleOnChangeAttributes(
								'blockeraGridAlignItems',
								newValue,
								{ ref }
							)
						}
						options={[
							{
								label: __('Center', 'blockera'),
								value: 'center',
								icon: <AlignItemsCenterBlockIcon />,
							},
							{
								label: __('Start', 'blockera'),
								value: 'start',
								icon: <AlignItemsFlexStartBlockIcon />,
							},

							{
								label: __('End', 'blockera'),
								value: 'end',
								icon: <AlignItemsFlexEndBlockIcon />,
							},
							{
								label: __('Stretch', 'blockera'),
								value: 'stretch',
								icon: <AlignItemsStretchBlockIcon />,
							},
							{
								label: __('Baseline', 'blockera'),
								value: 'baseline',
								icon: <AlignItemsBaselineBlockIcon />,
							},
						]}
					/>
				</ControlContextProvider>{' '}
			</FeatureWrapper>

			<FeatureWrapper
				isActive={isShowGridJustifyItems}
				config={extensionConfig.blockeraGridJustifyItems}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'grid-justify-items'),
						value: values.blockeraGridJustifyItems,
						attribute: 'blockeraGridJustifyItems',
						blockName: block.blockName,
					}}
				>
					<ToggleSelectControl
						columns="80px 160px"
						controlName="toggle-select"
						label={__('Justify', 'blockera')}
						options={[
							{
								label: __('Center', 'blockera'),
								value: 'center',
								icon: <JustifyCenterIcon />,
							},
							{
								label: __('Start', 'blockera'),
								value: 'start',
								icon: <JustifyFlexStartIcon />,
							},
							{
								label: __('End', 'blockera'),
								value: 'end',
								icon: <JustifyFlexEndIcon />,
							},
							{
								label: __('Stretch', 'blockera'),
								value: 'stretch',
								icon: <JustifySpaceBetweenIcon />,
							},
						]}
						isDeselectable={true}
						defaultValue={
							attributes.blockeraGridJustifyItems.default
						}
						onChange={(newValue: string, ref?: Object): void =>
							handleOnChangeAttributes(
								'blockeraGridJustifyItems',
								newValue,
								{ ref }
							)
						}
					/>
				</ControlContextProvider>
			</FeatureWrapper>

			<FeatureWrapper
				isActive={isShowGap}
				config={extensionConfig.blockeraGridGap}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'grid-gap'),
						value: values.blockeraGridGap,
						attribute: 'blockeraGridGap',
						blockName: block.blockName,
						hasSideEffect: true,
					}}
				>
					<Gap
						block={block}
						gap={values.blockeraGridGap}
						field={extensionConfig.blockeraGridGap}
						attributeId="blockeraGridGap"
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.blockeraGridGap.default}
						{...extensionProps.blockeraGridGap}
					/>
				</ControlContextProvider>
			</FeatureWrapper>
		</>
	);
}
