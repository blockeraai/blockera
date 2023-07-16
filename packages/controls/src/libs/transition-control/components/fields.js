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
import { getTypeOptions, getTimingOptions } from '../utils';
import { RepeaterContext } from '../../repeater-control/context';

const Fields = ({ itemId, item }) => {
	const { changeItem } = useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<SelectField
				label={__('Type', 'publisher-core')}
				options={getTypeOptions()}
				//
				value={item.type}
				onChange={(type) => changeItem(itemId, { ...item, type })}
			/>

			<InputField
				label={__('Duration', 'publisher-core')}
				settings={{
					type: 'css',
					unitType: 'duration',
					range: true,
					min: 0,
					max: 5000,
					value: item.duration,
				}}
				//
				value={item.duration}
				onChange={(duration) =>
					changeItem(itemId, { ...item, duration })
				}
			/>

			<SelectField
				label={__('Timing', 'publisher-core')}
				options={getTimingOptions()}
				//
				value={item.timing}
				onChange={(timing) => changeItem(itemId, { ...item, timing })}
			/>

			<InputField
				label={__('Delay', 'publisher-core')}
				settings={{
					type: 'css',
					unitType: 'duration',
					range: true,
					min: 0,
					max: 5000,
					initialPosition: 0,
				}}
				//
				value={item.delay}
				onChange={(delay) => changeItem(itemId, { ...item, delay })}
			/>
		</div>
	);
};

export default memo(Fields);
