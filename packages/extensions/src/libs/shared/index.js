/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { include } from '@publisher/utils';

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
import {
	FlexChildExtensionIcon,
	attributes as flexChildAttributes,
	supports as flexChildSupports,
} from '../flex-child';
import {
	AdvancedExtensionIcon,
	attributes as advancedAttributes,
	supports as advancedSupports,
} from '../advanced';
import { update } from '@publisher/data-extractor';

export const attributes = {
	...typographyAttributes,
	...backgroundAttributes,
	...borderAndShadowAttributes,
	...effectsAttributes,
	...spacingAttributes,
	...positionAttributes,
	...sizeAttributes,
	...layoutAttributes,
	...flexChildAttributes,
	...iconAttributes,
	...advancedAttributes,
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
	...flexChildSupports,
	...iconSupports,
	...advancedSupports,
};

export function SharedBlockExtension({
	children,
	attributes,
	setAttributes,
	...props
}) {
	const handleOnChangeAttributes = (attributeId, attributeValue, query) => {
		if (query) {
			setAttributes({
				...attributes,
				...update(attributes, query, attributeValue),
				[attributeId]: attributeValue,
			});

			return;
		}

		setAttributes({
			...attributes,
			[attributeId]: attributeValue,
		});
	};

	return (
		<>
			<BaseExtension
				{...props}
				values={include(attributes, [
					'publisherIcon',
					'publisherIconGap',
					'publisherIconSize',
					'publisherIconLink',
					'publisherIconColor',
					'publisherIconPosition',
				])}
				initialOpen={true}
				extensionId={'Icon'}
				title={__('Icon', 'publisher-core')}
				handleOnChangeAttributes={handleOnChangeAttributes}
				icon=<IconExtensionIcon />
			/>

			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'Spacing'}
				editorStyle={attributes.style}
				spacingValue={attributes.publisherSpacing}
				title={__('Spacing', 'publisher-core')}
				handleOnChangeAttributes={handleOnChangeAttributes}
				icon=<SpacingExtensionIcon />
			/>

			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'Position'}
				zIndexValue={attributes.publisherZIndex}
				positionValue={attributes.publisherPosition}
				title={__('Position', 'publisher-core')}
				handleOnChangeAttributes={handleOnChangeAttributes}
				icon=<PositionExtensionIcon />
			/>

			<BaseExtension
				{...{
					...props,
					...include(attributes, [
						'publisherWidth',
						'publisherHeight',
						'publisherOverflow',
					]),
				}}
				initialOpen={true}
				extensionId={'Size'}
				title={__('Size', 'publisher-core')}
				handleOnChangeAttributes={handleOnChangeAttributes}
				icon=<SizeExtensionIcon />
			/>

			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'FlexChild'}
				title={__('Flex Child', 'publisher-core')}
				values={include(attributes, [
					'publisherFlexChildGrow',
					'publisherFlexDirection',
					'publisherFlexChildAlign',
					'publisherFlexChildBasis',
					'publisherFlexChildOrder',
					'publisherFlexChildSizing',
					'publisherFlexChildShrink',
					'publisherFlexChildOrderCustom',
				])}
				handleOnChangeAttributes={handleOnChangeAttributes}
				icon=<FlexChildExtensionIcon />
			/>

			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'Layout'}
				title={__('Layout', 'publisher-core')}
				values={include(attributes, [
					'publisherGapRows',
					'publisherDisplay',
					'publisherFlexWrap',
					'publisherGapColumns',
					'publisherAlignItems',
					'publisherAlignContent',
					'publisherFlexDirection',
					'publisherJustifyContent',
				])}
				handleOnChangeAttributes={handleOnChangeAttributes}
				icon=<LayoutExtensionIcon />
			/>

			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'Typography'}
				title={__('Typography', 'publisher-core')}
				values={include(attributes, [
					'publisherFontSize',
					'publisherFontStyle',
					'publisherDirection',
					'publisherFontColor',
					'publisherWordBreak',
					'publisherTextIndent',
					'publisherTextIndent',
					'publisherTextShadow',
					'publisherLineHeight',
					'publisherWordSpacing',
					'publisherTextColumns',
					'publisherTextTransform',
					'publisherLetterSpacing',
					'publisherTextColumnsGap',
					'publisherTextDecoration',
					'publisherTextOrientation',
					'publisherTextStrokeWidth',
					'publisherTextStrokeColor',
					'publisherTextColumnsDividerWidth',
					'publisherTextColumnsDividerStyle',
					'publisherTextColumnsDividerColor',
				])}
				handleOnChangeAttributes={handleOnChangeAttributes}
				icon=<TypographyExtensionIcon />
			/>

			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'Background'}
				values={include(attributes, [
					'publisherBackground',
					'publisherBackgroundColor',
					'publisherBackgroundClip',
				])}
				handleOnChangeAttributes={handleOnChangeAttributes}
				title={__('Background', 'publisher-core')}
				icon=<BackgroundExtensionIcon />
			/>

			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'BorderAndShadow'}
				values={include(attributes, [
					'publisherBorder',
					'publisherOutline',
					'publisherBoxShadow',
					'publisherBorderRadius',
				])}
				handleOnChangeAttributes={handleOnChangeAttributes}
				title={__('Border And Shadow', 'publisher-core')}
				icon=<BorderAndShadowExtensionIcon />
			/>

			<BaseExtension
				{...props}
				initialOpen={true}
				extensionId={'Effects'}
				values={include(attributes, [
					'publisherFilter',
					'publisherCursor',
					'publisherOpacity',
					'publisherTransform',
					'publisherBlendMode',
					'publisherTransition',
					'publisherBackdropFilter',
					'publisherBackfaceVisibility',
					'publisherTransformSelfOrigin',
					'publisherTransformChildOrigin',
					'publisherTransformSelfPerspective',
					'publisherTransformChildPerspective',
				])}
				handleOnChangeAttributes={handleOnChangeAttributes}
				title={__('Effects', 'publisher-core')}
				icon=<EffectsExtensionIcon />
			/>

			<BaseExtension
				initialOpen={true}
				extensionId={'Advanced'}
				attributes={attributes.publisherAttributes}
				handleOnChangeAttributes={handleOnChangeAttributes}
				title={__('Advanced', 'publisher-core')}
				icon=<AdvancedExtensionIcon />
			/>

			{children}
		</>
	);
}
