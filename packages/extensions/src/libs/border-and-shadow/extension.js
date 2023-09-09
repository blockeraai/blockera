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
	BorderRadiusControl,
	BoxBorderControl,
	BoxShadowControl,
	ControlContextProvider,
	OutlineControl,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { generateExtensionId, hasSameProps } from '../utils';

export const BorderAndShadowExtension = memo(
	({
		block,
		border,
		borderRadius,
		boxShadow,
		outline,
		config,
		children,
		handleOnChangeAttributes,
		...props
	}) => {
		const {
			borderAndShadowConfig: {
				publisherBoxShadow,
				publisherOutline,
				publisherBorder,
				publisherBorderRadius,
			},
		} = config;

		return (
			<>
				{isActiveField(publisherBorder) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'border'),
							value: border,
						}}
					>
						<BaseControl controlName="border" columns="columns-1">
							<BoxBorderControl
								label={__('Border Line', 'publisher-core')}
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherBorder',
										newValue
									)
								}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherBorderRadius) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'border-radius'),
							value: borderRadius,
						}}
					>
						<BaseControl
							columns="columns-1"
							controlName="border-radius"
						>
							<BorderRadiusControl
								label={__('Radius', 'publisher-core')}
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherBorderRadius',
										newValue
									)
								}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherBoxShadow) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'box-shadow'),
							value: boxShadow,
						}}
						storeName={'publisher-core/controls/repeater'}
					>
						<BaseControl
							controlName="box-shadow"
							columns="columns-1"
						>
							<BoxShadowControl
								label={__('Box Shadows', 'publisher-core')}
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherBoxShadow',
										newValue
									)
								}
								{...props}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherOutline) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'outline'),
							value: outline,
						}}
						storeName={'publisher-core/controls/repeater'}
					>
						<BaseControl controlName="outline" columns="columns-1">
							<OutlineControl
								label={__('Outline', 'publisher-core')}
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherOutline',
										newValue
									)
								}
								{...props}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				<div>{children}</div>
			</>
		);
	},
	hasSameProps
);
