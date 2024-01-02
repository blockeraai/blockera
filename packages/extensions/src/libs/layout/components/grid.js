// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { Button, Popover } from '@publisher/components';
import {
	BaseControl,
	ToggleSelectControl,
	ControlContextProvider,
	CheckboxControl,
	RepeaterControl,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../../api/utils';
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { default as JustifyCenterIcon } from '../icons/justify-center';
import { default as JustifyFlexEndIcon } from '../icons/justify-flex-end';
import { default as JustifyFlexStartIcon } from '../icons/justify-flex-start';
import { default as JustifySpaceAroundIcon } from '../icons/justify-space-around';
import { default as JustifySpaceEvenlyIcon } from '../icons/justify-space-evenly';
import { default as AlignContentCenterIcon } from '../icons/align-content-center';
import { default as FlexDirectionRowBlockIcon } from '../icons/flex-direction-row';
import { default as JustifySpaceBetweenIcon } from '../icons/justify-space-between';
import { default as AlignItemsCenterBlockIcon } from '../icons/align-items-center';
import { default as AlignContentStretchIcon } from '../icons/align-content-stretch';
import { default as AlignContentFlexEndIcon } from '../icons/align-content-flex-end';
import { default as AlignItemsStretchBlockIcon } from '../icons/align-items-stretch';
import { default as AlignItemsFlexEndBlockIcon } from '../icons/align-items-flex-end';
import { default as AlignItemsBaselineBlockIcon } from '../icons/align-items-baseline';
import { default as FlexDirectionColumnBlockIcon } from '../icons/flex-direction-column';
import { default as AlignContentFlexStartIcon } from '../icons/align-content-flex-start';
import { default as AlignItemsFlexStartBlockIcon } from '../icons/align-items-flex-start';
import { default as AlignContentSpaceAroundIcon } from '../icons/align-content-space-around';
import { default as AlignContentSpaceBetweenIcon } from '../icons/align-content-space-between';
import { default as EditIcon } from '../icons/edit';
import { default as GridIcon } from '../icons/display-grid';
import { Gap } from '.';
import Fields from './fields';
import Header from './header';
import AreasFields from './areas-fields';
import AreasHeader from './areas-header';

export default function ({
	config,
	block,
	handleOnChangeAttributes,
	gridAlignItems,
	gridJustifyItems,
	gridAlignContent,
	gridJustifyContent,
	gridGap,
	gridDirection,
	gridColumns,
	gridRows,
	gridAreas,
	...props
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
		layoutConfig: {
			publisherGridAlignItems,
			publisherGridJustifyItems,
			publisherGridAlignContent,
			publisherGridJustifyContent,
			publisherGridGap,
			publisherGridDirection,
			publisherGridColumns,
			publisherGridRows,
			publisherGridAreas,
		},
	} = config;

	const [isGridSettingsOpen, setIsGridSettingsOpen] = useState(false);

	return (
		<>
			<BaseControl
				columns="columns-2"
				label={__('Grid Builder', 'publisher-core')}
			>
				<Button
					size="input"
					contentAlign="left"
					onClick={() => setIsGridSettingsOpen(true)}
				>
					<EditIcon />
					Edit Grid
				</Button>

				{isGridSettingsOpen && (
					<Popover
						title={
							<>
								<GridIcon />
								{__('Grid Settings', 'publisher-core')}
							</>
						}
						onClose={() => setIsGridSettingsOpen(false)}
						offset={100}
						placement="left-start"
					>
						{isActiveField(publisherGridGap) && (
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										block,
										'grid-gap'
									),
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
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
								/>
							</ControlContextProvider>
						)}

						{isActiveField(publisherGridDirection) && (
							<>
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'grid-direction'
										),
										value: gridDirection?.value,
										attribute: 'publisherGridDirection',
										blockName: block.blockName,
									}}
								>
									<BaseControl
										columns="columns-1"
										controlName="toggle-select"
									>
										<ToggleSelectControl
											label={__(
												'Direction',
												'publisher-core'
											)}
											isDeselectable={true}
											columns="columns-2"
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
												gridDirection?.value || 'row'
											}
											onChange={(
												value: string,
												ref?: Object
											): void => {
												handleOnChangeAttributes(
													'publisherGridDirection',
													{ ...gridDirection, value },
													{ ref }
												);
											}}
										>
											<ControlContextProvider
												value={{
													name: generateExtensionId(
														block,
														'grid-direction-dense'
													),
													value: gridDirection?.dense,
													attribute:
														'publisherGridDirection',
													blockName: block.blockName,
												}}
											>
												<CheckboxControl
													checkboxLabel={__(
														'Dense',
														'publisher-core'
													)}
													defaultValue={
														gridDirection.dense ||
														false
													}
													onChange={(
														dense: boolean,
														ref?: Object
													): void => {
														handleOnChangeAttributes(
															'publisherGridDirection',
															{
																...gridDirection,
																dense,
															},
															{ ref }
														);
													}}
												/>
											</ControlContextProvider>
										</ToggleSelectControl>
									</BaseControl>
								</ControlContextProvider>
							</>
						)}

						{isActiveField(publisherGridColumns) && (
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										block,
										'grid-columns'
									),
									value: gridColumns,
									attribute: 'publisherGridColumns',
									blockName: block.blockName,
								}}
								storeName={'publisher-core/controls/repeater'}
							>
								<BaseControl
									controlName="repeater"
									columns="columns-1"
								>
									<RepeaterControl
										columns="columns-1"
										addNewButtonLabel={__(
											'Add New Column',
											'publisher-core'
										)}
										label={__('Columns', 'publisher-core')}
										repeaterItemHeader={Header}
										repeaterItemChildren={Fields}
										defaultRepeaterItemValue={{
											'sizing-mode': 'normal',
											size: '1fr',
											'min-size': '',
											'max-size': '',
											'auto-fit': false,
											isVisible: true,
										}}
										defaultValue={[]}
										onChange={(
											newValue: Array<Object>,
											ref?: Object
										): void =>
											handleOnChangeAttributes(
												'publisherGridColumns',
												newValue,
												{ ref }
											)
										}
										{...props}
									/>
								</BaseControl>
							</ControlContextProvider>
						)}

						{isActiveField(publisherGridRows) && (
							<BaseControl columns="columns-1">
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'grid-rows'
										),
										value: gridRows,
										attribute: 'publisherGridRows',
										blockName: block.blockName,
									}}
									storeName={
										'publisher-core/controls/repeater'
									}
								>
									<RepeaterControl
										columns="columns-1"
										addNewButtonLabel={__(
											'Add New Row',
											'publisher-core'
										)}
										label={__('Rows', 'publisher-core')}
										repeaterItemHeader={Header}
										repeaterItemChildren={Fields}
										defaultRepeaterItemValue={{
											'sizing-mode': 'normal',
											size: '1fr',
											'min-size': '',
											'max-size': '',
											'auto-fit': false,
											isVisible: true,
										}}
										defaultValue={[]}
										onChange={(
											newValue: Array<Object>,
											ref?: Object
										): void =>
											handleOnChangeAttributes(
												'publisherGridRows',
												newValue,
												{ ref }
											)
										}
										{...props}
									/>
								</ControlContextProvider>
							</BaseControl>
						)}

						{isActiveField(publisherGridAreas) && (
							<BaseControl columns="columns-1">
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'grid-areas'
										),
										value: gridAreas,
										attribute: 'publisherGridAreas',
										blockName: block.blockName,
									}}
									storeName={
										'publisher-core/controls/repeater'
									}
								>
									<RepeaterControl
										columns="columns-1"
										addNewButtonLabel={__(
											'Add New Area',
											'publisher-core'
										)}
										label={__('Areas', 'publisher-core')}
										repeaterItemHeader={AreasHeader}
										repeaterItemChildren={AreasFields}
										defaultRepeaterItemValue={{
											name: '',
											'column-start': '',
											'column-end': '',
											'row-start': '',
											'row-end': '',
											isVisible: true,
										}}
										defaultValue={[]}
										onChange={(
											newValue: Array<Object>,
											ref?: Object
										): void =>
											handleOnChangeAttributes(
												'publisherGridAreas',
												newValue,
												{ ref }
											)
										}
										emptyItemPlaceholder={__(
											'No Area',
											'publisher-core'
										)}
										{...props}
									/>
								</ControlContextProvider>
							</BaseControl>
						)}
					</Popover>
				)}
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
								label: __('Space Between', 'publisher-core'),
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
								label: __('Flex Start', 'publisher-core'),
								value: 'flex-start',
								icon: <AlignContentFlexStartIcon />,
							},
							{
								label: __('Center', 'publisher-core'),
								value: 'center',
								icon: <AlignContentCenterIcon />,
							},
							{
								label: __('Flex End', 'publisher-core'),
								value: 'flex-end',
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
								label: __('Flex Start', 'publisher-core'),
								value: 'flex-start',
								icon: <AlignContentFlexStartIcon />,
							},
							{
								label: __('Center', 'publisher-core'),
								value: 'center',
								icon: <AlignContentCenterIcon />,
							},
							{
								label: __('Flex End', 'publisher-core'),
								value: 'flex-end',
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
		</>
	);
}
