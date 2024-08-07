// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { applyFilters } from '@wordpress/hooks';
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

		const { repeaterId, getControlId, onChange, valueCleanup } =
			useContext(RepeaterContext);

		return (
			<div id={`repeater-item-${itemId}`}>
				<ColorPickerControl
					label=""
					field="empty"
					isPopover={false}
					hasClearBtn={false}
					id={getControlId(itemId, 'color')}
					onChange={(newValue) =>
						applyFilters(
							'blockera.controls.background.meshGradientColors.OnChange',
							() => {},
							{
								item,
								newValue,
								onChange,
								controlId,
								repeaterId,
								valueCleanup,
								changeRepeaterItem,
							}
						)(newValue)
					}
				/>
			</div>
		);
	}
);

export default Fields;
