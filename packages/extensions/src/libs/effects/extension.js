// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useState } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	TransformControl,
	PanelBodyControl,
	ControlContextProvider,
} from '@publisher/controls';
import { isInteger } from '@publisher/utils';
import { Button, FeatureWrapper } from '@publisher/components';
import {
	componentClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { default as GearIcon } from './icons/gear';
import type { TEffectsProps } from './types/effects-props';
import { generateExtensionId, hasSameProps } from '../utils';
import { TransformSettings } from './components/transform-setting';
import { Opacity } from './components/opacity';
import { Transition } from './components/transition';
import { Filter } from './components/filter';
import { BackdropFilter } from './components/backdrop-filter';
import { Blending } from './components/blending';
import { Divider } from './components/divider';
import { Mask } from './components/mask';
import { EffectsExtensionIcon } from './index';
import { ExtensionSettings } from '../settings';

export const EffectsExtension: ComponentType<TEffectsProps> = memo(
	({
		values,
		block,
		effectsConfig,
		handleOnChangeAttributes,
		extensionProps,
		setSettings,
		attributes,
	}: TEffectsProps): MixedElement => {
		const [isTransformSettingsVisible, setIsTransformSettingsVisible] =
			useState(false);

		const isShowOpacity = isShowField(
			effectsConfig.publisherOpacity,
			values?.opacity,
			attributes.opacity.default
		);
		const isShowTransform = isShowField(
			effectsConfig.publisherTransform,
			values?.transform,
			attributes.transform.default
		);
		const isShowTransition = isShowField(
			effectsConfig.publisherTransition,
			values?.transition,
			attributes.transition.default
		);
		const isShowFilter = isShowField(
			effectsConfig.publisherFilter,
			values?.filter,
			attributes.filter.default
		);
		const isShowBackdropFilter = isShowField(
			effectsConfig.publisherBackdropFilter,
			values?.backdropFilter,
			attributes.backdropFilter.default
		);
		const isShowDivider = isShowField(
			effectsConfig.publisherDivider,
			values?.divider,
			attributes.divider.default
		);
		const isShowMask = isShowField(
			effectsConfig.publisherMask,
			values?.mask,
			attributes.mask.default
		);
		const isShowBlendMode = isShowField(
			effectsConfig.publisherBlendMode,
			values?.blendMode,
			attributes.blendMode.default
		);

		// Extension is not active
		if (
			!isShowOpacity &&
			!isShowTransform &&
			!isShowTransition &&
			!isShowFilter &&
			!isShowBackdropFilter &&
			!isShowDivider &&
			!isShowMask &&
			!isShowBlendMode
		) {
			return <></>;
		}

		return (
			<PanelBodyControl
				title={__('Effects', 'publisher-core')}
				initialOpen={true}
				icon={<EffectsExtensionIcon />}
				className={componentClassNames(
					'extension',
					'extension-effects'
				)}
			>
				<ExtensionSettings
					features={effectsConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'effectsConfig');
					}}
				/>

				<FeatureWrapper
					isActive={isShowOpacity}
					isActiveOnStates={
						effectsConfig.publisherOpacity.isActiveOnStates
					}
					isActiveOnBreakpoints={
						effectsConfig.publisherOpacity.isActiveOnBreakpoints
					}
				>
					<Opacity
						block={block}
						opacity={values.opacity}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.opacity.default}
						{...extensionProps.publisherOpacity}
					/>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowTransform}
					isActiveOnStates={
						effectsConfig.publisherTransform.isActiveOnStates
					}
					isActiveOnBreakpoints={
						effectsConfig.publisherTransform.isActiveOnBreakpoints
					}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'transform-2d-3d'),
							value: values.transform,
							attribute: 'publisherTransform',
							blockName: block.blockName,
						}}
						storeName={'publisher-core/controls/repeater'}
					>
						<BaseControl
							columns="columns-1"
							controlName="transform"
						>
							<TransformControl
								onChange={(newValue, ref) =>
									handleOnChangeAttributes(
										'publisherTransform',
										isInteger(newValue)
											? `${newValue}%`
											: newValue,
										{ ref }
									)
								}
								injectHeaderButtonsStart={
									<>
										<Button
											showTooltip={true}
											tooltipPosition="top"
											label={__(
												'Transformation Settings',
												'publisher-core'
											)}
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
								defaultValue={attributes.transform.default}
								{...extensionProps.publisherTransform}
							/>

							{isTransformSettingsVisible && (
								<TransformSettings
									setIsTransformSettingsVisible={
										setIsTransformSettingsVisible
									}
									block={block}
									handleOnChangeAttributes={
										handleOnChangeAttributes
									}
									values={{
										transform: values.transform,
										transformSelfPerspective:
											values.transformSelfPerspective,
										transformSelfOrigin:
											values.transformSelfOrigin,
										backfaceVisibility:
											values.backfaceVisibility,
										transformChildPerspective:
											values.transformChildPerspective,
										transformChildOrigin:
											values.transformChildOrigin,
									}}
									attributes={attributes}
								/>
							)}
						</BaseControl>
					</ControlContextProvider>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowTransition}
					isActiveOnStates={
						effectsConfig.publisherTransition.isActiveOnStates
					}
					isActiveOnBreakpoints={
						effectsConfig.publisherTransition.isActiveOnBreakpoints
					}
				>
					<Transition
						transition={values.transition}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.transition.default}
						{...extensionProps.publisherTransition}
					/>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowFilter}
					isActiveOnStates={
						effectsConfig.publisherFilter.isActiveOnStates
					}
					isActiveOnBreakpoints={
						effectsConfig.publisherFilter.isActiveOnBreakpoints
					}
				>
					<Filter
						filter={values.filter}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.filter.default}
						{...extensionProps.publisherFilter}
					/>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowBackdropFilter}
					isActiveOnStates={
						effectsConfig.publisherBackdropFilter.isActiveOnStates
					}
					isActiveOnBreakpoints={
						effectsConfig.publisherBackdropFilter
							.isActiveOnBreakpoints
					}
				>
					<BackdropFilter
						backdropFilter={values.backdropFilter}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.backdropFilter.default}
						{...extensionProps.publisherBackdropFilter}
					/>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowDivider}
					isActiveOnStates={
						effectsConfig.publisherDivider.isActiveOnStates
					}
					isActiveOnBreakpoints={
						effectsConfig.publisherDivider.isActiveOnBreakpoints
					}
				>
					<Divider
						divider={values.divider}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.divider.default}
						{...extensionProps.publisherDivider}
					/>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowMask}
					isActiveOnStates={
						effectsConfig.publisherMask.isActiveOnStates
					}
					isActiveOnBreakpoints={
						effectsConfig.publisherMask.isActiveOnBreakpoints
					}
				>
					<Mask
						mask={values.mask}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.mask.default}
						{...extensionProps.publisherMask}
					/>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowBlendMode}
					isActiveOnStates={
						effectsConfig.publisherBlendMode.isActiveOnStates
					}
					isActiveOnBreakpoints={
						effectsConfig.publisherBlendMode.isActiveOnBreakpoints
					}
				>
					<Blending
						blendMode={values.blendMode}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.blendMode.default}
						{...extensionProps.publisherBlendMode}
					/>
				</FeatureWrapper>
			</PanelBodyControl>
		);
	},
	hasSameProps
);
