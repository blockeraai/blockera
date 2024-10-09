// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useState } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import {
	Button,
	BaseControl,
	TransformControl,
	PanelBodyControl,
	ControlContextProvider,
} from '@blockera/controls';
import { isInteger, hasSameProps } from '@blockera/utils';
import {
	controlInnerClassNames,
	extensionClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';
import { experimental } from '@blockera/env';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { EditorFeatureWrapper } from '../../../';
import type { TEffectsProps } from './types/effects-props';
import { generateExtensionId } from '../utils';
import { TransformSettings } from './components/transform-setting';
import { Opacity } from './components/opacity';
import { Transition } from './components/transition';
import { Filter } from './components/filter';
import { BackdropFilter } from './components/backdrop-filter';
import { Blending } from './components/blending';
import { ExtensionSettings } from '../settings';
import { Divider } from './components/divider';
import { Mask } from './components/mask';

export const EffectsExtension: ComponentType<TEffectsProps> = memo(
	({
		values,
		block,
		extensionConfig,
		handleOnChangeAttributes,
		extensionProps,
		setSettings,
		attributes,
	}: TEffectsProps): MixedElement => {
		const [isTransformSettingsVisible, setIsTransformSettingsVisible] =
			useState(false);

		const isShowOpacity = isShowField(
			extensionConfig.blockeraOpacity,
			values?.blockeraOpacity,
			attributes.blockeraOpacity.default
		);
		const isShowTransform = isShowField(
			extensionConfig.blockeraTransform,
			values?.blockeraTransform,
			attributes.blockeraTransform.default
		);
		const isShowTransition = isShowField(
			extensionConfig.blockeraTransition,
			values?.blockeraTransition,
			attributes.blockeraTransition.default
		);
		const isShowFilter = isShowField(
			extensionConfig.blockeraFilter,
			values?.blockeraFilter,
			attributes.blockeraFilter.default
		);
		const isShowBackdropFilter = isShowField(
			extensionConfig.blockeraBackdropFilter,
			values?.blockeraBackdropFilter,
			attributes.blockeraBackdropFilter.default
		);
		const isShowBlendMode = isShowField(
			extensionConfig.blockeraBlendMode,
			values?.blockeraBlendMode,
			attributes.blockeraBlendMode.default
		);

		let isShowMask = false;
		if (experimental().get('editor.extensions.effectsExtension.mask'))
			isShowMask = isShowField(
				extensionConfig.blockeraMask,
				values?.blockeraMask,
				attributes.blockeraMask.default
			);

		let isShowDivider = false;
		if (experimental().get('editor.extensions.effectsExtension.divider'))
			isShowDivider = isShowField(
				extensionConfig.blockeraDivider,
				values?.blockeraDivider,
				attributes.blockeraDivider.default
			);

		// Extension is not active
		if (
			!isShowOpacity &&
			!isShowTransform &&
			!isShowTransition &&
			!isShowFilter &&
			!isShowMask &&
			!isShowBackdropFilter &&
			!isShowDivider &&
			!isShowBlendMode
		) {
			return <></>;
		}

		return (
			<PanelBodyControl
				title={__('Effects', 'blockera')}
				initialOpen={true}
				icon={<Icon icon="extension-effects" />}
				className={extensionClassNames('effects')}
			>
				<ExtensionSettings
					buttonLabel={__('More Effect Settings', 'blockera')}
					features={extensionConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'effectsConfig');
					}}
				/>

				<EditorFeatureWrapper
					isActive={isShowOpacity}
					config={extensionConfig.blockeraOpacity}
				>
					<Opacity
						block={block}
						opacity={values.blockeraOpacity}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.blockeraOpacity.default}
						{...extensionProps.blockeraOpacity}
					/>
				</EditorFeatureWrapper>

				<EditorFeatureWrapper
					isActive={isShowTransform}
					config={extensionConfig.blockeraTransform}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'transform-2d-3d'),
							value: values.blockeraTransform,
							attribute: 'blockeraTransform',
							blockName: block.blockName,
						}}
						storeName={'blockera/controls/repeater'}
					>
						<BaseControl
							columns="columns-1"
							controlName="transform"
						>
							<TransformControl
								onChange={(newValue, ref) =>
									handleOnChangeAttributes(
										'blockeraTransform',
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
												'blockera'
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
											<Icon
												icon="gear-small"
												iconSize="20"
											/>
										</Button>
									</>
								}
								defaultValue={
									attributes.blockeraTransform.default
								}
								{...extensionProps.blockeraTransform}
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
									values={values}
									attributes={attributes}
								/>
							)}
						</BaseControl>
					</ControlContextProvider>
				</EditorFeatureWrapper>

				<EditorFeatureWrapper
					isActive={isShowTransition}
					config={extensionConfig.blockeraTransition}
				>
					<Transition
						transition={values.blockeraTransition}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.blockeraTransition.default}
						{...extensionProps.blockeraTransition}
					/>
				</EditorFeatureWrapper>

				<EditorFeatureWrapper
					isActive={isShowFilter}
					config={extensionConfig.blockeraFilter}
				>
					<Filter
						filter={values.blockeraFilter}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.blockeraFilter.default}
						{...extensionProps.blockeraFilter}
					/>
				</EditorFeatureWrapper>

				<EditorFeatureWrapper
					isActive={isShowBackdropFilter}
					config={extensionConfig.blockeraBackdropFilter}
				>
					<BackdropFilter
						backdropFilter={values.blockeraBackdropFilter}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.blockeraBackdropFilter.default}
						{...extensionProps.blockeraBackdropFilter}
					/>
				</EditorFeatureWrapper>

				<EditorFeatureWrapper
					isActive={isShowDivider}
					config={extensionConfig.blockeraDivider}
				>
					<Divider
						divider={values.blockeraDivider}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.blockeraDivider.default}
						{...extensionProps.blockeraDivider}
					/>
				</EditorFeatureWrapper>

				<EditorFeatureWrapper
					isActive={isShowMask}
					config={extensionConfig.blockeraMask}
				>
					<Mask
						mask={values.blockeraMask}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.blockeraMask.default}
						{...extensionProps.blockeraMask}
					/>
				</EditorFeatureWrapper>

				<EditorFeatureWrapper
					isActive={isShowBlendMode}
					config={extensionConfig.blockeraBlendMode}
				>
					<Blending
						blendMode={values.blockeraBlendMode}
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={attributes.blockeraBlendMode.default}
						{...extensionProps.blockeraBlendMode}
					/>
				</EditorFeatureWrapper>
			</PanelBodyControl>
		);
	},
	hasSameProps
);
