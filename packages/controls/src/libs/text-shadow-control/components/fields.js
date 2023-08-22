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
import { BaseControl, ColorControl, InputControl } from '../../index';

const Fields = ({ itemId, item }) => {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const { repeaterId, getControlId } = useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<BaseControl controlName="input" label={__('X', 'publisher-core')}>
				<InputControl
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
				/>
			</BaseControl>

			<BaseControl controlName="input" label={__('Y', 'publisher-core')}>
				<InputControl
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
				/>
			</BaseControl>

			<BaseControl
				controlName="input"
				label={__('Blur', 'publisher-core')}
			>
				<InputControl
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
				/>
			</BaseControl>

			<BaseControl
				controlName="color"
				label={__('Color', 'publisher-core')}
			>
				<ColorControl
					id={getControlId(itemId, 'color')}
					onChange={(color) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, color },
						})
					}
				/>
			</BaseControl>
		</div>
	);
};

export default memo(Fields);
