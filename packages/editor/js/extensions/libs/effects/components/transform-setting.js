// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	Popover,
	ConditionalWrapper,
	ToggleSelectControl,
	ControlContextProvider,
} from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { isShowField } from '../../../api/utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { generateExtensionId } from '../../utils';
import { SelfPerspective } from './self-perspective';
import { ChildPerspective } from './child-perspective';
import type { TEffectsExtensionConfig } from '../types/effects-props';
import { EditorFeatureWrapper } from '../../../../';

export const TransformSettings = ({
	block,
	handleOnChangeAttributes,
	values,
	attributes,
	extensionConfig,
	setIsTransformSettingsVisible,
	insidePopover = true,
}: {
	block: TBlockProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	values: {
		blockeraOpacity: string,
		blockeraTransform: Array<Object>,
		blockeraTransition: Array<Object>,
		blockeraFilter: Array<Object>,
		blockeraBackdropFilter: Array<Object>,
		blockeraTransformSelfPerspective: string,
		blockeraTransformSelfOrigin: {
			top: string,
			left: string,
		},
		blockeraBackfaceVisibility: string,
		blockeraTransformChildPerspective: string,
		blockeraTransformChildOrigin: {
			top: string,
			left: string,
		},
		blockeraMask: Array<Object>,
		blockeraDivider: Array<Object>,
	},
	attributes: {
		[key: string]: {
			type: string,
			default: any,
		},
	},
	extensionConfig: TEffectsExtensionConfig,
	setIsTransformSettingsVisible: (arg: boolean) => any,
	insidePopover?: boolean,
}): MixedElement => {
	const isShowSelfPerspective = isShowField(
		extensionConfig.blockeraTransformSelfPerspective,
		values?.blockeraTransformSelfPerspective,
		attributes.blockeraTransformSelfPerspective.default
	);

	const isShowBackfaceVisibility = isShowField(
		extensionConfig.blockeraBackfaceVisibility,
		values?.blockeraBackfaceVisibility,
		attributes.blockeraBackfaceVisibility.default
	);

	const isShowChildPerspective = isShowField(
		extensionConfig.blockeraTransformChildPerspective,
		values?.blockeraTransformChildPerspective,
		attributes.blockeraTransformChildPerspective.default
	);

	if (
		!isShowSelfPerspective &&
		!isShowBackfaceVisibility &&
		!isShowChildPerspective
	) {
		return <></>;
	}

	return (
		<ConditionalWrapper
			condition={insidePopover}
			wrapper={(children) => {
				return (
					<Popover
						title={
							<>
								<Icon icon="three-d" iconSize="20" />
								{__('Transform Settings', 'blockera')}
							</>
						}
						placement="left-start"
						className={controlInnerClassNames(
							'transform-settings-popover'
						)}
						onClose={() => {
							setIsTransformSettingsVisible(false);
						}}
						focusOnMount={false}
					>
						{children}
					</Popover>
				);
			}}
			elseWrapper={(children) => {
				return <>{children}</>;
			}}
		>
			<EditorFeatureWrapper
				isActive={isShowSelfPerspective}
				config={extensionConfig.blockeraTransformSelfPerspective}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'self-perspective'),
						value: values.blockeraTransformSelfPerspective,
						attribute: 'blockeraTransformSelfPerspective',
						blockName: block.blockName,
					}}
				>
					<SelfPerspective
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						transform={values.blockeraTransform}
						transformSelfOrigin={values.blockeraTransformSelfOrigin}
						transformSelfPerspectiveDefaultValue={
							attributes.blockeraTransformSelfPerspective.default
						}
						transformSelfOriginDefaultValue={
							attributes.blockeraTransformSelfOrigin.default
						}
					/>
				</ControlContextProvider>
			</EditorFeatureWrapper>

			<EditorFeatureWrapper
				isActive={isShowBackfaceVisibility}
				config={extensionConfig.blockeraBackfaceVisibility}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'backface-visibility'),
						value: values.blockeraBackfaceVisibility,
						attribute: 'blockeraBackfaceVisibility',
						blockName: block.blockName,
					}}
				>
					<ToggleSelectControl
						label={__('Backface Visibility', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'It sets whether the backside of a transformed block is visible when turned towards the viewer.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										"It controls the visibility of the element's reverse side during 3D transformations.",
										'blockera'
									)}
								</p>
							</>
						}
						columns="1fr 130px"
						options={[
							{
								label: __('Visible', 'blockera'),
								value: 'visible',
								icon: <Icon icon="eye-show" iconSize="20" />,
							},
							{
								label: __('Hidden', 'blockera'),
								value: 'hidden',
								icon: <Icon icon="eye-hide" iconSize="20" />,
							},
						]}
						defaultValue={
							attributes.blockeraBackfaceVisibility.default
						}
						onChange={(newValue, ref) =>
							handleOnChangeAttributes(
								'blockeraBackfaceVisibility',
								newValue,
								{ ref }
							)
						}
					/>
				</ControlContextProvider>
			</EditorFeatureWrapper>

			<EditorFeatureWrapper
				isActive={isShowChildPerspective}
				config={extensionConfig.blockeraTransformChildPerspective}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'child-perspective'),
						value: values.blockeraTransformChildPerspective,
						attribute: 'blockeraTransformChildPerspective',
						blockName: block.blockName,
					}}
				>
					<ChildPerspective
						block={block}
						handleOnChangeAttributes={handleOnChangeAttributes}
						transformChildPerspectiveDefaultValue={
							attributes.blockeraTransformChildPerspective.default
						}
						transformChildOrigin={
							values.blockeraTransformChildOrigin
						}
						transformChildOriginDefaultValue={
							attributes.blockeraTransformChildOrigin.default
						}
					/>
				</ControlContextProvider>
			</EditorFeatureWrapper>
		</ConditionalWrapper>
	);
};
