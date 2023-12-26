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

		const { repeaterId, getControlId, defaultRepeaterItemValue } =
			useContext(RepeaterContext);

		return (
			<div id={`repeater-item-${itemId}`}>
				<BorderControl
					singularId={'border'}
					repeaterItem={itemId}
					label={__('Outline', 'publisher-core')}
					columns="columns-2"
					id={getControlId(itemId, 'border')}
					linesDirection="horizontal"
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
					defaultValue={defaultRepeaterItemValue.border}
				/>

				<InputControl
					singularId={'color'}
					repeaterItem={itemId}
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
					defaultValue={defaultRepeaterItemValue.offset}
					data-test="outline-offset-input"
					controlAddonTypes={['variable']}
					variableTypes={['spacing']}
				/>
			</div>
		);
	}
);

export default Fields;
