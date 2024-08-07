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

		const {
			onChange,
			valueCleanup,
			repeaterId,
			getControlId,
			defaultRepeaterItemValue,
			customProps: {
				getTransitionTypeOptions,
				getTransitionTimingOptions,
			},
		} = useContext(RepeaterContext);

		return (
			<div
				id={`repeater-item-${itemId}`}
				data-test="transition-control-popover"
			>
				<SelectControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'type')}
					singularId={'type'}
					label={__('Type', 'blockera')}
					labelPopoverTitle={__('Transition Property', 'blockera')}
					labelDescription={<LabelDescription />}
					columns="columns-2"
					options={getTransitionTypeOptions()}
					onChange={(type, ref) =>
						changeRepeaterItem({
							ref,
							controlId,
							repeaterId,
							itemId,
							onChange,
							valueCleanup,
							value: { ...item, type },
						})
					}
					defaultValue={defaultRepeaterItemValue.type}
				/>

				<InputControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'duration')}
					singularId={'duration'}
					label={__('Duration', 'blockera')}
					labelPopoverTitle={__('Transition Duration', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'Transition duration specifies the length of time a transition effect takes to complete.',
									'blockera'
								)}
							</p>
							<p>
								{__(
									'It defines how long a block takes to transition from one state to another, such as changing size, color, or position.',
									'blockera'
								)}
							</p>
						</>
					}
					columns="columns-2"
					unitType="duration"
					range={true}
					min={0}
					max={5000}
					onChange={(duration, ref) =>
						changeRepeaterItem({
							ref,
							controlId,
							repeaterId,
							itemId,
							onChange,
							valueCleanup,
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
					label={__('Timing', 'blockera')}
					labelPopoverTitle={__(
						'Transition Timing Function',
						'blockera'
					)}
					labelDescription={
						<>
							<p>
								{__(
									'The Transition timing Function in CSS specifies the speed curve of the transition effect.',
									'blockera'
								)}
							</p>
							<p>
								{__(
									'It defines how the speed of the transition changes over its duration, allowing for the creation of more natural and dynamic movements.',
									'blockera'
								)}
							</p>
						</>
					}
					columns="columns-2"
					options={getTransitionTimingOptions()}
					onChange={(timing, ref) =>
						changeRepeaterItem({
							ref,
							controlId,
							repeaterId,
							itemId,
							onChange,
							valueCleanup,
							value: { ...item, timing },
						})
					}
					defaultValue={defaultRepeaterItemValue.timing}
				/>

				<InputControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'delay')}
					singularId={'delay'}
					label={__('Delay', 'blockera')}
					labelPopoverTitle={__('Transition Delay', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'Transition delay specifies the duration before the start of a transition effect.',
									'blockera'
								)}
							</p>
							<p>
								{__(
									'It is essential for sequencing transitions, especially when coordinating multiple blocks or creating complex interactive experiences.',
									'blockera'
								)}
							</p>
							<p>
								{__(
									'It allows for fine-tuning and synchronization of visual effects.',
									'blockera'
								)}
							</p>
						</>
					}
					columns="columns-2"
					unitType="duration"
					range={true}
					min={0}
					max={5000}
					onChange={(delay, ref) =>
						changeRepeaterItem({
							ref,
							controlId,
							repeaterId,
							itemId,
							onChange,
							valueCleanup,
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
