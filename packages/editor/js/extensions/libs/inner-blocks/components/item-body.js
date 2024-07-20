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

const ItemBody = ({
	item,
	itemId,
	options,
	availableInnerBlocks,
}: {
	item: Object,
	itemId: number,
	options: Array<Object>,
	availableInnerBlocks: Object,
}): null | Element<any> => {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
		// eslint-disable-next-line react-hooks/rules-of-hooks
	} = useControlContext();

	const { onChange, valueCleanup } =
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useContext(RepeaterContext);

	return (
		<>
			<SelectControl
				id={`[${itemId}].type`}
				defaultValue={item.type}
				label={__('Block Type', 'blockera')}
				labelPopoverTitle={__('Block States', 'blockera')}
				// labelDescription={<LabelDescription />}
				columns="columns-2"
				options={options}
				onChange={(newValue): void => {
					changeRepeaterItem({
						controlId,
						onChange,
						valueCleanup,
						itemId,
						value: availableInnerBlocks[newValue],
						getId: () => newValue,
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

export default ItemBody;
