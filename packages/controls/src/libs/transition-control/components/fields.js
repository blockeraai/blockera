// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';
import type { Element } from 'react';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../../context';
import { getTypeOptions, getTimingOptions } from '../utils';
import { RepeaterContext } from '../../repeater-control/context';
import { InputControl, SelectControl } from '../../index';
import type { TFieldItem } from '../types';
import { LabelDescription } from './label-description';

const Fields: TFieldItem = memo<TFieldItem>(
	({ itemId, item }: TFieldItem): Element<any> => {
		const {
			controlInfo: { name: controlId },
			dispatch: { changeRepeaterItem },
		} = useControlContext();

		const { repeaterId, getControlId, defaultRepeaterItemValue } =
			useContext(RepeaterContext);

		return (
			<div
				id={`repeater-item-${itemId}`}
				data-test="transition-control-popover"
			>
				<SelectControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'type')}
					singularId={'type'}
					label={__('Type', 'blockera-core')}
					labelPopoverTitle={__(
						'Transition Property',
						'blockera-core'
					)}
					labelDescription={<LabelDescription />}
					columns="columns-2"
					options={getTypeOptions()}
					onChange={(type) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, type },
						})
					}
					defaultValue={defaultRepeaterItemValue.type}
				/>

				<InputControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'duration')}
					singularId={'duration'}
					label={__('Duration', 'blockera-core')}
					labelPopoverTitle={__(
						'Transition Duration',
						'blockera-core'
					)}
					labelDescription={
						<>
							<p>
								{__(
									'Transition duration specifies the length of time a transition effect takes to complete.',
									'blockera-core'
								)}
							</p>
							<p>
								{__(
									'It defines how long a block takes to transition from one state to another, such as changing size, color, or position.',
									'blockera-core'
								)}
							</p>
						</>
					}
					columns="columns-2"
					unitType="duration"
					range={true}
					min={0}
					max={5000}
					onChange={(duration) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, duration },
						})
					}
					data-test="transition-input-duration"
					defaultValue={defaultRepeaterItemValue.duration}
				/>

				<SelectControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'timing')}
					singularId={'timing'}
					label={__('Timing', 'blockera-core')}
					labelPopoverTitle={__(
						'Transition Timing Function',
						'blockera-core'
					)}
					labelDescription={
						<>
							<p>
								{__(
									'The Transition timing Function in CSS specifies the speed curve of the transition effect.',
									'blockera-core'
								)}
							</p>
							<p>
								{__(
									'It defines how the speed of the transition changes over its duration, allowing for the creation of more natural and dynamic movements.',
									'blockera-core'
								)}
							</p>
						</>
					}
					columns="columns-2"
					options={getTimingOptions()}
					onChange={(timing) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, timing },
						})
					}
					defaultValue={defaultRepeaterItemValue.timing}
				/>

				<InputControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'delay')}
					singularId={'delay'}
					label={__('Delay', 'blockera-core')}
					labelPopoverTitle={__('Transition Delay', 'blockera-core')}
					labelDescription={
						<>
							<p>
								{__(
									'Transition delay specifies the duration before the start of a transition effect.',
									'blockera-core'
								)}
							</p>
							<p>
								{__(
									'It is essential for sequencing transitions, especially when coordinating multiple blocks or creating complex interactive experiences.',
									'blockera-core'
								)}
							</p>
							<p>
								{__(
									'It allows for fine-tuning and synchronization of visual effects.',
									'blockera-core'
								)}
							</p>
						</>
					}
					columns="columns-2"
					unitType="duration"
					range={true}
					min={0}
					max={5000}
					onChange={(delay) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, delay },
						})
					}
					data-test="transition-input-delay"
					defaultValue={defaultRepeaterItemValue.delay}
				/>
			</div>
		);
	}
);

export default Fields;
