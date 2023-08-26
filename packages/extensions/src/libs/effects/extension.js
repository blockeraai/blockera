/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';

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
import { BlockEditContext } from '../../hooks';
import { generateExtensionId } from '../utils';
import { isActiveField } from '../../api/utils';
import { default as GearIcon } from './icons/gear';
import { cursorFieldOptions, blendModeFieldOptions } from './utils';

export function EffectsExtension({ children, block, config, ...props }) {
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

	const { attributes, setAttributes } = useContext(BlockEditContext);

	const [isTransformSettingsVisible, setIsTransformSettingsVisible] =
		useState(false);

	return (
		<>
			{isActiveField(publisherOpacity) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'opacity'),
						value: attributes.publisherOpacity,
					}}
				>
					<BaseControl
						controlName="input"
						label={__('Opacity', 'publisher-core')}
					>
						<InputControl
							{...{
								...props,
								unitType: 'percent',
								range: true,
								min: 0,
								max: 100,
								initialPosition: 100,
								defaultValue: '100%',
								onChange: (newValue) =>
									setAttributes({
										...attributes,
										publisherOpacity: isInteger(newValue)
											? `${newValue}%`
											: newValue,
									}),
							}}
						/>
					</BaseControl>
				</ControlContextProvider>
			)}

			{isActiveField(publisherTransform) && (
				<>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'transform-2d-3d'),
							value: attributes.publisherTransform,
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
								value={attributes.publisherTransform}
								onChange={(newValue) =>
									setAttributes({
										...attributes,
										publisherTransform: newValue,
									})
								}
								injectHeaderButtonsStart={
									<>
										<Button
											size="extra-small"
											className={controlInnerClassNames(
												'btn-add'
											)}
											isFocus={isTransformSettingsVisible}
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
										setIsTransformSettingsVisible(false);
									}}
								>
									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'self-perspective'
											),
											value: attributes.publisherTransformSelfPerspective,
										}}
									>
										<BaseControl
											controlName="input"
											label={__(
												'Self Perspective',
												'publisher-core'
											)}
										>
											<InputControl
												{...{
													...props,
													unitType: 'essential',
													range: true,
													min: 0,
													max: 2000,
													initialPosition: 100,
													defaultValue: '0px',
													onChange: (newValue) =>
														setAttributes({
															...attributes,
															publisherTransformSelfPerspective:
																newValue,
														}),
												}}
											/>
										</BaseControl>
									</ControlContextProvider>

									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'self-origin'
											),
											value: {
												top: attributes
													.publisherTransformSelfOrigin
													?.top,
												left: attributes
													.publisherTransformSelfOrigin
													?.left,
												coordinates:
													convertAlignmentMatrixCoordinates(
														attributes.publisherTransformSelfOrigin
													)?.compact,
											},
										}}
									>
										<PositionControl
											label={__(
												'Self Origin',
												'publisher-core'
											)}
											topValue={
												attributes
													.publisherTransformSelfOrigin
													?.top
											}
											leftValue={
												attributes
													.publisherTransformSelfOrigin
													?.left
											}
											onChange={({ top, left }) => {
												setAttributes({
													...attributes,
													publisherTransformSelfOrigin:
														{
															...attributes.publisherTransformSelfOrigin,
															top,
															left,
														},
												});
											}}
										/>
									</ControlContextProvider>

									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'backface-visibility'
											),
											value: attributes.publisherBackfaceVisibility,
										}}
									>
										<BaseControl
											controlName="toggle-select"
											label={__(
												'Backface Visibility',
												'publisher-core'
											)}
										>
											<ToggleSelectControl
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
													setAttributes({
														...attributes,
														publisherBackfaceVisibility:
															newValue,
													})
												}
											/>
										</BaseControl>
									</ControlContextProvider>

									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'child-perspective'
											),
											value: attributes.publisherTransformChildPerspective
												? attributes.publisherTransformChildPerspective
												: '0px',
										}}
									>
										<BaseControl
											controlName="input"
											label={__(
												'Child Perspective',
												'publisher-core'
											)}
										>
											<InputControl
												{...{
													...props,
													unitType: 'essential',
													range: true,
													min: 0,
													max: 2000,
													defaultValue: '0px',
													onChange: (newValue) =>
														setAttributes({
															...attributes,
															publisherTransformChildPerspective:
																newValue,
														}),
												}}
											/>
										</BaseControl>
									</ControlContextProvider>

									<ControlContextProvider
										value={{
											name: generateExtensionId(
												block,
												'child-origin'
											),
											value: {
												top: attributes
													.publisherTransformChildOrigin
													?.top,
												left: attributes
													.publisherTransformChildOrigin
													?.left,
												coordinates:
													convertAlignmentMatrixCoordinates(
														attributes.publisherTransformChildOrigin
													)?.compact,
											},
										}}
									>
										<PositionControl
											label={__(
												'Child Origin',
												'publisher-core'
											)}
											topValue={
												attributes
													.publisherTransformChildOrigin
													?.top
											}
											leftValue={
												attributes
													.publisherTransformChildOrigin
													?.left
											}
											onValueChange={({ top, left }) => {
												setAttributes({
													...attributes,
													publisherTransformChildOrigin:
														{
															...attributes.publisherTransformChildOrigin,
															top,
															left,
														},
												});
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
						value: attributes.publisherTransition,
					}}
					storeName={'publisher-core/controls/repeater'}
				>
					<BaseControl controlName="transition" columns="columns-1">
						<TransitionControl
							label={__('Transitions', 'publisher-core')}
							onChange={(newValue) =>
								setAttributes({
									...attributes,
									publisherTransition: newValue,
								})
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
						value: attributes.publisherFilter,
					}}
					storeName={'publisher-core/controls/repeater'}
				>
					<BaseControl controlName="filter" columns="columns-1">
						<FilterControl
							label={__('Filters', 'publisher-core')}
							onChange={(newValue) =>
								setAttributes({
									...attributes,
									publisherFilter: newValue,
								})
							}
							{...props}
						/>
					</BaseControl>
				</ControlContextProvider>
			)}

			{isActiveField(publisherBackdropFilter) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'backdrop-filters'),
						value: attributes.publisherBackdropFilter,
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
								setAttributes({
									...attributes,
									publisherBackdropFilter: newValue,
								})
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
						value: attributes.publisherCursor,
					}}
				>
					<BaseControl
						controlName="select"
						label={__('Cursor', 'publisher-core')}
					>
						<SelectControl
							{...{
								...props,
								options: cursorFieldOptions(),
								type: 'custom',
								customMenuPosition: 'top',
								//
								defaultValue: 'default',
								onChange: (newValue) =>
									setAttributes({
										...attributes,
										publisherCursor: newValue,
									}),
							}}
						/>
					</BaseControl>
				</ControlContextProvider>
			)}

			{isActiveField(publisherBlendMode) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'blend-mode'),
						value: attributes.publisherBlendMode,
					}}
				>
					<BaseControl
						controlName="select"
						label={__('Blending', 'publisher-core')}
					>
						<SelectControl
							{...{
								...props,
								options: blendModeFieldOptions(),
								type: 'custom',
								customMenuPosition: 'top',
								//
								defaultValue: 'normal',
								value: attributes.publisherBlendMode,
								onChange: (newValue) =>
									setAttributes({
										...attributes,
										publisherBlendMode: newValue,
									}),
							}}
						/>
					</BaseControl>
				</ControlContextProvider>
			)}
		</>
	);
}
