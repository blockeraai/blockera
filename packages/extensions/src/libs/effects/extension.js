/**
 * WordPress dependencies
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
import { Button, Popover } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';
import { cursorFieldOptions, blendModeFieldOptions } from './utils';
import { default as GearIcon } from './icons/gear';

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
					value={attributes.publisherOpacity}
					onChange={(newValue) =>
						setAttributes({
							...attributes,
							publisherOpacity: newValue,
						})
					}
					{...props}
				/>
			)}

			{isActiveField(publisherTransform) && (
				<>
					<TransformField
						label={__('2D & 3D Transforms', 'publisher-core')}
						value={attributes.publisherTransform}
						onValueChange={(newValue) =>
							setAttributes({
								...attributes,
								publisherTransform: newValue,
							})
						}
						headerButtonsStart={
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
								label={__(
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
									value={
										attributes.publisherTransformSelfPerspective
									}
									onChange={(newValue) => {
										setAttributes({
											...attributes,
											publisherTransformSelfPerspective:
												newValue,
										});
									}}
									{...props}
								/>

								<PositionField
									label={__('Self Origin', 'publisher-core')}
									topValue={
										attributes.publisherTransformSelfOrigin
											?.top
									}
									leftValue={
										attributes.publisherTransformSelfOrigin
											?.left
									}
									onValueChange={({ top, left }) => {
										setAttributes({
											...attributes,
											publisherTransformSelfOrigin: {
												...attributes.publisherTransformSelfOrigin,
												top,
												left,
											},
										});
									}}
								/>

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
									value={
										attributes.publisherBackfaceVisibility
									}
									onChange={(newValue) =>
										setAttributes({
											...attributes,
											publisherBackfaceVisibility:
												newValue,
										})
									}
								/>

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
									value={
										attributes.publisherTransformChildPerspective
											? attributes.publisherTransformChildPerspective
											: '0px'
									}
									onChange={(newValue) =>
										setAttributes({
											...attributes,
											publisherTransformChildPerspective:
												newValue,
										})
									}
									{...props}
								/>

								<PositionField
									label={__('Child Origin', 'publisher-core')}
									topValue={
										attributes.publisherTransformChildOrigin
											?.top
									}
									leftValue={
										attributes.publisherTransformChildOrigin
											?.left
									}
									onValueChange={({ top, left }) => {
										setAttributes({
											...attributes,
											publisherTransformChildOrigin: {
												...attributes.publisherTransformChildOrigin,
												top,
												left,
											},
										});
									}}
								/>
							</Popover>
						)}
					</TransformField>
				</>
			)}

			{isActiveField(publisherTransition) && (
				<TransitionField
					label={__('Transitions', 'publisher-core')}
					value={attributes.publisherTransition}
					onValueChange={(newValue) =>
						setAttributes({
							...attributes,
							publisherTransition: newValue,
						})
					}
					{...props}
				/>
			)}

			{isActiveField(publisherFilter) && (
				<FilterField
					label={__('Filters', 'publisher-core')}
					value={attributes.publisherFilter}
					onValueChange={(newValue) =>
						setAttributes({
							...attributes,
							publisherFilter: newValue,
						})
					}
					{...props}
				/>
			)}

			{isActiveField(publisherBackdropFilter) && (
				<FilterField
					label={__('Backdrop Filters', 'publisher-core')}
					popoverLabel={__('Backdrop Filter', 'publisher-core')}
					value={attributes.publisherBackdropFilter}
					onValueChange={(newValue) =>
						setAttributes({
							...attributes,
							publisherBackdropFilter: newValue,
						})
					}
					{...props}
				/>
			)}

			{isActiveField(publisherCursor) && (
				<SelectField
					{...{
						...props,
						label: __('Cursor', 'publisher-core'),
						options: cursorFieldOptions(),
						type: 'custom',
						customMenuPosition: 'top',
						//
						defaultValue: 'default',
						value: attributes.publisherCursor,
						onChange: (newValue) =>
							setAttributes({
								...attributes,
								publisherCursor: newValue,
							}),
					}}
				/>
			)}

			{isActiveField(publisherBlendMode) && (
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
			)}
		</>
	);
}
