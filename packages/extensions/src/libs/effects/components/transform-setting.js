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
	setIsTransformSettingsVisible,
	transformSelfPerspective,
	block,
	handleOnChangeAttributes,
	backfaceVisibility,
	transformChildPerspective,
	transformChildOrigin,
	transformSelfOrigin,
	transform,
}: {
	setIsTransformSettingsVisible: (arg: boolean) => any,
	transformSelfPerspective: string | void,
	block: TBlockProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	backfaceVisibility: string | void,
	transformChildPerspective: string | void,
	props: Object,
	transformChildOrigin: Object,
	transformSelfOrigin: Object,
	transform: Array<Object>,
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
					value: transformSelfPerspective,
					attribute: 'publisherTransformSelfPerspective',
					blockName: block.blockName,
				}}
			>
				<SelfPerspective
					block={block}
					handleOnChangeAttributes={handleOnChangeAttributes}
					transform={transform}
					transformSelfOrigin={transformSelfOrigin}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'backface-visibility'),
					value: backfaceVisibility,
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
					columns="columns-2"
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
					defaultValue="visible"
					onChange={(newValue) =>
						handleOnChangeAttributes(
							'publisherBackfaceVisibility',
							newValue
						)
					}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'child-perspective'),
					value: transformChildPerspective
						? transformChildPerspective
						: '0px',
					attribute: 'publisherTransformChildPerspective',
					blockName: block.blockName,
				}}
			>
				<ChildPerspective
					block={block}
					transformChildOrigin={transformChildOrigin}
					handleOnChangeAttributes={handleOnChangeAttributes}
				/>
			</ControlContextProvider>
		</Popover>
	);
};
