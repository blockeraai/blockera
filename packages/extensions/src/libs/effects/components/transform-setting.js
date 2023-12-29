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
	BaseControl,
	InputControl,
	ToggleSelectControl,
	ControlContextProvider,
	convertAlignmentMatrixCoordinates,
	PositionButtonControl,
	NoticeControl,
} from '@publisher/controls';
import { Popover } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';
import { checkVisibleItemLength } from '@publisher/utils';
/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { generateExtensionId } from '../../utils';

export const TransformSettings = ({
	setIsTransformSettingsVisible,
	transformSelfPerspective,
	block,
	handleOnChangeAttributes,
	backfaceVisibility,
	transformChildPerspective,
	props,
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
	const visibleTransformLength = checkVisibleItemLength(transform);

	return (
		<Popover
			title={__('Transform Settings', 'publisher-core')}
			offset={35}
			placement="left-start"
			className={controlInnerClassNames('transform-settings-popover')}
			onClose={() => {
				setIsTransformSettingsVisible(false);
			}}
		>
			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'self-perspective'),
					value: transformSelfPerspective,
					attribute: 'publisherTransformSelfPerspective',
					blockName: block.blockName,
				}}
			>
				<BaseControl columns="column-1">
					<BaseControl
						label={__('Self Perspective', 'publisher-core')}
						columns="columns-2"
						className={`publisher-transform-self-perspective ${
							!visibleTransformLength &&
							'publisher-control-is-not-active'
						}`}
					>
						<InputControl
							controlName="input"
							{...{
								...props,
								unitType: 'essential',
								range: true,
								min: 0,
								max: 2000,
								initialPosition: 100,
								defaultValue: '0px',
								onChange: (newValue) =>
									handleOnChangeAttributes(
										'publisherTransformSelfPerspective',
										newValue
									),
							}}
							size="small"
						/>
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'self-origin'),
								value: {
									...transformSelfOrigin,
									coordinates:
										convertAlignmentMatrixCoordinates(
											transformSelfOrigin
										)?.compact,
								},
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
									'Perspective Position',
									'publisher-core'
								)}
								alignmentMatrixLabel={__(
									'Self Origin',
									'publisher-core'
								)}
								size="small"
								defaultValue={{ top: '', left: '' }}
								onChange={({ top, left }) => {
									handleOnChangeAttributes(
										'publisherTransformSelfOrigin',
										{
											...transformSelfOrigin,
											top,
											left,
										}
									);
								}}
							/>
						</ControlContextProvider>
					</BaseControl>
					{!visibleTransformLength && (
						<NoticeControl type="warning">
							{__(
								`For using Self Perspective your block should have at least one transform.`,
								'publisher-core'
							)}
						</NoticeControl>
					)}
				</BaseControl>
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
				<BaseControl
					label={__('Child Perspective', 'publisher-core')}
					columns="columns-2"
					className={'publisher-transform-child-perspective'}
				>
					<InputControl
						controlName="input"
						{...{
							...props,
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
			</ControlContextProvider>
		</Popover>
	);
};
