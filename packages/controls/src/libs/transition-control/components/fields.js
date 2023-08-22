/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../../context';
import { getTypeOptions, getTimingOptions } from '../utils';
import { RepeaterContext } from '../../repeater-control/context';
import { BaseControl, InputControl, SelectControl } from '../../index';

const Fields = ({ itemId, item }) => {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const { repeaterId, getControlId } = useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<BaseControl
				controlName="select"
				label={__('Type', 'publisher-core')}
			>
				<SelectControl
					id={getControlId(itemId, 'type')}
					options={getTypeOptions()}
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

			<BaseControl
				controlName="input"
				label={__('Duration', 'publisher-core')}
			>
				<InputControl
					unitType="duration"
					range={true}
					min={0}
					max={5000}
					id={getControlId(itemId, 'duration')}
					onChange={(duration) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, duration },
						})
					}
				/>
			</BaseControl>

			<BaseControl
				controlName="select"
				label={__('Timing', 'publisher-core')}
			>
				<SelectControl
					id={getControlId(itemId, 'timing')}
					options={getTimingOptions()}
					onChange={(timing) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, timing },
						})
					}
				/>
			</BaseControl>

			<BaseControl
				controlName="input"
				label={__('Delay', 'publisher-core')}
			>
				<InputControl
					unitType="duration"
					range={true}
					min={0}
					max={5000}
					id={getControlId(itemId, 'delay')}
					onChange={(delay) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, delay },
						})
					}
					initialPosition={0}
				/>
			</BaseControl>
		</div>
	);
};

export default memo(Fields);
