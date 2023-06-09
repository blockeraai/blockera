/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { BoxShadowField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { BorderField } from '@publisher/fields/src/libs/border/field';

export function BorderAndShadowExtension({ children, config, ...props }) {
	const {
		borderAndShadowConfig: { boxShadow },
	} = config;

	return (
		<>
			{isActiveField(boxShadow) && (
				<BoxShadowField
					{...{
						...props,
						config: boxShadow,
						attribute: 'publisherBoxShadow',
						label: __('Box Shadow', 'publisher-core'),
					}}
				/>
			)}

			<BorderField label="Border" />

			<div>{children}</div>
		</>
	);
}
