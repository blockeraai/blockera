/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { ControlContextProvider } from '@publisher/controls';
import { InputField, ToggleSelectField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../utils';
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';
import { default as OverflowVisibleIcon } from './icons/overflow-visible';
import { default as OverflowHiddenIcon } from './icons/overflow-hidden';
import { default as OverflowScrollIcon } from './icons/overflow-scroll';

export function SizeExtension({ children, config, ...props }) {
	const {
		sizeConfig: { publisherWidth, publisherHeight, publisherOverflow },
	} = config;

	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<>
			{isActiveField(publisherWidth) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props.blockName, 'width'),
						value: attributes.publisherWidth,
					}}
				>
					<InputField
						{...{
							...props,
							label: __('Width', 'publisher-core'),
							settings: {
								type: 'css',
								unitType: 'essential',
								min: 0,
								defaultValue: '',
							},
							//
							onChange: (newValue) =>
								setAttributes({
									...attributes,
									publisherWidth: newValue,
								}),
						}}
					/>
				</ControlContextProvider>
			)}

			{isActiveField(publisherHeight) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props.blockName, 'height'),
						value: attributes.publisherHeight,
					}}
				>
					<InputField
						{...{
							...props,
							label: __('Height', 'publisher-core'),
							settings: {
								type: 'css',
								unitType: 'essential',
								min: 0,
								defaultValue: '',
							},
							//
							onChange: (newValue) =>
								setAttributes({
									...attributes,
									publisherHeight: newValue,
								}),
						}}
					/>
				</ControlContextProvider>
			)}

			{isActiveField(publisherOverflow) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props.blockName, 'overflow'),
						value: attributes.publisherOverflow,
					}}
				>
					<ToggleSelectField
						label={__('Overflow', 'publisher-core')}
						options={[
							{
								label: __('Visible', 'publisher-core'),
								value: 'visible',
								icon: <OverflowVisibleIcon />,
							},
							{
								label: __('Hidden', 'publisher-core'),
								value: 'hidden',
								icon: <OverflowHiddenIcon />,
							},
							{
								label: __('Scroll', 'publisher-core'),
								value: 'scroll',
								icon: <OverflowScrollIcon />,
							},
						]}
						//
						defaultValue="visible"
						onChange={(newValue) =>
							setAttributes({
								...attributes,
								publisherOverflow: newValue,
							})
						}
					/>
				</ControlContextProvider>
			)}
		</>
	);
}
