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
	NoticeControl,
	PositionButtonControl,
	useControlContext,
} from '@blockera/controls';
import { checkVisibleItemLength } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export function SelfPerspective({
	block,
	handleOnChangeAttributes,
	transform,
	transformSelfOrigin,
	transformSelfPerspectiveDefaultValue,
	transformSelfOriginDefaultValue,
}: {
	block: TBlockProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	transform: Array<Object>,
	transformSelfOrigin: Object,
	transformSelfPerspectiveDefaultValue: string,
	transformSelfOriginDefaultValue: Object,
}): MixedElement {
	const visibleTransformLength = checkVisibleItemLength(transform);

	const { value, attribute, blockName, resetToDefault } = useControlContext({
		defaultValue: transformSelfPerspectiveDefaultValue,
		onChange: (newValue, ref) =>
			handleOnChangeAttributes(
				'blockeraTransformSelfPerspective',
				newValue,
				{ ref }
			),
	});

	const labelProps = {
		value,
		attribute,
		blockName,
		defaultValue: transformSelfPerspectiveDefaultValue,
		resetToDefault,
		mode: 'advanced',
		path: attribute,
	};

	return (
		<>
			<BaseControl columns="column-1">
				<BaseControl
					label={__('Self Perspective', 'blockera-core')}
					labelDescription={
						<>
							<p>
								{__(
									'It adds 3D effect by adding depth and distance for current block transformations, making elements appear to recede or come forward in 3D space.',
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
									'This only applies to current block and does not affect child blocks. For applying to child blocks, use the "Child Perspective" setting.',
									'blockera-core'
								)}
							</p>
						</>
					}
					columns="1fr 130px"
					className={`blockera-transform-self-perspective ${
						!visibleTransformLength
							? 'blockera-control-is-not-active'
							: ''
					}`}
					{...labelProps}
				>
					<InputControl
						controlName="input"
						unitType={'essential'}
						min={0}
						max={2000}
						defaultValue={transformSelfPerspectiveDefaultValue}
						onChange={(newValue, ref) =>
							handleOnChangeAttributes(
								'blockeraTransformSelfPerspective',
								newValue,
								{ ref }
							)
						}
						size="small"
					/>

					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'self-origin'),
							value: transformSelfOrigin,
							attribute: 'blockeraTransformSelfOrigin',
							blockName: block.blockName,
						}}
					>
						<PositionButtonControl
							buttonLabel={__(
								'Self Perspective Origin',
								'blockera-core'
							)}
							popoverTitle={__(
								'Self Perspective Position',
								'blockera-core'
							)}
							alignmentMatrixLabel={__(
								'Self Origin',
								'blockera-core'
							)}
							size="small"
							defaultValue={transformSelfOriginDefaultValue}
							onChange={({ top, left }, ref) => {
								handleOnChangeAttributes(
									'blockeraTransformSelfOrigin',
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

				{!visibleTransformLength && (
					<NoticeControl type="warning">
						{__(
							`For using Self Perspective the block should have at least one transformation.`,
							'blockera-core'
						)}
					</NoticeControl>
				)}
			</BaseControl>
		</>
	);
}
