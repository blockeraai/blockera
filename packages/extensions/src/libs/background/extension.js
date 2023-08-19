/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { ControlContextProvider } from '@publisher/controls';
import { ColorField, SelectField, BackgroundField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import ClipTextIcon from './icons/clip-text';
import ClipNoneIcon from './icons/clip-none';
import InheritIcon from '../../icons/inherit';
import { BlockEditContext } from '../../hooks';
import { generateExtensionId } from '../utils';
import { isActiveField } from '../../api/utils';
import ClipPaddingIcon from './icons/clip-padding';
import ClipContentIcon from './icons/clip-content';

export function BackgroundExtension({ children, config, ...props }) {
	const {
		backgroundConfig: {
			publisherBackground,
			publisherBackgroundColor,
			publisherBackgroundClip,
		},
	} = config;

	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<>
			{isActiveField(publisherBackground) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props, 'background'),
						//
						value: attributes.publisherBackground,
					}}
					storeName={'publisher-core/controls/repeater'}
				>
					<BackgroundField
						label={__('Image & Gradient', 'publisher-core')}
						onChange={(newValue) =>
							setAttributes({
								...attributes,
								publisherBackground: newValue,
							})
						}
						{...props}
					/>
				</ControlContextProvider>
			)}

			{isActiveField(publisherBackgroundColor) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props, 'background-color'),
						value: attributes.publisherBackgroundColor,
					}}
				>
					<ColorField
						{...{
							...props,
							label: __('Color', 'publisher-core'),
							//
							onChange: (newValue) =>
								setAttributes({
									...attributes,
									publisherBackgroundColor: newValue,
								}),
						}}
					/>
				</ControlContextProvider>
			)}

			{isActiveField(publisherBackgroundClip) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props, 'background-clip'),
						value: attributes.publisherBackgroundClip,
					}}
				>
					<SelectField
						{...{
							...props,
							label: __('Clipping', 'publisher-core'),
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
									label: __('Clip to Text', 'publisher-core'),
									value: 'text',
									icon: <ClipTextIcon />,
								},
								{
									label: __('Inherit', 'publisher-core'),
									value: 'inherit',
									icon: <InheritIcon />,
								},
							],
							//
							type: 'custom',
							defaultValue: 'none',
							onChange: (newValue) =>
								setAttributes({
									...attributes,
									publisherBackgroundClip: newValue,
								}),
						}}
					/>
				</ControlContextProvider>
			)}
		</>
	);
}
