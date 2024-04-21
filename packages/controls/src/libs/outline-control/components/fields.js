// @flow
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isInteger } from '@blockera/utils';

/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../../context';
import { RepeaterContext } from '../../repeater-control/context';
import { InputControl, BorderControl } from '../../index';
import type { TFieldItem } from '../types';

const Fields: TFieldItem = memo<TFieldItem>(
	({ itemId, item }: TFieldItem): Element<any> => {
		const {
			controlInfo: { name: controlId },
			dispatch: { changeRepeaterItem },
		} = useControlContext();

		const { repeaterId, getControlId, defaultRepeaterItemValue } =
			useContext(RepeaterContext);

		return (
			<div id={`repeater-item-${itemId}`}>
				<BorderControl
					singularId={'border'}
					repeaterItem={itemId}
					label={__('Border', 'blockera-core')}
					labelPopoverTitle={__('Outline Border', 'blockera-core')}
					labelDescription={
						<>
							<p>
								{__(
									'Add distinct borders to elements without affecting layout, enhancing visual hierarchy and focus.',
									'blockera-core'
								)}
							</p>
							<p>
								{__(
									'Useful for highlighting elements without space adjustments, unlike borders. Perfect for focus states and accessibility.',
									'blockera-core'
								)}
							</p>
						</>
					}
					columns="columns-2"
					id={getControlId(itemId, 'border')}
					linesDirection="horizontal"
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
					defaultValue={defaultRepeaterItemValue.border}
				/>

				<InputControl
					id={getControlId(itemId, 'offset')}
					singularId={'offset'}
					repeaterItem={itemId}
					controlName="input"
					label={__('Offset', 'blockera-core')}
					labelPopoverTitle={__('Outline Offset', 'blockera-core')}
					labelDescription={
						<>
							<p>
								{__(
									'Control the distance between a block and its outline, offering precision in visual design.',
									'blockera-core'
								)}
							</p>
						</>
					}
					columns="columns-2"
					min={0}
					max={40}
					range={true}
					unitType="outline"
					onChange={(offset) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: {
								...item,
								offset: !isInteger(offset)
									? offset
									: `${offset}px`,
							},
						})
					}
					defaultValue={defaultRepeaterItemValue.offset}
					data-test="outline-offset-input"
					controlAddonTypes={['variable']}
					variableTypes={['spacing']}
				/>
			</div>
		);
	}
);

export default Fields;
