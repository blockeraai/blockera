/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { BoxShadowField } from '@publisher/fields';

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
						attribute: 'publisherBoxShadowItems',
						label: __('Box Shadow', 'publisher-core'),
					}}
				/>
			)}
			{/* TODO: implements BorderField in next time! */}
			<div>{children}</div>
		</>
	);
}
