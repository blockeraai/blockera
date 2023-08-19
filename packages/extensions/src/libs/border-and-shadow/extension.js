/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	BorderRadiusField,
	BoxBorderField,
	BoxShadowField,
	OutlineField,
} from '@publisher/fields';
import { ControlContextProvider } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../utils';
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';

export function BorderAndShadowExtension({ children, config, ...props }) {
	const {
		borderAndShadowConfig: {
			publisherBoxShadow,
			publisherOutline,
			publisherBorder,
			publisherBorderRadius,
		},
	} = config;

	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<>
			{isActiveField(publisherBorder) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props, 'border'),
						value: attributes.publisherBorder,
					}}
				>
					<BoxBorderField
						label={__('Border Line', 'publisher-core')}
						onChange={(newValue) =>
							setAttributes({
								...attributes,
								publisherBorder: newValue,
							})
						}
					/>
				</ControlContextProvider>
			)}

			{isActiveField(publisherBorderRadius) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props, 'border-radius'),
						value: attributes.publisherBorderRadius,
					}}
				>
					<BorderRadiusField
						label={__('Radius', 'publisher-core')}
						onChange={(newValue) => {
							setAttributes({
								...attributes,
								publisherBorderRadius: newValue,
							});
						}}
					/>
				</ControlContextProvider>
			)}

			{isActiveField(publisherBoxShadow) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props, 'box-shadow'),
						value: attributes.publisherBoxShadow,
					}}
					storeName={'publisher-core/controls/repeater'}
				>
					<BoxShadowField
						label={__('Box Shadows', 'publisher-core')}
						onChange={(newValue) => {
							setAttributes({
								...attributes,
								publisherBoxShadow: newValue,
							});
						}}
						{...props}
					/>
				</ControlContextProvider>
			)}

			{isActiveField(publisherOutline) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props, 'outline'),
						value: attributes.publisherOutline,
					}}
					storeName={'publisher-core/controls/repeater'}
				>
					<OutlineField
						label={__('Outline', 'publisher-core')}
						onChange={(newValue) => {
							setAttributes({
								...attributes,
								publisherOutline: newValue,
							});
						}}
						{...props}
					/>
				</ControlContextProvider>
			)}

			<div>{children}</div>
		</>
	);
}
