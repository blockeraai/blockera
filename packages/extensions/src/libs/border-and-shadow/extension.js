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
import { componentClassNames } from '@publisher/classnames';
import { FeatureWrapper } from '@publisher/components';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { Border, BorderRadius } from './components';
import { BorderAndShadowExtensionIcon } from './index';
import { generateExtensionId, hasSameProps } from '../utils';
import type { TBorderAndShadowProps } from './types/border-and-shadow-props';
import { ExtensionSettings } from '../settings';

export const BorderAndShadowExtension: ComponentType<TBorderAndShadowProps> =
	memo(
		({
			block,
			borderAndShadowConfig,
			attributes,
			handleOnChangeAttributes,
			values,
			extensionProps,
			setSettings,
		}: TBorderAndShadowProps): MixedElement => {
			const {
				publisherBoxShadow,
				publisherOutline,
				publisherBorder,
				publisherBorderRadius,
			} = borderAndShadowConfig;

			const isShownBorder = isShowField(
				publisherBorder,
				values?.border,
				attributes.border.default
			);
			const isShownBorderRadius = isShowField(
				publisherBorderRadius,
				values?.borderRadius,
				attributes.borderRadius.default
			);
			const isShownBoxShadow = isShowField(
				publisherBoxShadow,
				values?.boxShadow,
				attributes.boxShadow.default
			);
			const isShownOutline = isShowField(
				publisherOutline,
				values?.outline,
				attributes.outline.default
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
						features={borderAndShadowConfig}
						update={(newSettings) => {
							setSettings(newSettings, 'borderAndShadowConfig');
						}}
					/>

					<FeatureWrapper
						isActive={isShownBorder}
						isActiveOnStates={publisherBorder.isActiveOnStates}
						isActiveOnBreakpoints={
							publisherBorder.isActiveOnBreakpoints
						}
					>
						<Border
							block={block}
							border={values.border}
							defaultValue={attributes.border.default}
							onChange={handleOnChangeAttributes}
							{...extensionProps.publisherBorder}
						/>
					</FeatureWrapper>

					<FeatureWrapper
						isActive={isShownBorderRadius}
						isActiveOnStates={
							publisherBorderRadius.isActiveOnStates
						}
						isActiveOnBreakpoints={
							publisherBorderRadius.isActiveOnBreakpoints
						}
					>
						<BorderRadius
							block={block}
							borderRadius={values.borderRadius}
							defaultValue={attributes.borderRadius.default}
							onChange={handleOnChangeAttributes}
							{...extensionProps.publisherBorderRadius}
						/>
					</FeatureWrapper>

					<FeatureWrapper
						isActive={isShownBoxShadow}
						isActiveOnStates={publisherBoxShadow.isActiveOnStates}
						isActiveOnBreakpoints={
							publisherBoxShadow.isActiveOnBreakpoints
						}
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'box-shadow'),
								value: values.boxShadow,
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
									defaultValue={attributes.boxShadow.default}
									{...extensionProps.publisherBoxShadow}
								/>
							</BaseControl>
						</ControlContextProvider>
					</FeatureWrapper>

					<FeatureWrapper
						isActive={isShownOutline}
						isActiveOnStates={publisherOutline.isActiveOnStates}
						isActiveOnBreakpoints={
							publisherOutline.isActiveOnBreakpoints
						}
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'outline'),
								value: values.outline,
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
									defaultValue={attributes.outline.default}
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
