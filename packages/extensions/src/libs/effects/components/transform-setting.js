// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	ToggleSelectControl,
	ControlContextProvider,
} from '@publisher/controls';
import { Popover } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

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
		publisherOpacity: string,
		publisherTransform: Array<Object>,
		publisherTransition: Array<Object>,
		publisherFilter: Array<Object>,
		publisherBlendMode: string,
		publisherBackdropFilter: Array<Object>,
		publisherTransformSelfPerspective: string,
		publisherTransformSelfOrigin: {
			top: string,
			left: string,
		},
		publisherBackfaceVisibility: string,
		publisherTransformChildPerspective: string,
		publisherTransformChildOrigin: {
			top: string,
			left: string,
		},
		publisherDivider: Array<Object>,
		publisherMask: Array<Object>,
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
			title={__('Transform Settings', 'publisher-core')}
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
					value: values.publisherTransformSelfPerspective,
					attribute: 'publisherTransformSelfPerspective',
					blockName: block.blockName,
				}}
			>
				<SelfPerspective
					block={block}
					handleOnChangeAttributes={handleOnChangeAttributes}
					transform={values.publisherTransform}
					transformSelfOrigin={values.publisherTransformSelfOrigin}
					transformSelfPerspectiveDefaultValue={
						attributes.publisherTransformSelfPerspective.default
					}
					transformSelfOriginDefaultValue={
						attributes.publisherTransformSelfOrigin.default
					}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'backface-visibility'),
					value: values.publisherBackfaceVisibility,
					attribute: 'publisherBackfaceVisibility',
					blockName: block.blockName,
				}}
			>
				<ToggleSelectControl
					controlName="toggle-select"
					label={__('Backface Visibility', 'publisher-core')}
					labelDescription={
						<>
							<p>
								{__(
									'It sets whether the backside of a transformed block is visible when turned towards the viewer.',
									'publisher-core'
								)}
							</p>
							<p>
								{__(
									"It controls the visibility of the element's reverse side during 3D transformations.",
									'publisher-core'
								)}
							</p>
						</>
					}
					columns="1fr 130px"
					options={[
						{
							label: __('Visible', 'publisher-core'),
							value: 'visible',
						},
						{
							label: __('Hidden', 'publisher-core'),
							value: 'hidden',
						},
					]}
					defaultValue={
						attributes.publisherBackfaceVisibility.default
					}
					onChange={(newValue, ref) =>
						handleOnChangeAttributes(
							'publisherBackfaceVisibility',
							newValue,
							{ ref }
						)
					}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'child-perspective'),
					value: values.publisherTransformChildPerspective,
					attribute: 'publisherTransformChildPerspective',
					blockName: block.blockName,
				}}
			>
				<ChildPerspective
					block={block}
					handleOnChangeAttributes={handleOnChangeAttributes}
					transformChildPerspectiveDefaultValue={
						attributes.publisherTransformChildPerspective.default
					}
					transformChildOrigin={values.publisherTransformChildOrigin}
					transformChildOriginDefaultValue={
						attributes.publisherTransformChildOrigin.default
					}
				/>
			</ControlContextProvider>
		</Popover>
	);
};
