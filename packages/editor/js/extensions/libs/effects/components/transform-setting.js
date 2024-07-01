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
	ToggleSelectControl,
	ControlContextProvider,
} from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { generateExtensionId } from '../../utils';
import { SelfPerspective } from './self-perspective';
import { ChildPerspective } from './child-perspective';

export const TransformSettings = ({
	block,
	handleOnChangeAttributes,
	values,
	attributes,
	setIsTransformSettingsVisible,
}: {
	block: TBlockProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	values: {
		blockeraOpacity: string,
		blockeraTransform: Array<Object>,
		blockeraTransition: Array<Object>,
		blockeraFilter: Array<Object>,
		blockeraBlendMode: string,
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
	setIsTransformSettingsVisible: (arg: boolean) => any,
}): MixedElement => {
	return (
		<Popover
			title={__('Transform Settings', 'blockera')}
			offset={35}
			placement="left-start"
			className={controlInnerClassNames('transform-settings-popover')}
			onClose={() => {
				setIsTransformSettingsVisible(false);
			}}
			focusOnMount={false}
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

			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'backface-visibility'),
					value: values.blockeraBackfaceVisibility,
					attribute: 'blockeraBackfaceVisibility',
					blockName: block.blockName,
				}}
			>
				<ToggleSelectControl
					controlName="toggle-select"
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
						},
						{
							label: __('Hidden', 'blockera'),
							value: 'hidden',
						},
					]}
					defaultValue={attributes.blockeraBackfaceVisibility.default}
					onChange={(newValue, ref) =>
						handleOnChangeAttributes(
							'blockeraBackfaceVisibility',
							newValue,
							{ ref }
						)
					}
				/>
			</ControlContextProvider>

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
					transformChildOrigin={values.blockeraTransformChildOrigin}
					transformChildOriginDefaultValue={
						attributes.blockeraTransformChildOrigin.default
					}
				/>
			</ControlContextProvider>
		</Popover>
	);
};
