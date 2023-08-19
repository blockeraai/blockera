/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { InputField, SelectField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../../context';
import { getTypeOptions, getTimingOptions } from '../utils';
import { RepeaterContext } from '../../repeater-control/context';

const Fields = ({ itemId, item }) => {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const { repeaterId, getControlId } = useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<SelectField
				id={getControlId(itemId, 'type')}
				label={__('Type', 'publisher-core')}
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

			<InputField
				id={getControlId(itemId, 'duration')}
				label={__('Duration', 'publisher-core')}
				settings={{
					type: 'css',
					unitType: 'duration',
					range: true,
					min: 0,
					max: 5000,
					value: item.duration,
				}}
				onChange={(duration) =>
					changeRepeaterItem({
						controlId,
						repeaterId,
						itemId,
						value: { ...item, duration },
					})
				}
			/>

			<SelectField
				id={getControlId(itemId, 'timing')}
				label={__('Timing', 'publisher-core')}
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

			<InputField
				id={getControlId(itemId, 'delay')}
				label={__('Delay', 'publisher-core')}
				settings={{
					type: 'css',
					unitType: 'duration',
					range: true,
					min: 0,
					max: 5000,
					initialPosition: 0,
				}}
				onChange={(delay) =>
					changeRepeaterItem({
						controlId,
						repeaterId,
						itemId,
						value: { ...item, delay },
					})
				}
			/>
		</div>
	);
};

export default memo(Fields);
