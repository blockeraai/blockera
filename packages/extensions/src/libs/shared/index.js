/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BaseExtension } from '../base';
import {
	attributes as backgroundAttributes,
	supports as backgroundSupports,
} from '../background';
import {
	attributes as borderAndShadowAttributes,
	supports as borderAndShadowSupports,
} from '../border-and-shadow';
import {
	attributes as effectsAttributes,
	supports as effectsSupports,
} from '../effects';
import {
	attributes as typographyAttributes,
	supports as typographySupports,
} from '../typography';

export const attributes = {
	...typographyAttributes,
	...backgroundAttributes,
	...borderAndShadowAttributes,
	...effectsAttributes,
};
export const supports = {
	...typographySupports,
	...backgroundSupports,
	...borderAndShadowSupports,
	...effectsSupports,
};

export function SharedBlockExtension({ children, ...props }) {
	return (
		<>
			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'Typography'}
				title={__('Typography', 'publisher-core')}
			/>

			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'Background'}
				title={__('Background', 'publisher-core')}
			/>

			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'BorderAndShadow'}
				title={__('Border And Shadow', 'publisher-core')}
			/>

			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'Effects'}
				title={__('Effects', 'publisher-core')}
			/>
			{children}
		</>
	);
}
