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
import { ColorControl, InputControl, ToggleSelectControl } from '../../index';
import { useControlContext } from '../../../context';
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
				<ToggleSelectControl
					fieldId={'type'}
					repeaterItem={itemId}
					id={getControlId(itemId, 'type')}
					label={__('Position', 'publisher-core')}
					columns="columns-2"
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
					data-test="box-shadow-type-select"
					defaultValue={defaultRepeaterItemValue.type}
				/>

				<InputControl
					fieldId={'x'}
					repeaterItem={itemId}
					id={getControlId(itemId, 'x')}
					label={__('X', 'publisher-core')}
					columns="columns-2"
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
					data-test="box-shadow-x-input"
					defaultValue={defaultRepeaterItemValue.x}
				/>

				<InputControl
					fieldId={'y'}
					repeaterItem={itemId}
					id={getControlId(itemId, 'y')}
					label={__('Y', 'publisher-core')}
					columns="columns-2"
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
					data-test="box-shadow-y-input"
					defaultValue={defaultRepeaterItemValue.y}
				/>

				<InputControl
					fieldId={'blur'}
					repeaterItem={itemId}
					id={getControlId(itemId, 'blur')}
					label={__('Blur', 'publisher-core')}
					columns="columns-2"
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
					data-test="box-shadow-blur-input"
					defaultValue={defaultRepeaterItemValue.blur}
				/>

				<InputControl
					fieldId={'spread'}
					repeaterItem={itemId}
					id={getControlId(itemId, 'spread')}
					label={__('Spread', 'publisher-core')}
					columns="columns-2"
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
					data-test="box-shadow-spread-input"
					defaultValue={defaultRepeaterItemValue.spread}
				/>

				<ColorControl
					fieldId={'color'}
					repeaterItem={itemId}
					id={getControlId(itemId, 'color')}
					label={__('Color', 'publisher-core')}
					columns="columns-2"
					onChange={(color) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, color },
						})
					}
					data-test="box-shadow-color-control"
					defaultValue={defaultRepeaterItemValue.color}
					controlAddonTypes={['variable']}
					variableTypes={['color']}
				/>
			</div>
		);
	}
);
export default Fields;
