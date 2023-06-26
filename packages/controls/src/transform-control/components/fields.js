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
import BaseControl from '../../base';
import { RepeaterContext } from '../../repeater-control/context';
import { default as MoveIcon } from '../icons/move';
import { default as RotateIcon } from '../icons/rotate';
import { default as ScaleIcon } from '../icons/scale';
import { default as SkewIcon } from '../icons/skew';
import { default as XCoordinateIcon } from '../icons/coordinate-x';
import { default as YCoordinateIcon } from '../icons/coordinate-y';
import { default as ZCoordinateIcon } from '../icons/coordinate-z';
import { default as RotateXCoordinateIcon } from '../icons/coordinate-rotate-x';
import { default as RotateYCoordinateIcon } from '../icons/coordinate-rotate-y';
import { default as RotateZCoordinateIcon } from '../icons/coordinate-rotate-z';

const Fields = ({ itemId, item }) => {
	const { changeItem } = useContext(RepeaterContext);

	return (
		<BaseControl id={`repeater-item-${itemId}`}>
			<ToggleSelectField
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
				//
				value={item.type}
				onValueChange={(type) => changeItem(itemId, { ...item, type })}
			/>

			{item.type === 'move' && (
				<>
					<InputField
						label={<XCoordinateIcon />}
						settings={{
							type: 'css',
							unitType: 'essential',
							range: true,
							min: -300,
							max: 300,
						}}
						//
						value={item['move-x']}
						onChange={(newValue) =>
							changeItem(itemId, { ...item, 'move-x': newValue })
						}
					/>
					<InputField
						label={<YCoordinateIcon />}
						settings={{
							type: 'css',
							unitType: 'essential',
							range: true,
							min: -300,
							max: 300,
						}}
						//
						value={item['move-y']}
						onChange={(newValue) =>
							changeItem(itemId, { ...item, 'move-y': newValue })
						}
					/>
					<InputField
						label={<ZCoordinateIcon />}
						settings={{
							type: 'css',
							unitType: 'essential',
							range: true,
							min: -300,
							max: 300,
						}}
						//
						value={item['move-z']}
						onChange={(newValue) =>
							changeItem(itemId, { ...item, 'move-z': newValue })
						}
					/>
				</>
			)}

			{item.type === 'scale' && (
				<>
					<InputField
						label={__('Scale', 'publisher-core')}
						settings={{
							type: 'css',
							unitType: 'percent',
							range: true,
							min: 0,
							max: 200,
						}}
						//
						value={item.scale}
						onChange={(newValue) =>
							changeItem(itemId, { ...item, scale: newValue })
						}
					/>
				</>
			)}

			{item.type === 'rotate' && (
				<>
					<InputField
						label={<RotateXCoordinateIcon />}
						settings={{
							type: 'css',
							unitType: 'angle',
							range: true,
							min: -180,
							max: 180,
						}}
						//
						value={item['rotate-x']}
						onChange={(newValue) =>
							changeItem(itemId, {
								...item,
								'rotate-x': newValue,
							})
						}
					/>
					<InputField
						label={<RotateYCoordinateIcon />}
						settings={{
							type: 'css',
							unitType: 'angle',
							range: true,
							min: -180,
							max: 180,
						}}
						//
						value={item['rotate-y']}
						onChange={(newValue) =>
							changeItem(itemId, {
								...item,
								'rotate-y': newValue,
							})
						}
					/>
					<InputField
						label={<RotateZCoordinateIcon />}
						settings={{
							type: 'css',
							unitType: 'angle',
							range: true,
							min: -180,
							max: 180,
						}}
						//
						value={item['rotate-z']}
						onChange={(newValue) =>
							changeItem(itemId, {
								...item,
								'rotate-z': newValue,
							})
						}
					/>
				</>
			)}

			{item.type === 'skew' && (
				<>
					<InputField
						label={<XCoordinateIcon />}
						settings={{
							type: 'css',
							unitType: 'angle',
							range: true,
							min: -60,
							max: 60,
						}}
						//
						value={item['skew-x']}
						onChange={(newValue) =>
							changeItem(itemId, {
								...item,
								'skew-x': newValue,
							})
						}
					/>
					<InputField
						label={<YCoordinateIcon />}
						settings={{
							type: 'css',
							unitType: 'angle',
							range: true,
							min: -60,
							max: 60,
						}}
						//
						value={item['skew-y']}
						onChange={(newValue) =>
							changeItem(itemId, {
								...item,
								'skew-y': newValue,
							})
						}
					/>
				</>
			)}
		</BaseControl>
	);
};

export default memo(Fields);
