// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	OutlineControl,
	PanelBodyControl,
	BoxShadowControl,
	ControlContextProvider,
} from '@publisher/controls';
import { hasSameProps } from '@publisher/utils';
import { componentClassNames } from '@publisher/classnames';
import { FeatureWrapper } from '@publisher/components';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { Border, BorderRadius } from './components';
import { BorderAndShadowExtensionIcon } from './index';
import { generateExtensionId } from '../utils';
import type { TBorderAndShadowProps } from './types/border-and-shadow-props';
import { ExtensionSettings } from '../settings';

export const BorderAndShadowExtension: ComponentType<TBorderAndShadowProps> =
	memo(
		({
			block,
			extensionConfig,
			attributes,
			handleOnChangeAttributes,
			values,
			extensionProps,
			setSettings,
		}: TBorderAndShadowProps): MixedElement => {
			const isShownBorder = isShowField(
				extensionConfig.publisherBorder,
				values?.publisherBorder,
				attributes.publisherBorder.default
			);
			const isShownBorderRadius = isShowField(
				extensionConfig.publisherBorderRadius,
				values?.publisherBorderRadius,
				attributes.publisherBorderRadius.default
			);
			const isShownBoxShadow = isShowField(
				extensionConfig.publisherBoxShadow,
				values?.publisherBoxShadow,
				attributes.publisherBoxShadow.default
			);
			const isShownOutline = isShowField(
				extensionConfig.publisherOutline,
				values?.publisherOutline,
				attributes.publisherOutline.default
			);

			// extension is not active
			if (
				!isShownBorder &&
				!isShownBorderRadius &&
				!isShownBoxShadow &&
				!isShownOutline
			) {
				return <></>;
			}

			return (
				<PanelBodyControl
					title={__('Border And Shadow', 'publisher-core')}
					initialOpen={true}
					icon={<BorderAndShadowExtensionIcon />}
					className={componentClassNames(
						'extension',
						'extension-border-and-shadow'
					)}
				>
					<ExtensionSettings
						features={extensionConfig}
						update={(newSettings) => {
							setSettings(newSettings, 'borderAndShadowConfig');
						}}
					/>

					<FeatureWrapper
						isActive={isShownBorder}
						config={extensionConfig.publisherBorder}
					>
						<Border
							block={block}
							border={values.publisherBorder}
							defaultValue={attributes.publisherBorder.default}
							onChange={handleOnChangeAttributes}
							{...extensionProps.publisherBorder}
						/>
					</FeatureWrapper>

					<FeatureWrapper
						isActive={isShownBorderRadius}
						config={extensionConfig.publisherBorderRadius}
					>
						<BorderRadius
							block={block}
							borderRadius={values.publisherBorderRadius}
							defaultValue={
								attributes.publisherBorderRadius.default
							}
							onChange={handleOnChangeAttributes}
							{...extensionProps.publisherBorderRadius}
						/>
					</FeatureWrapper>

					<FeatureWrapper
						isActive={isShownBoxShadow}
						config={extensionConfig.publisherBoxShadow}
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'box-shadow'),
								value: values.publisherBoxShadow,
								attribute: 'publisherBoxShadow',
								blockName: block.blockName,
							}}
							storeName={'publisher-core/controls/repeater'}
						>
							<BaseControl
								controlName="box-shadow"
								columns="columns-1"
							>
								<BoxShadowControl
									label={__('Box Shadows', 'publisher-core')}
									labelDescription={
										<>
											<p>
												{__(
													'Creates a shadow effect around block for depth and focus.',
													'publisher-core'
												)}
											</p>
											<p>
												{__(
													'Soft shadows create a subtle effect, while bold shadows make the block more noticeable.',
													'publisher-core'
												)}
											</p>
										</>
									}
									onChange={(
										newValue: Array<Object>,
										ref?: Object
									): void =>
										handleOnChangeAttributes(
											'publisherBoxShadow',
											newValue,
											{ ref }
										)
									}
									defaultValue={
										attributes.publisherBoxShadow.default
									}
									{...extensionProps.publisherBoxShadow}
								/>
							</BaseControl>
						</ControlContextProvider>
					</FeatureWrapper>

					<FeatureWrapper
						isActive={isShownOutline}
						config={extensionConfig.publisherOutline}
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'outline'),
								value: values.publisherOutline,
								attribute: 'publisherOutline',
								blockName: block.blockName,
							}}
							storeName={'publisher-core/controls/repeater'}
						>
							<BaseControl
								controlName="outline"
								columns="columns-1"
							>
								<OutlineControl
									label={__('Outline', 'publisher-core')}
									labelDescription={
										<>
											<p>
												{__(
													'Add distinct borders to blocks without affecting layout, enhancing visual hierarchy and focus.',
													'publisher-core'
												)}
											</p>
											<p>
												{__(
													'Useful for highlighting blocks without space adjustments, unlike borders. Perfect for focus states and accessibility.',
													'publisher-core'
												)}
											</p>
										</>
									}
									onChange={(newValue, ref) =>
										handleOnChangeAttributes(
											'publisherOutline',
											newValue,
											{ ref }
										)
									}
									defaultValue={
										attributes.publisherOutline.default
									}
									{...extensionProps.publisherOutline}
								/>
							</BaseControl>
						</ControlContextProvider>
					</FeatureWrapper>
				</PanelBodyControl>
			);
		},
		hasSameProps
	);
