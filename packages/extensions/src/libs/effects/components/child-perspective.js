// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	ControlContextProvider,
	convertAlignmentMatrixCoordinates,
	InputControl,
	PositionButtonControl,
	useControlContext,
} from '@publisher/controls';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export function ChildPerspective({
	block,
	handleOnChangeAttributes,
	transformChildOrigin,
}: {
	block: TBlockProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	transformChildOrigin: Object,
}): MixedElement {
	const { value, attribute, blockName, resetToDefault } = useControlContext({
		defaultValue: '',
		onChange: (newValue) =>
			handleOnChangeAttributes(
				'publisherTransformSelfPerspective',
				newValue
			),
	});

	const labelProps = {
		value,
		attribute,
		blockName,
		defaultValue: '',
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
				columns="columns-2"
				className={'publisher-transform-child-perspective'}
				{...labelProps}
			>
				<InputControl
					controlName="input"
					{...{
						unitType: 'essential',
						range: true,
						min: 0,
						max: 2000,
						defaultValue: '0px',
						onChange: (newValue) =>
							handleOnChangeAttributes(
								'publisherTransformChildPerspective',
								newValue
							),
					}}
					size="small"
				/>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'child-origin'),
						value: {
							...transformChildOrigin,
							coordinates:
								convertAlignmentMatrixCoordinates(
									transformChildOrigin
								)?.compact,
						},
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
							'Perspective Position',
							'publisher-core'
						)}
						alignmentMatrixLabel={__(
							'Child Origin',
							'publisher-core'
						)}
						size="small"
						defaultValue={{ top: '', left: '' }}
						onChange={({ top, left }) => {
							handleOnChangeAttributes(
								'publisherTransformChildOrigin',
								{
									...transformChildOrigin,
									top,
									left,
								}
							);
						}}
					/>
				</ControlContextProvider>
			</BaseControl>
		</>
	);
}
