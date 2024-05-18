// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import {
	BaseControl,
	OutlineControl,
	PanelBodyControl,
	BoxShadowControl,
	ControlContextProvider,
} from '@blockera/controls';
import { hasSameProps } from '@blockera/utils';
import { extensionClassNames } from '@blockera/classnames';
import { EditorFeatureWrapper } from '@blockera/editor';

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
				extensionConfig.blockeraBorder,
				values?.blockeraBorder,
				attributes.blockeraBorder.default
			);
			const isShownBorderRadius = isShowField(
				extensionConfig.blockeraBorderRadius,
				values?.blockeraBorderRadius,
				attributes.blockeraBorderRadius.default
			);
			const isShownBoxShadow = isShowField(
				extensionConfig.blockeraBoxShadow,
				values?.blockeraBoxShadow,
				attributes.blockeraBoxShadow.default
			);
			const isShownOutline = isShowField(
				extensionConfig.blockeraOutline,
				values?.blockeraOutline,
				attributes.blockeraOutline.default
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
					title={__('Border And Shadow', 'blockera')}
					initialOpen={true}
					icon={<BorderAndShadowExtensionIcon />}
					className={extensionClassNames('border-and-shadow')}
				>
					<ExtensionSettings
						buttonLabel={__('More Border Settings', 'blockera')}
						features={extensionConfig}
						update={(newSettings) => {
							setSettings(newSettings, 'borderAndShadowConfig');
						}}
					/>

					<EditorFeatureWrapper
						isActive={isShownBorder}
						config={extensionConfig.blockeraBorder}
					>
						<Border
							block={block}
							border={values.blockeraBorder}
							defaultValue={attributes.blockeraBorder.default}
							onChange={handleOnChangeAttributes}
							{...extensionProps.blockeraBorder}
						/>
					</EditorFeatureWrapper>

					<EditorFeatureWrapper
						isActive={isShownBorderRadius}
						config={extensionConfig.blockeraBorderRadius}
					>
						<BorderRadius
							block={block}
							borderRadius={values.blockeraBorderRadius}
							defaultValue={
								attributes.blockeraBorderRadius.default
							}
							onChange={handleOnChangeAttributes}
							{...extensionProps.blockeraBorderRadius}
						/>
					</EditorFeatureWrapper>

					<EditorFeatureWrapper
						isActive={isShownBoxShadow}
						config={extensionConfig.blockeraBoxShadow}
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'box-shadow'),
								value: values.blockeraBoxShadow,
								attribute: 'blockeraBoxShadow',
								blockName: block.blockName,
							}}
							storeName={'blockera-core/controls/repeater'}
						>
							<BaseControl
								controlName="box-shadow"
								columns="columns-1"
							>
								<BoxShadowControl
									label={__('Box Shadows', 'blockera')}
									labelDescription={
										<>
											<p>
												{__(
													'Creates a shadow effect around block for depth and focus.',
													'blockera'
												)}
											</p>
											<p>
												{__(
													'Soft shadows create a subtle effect, while bold shadows make the block more noticeable.',
													'blockera'
												)}
											</p>
										</>
									}
									onChange={(
										newValue: Array<Object>,
										ref?: Object
									): void =>
										handleOnChangeAttributes(
											'blockeraBoxShadow',
											newValue,
											{ ref }
										)
									}
									defaultValue={
										attributes.blockeraBoxShadow.default
									}
									{...extensionProps.blockeraBoxShadow}
								/>
							</BaseControl>
						</ControlContextProvider>
					</EditorFeatureWrapper>

					<EditorFeatureWrapper
						isActive={isShownOutline}
						config={extensionConfig.blockeraOutline}
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'outline'),
								value: values.blockeraOutline,
								attribute: 'blockeraOutline',
								blockName: block.blockName,
							}}
							storeName={'blockera-core/controls/repeater'}
						>
							<BaseControl
								controlName="outline"
								columns="columns-1"
							>
								<OutlineControl
									label={__('Outline', 'blockera')}
									labelDescription={
										<>
											<p>
												{__(
													'Add distinct borders to blocks without affecting layout, enhancing visual hierarchy and focus.',
													'blockera'
												)}
											</p>
											<p>
												{__(
													'Useful for highlighting blocks without space adjustments, unlike borders. Perfect for focus states and accessibility.',
													'blockera'
												)}
											</p>
										</>
									}
									onChange={(newValue, ref) =>
										handleOnChangeAttributes(
											'blockeraOutline',
											newValue,
											{ ref }
										)
									}
									defaultValue={
										attributes.blockeraOutline.default
									}
									{...extensionProps.blockeraOutline}
								/>
							</BaseControl>
						</ControlContextProvider>
					</EditorFeatureWrapper>
				</PanelBodyControl>
			);
		},
		hasSameProps
	);
