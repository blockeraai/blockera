// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import {
	BaseControl,
	ControlContextProvider,
	InputControl,
	PositionButtonControl,
	useControlContext,
} from '@blockera/controls';

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
				'blockeraTransformChildPerspective',
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
				label={__('Child Perspective', 'blockera-core')}
				labelDescription={
					<>
						<p>
							{__(
								'It adds 3D effect by adding depth and distance for children blocks transformations, making elements appear to recede or come forward in 3D space.',
								'blockera-core'
							)}
						</p>
						<p>
							{__(
								'It enhances the realism of 3D transformations, making blocks like images, cards, and interactive graphics more dynamic and engaging.',
								'blockera-core'
							)}
						</p>
						<p>
							<b style={{ color: '#fff' }}>
								{__('Note:', 'blockera-core')}{' '}
							</b>
							{__(
								'This only applies to children blocks and does not affect this block. For applying to current block, use the "Self Perspective" setting.',
								'blockera-core'
							)}
						</p>
					</>
				}
				columns="1fr 130px"
				className={'blockera-transform-child-perspective'}
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
							'blockeraTransformChildPerspective',
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
						attribute: 'blockeraTransformChildOrigin',
						blockName: block.blockName,
					}}
				>
					<PositionButtonControl
						buttonLabel={__(
							'Child Perspective Origin',
							'blockera-core'
						)}
						popoverTitle={__(
							'Child Perspective Position',
							'blockera-core'
						)}
						alignmentMatrixLabel={__(
							'Child Origin',
							'blockera-core'
						)}
						size="small"
						defaultValue={transformChildOriginDefaultValue}
						onChange={({ top, left }, ref) => {
							handleOnChangeAttributes(
								'blockeraTransformChildOrigin',
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
