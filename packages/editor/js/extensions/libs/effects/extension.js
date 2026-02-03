// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useMemo } from '@wordpress/element';
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
	ChangeIndicator,
} from '@blockera/controls';
import { isInteger } from '@blockera/utils';
import {
	controlInnerClassNames,
	extensionClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';
import { experimental } from '@blockera/env';

/**
 * Internal dependencies
 */
import { isShowField, isActiveExtension } from '../../api/utils';
import { EditorFeatureWrapper } from '../../../';
import type { TEffectsProps } from './types/effects-props';
import { generateExtensionId } from '../utils';
import { TransformSettings } from './components/transform-setting';
import { Opacity } from './components/opacity';
import { Transition } from './components/transition';
import { Filter } from './components/filter';
import { BackdropFilter } from './components/backdrop-filter';
import { ExtensionSettings } from '../settings';
import { Divider } from './components/divider';
import { Mask } from './components/mask';
import { useBlockSection } from '../../components';
import { useFeatureSearch } from '../../components/feature-search-context';

export const EffectsExtension: ComponentType<TEffectsProps> = ({
	values,
	block,
	extensionConfig,
	handleOnChangeAttributes,
	extensionProps,
	setSettings,
	attributes,
}: TEffectsProps): MixedElement => {
	const { initialOpen, onToggle } = useBlockSection('effectsConfig');
	const { activeSearchMode } = useFeatureSearch();
	const [isTransformSettingsVisible, setIsTransformSettingsVisible] =
		useState(false);

	/**
	 * Check if any transform settings feature has a value different from default
	 * Memoized to avoid recalculating on every render
	 */
	const hasTransformSettingsChanges = useMemo(() => {
		// Check blockeraTransformSelfPerspective
		if (
			values?.blockeraTransformSelfPerspective !==
			attributes.blockeraTransformSelfPerspective?.default
		) {
			return true;
		}

		// Check blockeraTransformSelfOrigin (object comparison)
		const selfOrigin = values?.blockeraTransformSelfOrigin;
		const selfOriginDefault =
			attributes.blockeraTransformSelfOrigin?.default || {};
		if (
			selfOrigin &&
			(selfOrigin.top !== selfOriginDefault.top ||
				selfOrigin.left !== selfOriginDefault.left)
		) {
			return true;
		}

		// Check blockeraBackfaceVisibility
		if (
			values?.blockeraBackfaceVisibility !==
			attributes.blockeraBackfaceVisibility?.default
		) {
			return true;
		}

		// Check blockeraTransformChildPerspective
		if (
			values?.blockeraTransformChildPerspective !==
			attributes.blockeraTransformChildPerspective?.default
		) {
			return true;
		}

		// Check blockeraTransformChildOrigin (object comparison)
		const childOrigin = values?.blockeraTransformChildOrigin;
		const childOriginDefault =
			attributes.blockeraTransformChildOrigin?.default || {};
		if (
			childOrigin &&
			(childOrigin.top !== childOriginDefault.top ||
				childOrigin.left !== childOriginDefault.left)
		) {
			return true;
		}

		return false;
	}, [
		values?.blockeraTransformSelfPerspective,
		values?.blockeraTransformSelfOrigin?.top,
		values?.blockeraTransformSelfOrigin?.left,
		values?.blockeraBackfaceVisibility,
		values?.blockeraTransformChildPerspective,
		values?.blockeraTransformChildOrigin?.top,
		values?.blockeraTransformChildOrigin?.left,
		attributes.blockeraTransformSelfPerspective?.default,
		attributes.blockeraTransformSelfOrigin?.default?.top,
		attributes.blockeraTransformSelfOrigin?.default?.left,
		attributes.blockeraBackfaceVisibility?.default,
		attributes.blockeraTransformChildPerspective?.default,
		attributes.blockeraTransformChildOrigin?.default?.top,
		attributes.blockeraTransformChildOrigin?.default?.left,
	]);

	if (!isActiveExtension(extensionConfig)) {
		return <></>;
	}

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

	let isShowMask = false;
	if (experimental().get('editor.extensions.effectsExtension.mask')) {
		isShowMask = isShowField(
			extensionConfig.blockeraMask,
			values?.blockeraMask,
			attributes.blockeraMask.default
		);
	}

	let isShowDivider = false;
	if (experimental().get('editor.extensions.effectsExtension.divider')) {
		isShowDivider = isShowField(
			extensionConfig.blockeraDivider,
			values?.blockeraDivider,
			attributes.blockeraDivider.default
		);
	}

	// Extension is not active
	if (
		!isShowOpacity &&
		!isShowTransform &&
		!isShowTransition &&
		!isShowFilter &&
		!isShowMask &&
		!isShowBackdropFilter &&
		!isShowDivider
	) {
		return <></>;
	}

	return (
		<PanelBodyControl
			onToggle={onToggle}
			title={__('Effects', 'blockera')}
			initialOpen={initialOpen}
			noWrapper={activeSearchMode}
			icon={<Icon icon="extension-effects" />}
			className={extensionClassNames('effects')}
		>
			{!activeSearchMode && (
				<ExtensionSettings
					buttonLabel={__('More Effect Settings', 'blockera')}
					features={extensionConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'effectsConfig');
					}}
				/>
			)}

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
					<BaseControl columns="columns-1" controlName="transform">
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
								extensionConfig={extensionConfig}
							/>
						)}

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
									style={{
										position: 'relative',
									}}
								>
									<Icon icon="three-d" iconSize="20" />
									{hasTransformSettingsChanges && (
										<ChangeIndicator
											isChanged={true}
											isAnimated={true}
											style={{
												position: 'absolute',
												top: '-2px',
												left: '-2px',
											}}
										/>
									)}
								</Button>
							}
							defaultValue={attributes.blockeraTransform.default}
							{...extensionProps.blockeraTransform}
						/>
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
		</PanelBodyControl>
	);
};
