// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { memo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	ControlContextProvider,
	InputControl,
	SelectControl,
	ToggleSelectControl,
} from '@publisher/controls';
import { Flex, Button } from '@publisher/components';
import { checkVisibleItemLength } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { default as GearIcon } from './icons/gear';
import { generateExtensionId, hasSameProps } from '../utils';
import { default as AlignStretchIcon } from './icons/align-stretch';
import { default as AlignEndIcon } from './icons/align-end';
import { default as AlignStartIcon } from './icons/align-start';
import { default as AlignCenterIcon } from './icons/align-center';
import { default as OrderFirst } from './icons/order-first';
import { default as OrderLast } from './icons/order-last';
import type { TGridChildProps } from './types/grid-child-props';
import { createAreasOptions } from './utils';

export const GridChildExtension: TGridChildProps = memo<TGridChildProps>(
	({
		block,
		config,
		values: {
			gridChildPosition,
			gridChildAlign,
			gridChildJustify,
			gridChildOrder,
			gridChildOrderCustom,
			gridAreas,
		},
		handleOnChangeAttributes,
		...props
	}: TGridChildProps): MixedElement => {
		const {
			gridChildConfig: {
				publisherGridChildPosition,
				publisherGridChildAlign,
				publisherGridChildJustify,
				publisherGridChildOrder,
			},
		} = config;

		return (
			<>
				{isActiveField(publisherGridChildPosition) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(
								block,
								'grid-child-position'
							),
							value: gridChildPosition,
							attribute: 'publisherGridChildPosition',
							blockName: block.blockName,
						}}
					>
						<BaseControl
							columns="columns-1"
							controlName="toggle-select"
						>
							<ToggleSelectControl
								id="['position-type']"
								label={__('Position', 'publisher-core')}
								columns="columns-2"
								options={[
									{
										label: __('Auto', 'publisher-core'),
										value: 'auto',
									},
									{
										label: __('Area', 'publisher-core'),
										value: 'area',
									},
									{
										label: __('Manual', 'publisher-core'),
										value: 'manual',
									},
								]}
								defaultValue={
									gridChildPosition['position-type'] || 'auto'
								}
								onChange={(
									newValue: string,
									ref?: Object
								): void => {
									handleOnChangeAttributes(
										'publisherGridChildPosition',
										{
											...gridChildPosition,
											'position-type': newValue,
										},
										{ ref }
									);
								}}
							>
								{gridChildPosition['position-type'] ===
									'auto' && (
									<Flex>
										<InputControl
											id="['column-span']"
											singularId="['column-span']"
											label={__(
												'Column Span',
												'publisher-core'
											)}
											columns="columns-1"
											size="small"
											type="number"
											className="control-first label-center small-gap"
											onChange={(
												newValue: string,
												ref?: Object
											): void => {
												handleOnChangeAttributes(
													'publisherGridChildPosition',
													{
														...gridChildPosition,
														'column-span': newValue,
													},
													{ ref }
												);
											}}
											defaultValue={
												gridChildPosition[
													'column-span'
												] || 1
											}
											min={1}
										/>
										<InputControl
											id="['row-span']"
											singularId="['row-span']"
											label={__(
												'Row Span',
												'publisher-core'
											)}
											columns="columns-1"
											size="small"
											type="number"
											className="control-first label-center small-gap"
											onChange={(
												newValue: string,
												ref?: Object
											): void => {
												handleOnChangeAttributes(
													'publisherGridChildPosition',
													{
														...gridChildPosition,
														'row-span': newValue,
													},
													{ ref }
												);
											}}
											defaultValue={
												gridChildPosition['row-span'] ||
												1
											}
											min={1}
										/>
									</Flex>
								)}

								{gridChildPosition['position-type'] ===
									'area' &&
									(checkVisibleItemLength(gridAreas) ? (
										<SelectControl
											id="area"
											options={createAreasOptions(
												gridAreas
											)}
											defaultValue={
												gridChildPosition?.area || ''
											}
											onChange={(
												area: string,
												ref?: Object
											): void => {
												handleOnChangeAttributes(
													'publisherGridChildPosition',
													{
														...gridChildPosition,
														area,
													},
													{ ref }
												);
											}}
										/>
									) : (
										<Button
											size="input"
											isDisabled={true}
											contentAlign="center"
										>
											No Areas
										</Button>
									))}
							</ToggleSelectControl>
							{gridChildPosition['position-type'] ===
								'manual' && (
								<>
									<BaseControl
										columns="80px 160px"
										label={__('Column', 'publisher-core')}
									>
										<Flex>
											<InputControl
												id={"['column-start']"}
												singularId={"['column-start']"}
												label={__(
													'Start',
													'publisher-core'
												)}
												columns="columns-1"
												size="small"
												type="number"
												className="control-first label-center small-gap"
												onChange={(
													newValue: string,
													ref?: Object
												): void => {
													handleOnChangeAttributes(
														'publisherGridChildPosition',
														{
															...gridChildPosition,
															'column-start':
																newValue,
														},
														{ ref }
													);
												}}
												defaultValue={
													gridChildPosition[
														'column-start'
													] || ''
												}
												min={1}
											/>
											<InputControl
												id="['column-end']"
												singularId="['column-end']"
												label={__(
													'End',
													'publisher-core'
												)}
												columns="columns-1"
												size="small"
												type="number"
												className="control-first label-center small-gap"
												onChange={(
													newValue: string,
													ref?: Object
												): void => {
													handleOnChangeAttributes(
														'publisherGridChildPosition',
														{
															...gridChildPosition,
															'column-end':
																newValue,
														},
														{ ref }
													);
												}}
												defaultValue={
													gridChildPosition[
														'column-end'
													] || ''
												}
												min={1}
											/>
										</Flex>
									</BaseControl>

									<BaseControl
										columns="80px 160px"
										label={__('Row', 'publisher-core')}
									>
										<Flex>
											<InputControl
												id="['row-start']"
												singularId="['row-start']"
												label={__(
													'Start',
													'publisher-core'
												)}
												columns="columns-1"
												size="small"
												type="number"
												className="control-first label-center small-gap"
												onChange={(
													newValue: string,
													ref?: Object
												): void => {
													handleOnChangeAttributes(
														'publisherGridChildPosition',
														{
															...gridChildPosition,
															'row-start':
																newValue,
														},
														{ ref }
													);
												}}
												defaultValue={
													gridChildPosition[
														'row-start'
													] || ''
												}
												min={1}
											/>
											<InputControl
												id="['row-end']"
												singularId="['row-end']"
												label={__(
													'End',
													'publisher-core'
												)}
												columns="columns-1"
												size="small"
												type="number"
												className="control-first label-center small-gap"
												onChange={(
													newValue: string,
													ref?: Object
												): void => {
													handleOnChangeAttributes(
														'publisherGridChildPosition',
														{
															...gridChildPosition,
															'row-end': newValue,
														},
														{ ref }
													);
												}}
												defaultValue={
													gridChildPosition[
														'row-end'
													] || ''
												}
												min={1}
											/>
										</Flex>
									</BaseControl>
								</>
							)}
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherGridChildAlign) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(
								block,
								'grid-child-align'
							),
							value: gridChildAlign,
							attribute: 'publisherGridChildAlign',
							blockName: block.blockName,
						}}
					>
						<ToggleSelectControl
							columns="80px 160px"
							label={__('Align', 'publisher-core')}
							isDeselectable={true}
							controlName="toggle-select"
							defaultValue={gridChildAlign || ''}
							onChange={(newValue: string, ref?: Object): void =>
								handleOnChangeAttributes(
									'publisherGridChildAlign',
									newValue,
									{ ref }
								)
							}
							options={[
								{
									label: __('Start', 'publisher-core'),
									value: 'start',
									icon: <AlignStartIcon />,
								},
								{
									label: __('Center', 'publisher-core'),
									value: 'center',
									icon: <AlignCenterIcon />,
								},
								{
									label: __('End', 'publisher-core'),
									value: 'end',
									icon: <AlignEndIcon />,
								},
								{
									label: __('Stretch', 'publisher-core'),
									value: 'stretch',
									icon: <AlignStretchIcon />,
								},
							]}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(publisherGridChildJustify) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(
								block,
								'grid-child-justify'
							),
							value: gridChildJustify,
							attribute: 'publisherGridChildJustify',
							blockName: block.blockName,
						}}
					>
						<ToggleSelectControl
							columns="80px 160px"
							controlName="toggle-select"
							className="grid-child-justify-self"
							label={__('Justify', 'publisher-core')}
							options={[
								{
									label: __('Start', 'publisher-core'),
									value: 'start',
									icon: <AlignStartIcon />,
								},
								{
									label: __('Center', 'publisher-core'),
									value: 'center',
									icon: <AlignCenterIcon />,
								},

								{
									label: __('End', 'publisher-core'),
									value: 'end',
									icon: <AlignEndIcon />,
								},
								{
									label: __('Stretch', 'publisher-core'),
									value: 'stretch',

									icon: <AlignStretchIcon />,
								},
							]}
							isDeselectable={true}
							defaultValue={gridChildJustify || ''}
							onChange={(newValue: string, ref?: Object): void =>
								handleOnChangeAttributes(
									'publisherGridChildJustify',
									newValue,
									{ ref }
								)
							}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(publisherGridChildOrder) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(
								block,
								'grid-child-order'
							),
							value: gridChildOrder,
							attribute: 'publisherGridChildOrder',
							blockName: block.blockName,
						}}
					>
						<BaseControl
							columns="80px 160px"
							controlName="toggle-select"
							label={__('Order', 'publisher-core')}
						>
							<ToggleSelectControl
								options={[
									{
										label: __('First', 'publisher-core'),
										value: 'first',
										icon: <OrderFirst />,
									},
									{
										label: __('Last', 'publisher-core'),
										value: 'last',
										icon: <OrderLast />,
									},
									{
										label: __(
											'Custom Order',
											'publisher-core'
										),
										value: 'custom',
										icon: <GearIcon />,
									},
								]}
								isDeselectable={true}
								//
								defaultValue=""
								onChange={(newValue: string, ref?: Object) =>
									handleOnChangeAttributes(
										'publisherGridChildOrder',
										newValue,
										{ ref }
									)
								}
							/>
							<>
								{gridChildOrder === 'custom' && (
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'grid-child-order-custom'
											),
											value: gridChildOrderCustom,
											attribute:
												'publisherGridChildOrderCustom',
											blockName: block.blockName,
										}}
									>
										<InputControl
											controlName="input"
											label={__(
												'Custom',
												'publisher-core'
											)}
											columns="2fr 3fr"
											unitType="order"
											arrows={true}
											min={-1}
											onChange={(
												newValue: string,
												ref?: Object
											) =>
												handleOnChangeAttributes(
													'publisherGridChildOrderCustom',
													newValue,
													{ ref }
												)
											}
											size="small"
											{...props}
										/>
									</ControlContextProvider>
								)}
							</>
						</BaseControl>
					</ControlContextProvider>
				)}
			</>
		);
	},
	hasSameProps
);
