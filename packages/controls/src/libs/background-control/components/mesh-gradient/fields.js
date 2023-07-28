/**
 * WordPress dependencies
 */
import { memo, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { RepeaterContext } from '../../../repeater-control/context';
import { ColorPickerControl } from '../../../index';
import { useControlContext } from '../../../../context';

const Fields = ({ itemId, item }) => {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const { repeaterId, getControlId } = useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<ColorPickerControl
				label=""
				field="empty"
				isPopover={false}
				id={getControlId(itemId, 'color')}
				onChange={(newValue) => {
					changeRepeaterItem({
						controlId,
						value: {
							...item,
							color: newValue,
						},
						repeaterId: `${repeaterId}[${itemId}]`,
					});
				}}
			/>
		</div>
	);
};

export default memo(Fields);
