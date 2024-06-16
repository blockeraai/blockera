// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../../context';
import { RepeaterContext } from '../../repeater-control/context';
import { InputControl, ToggleSelectControl } from '../../index';
import type { TransformControlRepeaterItemValue } from '../types';
import { LabelDescription } from './label-description';

const Fields = ({
	itemId,
	item,
}: {
	itemId: number,
	item: TransformControlRepeaterItemValue,
}) => {
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
	} = useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<ToggleSelectControl
				repeaterItem={itemId}
				id={getControlId(itemId, 'type')}
				singularId={'type'}
				label={__('Type', 'blockera')}
				labelPopoverTitle={__('Transform Type', 'blockera')}
				labelDescription={<LabelDescription />}
				columns="columns-2"
				options={[
					{
						label: __('Move', 'blockera'),
						value: 'move',
						icon: <Icon icon="transform-move" />,
					},
					{
						label: __('Scale', 'blockera'),
						value: 'scale',
						icon: <Icon icon="transform-scale" />,
					},
					{
						label: __('Rotate', 'blockera'),
						value: 'rotate',
						icon: <Icon icon="transform-rotate" />,
					},
					{
						label: __('Skew', 'blockera'),
						value: 'skew',
						icon: <Icon icon="transform-skew" />,
					},
				]}
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

			{item.type === 'move' && (
				<>
					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'move-x')}
						singularId={'move-x'}
						label={<Icon icon="coordinate-x" />}
						labelPopoverTitle={__('Move Horizontally', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'It moves the block horizontally (right/left).',
										'blockera'
									)}
								</p>
							</>
						}
						aria-label={__('Move-X', 'blockera')}
						columns="columns-2"
						unitType="essential"
						range={true}
						min={-300}
						max={300}
						onChange={(newValue, ref) =>
							changeRepeaterItem({
								ref,
								controlId,
								repeaterId,
								itemId,
								onChange,
								valueCleanup,
								value: { ...item, 'move-x': newValue },
							})
						}
						defaultValue={defaultRepeaterItemValue['move-x']}
					/>

					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'move-y')}
						singularId={'move-y'}
						label={<Icon icon="coordinate-y" />}
						labelPopoverTitle={__('Move Vertically', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'It moves the block horizontally (up/down).',
										'blockera'
									)}
								</p>
							</>
						}
						aria-label={__('Move-Y', 'blockera')}
						columns="columns-2"
						unitType="essential"
						range={true}
						min={-300}
						max={300}
						onChange={(newValue, ref) =>
							changeRepeaterItem({
								ref,
								controlId,
								repeaterId,
								itemId,
								onChange,
								valueCleanup,
								value: { ...item, 'move-y': newValue },
							})
						}
						defaultValue={defaultRepeaterItemValue['move-y']}
					/>

					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'move-z')}
						singularId={'move-z'}
						label={<Icon icon="coordinate-z" />}
						labelPopoverTitle={__('Move Depth Axis', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'It moves it along the depth axis (towards/away from the viewer).',
										'blockera'
									)}
								</p>
								<p>
									{__(
										'Ideal for creating depth effects like parallax scrolling, pop-out animations, and 3D transformations.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										'Requires setting the perspective property on the block or parent to enable 3D space.',
										'blockera'
									)}
								</p>
							</>
						}
						aria-label={__('Move-Z', 'blockera')}
						columns="columns-2"
						unitType="essential"
						range={true}
						min={-300}
						max={300}
						onChange={(newValue, ref) =>
							changeRepeaterItem({
								ref,
								controlId,
								repeaterId,
								itemId,
								onChange,
								valueCleanup,
								value: { ...item, 'move-z': newValue },
							})
						}
						defaultValue={defaultRepeaterItemValue['move-z']}
					/>
				</>
			)}

			{item.type === 'scale' && (
				<>
					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'scale')}
						singularId={'scale'}
						label={__('Scale', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'It changes the size of the block.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										"It's used in animations for emphasis, hover effects, and creating visual interest.",
										'blockera'
									)}
								</p>
							</>
						}
						columns="columns-2"
						unitType="percent"
						range={true}
						min={0}
						max={200}
						onChange={(newValue, ref) =>
							changeRepeaterItem({
								ref,
								controlId,
								repeaterId,
								itemId,
								onChange,
								valueCleanup,
								value: { ...item, scale: newValue },
							})
						}
						defaultValue={defaultRepeaterItemValue.scale}
					/>
				</>
			)}

			{item.type === 'rotate' && (
				<>
					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'rotate-x')}
						singularId={'rotate-x'}
						label={<Icon icon="coordinate-rotate-x" />}
						labelPopoverTitle={__(
							'Rotate Horizontally',
							'blockera'
						)}
						labelDescription={
							<>
								<p>
									{__(
										'Rotates the block around its X-axis.',
										'blockera'
									)}
								</p>
							</>
						}
						aria-label={__('Rotate-X', 'blockera')}
						columns="columns-2"
						unitType="angle"
						range={true}
						min={-180}
						max={180}
						onChange={(newValue, ref) =>
							changeRepeaterItem({
								ref,
								controlId,
								repeaterId,
								itemId,
								onChange,
								valueCleanup,
								value: { ...item, 'rotate-x': newValue },
							})
						}
						defaultValue={defaultRepeaterItemValue['rotate-x']}
					/>

					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'rotate-y')}
						singularId={'rotate-y'}
						controlName="input"
						label={<Icon icon="coordinate-rotate-y" />}
						labelPopoverTitle={__('Rotate Vertically', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'Rotates around the Y-axis.',
										'blockera'
									)}
								</p>
							</>
						}
						aria-label={__('Rotate-Y', 'blockera')}
						columns="columns-2"
						unitType="angle"
						range={true}
						min={-180}
						max={180}
						onChange={(newValue, ref) =>
							changeRepeaterItem({
								ref,
								controlId,
								repeaterId,
								itemId,
								onChange,
								valueCleanup,
								value: { ...item, 'rotate-y': newValue },
							})
						}
						defaultValue={defaultRepeaterItemValue['rotate-y']}
					/>

					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'rotate-z')}
						singularId={'rotate-z'}
						label={<Icon icon="coordinate-rotate-z" />}
						labelPopoverTitle={__('Rotate Depth Axis', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'Rotates around the Z-axis.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										'Ideal for creating 3D effect and transformations.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										'Requires setting the perspective property on the block or parent to enable 3D space.',
										'blockera'
									)}
								</p>
							</>
						}
						aria-label={__('Rotate-Z', 'blockera')}
						columns="columns-2"
						unitType="angle"
						range={true}
						min={-180}
						max={180}
						onChange={(newValue, ref) =>
							changeRepeaterItem({
								ref,
								controlId,
								repeaterId,
								itemId,
								onChange,
								valueCleanup,
								value: { ...item, 'rotate-z': newValue },
							})
						}
						defaultValue={defaultRepeaterItemValue['rotate-z']}
					/>
				</>
			)}

			{item.type === 'skew' && (
				<>
					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'skew-x')}
						singularId={'skew-x'}
						label={<Icon icon="coordinate-x" />}
						labelPopoverTitle={__('Skew Horizontally', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'Skews the block horizontally.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										'Positive values skew to the right, while negative values skew to the left.',
										'blockera'
									)}
								</p>
							</>
						}
						aria-label={__('Skew-X', 'blockera')}
						columns="columns-2"
						unitType="angle"
						range={true}
						min={-60}
						max={60}
						onChange={(newValue, ref) =>
							changeRepeaterItem({
								ref,
								controlId,
								repeaterId,
								itemId,
								onChange,
								valueCleanup,
								value: { ...item, 'skew-x': newValue },
							})
						}
						defaultValue={defaultRepeaterItemValue['skew-x']}
					/>

					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'skew-y')}
						singularId={'skew-y'}
						label={<Icon icon="coordinate-y" />}
						labelPopoverTitle={__('Skew Vertically', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'Skews the block vertically.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										'Positive values skew downwards, and negative values skew upwards.',
										'blockera'
									)}
								</p>
							</>
						}
						aria-label={__('Skew-Y', 'blockera')}
						columns="columns-2"
						unitType="angle"
						range={true}
						min={-60}
						max={60}
						onChange={(newValue, ref) =>
							changeRepeaterItem({
								ref,
								controlId,
								repeaterId,
								itemId,
								onChange,
								valueCleanup,
								value: { ...item, 'skew-y': newValue },
							})
						}
						defaultValue={defaultRepeaterItemValue['skew-y']}
					/>
				</>
			)}
		</div>
	);
};

// $FlowFixMe
export default memo(Fields);
