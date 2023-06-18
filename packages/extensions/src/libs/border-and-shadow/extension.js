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

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { BlockEditContext } from '../../hooks';

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
				<BoxBorderField
					label={__('Border Line', 'publisher-core')}
					value={attributes.publisherBorder}
					onValueChange={(newValue) => {
						setAttributes({
							...attributes,
							publisherBorder: newValue,
						});
					}}
				/>
			)}

			{isActiveField(publisherBorderRadius) && (
				<BorderRadiusField
					label={__('Radius', 'publisher-core')}
					value={attributes.publisherBorderRadius}
					onValueChange={(newValue) => {
						setAttributes({
							...attributes,
							publisherBorderRadius: newValue,
						});
					}}
				/>
			)}

			{isActiveField(publisherBoxShadow) && (
				<BoxShadowField
					label={__('Box Shadows', 'publisher-core')}
					value={attributes.publisherBoxShadow}
					onValueChange={(newValue) => {
						setAttributes({
							...attributes,
							publisherBoxShadow: newValue,
						});
					}}
					{...props}
				/>
			)}

			{isActiveField(publisherOutline) && (
				<OutlineField
					label={__('Outline', 'publisher-core')}
					value={attributes.publisherOutline}
					onValueChange={(newValue) => {
						setAttributes({
							...attributes,
							publisherOutline: newValue,
						});
					}}
					{...props}
				/>
			)}

			<div>{children}</div>
		</>
	);
}
