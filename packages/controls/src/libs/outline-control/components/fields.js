// @flow
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isInteger } from '@publisher/utils';

/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../../context';
import { RepeaterContext } from '../../repeater-control/context';
import { InputControl, BorderControl } from '../../index';
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
				<BorderControl
					label={__('Outline', 'publisher-core')}
					columns="columns-2"
					id={getControlId(itemId, 'border')}
					linesDirection="horizontal"
					value={{
						width: item.border.width,
						style: item.border.style,
						color: item.border.color,
					}}
					onChange={(newValue) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: {
								...item,
								border: {
									width: newValue.width,
									color: newValue.color,
									style: newValue.style,
								},
							},
						})
					}
					defaultValue={item.border}
				/>

				<InputControl
					controlName="input"
					label={__('Offset', 'publisher-core')}
					columns="columns-2"
					min={0}
					max={40}
					range={true}
					unitType="outline"
					id={getControlId(itemId, 'offset')}
					onChange={(offset) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: {
								...item,
								offset: !isInteger(offset)
									? offset
									: `${offset}px`,
							},
						})
					}
					defaultValue={item.offset}
					data-test="outline-offset-input"
				/>
			</div>
		);
	}
);

export default Fields;
