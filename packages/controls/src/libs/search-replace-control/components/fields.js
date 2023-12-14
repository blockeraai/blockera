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
					label={__('Search', 'publisher-core')}
					aria-label={__('Text To Search', 'publisher-core')}
					columns="columns-2"
					type="text"
					id={getControlId(itemId, 'search')}
					defaultValue={item?.search || ''}
					placeholder="Enter search text..."
					onChange={(newValue) => {
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: {
								...item,
								search: newValue,
							},
						});
					}}
				/>
				<InputControl
					label={__('Replace', 'publisher-core')}
					aria-label={__('Replacement Text', 'publisher-core')}
					columns="columns-2"
					id={getControlId(itemId, 'value')}
					type="text"
					defaultValue={item?.replace || ''}
					placeholder="Enter replace text..."
					onChange={(newValue) => {
						//setCurrentValue(newValue);
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: {
								...item,
								replace: newValue,
							},
						});
					}}
				/>
			</div>
		);
	}
);

export default Fields;
