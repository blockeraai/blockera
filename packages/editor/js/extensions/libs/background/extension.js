// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import {
	BaseControl,
	ColorControl,
	PanelBodyControl,
	BackgroundControl,
	ControlContextProvider,
} from '@blockera/controls';
import { extensionClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { isShowField, isActiveExtension } from '../../api/utils';
import { generateExtensionId } from '../utils';
import { ExtensionSettings } from '../settings';
import { EditorFeatureWrapper } from '../../../';
import { useBlockSection } from '../../components';
import { useFeatureSearch } from '../../components/feature-search-context';
import type { TBackgroundProps } from './types/background-props';
import { BackgroundClipping, Blending } from './components';

export const BackgroundExtension: ComponentType<TBackgroundProps> = ({
	block,
	values,
	attributes,
	extensionConfig,
	handleOnChangeAttributes,
	extensionProps,
	setSettings,
}: TBackgroundProps): MixedElement => {
	const { initialOpen, onToggle } = useBlockSection('backgroundConfig');
	const { activeSearchMode } = useFeatureSearch();

	if (!isActiveExtension(extensionConfig)) {
		return <></>;
	}

	const {
		blockeraBackground,
		blockeraBackgroundColor,
		blockeraBackgroundClip,
	} = extensionConfig;

	const isShowBackground = isShowField(
		extensionConfig.blockeraBackground,
		values.blockeraBackground,
		attributes.blockeraBackground.default
	);
	const isShowBackgroundColor = isShowField(
		extensionConfig.blockeraBackgroundColor,
		values.blockeraBackgroundColor,
		attributes.blockeraBackgroundColor.default
	);
	const isShowBackgroundClip = isShowField(
		extensionConfig.blockeraBackgroundClip,
		values.blockeraBackgroundClip,
		attributes.blockeraBackgroundClip.default
	);
	const isShowBlendMode = isShowField(
		extensionConfig.blockeraBlendMode,
		values?.blockeraBlendMode,
		attributes.blockeraBlendMode.default
	);

	if (
		!isShowBackground &&
		!isShowBackgroundColor &&
		!isShowBackgroundClip &&
		!isShowBlendMode
	) {
		return <></>;
	}

	return (
		<PanelBodyControl
			title={__('Background', 'blockera')}
			initialOpen={initialOpen}
			icon={<Icon icon="extension-background" />}
			className={extensionClassNames('background')}
			onToggle={onToggle}
		>
			{!activeSearchMode && (
				<ExtensionSettings
					buttonLabel={__('More Background Settings', 'blockera')}
					features={extensionConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'backgroundConfig');
					}}
				/>
			)}

			<EditorFeatureWrapper
				isActive={isShowBackground}
				config={blockeraBackground}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'background'),
						value: values.blockeraBackground,
						attribute: 'blockeraBackground',
						blockName: block.blockName,
					}}
					storeName={'blockera/controls/repeater'}
				>
					<BaseControl controlName="background" columns="columns-1">
						<BackgroundControl
							label={__('Image & Gradient', 'blockera')}
							onChange={(newValue, ref) => {
								handleOnChangeAttributes(
									'blockeraBackground',
									newValue,
									{ ref }
								);
							}}
							defaultValue={attributes.blockeraBackground.default}
							{...extensionProps.blockeraBackground}
						/>
					</BaseControl>
				</ControlContextProvider>
			</EditorFeatureWrapper>

			<EditorFeatureWrapper
				isActive={isShowBackgroundColor}
				config={blockeraBackgroundColor}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'background-color'),
						value: values.blockeraBackgroundColor,
						attribute: 'blockeraBackgroundColor',
						blockName: block.blockName,
					}}
				>
					<ColorControl
						label={__('BG Color', 'blockera')}
						labelPopoverTitle={__('Background Color', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'It sets the color of the block’s background, providing a simple yet powerful way to apply solid color.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										'You can use variables to use color from your site design system.',
										'blockera'
									)}
								</p>
							</>
						}
						columns="1fr 2.5fr"
						onChange={(newValue, ref) =>
							handleOnChangeAttributes(
								'blockeraBackgroundColor',
								newValue,
								{ ref }
							)
						}
						defaultValue={
							attributes.blockeraBackgroundColor.default
						}
						controlAddonTypes={['variable']}
						variableTypes={['color']}
						{...extensionProps.blockeraBackgroundColor}
					/>
				</ControlContextProvider>
			</EditorFeatureWrapper>

			<EditorFeatureWrapper
				isActive={isShowBackgroundClip}
				config={blockeraBackgroundClip}
			>
				<BackgroundClipping
					block={block}
					value={values.blockeraBackgroundClip}
					backgroundItems={values.blockeraBackground}
					backgroundColor={values.blockeraBackgroundColor}
					onChange={handleOnChangeAttributes}
					defaultValue={attributes.blockeraBackgroundClip.default}
					options={blockeraBackgroundClip?.config?.options}
					{...extensionProps.blockeraBackgroundClip}
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
};
