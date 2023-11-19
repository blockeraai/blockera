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
} from '@publisher/controls';
import { isArray, isEmpty } from '@publisher/utils';

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
									'image-size-width': '1auto',
									'image-size-height': '1auto',
									'image-position': {
										top: '50%',
										left: '50%',
									},
									'image-repeat': 'repeat',
									'image-attachment': 'scroll',
									isVisible: true,
								},
							],
						}}
						storeName={'publisher-core/controls/repeater'}
					>
						<BaseControl
							controlName="background"
							columns="columns-1"
						>
							<BackgroundControl
								label={__('Image & Gradient', 'publisher-core')}
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherBackground',
										newValue,
										'',
										(
											attributes: Object,
											setAttributes: (
												attributes: Object
											) => void
										): void => {
											if (
												!isArray(newValue) ||
												isEmpty(newValue)
											) {
												return;
											}

											setAttributes({
												...attributes,
												style: {
													...(attributes?.style ??
														{}),
													background: {
														...(attributes?.style
															?.background ?? {}),
														backgroundImage:
															newValue[0].image,
													},
												},
											});
										}
									)
								}
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
						}}
					>
						<ColorControl
							controlName="color"
							label={__('BG Color', 'publisher-core')}
							columns="columns-2"
							{...{
								...props, //
								onChange: (newValue) =>
									handleOnChangeAttributes(
										'publisherBackgroundColor',
										newValue
									),
							}}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(publisherBackgroundClip) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'background-clip'),
							value: backgroundClip,
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
					</ControlContextProvider>
				)}
			</>
		);
	},
	hasSameProps
);
