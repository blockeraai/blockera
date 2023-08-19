/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	InputField,
	SelectField,
	TransitionField,
	FilterField,
	TransformField,
	PositionField,
	ToggleSelectField,
} from '@publisher/fields';
import {
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

export function EffectsExtension({ children, config, ...props }) {
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
						name: generateExtensionId(props, 'opacity'),
						value: attributes.publisherOpacity,
					}}
				>
					<InputField
						label={__('Opacity', 'publisher-core')}
						settings={{
							type: 'css',
							unitType: 'percent',
							range: true,
							min: 0,
							max: 100,
							initialPosition: 100,
							defaultValue: '100%',
						}}
						onChange={(newValue) =>
							setAttributes({
								...attributes,
								publisherOpacity: isInteger(newValue)
									? `${newValue}%`
									: newValue,
							})
						}
						{...props}
					/>
				</ControlContextProvider>
			)}

			{isActiveField(publisherTransform) && (
				<>
					<ControlContextProvider
						value={{
							name: generateExtensionId(props, 'transform-2d-3d'),
							value: attributes.publisherTransform,
						}}
						storeName={'publisher-core/controls/repeater'}
					>
						<TransformField
							label={__('2D & 3D Transforms', 'publisher-core')}
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
						>
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
												props,
												'self-perspective'
											),
											value: attributes.publisherTransformSelfPerspective,
										}}
									>
										<InputField
											label={__(
												'Self Perspective',
												'publisher-core'
											)}
											settings={{
												type: 'css',
												unitType: 'essential',
												range: true,
												min: 0,
												max: 2000,
											}}
											defaultValue="0px"
											onChange={(newValue) => {
												setAttributes({
													...attributes,
													publisherTransformSelfPerspective:
														newValue,
												});
											}}
											{...props}
										/>
									</ControlContextProvider>

									<ControlContextProvider
										value={{
											name: generateExtensionId(
												props,
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
										<PositionField
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
												props,
												'backface-visibility'
											),
											value: attributes.publisherBackfaceVisibility,
										}}
									>
										<ToggleSelectField
											label={__(
												'Backface Visibility',
												'publisher-core'
											)}
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
									</ControlContextProvider>

									<ControlContextProvider
										value={{
											name: generateExtensionId(
												props,
												'child-perspective'
											),
											value: attributes.publisherTransformChildPerspective
												? attributes.publisherTransformChildPerspective
												: '0px',
										}}
									>
										<InputField
											label={__(
												'Child Perspective',
												'publisher-core'
											)}
											settings={{
												type: 'css',
												unitType: 'essential',
												range: true,
												min: 0,
												max: 2000,
												defaultValue: '0px',
											}}
											defaultValue="0px"
											onChange={(newValue) =>
												setAttributes({
													...attributes,
													publisherTransformChildPerspective:
														newValue,
												})
											}
											{...props}
										/>
									</ControlContextProvider>

									<ControlContextProvider
										value={{
											name: generateExtensionId(
												props,
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
										<PositionField
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
						</TransformField>
					</ControlContextProvider>
				</>
			)}

			{isActiveField(publisherTransition) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props, 'transition'),
						value: attributes.publisherTransition,
					}}
					storeName={'publisher-core/controls/repeater'}
				>
					<TransitionField
						label={__('Transitions', 'publisher-core')}
						onChange={(newValue) =>
							setAttributes({
								...attributes,
								publisherTransition: newValue,
							})
						}
						{...props}
					/>
				</ControlContextProvider>
			)}

			{isActiveField(publisherFilter) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props, 'filters'),
						value: attributes.publisherFilter,
					}}
					storeName={'publisher-core/controls/repeater'}
				>
					<FilterField
						label={__('Filters', 'publisher-core')}
						onChange={(newValue) =>
							setAttributes({
								...attributes,
								publisherFilter: newValue,
							})
						}
						{...props}
					/>
				</ControlContextProvider>
			)}

			{isActiveField(publisherBackdropFilter) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props, 'backdrop-filters'),
						value: attributes.publisherBackdropFilter,
					}}
					storeName={'publisher-core/controls/repeater'}
				>
					<FilterField
						label={__('Backdrop Filters', 'publisher-core')}
						popoverLabel={__('Backdrop Filter', 'publisher-core')}
						onChange={(newValue) =>
							setAttributes({
								...attributes,
								publisherBackdropFilter: newValue,
							})
						}
						{...props}
					/>
				</ControlContextProvider>
			)}

			{isActiveField(publisherCursor) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props, 'cursor'),
						value: attributes.publisherCursor,
					}}
				>
					<SelectField
						{...{
							...props,
							label: __('Cursor', 'publisher-core'),
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
				</ControlContextProvider>
			)}

			{isActiveField(publisherBlendMode) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props, 'blend-mode'),
						value: attributes.publisherBlendMode,
					}}
				>
					<SelectField
						{...{
							...props,
							label: __('Blending', 'publisher-core'),
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
				</ControlContextProvider>
			)}
		</>
	);
}
