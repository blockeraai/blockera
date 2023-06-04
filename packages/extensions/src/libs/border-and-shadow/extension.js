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
			{/* TODO: implements BorderField in next time! */}
			<div>{children}</div>
		</>
	);
}
