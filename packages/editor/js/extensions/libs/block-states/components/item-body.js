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
	useControlContext,
} from '@blockera/controls';
import { RepeaterContext } from '@blockera/controls/js/libs/repeater-control/context';

/**
 * Internal dependencies
 */
import states from '../states';
import type { TStates } from '../types';
import { getStateInfo } from '../helpers';
import getBreakpoints from '../default-breakpoints';
import { LabelDescription } from './label-description';

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
					const dynamicValue = getStateInfo(newValue);

					let value = {
						...item,
						...dynamicValue,
						breakpoints:
							item?.breakpoints?.length > 1
								? item.breakpoints
								: getBreakpoints(newValue),
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

ItemBody.getMode = ({ type }: { type: TStates }, itemId: number): ?string => {
	if ('normal' !== type || 0 !== itemId) {
		return 'popover';
	}

	return 'nothing';
};

export default ItemBody;
