// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { default as MoveIcon } from '../icons/move';
import { default as SkewIcon } from '../icons/skew';
import { useControlContext } from '../../../context';
import { default as ScaleIcon } from '../icons/scale';
import { default as RotateIcon } from '../icons/rotate';
import { RepeaterContext } from '../../repeater-control/context';
import { default as XCoordinateIcon } from '../icons/coordinate-x';
import { default as YCoordinateIcon } from '../icons/coordinate-y';
import { default as ZCoordinateIcon } from '../icons/coordinate-z';
import { InputControl, ToggleSelectControl } from '../../index';
import { default as RotateXCoordinateIcon } from '../icons/coordinate-rotate-x';
import { default as RotateYCoordinateIcon } from '../icons/coordinate-rotate-y';
import { default as RotateZCoordinateIcon } from '../icons/coordinate-rotate-z';
import type { TransformControlRepeaterItemValue } from '../types';
import { LabelDescription } from './label-description';

const Fields = ({
	itemId,
	item,
}: {
	itemId: number,
	item: TransformControlRepeaterItemValue,
}) => {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const { repeaterId, getControlId, defaultRepeaterItemValue } =
		useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<ToggleSelectControl
				repeaterItem={itemId}
				id={getControlId(itemId, 'type')}
				singularId={'type'}
				label={__('Type', 'publisher-core')}
				labelPopoverTitle={__('Transform Type', 'publisher-core')}
				labelDescription={<LabelDescription />}
				columns="columns-2"
				options={[
					{
						label: __('Move', 'publisher-core'),
						value: 'move',
						icon: <MoveIcon />,
					},
					{
						label: __('Scale', 'publisher-core'),
						value: 'scale',
						icon: <ScaleIcon />,
					},
					{
						label: __('Rotate', 'publisher-core'),
						value: 'rotate',
						icon: <RotateIcon />,
					},
					{
						label: __('Skew', 'publisher-core'),
						value: 'skew',
						icon: <SkewIcon />,
					},
				]}
				onChange={(type) =>
					changeRepeaterItem({
						controlId,
						repeaterId,
						itemId,
						value: { ...item, type },
					})
				}
				defaultValue={defaultRepeaterItemValue.type}
			/>

			{item.type === 'move' && (
				<>
					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'move-x')}
						singularId={'move-x'}
						label={<XCoordinateIcon />}
						labelPopoverTitle={__(
							'Move Horizontally',
							'publisher-core'
						)}
						labelDescription={
							<>
								<p>
									{__(
										'It moves the block horizontally (right/left).',
										'publisher-core'
									)}
								</p>
							</>
						}
						aria-label={__('Move-X', 'publisher-core')}
						columns="columns-2"
						unitType="essential"
						range={true}
						min={-300}
						max={300}
						onChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, 'move-x': newValue },
							})
						}
						defaultValue={defaultRepeaterItemValue['move-x']}
					/>

					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'move-y')}
						singularId={'move-y'}
						label={<YCoordinateIcon />}
						labelPopoverTitle={__(
							'Move Vertically',
							'publisher-core'
						)}
						labelDescription={
							<>
								<p>
									{__(
										'It moves the block horizontally (up/down).',
										'publisher-core'
									)}
								</p>
							</>
						}
						aria-label={__('Move-Y', 'publisher-core')}
						columns="columns-2"
						unitType="essential"
						range={true}
						min={-300}
						max={300}
						onChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, 'move-y': newValue },
							})
						}
						defaultValue={defaultRepeaterItemValue['move-y']}
					/>

					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'move-z')}
						singularId={'move-z'}
						label={<ZCoordinateIcon />}
						labelPopoverTitle={__(
							'Move Depth Axis',
							'publisher-core'
						)}
						labelDescription={
							<>
								<p>
									{__(
										'It moves it along the depth axis (towards/away from the viewer).',
										'publisher-core'
									)}
								</p>
								<p>
									{__(
										'Ideal for creating depth effects like parallax scrolling, pop-out animations, and 3D transformations.',
										'publisher-core'
									)}
								</p>
								<p>
									{__(
										'Requires setting the perspective property on the block or parent to enable 3D space.',
										'publisher-core'
									)}
								</p>
							</>
						}
						aria-label={__('Move-Z', 'publisher-core')}
						columns="columns-2"
						unitType="essential"
						range={true}
						min={-300}
						max={300}
						onChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, 'move-z': newValue },
							})
						}
						defaultValue={defaultRepeaterItemValue['move-z']}
					/>
				</>
			)}

			{item.type === 'scale' && (
				<>
					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'scale')}
						singularId={'scale'}
						label={__('Scale', 'publisher-core')}
						labelDescription={
							<>
								<p>
									{__(
										'It changes the size of the block.',
										'publisher-core'
									)}
								</p>
								<p>
									{__(
										"It's used in animations for emphasis, hover effects, and creating visual interest.",
										'publisher-core'
									)}
								</p>
							</>
						}
						columns="columns-2"
						unitType="percent"
						range={true}
						min={0}
						max={200}
						onChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, scale: newValue },
							})
						}
						defaultValue={defaultRepeaterItemValue.scale}
					/>
				</>
			)}

			{item.type === 'rotate' && (
				<>
					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'rotate-x')}
						singularId={'rotate-x'}
						label={<RotateXCoordinateIcon />}
						labelPopoverTitle={__(
							'Rotate Horizontally',
							'publisher-core'
						)}
						labelDescription={
							<>
								<p>
									{__(
										'Rotates the block around its X-axis.',
										'publisher-core'
									)}
								</p>
							</>
						}
						aria-label={__('Rotate-X', 'publisher-core')}
						columns="columns-2"
						unitType="angle"
						range={true}
						min={-180}
						max={180}
						onChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, 'rotate-x': newValue },
							})
						}
						defaultValue={defaultRepeaterItemValue['rotate-x']}
					/>

					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'rotate-y')}
						singularId={'rotate-y'}
						controlName="input"
						label={<RotateYCoordinateIcon />}
						labelPopoverTitle={__(
							'Rotate Vertically',
							'publisher-core'
						)}
						labelDescription={
							<>
								<p>
									{__(
										'Rotates around the Y-axis.',
										'publisher-core'
									)}
								</p>
							</>
						}
						aria-label={__('Rotate-Y', 'publisher-core')}
						columns="columns-2"
						unitType="angle"
						range={true}
						min={-180}
						max={180}
						onChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, 'rotate-y': newValue },
							})
						}
						defaultValue={defaultRepeaterItemValue['rotate-y']}
					/>

					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'rotate-z')}
						singularId={'rotate-z'}
						label={<RotateZCoordinateIcon />}
						labelPopoverTitle={__(
							'Rotate Depth Axis',
							'publisher-core'
						)}
						labelDescription={
							<>
								<p>
									{__(
										'Rotates around the Z-axis.',
										'publisher-core'
									)}
								</p>
								<p>
									{__(
										'Ideal for creating 3D effect and transformations.',
										'publisher-core'
									)}
								</p>
								<p>
									{__(
										'Requires setting the perspective property on the block or parent to enable 3D space.',
										'publisher-core'
									)}
								</p>
							</>
						}
						aria-label={__('Rotate-Z', 'publisher-core')}
						columns="columns-2"
						unitType="angle"
						range={true}
						min={-180}
						max={180}
						onChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, 'rotate-z': newValue },
							})
						}
						defaultValue={defaultRepeaterItemValue['rotate-z']}
					/>
				</>
			)}

			{item.type === 'skew' && (
				<>
					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'skew-x')}
						singularId={'skew-x'}
						label={<XCoordinateIcon />}
						labelPopoverTitle={__(
							'Skew Horizontally',
							'publisher-core'
						)}
						labelDescription={
							<>
								<p>
									{__(
										'Skews the block horizontally.',
										'publisher-core'
									)}
								</p>
								<p>
									{__(
										'Positive values skew to the right, while negative values skew to the left.',
										'publisher-core'
									)}
								</p>
							</>
						}
						aria-label={__('Skew-X', 'publisher-core')}
						columns="columns-2"
						unitType="angle"
						range={true}
						min={-60}
						max={60}
						onChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, 'skew-x': newValue },
							})
						}
						defaultValue={defaultRepeaterItemValue['skew-x']}
					/>

					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'skew-y')}
						singularId={'skew-y'}
						label={<YCoordinateIcon />}
						labelPopoverTitle={__(
							'Skew Vertically',
							'publisher-core'
						)}
						labelDescription={
							<>
								<p>
									{__(
										'Skews the block vertically.',
										'publisher-core'
									)}
								</p>
								<p>
									{__(
										'Positive values skew downwards, and negative values skew upwards.',
										'publisher-core'
									)}
								</p>
							</>
						}
						aria-label={__('Skew-Y', 'publisher-core')}
						columns="columns-2"
						unitType="angle"
						range={true}
						min={-60}
						max={60}
						onChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, 'skew-y': newValue },
							})
						}
						defaultValue={defaultRepeaterItemValue['skew-y']}
					/>
				</>
			)}
		</div>
	);
};

// $FlowFixMe
export default memo(Fields);
