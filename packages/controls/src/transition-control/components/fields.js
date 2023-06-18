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
import BaseControl from '../../base';
import { getTypeOptions, getTimingOptions } from '../utils';
import { RepeaterContext } from '../../repeater-control/context';

const Fields = ({ itemId, item }) => {
	const { changeItem } = useContext(RepeaterContext);

	return (
		<BaseControl id={`repeater-item-${itemId}`}>
			<SelectField
				label={__('Type', 'publisher-core')}
				options={getTypeOptions()}
				//
				value={item.type}
				onValueChange={(type) => changeItem(itemId, { ...item, type })}
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
				onValueChange={(duration) =>
					changeItem(itemId, { ...item, duration })
				}
			/>

			<SelectField
				label={__('Timing', 'publisher-core')}
				options={getTimingOptions()}
				//
				value={item.timing}
				onValueChange={(timing) =>
					changeItem(itemId, { ...item, timing })
				}
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
				onValueChange={(delay) =>
					changeItem(itemId, { ...item, delay })
				}
			/>
		</BaseControl>
	);
};

export default memo(Fields);
