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
	ColorControl,
	SelectControl,
	PanelBodyControl,
	BackgroundControl,
	ControlContextProvider,
	NoticeControl,
} from '@blockera/controls';
import { checkVisibleItemLength, hasSameProps } from '@blockera/utils';
import { extensionClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { generateExtensionId } from '../utils';
import { EditorFeatureWrapper } from '../../../';
import type { TBackgroundProps } from './types/background-props';
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

		if (
			!isShowBackground &&
			!isShowBackgroundColor &&
			!isShowBackgroundClip
		) {
			return <></>;
		}

		return (
			<PanelBodyControl
				title={__('Background', 'blockera')}
				initialOpen={true}
				icon={<Icon icon="extension-background" />}
				className={extensionClassNames('background')}
			>
				<ExtensionSettings
					buttonLabel={__('More Background Settings', 'blockera')}
					features={extensionConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'backgroundConfig');
					}}
				/>

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
						storeName={'blockera-core/controls/repeater'}
					>
						<BaseControl
							controlName="background"
							columns="columns-1"
						>
							<BackgroundControl
								label={__('Image & Gradient', 'blockera')}
								onChange={(newValue, ref) => {
									handleOnChangeAttributes(
										'blockeraBackground',
										newValue,
										{ ref }
									);
								}}
								defaultValue={
									attributes.blockeraBackground.default
								}
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
							name: generateExtensionId(
								block,
								'background-color'
							),
							value: values.blockeraBackgroundColor,
							attribute: 'blockeraBackgroundColor',
							blockName: block.blockName,
						}}
					>
						<ColorControl
							label={__('BG Color', 'blockera')}
							labelPopoverTitle={__(
								'Background Color',
								'blockera'
							)}
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
							columns="columns-2"
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
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'background-clip'),
							value: values.blockeraBackgroundClip,
							attribute: 'blockeraBackgroundClip',
							blockName: block.blockName,
						}}
					>
						<SelectControl
							label={__('Clipping', 'blockera')}
							labelPopoverTitle={__(
								'Background Clipping',
								'blockera'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'It defines how far the background (color or image) extends within the block.',
											'blockera'
										)}
									</p>
									<p>
										{__(
											'It is useful for creating special effects with backgrounds, such as having a background only within the content area or under the borders.',
											'blockera'
										)}
									</p>
									<h3>
										<Icon
											icon="clip-padding"
											iconSize={18}
										/>
										{__('Clip to Padding', 'blockera')}
									</h3>
									<p>
										{__(
											'The background stops at the padding edge, not extending behind the border.',
											'blockera'
										)}
									</p>
									<h3>
										<Icon
											icon="clip-content"
											iconSize={18}
										/>
										{__('Clip to Content', 'blockera')}
									</h3>
									<p>
										{__(
											'The background is applied only to the content area.',
											'blockera'
										)}
									</p>
									<h3>
										<Icon icon="clip-text" iconSize={18} />
										{__('Clip to Text', 'blockera')}
									</h3>
									<p>
										{__(
											'Advanced feature that allows the background to only be visible through the text of block.',
											'blockera'
										)}
									</p>
									<p>
										{__(
											'This creates an eye-catching effect where the text acts as a mask for the background image or video.',
											'blockera'
										)}
									</p>
									<h3>
										<Icon
											icon="inherit-circle"
											iconSize={18}
										/>
										{__('Inherit', 'blockera')}
									</h3>
									<p>
										{__(
											'Clipping inherit from the parent block.',
											'blockera'
										)}
									</p>
								</>
							}
							columns="columns-2"
							options={[
								{
									label: __('None', 'blockera'),
									value: 'none',
									icon: (
										<Icon
											icon="none-square"
											iconSize={18}
											className="icon-soft-color"
										/>
									),
								},
								{
									label: __('Clip to Padding', 'blockera'),
									value: 'padding-box',
									icon: (
										<Icon
											icon="clip-padding"
											iconSize={18}
										/>
									),
								},
								{
									label: __('Clip to Content', 'blockera'),
									value: 'content-box',
									icon: (
										<Icon
											icon="clip-content"
											iconSize={18}
										/>
									),
								},
								{
									label: __('Clip to Text', 'blockera'),
									value: 'text',
									icon: (
										<Icon icon="clip-text" iconSize={18} />
									),
								},
								{
									label: __('Inherit', 'blockera'),
									value: 'inherit',
									icon: (
										<Icon
											icon="inherit-square"
											iconSize={18}
										/>
									),
								},
							]}
							type="custom"
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'blockeraBackgroundClip',
									newValue,
									{ ref }
								)
							}
							defaultValue={
								attributes.blockeraBackgroundClip.default
							}
							{...extensionProps.blockeraBackgroundClip}
						/>

						{!checkVisibleItemLength(values.blockeraBackground) &&
							!values.blockeraBackgroundColor &&
							values.blockeraBackgroundClip === 'text' && (
								<NoticeControl
									type="error"
									style={{ marginTop: '10px' }}
								>
									{__(
										`You've applied text clipping without setting a background color or image. Make sure to add a background to the block.`,
										'blockera'
									)}
								</NoticeControl>
							)}
					</ControlContextProvider>
				</EditorFeatureWrapper>
			</PanelBodyControl>
		);
	},
	hasSameProps
);
