// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	ColorControl,
	SelectControl,
	BackgroundControl,
	ControlContextProvider,
	NoticeControl,
} from '@publisher/controls';
import { isArray, isEmpty, checkVisibleItemLength } from '@publisher/utils';

/**
 * Internal dependencies
 */
import ClipTextIcon from './icons/clip-text';
import ClipNoneIcon from './icons/clip-none';
import InheritIcon from '../../icons/inherit';
import { isActiveField } from '../../api/utils';
import ClipPaddingIcon from './icons/clip-padding';
import ClipContentIcon from './icons/clip-content';
import { generateExtensionId, hasSameProps } from '../utils';
import type { TBackgroundProps } from './types/background-props';

export const BackgroundExtension: TBackgroundProps = memo<TBackgroundProps>(
	({
		block,
		config,
		children,
		values: { background, backgroundClip, backgroundColor },
		defaultValue,
		handleOnChangeAttributes,
		...props
	}: TBackgroundProps): MixedElement => {
		const {
			backgroundConfig: {
				publisherBackground,
				publisherBackgroundColor,
				publisherBackgroundClip,
			},
		} = config;

		const visibleBackgroundLength = checkVisibleItemLength(background);

		return (
			<>
				{isActiveField(publisherBackground) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'background'), //
							value: background || [
								{
									type: 'image',
									image: defaultValue?.backgroundImage || '',
									'image-size': 'custom',
									'image-size-width': 'auto',
									'image-size-height': 'auto',
									'image-position': {
										top: '50%',
										left: '50%',
									},
									'image-repeat': 'repeat',
									'image-attachment': 'scroll',
									isVisible: true,
								},
							],
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
								onChange={(newValue) => {
									const toWPCompatibleValue =
										isArray(newValue) &&
										!isEmpty(newValue) &&
										newValue[0]?.image
											? {
													style: {
														...(block?.attributes
															?.style ?? {}),
														background: {
															...(block
																?.attributes
																?.style
																?.background ??
																{}),
															backgroundImage:
																newValue[0]
																	.image,
														},
													},
											  }
											: {};

									handleOnChangeAttributes(
										'publisherBackground',
										newValue,
										{
											addOrModifyRootItems:
												toWPCompatibleValue,
										}
									);
								}}
								{...props}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherBackgroundColor) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(
								block,
								'background-color'
							),
							value: backgroundColor,
							attribute: 'publisherBackgroundColor',
							blockName: block.blockName,
						}}
					>
						<ColorControl
							controlName="color"
							label={__('BG Color', 'publisher-core')}
							columns="columns-2"
							{...props}
							onChange={(newValue) =>
								handleOnChangeAttributes(
									'publisherBackgroundColor',
									newValue
								)
							}
							controlAddonTypes={['variable']}
							variableTypes={['color']}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(publisherBackgroundClip) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'background-clip'),
							value: backgroundClip,
							attribute: 'publisherBackgroundClip',
							blockName: block.blockName,
						}}
					>
						<SelectControl
							controlName="select"
							label={__('Clipping', 'publisher-core')}
							columns="columns-2"
							{...{
								...props,
								options: [
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
										label: __(
											'Clip to Text',
											'publisher-core'
										),
										value: 'text',
										icon: <ClipTextIcon />,
									},
									{
										label: __('Inherit', 'publisher-core'),
										value: 'inherit',
										icon: <InheritIcon />,
									},
								], //
								type: 'custom',
								defaultValue: 'none',
								onChange: (newValue) =>
									handleOnChangeAttributes(
										'publisherBackgroundClip',
										newValue
									),
							}}
						/>
						{!visibleBackgroundLength &&
							!backgroundColor &&
							backgroundClip === 'text' && (
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
				)}
			</>
		);
	},
	hasSameProps
);
