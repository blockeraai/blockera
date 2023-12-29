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

		const { repeaterId, getControlId } = useContext(RepeaterContext);

		return (
			<div
				id={`repeater-item-${itemId}`}
				data-test="transition-control-popover"
			>
				<SelectControl
					controlName="select"
					label={__('Property', 'publisher-core')}
					labelPopoverTitle={__(
						'Transition Property',
						'publisher-core'
					)}
					labelDescription={<LabelDescription />}
					columns="columns-2"
					id={getControlId(itemId, 'type')}
					options={getTypeOptions()}
					onChange={(type) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, type },
						})
					}
					defaultValue={item.type}
				/>

				<InputControl
					controlName="input"
					label={__('Duration', 'publisher-core')}
					labelPopoverTitle={__(
						'Transition Duration',
						'publisher-core'
					)}
					labelDescription={
						<>
							<p>
								{__(
									'Transition duration specifies the length of time a transition effect takes to complete.',
									'publisher-core'
								)}
							</p>
							<p>
								{__(
									'It defines how long a block takes to transition from one state to another, such as changing size, color, or position.',
									'publisher-core'
								)}
							</p>
						</>
					}
					columns="columns-2"
					unitType="duration"
					range={true}
					min={0}
					max={5000}
					id={getControlId(itemId, 'duration')}
					onChange={(duration) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, duration },
						})
					}
					data-test="transition-input-duration"
					defaultValue={item.duration}
				/>

				<SelectControl
					controlName="select"
					label={__('Timing', 'publisher-core')}
					labelPopoverTitle={__(
						'Transition Timing Function',
						'publisher-core'
					)}
					labelDescription={
						<>
							<p>
								{__(
									'The Transition timing Function in CSS specifies the speed curve of the transition effect.',
									'publisher-core'
								)}
							</p>
							<p>
								{__(
									'It defines how the speed of the transition changes over its duration, allowing for the creation of more natural and dynamic movements.',
									'publisher-core'
								)}
							</p>
						</>
					}
					columns="columns-2"
					id={getControlId(itemId, 'timing')}
					options={getTimingOptions()}
					onChange={(timing) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, timing },
						})
					}
					defaultValue={item.timing}
				/>

				<InputControl
					controlName="input"
					label={__('Delay', 'publisher-core')}
					labelPopoverTitle={__('Transition Delay', 'publisher-core')}
					labelDescription={
						<>
							<p>
								{__(
									'Transition delay specifies the duration before the start of a transition effect.',
									'publisher-core'
								)}
							</p>
							<p>
								{__(
									'It is essential for sequencing transitions, especially when coordinating multiple blocks or creating complex interactive experiences.',
									'publisher-core'
								)}
							</p>
							<p>
								{__(
									'It allows for fine-tuning and synchronization of visual effects.',
									'publisher-core'
								)}
							</p>
						</>
					}
					columns="columns-2"
					unitType="duration"
					range={true}
					min={0}
					max={5000}
					id={getControlId(itemId, 'delay')}
					onChange={(delay) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, delay },
						})
					}
					data-test="transition-input-delay"
					defaultValue={item.delay}
				/>
			</div>
		);
	}
);

export default Fields;
