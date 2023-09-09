/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';

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

export const BackgroundExtension = memo(
	({
		block,
		config,
		children,
		background,
		backgroundClip,
		backgroundColor,
		handleOnChangeAttributes,
		...props
	}) => {
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
							name: generateExtensionId(block, 'background'),
							//
							value: background,
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
										newValue
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
						<BaseControl
							controlName="color"
							label={__('Color', 'publisher-core')}
						>
							<ColorControl
								{...{
									...props,
									//
									onChange: (newValue) =>
										handleOnChangeAttributes(
											'publisherBackgroundColor',
											newValue
										),
								}}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherBackgroundClip) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'background-clip'),
							value: backgroundClip,
						}}
					>
						<BaseControl
							controlName="select"
							label={__('Clipping', 'publisher-core')}
						>
							<SelectControl
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
											label: __(
												'Inherit',
												'publisher-core'
											),
											value: 'inherit',
											icon: <InheritIcon />,
										},
									],
									//
									type: 'custom',
									defaultValue: 'none',
									onChange: (newValue) =>
										handleOnChangeAttributes(
											'publisherBackgroundClip',
											newValue
										),
								}}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}
			</>
		);
	},
	hasSameProps
);
