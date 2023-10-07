// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useState } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	InputControl,
	SelectControl,
	FilterControl,
	PositionControl,
	TransformControl,
	TransitionControl,
	ToggleSelectControl,
	ControlContextProvider,
	convertAlignmentMatrixCoordinates,
} from '@publisher/controls';
import { isInteger } from '@publisher/utils';
import { Button, Popover } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { default as GearIcon } from './icons/gear';
import type { TEffectsProps } from './types/effects-props';
import { generateExtensionId, hasSameProps } from '../utils';
import { cursorFieldOptions, blendModeFieldOptions } from './utils';

export const EffectsExtension: TEffectsProps = memo<TEffectsProps>(
	({
		children,
		values: {
			opacity,
			transform,
			transition,
			filter,
			cursor,
			blendMode,
			backdropFilter,
			backfaceVisibility,
			transformSelfOrigin,
			transformChildOrigin,
			transformSelfPerspective,
			transformChildPerspective,
		},
		block,
		config,
		handleOnChangeAttributes,
		...props
	}: TEffectsProps): MixedElement => {
		const {
			effectsConfig: {
				publisherOpacity,
				publisherTransform,
				publisherTransition,
				publisherFilter,
				publisherCursor,
				publisherBlendMode,
				publisherBackdropFilter,
			},
		} = config;

		const [isTransformSettingsVisible, setIsTransformSettingsVisible] =
			useState(false);

		return (
			<>
				{isActiveField(publisherOpacity) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'opacity'),
							value: opacity,
						}}
					>
						<InputControl
							controlName="input"
							label={__('Opacity', 'publisher-core')}
							columns="columns-2"
							{...{
								...props,
								unitType: 'percent',
								range: true,
								min: 0,
								max: 100,
								initialPosition: 100,
								defaultValue: '100%',
								onChange: (newValue) =>
									handleOnChangeAttributes(
										'publisherOpacity',
										isInteger(newValue)
											? `${newValue}%`
											: newValue
									),
							}}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(publisherTransform) && (
					<>
						<ControlContextProvider
							value={{
								name: generateExtensionId(
									block,
									'transform-2d-3d'
								),
								value: transform,
							}}
							storeName={'publisher-core/controls/repeater'}
						>
							<BaseControl
								columns="columns-1"
								controlName="transform"
							>
								<TransformControl
									label={__(
										'2D & 3D Transforms',
										'publisher-core'
									)}
									value={transform}
									onChange={(newValue) =>
										handleOnChangeAttributes(
											'publisherTransform',
											isInteger(newValue)
												? `${newValue}%`
												: newValue
										)
									}
									injectHeaderButtonsStart={
										<>
											<Button
												size="extra-small"
												className={controlInnerClassNames(
													'btn-add'
												)}
												isFocus={
													isTransformSettingsVisible
												}
												onClick={() =>
													setIsTransformSettingsVisible(
														!isTransformSettingsVisible
													)
												}
											>
												<GearIcon />
											</Button>
										</>
									}
									{...props}
								/>

								{isTransformSettingsVisible && (
									<Popover
										title={__(
											'Transform Settings',
											'publisher-core'
										)}
										offset={35}
										placement="left-start"
										className={controlInnerClassNames(
											'transform-settings-popover'
										)}
										onClose={() => {
											setIsTransformSettingsVisible(
												false
											);
										}}
									>
										<ControlContextProvider
											value={{
												name: generateExtensionId(
													block,
													'self-perspective'
												),
												value: transformSelfPerspective,
											}}
										>
											<InputControl
												controlName="input"
												label={__(
													'Self Perspective',
													'publisher-core'
												)}
												columns="columns-2"
												{...{
													...props,
													unitType: 'essential',
													range: true,
													min: 0,
													max: 2000,
													initialPosition: 100,
													defaultValue: '0px',
													onChange: (newValue) =>
														handleOnChangeAttributes(
															'publisherTransformSelfPerspective',
															newValue
														),
												}}
											/>
										</ControlContextProvider>

										<ControlContextProvider
											value={{
												name: generateExtensionId(
													block,
													'self-origin'
												),
												value: {
													top: transformSelfOrigin?.top,
													left: transformSelfOrigin?.left,
													coordinates:
														convertAlignmentMatrixCoordinates(
															transformSelfOrigin
														)?.compact,
												},
											}}
										>
											<PositionControl
												label={__(
													'Self Origin',
													'publisher-core'
												)}
												columns="columns-2"
												topValue={
													transformSelfOrigin?.top
												}
												leftValue={
													transformSelfOrigin?.left
												}
												onChange={({ top, left }) => {
													handleOnChangeAttributes(
														'publisherTransformSelfOrigin',
														{
															...transformSelfOrigin,
															top,
															left,
														}
													);
												}}
											/>
										</ControlContextProvider>

										<ControlContextProvider
											value={{
												name: generateExtensionId(
													block,
													'backface-visibility'
												),
												value: backfaceVisibility,
											}}
										>
											<ToggleSelectControl
												controlName="toggle-select"
												label={__(
													'Backface Visibility',
													'publisher-core'
												)}
												columns="columns-2"
												options={[
													{
														label: __(
															'Visible',
															'publisher-core'
														),
														value: 'visible',
													},
													{
														label: __(
															'Hidden',
															'publisher-core'
														),
														value: 'hidden',
													},
												]}
												defaultValue="visible"
												onChange={(newValue) =>
													handleOnChangeAttributes(
														'publisherBackfaceVisibility',
														newValue
													)
												}
											/>
										</ControlContextProvider>

										<ControlContextProvider
											value={{
												name: generateExtensionId(
													block,
													'child-perspective'
												),
												value: transformChildPerspective
													? transformChildPerspective
													: '0px',
											}}
										>
											<InputControl
												controlName="input"
												label={__(
													'Child Perspective',
													'publisher-core'
												)}
												columns="columns-2"
												{...{
													...props,
													unitType: 'essential',
													range: true,
													min: 0,
													max: 2000,
													defaultValue: '0px',
													onChange: (newValue) =>
														handleOnChangeAttributes(
															'publisherTransformChildPerspective',
															newValue
														),
												}}
											/>
										</ControlContextProvider>

										<ControlContextProvider
											value={{
												name: generateExtensionId(
													block,
													'child-origin'
												),
												value: {
													top: transformChildOrigin?.top,
													left: transformChildOrigin?.left,
													coordinates:
														convertAlignmentMatrixCoordinates(
															transformChildOrigin
														)?.compact,
												},
											}}
										>
											<PositionControl
												label={__(
													'Child Origin',
													'publisher-core'
												)}
												columns="columns-2"
												topValue={
													transformChildOrigin?.top
												}
												leftValue={
													transformChildOrigin?.left
												}
												onValueChange={({
													top,
													left,
												}) => {
													handleOnChangeAttributes(
														'publisherTransformChildOrigin',
														{
															...transformChildOrigin,
															top,
															left,
														}
													);
												}}
											/>
										</ControlContextProvider>
									</Popover>
								)}
							</BaseControl>
						</ControlContextProvider>
					</>
				)}

				{isActiveField(publisherTransition) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'transition'),
							value: transition,
						}}
						storeName={'publisher-core/controls/repeater'}
					>
						<BaseControl
							controlName="transition"
							columns="columns-1"
						>
							<TransitionControl
								label={__('Transitions', 'publisher-core')}
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherTransition',
										newValue
									)
								}
								{...props}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherFilter) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'filters'),
							value: filter,
						}}
						storeName={'publisher-core/controls/repeater'}
					>
						<BaseControl controlName="filter" columns="columns-1">
							<FilterControl
								label={__('Filters', 'publisher-core')}
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherFilter',
										newValue
									)
								}
								{...props}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherBackdropFilter) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(
								block,
								'backdrop-filters'
							),
							value: backdropFilter,
						}}
						storeName={'publisher-core/controls/repeater'}
					>
						<BaseControl columns="columns-1" controlName="filter">
							<FilterControl
								label={__('Backdrop Filters', 'publisher-core')}
								popoverLabel={__(
									'Backdrop Filter',
									'publisher-core'
								)}
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherBackdropFilter',
										newValue
									)
								}
								{...props}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherCursor) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'cursor'),
							value: cursor,
						}}
					>
						<SelectControl
							controlName="select"
							label={__('Cursor', 'publisher-core')}
							columns="columns-2"
							{...{
								...props,
								options: cursorFieldOptions(),
								type: 'custom',
								customMenuPosition: 'top',
								//
								defaultValue: 'default',
								onChange: (newValue) =>
									handleOnChangeAttributes(
										'publisherCursor',
										newValue
									),
							}}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(publisherBlendMode) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'blend-mode'),
							value: blendMode,
						}}
					>
						<SelectControl
							controlName="select"
							label={__('Blending', 'publisher-core')}
							columns="columns-2"
							{...{
								...props,
								options: blendModeFieldOptions(),
								type: 'custom',
								customMenuPosition: 'top',
								//
								defaultValue: 'normal',
								value: blendMode,
								onChange: (newValue) =>
									handleOnChangeAttributes(
										'publisherBlendMode',
										newValue
									),
							}}
						/>
					</ControlContextProvider>
				)}
			</>
		);
	},
	hasSameProps
);
