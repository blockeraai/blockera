// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { Node, MixedElement } from 'react';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Publisher dependencies
 */
import { include } from '@publisher/utils';
import { Tabs } from '@publisher/components';

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
import extensions from './extensions.json';
import { useAttributes } from './use-attributes';

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

type Props = {
	children?: Node,
	attributes: Object,
	setAttributes: (attributes: Object) => void,
};

export function SharedBlockExtension({
	children,
	attributes,
	setAttributes,
	...props
}: Props): MixedElement {
	const { handleOnChangeAttributes } = useAttributes(
		attributes,
		setAttributes
	);
	const {
		size,
		layout,
		effects,
		flexChild,
		typography,
		background,
		borderAndShadow,
		icon,
	} = extensions;

	props = { ...props, attributes };

	const MappedExtensions = (tab: {
		name: string,
		title: string,
		className: string,
	}): MixedElement => {
		switch (tab.name) {
			case 'general':
				return (
					<>
						<BaseExtension
							{...props}
							values={include(attributes, icon, 'publisher')}
							initialOpen={true}
							extensionId={'Icon'}
							title={__('Icon', 'publisher-core')}
							handleOnChangeAttributes={handleOnChangeAttributes}
							icon={<IconExtensionIcon />}
						/>
					</>
				);
			case 'style':
				return (
					<>
						<BaseExtension
							{...props}
							initialOpen={true}
							extensionId={'Spacing'}
							defaultValue={attributes.style?.spacing || {}}
							spacingValue={attributes.publisherSpacing}
							title={__('Spacing', 'publisher-core')}
							handleOnChangeAttributes={handleOnChangeAttributes}
							icon={<SpacingExtensionIcon />}
						/>

						<BaseExtension
							{...props}
							initialOpen={true}
							extensionId={'Position'}
							zIndexValue={attributes.publisherZIndex}
							positionValue={attributes.publisherPosition}
							title={__('Position', 'publisher-core')}
							handleOnChangeAttributes={handleOnChangeAttributes}
							icon={<PositionExtensionIcon />}
						/>

						<BaseExtension
							{...{
								...props,
								...include(attributes, size, 'publisher'),
							}}
							defaultValue={{
								width:
									attributes.width ||
									attributes.publisherWidth,
								height:
									attributes.height ||
									attributes.publisherHeight,
								overflow: attributes.publisherOverflow,
							}}
							initialOpen={true}
							extensionId={'Size'}
							title={__('Size', 'publisher-core')}
							handleOnChangeAttributes={handleOnChangeAttributes}
							icon={<SizeExtensionIcon />}
						/>

						<BaseExtension
							{...props}
							initialOpen={true}
							extensionId={'FlexChild'}
							title={__('Flex Child', 'publisher-core')}
							values={include(attributes, flexChild, 'publisher')}
							handleOnChangeAttributes={handleOnChangeAttributes}
							icon={<FlexChildExtensionIcon />}
						/>

						<BaseExtension
							{...props}
							initialOpen={true}
							extensionId={'Layout'}
							title={__('Layout', 'publisher-core')}
							values={include(attributes, layout, 'publisher')}
							defaultValue={attributes.layout || {}}
							handleOnChangeAttributes={handleOnChangeAttributes}
							icon={<LayoutExtensionIcon />}
						/>

						<BaseExtension
							{...props}
							initialOpen={true}
							extensionId={'Typography'}
							title={__('Typography', 'publisher-core')}
							values={include(
								attributes,
								typography,
								'publisher'
							)}
							defaultValue={{
								fontSize:
									attributes.fontSize ||
									attributes.publisherFontSize,
								typography: attributes.style?.typography || {},
							}}
							handleOnChangeAttributes={handleOnChangeAttributes}
							icon={<TypographyExtensionIcon />}
						/>

						<BaseExtension
							{...props}
							initialOpen={true}
							extensionId={'Background'}
							values={include(
								attributes,
								background,
								'publisher'
							)}
							defaultValue={attributes.style?.background || {}}
							handleOnChangeAttributes={handleOnChangeAttributes}
							title={__('Background', 'publisher-core')}
							icon={<BackgroundExtensionIcon />}
						/>

						<BaseExtension
							{...props}
							initialOpen={true}
							extensionId={'BorderAndShadow'}
							values={include(
								attributes,
								borderAndShadow,
								'publisher'
							)}
							handleOnChangeAttributes={handleOnChangeAttributes}
							defaultValue={{
								borderColor: attributes?.borderColor || '',
								border: attributes.style?.border || {},
							}}
							title={__('Border And Shadow', 'publisher-core')}
							icon={<BorderAndShadowExtensionIcon />}
						/>

						<BaseExtension
							{...props}
							initialOpen={true}
							extensionId={'Effects'}
							values={include(attributes, effects, 'publisher')}
							handleOnChangeAttributes={handleOnChangeAttributes}
							title={__('Effects', 'publisher-core')}
							icon={<EffectsExtensionIcon />}
						/>

						<BaseExtension
							initialOpen={true}
							extensionId={'Advanced'}
							attributes={attributes.publisherAttributes}
							handleOnChangeAttributes={handleOnChangeAttributes}
							title={__('Advanced', 'publisher-core')}
							icon={<AdvancedExtensionIcon />}
						/>
					</>
				);
		}

		return <></>;
	};

	const tabs = [
		{
			name: 'general',
			title: __('General', 'publisher-core'),
			className: 'general-tab',
			icon: {
				library: 'publisher',
				name: 'publisherSettings',
			},
		},
		{
			name: 'style',
			title: __('Style', 'publisher-core'),
			className: 'style-tab',
			icon: {
				library: 'wp',
				name: 'styles',
			},
		},
	];

	return (
		<>
			<InspectorControls>
				<Tabs tabs={tabs} getPanel={MappedExtensions} />
				{children}
			</InspectorControls>
		</>
	);
}
