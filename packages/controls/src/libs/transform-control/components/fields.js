/**
 * WordPress dependencies
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
import { BaseControl, InputControl, ToggleSelectControl } from '../../index';
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
			<BaseControl
				controlName="toggle-select"
				label={__('Type', 'publisher-core')}
			>
				<ToggleSelectControl
					id={getControlId(itemId, 'type')}
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
			</BaseControl>

			{item.type === 'move' && (
				<>
					<BaseControl
						controlName="input"
						label={<XCoordinateIcon />}
					>
						<InputControl
							id={getControlId(itemId, 'move-x')}
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
						/>
					</BaseControl>
					<BaseControl
						controlName="input"
						label={<YCoordinateIcon />}
					>
						<InputControl
							id={getControlId(itemId, 'move-y')}
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
						/>
					</BaseControl>
					<BaseControl
						controlName="input"
						label={<ZCoordinateIcon />}
					>
						<InputControl
							id={getControlId(itemId, 'move-z')}
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
						/>
					</BaseControl>
				</>
			)}

			{item.type === 'scale' && (
				<>
					<BaseControl
						controlName="input"
						label={__('Scale', 'publisher-core')}
					>
						<InputControl
							id={getControlId(itemId, 'scale')}
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
						/>
					</BaseControl>
				</>
			)}

			{item.type === 'rotate' && (
				<>
					<BaseControl
						controlName="input"
						label={<RotateXCoordinateIcon />}
					>
						<InputControl
							id={getControlId(itemId, 'rotate-x')}
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
						/>
					</BaseControl>
					<BaseControl
						controlName="input"
						label={<RotateYCoordinateIcon />}
					>
						<InputControl
							id={getControlId(itemId, 'rotate-y')}
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
						/>
					</BaseControl>
					<BaseControl
						controlName="input"
						label={<RotateZCoordinateIcon />}
					>
						<InputControl
							id={getControlId(itemId, 'rotate-z')}
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
						/>
					</BaseControl>
				</>
			)}

			{item.type === 'skew' && (
				<>
					<BaseControl
						controlName="input"
						label={<XCoordinateIcon />}
					>
						<InputControl
							id={getControlId(itemId, 'skew-x')}
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
						/>
					</BaseControl>
					<BaseControl
						controlName="input"
						label={<YCoordinateIcon />}
					>
						<InputControl
							id={getControlId(itemId, 'skew-y')}
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
						/>
					</BaseControl>
				</>
			)}
		</div>
	);
};

export default memo(Fields);
