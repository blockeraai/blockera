// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	InputControl,
	SelectControl,
	RepeaterContext,
	useControlContext,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { TStates, StateTypes } from '../types';
import { LabelDescription } from './label-description';
import { getStateInfo, isDefaultState } from '../helpers';

const ItemBody = ({
	item,
	itemId,
	states,
}: {
	item: Object,
	itemId: number,
	states: { [key: TStates]: StateTypes },
}): null | Element<any> => {
	if ('normal' === item.type && 0 === itemId) {
		return null;
	}

	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
		// eslint-disable-next-line react-hooks/rules-of-hooks
	} = useControlContext();

	const { onChange, valueCleanup } =
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useContext(RepeaterContext);

	// clone options
	const options = { ...states };
	delete options.normal;

	return (
		<>
			<SelectControl
				id={`[${itemId}].type`}
				defaultValue={item.type}
				label={__('State', 'blockera')}
				labelPopoverTitle={__('Block States', 'blockera')}
				labelDescription={<LabelDescription />}
				columns="columns-2"
				options={Object.values(options)
					.filter((state: Object): boolean => 'normal' !== state.type)
					.map((state: Object): Object => ({
						...state,
						value: state.type,
						label: state.label,
					}))}
				onChange={(newValue: TStates): void => {
					const dynamicValue = getStateInfo(newValue, states);

					let value = {
						...item,
						...dynamicValue,
						isSelected: true,
					};

					if (['custom-class', 'parent-class'].includes(newValue)) {
						value = {
							...value,
							'css-class': '',
						};
					}

					changeRepeaterItem({
						value,
						itemId,
						onChange,
						controlId,
						valueCleanup,
						staticType: newValue,
						getId: (): TStates => newValue,
					});
				}}
			/>

			{['custom-class', 'parent-class'].includes(item.type) && (
				<InputControl
					id={`[${itemId}].css-class`}
					type={'text'}
					columns={'columns-2'}
					defaultValue={''}
					onChange={(newValue: string): void =>
						changeRepeaterItem({
							itemId,
							controlId,
							value: {
								...item,
								'css-class': newValue,
							},
							onChange,
							valueCleanup,
						})
					}
					label={__('CSS Class', 'blockera')}
				/>
			)}
		</>
	);
};

ItemBody.getMode = ({ type }: { type: TStates }): ?string => {
	if (!isDefaultState(type)) {
		return 'popover';
	}

	return 'nothing';
};

export default ItemBody;
