/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { InputField, ToggleSelectField } from '@publisher/fields';

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
import { default as RotateXCoordinateIcon } from '../icons/coordinate-rotate-x';
import { default as RotateYCoordinateIcon } from '../icons/coordinate-rotate-y';
import { default as RotateZCoordinateIcon } from '../icons/coordinate-rotate-z';

const Fields = ({ itemId, item }) => {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const { repeaterId, getControlId } = useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<ToggleSelectField
				id={getControlId(itemId, 'type')}
				label={__('Type', 'publisher-core')}
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
			/>

			{item.type === 'move' && (
				<>
					<InputField
						id={getControlId(itemId, 'move-x')}
						label={<XCoordinateIcon />}
						settings={{
							type: 'css',
							unitType: 'essential',
							range: true,
							min: -300,
							max: 300,
						}}
						onChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, 'move-x': newValue },
							})
						}
					/>
					<InputField
						id={getControlId(itemId, 'move-y')}
						label={<YCoordinateIcon />}
						settings={{
							type: 'css',
							unitType: 'essential',
							range: true,
							min: -300,
							max: 300,
						}}
						onChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, 'move-y': newValue },
							})
						}
					/>
					<InputField
						id={getControlId(itemId, 'move-z')}
						label={<ZCoordinateIcon />}
						settings={{
							type: 'css',
							unitType: 'essential',
							range: true,
							min: -300,
							max: 300,
						}}
						onChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, 'move-z': newValue },
							})
						}
					/>
				</>
			)}

			{item.type === 'scale' && (
				<>
					<InputField
						id={getControlId(itemId, 'scale')}
						label={__('Scale', 'publisher-core')}
						settings={{
							type: 'css',
							unitType: 'percent',
							range: true,
							min: 0,
							max: 200,
						}}
						onChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, scale: newValue },
							})
						}
					/>
				</>
			)}

			{item.type === 'rotate' && (
				<>
					<InputField
						id={getControlId(itemId, 'rotate-x')}
						label={<RotateXCoordinateIcon />}
						settings={{
							type: 'css',
							unitType: 'angle',
							range: true,
							min: -180,
							max: 180,
						}}
						onChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, 'rotate-x': newValue },
							})
						}
					/>
					<InputField
						id={getControlId(itemId, 'rotate-y')}
						label={<RotateYCoordinateIcon />}
						settings={{
							type: 'css',
							unitType: 'angle',
							range: true,
							min: -180,
							max: 180,
						}}
						onChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, 'rotate-y': newValue },
							})
						}
					/>
					<InputField
						id={getControlId(itemId, 'rotate-z')}
						label={<RotateZCoordinateIcon />}
						settings={{
							type: 'css',
							unitType: 'angle',
							range: true,
							min: -180,
							max: 180,
						}}
						onChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, 'rotate-z': newValue },
							})
						}
					/>
				</>
			)}

			{item.type === 'skew' && (
				<>
					<InputField
						id={getControlId(itemId, 'skew-x')}
						label={<XCoordinateIcon />}
						settings={{
							type: 'css',
							unitType: 'angle',
							range: true,
							min: -60,
							max: 60,
						}}
						onChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, 'skew-x': newValue },
							})
						}
					/>
					<InputField
						id={getControlId(itemId, 'skew-y')}
						label={<YCoordinateIcon />}
						settings={{
							type: 'css',
							unitType: 'angle',
							range: true,
							min: -60,
							max: 60,
						}}
						onChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, 'skew-y': newValue },
							})
						}
					/>
				</>
			)}
		</div>
	);
};

export default memo(Fields);
