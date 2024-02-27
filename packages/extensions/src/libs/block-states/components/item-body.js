// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import {
	InputControl,
	SelectControl,
	useControlContext,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import states from '../states';
import type { TStates } from '../types';
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
		controlInfo: { name: controlId, block },
		dispatch: { changeRepeaterItem },
		// eslint-disable-next-line react-hooks/rules-of-hooks
	} = useControlContext();

	return (
		<>
			<SelectControl
				id={`[${itemId}].type`}
				defaultValue={item.type}
				label={__('State', 'publisher-core')}
				labelPopoverTitle={__('Block States', 'publisher-core')}
				labelDescription={<LabelDescription />}
				columns="columns-2"
				options={Object.values(states)
					.filter((state: Object): boolean => 'normal' !== state.type)
					.map((state: Object): Object => ({
						value: state.type,
						label: state.label,
					}))}
				onChange={(newValue: TStates): void => {
					const dynamicValue = item.callback(newValue);

					let value = {
						...item,
						...dynamicValue,
						breakpoints:
							item?.breakpoints?.length > 1
								? item.breakpoints
								: item.getBreakpoints(
										newValue,
										block.attributes
								  ),
						isSelected: true,
					};

					if (['custom-class', 'parent-class'].includes(newValue)) {
						value = {
							...value,
							'css-class': '',
						};
					}

					changeRepeaterItem({
						controlId,
						itemId,
						value,
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
						})
					}
					label={__('CSS Class', 'publisher-core')}
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
