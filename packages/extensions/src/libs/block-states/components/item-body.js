// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { SelectControl, useControlContext } from '@publisher/controls';

/**
 * Internal dependencies
 */
import states from '../states';
import type { TStates } from '../types';

const ItemBody = ({
	item,
	itemId,
}: {
	item: Object,
	itemId: number,
}): null | Element<any> => {
	if ('normal' === item.type && 0 === itemId) {
		return null;
	}

	const {
		controlInfo: { name: controlId, block },
		dispatch: { changeRepeaterItem },
		// eslint-disable-next-line react-hooks/rules-of-hooks
	} = useControlContext();

	return (
		<SelectControl
			id={`[${itemId}].type`}
			defaultValue={item.type}
			label={__('State Type', 'publisher-core')}
			options={Object.values(states)?.map((state) => ({
				value: state.type,
				label: state.label,
			}))}
			onChange={(newValue) => {
				const dynamicValue = item.callback(newValue);

				changeRepeaterItem({
					controlId,
					itemId,
					value: {
						...item,
						...dynamicValue,
						breakpoints:
							item?.breakpoints?.length > 1
								? item.breakpoints
								: item.getBreakpoints(
										newValue,
										block.attributes
								  ),
					},
				});
			}}
		/>
	);
};

ItemBody.getMode = ({ type }: { type: TStates }, itemId: number): ?string => {
	if ('normal' !== type || 0 !== itemId) {
		return 'popover';
	}

	return 'nothing';
};

export default ItemBody;
