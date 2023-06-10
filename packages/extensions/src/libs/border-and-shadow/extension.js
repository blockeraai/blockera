/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { BoxShadowField, OutlineField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { BorderField } from '@publisher/fields/src/libs/border/field';

export function BorderAndShadowExtension({ children, config, ...props }) {
	const {
		borderAndShadowConfig: { publisherBoxShadow, publisherOutline },
	} = config;

	return (
		<>
			<BorderField label="Border" />

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
