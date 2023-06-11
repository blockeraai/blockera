/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
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
		},
	} = config;

	const { attributes, setAttributes } = useContext(BlockEditContext);

	console.log('attributes.publisherBorder', attributes.publisherBorder);
	return (
		<>
			{isActiveField(publisherBorder) && (
				<BoxBorderField
					label={__('Border Line', 'publisher-core')}
					value={attributes.publisherBorder}
					onValueChange={(newValue) => {
						console.log(newValue);
						setAttributes({
							...attributes,
							publisherBorder: newValue,
						});
					}}
				/>
			)}

			{isActiveField(publisherBoxShadow) && (
				<BoxShadowField
					{...{
						...props,
						config: publisherBoxShadow,
						attribute: 'publisherBoxShadow',
						label: __('Box Shadows', 'publisher-core'),
					}}
				/>
			)}

			{isActiveField(publisherOutline) && (
				<OutlineField
					{...{
						...props,
						config: publisherOutline,
						attribute: 'publisherOutline',
						label: __('Outlines', 'publisher-core'),
					}}
				/>
			)}

			<div>{children}</div>
		</>
	);
}
