/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isInteger } from '@publisher/utils';
import { InputField, Field } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { BorderControl } from '../../index';
import { useControlContext } from '../../../context';
import { RepeaterContext } from '../../repeater-control/context';

const Fields = ({ itemId, item }) => {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const { repeaterId, getControlId } = useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<Field label={__('Outline', 'publisher-core')}>
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
			</Field>

			<InputField
				label={__('Offset', 'publisher-core')}
				settings={{
					type: 'css',
					unitType: 'outline',
					range: true,
					min: 0,
					max: 40,
				}}
				//
				value={item.offset}
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
