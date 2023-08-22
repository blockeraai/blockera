/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	BorderRadiusControl,
	BoxBorderControl,
	BoxShadowControl,
	ControlContextProvider,
	OutlineControl,
} from '@publisher/controls';

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
					<BaseControl controlName="border" columns="columns-1">
						<BoxBorderControl
							label={__('Border Line', 'publisher-core')}
							onChange={(newValue) =>
								setAttributes({
									...attributes,
									publisherBorder: newValue,
								})
							}
						/>
					</BaseControl>
				</ControlContextProvider>
			)}

			{isActiveField(publisherBorderRadius) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props, 'border-radius'),
						value: attributes.publisherBorderRadius,
					}}
				>
					<BaseControl
						columns="columns-1"
						controlName="border-radius"
					>
						<BorderRadiusControl
							label={__('Radius', 'publisher-core')}
							onChange={(newValue) => {
								setAttributes({
									...attributes,
									publisherBorderRadius: newValue,
								});
							}}
						/>
					</BaseControl>
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
					<BaseControl controlName="box-shadow" columns="columns-1">
						<BoxShadowControl
							label={__('Box Shadows', 'publisher-core')}
							onChange={(newValue) => {
								setAttributes({
									...attributes,
									publisherBoxShadow: newValue,
								});
							}}
							{...props}
						/>
					</BaseControl>
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
					<BaseControl controlName="outline" columns="columns-1">
						<OutlineControl
							label={__('Outline', 'publisher-core')}
							onChange={(newValue) => {
								setAttributes({
									...attributes,
									publisherOutline: newValue,
								});
							}}
							{...props}
						/>
					</BaseControl>
				</ControlContextProvider>
			)}

			<div>{children}</div>
		</>
	);
}
