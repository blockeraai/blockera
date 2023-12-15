// @flow
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Internal dependencies
 */
import { RepeaterContext } from '../../repeater-control/context';
import { useControlContext } from '../../../context';
import { InputControl } from '../../index';
import type { TFieldItem } from '../types';

const Fields: TFieldItem = memo<TFieldItem>(
	({ itemId, item }: TFieldItem): Element<any> => {
		const {
			controlInfo: { name: controlId },
			dispatch: { changeRepeaterItem },
		} = useControlContext();

		const { repeaterId, getControlId } = useContext(RepeaterContext);

		return (
			<div id={`repeater-item-${itemId}`}>
				<InputControl
					label={__('Name', 'publisher-core')}
					aria-label={__('CSS Property Name', 'publisher-core')}
					columns="columns-2"
					type="text"
					id={getControlId(itemId, 'name')}
					defaultValue={item?.name || ''}
					placeholder="Enter property name..."
					onChange={(newValue) => {
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: {
								...item,
								name: newValue,
							},
						});
					}}
				/>
				<InputControl
					label={__('Value', 'publisher-core')}
					aria-label={__('CSS Property Value', 'publisher-core')}
					columns="columns-2"
					id={getControlId(itemId, 'value')}
					type="text"
					defaultValue={item?.value || ''}
					placeholder="Enter property value..."
					onChange={(newValue) => {
						//setCurrentValue(newValue);
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: {
								...item,
								value: newValue,
							},
						});
					}}
				/>
			</div>
		);
	}
);

export default Fields;
