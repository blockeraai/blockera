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
	NoticeControl,
	PositionButtonControl,
	useControlContext,
} from '@publisher/controls';
import { checkVisibleItemLength } from '@publisher/utils';

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
				'publisherTransformSelfPerspective',
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
					label={__('Self Perspective', 'publisher-core')}
					labelDescription={
						<>
							<p>
								{__(
									'It adds 3D effect by adding depth and distance for current block transformations, making elements appear to recede or come forward in 3D space.',
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
									'This only applies to current block and does not affect child blocks. For applying to child blocks, use the "Child Perspective" setting.',
									'publisher-core'
								)}
							</p>
						</>
					}
					columns="1fr 130px"
					className={`publisher-transform-self-perspective ${
						!visibleTransformLength
							? 'publisher-control-is-not-active'
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
								'publisherTransformSelfPerspective',
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
							attribute: 'publisherTransformSelfOrigin',
							blockName: block.blockName,
						}}
					>
						<PositionButtonControl
							buttonLabel={__(
								'Self Perspective Origin',
								'publisher-core'
							)}
							popoverTitle={__(
								'Self Perspective Position',
								'publisher-core'
							)}
							alignmentMatrixLabel={__(
								'Self Origin',
								'publisher-core'
							)}
							size="small"
							defaultValue={transformSelfOriginDefaultValue}
							onChange={({ top, left }, ref) => {
								handleOnChangeAttributes(
									'publisherTransformSelfOrigin',
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
							'publisher-core'
						)}
					</NoticeControl>
				)}
			</BaseControl>
		</>
	);
}
