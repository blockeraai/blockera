/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BaseExtension } from '../base';
import {
	BackgroundExtensionIcon,
	attributes as backgroundAttributes,
	supports as backgroundSupports,
} from '../background';
import {
	IconExtensionIcon,
	attributes as iconAttributes,
	supports as iconSupports,
} from '../icon';
import {
	BorderAndShadowExtensionIcon,
	attributes as borderAndShadowAttributes,
	supports as borderAndShadowSupports,
} from '../border-and-shadow';
import {
	EffectsExtensionIcon,
	attributes as effectsAttributes,
	supports as effectsSupports,
} from '../effects';
import {
	TypographyExtensionIcon,
	attributes as typographyAttributes,
	supports as typographySupports,
} from '../typography';
import {
	SpacingExtensionIcon,
	attributes as spacingAttributes,
	supports as spacingSupports,
} from '../spacing';
import {
	PositionExtensionIcon,
	attributes as positionAttributes,
	supports as positionSupports,
} from '../position';
import {
	SizeExtensionIcon,
	attributes as sizeAttributes,
	supports as sizeSupports,
} from '../size';
import {
	LayoutExtensionIcon,
	attributes as layoutAttributes,
	supports as layoutSupports,
} from '../layout';

export const attributes = {
	...typographyAttributes,
	...backgroundAttributes,
	...borderAndShadowAttributes,
	...effectsAttributes,
	...spacingAttributes,
	...positionAttributes,
	...sizeAttributes,
	...layoutAttributes,
	...iconAttributes,
};
export const supports = {
	...typographySupports,
	...backgroundSupports,
	...borderAndShadowSupports,
	...effectsSupports,
	...spacingSupports,
	...positionSupports,
	...sizeSupports,
	...layoutSupports,
	...iconSupports,
};

export function SharedBlockExtension({ children, ...props }) {
	return (
		<>
			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'Spacing'}
				title={__('Spacing', 'publisher-core')}
				icon=<SpacingExtensionIcon />
			/>

			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'Position'}
				title={__('Position', 'publisher-core')}
				icon=<PositionExtensionIcon />
			/>

			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'Size'}
				title={__('Size', 'publisher-core')}
				icon=<SizeExtensionIcon />
			/>

			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'Layout'}
				title={__('Layout', 'publisher-core')}
				icon=<LayoutExtensionIcon />
			/>

			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'Typography'}
				title={__('Typography', 'publisher-core')}
				icon=<TypographyExtensionIcon />
			/>

			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'Background'}
				title={__('Background', 'publisher-core')}
				icon=<BackgroundExtensionIcon />
			/>

			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'BorderAndShadow'}
				title={__('Border And Shadow', 'publisher-core')}
				icon=<BorderAndShadowExtensionIcon />
			/>

			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'Effects'}
				title={__('Effects', 'publisher-core')}
				icon=<EffectsExtensionIcon />
			/>

			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'Icon'}
				title={__('Icon', 'publisher-core')}
				icon=<IconExtensionIcon />
			/>

			{children}
		</>
	);
}
