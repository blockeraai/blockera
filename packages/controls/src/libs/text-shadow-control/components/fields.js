/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { InputField, ColorField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { RepeaterContext } from '../../repeater-control/context';
import { useControlContext } from '../../../context';

const Fields = ({ itemId, item }) => {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const { repeaterId, getControlId } = useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<InputField
				id={getControlId(itemId, 'x')}
				label={__('X', 'publisher-core')}
				settings={{
					type: 'css',
					unitType: 'text-shadow',
					range: true,
					min: -100,
					max: 100,
				}}
				onChange={(x) =>
					changeRepeaterItem({
						controlId,
						repeaterId,
						itemId,
						value: { ...item, x },
					})
				}
			/>

			<InputField
				id={getControlId(itemId, 'y')}
				label={__('Y', 'publisher-core')}
				settings={{
					type: 'css',
					unitType: 'text-shadow',
					range: true,
					min: -100,
					max: 100,
				}}
				onChange={(y) =>
					changeRepeaterItem({
						controlId,
						repeaterId,
						itemId,
						value: { ...item, y },
					})
				}
			/>

			<InputField
				id={getControlId(itemId, 'blur')}
				label={__('Blur', 'publisher-core')}
				settings={{
					type: 'css',
					unitType: 'text-shadow',
					range: true,
					min: 0,
					max: 100,
				}}
				onChange={(blur) =>
					changeRepeaterItem({
						controlId,
						repeaterId,
						itemId,
						value: { ...item, blur },
					})
				}
			/>

			<ColorField
				id={getControlId(itemId, 'color')}
				label={__('Color', 'publisher-core')}
				onChange={(color) =>
					changeRepeaterItem({
						controlId,
						repeaterId,
						itemId,
						value: { ...item, color },
					})
				}
			/>
		</div>
	);
};

export default memo(Fields);
