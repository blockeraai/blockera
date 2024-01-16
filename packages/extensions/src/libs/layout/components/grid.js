// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';
import { nanoid } from 'nanoid';

/**
 * Publisher dependencies
 */
import { Button, Flex } from '@publisher/components';
import {
	BaseControl,
	ToggleSelectControl,
	ControlContextProvider,
	InputControl,
} from '@publisher/controls';
import { useBlockContext } from '../../../hooks';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../../api/utils';
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { default as JustifyCenterIcon } from '../icons/justify-center';
import { default as JustifyFlexEndIcon } from '../icons/justify-flex-end';
import { default as JustifyFlexStartIcon } from '../icons/justify-flex-start';
import { default as AlignContentCenterIcon } from '../icons/align-content-center';
import { default as JustifySpaceBetweenIcon } from '../icons/justify-space-between';
import { default as AlignItemsCenterBlockIcon } from '../icons/align-items-center';
import { default as AlignContentStretchIcon } from '../icons/align-content-stretch';
import { default as AlignContentFlexEndIcon } from '../icons/align-content-flex-end';
import { default as AlignItemsStretchBlockIcon } from '../icons/align-items-stretch';
import { default as AlignItemsFlexEndBlockIcon } from '../icons/align-items-flex-end';
import { default as AlignItemsBaselineBlockIcon } from '../icons/align-items-baseline';
import { default as AlignContentFlexStartIcon } from '../icons/align-content-flex-start';
import { default as AlignItemsFlexStartBlockIcon } from '../icons/align-items-flex-start';
import { default as AlignContentSpaceAroundIcon } from '../icons/align-content-space-around';
import { default as AlignContentSpaceBetweenIcon } from '../icons/align-content-space-between';
import { default as EditIcon } from '../icons/edit';

import { Gap } from '.';

export default function ({
	config,
	block,
	handleOnChangeAttributes,
	gridAlignItems,
	gridJustifyItems,
	gridAlignContent,
	gridJustifyContent,
	gridGap,
	//gridDirection,
	gridColumns,
	//gridAreas,
	gridRows,
}: {
	config: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	block: TBlockProps,
	gridAlignItems: string,
	gridJustifyItems: string,
	gridAlignContent: string,
	gridJustifyContent: string,
	gridGap: Object,
	gridDirection: Object,
	gridColumns: Array<Object>,
	gridRows: Array<Object>,
	gridAreas: Array<Object>,
}): MixedElement {
	const {
		publisherGridAlignItems,
		publisherGridJustifyItems,
		publisherGridAlignContent,
		publisherGridJustifyContent,
		publisherGridGap,
		// publisherGridDirection,
		publisherGridColumns,
		publisherGridRows,
		//publisherGridAreas,
	} = config;

	const defaultGridItemValue = {
		'sizing-mode': 'normal',
		size: '1fr',
		'min-size': '',
		'max-size': '',
		'auto-fit': false,
	};

	const { setOpenGridBuilder, isOpenGridBuilder } = useBlockContext();

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
					{isActiveField(publisherGridRows) && (
						<ControlContextProvider
							value={{
								name: generateExtensionId(
									block,
									'grid-rows-length'
								),
								value: gridRows,
								attribute: 'publisherGridRows',
								blockName: block.blockName,
							}}
						>
							<InputControl
								id={"['length']"}
								singularId={"['length']"}
								label={__('Rows', 'publisher-core')}
								columns="columns-1"
								size="small"
								type="number"
								className="control-first label-center small-gap"
								onChange={(
									length: number,
									ref?: Object
								): void => {
									if (gridRows.value.length < length) {
										const value = [...gridRows.value];
										let i = gridRows.value.length;
										while (i < length) {
											value.push({
												...defaultGridItemValue,
												id: nanoid(),
											});
											i++;
										}

										handleOnChangeAttributes(
											'publisherGridRows',
											{ length, value },
											{ ref }
										);
									}

									if (gridRows.value.length > length) {
										const value = [...gridRows.value];
										value.splice(
											length,
											gridRows.value.length - length
										);

										handleOnChangeAttributes(
											'publisherGridRows',
											{ length, value },
											{ ref }
										);
									}
								}}
								defaultValue={gridRows.length || 1}
								min={1}
							/>
						</ControlContextProvider>
					)}

					{isActiveField(publisherGridColumns) && (
						<ControlContextProvider
							value={{
								name: generateExtensionId(
									block,
									'grid-columns-length'
								),
								value: gridColumns,
								attribute: 'publisherGridColumns',
								blockName: block.blockName,
							}}
						>
							<InputControl
								id={"['length']"}
								singularId={"['length']"}
								label={__('Columns', 'publisher-core')}
								columns="columns-1"
								size="small"
								type="number"
								className="control-first label-center small-gap"
								onChange={(
									length: number,
									ref?: Object
								): void => {
									if (gridColumns.value.length < length) {
										const value = [...gridColumns.value];
										let i = gridColumns.value.length;
										while (i < length) {
											value.push({
												...defaultGridItemValue,
												id: nanoid(),
											});
											i++;
										}

										handleOnChangeAttributes(
											'publisherGridColumns',
											{ length, value },
											{ ref }
										);
									}

									if (gridColumns.value.length > length) {
										const value = [...gridColumns.value];
										value.splice(
											length,
											gridColumns.value.length - length
										);

										handleOnChangeAttributes(
											'publisherGridColumns',
											{ length, value },
											{ ref }
										);
									}
								}}
								defaultValue={gridColumns.length || 1}
								min={1}
							/>
						</ControlContextProvider>
					)}
				</Flex>
			</BaseControl>

			{isActiveField(publisherGridAlignItems) && (
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
			)}

			{isActiveField(publisherGridGap) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'grid-gap'),
						value: gridGap,
						attribute: 'publisherGridGap',
						blockName: block.blockName,
					}}
				>
					<Gap
						block={block}
						gap={gridGap}
						field={publisherGridGap}
						attributeId="publisherGridGap"
						handleOnChangeAttributes={handleOnChangeAttributes}
					/>
				</ControlContextProvider>
			)}
		</>
	);
}
