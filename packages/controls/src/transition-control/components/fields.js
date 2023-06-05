/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { InputField, SelectField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import BaseControl from '../../base';
import { getTypeOptions, getTimingOptions } from './../utils';

const Fields = ({ itemId, repeaterAttribute }) => {
	return (
		<BaseControl id={`repeater-item-${itemId}`}>
			<SelectField
				label={__('Type', 'publisher-core')}
				options={getTypeOptions()}
				//
				initValue="all"
				attribute="type"
				repeaterAttributeIndex={itemId}
				repeaterAttribute={repeaterAttribute}
			/>

			<InputField
				label={__('Duration', 'publisher-core')}
				settings={{
					type: 'css',
					unitType: 'duration',
					range: true,
					min: 0,
					max: 5000,
				}}
				//
				attribute="duration"
				repeaterAttributeIndex={itemId}
				repeaterAttribute={repeaterAttribute}
			/>

			<SelectField
				label={__('Timing', 'publisher-core')}
				options={getTimingOptions()}
				//
				initValue="all"
				attribute="timing"
				repeaterAttributeIndex={itemId}
				repeaterAttribute={repeaterAttribute}
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
				attribute="delay"
				repeaterAttributeIndex={itemId}
				repeaterAttribute={repeaterAttribute}
			/>
		</BaseControl>
	);
};

export default memo(Fields);
