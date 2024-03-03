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
	ColorControl,
	SelectControl,
	PanelBodyControl,
	BackgroundControl,
	ControlContextProvider,
	NoticeControl,
} from '@publisher/controls';
import { FeatureWrapper } from '@publisher/components';
import { componentClassNames } from '@publisher/classnames';
import { checkVisibleItemLength, hasSameProps } from '@publisher/utils';
import { normalizeRepeaterItems } from '@publisher/controls/src/libs/repeater-control/utils';

/**
 * Internal dependencies
 */
import ClipTextIcon from './icons/clip-text';
import ClipNoneIcon from './icons/clip-none';
import InheritIcon from '../../icons/inherit';
import { isShowField } from '../../api/utils';
import { generateExtensionId } from '../utils';
import ClipPaddingIcon from './icons/clip-padding';
import ClipContentIcon from './icons/clip-content';
import type { TBackgroundProps } from './types/background-props';
import { default as BackgroundExtensionIcon } from './icons/extension-icon';
import { ExtensionSettings } from '../settings';

export const BackgroundExtension: ComponentType<TBackgroundProps> = memo(
	({
		block,
		values,
		attributes,
		extensionConfig,
		handleOnChangeAttributes,
		extensionProps,
		setSettings,
	}: TBackgroundProps): MixedElement => {
		const {
			publisherBackground,
			publisherBackgroundColor,
			publisherBackgroundClip,
		} = extensionConfig;

		const isShowBackground = isShowField(
			extensionConfig.publisherBackground,
			values.publisherBackground,
			attributes.publisherBackground.default
		);
		const isShowBackgroundColor = isShowField(
			extensionConfig.publisherBackgroundColor,
			values.publisherBackgroundColor,
			attributes.publisherBackgroundColor.default
		);
		const isShowBackgroundClip = isShowField(
			extensionConfig.publisherBackgroundClip,
			values.publisherBackgroundClip,
			attributes.publisherBackgroundClip.default
		);

		if (
			!isShowBackground &&
			!isShowBackgroundColor &&
			!isShowBackgroundClip
		) {
			return <></>;
		}

		return (
			<PanelBodyControl
				title={__('Background', 'publisher-core')}
				initialOpen={true}
				icon={<BackgroundExtensionIcon />}
				className={componentClassNames(
					'extension',
					'extension-background'
				)}
			>
				<ExtensionSettings
					features={extensionConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'backgroundConfig');
					}}
				/>

				<FeatureWrapper
					isActive={isShowBackground}
					config={publisherBackground}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'background'),
							value: normalizeRepeaterItems(
								values.publisherBackground
							),
							attribute: 'publisherBackground',
							blockName: block.blockName,
						}}
						storeName={'publisher-core/controls/repeater'}
					>
						<BaseControl
							controlName="background"
							columns="columns-1"
						>
							<BackgroundControl
								label={__('Image & Gradient', 'publisher-core')}
								onChange={(newValue, ref) => {
									handleOnChangeAttributes(
										'publisherBackground',
										newValue,
										{ ref }
									);
								}}
								defaultValue={
									attributes.publisherBackground.default
								}
								{...extensionProps.publisherBackground}
							/>
						</BaseControl>
					</ControlContextProvider>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowBackgroundColor}
					config={publisherBackgroundColor}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(
								block,
								'background-color'
							),
							value: values.publisherBackgroundColor,
							attribute: 'publisherBackgroundColor',
							blockName: block.blockName,
						}}
					>
						<ColorControl
							label={__('BG Color', 'publisher-core')}
							labelPopoverTitle={__(
								'Background Color',
								'publisher-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'It sets the color of the block’s background, providing a simple yet powerful way to apply solid color.',
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											'You can use variables to use color from your site design system.',
											'publisher-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'publisherBackgroundColor',
									newValue,
									{ ref }
								)
							}
							defaultValue={
								attributes.publisherBackgroundColor.default
							}
							controlAddonTypes={['variable']}
							variableTypes={['color']}
							{...extensionProps.publisherBackgroundColor}
						/>
					</ControlContextProvider>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowBackgroundClip}
					config={publisherBackgroundClip}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'background-clip'),
							value: values.publisherBackgroundClip,
							attribute: 'publisherBackgroundClip',
							blockName: block.blockName,
						}}
					>
						<SelectControl
							label={__('Clipping', 'publisher-core')}
							labelPopoverTitle={__(
								'Background Clipping',
								'publisher-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'It defines how far the background (color or image) extends within the block.',
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											'It is useful for creating special effects with backgrounds, such as having a background only within the content area or under the borders.',
											'publisher-core'
										)}
									</p>
									<h3>
										<ClipPaddingIcon />
										{__(
											'Clip to Padding',
											'publisher-core'
										)}
									</h3>
									<p>
										{__(
											'The background stops at the padding edge, not extending behind the border.',
											'publisher-core'
										)}
									</p>
									<h3>
										<ClipContentIcon />
										{__(
											'Clip to Content',
											'publisher-core'
										)}
									</h3>
									<p>
										{__(
											'The background is applied only to the content area.',
											'publisher-core'
										)}
									</p>
									<h3>
										<ClipTextIcon />
										{__('Clip to Text', 'publisher-core')}
									</h3>
									<p>
										{__(
											'Advanced feature that allows the background to only be visible through the text of block.',
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											'This creates an eye-catching effect where the text acts as a mask for the background image or video.',
											'publisher-core'
										)}
									</p>
									<h3>
										<InheritIcon />
										{__('Inherit', 'publisher-core')}
									</h3>
									<p>
										{__(
											'Clipping inherit from the parent block.',
											'publisher-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
							options={[
								{
									label: __('None', 'publisher-core'),
									value: 'none',
									icon: <ClipNoneIcon />,
								},
								{
									label: __(
										'Clip to Padding',
										'publisher-core'
									),
									value: 'padding-box',
									icon: <ClipPaddingIcon />,
								},
								{
									label: __(
										'Clip to Content',
										'publisher-core'
									),
									value: 'content-box',
									icon: <ClipContentIcon />,
								},
								{
									label: __('Clip to Text', 'publisher-core'),
									value: 'text',
									icon: <ClipTextIcon />,
								},
								{
									label: __('Inherit', 'publisher-core'),
									value: 'inherit',
									icon: <InheritIcon />,
								},
							]}
							type="custom"
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'publisherBackgroundClip',
									newValue,
									{ ref }
								)
							}
							defaultValue={
								attributes.publisherBackgroundClip.default
							}
							{...extensionProps.publisherBackgroundClip}
						/>

						{!checkVisibleItemLength(values.publisherBackground) &&
							!values.publisherBackgroundColor &&
							values.publisherBackgroundClip === 'text' && (
								<NoticeControl
									type="error"
									style={{ marginTop: '10px' }}
								>
									{__(
										`You've applied text clipping without setting a background color or image. Make sure to add a background to the block.`,
										'publisher-core'
									)}
								</NoticeControl>
							)}
					</ControlContextProvider>
				</FeatureWrapper>
			</PanelBodyControl>
		);
	},
	hasSameProps
);
