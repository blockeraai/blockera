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
 * Internal dependencies
 */
import { useControlContext } from '../../../context';
import { RepeaterContext } from '../../repeater-control/context';
import { InputControl, BorderControl } from '../../index';

const Fields = ({ itemId, item }) => {
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
					width: item.width,
					style: item.style,
					color: item.color,
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
							offset: !isInteger(offset) ? offset : `${offset}px`,
						},
					})
				}
			/>
		</div>
	);
};

export default memo(Fields);
