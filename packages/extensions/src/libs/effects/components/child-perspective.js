// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	ControlContextProvider,
	InputControl,
	PositionButtonControl,
	useControlContext,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export function ChildPerspective({
	block,
	handleOnChangeAttributes,
	transformChildOrigin,
	transformChildPerspectiveDefaultValue,
	transformChildOriginDefaultValue,
}: {
	block: TBlockProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	transformChildOrigin: Object,
	transformChildPerspectiveDefaultValue: string,
	transformChildOriginDefaultValue: Object,
}): MixedElement {
	const { value, attribute, blockName, resetToDefault } = useControlContext({
		defaultValue: transformChildPerspectiveDefaultValue,
		onChange: (newValue, ref) =>
			handleOnChangeAttributes(
				'publisherTransformChildPerspective',
				newValue,
				{ ref }
			),
	});

	const labelProps = {
		value,
		attribute,
		blockName,
		defaultValue: transformChildPerspectiveDefaultValue,
		resetToDefault,
		mode: 'advanced',
		path: attribute,
	};

	return (
		<>
			<BaseControl
				label={__('Child Perspective', 'publisher-core')}
				labelDescription={
					<>
						<p>
							{__(
								'It adds 3D effect by adding depth and distance for children blocks transformations, making elements appear to recede or come forward in 3D space.',
								'publisher-core'
							)}
						</p>
						<p>
							{__(
								'It enhances the realism of 3D transformations, making blocks like images, cards, and interactive graphics more dynamic and engaging.',
								'publisher-core'
							)}
						</p>
						<p>
							<b style={{ color: '#fff' }}>
								{__('Note:', 'publisher-core')}{' '}
							</b>
							{__(
								'This only applies to children blocks and does not affect this block. For applying to current block, use the "Self Perspective" setting.',
								'publisher-core'
							)}
						</p>
					</>
				}
				columns="1fr 130px"
				className={'publisher-transform-child-perspective'}
				{...labelProps}
			>
				<InputControl
					controlName="input"
					unitType={'essential'}
					min={0}
					max={2000}
					defaultValue={transformChildPerspectiveDefaultValue}
					onChange={(newValue, ref) =>
						handleOnChangeAttributes(
							'publisherTransformChildPerspective',
							newValue,
							{ ref }
						)
					}
					size="small"
				/>

				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'child-origin'),
						value: transformChildOrigin,
						attribute: 'publisherTransformChildOrigin',
						blockName: block.blockName,
					}}
				>
					<PositionButtonControl
						buttonLabel={__(
							'Child Perspective Origin',
							'publisher-core'
						)}
						popoverTitle={__(
							'Child Perspective Position',
							'publisher-core'
						)}
						alignmentMatrixLabel={__(
							'Child Origin',
							'publisher-core'
						)}
						size="small"
						defaultValue={transformChildOriginDefaultValue}
						onChange={({ top, left }, ref) => {
							handleOnChangeAttributes(
								'publisherTransformChildOrigin',
								{
									top,
									left,
								},
								{ ref }
							);
						}}
					/>
				</ControlContextProvider>
			</BaseControl>
		</>
	);
}
