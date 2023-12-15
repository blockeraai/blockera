/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../../context';
import { RepeaterContext } from '../../repeater-control/context';
import { ColorControl, InputControl } from '../../index';

const Fields = ({ itemId, item }) => {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const { repeaterId, getControlId } = useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<InputControl
				controlName="input"
				label={__('X', 'publisher-core')}
				columns="columns-2"
				id={getControlId(itemId, 'x')}
				unitType="text-shadow"
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
				aria-label={__('Vertical Distance', 'publisher-core')}
			/>

			<InputControl
				controlName="input"
				label={__('Y', 'publisher-core')}
				columns="columns-2"
				id={getControlId(itemId, 'y')}
				unitType="text-shadow"
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
				aria-label={__('Horizontal Distance', 'publisher-core')}
			/>

			<InputControl
				controlName="input"
				label={__('Blur', 'publisher-core')}
				columns="columns-2"
				id={getControlId(itemId, 'blur')}
				unitType="text-shadow"
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
				aria-label={__('Blur Effect', 'publisher-core')}
			/>

			<ColorControl
				controlName="color"
				label={__('Color', 'publisher-core')}
				columns="columns-2"
				id={getControlId(itemId, 'color')}
				onChange={(color) =>
					changeRepeaterItem({
						controlId,
						repeaterId,
						itemId,
						value: { ...item, color },
					})
				}
				aria-label={__('Shadow Color', 'publisher-core')}
				controlAddonTypes={['variable']}
				variableTypes={['theme-color']}
			/>
		</div>
	);
};

export default memo(Fields);
