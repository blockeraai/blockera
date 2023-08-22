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
import { BaseControl, InputControl, BorderControl } from '../../index';

const Fields = ({ itemId, item }) => {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const { repeaterId, getControlId } = useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<BaseControl label={__('Outline', 'publisher-core')}>
				<BorderControl
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
			</BaseControl>

			<BaseControl
				controlName="input"
				label={__('Offset', 'publisher-core')}
			>
				<InputControl
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
				/>
			</BaseControl>
		</div>
	);
};

export default memo(Fields);
