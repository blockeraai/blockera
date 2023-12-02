// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { memo, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { ColorPickerControl } from '../../../index';
import type { TMeshGradientProps } from '../../types';
import { useControlContext } from '../../../../context';
import { RepeaterContext } from '../../../repeater-control/context';

type TFieldsProps = {
	itemId: number,
	item: TMeshGradientProps,
};

const Fields: TFieldsProps = memo<TFieldsProps>(
	({ itemId, item }: TFieldsProps): MixedElement => {
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
	}
);

export default Fields;
