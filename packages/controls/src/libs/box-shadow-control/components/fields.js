/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { RepeaterContext } from '../../repeater-control/context';
import { ColorControl, InputControl, ToggleSelectControl } from '../../index';
import { useControlContext } from '../../../context';

const Fields = ({ itemId, item }) => {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const { repeaterId, getControlId } = useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<ToggleSelectControl
				id={getControlId(itemId, 'type')}
				label={__('Position', 'publisher-core')}
				options={[
					{
						label: __('Outer', 'publisher-core'),
						value: 'outer',
					},
					{
						label: __('Inner', 'publisher-core'),
						value: 'inner',
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

			<InputControl
				id={getControlId(itemId, 'x')}
				label={__('X', 'publisher-core')}
				type="css"
				unitType="box-shadow"
				range={true}
				min={-100}
				max={100}
				onChange={(x) =>
					changeRepeaterItem({
						controlId,
						repeaterId,
						itemId,
						value: { ...item, x },
					})
				}
			/>

			<InputControl
				id={getControlId(itemId, 'y')}
				label={__('Y', 'publisher-core')}
				type="css"
				unitType="box-shadow"
				range={true}
				min={-100}
				max={100}
				onChange={(y) =>
					changeRepeaterItem({
						controlId,
						repeaterId,
						itemId,
						value: { ...item, y },
					})
				}
			/>

			<InputControl
				id={getControlId(itemId, 'blur')}
				label={__('Blur', 'publisher-core')}
				type="css"
				unitType="box-shadow"
				range={true}
				min={0}
				max={100}
				onChange={(blur) =>
					changeRepeaterItem({
						controlId,
						repeaterId,
						itemId,
						value: { ...item, blur },
					})
				}
			/>

			<InputControl
				id={getControlId(itemId, 'spread')}
				label={__('Spread', 'publisher-core')}
				type="css"
				unitType="box-shadow"
				range={true}
				min={-100}
				max={100}
				onChange={(spread) =>
					changeRepeaterItem({
						controlId,
						repeaterId,
						itemId,
						value: { ...item, spread },
					})
				}
			/>

			<ColorControl
				id={getControlId(itemId, 'color')}
				label={__('Color', 'publisher-core')}
				onChange={(color) =>
					changeRepeaterItem({
						controlId,
						repeaterId,
						itemId,
						value: { ...item, color },
					})
				}
			/>
		</div>
	);
};

export default memo(Fields);
